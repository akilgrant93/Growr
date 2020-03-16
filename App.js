import React, {Component} from 'react';
import Routes from './Components/Routes';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import applyMiddleWare from 'redux/src/applyMiddleware'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'

export default class App extends Component {
  render() {

    const state = createStore(reducers, {}, applyMiddleWare(ReduxThunk))

    return (
      <Provider store={state}>
        <Routes />
      </Provider>
    )
  }
}
