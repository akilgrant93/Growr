import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from "react";
import { TouchableOpacity, Alert, View } from "react-native";
import { firebase } from './config'
import { FontAwesome } from '@expo/vector-icons'
import Svg, { Path } from 'react-native-svg'
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
          <View style={{flexDirection:'row', marginRight: 10}}>
          <TouchableOpacity onPress={() => Alert.alert(
            "Settings",
            '',
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
          <TouchableOpacity onPress={() => {firebase.auth().signOut()}}>
          <Svg xmlns="http://www.w3.org/2000/svg" height={20} fill={'#034732'} width={20} viewBox="0 0 512 512"><Path d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32H320v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z"/></Svg>
            </TouchableOpacity>
          </View>
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
