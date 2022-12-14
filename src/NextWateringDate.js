import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import moment from 'moment';
import { CalendarDaysIcon } from 'react-native-heroicons/solid';

const NextWateringDate = (props) => {
  return (
      <View style={styles.container}>
          <Text style={{width: '60%',textAlign:'center', marginTop: 10, color: 'white'}}>Next Watering:</Text>
          {/* <Text style={{fontSize: 20, fontWeight: 'bold'}}>{moment(props.nextWateringDays[0]).format('ddd')}</Text> */}
          <View style={{display:'flex', flexDirection:'row', marginTop: 15}}>

          <View>
          <CalendarDaysIcon size={60} style={{color:'#F97068'}}/>
          <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white', alignSelf:'center'}}>{moment(props.nextWateringDays[0]).format('MMM')}</Text>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', alignSelf:'center'}}>{moment(props.nextWateringDays[0]).format('Do')}</Text>
          </View>

          <View style={{marginLeft: 10}}>
            {
            [...new Set(props.nextWateringDays)].map((day,  idx) => {
              if(idx > 0 && idx < 8){
                return <Text key={idx} style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>{moment(day).format('MMM Do')}</Text>
              }
            })}
          </View>

          </View>
      </View>
  )
}

export default NextWateringDate

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '50%',
    backgroundColor: '#034732',
    // borderTopWidth: 3,
    // borderRightWidth: 3,
    borderRightColor: '#034732',
    borderTopColor: '#034732',
    alignSelf: 'flex-start',
    height: '100%',
    alignItems: 'center',
  },
})
