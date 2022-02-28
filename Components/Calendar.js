import React, { Component, useState } from 'react'
import {Calendar, CalendarList, Agenda, LocaleConfig, Arrow} from 'react-native-calendars';
import { View } from 'native-base'
import { Text, TouchableOpacity } from 'react-native';

const timeToString= (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

export default function UserCalendar() {
  const [items, setItems] = useState({});
  const [userHasCalendar, setUserHasCalendar] = useState(false)

  const loadItems = (day) => {
    // if(!userHasCalendar){
      console.log('DAY',day)
      setTimeout(() => {
        for (let i = -15; i < 85; i++) {
          const time = day.timestamp + i * 24 * 60 * 60 * 500;
          const strTime = timeToString(time);
          // console.log('CURRENT TIME.......',time)
          // console.log('STR TIME.......',strTime)
          // console.log()
          //does nothing except adds second loop to push in data.
          // if (!items[strTime]) {
          //   items[strTime] = [];
          //   const numItems = Math.floor(Math.random() * 3 + 1);

          //   for (let j = 0; j < numItems; j++) {
          //     items[strTime].push({
          //       name: 'Item for ' + strTime + ' #' + j,
          //       height: Math.max(50, Math.floor(Math.random() * 150)),
          //     });
          //   }

          // }
        }
        const newItems = {};
        Object.keys(items).forEach((key) => {
          newItems[key] = items[key];
        });
        setItems(newItems);
      }, 1000);
    // }

  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text>{item.name}</Text>
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={new Date()}
        renderItem={renderItem}
      />
    </View>
  );
};

