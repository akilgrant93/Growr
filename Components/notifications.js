import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import firebase from '../fb'
import React, { useState, useEffect, useRef } from 'react'
import { View } from 'native-base'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

//the token likely needs to be added to firebase in order to setup notification cancellation
export default function MyNotifications() {
  const [notification, setNotification] = useState({});
  const [expoPushToken, setExpoPushToken] = useState({});
  const notificationListener = useRef();
  const responseListener = useRef();

  //change permissions async as per notifications module guidelines (on expo docs)

  const registerForPushNotificationsAsync = async() => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const uid = firebase.auth().currentUser.uid

    firebase.database().ref(`/users/${uid}/token`).on('value', (snapshot) => {
      if (snapshot.val() === null){
        firebase.database().ref(`/users/${uid}/token`).push(token)
      }
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.name);
    })

    console.log('TOKEN',token)
    return token;
  }

  useEffect( () => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])

  return (
    <View>

    </View>
  )
}
