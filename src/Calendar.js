import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {firebase} from '../config'

const MyCalendar = () => {
  const [wateringDays, setWateringDays] = useState([])
  const [nextWateringDays, setNextWateringDays] = useState([])

  //this function will pull notification data from my backend
  const changeDate = (date, somethingElse) => {
    console.log(somethingElse)
    console.log(date)
    console.log(new Date(date))
  }

  //marked dates on the calendar will be supplied via useEffect
  useEffect(()=>{
    const plantCalendarsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plantCalendars')
    let wateringDaysInit = []
    let nextWateringDaysInit = []
    plantCalendarsRef
    .orderBy('nextWateringDate','asc')
    .onSnapshot(
      querySnapshot => {
        querySnapshot.forEach((plant) => {
          nextWateringDaysInit.push(moment(plant.data().nextWateringDate).startOf('day').toString())
          wateringDaysInit.push(plant.data().wateringDates)
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
        setWateringDays(daysRounded)
      }
    )
    console.log('nextWateringDays',nextWateringDays)
    // // 👇️ Display only time
    // console.log(date.toLocaleTimeString('en-US')); // 👉️ "9:50:15 AM"
    console.log('watering days',wateringDays)
  },[])

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
    <View>
      <CalendarPicker onDateChange={changeDate(date, somethingElse)}
      customDatesStyles={customDatesStylesCallback}/>
      <StatusBar style="auto" />
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
