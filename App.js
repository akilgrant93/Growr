import React, { useState, useEffect } from 'react'
import Routes from './Components/Routes'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import applyMiddleWare from 'redux/src/applyMiddleware'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import { StatusBar } from 'react-native'
import LoginForm from './Components/LoginForm'
import firebase from 'firebase'
import Loading from './Components/Loading'
import {decode, encode} from 'base-64'
import { Root } from "native-base";
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { enableScreens } from 'react-native-screens';

if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

  export default function App(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      enableScreens();
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          setIsLoggedIn(true)
        }else{
          setIsLoggedIn(false)
        }
   })
     }, [])

  const renderContent = () => {
    switch(isLoggedIn){
      case false:
        return <LoginForm />
      case true:
        return <Routes/>
        default:
          return <Loading />
    }
  }

  const state = createStore(reducers, {}, applyMiddleWare(ReduxThunk))

  return (
      <Root>
        <SafeAreaProvider>
            <Provider store={state}
            showsVerticalScrollIndicator={false}>
              <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#1a5127" translucent = {true}/>
              {renderContent()}
            </Provider>
        </SafeAreaProvider>
      </Root>
    )
}
