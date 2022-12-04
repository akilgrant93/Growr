import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import Calendar from 'react-native-calendars/src/calendar'

const MyCalendar = () => {

  return (
    <View>
      <Calendar
      style={{borderRadius:10,elevation:4,margin:10}}
      onDayPress={date => console.log(date)}
      minDate={'2020-01-01'}
      maxDate={'2025-12-31'}
      hideExtraDays={true}
      markedDates={{
        '2022-12-15': {selected: true, selectedColor:'red'}
      }}
      />
    </View>
  )
}

export default MyCalendar

const styles = StyleSheet.create({})
