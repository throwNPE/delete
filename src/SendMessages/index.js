import React, { useEffect, useState } from 'react'
import '@vkontakte/vkui/dist/vkui.css'
import {Group, Panel, PanelHeader, PanelHeaderBack, FormItem, Textarea, File} from "@vkontakte/vkui";
import {Icon24Camera} from "@vkontakte/icons";
import {getGroupToken} from "../api";

function SendMessages(props) {
    const [images, setImages] = useState([])
    const [accessToken, setAccessToken] = useState(undefined)

    useEffect(() => {
        props.setLoading(true)
        getGroupToken(window.location.search, props.selectedGroup.groupId).then(r => {
            setAccessToken(r.accessToken)
            props.setLoading(false)
        })
    }, [])

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={ <PanelHeaderBack onClick={() => props.setActivePanel('groupList')} /> }
            >Сделать рассылку в {props.selectedGroup.groupName}</PanelHeader>
            <Group>
                <FormItem top={'Сообщение. Переменные поддерживаются'}>
                    <Textarea placeholder={'Привет! У нас тут конкурс...'} />
                </FormItem>
                <FormItem top={'Фотографии'}>
                    <File before={<Icon24Camera/>} controlSize={'m'} onChange={(e) => {
                        let file = e.currentTarget.files[0]
                        console.log('rrr')
                        console.log('buff', new Response(e.currentTarget.files[0].stream()).blob().then(r => {
                            console.log(r.arrayBuffer().then(r => {
                                let base64 = btoa(new Uint8Array(r).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                                let type = file.name.split('.')[1]
                                let name = file.name.split('.')[0]
                                setImages(prevState => [...prevState, {
                                    name,
                                    type,
                                    base64
                                }])
                            }))
                        }))
                    }}>
                        Добавить
                    </File>
                </FormItem>
            </Group>
        </Panel>
    )
}

export default SendMessages