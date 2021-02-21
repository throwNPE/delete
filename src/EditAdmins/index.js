import React, { useState, useEffect } from 'react'
import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Header,
    SimpleCell,
    Div,
    Avatar,
    Button,
    Link, Snackbar
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import {Icon28CancelOutline, Icon28DoneOutline} from "@vkontakte/icons";
import {getGroupAdmins, getMyId, pushNewAdmins} from "../api";
import bridge from '@vkontakte/vk-bridge'
import config from '../config.json'
import {getRandomString} from "@vkontakte/vkjs";

function EditAdmins(props){
    const [changes, setChanges] = useState(false)
    const [admins, setAdmins] = useState([])

    useEffect(() => {
        props.setLoading(true)
        getGroupAdmins(window.location.search, props.selectedGroup.groupId).then(res => {
            if(res.success){
                bridge.send('VKWebAppGetAuthToken', {'app_id': config.appId, 'scope': ''})
                    .then(r => {
                        bridge.send('VKWebAppCallAPIMethod', {
                            'method': 'users.get',
                            'request_id': getRandomString(),
                            'params': {
                                'v':'5.126',
                                'access_token':r.access_token,
                                'user_ids': res.admins.join(','),
                                'fields':'photo_50'
                            }
                        }).then(r => {
                            let buffer = []
                            if(global.oldAdmins !== undefined){
                                buffer = oldAdmins
                            }else{
                                r.response.forEach((item) => {
                                    buffer.push({
                                        userId: item.id,
                                        name: item.first_name + ' ' + item.last_name,
                                        photo: item.photo_50
                                    })
                                })
                            }
                            if(global.selectedFriends && global.selectedFriends.length > 0){
                                global.selectedFriends.forEach(item => {
                                    if(!buffer.some(it => it.userId.toString() === item.userId.toString())){
                                        if(buffer.length < 10){
                                            setChanges(true)
                                            buffer.push(item)
                                        }
                                    }
                                })
                            }
                            setAdmins(buffer)
                            props.setLoading(false)
                        })
                    })
            }
        })
    }, [])

    const saveAdmins = () => {
        props.setLoading(true)
        global.selectedFriends = []
        delete global.oldAdmins
        let buffer = []
        admins.forEach(item => {
            buffer.push(item.userId.toString())
        })
        pushNewAdmins(window.location.search, props.selectedGroup.groupId, buffer).then(r => {
            if(r.success){
                props.setLoading(false)
                props.setActivePanel('groupList')
                props.setSnackbar(
                    <Snackbar
                        onClose={() => props.setSnackbar(undefined)}
                        before={ <Icon28DoneOutline/> }
                    >
                        Админы {props.selectedGroup.groupName} изменены
                    </Snackbar>
                )
            }
        })
        setChanges(false)
    }

    const deleteUser = (id) => {
        console.log(id)
        let newAdmins = admins.filter(it => it.userId !== id)
        if(newAdmins !== admins){
            setAdmins(newAdmins)
            global.oldAdmins = newAdmins
        }
        if(global.selectedFriends !== undefined){
            global.selectedFriends.map((value, index) => {
                if(value.userId === id){
                    selectedFriends.splice(index, 1)
                }
            })
        }
        setChanges(true)
    }

    const userWrapper = (item, index) => {
        if(getMyId().toString() === item.userId.toString()){
            return (
                <SimpleCell
                    key={index}
                    before={ <Avatar size={48} src={item.photo}/> }
                >{item.name}</SimpleCell>
            )
        }else {
            return (
                <SimpleCell
                    key={index}
                    before={ <Avatar size={48} src={item.photo}/> }
                    after={ <Icon28CancelOutline onClick={() => deleteUser(item.userId)}/> }
                >{item.name}</SimpleCell>
            )
        }
    }

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={ <PanelHeaderBack onClick={() => saveAdmins()} /> }
            >Редактирование админов {props.selectedGroup.groupName}</PanelHeader>
            <Group>
                <Header
                    mode={'secondary'}
                    aside={<Button mode={'tertiary'} onClick={() => props.setActivePanel('selectFriend')}>Добавить</Button>}
                >Список админов. Максимум 5</Header>
                {admins.map((item, index) => (
                    userWrapper(item, index)
                ))}
            </Group>
        </Panel>
    )
}

export default EditAdmins