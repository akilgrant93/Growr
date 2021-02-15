import React, { useState, useEffect, useRef } from 'react'
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import Routes from './Components/Routes'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import applyMiddleWare from 'redux/src/applyMiddleware'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import LoginForm from './Components/LoginForm'
import firebase from 'firebase'
import Loading from './Components/Loading'
import {decode, encode} from 'base-64'
import { SafeAreaProvider } from 'react-native-safe-area-context';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

  export default function App(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [uid, setUid] = useState('');
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
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
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }, []);

    useEffect(() => {
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          setIsLoggedIn(true)
          setUid(user.uid)
        }else{
          setIsLoggedIn(false)
        }
   })
     }, [])

  const renderContent = () => {
    switch(isLoggedIn){
      case false:
        return <LoginForm />
      case true:
        return <Routes />
        default:
          return <Loading />
    }
  }

  const state = createStore(reducers, {}, applyMiddleWare(ReduxThunk))

  return (
      <SafeAreaProvider>
      <Provider store={state}>
        {renderContent()}
      </Provider>
      </SafeAreaProvider>
    )
}

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
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

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
