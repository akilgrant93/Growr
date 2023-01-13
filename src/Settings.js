import { StyleSheet, Text, View,TouchableOpacity, SafeAreaView, Switch } from 'react-native'
import {firebase} from '../config'
import React, {useEffect, useState} from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location';

const Settings = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState({})
  const [weatherIsEnabled, setWeatherIsEnabled] = useState(false);
  const toggleWeatherSwitch = () => setWeatherIsEnabled(previousState => !previousState);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [unitSystem, setUnitSystem] = useState('Imperial')

  // const signOut = () => {
  //   // console.log()
  //   navigation.navigate('Sign In')
  //   // firebase.auth().signOut()
  // }

  const changeLocation = async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location is required to check local weather conditions');
      return;
    }
    const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    let locationData = await Location.getCurrentPositionAsync({});
    const res = await Location.reverseGeocodeAsync(locationData.coords)
    userRef.update({location:res[0]})
  }

  const changePassword = () => {
    firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.uid)
    .then(() => {
      alert('Password reset email sent')
    }).catch((error) => {
      alert(error)
    })
  }

  useEffect(() => {
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    .onSnapshot(
      querySnapshot => {
        setUser(querySnapshot.data())
      }
    )
  })

  // console.log(user.location.city)
  return (
    <View style={{height:'100%', backgroundColor:'#034732'}}>
      <SafeAreaView style={[{ height: '100%', backgroundColor:'rgba(240,240,240,.25)' }, styles.shadow]}>
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
        <View style={[styles.textBox, {borderTopWidth: 1}]}>
        <Text style={styles.text}>
            Email
        </Text>
        <Text style={styles.text2}>
          {user.email}
        </Text>
        </View>


      <TouchableOpacity
        onPress={() => {changePassword()}}
        style={styles.button}
      >
        <View style={styles.textBox}>
        <Text style={styles.text}>
            Password
        </Text>
        <FontAwesome style={{paddingRight: 20}}name='chevron-right' color={'white'} size={16}/>
        </View>
      </TouchableOpacity>

        <View style={styles.textBox}>
        <Text style={styles.text}>
            Location
        </Text>

        <TouchableOpacity
        onPress={() => {changeLocation()}}
        style={styles.button}>
          {user.location
          ? <View style={{flexDirection:'row', paddingRight:20}}>
                <Text style={[styles.text2, {paddingRight:5}]}>
                  {user.location.city}, {user.location.region}
                </Text>
                <FontAwesome name='chevron-right' color={'white'} size={16}/>
            </View>
          : null}
      </TouchableOpacity>
        </View>

      <TouchableOpacity
        onPress={() => {console.log('change form control')}}
        style={styles.button}
      >
        <View style={styles.textBox}>
        <Text style={styles.text}>
            Hardiness Zone
        </Text>
        <Text style={styles.text2}>
            7B
        </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {unitSystem === 'Imperial' ? setUnitSystem('Metric') : setUnitSystem('Imperial')}}
        style={styles.button}
      >
        <View style={styles.textBox}>
        <Text style={styles.text}>
            Unit System
        </Text>
        <Text style={styles.text2}>
            {unitSystem}
        </Text>
        </View>
      </TouchableOpacity>

        <View style={styles.textBox}>
        <Text style={styles.text}>
            Weather Alerts
        </Text>
        <Switch
        style={{marginRight: 20}}
        onValueChange={toggleWeatherSwitch}
        value={weatherIsEnabled}
        />
        </View>

        <View style={styles.textBox}>
        <Text style={styles.text}>
            Remind me about my plants
        </Text>
        <Switch
        style={{marginRight: 20}}
        onValueChange={toggleSwitch}
        value={isEnabled}
        />
        </View>

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
        // onPress={() => {firebase.auth().signOut()}}
        style={styles.button}
      >
        <View style={[styles.textBox, {borderTopWidth:1, marginTop: 10}]}>
        <Text style={styles.text}>
            Knowledge Base/FAQ
        </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        // onPress={() => {firebase.auth().signOut()}}
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
        onPress={() => {console.log('sign out! needs to fix')}}
        style={styles.button}
      >
        <View style={[styles.textBox, {borderBottomWidth:0, borderTopWidth:1, marginBottom: 10, justifyContent:'flex-start', alignItems:'center'}]}>
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
  text2: {
    color:'white',
    fontSize:16,
    paddingRight: 20
  },
  textBox: {
    paddingVertical:10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,.25)',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
})
