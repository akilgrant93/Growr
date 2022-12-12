import { StyleSheet, Text, SafeAreaView, FlatList, View, Platform } from 'react-native'
import React, {useState,useEffect,useRef} from 'react'
import {firebase} from '../config'
import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Pressable } from 'react-native'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Weather from './Weather'

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
  const [isLoading, setIsLoading] = useState(true)
  const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
  const navigation = useNavigation( )
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
    plantsRef
    .orderBy('nextWateringDate', 'asc')
    .onSnapshot(
      querySnapshot => {
        const plants = []
        querySnapshot.forEach((doc) => {
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
        })
        setPlants(plants)
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
  const deletePlant = (userPlants) => {
    plantsRef
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
        data={plants}
        numColumns={2}
        renderItem={({item}) => (
          <View style={{width:'50%'}}>
            <Pressable
              style={styles.container}
              onPress={() => navigation.navigate('UpdateModal', {item})}
            >
              <View style={{flexDirection: 'row'}}>
              <View style={{backgroundColor:'#034732', height: 90, width: 40, justifyContent:'center'}}
              onPress={() => deletePlant(item)}
              >
              <FontAwesome
                name='trash-o'
                 color='white'
                 style={styles.deleteIcon}
                 onPress={() => deletePlant(item)}
              />
              </View>
              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>

                  {item.name.split(' ').map((word) => {
                    return word[0].toUpperCase() + word.substr(1);
                  }).join(' ')}
                </Text>
                <Text style={styles.subtitle}>
                  {item.isPotted || item.isIndoors ? 'Potted' : ''}
                </Text>
                <Text style={styles.subtitle}>
                  {!item.isIndoors ? 'Outdoor' : ''}
                </Text>
                <Text style={styles.subtitle}>
                  {item.isHydroponic ? 'Hydroponic' : ''}
                </Text>
              </View>
              </View>
            </Pressable>
          </View>
        )}
      />
      {/* {isLoading
      ? <Text>Fetching The Weather</Text>
      : <View> */}
          <Weather />
        {/* </View>} */}
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E4F1E4',
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
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
