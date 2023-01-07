import { StyleSheet, Text, View, Alert, ActivityIndicator,SafeAreaView, Image, ImageBackground, } from 'react-native'
import React, { useState, useEffect } from 'react'
import {firebase} from '../config'
import * as Location from 'expo-location';
import moment from 'moment';
import LottieView from 'lottie-react-native';

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
      <View style={{height: '85%',  backgroundColor:'rgba(249,112,104,.5)', borderRadius: 25, width: '90%', marginLeft: '5%', marginTop: '5%'}}>
        <View style={{flexDirection:'row', alignItems:'center', paddingVertical:10, paddingTop:30}}>
          <Text style={{paddingLeft: 20, fontSize: 25, fontWeight: 'bold', color: '#034732'}}>Weather</Text>
        </View>
      </View>
    )
  }


  return (
    <View style={{height: '85%',
    // backgroundColor:'rgba(249,112,104,.5)',
     width: '90%', marginHorizontal: '5%', marginTop: '5%'}}>

        {/* sun and moon will go here conditionally based upon sunrise and sunset in weatherData - backgroundColor will load conditionally based upon sunrise and sunset - maybe slow transition animation*/}


      <ImageBackground style={{backgroundColor:'rgba(249,112,104,.5)', borderRadius:25, overflow:'hidden'}} source={require(`../assets/weather/sun.png`)}
      >

      {/* cloud conditions depicted here */}
        <ImageBackground source={require(`../assets/weather/few_clouds.png`)} imageStyle={{height: '100%', overflow:'hidden', borderRadius:25}} style={{height:'100%'}}>

        {/* <ImageBackground source={require(`../assets/weather/scattered_clouds.gif`)} imageStyle={{height: '100%', overflow:'hidden', borderRadius:25}} style={{height:'100%'}}> */}



        <ImageBackground source={require(`../assets/weather/broken_clouds.png`)} imageStyle={{height: '100%', overflow:'hidden', borderRadius:25}} style={{height:'100%'}}>


          <ImageBackground source={require(`../assets/weather/snow.gif`)} imageStyle={{height: '100%', overflow:'hidden', borderRadius:25}} style={{height:'100%'}}>

      <View style={[{flexDirection: 'row', justifyContent:'space-between', paddingHorizontal:'5%'}, styles.shadow]}>


        <View style={{paddingVertical:10, paddingTop:30}}>
            {/* <Text style={{fontSize: 22, fontWeight: 'bold', color: '#034732', paddingBottom: 50}}>Weather</Text> */}
            <View style={{flexDirection:'row', alignItems:'center', paddingBottom: 80}}>
          <Text style={{fontSize: 25, fontWeight: '900', color: '#034732'}}>{location.city}</Text>
        </View>
            <Text style={{fontSize: 12, fontWeight: 'bold', color: '#034732', marginVertical:.5}}>{moment().format('MMMM D')}, {moment().format('YYYY')}</Text>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#034732'}}>{Math.round(weatherData.main.temp)}º F</Text>
        </View>
        <View style={{paddingVertical:10, paddingTop:140}}>
          <Text style={{fontSize: 12, fontWeight: 'bold', color: '#034732'}}>{weatherData.weather[0].description.slice(0,1).toUpperCase()+weatherData.weather[0].description.slice(1)}</Text>
          <Text style={{fontSize: 10, fontWeight: 'bold', color: '#034732'}}>H:{Math.round(weatherData.main.temp_max)}º | L:{Math.round(weatherData.main.temp_min)}º</Text>
        </View>
      </View>
          </ImageBackground>
          </ImageBackground>
          {/* </ImageBackground> */}

        </ImageBackground>
      </ImageBackground>
    </View>
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
