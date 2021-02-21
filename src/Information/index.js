import React, { useState, useEffect } from 'react'
import '@vkontakte/vkui/dist/vkui.css'
import {Group, Header, InfoRow, Panel, PanelHeader, PanelHeaderBack, SimpleCell} from "@vkontakte/vkui";
import {getInformation} from "../api";

function Information(props){
    const [allUsers, setAllUsers] = useState(0)
    const [unsubscribe, setUnsubscribe] = useState(0)
    const [active, setActive] = useState(0)

    useEffect(() => {
        props.setLoading(true)
        console.log('gid', props.selectedGroup.groupId)
        getInformation(window.location.search, props.selectedGroup.groupId).then(r => {
            if(r.success){
                setAllUsers(r.users.length)
                r.users.forEach(item => {
                    if(!item.adware){
                        setUnsubscribe(prevState => prevState + 1)
                    }else{
                        let activeTime = 86400
                        if((r.time - item.time) > activeTime){
                            setActive(prevState => prevState + 1)
                        }
                    }
                })
                props.setLoading(false)
            }
        })
    }, [])

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={ <PanelHeaderBack onClick={() => props.setActivePanel('groupList')} /> }
            >Информация о {props.selectedGroup.groupName}</PanelHeader>
            <Group>
                <Header mode={'secondary'}>Рассылка</Header>
                <SimpleCell>
                    <InfoRow header={'Всего пользователей'}>
                        {allUsers}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell>
                    <InfoRow header={'Отписаные пользователи'}>
                        {unsubscribe}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell>
                    <InfoRow header={'Активные пользователи доступные для рассылки'}>
                        {active}
                    </InfoRow>
                </SimpleCell>
            </Group>
        </Panel>
    )
}

export default Information