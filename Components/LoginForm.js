import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Logo from './Logo'
import EmailAndPassword from './EmailAndPassword'

export default class LoginForm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View styles={styles.logoBox}>
          <Logo />
        </View>
        <View styles={styles.loginBox}>
          <EmailAndPassword />
        </View>
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#e6ffe6'
  },
  logoBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBox: {
    flex: 2,
  }
}
