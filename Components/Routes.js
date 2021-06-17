import Plants from './Plants'
import Edit from './Edit'
import Post from './Post'
import MyCalendar from './Calendar'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

function MyStack() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="My Plants">
      <Stack.Screen
        name="My Plants"
        component={Plants}
        options={{
          cardStyleInterpolator: forFade,
          headerTransparent: true,
          headerTintColor: '#1a5127'
          }}/>
      <Stack.Screen
        name="Plant Care"
        component={Edit}
        options={{
          cardStyleInterpolator: forFade,
          headerTransparent: true,
          headerTintColor: '#247237'
        }}
        />
      <Stack.Screen
        name="New Plants"
        component={Post}
        options={{
          cardStyleInterpolator: forFade,
          headerTransparent: true,
          headerTintColor: '#247237'
        }}
        />
      {/* <Stack.Screen name="Settings" component={Settings} /> */}
      <Stack.Screen name="My Calendar" component={MyCalendar} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}


const Routes = MyStack
export default Routes
