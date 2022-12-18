import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from "react";
import { firebase } from './config'
import { FontAwesome } from '@expo/vector-icons'
import { CalendarDaysIcon, PlusCircleIcon } from 'react-native-heroicons/solid';

import Signin from "./src/Signin";
import Registration from "./src/Registration";
import Dashboard from "./src/Dashboard";
import Header from "./src/Header";
import Settings from "./src/Settings";
import MyCalendar from "./src/Calendar";
import SearchPlant from "./src/SearchPlant";
import PostModal from "./src/PostModal";
import UpdateModal from './src/UpdateModal';
import PlantsByCategory from './src/PlantsByCategory';

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen
      name="My Garden"
      label="My Garden"
      component={Dashboard}
      options={({route}) => ({
        tabBarIcon: ({color, size}) => (
          <FontAwesome
                name='leaf'
                 color='#034732'
                 size={size}
              />
        ),
        // tabBarActiveTintColor: 'white',
        // tabBarActiveBackgroundColor: '034732',
        // tabBarInactiveTintColor: 'blue',
        // tabBarInactiveBackgroundColor:'red',
      })}
      />
      <Tab.Screen
      name="Add Plant"
      label="Add Plant"
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
      <Tab.Screen
      name="Settings"
      label="Settings"
      component={Settings}
      options={({route}) => ({
        tabBarIcon: ({color, size}) => (
          <FontAwesome
                name='sliders'
                 color='#034732'
                 size={size}
              />
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
        name="SearchPlant"
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
