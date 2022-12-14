import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import {firebase} from '../config'
import * as Location from 'expo-location';
import WeatherInfo from './WeatherInfo';
import { ArrowUpRightIcon } from "react-native-heroicons/solid";

const api_key = 'a3999e97ddb681be056baca3b261d939'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  const fetchWeatherData = async(cityName) => {
    try {
      setLoaded(false)
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}&units=imperial`)
      if(response.status === 200){
        const data = await response.json()
        setWeatherData(data)
      }
      else {
        setWeatherData(null)
      }
      setLoaded(true)
    } catch (error) {
      Alert.alert('Error',error.message)
    }
  }

  useEffect(() => {
    (async () => {
      const userRef = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
      const userData = (await userRef.get()).data()
      if(userData.location){
        setLocation(userData.location)
        fetchWeatherData(userData.location.city)
        setLocation(userData.location)
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();

        //i might refactor this
        if (status !== 'granted') {
          Alert.alert('Permission to access location is required to check local weather conditions');
          return;
        }

        let locationData = await Location.getCurrentPositionAsync({});
        const res = await Location.reverseGeocodeAsync(locationData.coords)
        fetchWeatherData(res[0].city)
        setLocation(res[0])
        userRef.update({location:res[0]})
      }

    })()
  }, [])

  if(!loaded){
    return (
      <View style={styles.container}>
        {/* like any splash screen you will need to add some of the UI here as a "preload" fake */}
        <View style={styles.header}>
        {/*triggers the weather panel expansion */}
      <ArrowUpRightIcon size={16} style={{color:'white',}}/>
      </View>
        <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size='large' color="green"/>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/*triggers the weather panel expansion this needs to be fed into weatherinfo but somehow passed upwards*/}
      {/* <ArrowUpRightIcon size={20} style={{color:'#034732',}}/> */}
      </View>
      <WeatherInfo weatherData={weatherData}/>
    </View>
  )
}

export default Weather

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    width: '50%',
    backgroundColor: '#E4F1E4',
    // borderTopWidth: 3,
    // borderRightWidth: 3,
    borderRightColor: '#034732',
    borderTopColor: '#034732',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  activityContainer: {
    flex: 1,
    width: '50%',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems:'center',
    // backgroundColor:'#034732',
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
    headerTitle: {
    color: 'white',
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '600'
  },

})
