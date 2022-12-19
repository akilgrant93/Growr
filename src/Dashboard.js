import { StyleSheet, Text, SafeAreaView, FlatList, View, Platform, TouchableOpacity } from 'react-native'
import React, {useState,useEffect,useRef} from 'react'
import {firebase} from '../config'
import { useNavigation } from '@react-navigation/native'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Weather from './Weather'
import NextWateringDate from './NextWateringDate'
import CustomSVG from './CustomSVG'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Dashboard = () => {
  const [name, setName] = useState('')
  const [plants, setPlants] = useState([])
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [nextWateringDays, setNextWateringDays] = useState([])
  const userPlantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants').orderBy('nextWateringDate', 'asc')
  const navigation = useNavigation()
  const notificationListener = useRef();
  const responseListener = useRef();

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
          console.log(doc.data())
          plants.push({
            id: doc.id,
            name: doc.data().name,
            isPotted: doc.data().isPotted,
            isIndoors: doc.data().isIndoors,
            isHydroponic: doc.data().isHydroponic,
            isSucculent: doc.data().isSucculent,
            notes: doc.data().notes,
            notificationInterval: doc.data().notificationInterval,
            notificationID: doc.data().notificationID,
            firestoreID: doc.data().firestoreID,
          })
          wateringDays.push(doc.data().nextWateringDate)
        })
        setPlants(plants)
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
  const deletePlant = (userPlants) => {
    userPlantsRef
    .doc(userPlants.id)
    .delete()
    .then(() => {
      alert('Deleted Successfully')
    })
    .catch( error =>{
      alert('Error deleting the plant')
    })
  }

  return (
    <SafeAreaView style={styles.formContainer}>
      <FlatList
        style={{height: '40%',width: '100%', paddingTop: 5}}
        data={plants}
        numColumns={1}
        renderItem={({item, index}) => {
            return (
            <View key={item.index || index}>
              <View style={{
              flexDirection: 'column',
              width: '95%',
              marginLeft: '2.5%',
              marginBottom: 1,
              flex:1,
              }}>
                {/* neeeds indoors and tags modularity */}
                  <TouchableOpacity
                  onPress={() => navigation.navigate('UpdateModal',item)}>
                    <View style={{ flexDirection: 'row',
                     overflow:'hidden',justifyContent: 'space-between',
                    shadowOpacity: .25,shadowOffset: {width:1,height:1}, shadowRadius: 2, borderRadius: 5, backgroundColor: '#fff' }}>
                      <View style={styles.textView}>

                      <View style={{marginLeft: 35, alignSelf:'center'}}>
                      <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                        {item.name}
                      </Text>
                      </View>
                      </View>
                    </View>
                  </TouchableOpacity>
              </View>
            </View>
            )
        }}
      />

      <View style={{flex: 1, width: '100%', flexDirection:'row', shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5}}>
          <Weather />
          <NextWateringDate nextWateringDays={nextWateringDays}/>
      </View>
        {/* </View>} */}
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
    justifyContent: 'flex-end',
    backgroundColor: '#C9E4CA',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  deleteIcon: {
    fontSize: 14,
    alignSelf:'center'
  },
  textView: {
    height: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
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
