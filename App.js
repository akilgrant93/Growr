import React, {Component} from 'react';
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

export default class App extends Component {
  state={
    //toggle true to render routes supposed to be triggered in the firebase.auth function in the componentDidMount
    uid: '',
    loggedIn: false
  }
  componentDidMount(){
    console.log('mounted!')
    firebase.auth().onAuthStateChanged(user => {
         if(user){
            this.setState({
              loggedIn:true, uid: user.uid
            })
         }else{
           this.setState({
             loggedIn:false
           })
         }
    })
  }

  renderContent = () => {
    switch(this.state.loggedIn){
      case false:
        return <LoginForm />
      case true:
        return <Routes />
        default:
          return <Loading />
    }
  }
  render() {
    const state = createStore(reducers, {}, applyMiddleWare(ReduxThunk))

    return (
      <SafeAreaProvider>
      <Provider store={state}>
        {this.renderContent()}
      </Provider>
      </SafeAreaProvider>
    )
  }
}
