import React, { useEffect, useState, useRef } from 'react'
import {
    Gradient,
    Panel,
    PanelHeader,
    SizeType,
    Avatar,
    Title,
    Text,
    Button,
    SimpleCell,
    Group,
    Search, Footer, PanelHeaderButton, usePlatform, ANDROID, IOS, ActionSheet, ActionSheetItem, Snackbar, Alert
} from "@vkontakte/vkui";
import {
    Icon28FireCircleFillRed,
    Icon28AddOutline,
    Icon28DeleteOutline,
    Icon28DeleteOutlineAndroid, Icon28EditOutline, Icon28ArticleOutline, Icon28KeyOutline, Icon28ChatsOutline
} from '@vkontakte/icons';

import '@vkontakte/vkui/dist/vkui.css'

import {addGroup, getGroups, deleteGroup, getUserBalance} from "../api";
import bridge from "@vkontakte/vk-bridge";
import config from "../config.json";

function GroupList(props) {
    const [search, setSearch] = useState('')
    const platform = usePlatform()
    const actionSheet = useRef(undefined)

    useEffect(() => {
        props.setLoading(true)
        getGroups(window.location.search).then(r => {
            console.log(r)
            props.setGroups(r.groups)
            props.setLoading(false)
        })
    }, [])

    const filter = () => {
        return props.groups.filter(({name}) => name.toLowerCase().indexOf(search.toLowerCase()) > -1)
    }

    const editClick = (groupId, groupName, photo) => {
        props.setPopout(
            <ActionSheet
                onClose={() => props.setPopout(undefined)}
                toggleRef={actionSheet.current}
                iosCloseItem={ <ActionSheetItem autoclose mode={'cancel'} >Отменить</ActionSheetItem> }
            >
                <ActionSheetItem
                    autoclose
                    before={ <Icon28ChatsOutline/> }
                    onClick={() => {
                        props.setSelectedGroup({
                            groupId,
                            groupName,
                            photo
                        })
                        props.setActivePanel('editTriggers')
                    }}
                >
                    Редактировать триггеры
                </ActionSheetItem>
                <ActionSheetItem
                    autoclose
                    before={ <Icon28KeyOutline/> }
                    onClick={() => {
                        props.setSelectedGroup({
                            groupId,
                            groupName,
                            photo
                        })
                        props.setActivePanel('editAdmins')
                    }}
                >
                    Редактировать админов
                </ActionSheetItem>
            </ActionSheet>
        )
    }

    const groupClick = (groupId, groupName, photo) => {
        console.log(groupId)
        props.setPopout(
            <ActionSheet
                onClose={() => props.setPopout(undefined)}
                toggleRef={actionSheet.current}
                iosCloseItem={ <ActionSheetItem autoclose mode={'cancel'} >Отменить</ActionSheetItem> }
            >
                <ActionSheetItem
                    autoclose
                    before={ <Icon28AddOutline/> }
                    onClick={() => {
                        props.setSelectedGroup({
                            groupId,
                            groupName,
                            photo
                        })
                        props.setActivePanel('sendMessages')
                    }}
                >
                    Сделать рассылку
                </ActionSheetItem>
                <ActionSheetItem
                    autoclose
                    before={ <Icon28ArticleOutline/> }
                    onClick={() => {
                        props.setSelectedGroup({
                            groupId,
                            groupName,
                            photo
                        })
                        props.setActivePanel('information')
                    }}
                >
                    Информация
                </ActionSheetItem>
                <ActionSheetItem
                    autoclose
                    before={ <Icon28EditOutline/> }
                    onClick={() => {
                        editClick(groupId, groupName, photo)
                    }}
                >
                    Редактировать
                </ActionSheetItem>
                <ActionSheetItem
                    autoclose
                    before={platform === IOS ? <Icon28DeleteOutline/> : <Icon28DeleteOutlineAndroid/> }
                    mode={'destructive'}
                    onClick={() => {
                        props.setPopout(
                            <Alert
                                actions={[
                                    {
                                        title: 'Отмена',
                                        autoclose: true,
                                        mode: 'cancel'
                                    },
                                    {
                                        title: 'Удалить',
                                        autoclose: true,
                                        mode: 'destructive',
                                        action: () => {
                                            props.setLoading(true)
                                            deleteGroup(window.location.search, groupId).then(r => {
                                                props.setGroups(r.groups)
                                                props.setLoading(false)
                                                props.setActivePanel('groupList')
                                                props.setSnackbar(
                                                    <Snackbar
                                                        onClose={() => props.setSnackbar(undefined)}
                                                        before={ <Avatar src={photo} /> }
                                                    >
                                                        {groupName} удалено из рассылки
                                                    </Snackbar>
                                                )
                                            })
                                        }
                                    }
                                ]}
                                actionsLayout={'horizontal'}
                                onClose={() => props.setPopout(undefined)}
                                header={'Удаление группы'}
                                text={'Вы уверены, что хотите удалить ' + groupName + ' из рассылки?'}
                            />
                        )
                    }}
                >
                    Удалить
                </ActionSheetItem>
            </ActionSheet>
        )
    }

    const addGroup = () => {
        props.setLoading(true)
        getUserBalance(window.location.search).then(r => {
            props.setLoading(false)
            if(r.balance < config.groupPrice){
                props.setPopout(
                    <Alert
                        actions={[
                            {
                                title: 'Отмена',
                                autoclose: true,
                                mode: 'cancel'
                            },
                            {
                                title: 'Пополнить баланс',
                                autoclose: true,
                                mode: 'destructive',
                                action: () => {
                                    window.open('https://vk.com/app6887721_-' + config.donutGroupId)
                                }
                            }
                        ]}
                        actionsLayout={'horizontal'}
                        onClose={() => props.setPopout(undefined)}
                        header={'Пополните баланс'}
                        text={'Стоимость добавление одной группы - ' + config.groupPrice + ' руб. Это единоразовый платеж, больше Вам не придется платить'}
                    />
                )
            }else {
                props.setActivePanel('selectGroup')
            }
        })

    }

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={<PanelHeaderButton onClick={() => addGroup()} ><Icon28AddOutline /></PanelHeaderButton>}
            >Ваши группы</PanelHeader>
            {props.groups.length === 0 ? (
                <Gradient
                    style={{
                        margin: 'compact' === SizeType.REGULAR ? '-7px -7px 0 -7px' : 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: 32,
                    }}
                >
                    <Icon28FireCircleFillRed width={96} height={96}/>
                    <Title style={{ marginBottom: 8, marginTop: 20 }} level="2" weight="medium">Упс...</Title>
                    <Text style={{ marginBottom: 24, color: 'var(--text_secondary)' }}>Похоже у Вас еще нет групп</Text>
                    <Button size="m" mode="commerce" onClick={() => addGroup()} >Добавить группу</Button>
                </Gradient>

            ) : (
                <Group>
                    <Search value={search} onChange={(e) => setSearch(e.target.value)} after={null} />
                    {filter().length > 0 && filter().map((item, index) => (
                        <SimpleCell
                            before={<Avatar src={item.photo}/>}
                            key={index}
                            onClick={() => groupClick(item.groupId, item.name, item.photo)}
                            getRootRef={actionSheet}
                        >{item.name}</SimpleCell>
                    ))}
                    {filter().length === 0 && <Footer>Ничего не найдено</Footer>}
                </Group>
            )}
            {props.snackbar}
        </Panel>
    )
}

export default GroupList