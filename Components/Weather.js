import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView, ScrollView, FlatList, Alert, RefreshControl } from 'react-native';
import Carousell from './carousel'
import * as Location from 'expo-location';

// import { openWeatherKey } from './Secrets';
const openWeatherKey = `a3999e97ddb681be056baca3b261d939`;
let url = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}`;


const weather = () => {

  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [geocode, setGeocode] = useState(null)
  const [location, setLocation] = useState(null)

  const getGeocodeAsync= async (location) => {
    let geocode = await Location.reverseGeocodeAsync(location)
    setGeocode(geocode)
  }

  const loadForecast = async () => {
    setRefreshing(true);

    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    const { latitude , longitude } = location.coords
    getGeocodeAsync({latitude, longitude})
    setLocation({latitude, longitude})
    const response = await fetch( `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
    const data = await response.json();

    if(!response.ok) {
      Alert.alert(`Error retrieving weather data: ${data.message}`);
    } else {
      setForecast(data);
    }
    setRefreshing(false);
  }

  useEffect(() => {
    if (!forecast) {
      loadForecast();
    }
  })

  if (!forecast) {
    return <SafeAreaView style={styles.loading}>
      <ActivityIndicator size="large" />
      </SafeAreaView>;
  }

  // TODO: In an upcoming blog post, I'll be extracting components out of this class as you would in a real application.
  return (
    <SafeAreaView style={styles.container}>
      <Carousell fiveday={forecast.daily.slice(0,5)}/>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    color: '#e96e50',
  },
  subtitle: {
    fontSize: 10,
    marginVertical: 6,
    marginLeft: 4,
    color: '#e96e50',
  },
  container: {
    flex: 1,
    width: '67.5%',
    marginLeft: '2.5%',
    marginBottom: '5%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loading: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  currentTemp: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  currentDescription: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 10,
    marginBottom: 10
  },
  hour: {
    padding: 6,
    alignItems: 'center',
  },
  day: {
    flexDirection: 'row',
  },
  dayDetails: {
    justifyContent: 'center',
  },
  dayTemp: {
    marginLeft: 12,
    alignSelf: 'center',
    fontSize: 10
  },
  largeIcon: {
    width: '25%',
  },
  smallIcon: {
    width: '10%',
  }
});

export default weather;
