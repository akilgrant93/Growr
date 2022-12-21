import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import moment from 'moment';
import {firebase} from '../config'
import { CalendarDaysIcon } from 'react-native-heroicons/solid';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring
} from 'react-native-reanimated';

const NextWateringDate = (props) => {
  const pressed = useSharedValue(false);

  const scaleAnimation = useAnimatedStyle(() => {
    return {
      marginLeft: withSpring(pressed.value ? '-50%' : '0%'),
      width: withSpring(pressed.value ? '100%' : '50%') ,
    };
  });

  const uas = useAnimatedStyle(() => {
    return {
      width: withSpring(pressed.value ? '50%' : '100%'),
      marginLeft: withSpring(pressed.value ? '-40%' : '25%'),
    };
  });

  const expand = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true;
    },
    onEnd: (event, ctx) => {
      pressed.value = false;
    },
  });

  const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')

  return (
    <TapGestureHandler onGestureEvent={expand}>
      <Animated.View
        style={[styles.container, scaleAnimation]}
      >
          <View style={{width: '100%', flexDirection:'row', justifyContent:'center', marginTop: 8}}>
            <Text style={{fontSize: 15, textAlign:'center', alignSelf:'center', fontWeight: 'bold',
             color: 'white'}}>Next Watering:</Text>
          </View>

          <View style={{flexDirection:'row'}}>
          <Animated.View style={[uas,{flexDirection:'row', justifyContent:'flex-start'}]}>

          <View style={styles.pos}>
          <View >
          <CalendarDaysIcon size={60} style={{color:'#F97068'}}/>
          <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white', alignSelf:'center'}}>{moment(props.nextWateringDays[0]).format('MMM')}</Text>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', alignSelf:'center'}}>{moment(props.nextWateringDays[0]).format('Do')}</Text>
          </View>
          </View>

          <View style={{marginLeft: 10}}>
            <FlatList
            data={[...new Set(props.nextWateringDays)]}
            renderItem={({item, index}) => {
              console.log('item',item)
              console.log(index)
              if(index > 0 && index < 8){
                return (
                <View style={{flexDirection:'row'}}>
                <Text key={index} style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>{moment(item).format('MMM Do')}</Text>
                <View>
                  {props.nextWateringDays.length > 2
                  ? <View>

                  </View>
                  : null}
                </View>
                </View>
                )
              }
            }}
            />
          </View>

          </Animated.View>

            {/* extra data goes here, uas2 will be factored based on its size */}
          </View>

      </Animated.View>
    </TapGestureHandler>
  )
}

export default NextWateringDate

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#034732',
    borderTopLeftRadius: 5,
    alignSelf: 'flex-start',
    height: '100%',
    alignItems: 'center',
  },
  pos: {
    display:'flex',
    flexDirection:'row',
    marginTop: 15,
  }
})
