import { StyleSheet, Text, View, Alert, ActivityIndicator,SafeAreaView, } from 'react-native'
import React, { useState, useEffect } from 'react'
import Svg, { Path } from 'react-native-svg'
import {firebase} from '../config'
import * as Location from 'expo-location';
import WeatherInfo from './WeatherInfo';
import moment from 'moment';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring
} from 'react-native-reanimated';

const api_key = 'a3999e97ddb681be056baca3b261d939'

const Weather = () => {
  let url = `https://api.openweathermap.org/data/2.5/onecall?&units=imperial&exclude=minutely&appid=${api_key}`;

  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [weatherData, setWeatherData] = useState(null)
  const [weeklyForecast, setWeeklyForeCast] = useState({})
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

      console.log(latitude)
      console.log(longitude)
      const forecastResponse = await fetch( `${url}&lat=${latitude}&lon=${longitude}`);
      if(forecastResponse.status === 200){
        const data = await forecastResponse.json()
        setWeeklyForeCast(data.daily)
      } else {
        setWeeklyForeCast(null)
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
        fetchWeatherData(userData.location.city,)
      }
      let { status } = await Location.requestForegroundPermissionsAsync();

      //i might refactor this
      if (status !== 'granted') {
        Alert.alert('Permission to access location is required to check local weather conditions');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});

      setLatitude(locationData.coords.latitude)
      setLongitude(locationData.coords.longitude)
      const res = await Location.reverseGeocodeAsync(locationData.coords)
      fetchWeatherData(res[0].city)
      setLocation(res[0])
      userRef.update({location:res[0]})

    })()
  }, [])

  const pressed = useSharedValue(false);
  const scaleAnimation = useAnimatedStyle(() => {
    return {
      width: withSpring(pressed.value ? '100%' : '50%') ,
    };
  });

  const expand = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true;
    },
    onEnd: (event, ctx) => {
      pressed.value = false;
    },
  });


  if(!loaded){
    return (
      <View style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size='large' color="green"/>
        </View>
        </SafeAreaView>
      </View>
    )
  }


  return (
    <TapGestureHandler onGestureEvent={expand} >
      <Animated.View style={[styles.container, scaleAnimation]}>
      <WeatherInfo pressed={pressed} weatherData={weatherData}forecast={weeklyForecast}/>
      </Animated.View>
    </TapGestureHandler>
  )
}

export default Weather

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '50%',
    backgroundColor: '#E4F1E4',
    borderTopRightRadius: 5,
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
  title: {
    width: '100%',
    textAlign:'center',
    fontSize: 19,
    fontWeight:'bold',
    color: '#034732',
    marginTop: 10,
  },
  txt: {
    fontSize: 10,
    color: '#034732',
    fontWeight: 'bold',
    alignSelf:'center',
  },
})
