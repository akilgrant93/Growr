import React, { useState, useEffect } from 'react';
import Routes from './Components/Routes';
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

// export default class App extends Component {
  export default function App(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [uid, setUid] = useState('');

    useEffect(() => {
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          setIsLoggedIn(true)
          setUid(user.uid)
        }else{
          setIsLoggedIn(false)
        }
   })
     }, [])

  // state={
  //   //toggle true to render routes supposed to be triggered in the firebase.auth function in the componentDidMount
  //   uid: '',
  //   loggedIn: false
  // }

  const renderContent = () => {
    switch(isLoggedIn){
      case false:
        return <LoginForm />
      case true:
        return <Routes />
        default:
          return <Loading />
    }
  }

  const state = createStore(reducers, {}, applyMiddleWare(ReduxThunk))

  return (
      <SafeAreaProvider>
      <Provider store={state}>
        {renderContent()}
      </Provider>
      </SafeAreaProvider>
    )
}
