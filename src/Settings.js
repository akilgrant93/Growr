import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import {firebase} from '../config'
import React from 'react'

const Settings = () => {
  const changePassword = () => {
    firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.uid)
    .then(() => {
      alert('Password reset email sent')
    }).catch((error) => {
      alert(error)
    })
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => {console.log('change form control')}}
        style={styles.button}
      >
        <Text style={{fontWeight: 'bold', fontSize:20}}>
            Change Location
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {changePassword()}}
        style={styles.button}
      >
        <Text style={{fontWeight: 'bold', fontSize:20}}>
            Change Password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {firebase.auth().signOut()}}
        style={styles.button}
      >
        <Text style={{fontWeight: 'bold', fontSize:20}}>
            Sign out
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: '#026efd',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 50,
},})
