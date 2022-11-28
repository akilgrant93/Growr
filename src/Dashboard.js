import { StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React, {useState,useEffect} from 'react'
import {firebase} from '../config'

const Dashboard = () => {
  const [name, setName] = useState('')

  // change the users current password
  const changePassword = () => {
    firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.uid)
    .then(() => {
      alert('Password reset email sent')
    }).catch((error) => {
      alert(error)
    })
  }

  useEffect(()=> {
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
    .then((snapshot) => {
      if(snapshot.exists){
        setName(snapshot.data())
      } else {
        console.log('User does not exist')
      }
    })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontWeight: 'bold', fontSize:20}}>Hello, {name.firstName}</Text>

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
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: '#026efd',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 50,
  }
})

