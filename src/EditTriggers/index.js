import React, { useState, useEffect } from 'react'
import {
    Alert, Avatar,
    ChipsInput,
    FormItem,
    Group,
    Header,
    Input,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Snackbar
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import {getSettingsInfo, pushNewSettings} from "../api";
import {Icon28DoneOutline} from "@vkontakte/icons";

/**
 * @param props.selectedGroup.groupName
 * @param props.selectedGroup.groupId
 */

function EditTriggers(props) {
    const [trueTriggers, setTrueTriggers] = useState()
    const [trueMessage, setTrueMessage] = useState()
    const [falseTriggers, setFalseTriggers] = useState()
    const [falseMessage, setFalseMessage] = useState()
    const [changes, setChanges] = useState(false)

    useEffect(() => {
        props.setLoading(true)
        getSettingsInfo(window.location.search, props.selectedGroup.groupId).then(r => {
            console.log(r)
            let trueObject = []
            let falseObject = []
            r.subscribe.forEach(item => {
                trueObject.push({ value: item, label: item })
            })
            r.unsubscribe.forEach(item => {
                falseObject.push({ value: item, label: item })
            })
            setTrueTriggers(trueObject)
            setFalseTriggers(falseObject)
            setTrueMessage(r.subscribeMessage)
            setFalseMessage(r.unsubscribeMessage)
            props.setLoading(false)
        })
    }, [])

    const saveSettings = () => {
        if(changes){
            let errorText = ''
            if(trueTriggers.length > 10 || falseTriggers.length > 10){
                errorText = 'Максимум 10 триггеров'
            }
            if(errorText.length > 0){
                props.setPopout(
                    <Alert
                        actionsLayout={'horizontal'}
                        onClose={() => props.setPopout(undefined)}
                        header={'Ошибка'}
                        text={errorText}
                        actions={[
                            {
                                title: 'Отмена',
                                autoclose: true,
                                mode: 'cancel'
                            }
                        ]}
                    />
                )
            }else{
                props.setLoading(true)
                setChanges(false)
                let subscribe = []
                let unsubscribe = []
                let subscribeMessage = trueMessage
                let unsubscribeMessage = falseMessage

                trueTriggers.forEach(item => {
                    subscribe.push(item.value.toLowerCase())
                })
                falseTriggers.forEach(item => {
                    unsubscribe.push(item.value.toLowerCase())
                })
                pushNewSettings(window.location.search, props.selectedGroup.groupId, subscribe, unsubscribe, subscribeMessage, unsubscribeMessage).then(r => {
                    if(r.success){
                        props.setLoading(false)
                        props.setActivePanel('groupList')
                        props.setSnackbar(
                            <Snackbar
                                onClose={() => props.setSnackbar(undefined)}
                                before={ <Icon28DoneOutline/> }
                            >
                                Триггеры {props.selectedGroup.groupName} изменены
                            </Snackbar>
                        )
                    }
                })
            }
        }else {
            props.setActivePanel('groupList')
        }
    }

    const changeTrueTriggers = (e) => {
        setChanges(true)
        setTrueTriggers(e)
    }

    const changeFalseTriggers = (e) => {
        setChanges(true)
        setFalseTriggers(e)
    }

    const changeTrueMessage = (e) => {
        setChanges(true)
        setTrueMessage(e.currentTarget.value)
    }

    const changeFalseMessage = (e) => {
        setChanges(true)
        setFalseMessage(e.currentTarget.value)
    }

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={ <PanelHeaderBack onClick={() => saveSettings()} /> }
            >Редактирование триггеров {props.selectedGroup.groupName}</PanelHeader>
            <Group mode={'plain'} header={ <Header mode={'secondary'}>Добавление в рассылку</Header> }>
                <FormItem top={'Триггеры. Максимум 10'}>
                    <ChipsInput value={trueTriggers} onChange={(e) => changeTrueTriggers(e)}/>
                </FormItem>
                <FormItem top={'Сообщение пользователю'}>
                    <Input defaultValue={trueMessage} type={'text'} maxlength={100} onChange={(e) => changeTrueMessage(e)}/>
                </FormItem>
            </Group>
            <Group mode={'plain'} header={ <Header mode={'secondary'}>Удаление из рассылки</Header> }>
                <FormItem top={'Триггеры. Максимум 10'}>
                    <ChipsInput value={falseTriggers} onChange={(e) => changeFalseTriggers(e)}/>
                </FormItem>
                <FormItem top={'Сообщение пользователю'}>
                    <Input defaultValue={falseMessage} type={'text'} maxlength={100} onChange={(e) => changeFalseMessage(e)}/>
                </FormItem>
            </Group>
        </Panel>
    )
}

export default EditTriggers