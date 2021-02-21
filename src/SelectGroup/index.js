import React, { useState, useEffect } from 'react'
import {Alert, Avatar, Footer, Group, Panel, PanelHeader, PanelHeaderBack, Search, SimpleCell, Snackbar} from "@vkontakte/vkui";
import { Icon28CancelCircleFillRed } from '@vkontakte/icons'
import '@vkontakte/vkui/dist/vkui.css'

import bridge from '@vkontakte/vk-bridge'
import config from '../config.json'
import {getRandomString} from "@vkontakte/vkjs";
import qs from 'qs'
import { addGroup } from '../api'

function SelectGroup(props) {
    const [groups, setGroups] = useState([])
    const [search, setSearch] = useState('')
    const [accessToken, setAccessToken] = useState(undefined)

    const filter = () => {
        return groups.filter(({name}) => name.toLowerCase().indexOf(search.toLowerCase()) > -1)
    }

    useEffect(() => {
        props.setLoading(true)
        let userId = qs.parse(window.location.search, { ignoreQueryPrefix: true }).vk_user_id
        bridge.send('VKWebAppGetAuthToken', { 'app_id': config.appId, 'scope': 'groups'}).then(r => {
            setAccessToken(r.access_token)
            if(r.hasOwnProperty('access_token')){
                bridge.send('VKWebAppCallAPIMethod', {
                    'method': 'groups.get',
                    'request_id': getRandomString(),
                    'params': {
                        'user_ids': userId,
                        'v': '5.126',
                        'access_token': r.access_token,
                        'extended': 1,
                        'filter': 'admin'
                    }
                }).then(r => {
                    setGroups(r.response.items)
                })
                props.setLoading(false)
            }else{
                props.setLoading(false)
            }
        })
    }, [])

    const itemClick = (groupId, groupName, photo) => {
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
                            bridge.send('VKWebAppGetCommunityToken', {
                                'app_id': config.appId,
                                'group_id': groupId,
                                'scope': 'messages, manage, photos',
                                'v': '5.126',
                                'access_token': accessToken
                            }).then(r => {
                                addGroup(window.location.search, groupId, groupName, photo, r.access_token).then(r => {
                                    if(r.success && r.hasOwnProperty('groups')){
                                        props.setGroups(r.groups)
                                        props.setLoading(false)
                                        props.setActivePanel('groupList')
                                        props.setSnackbar(
                                            <Snackbar
                                                onClose={() => props.setSnackbar(undefined)}
                                                before={ <Avatar src={photo} /> }
                                            >
                                                {groupName} добавлено в список рассылки
                                            </Snackbar>
                                        )
                                    }else {
                                        if(r.message === 'Already exists') {
                                            props.setLoading(false)
                                            props.setActivePanel('groupList')
                                            props.setSnackbar(
                                                <Snackbar
                                                    onClose={() => props.setSnackbar(undefined)}
                                                    before={ <Icon28CancelCircleFillRed /> }
                                                >
                                                    {groupName} уже есть в рассылке
                                                </Snackbar>
                                            )
                                        }
                                    }
                                })
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    }
                ]}
                actionsLayout={'horizontal'}
                onClose={() => props.setPopout(undefined)}
                header={'Выбор группы'}
                text={'Вы уверены, что хотите добавить ' + groupName + ' в рассылку?'}
            />
        )
    }

    return (
        <Panel id={props.id}>
            <PanelHeader left={ <PanelHeaderBack onClick={() => props.setActivePanel('groupList')} /> } >Выберите группу</PanelHeader>
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

export default SelectGroup