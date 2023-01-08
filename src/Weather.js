import { StyleSheet, Text, View, Alert, ActivityIndicator,SafeAreaView, Image, ImageBackground, } from 'react-native'
import React, { useState, useEffect } from 'react'
import {firebase} from '../config'
import * as Location from 'expo-location';
import moment from 'moment';
import WeatherLoading from './WeatherLoading';
import WeatherLoaded from './WeatherLoaded';


const Weather = () => {

  const api_key = 'a3999e97ddb681be056baca3b261d939'
  const url = `https://api.openweathermap.org/data/2.5/onecall?&units=imperial&exclude=minutely&appid=${api_key}`;
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [weeklyForecast, setWeeklyForeCast] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [descriptionID, setDescriptionID] = useState([]);


  const fetchWeatherData = async(cityName) => {
    try {
      setLoaded(false)
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}&units=imperial`)
      if(response.status === 200){
        const data = await response.json()
        setWeatherData(data)
        console.log('weather data',data.sys)
        if(data.weather[0].id.toString()[0] === '2'){
          setDescriptionID(['thunderstorm',data.weather[0].id])
        }
        else if(data.weather[0].id.toString()[0] === '3'){
          setDescriptionID(['drizzle', data.weather[0].id])
        }
        else if(data.weather[0].id >= 500 && data.weather[0].id <= 504){
          setDescriptionID(['heavy rain', data.weather[0].id])
        }
        else if(data.weather[0].id >= 520 && data.weather[0].id <= 531){
          setDescriptionID(['light rain', data.weather[0].id])
        }
        else if(data.weather[0].id.toString()[0] === '6' || data.weather[0].id === 511){
          setDescriptionID(['snow', data.weather[0].id])
        }
        else if(data.weather[0].id.toString()[0] === '7'){
          setDescriptionID(['atmosphere', data.weather[0].id])
        }
        else if(data.weather[0].id === 800){
          setDescriptionID(['clear', data.weather[0].id])
        }
        else if(data.weather[0].id === 801){
          setDescriptionID(['few clouds', data.weather[0].id])
        }
        else if(data.weather[0].id === 802){
          setDescriptionID(['scattered clouds', data.weather[0].id])
        }
        else if(data.weather[0].id === 803){
          setDescriptionID(['broken clouds', data.weather[0].id])
        }
        else if(data.weather[0].id === 804){
          setDescriptionID(['overcast clouds', data.weather[0].id])
        }
      }
      else {
        setWeatherData(null)
      }

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

  if(!loaded){
    return (
      <WeatherLoading />
    )
  }

  return (
    <WeatherLoaded weatherData={weatherData} descriptionID={descriptionID} location={location}/>
  )
}

export default Weather

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#E4F1E4',
    borderTopRightRadius: 5,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  activityContainer: {
    flex: 1,
    backgroundcolor: '#034732',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems:'center',
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  }
})
