import React, {useEffect, useState} from 'react'
import {AppRoot, ScreenSpinner, View} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import FirstJoin from "../FirstJoin";
import GroupList from "../GroupList";
import SelectGroup from "../SelectGroup";
import EditTriggers from "../EditTriggers";
import EditAdmins from "../EditAdmins";
import SelectFriend from "../SelectFriend";
import {getRandomString} from "@vkontakte/vkjs";
import Information from "../Information";
import SendMessages from "../SendMessages";

function App(){
    const [activePanel, setActivePanel] = useState('first')
    const [popout, setPopout] = useState(undefined)
    const [snackbar, setSnackbar] = useState(undefined)
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState({})

    useEffect(() => {
        if(activePanel === 'first'){
            let lo = false
            let test = getRandomString(10)
            try{
                window.localStorage.setItem(test, test)
                window.localStorage.getItem(test)
                lo = true
            }catch (e){
                console.log(e)
            }
            if(lo){
                switch (window.localStorage.getItem('state')) {
                    case 'groupList':
                        setActivePanel('groupList')
                        break
                }
            }
        }
    })

    const setLoading = (value) => {
        if(value) {
            setPopout( <ScreenSpinner/> )
        } else {
            setPopout( undefined )
        }
    }

    return (
        <AppRoot>
            <View activePanel={activePanel} popout={popout}>
                <FirstJoin id={'first'} setActivePanel={setActivePanel}/>
                <GroupList
                    id={'groupList'}
                    setLoading={setLoading}
                    setActivePanel={setActivePanel}
                    snackbar={snackbar}
                    groups={groups}
                    setGroups={setGroups}
                    setPopout={setPopout}
                    setSnackbar={setSnackbar}
                    setSelectedGroup={setSelectedGroup}
                />
                <SelectGroup
                    id={'selectGroup'}
                    setLoading={setLoading}
                    setActivePanel={setActivePanel}
                    setPopout={setPopout}
                    setSnackbar={setSnackbar}
                    setGroups={setGroups}/>
                <EditTriggers
                    id={'editTriggers'}
                    setActivePanel={setActivePanel}
                    selectedGroup={selectedGroup}
                    setLoading={setLoading}
                    setPopout={setPopout}
                    setSnackbar={setSnackbar}
                />
                <EditAdmins
                    id={'editAdmins'}
                    setActivePanel={setActivePanel}
                    selectedGroup={selectedGroup}
                    setLoading={setLoading}
                    setPopout={setPopout}
                    setSnackbar={setSnackbar}
                />
                <SelectFriend
                    id={'selectFriend'}
                    setActivePanel={setActivePanel}
                    selectedGroup={selectedGroup}
                    setLoading={setLoading}
                    setPopout={setPopout}
                    setSnackbar={setSnackbar}
                />
                <Information
                    id={'information'}
                    setActivePanel={setActivePanel}
                    selectedGroup={selectedGroup}
                    setLoading={setLoading}
                />
                <SendMessages
                    id={'sendMessages'}
                    setActivePanel={setActivePanel}
                    selectedGroup={selectedGroup}
                    setLoading={setLoading}
                />
            </View>
        </AppRoot>
    )
}

export default App