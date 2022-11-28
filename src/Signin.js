import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../config'

const Signin = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signinUser = async(email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      alert('Unable to sign in')
    }
  }

  const forgotPassword = () => {
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      alert('Password reset email sent')
    }).catch((error) => {
      alert('Enter a valid email address')
    })
  }

  return (
    <View style={styles.container} >
      {/* replace title text with lottiefile */}
      <Text style={{fontWeight: 'bold', fontSize:26, textAlign:'center'}}>Sign In</Text>
      <View style={{marginTop:40}}>
        <TextInput
          style={styles.textInput}
          placeholder='Email'
          onChangeText={(email) => setEmail(email)}
          autoCapitalize='none'
          autoCorrect={false}
        />
         <TextInput
          style={styles.textInput}
          placeholder='Password'
          onChangeText={(password) => setPassword(password)}
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry={true}
        />
      </View>
      <View>
      <TouchableOpacity
        onPress={() => signinUser(email, password)}
        style={styles.button}
      >
        <Text style={{fontWeight: 'bold', fontSize:22}}>
          Sign In
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Registration')}
        style={{marginTop:20}}
      >
        <Text style={{fontWeight: 'bold', fontSize:16, textAlign:'center'}}>
          Don't have an account? Register Now
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {forgotPassword()}}
        style={{marginTop:20}}
      >
        <Text style={{fontWeight: 'bold', fontSize:16, textAlign:'center'}}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default Signin

const styles = StyleSheet.create({
  container: {
    flex:1, justifyContent:'center', alignItems:'center'
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
    backgroundColor: '#026efd',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 50
  }
})
