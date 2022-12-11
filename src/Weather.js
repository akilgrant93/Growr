import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location';
import WeatherInfo from './WeatherInfo';

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
    //need a function to get the users city to feed this function

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location is required to check local weather conditions');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      const res = await Location.reverseGeocodeAsync(locationData.coords)
      fetchWeatherData(res[0].city)
      setLocation(res[0])
    })()
  }, [])

  if(!loaded){
    return (
      <View style={styles.activityContainer}>
        {/* like any splash screen you will need to add some of the UI here as a "preload" fake */}
        <ActivityIndicator size='large' color="green"/>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.headerTitle}>Weather</Text>
      </View>
      <WeatherInfo weatherData={weatherData}/>
    </View>
  )
}

export default Weather

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    width: '50%',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  activityContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems:'center',
    backgroundColor:'#c5d2ef',
    width: '100%',
    justifyContent: 'center'
  },
  headerTitle: {
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },

})
