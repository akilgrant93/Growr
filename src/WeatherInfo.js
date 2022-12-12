import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions } from 'react-native'
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
      <View styles={styles.logo}>
        <View style={{display: 'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <Image
        style={styles.largeIcon}
        // will be retooled for custom icons
        source={{uri: `http://openweathermap.org/img/wn/${icon}.png`}}
        />
        <Text style={styles.currentTemp}>{temp} ºF</Text>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>

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
    fontSize: 14,
    fontWeight:'bold',
    color: '#034732',
    marginTop: 10,
  },
  largeIcon: {
    width: 40,
    height: 40,
  },
  currentTemp: {
    fontSize: 10,
    fontWeight: 'bold',
    alignItems:'center',
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
