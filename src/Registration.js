import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../config'
import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
const Registration = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const registerUser = async(email, password, firstName, lastName) => {
    await firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(() => {
      firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url:'https://growr-65834.firebaseapp.com'
      })
      .then(() => {
          alert('Verification email sent')
      }).catch((error) => {
          alert('Enter a valid email address')
      })
      .then(()=> {
        firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          firstName,
          lastName,
          email,
        })
      })
      .catch((error) => {
        alert('Enter a valid email address')
      })
    })
    .catch((error => {
      alert('Enter a valid email address')
    }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <FontAwesome
          onPress={() => navigation.navigate('Sign In')}
          name='angle-double-left'
          color='#034732'
          size={32}
          style={{marginLeft: 10, alignSelf: 'flex-start'}}
        />
      <View style={{alignItems:'center', justifyContent:'center', height: '100%', marginTop: -10}}>
      <View style={{marginTop:40}}>
        <TextInput
          style={styles.textInput}
          placeholder='First Name'
          onChangeText={(firstName) => setFirstName(firstName)}
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder='Last Name'
          onChangeText={(lastName) => setLastName(lastName)}
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder='Email'
          onChangeText={(email) => setEmail(email)}
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType='email-address'
        />
        <TextInput
          style={styles.textInput}
          placeholder='Password'
          onChangeText={(password) => setPassword(password)}
          autoCorrect={false}
          autoCapitalize='none'
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity
        onPress={() => registerUser(email,password,firstName,lastName)}
        style={styles.button}
      >
        <Text style={{fontWeight:'bold',fontSize:22, color: 'white'}}>Register</Text>
        <FontAwesome
          name='pencil-square'
          color='white'
          size={22}
          style={{marginLeft: 10}}
        />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Registration

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor:'rgba(228, 241, 228, .5)'
  },
  textInput: {
    paddingTop: 20,
    paddingBottom: 10,
    width: 400,
    fontSize:  20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textAlign:'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: '#034732',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 50,
    flexDirection:'row'
  }
})
