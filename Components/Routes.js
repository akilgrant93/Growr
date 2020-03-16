import Plants from './Plants'
import Edit from './Edit'
import Post from './Post'

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
    headerLayoutPreset: 'center'
})

const BottomTab = createBottomTabNavigator({
  Home: {
    screen: Home,
    options:{
      tabBarIcon: ({focused}) => {
        <TabBarIcon focused={focused} name="ios-home"/>
      }
    }
  },
  Post: {
    screen: Post,
    options:{
      tabBarIcon: ({focused}) => {
        <TabBarIcon focused={focused} name="ios-leaf"/>
      }
    }
  }
})
const Routes = createAppContainer(BottomTab)
export default Routes
