import React, { useState, useEffect, useRef } from 'react'
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import Routes from './Components/Routes'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import applyMiddleWare from 'redux/src/applyMiddleware'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import LoginForm from './Components/LoginForm'
import firebase from 'firebase'
import Loading from './Components/Loading'
import {decode, encode} from 'base-64'
import { SafeAreaProvider } from 'react-native-safe-area-context';

if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

  export default function App(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
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
      <SafeAreaProvider>
      <Provider store={state} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </Provider>
      </SafeAreaProvider>
    )
}
