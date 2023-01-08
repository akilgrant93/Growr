import { StyleSheet, Text, SafeAreaView, FlatList, View, Platform, TouchableOpacity, Animated, ImageBackground, Alert } from 'react-native'
import React, {useState,useEffect,useRef} from 'react'
import * as Location from 'expo-location';
import moment from 'moment';

const WeatherLoaded = (props) => {
  return (
    <View style={{height: '85%',
          width: '90%', marginHorizontal: '5%', marginTop: '5%', position:'absolute', borderRadius:25, overflow:'hidden'}}>
          {/*
                sun and moon will go here conditionally based upon sunrise and sunset in props.weatherData - done

                - backgroundColor will load conditionally based upon sunrise and sunset - done

                there will be a general visibility toggle here as well - turns OFF during mist and rain (not shower rain)
                */}
              <ImageBackground style={[{overflow:'hidden', borderRadius: 25}, moment().valueOf()/1000 >= props.weatherData.sys.sunrise && moment().valueOf()/1000 <= props.weatherData.sys.sunset ? {backgroundColor:'rgba(249,112,104,.5)'}: {backgroundColor:'rgba(84,91,152,.75)'}]} source={moment().valueOf()/1000 >= props.weatherData.sys.sunrise && moment().valueOf()/1000 <= props.weatherData.sys.sunset ? require(`../assets/sun.png`) : require(`../assets/moon.png`)}>

            {/* snow layer ternary complete */}
            <ImageBackground imageStyle={{opacity:.8}} source={props.descriptionID[0] === 'snow' ? require(`../assets/weather/snow.gif`) : ''}>

            {/* rain layer - ternary complete */}
            <ImageBackground imageStyle={{height: '120%', overflow:'hidden', top:20}} style={{height:'100%'}} source={props.descriptionID[0] === 'light rain' || props.descriptionID[0] === 'heavy rain' || props.descriptionID[0] === 'drizzle' || props.descriptionID[0] === 'thunderstorm'? require(`../assets/rain.gif`) : ''}>

            {/* thunder layer ternary complete */}
              <ImageBackground  imageStyle={{height: '100%', overflow:'hidden', borderRadius:25, marginLeft:40}} style={{height:'100%'}} source={props.descriptionID[0] === 'thunderstorm' ? require(`../assets/thunderstorm.gif`) : ''}>

                {/* stars layer - ternary complete */}
                <ImageBackground imageStyle={{height: '100%', overflow:'hidden', borderRadius:25}} style={{height:'100%'}} source={moment().valueOf()/1000 >= props.weatherData.sys.sunrise && moment().valueOf()/1000 <= props.weatherData.sys.sunset ? '' : require(`../assets/stars.gif`)}>

                  {/* moving cloud layer */}
                  <ImageBackground imageStyle={{opacity:.75,top:-20}} source={props.descriptionID[1] === 800 ? '' : require(`../assets/clouds_1.gif`)}>

                    {/* static cloud layer */}
                    <ImageBackground imageStyle={props.descriptionID[1] === 802 ? {opacity:.5} : {opacity:.75}} source={props.descriptionID[1] < 800 || props.descriptionID[1] > 801 ? require(`../assets/clouds_2.png`) : ''}>

                        {/* mist layer - ternary complete */}
                        <ImageBackground imageStyle={{top:20}} style={{height:'100%'}} source={props.descriptionID[0] === 'atmosphere' ? require(`../assets/mist.png`) : ''}>
            <View style={[{flexDirection: 'row', justifyContent:'space-between', paddingHorizontal:'5%'}]}>


              <View style={{paddingTop:10, paddingTop:30, justifyContent:'space-between'}}>
                <View>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={{fontSize: 25, fontWeight: '900', color: '#fff'}}>Weather</Text>
                  </View>
                  <View style={styles.shadow}>
                  <View style={[{borderRadius: 25, overflow:'hidden', width: 225 ,paddingVertical: 5, paddingHorizontal: 10, marginTop:5}, moment().valueOf()/1000 >= props.weatherData.sys.sunrise && moment().valueOf()/1000 <= props.weatherData.sys.sunset ? {backgroundColor:'#545B98'} : {backgroundColor:'#F7716B'}]}>
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>{props.location.city}</Text>
                  </View>
                  </View>
                </View>

                  <View>
                      <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff', marginVertical:.5}}>{moment().format('MMMM D')}, {moment().format('YYYY')}</Text>
                      <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>{Math.round(props.weatherData.main.temp)}º F</Text>
                  </View>
              </View>
              <View style={{paddingVertical:10, paddingTop:140}}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>{props.weatherData.weather[0].description.slice(0,1).toUpperCase()+props.weatherData.weather[0].description.slice(1)}</Text>
                <Text style={{fontSize: 10, fontWeight: 'bold', color: '#fff'}}>H:{Math.round(props.weatherData.main.temp_max)}º | L:{Math.round(props.weatherData.main.temp_min)}º</Text>
              </View>
            </View>
                        </ImageBackground>

                    </ImageBackground>
                  </ImageBackground>
              </ImageBackground>
            </ImageBackground>
              </ImageBackground>
            </ImageBackground>

            </ImageBackground>

          </View>
  )
}

export default WeatherLoaded

const styles = StyleSheet.create({})
