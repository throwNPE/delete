import config from "./config.json";
import qs from 'qs'

function getGroups(authString) {
    return fetch(config.apiUrl + '/getGroups', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({authString: authString})
    }).then(r => r.json())
}

function addGroup(authString, id, name, photo_50, access_token){
    return fetch(config.apiUrl + '/addGroup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({authString: authString, group: {id, name, photo_50, access_token}})
    }).then(r => r.json())
}

function deleteGroup(authString, id){
    return fetch(config.apiUrl + '/deleteGroup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify( { authString, group: {id} } )
    }).then(r => r.json())
}

function getUserBalance(authString){
    return fetch(config.apiUrl + '/getUserBalance', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify( { authString } )
    }).then(r => r.json())
}

function getSettingsInfo(authString, groupId){
    return fetch(config.apiUrl + '/getSettingsInfo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify( { authString, groupId } )
    }).then(r => r.json())
}

function pushNewSettings(authString, groupId, subscribe, unsubscribe, subscribeMessage, unsubscribeMessage){
    return fetch(config.apiUrl + '/pushNewSettings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify( { authString, groupId, subscribe, unsubscribe, subscribeMessage, unsubscribeMessage } )
    }).then(r => r.json())
}

function getGroupAdmins(authString, groupId){
    return fetch(config.apiUrl + '/getGroupAdmins', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify( { authString, groupId } )
    }).then(r => r.json())
}

function getMyId(){
    let query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
    return query.vk_user_id
}

function pushNewAdmins(authString, groupId, admins){
    return fetch(config.apiUrl + '/pushNewAdmins', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify( { authString, groupId, admins } )
    }).then(r => r.json())
}

function getInformation(authString, groupId){
    return fetch(config.apiUrl + '/getInformation', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify( { authString, groupId } )
    }).then(r => r.json())
}

function getGroupToken(authString, groupId){
    return fetch(config.apiUrl + '/getGroupToken', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify( { authString, groupId } )
    }).then(r => r.json())
}

export {
    getGroups,
    addGroup,
    deleteGroup,
    getUserBalance,
    getSettingsInfo,
    pushNewSettings,
    getGroupAdmins,
    getMyId,
    pushNewAdmins,
    getInformation,
    getGroupToken
}