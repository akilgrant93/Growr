import { StyleSheet, Text, SafeAreaView, FlatList, View, Platform, TouchableOpacity, Animated, ImageBackground, Alert } from 'react-native'
import React, {useState,useEffect,useRef} from 'react'
import {firebase} from '../config'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { FontAwesome } from '@expo/vector-icons'
import DashboardListItem from './DashboardListItem'
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import Blink from './Blink'
import * as Location from 'expo-location';
import moment from 'moment';
import Weather from './Weather'
import LottieView from 'lottie-react-native';
import WeatherLoading from './WeatherLoading';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Dashboard = () => {
  const [name, setName] = useState('')
  const [hungry, toggleHungry] = useState(false)
  const [thirsty, toggleThirsty] = useState(false)
  const [indoor, toggleIndoor] = useState(false)
  const [outdoor, toggleOutdoor] = useState(false)
  const [potted, togglePotted] = useState(false)
  const [hydroponic, togglehydroponic] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [plants, setPlants] = useState([])
  const [plantsList, setPlantsList] = useState([])
  const [bottomReached, setBottomReached] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const [nextWateringDays, setNextWateringDays] = useState([])
  const userPlantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants').orderBy('nextWateringDate', 'asc')
  const notificationListener = useRef()
  const responseListener = useRef()

  useFocusEffect(
    React.useCallback(() => {
      setBottomReached(false)
    }, [])
  )

  const api_key = 'a3999e97ddb681be056baca3b261d939'
  let url = `https://api.openweathermap.org/data/2.5/onecall?&units=imperial&exclude=minutely&appid=${api_key}`;
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [weatherData, setWeatherData] = useState(null)
  const [weeklyForecast, setWeeklyForeCast] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [descriptionID, setDescriptionID] = useState([])

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

  useEffect(()=> {
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
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
    .then((snapshot) => {
      if(snapshot.exists){
        setName(snapshot.data())
      } else {
        console.log('User does not exist')
      }
    })
    userPlantsRef
    .onSnapshot(
      querySnapshot => {
        const plants = []
        const wateringDays = []
        querySnapshot.forEach((doc) => {
          plants.push({
            id: doc.id,
            name: doc.data().name,
            isPotted: doc.data().isPotted,
            isIndoors: doc.data().isIndoors,
            isThirsty: doc.data().isThirsty,
            isHydroponic: doc.data().isHydroponic,
            isSucculent: doc.data().isSucculent,
            notes: doc.data().notes,
            notificationInterval: doc.data().notificationInterval,
            notificationID: doc.data().notificationID,
            nextWateringDate: doc.data().nextWateringDate,
          })
          wateringDays.push(doc.data().nextWateringDate)
        })
        setPlants(plants)
        setPlantsList(plants)
        setNextWateringDays(wateringDays)
      }
    )

    //need to pull tags data to feed into plants Arr for more visual appeal
    // plants.forEach(plant => console.log(plant))

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      const plantRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants').doc(notification.request.content.data.firestoreplantID)
      plantRef.get().then(async (plant) => {
        if (plant.exists) {
          await plantRef.update({isThirsty: true});
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
       alert("Error getting document:", error);
    });
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });


    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])


  //delete a plant from users list of plant entries
  const deletePlant = (plant) => {
    const userPlantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants').orderBy('nextWateringDate', 'asc')

    userPlantsRef
    .doc(plant.id)
    .delete()
    .then(() => {
      alert('Deleted Successfully')
    })
    .catch( error =>{
      alert('Error deleting the plant')
    })
  }

  //this function will change plants array fed to flatlist as well
  const toggleEvent = (name) => {
    if(name === 'indoor'){
      if(indoor){
        setSelectedCategory('')
        setPlantsList(plants)
        toggleIndoor(false)
      } else {
        setPlantsList([...plants.filter((plant) => {
            return plant.isIndoors === true
          })])
        setSelectedCategory(name)
        toggleIndoor(true)
        toggleOutdoor(false)
        togglePotted(false)
        togglehydroponic(false)
        toggleHungry(false)
        toggleThirsty(false)
      }
    }

    if(name === 'outdoor'){
      if(outdoor){
        setSelectedCategory('')
        setPlantsList(plants)
        toggleOutdoor(false)
      } else {
        setPlantsList([...plants.filter((plant) => {
          return plant.isIndoors === false
        })])
        setSelectedCategory(name)
        toggleOutdoor(true)
        toggleIndoor(false)
        togglePotted(false)
        togglehydroponic(false)
        toggleHungry(false)
        toggleThirsty(false)
      }
    }

    if(name === 'potted'){
      if(potted){
        setSelectedCategory('')
        setPlantsList(plants)
        togglePotted(false)
      } else {
        setPlantsList([...plants.filter((plant) => {
          return plant.isPotted === true
        })])
        setSelectedCategory(name)
        togglePotted(true)
        toggleOutdoor(false)
        toggleIndoor(false)
        togglehydroponic(false)
        toggleHungry(false)
        toggleThirsty(false)
      }
    }

    if(name === 'hydroponic'){
      if(hydroponic){
        setSelectedCategory('')
        setPlantsList(plants)
        togglehydroponic(false)
      } else {
        setPlantsList([...plants.filter((plant) => {
          return plant.isHydroponic === true
        })])
        setSelectedCategory(name)
        togglehydroponic(true)
        togglePotted(false)
        toggleOutdoor(false)
        toggleIndoor(false)
        toggleHungry(false)
        toggleThirsty(false)
      }
    }

    if(name === 'hungry'){
      if(hungry){
        setSelectedCategory('')
        setPlantsList(plants)
        toggleHungry(false)
      } else {
        setPlantsList([...plants.filter((plant) => {
          return plant.isHungry === true
        })])
        setSelectedCategory(name)
        toggleHungry(true)
        togglePotted(false)
        toggleOutdoor(false)
        toggleIndoor(false)
        togglehydroponic(false)
        toggleThirsty(false)
      }
    }

    if(name === 'thirsty'){
      if(thirsty){
        setSelectedCategory('')
        setPlantsList(plants)
        toggleThirsty(false)
      } else {
        setPlantsList([...plants.filter((plant) => {
          return plant.isThirsty === true
        })])
        setSelectedCategory(name)
        toggleThirsty(true)
        togglePotted(false)
        toggleOutdoor(false)
        toggleIndoor(false)
        togglehydroponic(false)
        toggleHungry(false)
      }
    }
  }

  return (

    <SafeAreaView style={styles.formContainer}>
<View style={{height: '67.5%', backgroundColor: 'rgba(3, 71, 50, .5)', borderRadius: 25, overflow:'hidden'}}>
      <View style={{width:'90%'}}>
                  <View style={{flexDirection:'row', alignItems:'center', paddingVertical:10, paddingTop:30}}>
                    <Text style={{paddingLeft: 20, fontSize: 25, fontWeight: '900', color: '#fff'}}>Garden</Text>
                    <FontAwesome style={{paddingLeft: 5}}name='leaf' color='#034732'
                 size={22}
              />
                  </View>

                  <View style={[{marginHorizontal: '5%', flexDirection:'row', backgroundColor: '#F97068', padding: 5, borderRadius: 25, justifyContent:'center', marginBottom:5}, styles.shadow]}>
                    {/* refactor these into standalone components */}
                  <TouchableOpacity style={[{ padding: 7.5, borderRadius: 15, width: '50%',marginRight: 2}, thirsty ? {backgroundColor: '#fff'} : null]} onPress={() => toggleEvent('thirsty')}>
                          <Text style={[{fontSize: 14, fontWeight: 'bold', textAlign:'center'},  thirsty ? {color: '#034732'} : {color: 'white'}]}>
                                Needs Water
                          </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[{padding: 7.5, borderRadius: 15, width: '50%'}, hungry ? {backgroundColor: '#fff'} : null]} onPress={() => toggleEvent('hungry')}>
                          <Text style={[{fontSize: 14, fontWeight: 'bold', textAlign:'center'},  hungry ? {color: '#034732'} : {color: 'white'}]}>
                                Needs Fertilizer
                          </Text>
                      </TouchableOpacity>
                  </View>
                  <View style={[{marginHorizontal: '5%', flexDirection:'row', backgroundColor: '#034732', padding: 5, borderRadius: 25, justifyContent:'center', marginBottom:10}, styles.shadow]}>
                      <TouchableOpacity style={[{ padding: 7.5, borderRadius: 15, marginRight: 2}, indoor ? {backgroundColor: 'rgba(255,255,255,.25)'} : null]} onPress={() => toggleEvent('indoor')}>
                          <Text style={[{fontSize: 14, fontWeight: 'bold'},  indoor ? {color: '#F97068'} : {color: 'white'}]}>
                                Indoor
                          </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[{padding: 7.5, borderRadius: 15, marginRight: 2}, outdoor ? {backgroundColor: 'rgba(255,255,255,.25)'} : null]} onPress={() => toggleEvent('outdoor')}>
                          <Text style={[{fontSize: 14, fontWeight: 'bold'},  outdoor ? {color: '#F97068'} : {color: 'white'}]}>
                                Outdoor
                          </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[{ padding: 7.5, borderRadius: 15, marginRight: 2}, hydroponic ? {backgroundColor: 'rgba(255,255,255,.25)'} : null]} onPress={() => toggleEvent('hydroponic')}>
                          <Text style={[{fontSize: 14, fontWeight: 'bold'},  hydroponic ? {color: '#F97068'} : {color: 'white'}]}>
                                Hydroponic
                          </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[{ padding: 7.5, borderRadius: 15}, potted ? {backgroundColor: 'rgba(255,255,255,.25)'} : null]} onPress={() => toggleEvent('potted')}>
                          <Text style={[{fontSize: 14, fontWeight: 'bold'},  potted ? {color: '#F97068'} : {color: 'white'}]}>
                                Potted
                          </Text>
                      </TouchableOpacity>
                  </View>
      </View>

      <FlatList
        style={{backgroundColor:'rgba(3,71,50,.25)'}}
        showsVerticalScrollIndicator={false}
        data={plantsList}
        numColumns={1}
        ListEmptyComponent={
          <View style={{flexDirection:'row'}}>
            <View style={{width:'90%',}}>
                <Text style={{textAlign:'center', color:'white', fontSize: 20, fontWeight:'bold', marginTop: '5%'}}>No {selectedCategory} plants.</Text>
                <Svg
                style={{alignSelf:'center', marginTop: 5}}
                fill={'rgba(255,255,255,.25)'}
                width={200}
                height={200}xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><Path d="M512 64c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 78.3 364 32 448 32h32c17.7 0 32 14.3 32 32zM0 128c0-17.7 14.3-32 32-32H64c123.7 0 224 100.3 224 224v32 96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352C100.3 352 0 251.7 0 128z"/></Svg>
            </View>
          </View>
        }
        onEndReached={() => setBottomReached(true)}
        renderItem={({item, index}) => {
            return (
                <DashboardListItem item={item} lastIdx={plants.length-1} index={index}/>
            )
        }}
      />

      {plantsList.length > 2 && bottomReached === false ?
      <Blink duration={1000}>
        <FontAwesome
        style={{position:'absolute', bottom:20, right:15}}
        color='rgba(249,112,104,.75)'
        name='sort-desc'
        size={30}
        />
      </Blink>
      : null}
</View>

      <View
      style={{flex: 1, width: '100%', shadowColor: '#000'}}>
        {/* conditional load moon */}


           {/* weatherLoading component goes here - background color will conditionall change based on an assumed sunrise and sunset of 5 am and 5 pm*/}
          {!loaded
          ?  <WeatherLoading />
          :
          //  this component should fade in on load
          <View style={{height: '85%',
          width: '90%', marginHorizontal: '5%', marginTop: '5%', position:'absolute', borderRadius:25, overflow:'hidden'}}>
          {/*
                sun and moon will go here conditionally based upon sunrise and sunset in weatherData - done

                - backgroundColor will load conditionally based upon sunrise and sunset - done

                there will be a general visibility toggle here as well - turns OFF during mist and rain (not shower rain)
                */}
              <ImageBackground style={[{overflow:'hidden', borderRadius: 25}, moment().valueOf()/1000 >= weatherData.sys.sunrise && moment().valueOf()/1000 <= weatherData.sys.sunset ? {backgroundColor:'rgba(249,112,104,.5)'}: {backgroundColor:'rgba(84,91,152,.75)'}]} source={moment().valueOf()/1000 >= weatherData.sys.sunrise && moment().valueOf()/1000 <= weatherData.sys.sunset ? require(`../assets/sun.png`) : require(`../assets/moon.png`)}>

            {/* snow layer ternary complete */}
            <ImageBackground imageStyle={{opacity:.8}} source={descriptionID[0] === 'snow' ? require(`../assets/weather/snow.gif`) : ''}>

            {/* rain layer - ternary complete */}
            <ImageBackground imageStyle={{height: '120%', overflow:'hidden', top:20}} style={{height:'100%'}} source={descriptionID[0] === 'light rain' || descriptionID[0] === 'heavy rain' || descriptionID[0] === 'drizzle' || descriptionID[0] === 'thunderstorm'? require(`../assets/rain.gif`) : ''}>

            {/* thunder layer ternary complete */}
              <ImageBackground  imageStyle={{height: '100%', overflow:'hidden', borderRadius:25, marginLeft:40}} style={{height:'100%'}} source={descriptionID[0] === 'thunderstorm' ? require(`../assets/thunderstorm.gif`) : ''}>

                {/* stars layer - ternary complete */}
                <ImageBackground imageStyle={{height: '100%', overflow:'hidden', borderRadius:25}} style={{height:'100%'}} source={moment().valueOf()/1000 >= weatherData.sys.sunrise && moment().valueOf()/1000 <= weatherData.sys.sunset ? '' : require(`../assets/stars.gif`)}>

                  {/* moving cloud layer */}
                  <ImageBackground imageStyle={{opacity:.75,top:-20}} source={descriptionID[1] === 800 ? '' : require(`../assets/clouds_1.gif`)}>

                    {/* static cloud layer */}
                    <ImageBackground imageStyle={descriptionID[1] === 802 ? {opacity:.5} : {opacity:.75}} source={descriptionID[1] < 800 || descriptionID[1] > 801 ? require(`../assets/clouds_2.png`) : ''}>

                        {/* mist layer - ternary complete */}
                        <ImageBackground imageStyle={{top:20}} style={{height:'100%'}} source={descriptionID[0] === 'atmosphere' ? require(`../assets/mist.png`) : ''}>
            <View style={[{flexDirection: 'row', justifyContent:'space-between', paddingHorizontal:'5%'}]}>


              <View style={{paddingTop:10, paddingTop:30, justifyContent:'space-between'}}>
                <View>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={{fontSize: 25, fontWeight: '900', color: '#fff'}}>Weather</Text>
                  </View>
                  <View style={styles.shadow}>
                  <View style={[{borderRadius: 25, overflow:'hidden', width: 225 ,paddingVertical: 5, paddingHorizontal: 10, marginTop:5}, moment().valueOf()/1000 >= weatherData.sys.sunrise && moment().valueOf()/1000 <= weatherData.sys.sunset ? {backgroundColor:'#545B98'} : {backgroundColor:'#F7716B'}]}>
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>{location.city}</Text>
                  </View>
                  </View>
                </View>

                  <View>
                      <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff', marginVertical:.5}}>{moment().format('MMMM D')}, {moment().format('YYYY')}</Text>
                      <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>{Math.round(weatherData.main.temp)}º F</Text>
                  </View>
              </View>
              <View style={{paddingVertical:10, paddingTop:140}}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: '#fff'}}>{weatherData.weather[0].description.slice(0,1).toUpperCase()+weatherData.weather[0].description.slice(1)}</Text>
                <Text style={{fontSize: 10, fontWeight: 'bold', color: '#fff'}}>H:{Math.round(weatherData.main.temp_max)}º | L:{Math.round(weatherData.main.temp_min)}º</Text>
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
          }
      </View>
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 5,
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden'
  },
  container2: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden'
  },
  innerContainer: {
     alignItems: 'center',
     flexDirection:'column',
     width: 100,
     marginLeft: 10,
  },
  itemHeading: {
    fontSize: 14,
    paddingTop: 10
  },
  subtitle: {
    fontSize: 14,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  deleteIcon: {
    fontSize: 14,
    alignSelf:'center'
  },
  notification: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
})

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
