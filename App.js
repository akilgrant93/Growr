import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from "react";
import { firebase } from './config'



import Signin from "./src/Signin";
import Registration from "./src/Registration";
import Detail from "./src/Detail";
import Dashboard from "./src/Dashboard";
import Header from "./src/Header";
import Settings from "./src/Settings";
// import Weather from "./src/Weather";
import Calendar from "./src/Calendar";

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Settings" component={Settings} />
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

        // options={{
        //   headerTitle: () => <Header name="Dashboard"/>,
        //   headerStyle: {
        //     height: 150,
        //     borderBottomLeftRadius: 50,
        //     borderBottomRightRadius: 50,
        //     backgroundColor: '#00e4d0',
        //     shadowColor: '#000',
        //     elevation: 25,
        //   }
        // }}
        />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
        name="Detail"
        component={Detail}
        // options={{
        //   headerTitle: () => <Header name="Dashboard"/>,
        //   headerStyle: {
        //     height: 150,
        //     borderBottomLeftRadius: 50,
        //     borderBottomRightRadius: 50,
        //     backgroundColor: '#00e4d0',
        //     shadowColor: '#000',
        //     elevation: 25,
        //   }
        // }}
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
