import React, {useState, useEffect} from 'react'
import {Button, Div, Gallery, Group, Header, Panel, PanelHeader} from "@vkontakte/vkui";
import {getRandomString} from "@vkontakte/vkjs";
import '@vkontakte/vkui/dist/vkui.css'

function FirstJoin(props) {
    const [slideIndex, setSlideIndex] = useState(0)

    useEffect(() => {
        console.log(slideIndex)
    }, [slideIndex])

    return (
        <Panel id={props.id}>
            <PanelHeader>Привет!</PanelHeader>
            <Group header={ <Header mode={'secondary'} >Что мы можем?</Header> }>
                <Gallery
                    slideIndex={slideIndex}
                    slideWidth={'90%'}
                    align={'center'}
                    style={{ height: '90%' }}
                    isDraggable={true}
                    onChange={index => setSlideIndex(index)}
                >
                    <Div style={{ fontSize: 25 }}>
                        Удобный интерфейс, который поможет Вам сэкономить время и силы для рассылки сообщений
                    </Div>
                    <Div style={{ fontSize: 25 }}>
                        Автоматическое добавление или удаление пользователей из рассылки посредстам комманд "Подписаться", "Отписаться"
                    </Div>
                    <Div style={{ fontSize: 25 }}>
                        Быстрая рассылка сообщений с поддежкой переменных
                    </Div>
                </Gallery>
                <Div>
                    <Button stretched onClick={() => {
                        if(slideIndex !== 2){
                            setSlideIndex(p => p + 1)
                        }else {
                            let lo = false
                            try{
                                let test = getRandomString(10)
                                window.localStorage.setItem(test, test)
                                window.localStorage.getItem(test)
                                lo = true
                            }catch (e){
                                console.log(e)
                            }
                            if(lo){
                                window.localStorage.setItem('state', "groupList")
                            }
                            props.setActivePanel('groupList')
                        }
                    }}>{ slideIndex === 2 ? 'Начать' : 'Далее' }</Button>
                </Div>
            </Group>
        </Panel>
    )
}

export default FirstJoin