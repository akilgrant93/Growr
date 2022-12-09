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

  const [lastWateredData, setLastWateredData] = useState({})
  const [nextWateredData, setNextWateredData] = useState([])
  //this function will pull notification data from my backend - i need to be able to pass it more data.
  const changeMonth = () => {
    setLastWateredData({})
    setNextWateredData({})
  }

  const changeDate = (date) => {
    let nextWateringDaysInit = []
    let lastWateringDaysInit = []
    const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
    plantsRef
    .orderBy('lastWateringDate', 'asc')
    .onSnapshot(
      querySnapshot => {
        querySnapshot.forEach((plant) => {
          //watering dates check
          // console.log('previous watering dates check',moment(date).startOf('day').valueOf() === plant.data().lastWateringDate)
          if(moment(date).startOf('day').valueOf() === plant.data().lastWateringDate){
            lastWateringDaysInit.push(plant.data())
          }
          // console.log('next watering date check',moment(date).startOf('day').valueOf() === moment(plant.data().nextWateringDate).valueOf())
          // console.log('next watering date',moment(plant.data().nextWateringDate).valueOf())
        })
        setLastWateredData(lastWateringDaysInit)

      }
    )
  }


  useFocusEffect(
    React.useCallback(() => {
      const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
      let wateringDaysInit = []
      let nextWateringDaysInit = []
      plantsRef
      .orderBy('lastWateringDate','asc')
      .onSnapshot(
        querySnapshot => {
          querySnapshot.forEach((plant) => {
            nextWateringDaysInit.push(moment(plant.data().calendar.nextWateringDate).startOf('day').toString())
            wateringDaysInit.push(plant.data().calendar.wateringDates)
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
    console.log('lastWateredData ',lastWateredData)
    }, [])
  );


  useEffect(()=>{
    // const plantCalendarsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plantCalendars')
    // let wateringDaysInit = []
    // let nextWateringDaysInit = []
    // plantCalendarsRef
    // .orderBy('nextWateringDate','asc')
    // .onSnapshot(
    //   querySnapshot => {
    //     querySnapshot.forEach((plant) => {
    //       nextWateringDaysInit.push(moment(plant.data().nextWateringDate).startOf('day').toString())
    //       wateringDaysInit.push(plant.data().wateringDates)
    //     })
    //     setNextWateringDays(nextWateringDaysInit)
    //     let mergedArray = [];
    //     wateringDaysInit.forEach(wateringDaysArray => {
    //       mergedArray = [...mergedArray, ...wateringDaysArray]
    //     })

    //     let daysRounded = []
    //     const unproccessed = [...new Set([...mergedArray])]
    //     unproccessed.forEach(day => {
    //       daysRounded.push(moment(day).startOf('day').toString())
    //     })
    //     setWateringDays(daysRounded)
    //   }
    // )
    // console.log('nextWateringDays',nextWateringDays)
    // // // 👇️ Display only time
    // // console.log(date.toLocaleTimeString('en-US')); // 👉️ "9:50:15 AM"
    // console.log('watering days',wateringDays)
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
    <View style={{alignItems:'center', marginTop: '3%'}}>
      <CalendarPicker onDateChange={changeDate}
      customDatesStyles={customDatesStylesCallback} onMonthChange={changeMonth}/>
      <StatusBar style="auto" />
      <View style={{marginTop: '3%'}}>
      <View style={{width: '75%'}}>
      {nextWateredData.length ? nextWateredData.map((dateInfo, idx) => {
        return <Text style={{marginTop: '2%'}} key={idx}>{dateInfo.name} needs water.</Text>
      }) : ''}
      </View>
      <View style={{width: '75%'}}>
      {lastWateredData.length ? lastWateredData.map((dateInfo, idx) => {
        console.log(dateInfo.name)
        return <Text style={{marginTop: '2%'}} key={idx}>{dateInfo.name} last watered on {moment(dateInfo.lastWateringDate).format("dddd, MMMM Do YYYY")}</Text>
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
