import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {firebase} from '../config'

const MyCalendar = () => {
  const [ events, setEvents ] = useState([])
  //this function will pull notification data from my backend
  const changeDate = (date) => {
    console.log(date)
    console.log(new Date(date))
  }

  //marked dates on the calendar will be supplied via useEffect
  useEffect(()=>{
    moment().format();
    const timestamp = new Date()
    const date = new Date(timestamp)
    // console.log(timestamp.toString())
    console.log('day and time',date.toString())
    console.log(firebase.firestore.FieldValue.serverTimestamp())
    // console.log(moment().startOf('day').toString())


    moment().add(7, 'days');
    // // 👇️ Display only date
    // console.log(date.toLocaleDateString('en-US'))
    // // 👇️ Display only time
    // console.log(date.toLocaleTimeString('en-US')); // 👉️ "9:50:15 AM"

  },[])

//   let today = moment();
// let day = today.clone().startOf('month');
// let customDatesStyles = [];
// while(day.add(1, 'day').isSame(today, 'month')) {
//   customDatesStyles.push({
//     date: day.clone(),
//     // Random colors
//     style: {backgroundColor: '#'+('#00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)},
//     textStyle: {color: 'black'}, // sets the font color
//     containerStyle: [], // extra styling for day container
//     allowDisabled: true, // allow custom style to apply to disabled dates
//   });
// }
const customDatesStylesCallback = date => {
  switch(date.isoWeekday()) {
    case date.isoWeekday(): // Monday
    // console.log(new Date)
      // console.log(dates[date])
      if(date.hasNotification){
        return {
          style:{
            backgroundColor: '#909',
          },
          textStyle: {
            color: '#0f0',
            fontWeight: 'bold',
          }
        };
      }
  }
}


  return (
    <View>
      <CalendarPicker onDateChange={changeDate}
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
