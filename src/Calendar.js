import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native'
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
  const [plants, setPlants] = useState([])
  const [date, setDate] = useState(moment().startOf('day'))
  const [lastWateredData, setLastWateredData] = useState({})
  const [nextWateredData, setNextWateredData] = useState([])
  const [toggled, setToggled] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
      let wateringDaysInit = []
      let nextWateringDaysInit = []
      let plantsArr = []
      plantsRef
      .orderBy('nextWateringDate','asc')
      .onSnapshot(
        querySnapshot => {
          querySnapshot.forEach((plant) => {
            nextWateringDaysInit.push(moment(plant.data().nextWateringDate).startOf('day').toString())
            wateringDaysInit.push(plant.data().wateringDates)
            plantsArr.push(plant.data())
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
        setPlants(plantsArr)
        setWateringDays(daysRounded)
      }
    )

    console.log('watering days',wateringDays)
    console.log('next watering days',nextWateringDays)
    // console.log('plants',plants[0])
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
      <View style={{width: '90%'}}>
        <View style={{ backgroundColor: 'rgba(3, 71, 50, .5)', borderRadius: 25, height: '52%', marginBottom: 15 }}>
      <View style={{flexDirection:'row', alignItems:'center', paddingVertical:10, paddingTop:30, width: '90%'}}>
                <Text style={{paddingLeft: 20, fontSize: 25, fontWeight: 'bold', color: '#fff'}}>Calendar</Text>
              <CalendarDaysIcon size={25} style={{color:'#fff', marginLeft: 5}}/>
      </View>
      <View style={{paddingBottom: 15, width: '90%',marginLeft:'5%'}}>
      <CalendarPicker width={Dimensions.get('window').width*.8}
      previousComponent={
        <View style={{backgroundColor:'rgba(255,255,255,.25)', width:75, marginLeft:-7.5,padding: 10,borderRadius: 25}}>
          <Text style={{fontWeight:'700', color: '#fff', fontSize:10, textAlign:'center'}}>Previous</Text>
        </View>
      }
      nextComponent={
        <View style={{backgroundColor:'rgba(255,255,255,.25)', width:75, marginRight: -7.5, padding: 10,borderRadius: 25}}>
          <Text style={{fontWeight:'700', color: '#fff', fontSize:10, textAlign:'center'}}>Next</Text>
        </View>
      }
      monthTitleStyle={{fontWeight:'900', color:'#034732', fontSize:16}}
      yearTitleStyle={{fontWeight:'900', color:'rgba(255,255,255,.75)', fontSize:16}}
      headerWrapperStyle={{backgroundColor:'#F97068', paddingTop: 5, borderRadius: 25, paddingBottom:5}}
      customDatesStyles={customDatesStylesCallback}/>
      </View>
        </View>

      <View style={{height: '44.5%', backgroundColor:'rgba(249,112,104,.5)', borderRadius: 25, paddingHorizontal: '5%'}}>

        {/* this will be the template for the flatlist item */}
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={{color:'#034732', fontWeight:'bold',fontSize:40, marginTop: 10}}>{moment().format('DD')}</Text>
          <View style={{justifyContent:'center'}}>
          <Text style={{color:'#034732', fontWeight:'bold',fontSize:16, textAlign:'right'}}>{moment().format('dddd')}</Text>
          <Text style={{color:'rgba(3, 71, 50, .5)', fontWeight:'bold',fontSize:12, textAlign:'right'}}>{moment().format('MMMM')}</Text>
          </View>
        </View>

          <View style={{flexDirection:'row'}}>
            {/* map function or flatlist will populate these according to date */}
          <Text style={{fontWeight:'bold', color:'#034732', paddingRight: '5%'}}>TODO</Text><Text style={{color:'white'}}>Water Plants</Text>
          </View>

          <View style={{flexDirection:'row'}}>
          <Text style={{fontWeight:'bold', color:'rgba(255,255,255,.5)', paddingRight: '5%'}}>DONE</Text><Text style={{color:'white'}}>Water Plants</Text>
          </View>
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
