import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import moment from 'moment';
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
      marginLeft: withSpring(pressed.value ? '-20%' : '65%'),
    };
  });

  const opacity = useAnimatedStyle(() => {
    return {
      opacicty: withSpring(pressed.value ? '100%' : '0%'),
    };
  });

  const expand = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true;
    },
    onActive: (event, ctx) => {
      console.log('ACTIVE')
    },
    onEnd: (event, ctx) => {
      pressed.value = false;
    },
  });

  return (
    <TapGestureHandler onGestureEvent={expand}>
      <Animated.View
        style={[styles.container, scaleAnimation]}
      >
          <View style={{width: '100%', flexDirection:'row'}}>
            <Text style={{fontSize: 15, textAlign:'center', alignSelf:'center', fontWeight: 'bold',
             color: 'white'}}>Next Watering:</Text>
          </View>

          <View style={{flexDirection:'row'}}>
          <Animated.View style={[uas,{flexDirection:'row', justifyContent:'flex-start'}]}>

          <View style={styles.pos}
          >
          <View >
          <CalendarDaysIcon size={60} style={{color:'#F97068'}}/>
          <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white', alignSelf:'center'}}>{moment(props.nextWateringDays[0]).format('MMM')}</Text>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', alignSelf:'center'}}>{moment(props.nextWateringDays[0]).format('Do')}</Text>
          </View>
          </View>

          <View style={{marginLeft: 10}}>
            {
            [...new Set(props.nextWateringDays)].map((day,  idx) => {
              if(idx > 0 && idx < 8){
                return <Text key={idx} style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>{moment(day).format('MMM Do')}</Text>
              }
            })}
          </View>

          </Animated.View>

            {/* extra data goes here, uas2 will be factored based on its size */}
          <View style={{marginLeft: 10}}>
            {
            [...new Set(props.nextWateringDays)].map((day,  idx) => {
              if(idx > 0 && idx < 8){
                return <Text key={idx} style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>{moment(day).format('MMM Do')}</Text>
              }
            })}
          </View>
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
