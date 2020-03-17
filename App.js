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

export default class App extends Component {
  userState={
    //toggle true to render routes supposed to be triggered in the firebase.auth function in the componentDidMount
    loggedIn: false
  }
  componentDidMount(){
    console.log('mounted!')
    console.log('firebase!', firebase)
    firebase.auth().onAuthStateChanged(user => {
          console.log(user)
         if(user){
            this.setState({
              loggedIn:true
            })
         }else{
           this.setState({
             loggedIn:false
           })
         }
    })
  }

  renderContent = () => {
    console.log(this)
    switch(this.userState.loggedIn){
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

      <Provider store={state}>
        {this.renderContent()}
      </Provider>
    )
  }
}
