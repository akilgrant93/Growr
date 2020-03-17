import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default class Login extends Component {
  render() {
    return (
      <View styles={styles.container}>
        <Text> textInComponent </Text>
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
  }
}
