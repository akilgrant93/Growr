import { StyleSheet, Text, SafeAreaView, FlatList, View, Platform, TouchableOpacity } from 'react-native'
import React, {useState,useEffect,useRef} from 'react'
import {firebase} from '../config'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { FontAwesome } from '@expo/vector-icons'
import DashboardListItem from './DashboardListItem'
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import Blink from './Blink'
import Weather from './Weather';
import Animated, { FadeInLeft } from 'react-native-reanimated';

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
  const [loadedFirebase, setLoadedFirebase] = useState(false)
  const userPlantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants').orderBy('nextWateringDate', 'asc')
  const notificationListener = useRef()
  const responseListener = useRef()

  useFocusEffect(
    React.useCallback(() => {
      setBottomReached(false)
    }, [])
  )
  useEffect(()=> {
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
          console.log(doc.data().firebaseID)
          plants.push({
            id: doc.data().firebaseID,
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
            tags: doc.data().tags


          })
          wateringDays.push(doc.data().nextWateringDate)
        })
        setPlants(plants)
        setPlantsList(plants)
        setLoadedFirebase(true)
      }
    )

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
    <View style={{width: '100%', height: '100%', backgroundColor:'#034732'}}>
        <SafeAreaView style={[styles.formContainer, styles.shadow]}>
<View style={[{height: '73.5%', width:'90%'}, plantsList.length > 0 ? {height: '73.5%'} : {height: '24.5%'}]}>
      <View style={{borderRadius: 25, overflow:'hidden', backgroundColor: '#82A398'}}>
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
        style={[{overflow:'hidden', marginTop: 10, borderRadius:10}, styles.shadow]}
        showsVerticalScrollIndicator={false}
        data={plantsList}
        numColumns={1}
        onEndReached={() => setBottomReached(true)}
        renderItem={({item, index}) => {
            return (
                <DashboardListItem item={item} lastIdx={plants.length-1} index={index}/>
            )
        }}
      />

      {plantsList.length > 2 && bottomReached === false ?
      <Blink delay={500} duration={1000}>
        <FontAwesome
        style={{position:'absolute', bottom:20, right:15}}
        color='rgba(249,112,104,.75)'
        name='sort-desc'
        size={30}
        />
      </Blink>
      : null}
</View>


          {plantsList.length > 0 ? null : <Animated.View entering={FadeInLeft} duration={500} style={[{flexDirection:'row', backgroundColor:'#fff', borderRadius: 25, overflow:'hidden', paddingVertical: '10.5%', marginTop: 10}, styles.shadow]}>
            <View style={{width:'90%'}}>
                <Text style={{textAlign:'center', color:'#82A398', fontSize: 20, fontWeight:'bold', marginTop: '5%'}}>No {selectedCategory} plants.</Text>
                <Svg
                style={{alignSelf:'center', marginTop: 5}}
                fill={'#82A398'}
                width={200}
                height={200}xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><Path d="M512 64c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 78.3 364 32 448 32h32c17.7 0 32 14.3 32 32zM0 128c0-17.7 14.3-32 32-32H64c123.7 0 224 100.3 224 224v32 96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352C100.3 352 0 251.7 0 128z"/></Svg>
            </View>
          </Animated.View>}

      <View
      style={{flex: 1}}>
        <Weather />
      </View>
    </SafeAreaView>
    </View>
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
    backgroundColor: "rgba(240,240,240,.25)",
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
  },
  shadow2: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.5,
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
