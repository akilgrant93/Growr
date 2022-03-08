import React, { useEffect, useState } from 'react'
import { Agenda } from 'react-native-calendars';
import { View } from 'native-base'
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from '../fb'
import {addDays, format} from 'date-fns';
import MyNotifications from './notifications'

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

export default function UserCalendar() {
  const [items, setItems] = useState({});

  useEffect(() => {
    const getData = async () => {
      const uid = firebase.auth().currentUser.uid
      let response = null

      firebase.database().ref(`/users/${uid}/userPlants`).on('value', (snapshot) => {
        response = Object.entries(snapshot.val())
      }, (errorObject) => {
        console.log('The read failed: ' + errorObject.name);
      });

      const mappedData = response.map((post, index) => {
        const date = timeToString(post[1].initialized)
        return {
          ...post,
          date: date
        };
      });

      const reduced = mappedData.reduce(
        (acc, currentItem) => {
          const {date, ...coolItem} = currentItem;
          if(acc[date] === undefined){
            acc[date] = [coolItem];
          } else {
            acc[date] = [...acc[date], coolItem]
          }
          return acc;
        },
        {},
      );

      setItems(reduced);
    };

    getData();
  }, []);

  const renderItem = (item) => {
    console.log('ITEM!!!!!!!!!!!!      ',item)
    return (
      <View style={styles.itemContainer}>
        <Text>{item[1].name}</Text>
        <Text>{item.cookies ? `🍪` : `😋`}</Text>
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
