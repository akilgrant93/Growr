import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions } from 'react-native'
import moment from 'moment';
import React from 'react'

const WeatherInfo = ({weatherData}) => {
  const {
    name,
    visibility,
    weather: [{icon, description}],
    main: {temp, humidity, feels_like},
    wind: {speed},
    sys: {sunrise, sunset}
  } = weatherData
  return (
    <SafeAreaView style={styles.container}>
      <View style={{alignItems:'center'}}>
          <Text style={styles.title}>{name}</Text>
      </View>
      <Text style={styles.currentTemp}>{moment().format('MMMM d, YYYY')}</Text>
      <Text style={styles.currentTemp}>{moment().format('h:mma')}</Text>
        <Image
        style={styles.largeIcon}
        // will be retooled for custom icons
        source={{uri: `http://openweathermap.org/img/wn/${icon}.png`}}
        />
      <Text style={styles.currentTemp}>{description[0].toUpperCase()+description.slice(1)}</Text>
      <Text style={styles.currentTemp}>{temp} ºF</Text>

{/* these will load conditionally based on the user expanding the weather screen */}
      {/* <View style={styles.extraInfo}>
        <View style={styles.info}>
            <Image
              styles={styles.smallIcon}
              source={require('../assets/temp.png')}
            />
            <Text style={styles.infoText}>{feels_like} ºF</Text>
            <Text styles={styles.infoText}>Feels Like</Text>
        </View>
      </View> */}

    </SafeAreaView>
  )
}

export default WeatherInfo

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    width: '100%',
    textAlign:'center',
    fontSize: 19,
    fontWeight:'bold',
    color: '#034732',
    marginTop: 10,
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
