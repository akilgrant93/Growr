import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import moment from 'moment';
import {firebase} from '../config'

const NextWateringDate = (props) => {
  return (
      <View style={styles.container}>
          <Text style={{width: '60%',textAlign:'center', marginTop: 10, color: 'white'}}>Next Watering:</Text>
          {/* <Text style={{fontSize: 20, fontWeight: 'bold'}}>{moment(props.nextWateringDays[0]).format('ddd')}</Text> */}
          <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white'}}>{moment(props.nextWateringDays[0]).format('MMM')}</Text>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>{moment(props.nextWateringDays[0]).format('Do')}</Text>
      </View>
  )
}

export default NextWateringDate

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 10,
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
