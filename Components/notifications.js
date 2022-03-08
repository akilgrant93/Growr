import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect } from 'react'
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
  const [token, setToken] = useState({});

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
    setToken(token)
    return token;
  }

  const _handleNotification = notification => {
    setNotification({ notification });
  };

  const _handleNotificationResponse = response => {
    console.log(response);
  };

  useEffect( () => {
    registerForPushNotificationsAsync();
    Notifications.addNotificationReceivedListener(_handleNotification);
    Notifications.addNotificationResponseReceivedListener(_handleNotificationResponse);
  }, [])

  return (
    <View>

    </View>
  )
}
