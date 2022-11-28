import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { firebase } from './config'

import Signin from "./src/Signin";
import Registration from "./src/Registration";
import Dashboard from "./src/Dashboard";
import Header from "./src/Header";

const Stack = createStackNavigator()

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
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
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
