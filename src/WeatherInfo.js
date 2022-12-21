import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions } from 'react-native'
import moment from 'moment';
import React, {useEffect} from 'react'
'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

const WeatherInfo = ({weatherData, pressed, forecast}) => {
  useEffect(() => {
    // console.log(weatherData)
  }, [])
  const uas = useAnimatedStyle(() => {
    return {
      // marginLeft: withSpring(pressed.value ? '0%' : '0%'),
      width: withSpring(pressed.value ? '40%' : '100%'),
    };
  });

  // const forecastAnim = useAnimatedStyle(() => {
  //   return {
  //     marginLeft: withSpring(pressed.value ? '0%' : '0%')
  //   }
  // })

  const {
    name,
    visibility,
    weather: [{icon, description}],
    main: {temp, humidity, feels_like},
    wind: {speed},
    sys: {sunrise, sunset}
  } = weatherData;

  // use sunrise and sunset to configure day/night shifts
  return (
    <SafeAreaView style={styles.container}>
      <View style={{width: '100%', flexDirection:'row'}}>

      <Animated.View style={[uas]}>
        <View style={{marginTop: 8}}>
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
      <View style={{backgroundColor: 'rgba(3, 71, 50, .5)', width: '60%', alignSelf:'center', borderRadius: 5, padding: 2}}>
      <Text style={[styles.currentTemp, {color: 'white'}]}>{description[0].toUpperCase()+description.slice(1)}</Text>
      <Text style={[styles.currentTemp, {color: 'white'}]}>{temp} ºF</Text>
      </View>
        </View>
      </Animated.View>

      {/* weekly forecast */}
      <Animated.View style={[{flexDirection:'column',  marginTop: 7.5, width: '100%'}]}>
      {forecast.map((dailyForecast, idx) => {
        // console.log(dailyForecast.temp)
        if(idx > 0){return <View key={idx} style={{flexDirection:'row', backgroundColor:'white', borderRadius: 5, padding: 2, paddingLeft: 5, marginBottom: 1}}>
          <Text style={[{fontSize: 10, color:'#034732'}, {marginRight: 5, width: '33%'}]}>{moment().add(idx,'days').format('ddd')}, {moment().add(idx,'days').format('MMM Do')}</Text>

          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Image
            style={{width: 20, height: 20, marginRight: 5}}
            // will be retooled for custom icons
            source={{uri: `http://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}.png`}}
            />
          <Text style={{fontSize: 10, color:'#034732'}}>{dailyForecast.weather[0].description}</Text>
          </View>
        </View>}
      })}
      </Animated.View>

      </View>

    </SafeAreaView>
  )
}

export default WeatherInfo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
