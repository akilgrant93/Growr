import Plants from './Plants'
import Edit from './Edit'
import Post from './Post'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="My Plants">
      <Stack.Screen name="My Plants" component={Plants} />
      <Stack.Screen name="Plant Care" component={Edit} />
      <Stack.Screen name="New Plants" component={Post} />
      {/* <Stack.Screen name="Settings" component={Settings} /> */}
      {/* <Stack.Screen name="My Calendar" component={Calendar} /> */}
    </Stack.Navigator>
    </NavigationContainer>
  );
}


const Routes = MyStack
export default Routes
