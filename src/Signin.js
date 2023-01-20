import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native';
import { firebase } from '../config'
import { FontAwesome } from '@expo/vector-icons'
import Animated, { FadeInLeft } from 'react-native-reanimated';

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
    <ImageBackground blurRadius={8} style={{height: '100%', width: '100%'}} source={require(`../assets/splashBG.jpg`)}>
    <View style={styles.container} >
      <View style={{marginTop:40, alignItems:'center'}}>
      <Image style={[{width: 376/2, height: 97/2}, styles.shadow]} source={require('../assets/growr-02.png')}/>
      <LottieView style={{width: '90%'}} source={require('../assets/welcome_plants.json')} />
      <Animated.View entering={FadeInLeft}>
        <TextInput
          placeholderTextColor='white'
          style={[styles.textInput, {marginTop: 25}]}
          placeholder='Email'
          onChangeText={(email) => setEmail(email)}
          autoCapitalize='none'
          autoCorrect={false}
        />
         <TextInput
          placeholderTextColor='white'
          style={[styles.textInput, {marginTop: 25, marginBottom:45}]}
          placeholder='Password'
          onChangeText={(password) => setPassword(password)}
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry={true}
        />
        </Animated.View>
      </View>
      <Animated.View entering={FadeInLeft}>
          <TouchableOpacity
        onPress={() => signinUser(email, password)}
        style={[styles.button, styles.shadow]}
      >
        <Text style={{fontWeight: 'bold', color:'#034732', fontSize:22}}>
          Sign In
        </Text>
        <FontAwesome
          name='sign-in'
          color='#034732'
          size={22}
          style={{marginLeft: 10}}
        />
          </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Registration')}
        style={{marginTop:20}}
        >
        <Text style={{fontWeight: 'bold', fontSize:16, textAlign:'center', color:'white'}}>
          Don't have an account? Register Now
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {forgotPassword()}}
        style={{marginTop:20}}
        >
        <Text style={{fontWeight: 'bold', fontSize:16, textAlign:'center', color:'white'}}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      </Animated.View>

    </View>
    </ImageBackground>
  )
}

export default Signin

const styles = StyleSheet.create({
  container: {
    flex:1, justifyContent:'center', alignItems:'center',
    backgroundColor:'rgba(0, 0, 0, .65)'
  },
  textInput: {
    width: 225,
    paddingLeft: 5,
    fontSize:  15,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    textAlign:'left'
  },
  button: {
    height: 70,
    width: 250,
    backgroundColor: '#fff',
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
