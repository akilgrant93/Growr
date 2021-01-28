import Plants from './Plants'
import Edit from './Edit'
import Post from './Post'
import React, { Component } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation'

const Home = createStackNavigator({
  Plants: {
    screen: Plants,
    navigationOptions: () => ({
      headerTitle: 'Plants'
    })
  },
  Edit: {
    screen: Edit,
    navigationOptions: () => ({
      headerTitle: 'Edit Plants'
    })
  },
}, {
    headerTitleAlign: 'center'
})

const BottomTab = createBottomTabNavigator(
  {
    Home: {
      screen: Home
    },
    Post: {
      screen: Post
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        // console.log('routeName', routeName)
        if (routeName === 'Home') {
          return (
            <Image
              source={{ uri: 'https://images.squarespace-cdn.com/content/5363e3d1e4b0b6dbd37bcdd6/1584445498922-SIG0SH6NSFOFAVYAS3B1/home.png?content-type=image%2Fpng'}}
              style={{ width: 20, height: 20, }} />
          );
        } else {
          return (
            <Image
              source={ {uri: 'https://images.squarespace-cdn.com/content/5363e3d1e4b0b6dbd37bcdd6/1584445483698-RRG2H8VCNCLB0QIGMXFJ/leaf.png?content-type=image%2Fpng'} }
              style={{ width: 20, height: 20 }} />
          );
        }
      },
    }),
    tabBarOptions: {
      activeTintColor: 'rgba(0, 77, 0, .25)',
      inactiveTintColor: '#263238',
    },
  }
)




const Routes = createAppContainer(BottomTab)
export default Routes
