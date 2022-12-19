import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { firebase } from './config'
import { FontAwesome } from '@expo/vector-icons'
import { CalendarDaysIcon, PlusCircleIcon } from 'react-native-heroicons/solid';
import * as Location from 'expo-location';
import Signin from "./src/Signin";
import Registration from "./src/Registration";
import Dashboard from "./src/Dashboard";
import Header from "./src/Header";
import MyCalendar from "./src/Calendar";
import SearchPlant from "./src/SearchPlant";
import PostModal from "./src/PostModal";
import UpdateModal from './src/UpdateModal';
import PlantsByCategory from './src/PlantsByCategory';

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

function Home() {
  const changeLocation = async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location is required to check local weather conditions');
      return;
    }
    const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    let locationData = await Location.getCurrentPositionAsync({});
    const res = await Location.reverseGeocodeAsync(locationData.coords)
    userRef.update({location:res[0]})
  }

  const changePassword = async() => {
    const userRef = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    const userData = (await userRef.get()).data()
    firebase.auth().sendPasswordResetEmail(userData.email)
    .then(() => {
      alert('Password reset email sent')
    }).catch((error) => {
      alert(error)
    })
  }

  return (
    <Tab.Navigator>
      <Tab.Screen
      name="My Garden"
      label="My Garden"
      component={Dashboard}
      options={({route}) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
              {
                text: "Change Password",
                onPress: () => changePassword()
              },
              {
                text: "Change Location",
                onPress: () => changeLocation(),
              },
              {
                text: "Cancel",
                style: "cancel"
              }
            ]
          )}>
            <FontAwesome
                  name='gear'
                   color='#034732'
                   size={20}
                   style={{marginRight: 10}}
                />
          </TouchableOpacity>
        ),
        tabBarIcon: ({color, size}) => (
          <FontAwesome
                name='leaf'
                 color='#034732'
                 size={size}
              />
        ),
      })}
      />
      <Tab.Screen
      name="Plants"
      label="Planst"
      component={SearchPlant}
      options={({route}) => ({
        tabBarIcon: ({color, size}) => (
          <PlusCircleIcon size={size} style={{color:'#034732'}}/>
        ),
      })}
      />
      <Tab.Screen
      name="Calendar"
      label="Calendar"
      component={MyCalendar}
      options={({route}) => ({
        tabBarIcon: ({color, size}) => (
          <CalendarDaysIcon size={size} style={{color:'#034732'}}/>
        ),
      })}
      />
    </Tab.Navigator>
  );
}

function App(){
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()

  //handle user state changes
  function onAuthStateChanged(user){
    setUser(user)
    if(initializing){setInitializing(false)}
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  if(initializing) return null;

  if(!user){
    return (
      <Stack.Navigator>
        <Stack.Screen
        name="Sign In"
        component={Signin}
        options={{
          headerTitle: () => <Header name="Growr"/>,
          headerStyle: {
            height: 150,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            backgroundColor: '#00e4d0',
            shadowColor: '#000',
            elevation: 25,
          }
        }}
        />
        <Stack.Screen
        name="Registration"
        component={Registration}
        options={{
          headerTitle: () => <Header name="Growr"/>,
          headerStyle: {
            height: 150,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            backgroundColor: '#00e4d0',
            shadowColor: '#000',
            elevation: 25,
          }
        }}
        />
      </Stack.Navigator>
    )
  }

  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Group>
      <Stack.Screen
        name="Home"
        component={Home}
        />
        </Stack.Group>
        <Stack.Group screenOptions={{
          presentation: 'modal',
          headerShown:false  }}>
        <Stack.Screen
        name="UpdateModal"
        component={UpdateModal}
        />
        <Stack.Screen
        name="PostModal"
        component={PostModal}
        />
        <Stack.Screen
        name="PlantsByCategory"
        options={{ title: 'My profile' }}
        component={PlantsByCategory}
        />
        </Stack.Group>
    </Stack.Navigator>
  )
}

export default () => {
  return (
    <NavigationContainer>
      <App/>
    </NavigationContainer>
  )
}
