import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
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

  useEffect(() => {
    // console.log('PLANTS',props.plants.nextWateringDate)
  }, [])
  return (
    <TapGestureHandler onGestureEvent={expand}>
      <Animated.View
        style={[styles.container, scaleAnimation]}
      >
          <View style={{flexDirection:'row'}}>
          <Animated.View style={[uas,{flexDirection:'row', justifyContent:'flex-start'}]}>

          <View style={{justifyContent:'center', alignItems:'center', width:50}}>
          <Text style={{fontSize: 15, textAlign:'center', fontWeight: 'bold',
             color: 'white', width: 75}}>Watering Dates</Text>
          <CalendarDaysIcon size={60} style={{color:'#F97068'}}/>
          </View>

          <View style={{marginLeft: 20, width: '160%'}}>
            <FlatList
            style={{}}
            data={[...new Set(props.nextWateringDays)]}
            renderItem={({item, index}) => {
              // console.log('item',item)
              console.log(props.nextWateringDays.length)
              if(index < 8){
                return (
                <View style={styles.dateStyle}>
                <Text key={index} style={{marginLeft: 5, fontSize: 14, padding: 5,fontWeight: 'bold', marginTop: 20, color: 'white'}}>{moment(item).format('MMM Do')}</Text>
                <View>
                  {props.nextWateringDays.length > 1
                  ? <View style={{ width: 200}}>
                    {props.plants.map((plant, idx) => {
                      if(item === plant.nextWateringDate){return <Text style={idx === props.plants.length-1 ? {padding: 3, backgroundColor:'white', fontSize:10} : {padding: 3, backgroundColor:'white', marginBottom: 1, fontSize:10}} key={idx}>{plant.name}</Text>}
                    })}
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
  firstDateStyle: {
    backgroundColor: '#E4F1E4',
    borderTopLeftRadius: 5,
    marginBottom: 1,
    width: '100%',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  dateStyle: {
    backgroundColor: 'rgba(228, 241, 228, .25)',
    marginBottom: 1,
    width: '100%',
    flexDirection:'row',
    justifyContent:'space-between'
  }
})
