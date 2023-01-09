import { StyleSheet, Text, View,TouchableOpacity, SafeAreaView } from 'react-native'
import {firebase} from '../config'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

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
    <View style={{height:'100%', backgroundColor:'#034732'}}>
      <SafeAreaView style={{ height: '100%', backgroundColor:'rgba(255,255,255,.25)' }}>
      <View style={[{width: '90%', height: '97.5%', marginLeft:'5%',backgroundColor:'#82A398', borderRadius: 25}, styles.shadow]}>
      <View style={{flexDirection:'row', alignItems:'flex-end'}}>
      <Text style={{paddingLeft: 20, paddingTop: 30,fontSize: 25, fontWeight: '900', color: '#fff'}}>Settings</Text>
      <FontAwesome
        name='gear'
        color='#034732'
        size={20}
        style={{marginLeft:5, marginBottom:5}}
      />
      </View>

      <View style={{marginTop: 10, height:'90%',justifyContent:'space-between'}}>
        <View>
      <TouchableOpacity
        onPress={() => {changePassword()}}
        style={styles.button}
      >
        <View style={[styles.textBox, {borderTopWidth: 1}]}>
        <Text style={styles.text}>
            Email
        </Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity
        onPress={() => {changePassword()}}
        style={styles.button}
      >
        <View style={styles.textBox}>
        <Text style={styles.text}>
            Password
        </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {console.log('change form control')}}
        style={styles.button}
      >
        <View style={styles.textBox}>
        <Text style={styles.text}>
            Location
        </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {console.log('change form control')}}
        style={styles.button}
      >
        <View style={styles.textBox}>
        <Text style={styles.text}>
            Hardiness Zone
        </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {console.log('change form control')}}
        style={styles.button}
      >
        <View style={styles.textBox}>
        <Text style={styles.text}>
            Unit System
        </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {firebase.auth().signOut()}}
        style={styles.button}
      >
        <View style={styles.textBox}>
        <Text style={styles.text}>
            Weather Alerts
        </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {firebase.auth().signOut()}}
        style={styles.button}
      >
        <View style={styles.textBox}>
        <Text style={styles.text}>
            Remind me about my plants
        </Text>
        </View>
      </TouchableOpacity>

      <View style={{flexDirection:'row', alignItems:'flex-end'}}>
      <Text style={{paddingLeft: 20, paddingTop: 30,fontSize: 25, fontWeight: '900', color: '#fff'}}>Help</Text>
      <FontAwesome
      name='question-circle'
      color={'#545B98'}
      size={20}
      style={{marginLeft: 5, marginBottom:3}}
      />
      </View>
      <TouchableOpacity
        onPress={() => {firebase.auth().signOut()}}
        style={styles.button}
      >
        <View style={[styles.textBox, {borderTopWidth:1, marginTop: 10}]}>
        <Text style={styles.text}>
            Knowledge Base/FAQ
        </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {firebase.auth().signOut()}}
        style={styles.button}
      >
        <View style={styles.textBox}>
        <Text style={styles.text}>
            About Growr
        </Text>
        </View>
      </TouchableOpacity>
        </View>

      <TouchableOpacity
        onPress={() => {firebase.auth().signOut()}}
        style={styles.button}
      >
        <View style={[styles.textBox, {borderBottomWidth:0, borderTopWidth:1, marginBottom: 10, flexDirection:'row', alignItems:'center'}]}>
        <Text style={[styles.text, {color:'#fff', fontWeight:'900', fontSize: 25, paddingRight: 5}]}>
            Sign out
        </Text>
        <FontAwesome
        color='#F97068'
        size='25'
        name='sign-out'
        />
        </View>
      </TouchableOpacity>
      </View>

      </View>
      </SafeAreaView>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  button: {
    // marginTop: 50,
    // height: 70,
    // width: 250,
    // backgroundColor: '#026efd',
    // alignItems: 'center',
    // justifyContent: 'center',
    // alignSelf: 'center',
    // borderRadius: 50,
  },
  text: {
    color:'white',
    fontSize:16,
    paddingLeft: 20
  },
  textBox: {
    paddingVertical:10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,.25)'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
})
