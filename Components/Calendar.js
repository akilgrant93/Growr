import React, { useEffect, useState } from 'react'
import { Agenda } from 'react-native-calendars';
import { View } from 'native-base'
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import {addDays, format} from 'date-fns';
import firebase from '../fb'

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

export default function UserCalendar() {
  const [items, setItems] = useState({});

  useEffect(() => {
    // run once

    const getData = async () => {


      // ref.on('value', (snapshot) => {
      //   console.log(snapshot.val());
      // }, (errorObject) => {
      //   console.log('The read failed: ' + errorObject.name);
      // });






      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
      );
      const data = await response.json();

      const mappedData = data.map((post, index) => {
        const date = addDays(new Date(), index);

        return {
          ...post,
          date: format(date, 'yyyy-MM-dd'),
        };
      });

      const reduced = mappedData.reduce(function (acc, currentItem){
          const {date, ...coolItem} = currentItem;
          acc[date] = [coolItem];
          return acc;
        },
        {},
      );

      setItems(reduced);
    };

    getData();
  }, []);

  const renderItem = (item) => {
    return (
      <View style={styles.itemContainer}>
        <Text>{item.name}</Text>
        {/* <Text>{item.cookies ? `🍪` : `😋`}</Text> */}
      </View>
    );
  };

  return (
    <View style={styles.safe}>
      <Agenda items={items} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

