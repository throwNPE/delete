import React, { useState, useEffect } from 'react'
import {Alert, Avatar, Footer, Group, Panel, PanelHeader, PanelHeaderBack, Search, SimpleCell, Snackbar} from "@vkontakte/vkui";
import { Icon28CancelCircleFillRed } from '@vkontakte/icons'
import '@vkontakte/vkui/dist/vkui.css'

import bridge from '@vkontakte/vk-bridge'
import config from '../config.json'
import {getRandomString} from "@vkontakte/vkjs";
import { addGroup } from '../api'

function SelectFriend(props) {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [accessToken, setAccessToken] = useState(undefined)

    const filter = () => {
        return users.filter(({name}) => name.toLowerCase().indexOf(search.toLowerCase()) > -1)
    }

    useEffect(() => {
        props.setLoading(true)
        bridge.send('VKWebAppGetAuthToken', { 'app_id': config.appId, 'scope': 'friends'}).then(r => {
            setAccessToken(r.access_token)
            if(r.hasOwnProperty('access_token')){
                bridge.send('VKWebAppCallAPIMethod', {
                    'method': 'friends.get',
                    'request_id': getRandomString(),
                    'params': {
                        'v': '5.126',
                        'access_token': r.access_token,
                        'fields':'photo_50'
                    }
                }).then(r => {
                    let buffer = []
                    r.response.items.forEach(item => {
                        buffer.push({
                            id: item.id,
                            name: item.first_name + ' ' + item.last_name,
                            photo_50: item.photo_50
                        })
                    })
                    setUsers(buffer)
                    props.setLoading(false)
                })
            }
        })
    }, [])

    const itemClick = (id, name, photo) => {
        props.setPopout(
            <Alert
                actions={[
                    {
                        title: 'Отмена',
                        autoclose: true,
                        mode: 'cancel'
                    },
                    {
                        title: 'Добавить',
                        autoclose: true,
                        mode: 'destructive',
                        action: () => {
                            props.setLoading(true)
                            if(!global.selectedFriends) global.selectedFriends = []
                            global.selectedFriends.push({
                                userId: id, name, photo
                            })
                            props.setLoading(false)
                            props.setActivePanel('editAdmins')
                        }
                    }
                ]}
                actionsLayout={'horizontal'}
                onClose={() => props.setPopout(undefined)}
                header={'Выбор друга'}
                text={'Вы уверены, что хотите добавить ' + name + ' в список админов?'}
            />
        )
    }

    return (
        <Panel id={props.id}>
            <PanelHeader left={ <PanelHeaderBack onClick={() => props.setActivePanel('editAdmins')} /> } >Выберите друга</PanelHeader>
            <Group>
                <Search value={search} onChange={(e) => setSearch(e.target.value)} after={null} />
                {filter().length > 0 && filter().map((item, index) => (
                    <SimpleCell
                        before={<Avatar src={item.photo_50}/>}
                        key={index}
                        onClick={() => itemClick(item.id, item.name, item.photo_50)}
                    >{item.name}</SimpleCell>
                ))}
                {filter().length === 0 && <Footer>Ничего не найдено</Footer>}
            </Group>
        </Panel>
    )
}

export default SelectFriend