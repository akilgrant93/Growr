import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions } from 'react-native'
import moment from 'moment';
import React, {useEffect} from 'react'

const WeatherInfo = ({weatherData, pressed, forecast}) => {

  const {
    name,
    visibility,
    weather: [{icon, description}],
    main: {temp_max, temp_min,humidity, feels_like},
    wind: {speed},
    sys: {sunrise, sunset}
  } = weatherData;

  // use sunrise and sunset to configure day/night shifts
  return (
    <SafeAreaView style={styles.container}>
        <View style={{marginTop: 8, width: '100%'}}>

        <Text style={styles.title}>{name}</Text>

        <View style={{backgroundColor: '#F97068', width: '80%', alignSelf:'center', borderRadius: 5, padding: 2, marginTop: 2}}>
      <Text style={[styles.currentTemp, {color: 'white'}]}>{moment().format('ddd')}, {moment().format('MMM do')}</Text>
      <Text style={[styles.currentTemp, {color: 'white'}]}>{moment().format('h:mma')}</Text>
        </View>

        <Image
        style={styles.largeIcon}
        // will be retooled for custom icons
        source={{uri: `http://openweathermap.org/img/wn/${icon}.png`}}
        />

        <View style={{backgroundColor: 'rgba(3, 71, 50, .5)', width: '80%', alignSelf:'center', borderRadius: 5, padding: 2}}>
      <Text style={[styles.currentTemp, {color: 'white'}]}>{description[0].toUpperCase()+description.slice(1)}</Text>
      <Text style={[styles.currentTemp, {color: 'white'}]}>H:{Math.round(temp_max)}ºF | L:{Math.round(temp_min)}ºF</Text>
        </View>

      </View>
    </SafeAreaView>
  )
}

export default WeatherInfo

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign:'center',
    alignSelf:'center',
    fontSize: 15,
    fontWeight:'bold',
  },
  largeIcon: {
    width: 100,
    height: 100,
    alignSelf:'center',
  },
  currentTemp: {
    fontSize: 10,
    color: '#034732',
    fontWeight: 'bold',
    alignSelf:'center',
  },
  description: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign:'center',
    marginBottom: 5,
  },
  extraInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 7,
  },
  info: {
    width: Dimensions.get('screen').width/2.5,
    backgroundColor: '#D0EAFA',
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
  },
  smallIcon: {
    height: 20,
    width: 20,
    borderRadius: 20/2,
    marginLeft: 50,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 12,
  },
})
