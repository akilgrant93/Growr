import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native';
import { firebase } from '../config'
import { FontAwesome } from '@expo/vector-icons'

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
      <View style={{marginTop:40, alignItems:'center'}}>
      <Image style={{width: 376/2, height: 97/2}} source={require('../assets/growr-01.png')}/>
      <LottieView style={{width: '90%'}} source={require('../assets/lf30_editor_9ah8dnv1.json')} autoPlay loop />
        <TextInput
          style={[styles.textInput, {marginTop: 25}]}
          placeholder='Email'
          onChangeText={(email) => setEmail(email)}
          autoCapitalize='none'
          autoCorrect={false}
        />
         <TextInput
          style={[styles.textInput, {marginTop: 25, marginBottom:45}]}
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
        style={[styles.button, styles.shadow]}
      >
        <Text style={{fontWeight: 'bold', color:'white', fontSize:22}}>
          Sign In
        </Text>
        <FontAwesome
          name='sign-in'
          color='white'
          size={22}
          style={{marginLeft: 10}}
        />
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
    flex:1, justifyContent:'center', alignItems:'center',
    backgroundColor:'rgba(228, 241, 228, .5)'
  },
  textInput: {
    width: 225,
    paddingLeft: 5,
    fontSize:  15,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textAlign:'left'
  },
  button: {
    height: 70,
    width: 250,
    backgroundColor: '#034732',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 50,
    flexDirection: 'row'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
})
