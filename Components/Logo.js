import React, { Component } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'

export default class Logo extends Component {
  render() {
    return (
      <View>
        <Image source={{uri: 'https://images.squarespace-cdn.com/content/5363e3d1e4b0b6dbd37bcdd6/1584439666648-WC21M3H2FTNH0GSFAVSH/growr-01.png?content-type=image%2Fpng'}} style={{height: 60, width: 220}}></Image>
      </View>
    )
  }
}
