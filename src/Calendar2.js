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
      : { isLocalAccount: true, name: 'Expo Calendar' };

  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
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

  const startDate = selectedStartDate ? selectedStartDate.format('YYYY-MM-DD').toString() : '';

  const addNewEvent = async () => {
    try {
      const calendarId = await createCalendar();

      const res = await Calendar.createEventAsync(calendarId, {
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
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );

        console.log('Here are all your calendars:');
        // console.log(calendars);
        calendars.forEach((calendar)=>{
          console.log(calendar.title)
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
