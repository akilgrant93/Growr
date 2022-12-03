import React, { useEffect, useState } from 'react'
import { Agenda } from 'react-native-calendars';
import { Text, StyleSheet, View } from 'react-native';
import { firebase } from '../config'

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

export default function UserCalendar() {
  const [items, setItems] = useState({});
  const [notifications, setNotifications] = useState([])

  // useEffect(() => {
  //     let response = null

  //     const calendarRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('calendar')

  //     calendarRef
  //     .orderBy('intialized','desc')
  //     .onSnapshot(
  //       querySnapshot => {
  //         const plantNotifs = []
  //         querySnapshot.forEach((doc) => {
  //           plantNotifs.push({
  //             //needs data

  //           })
  //         })
  //         setNotifications(plantNotifs)
  //       }
  //     )


  //     const mappedData = notifications.map((post, index) => {
  //       const date = timeToString(post[1].initialized)
  //       return {
  //         ...post,
  //         date: date
  //       };
  //     });

  //     const reduced = mappedData.reduce(
  //       (acc, currentItem) => {
  //         const {date, ...coolItem} = currentItem;
  //         if(acc[date] === undefined){
  //           acc[date] = [coolItem];
  //         } else {
  //           acc[date] = [...acc[date], coolItem]
  //         }
  //         return acc;
  //       },
  //       {},
  //     );
  //     setItems(reduced);

  //     console.log('ITEMS REDUCED REDUCED',items )
  // }, []);


  const loadItems = (day) => {
    setTimeout(() => {
        for (let i = -15; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = timeToString(time);
            if (!items[strTime]) {
                items[strTime] = [];
                const numItems = Math.floor(Math.random() * 3 + 1);
                for (let j = 0; j < numItems; j++) {
                    items[strTime].push({
                        name: 'Item for ' + strTime + ' #' + j,
                        height: Math.max(10, Math.floor(Math.random() * 150)),
                        day: strTime
                    });
                }
            }
        }
        const newItems = {};
        Object.keys(items).forEach(key => {
            newItems[key] = items[key];
        });
        setItems(newItems);
    }, 1000);
}

  const renderItem = (item) => {
    console.log(item)
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.safe}>
                  <Agenda
                  items={items}
                  loadItemsForMonth={loadItems}
                  selected={'2022-07-07'}
                  refreshControl={null}
                  showClosingKnob={true}
                  refreshing={false}
                  renderItem={renderItem}
                  />
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
