import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import CalendarPicker from 'react-native-calendar-picker';
import * as Calendar from "expo-calendar";
import {useFocusEffect} from '@react-navigation/native';

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync(
    Calendar.EntityTypes.EVENT
  );
  return defaultCalendar.source
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Growr Plant Calendar' };

  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Growr Plant Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });

  console.log(`Your new calendar ID is: ${newCalendarID}`);
  return newCalendarID;
}

const MyCalendar = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [friendNameText, setFriendNameText] = useState("");
  const [calendars, setCalendars]= useState([])
  const startDate = selectedStartDate ? selectedStartDate.format('YYYY-MM-DD').toString() : '';

  const addNewEvent = async () => {
    try {

      let needsInit = true
      let calendarId

      for(let i = 0; i < calendars.length; i++){
        // console.log(Object.values(calendars[i])[4])
        if(Object.values(calendars[i])[4] === 'Growr Plant Calendar'){
          needsInit = false
          calendarId = calendars[i].id
        }
      }

      if(needsInit === true){
        calendarId = await createCalendar();
      }

      // console.log('LOGGING',typeof calendars[0].id)
      // if(calendars.includes(Object.entries())){
        // let calendarId = await createCalendar();
      // }

      const res = await Calendar.createEventAsync(calendarId, {
        //date object will need to be configured for the selected date obj
        endDate: new Date(),
        startDate: new Date(),
        title: 'Happy Birthday buddy'
      });
      alert('Event Created!');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const userCalendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        setCalendars(userCalendars)
        console.log('Here are all your calendars:');
        // console.log(calendars);
        userCalendars.forEach((calendar)=>{
          console.log(calendar.title)
          console.log(calendar.id)
          // if(calendar.title==='Expo Calendar'){
          //   Calendar.deleteCalendarAsync(calendar.id)
          // }
        })
      }
    })();
  }, []);

  return (
    <View>
      <CalendarPicker onDateChange={setSelectedStartDate} />
      <Text style={styles.dateText}>Birthday: {startDate}</Text>
      <StatusBar style="auto" />
      <TextInput
        onChangeText={(eventName) => setFriendNameText(eventName)}
        value={friendNameText}
        placeholder="Enter the name of your friend"
        style={styles.input}
      />
      <Button title={"Add to calendar"} onPress={addNewEvent} />
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
