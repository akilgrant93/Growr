import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {firebase} from '../config'
import { useFocusEffect } from '@react-navigation/native';

const MyCalendar = () => {
  const [wateringDays, setWateringDays] = useState([])
  const [nextWateringDays, setNextWateringDays] = useState([])
  const [plants, setPlants] = useState([])
  const [date, setDate] = useState(moment().startOf('day'))
  const [lastWateredData, setLastWateredData] = useState({})
  const [nextWateredData, setNextWateredData] = useState([])
  //this function will pull notification data from my backend - i need to be able to pass it more data.
  const changeMonth = () => {
    setLastWateredData({})
    setNextWateredData({})
  }


  const changeData = (date) => {
    setDate(date)
    let nextWateringDaysInit = []
    let lastWateringDaysInit = []
    const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
    plantsRef
    .orderBy('nextWateringDate', 'asc')
    .onSnapshot(
      querySnapshot => {
        querySnapshot.forEach((plant) => {
          if(moment(date).startOf('day').valueOf() === plant.data().nextWateringDate){
            nextWateringDaysInit.push(plant.data())
          }
          if(plant.data().wateringDates.includes(moment(date).startOf('day').valueOf())){
            lastWateringDaysInit.push(plant.data())
          }
        })
        setLastWateredData(lastWateringDaysInit)
        setNextWateredData(nextWateringDaysInit)
      }
    )
  }

  useFocusEffect(
    React.useCallback(() => {
      const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
      let nextWateringDaysVisInit = []
      let lastWateringDaysVisInit = []
      let wateringDaysInit = []
      let nextWateringDaysInit = []
      plantsRef
      .orderBy('nextWateringDate','asc')
      .onSnapshot(
        querySnapshot => {
          querySnapshot.forEach((plant) => {
            nextWateringDaysInit.push(moment(plant.data().nextWateringDate).startOf('day').toString())
            wateringDaysInit.push(plant.data().wateringDates)

            if(moment(date).startOf('day').valueOf() === plant.data().nextWateringDate){
              nextWateringDaysVisInit.push(plant.data())
            }
            if(plant.data().wateringDates.includes(moment(date).startOf('day').valueOf())){
              lastWateringDaysVisInit.push(plant.data())
            }
          })
        setNextWateringDays(nextWateringDaysInit)
        let mergedArray = [];
        wateringDaysInit.forEach(wateringDaysArray => {
          mergedArray = [...mergedArray, ...wateringDaysArray]
        })

        let daysRounded = []
        const unproccessed = [...new Set([...mergedArray])]
        unproccessed.forEach(day => {
          daysRounded.push(moment(day).startOf('day').toString())
        })

        setLastWateredData(lastWateringDaysVisInit)
        setNextWateredData(nextWateringDaysVisInit)
        setWateringDays(daysRounded)
      }
    )
    }, [])
  );


const customDatesStylesCallback = date => {
  switch(date) {
    case date:
        if(nextWateringDays.includes(moment(date).startOf('day').toString())){
          return {
          style:{
            backgroundColor: '#909',
          },
          textStyle: {
            color: '#0f0',
            fontWeight: 'bold',
          }
        };}
        if(wateringDays.includes(moment(date).startOf('day').toString())){
          return {
          style:{
            backgroundColor: 'red',
          },
          textStyle: {
            color: '#0f0',
            fontWeight: 'bold',
          }
        };}
  }
}


  return (
    <View style={{alignItems:'center', marginTop: '3%'}}>
      <CalendarPicker onDateChange={changeData}
      customDatesStyles={customDatesStylesCallback} onMonthChange={changeMonth}/>
      <StatusBar style="auto" />
      <View style={{marginTop: '3%'}}>
      <Text style={{alignSelf:'center', fontSize: 16, fontWeight:'600'}}>
        {moment(date).format("dddd, MMMM Do YYYY")}
      </Text>
        {/* need to check on inner conditional tomorrow */}
      <View style={{width: '75%', marginTop: '2%'}}>
      {!lastWateredData.length && !nextWateredData.length ?
      <Text>No plants need water or have been watered {moment(date).startOf('day').valueOf() === moment().startOf('day').valueOf() ? 'today' : 'on this day'}</Text> : ''}
      </View>
      <View style={{width: '75%'}}>
      {nextWateredData.length ? nextWateredData.map((dateInfo, idx) => {
        return <Text style={{marginTop: '2%'}} key={idx}>Your {dateInfo.name} needs water.</Text>
      }) : ''}
      </View>
      <View style={{width: '75%'}}>

      {lastWateredData.length ? lastWateredData.map((dateInfo, idx) => {
        return <Text style={{marginTop: '2%'}} key={idx}>Your {dateInfo.name} was watered</Text>
      }) : ''}
      </View>
      </View>


    </View>
  )
}

export default MyCalendar

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  dateText: {
    margin: 16,
  },
});
