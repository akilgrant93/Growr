import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler'
import React, { useState, useEffect } from "react";
import { TouchableOpacity, Alert, View, StatusBar, Image, Text, StyleSheet } from "react-native";
import { firebase } from './config'
import { FontAwesome } from '@expo/vector-icons'
import Svg, { Path } from 'react-native-svg'
import { CalendarDaysIcon, PlusCircleIcon } from 'react-native-heroicons/solid';
import * as Location from 'expo-location';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import Signin from "./src/Signin";
import Registration from "./src/Registration";
import Settings from "./src/Settings";
import Dashboard from "./src/Dashboard";
import MyCalendar from "./src/Calendar";
import SearchPlant from "./src/SearchPlant";
import PostModal from "./src/PostModal";
import UpdateModal from './src/UpdateModal';
import CategoryHeader from "./src/CategoryHeader";
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
    <>
    <StatusBar translucent={true} backgroundColor={'transparent'}/>
    <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarInactiveBackgroundColor:'#527466',
      tabBarActiveBackgroundColor:'#527466',
      tabBarInactiveTintColor: '#C9E4CA',
      tabBarLabelStyle: {
        marginBottom: '10%',
        paddingBottom: '5%'
      },
      tabBarStyle: {
      height: '14%',
      borderTopWidth: 0,
      marginBottom: '-7.75%',
      shadowOffset: {
        width: 0,
        height: -2,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 4,
    },
      tabBarActiveTintColor: '#034732',
    })}
    >
      <Tab.Screen
      name="My Garden"
      label="My Garden"
      component={Dashboard}
      options={({route}) => ({
        tabBarIcon: ({focused, color, size}) => (
          <FontAwesome
                name='leaf'
                color={focused ? '#034732' : '#C9E4CA' }
                size={size}
              />
        ),
      })}
      />
      <Tab.Screen
      name="Plants"
      label="Plants"
      component={SearchPlant}
      options={({route}) => ({
        tabBarIcon: ({focused, size}) => (
          <PlusCircleIcon size={size} style={focused ? {color:'#034732'} : {color:'#C9E4CA'}}/>
        ),
      })}
      />
      <Tab.Screen
      name="Calendar"
      label="Calendar"
      component={MyCalendar}
      options={({route}) => ({
        tabBarIcon: ({focused, size}) => (
          <CalendarDaysIcon size={size} style={focused ? {color:'#034732'} : {color:'#C9E4CA'}}/>
        ),
      })}
      />
      <Tab.Screen
      name="Settings"
      label="Settings"
      component={Settings}
      options={({route}) => ({
        tabBarIcon: ({focused, size}) => (
          <FontAwesome name='gear' color={focused ? '#034732' : '#C9E4CA'} size={size}/>
        ),
      })}
      />
    </Tab.Navigator>
    </>
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
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen
        name="Sign In"
        component={Signin}
        />
        <Stack.Screen
        name="Registration"
        component={Registration}
        />
      </Stack.Navigator>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown:false,headerTransparent:true}}>
      <Stack.Group>
      <Stack.Screen
        name="Home"
        component={Home}
        />
        </Stack.Group>
        <Stack.Group screenOptions={{
          // presentation: 'modal',
          headerShown:true  }}>
        <Stack.Screen
        name="UpdateModal"
        component={UpdateModal}
        />
        <Stack.Screen
        name="PostModal"
        component={PostModal}
        options={({route}) => ({
          title: route.params.item.commonName || route.params.item.scientificName
        })}
        />
        <Stack.Screen
        name="PlantsByCategory"
        options={({route}) => ({
          headerTitle: () => <CategoryHeader title={route.params.name}/>,
          headerLeft: () =>
            <TouchableOpacity style={{alignItems:'center', marginRight: 7, marginTop: 1, marginLeft: 3, flexDirection:'row'}} onPress={() => route.params.navigation.navigate('Plants')}>
            <FontAwesome
            color={'white'}
            size={24}
            name={'chevron-left'}
            />
            <Text style={{fontWeight:'900', fontSize: 20, color:'#FFF', marginLeft: 5}}>Discover</Text>
            </TouchableOpacity>
        })}

        component={PlantsByCategory}
        />
        </Stack.Group>
    </Stack.Navigator>
  )
}

export default () => {
  const navTheme = {
    colors: {
      background: "#487565"
    }
  }

  return (
    <SafeAreaProvider>
    <NavigationContainer theme={navTheme}>
      <App/>
    </NavigationContainer>
    </SafeAreaProvider>
  )
}
