import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../config'
import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { PlusCircleIcon } from 'react-native-heroicons/outline'
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
    <ImageBackground blurRadius={8} style={{height: '100%', width: '100%'}} source={require(`../assets/splashBG.jpg`)}>
    <SafeAreaView style={styles.container}>
      <FontAwesome
          onPress={() => navigation.navigate('Sign In')}
          name='caret-left'
          color='#fff'
          size={50}
          style={{marginLeft: 20, alignSelf: 'flex-start'}}
        />
      <View style={{alignItems:'center', justifyContent:'flex-start', height: '100%', marginTop: '25%', borderRadius: 25, overflow:'hidden'}}>
      <View style={{borderRadius: 25, borderWidth: 2, borderColor:'white', backgroundColor:'rgba(255,255,255,.10)', padding:20, overflow:'hidden'}}>
      <Text style={{paddingTop:20,fontSize: 25, fontWeight: '900', color: '#fff'}}>Registration</Text>
        <TextInput
          placeholderTextColor='white'
          style={styles.textInput}
          placeholder='First Name'
          onChangeText={(firstName) => setFirstName(firstName)}
          autoCorrect={false}
        />
        <TextInput
          placeholderTextColor='white'
          style={styles.textInput}
          placeholder='Last Name'
          onChangeText={(lastName) => setLastName(lastName)}
          autoCorrect={false}
        />
        <TextInput
          placeholderTextColor='white'
          style={styles.textInput}
          placeholder='Email'
          onChangeText={(email) => setEmail(email)}
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType='email-address'
        />
        <TextInput
          placeholderTextColor='white'
          style={styles.textInput}
          placeholder='Password'
          onChangeText={(password) => setPassword(password)}
          autoCorrect={false}
          autoCapitalize='none'
          secureTextEntry={true}
        />
      <TouchableOpacity
        onPress={() => registerUser(email,password,firstName,lastName)}
        style={[{marginTop: 10},styles.shadow]}
      >
        <PlusCircleIcon style={{alignSelf:'flex-end'}} color={'white'} size={50}/>
      </TouchableOpacity>
      </View>

      </View>
    </SafeAreaView>
    </ImageBackground>
  )
}

export default Registration

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor:'rgba(0, 0, 0, .65)'
  },
  textInput: {
    width: 225,
    paddingLeft: 5,
    paddingBottom: 2,
    fontSize:  15,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    textAlign:'left',
    marginVertical: 20
  },
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 50,
    flexDirection:'row'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
})
