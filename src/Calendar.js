import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {firebase} from '../config'
import { FontAwesome } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native';

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
                <FontAwesome
                style={{paddingLeft: 5}}
                name='calendar'
                 color='#fff'
                 size={22}
              />
      </View>
      <CalendarPicker onDateChange={changeData} width={325}
      previousTitleStyle={{fontWeight:'500', color: '#fff'}}
      nextTitleStyle={{fontWeight:'500', color: '#fff'}}
      monthTitleStyle={{fontWeight:'bold', color:'#034732'}}
      yearTitleStyle={{fontWeight:'bold', color:'#034732'}}
      customDatesStyles={customDatesStylesCallback} onMonthChange={changeMonth}/>
      <View style={[styles.textView]}>
      <View style={{flexDirection:'row'}}>
      <View style={nextWateredData.length || lastWateredData.length ? {width: 20, alignSelf:'flex-end', marginBottom: 20, paddingLeft: 2.5} : null}>
      {nextWateredData.length > 6 && !toggled ? <FontAwesome
                size={25}
                name='caret-down'
                color='#F97068'
              /> : null}

      {lastWateredData.length > 6 && !toggled ? <FontAwesome
                size={25}
                name='caret-down'
                color='#F97068'
              /> : null}
      </View>
      <View style={{alignSelf:'center', width: '95%'}}>

      {!lastWateredData.length && !nextWateredData.length ?
      <Text style={{color:'#F97068', fontSize:20, fontWeight:'bold', alignSelf:'center', marginTop: '35%'}}>No plants need water or have been watered {moment(date).startOf('day').valueOf() === moment().startOf('day').valueOf() ? 'today' : 'on this day'}</Text>
      : <View/>}

      {/* Needs Water - load tags into flatlist*/}
      {nextWateredData.length ?
      <View style={{height: 176}}>
        <Text style={{color:'#F97068', fontSize:20, fontWeight:'bold', marginLeft: '2.5%',}}>What needs water:</Text>
        <Text style={{fontSize: 16, fontWeight:'600', color: 'white', paddingBottom: 10, marginLeft: '2.5%',}}>
        {moment(date).format("dddd, MMMM Do YYYY")}
        </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{width: '100%'}}
        data={nextWateredData}
        numColumns={2}
        onEndReached={() => setToggled(true)}
        renderItem={({item, index}) => {
            return (
            <View key={item.index || index} style={{width:'50%'}}>
              <View style={{
              flexDirection: 'column',
              width: '95%',
              marginLeft: '2.5%',
              marginBottom: 1,
              flex:1,
              }}>
                {/* neeeds indoors and tags modularity */}
                  <TouchableOpacity
                  onPress={() => navigation.navigate('UpdateModal',item)}>
                    <View style={{ flexDirection: 'row',
                    height: 40,
                     overflow:'hidden',
                     alignItems:'center',
                     justifyContent: 'space-between',
                    shadowOpacity: .25,shadowOffset: {width:1,height:1}, shadowRadius: 2, borderRadius: 5, backgroundColor: '#fff' }}>
                      <View>

                      <View >
                      <Text style={{fontSize: 12,
                        fontWeight: 'bold', paddingLeft: 5}}>
                        {item.name}
                      </Text>
                      </View>
                      </View>
                    </View>
                  </TouchableOpacity>
              </View>
            </View>
            )
        }}
      />
      </View>
      :<View/>}

      {/* Was Watered - load tags into flatlist */}
      {lastWateredData.length ?
      <View style={{height: 176}}>
        <Text style={{color:'#F97068', fontSize:20, fontWeight:'bold', marginLeft: '2.5%',}}>What you watered</Text>
        <Text style={{fontSize: 16, fontWeight:'600', color: 'white', paddingBottom: 10, marginLeft: '2.5%',}}>
        {moment(date).format("dddd, MMMM Do YYYY")}
        </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{width: '100%'}}
        data={lastWateredData}
        numColumns={2}
        onEndReached={() => setToggled(true)}
        renderItem={({item, index}) => {
            return (
            <View key={index} style={{width:'50%'}}>
              <View style={{
              flexDirection: 'column',
              width: '95%',
              marginLeft: '2.5%',
              marginBottom: 1,
              flex:1,
              }}>
                {/* neeeds indoors and tags modularity */}
                  <TouchableOpacity
                  onPress={() => navigation.navigate('UpdateModal',item)}>
                    <View style={{ flexDirection: 'row',
                    height: 40,
                     overflow:'hidden',
                     alignItems:'center',
                     justifyContent: 'space-between',
                    shadowOpacity: .25,shadowOffset: {width:1,height:1}, shadowRadius: 2, borderRadius: 5, backgroundColor: '#fff' }}>
                      <View>
                      <View >
                      <Text style={{fontSize: 12,
                        fontWeight: 'bold', paddingLeft: 5}}>
                        {item.name}
                      </Text>
                      </View>
                      </View>
                    </View>
                  </TouchableOpacity>
              </View>
            </View>
            )
        }}
      />
      </View>
      :<View/>}

      {lastWateredData.length
      ? <Text style={{color:'#E4F1E4', fontSize:15, fontWeight:'bold', marginLeft: '1.5%', marginTop: 5}}>Nothing needs water</Text>
      : <View/>
      }

      {nextWateredData.length
      ? <Text style={{color:'#E4F1E4', fontSize:15, fontWeight:'bold', marginLeft: '1.5%', marginTop: 5}}>Nothing was watered</Text>
      : <View/>
      }
{/*
      {lastWateredData.length ? lastWateredData.map((dateInfo, idx) => {
        return <Text style={{marginTop: '2%', color: 'white'}} key={idx}>Your {dateInfo.name} was watered</Text>
      }) : <View/>} */}

      </View>
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
