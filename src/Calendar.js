import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {firebase} from '../config'
import { FontAwesome } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native';
import { CalendarDaysIcon } from 'react-native-heroicons/solid';

const MyCalendar = () => {
  const navigation = useNavigation()
  const [wateringDays, setWateringDays] = useState([])
  const [nextWateringDays, setNextWateringDays] = useState([])
  const [date, setDate] = useState(moment().startOf('day'))
  const [lastWateredData, setLastWateredData] = useState({})
  const [nextWateredData, setNextWateredData] = useState([])
  const [toggled, setToggled] = useState(false)
  const changeMonth = () => {
    setLastWateredData({})
    setNextWateredData({})
  }

  const changeData = (date) => {
    setDate(date)
    setToggled(false)
    let nextWateringDaysInit = []
    let lastWateringDaysInit = []
    const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
    plantsRef
    .orderBy('nextWateringDate', 'asc')
    .onSnapshot(
      querySnapshot => {
        querySnapshot.forEach((plant) => {
          if(moment(date).startOf('day').valueOf() === plant.data().nextWateringDate){
            nextWateringDaysInit.push(plant.data())
          }
          if(plant.data().wateringDates.includes(moment(date).startOf('day').valueOf())){
            lastWateringDaysInit.push(plant.data())
          }
        })
        setLastWateredData(lastWateringDaysInit)
        setNextWateredData(nextWateringDaysInit)
      }
    )
  }

  useFocusEffect(
    React.useCallback(() => {
      const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
      let nextWateringDaysVisInit = []
      let lastWateringDaysVisInit = []
      let wateringDaysInit = []
      let nextWateringDaysInit = []
      plantsRef
      .orderBy('nextWateringDate','asc')
      .onSnapshot(
        querySnapshot => {
          querySnapshot.forEach((plant) => {
            nextWateringDaysInit.push(moment(plant.data().nextWateringDate).startOf('day').toString())
            wateringDaysInit.push(plant.data().wateringDates)

            if(moment().startOf('day').valueOf() === plant.data().nextWateringDate){
              nextWateringDaysVisInit.push(plant.data())
            }

            if(plant.data().wateringDates.includes(moment().startOf('day').valueOf())){
              lastWateringDaysVisInit.push(plant.data())
            }
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

        setLastWateredData(lastWateringDaysVisInit)
        setNextWateredData(nextWateringDaysVisInit)
        setWateringDays(daysRounded)
      }
    )
    }, [])
  );


const customDatesStylesCallback = date => {
  switch(date) {
    case date:
        if(nextWateringDays.includes(moment(date).startOf('day').toString())){
          return {
          style:{
            backgroundColor: '#034732',
          },
          textStyle: {
            color: 'white',
            fontWeight: 'bold',
          }
        };}
        if(wateringDays.includes(moment(date).startOf('day').toString())){
          return {
          style:{
            backgroundColor: '#C9E4CA',
          },
          textStyle: {
            color: 'white',
            fontWeight: 'bold',
          }
        };}
        else {
          return {
            textStyle: {
              color: 'black',
              fontWeight: 'bold',
            }
          }
        }
  }
}


  return (
    <SafeAreaView style={{alignItems:'center', paddingTop: '3%', height: '100%'}}>
      <View style={{width: '90%', backgroundColor: 'rgba(3, 71, 50, .5)', borderTopLeftRadius: 25, borderTopRightRadius:25}}>
      <View style={{flexDirection:'row', alignItems:'center', paddingVertical:10, paddingTop:30, width: '90%'}}>
                <Text style={{paddingLeft: 20, fontSize: 25, fontWeight: 'bold', color: '#fff'}}>Calendar</Text>
              <CalendarDaysIcon size={25} style={{color:'#fff', marginLeft: 5}}/>
      </View>
      <View style={{paddingBottom: 15,borderColor: '#034732', borderBottomWidth: 2, width: '90%',marginLeft:'5%'}}>
      <CalendarPicker onDateChange={changeData} width={325}
      previousTitleStyle={{fontWeight:'500', color: '#fff'}}
      nextTitleStyle={{fontWeight:'500', color: '#fff'}}
      monthTitleStyle={{fontWeight:'bold', color:'#034732'}}
      yearTitleStyle={{fontWeight:'bold', color:'#034732'}}
      customDatesStyles={customDatesStylesCallback} onMonthChange={changeMonth}/>
      </View>
      <View style={{height: '100%'}}>

      </View>
      </View>
    </SafeAreaView>
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
  textView: {
    paddingTop: '3%',
    marginTop: '3%',
    backgroundColor: '#034732',
    width: '100%',
    height: '100%',
    overflow: 'scroll',
  }
});
