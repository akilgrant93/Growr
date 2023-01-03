import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { useNavigation } from '@react-navigation/native'
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {firebase} from '../config'
import { FontAwesome } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native';
import { CalendarDaysIcon } from 'react-native-heroicons/solid';
import Blink from './Blink'

const MyCalendar = () => {
  const navigation = useNavigation()
  const [wateringDays, setWateringDays] = useState([])
  const [nextWateringDays, setNextWateringDays] = useState([])
  const [dateInfo, setDateInfo] = useState([])
  const [dates, setDates] = useState([])
  const [plants, setPlants] = useState([])
  const [ref, setRef] = useState(null);
  const [bottomReached, setBottomReached] = useState(false)
  const scrollViewRef = useRef(null);

  useEffect(() => {
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


        let range = 1 + moment(nextWateringDaysInit[nextWateringDaysInit.length-1]).diff(moment(daysRounded[0]).startOf('day'), 'days')

        let datesArr = []
        let datesArr2 = []

    for(let i = 0; i < range; i++){
      let nextPlantsToWaterArr = []
      let previouslyWateredPlantsArr = []

      datesArr.push({date:moment(daysRounded[0]).startOf('day').add(i,'days')})
      datesArr2.push(moment(daysRounded[0]).startOf('day').add(i,'days').toString())

      if(daysRounded.includes(moment(daysRounded[0]).startOf('day').add(i,'days').toString())){
        datesArr[i].previousWateringDay = true
        plantsArr.forEach((plant) => {
          if(plant.wateringDates.includes(moment(daysRounded[0]).startOf('day').add(i,'days').valueOf())){
            previouslyWateredPlantsArr.push(plant)
          }
        })
        datesArr[i].previouslyWateredPlants = previouslyWateredPlantsArr
      }

      if(nextWateringDaysInit.includes(moment(daysRounded[0]).startOf('day').add(i,'days').toString())){
        datesArr[i].nextWateringDay = true
        plantsArr.forEach((plant) => {
          if(plant.nextWateringDate === moment(daysRounded[0]).startOf('day').add(i,'days').valueOf()){
            nextPlantsToWaterArr.push(plant)
          }
        })
        datesArr[i].nextPlantsToWater = nextPlantsToWaterArr
      }

    }
    setDates(datesArr2)
    setDateInfo(datesArr)
    setPlants(plantsArr)
    setWateringDays(daysRounded)
    setTimeout(function () {
      scrollViewRef.current?.flashScrollIndicators();
  }, 500);
    // if(dates.length){
    //   for(let i = 0; i < dates.length; i++){
    //   if(dates[i] === moment().startOf('day').toString()){
    //     ref.scrollToIndex({animated: false, index: i})
    //   }}
    // }
      }
    )


  }, [])

  useFocusEffect(
    React.useCallback(() => {

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

const changeDate = (date) => {
  //scroll to date
  if(dates.includes(date.startOf('day').toString())){

    for(let i = 0; i < dates.length; i++){
      if(dates[i] === date.startOf('day').toString()){
        ref.scrollToIndex({animated: true, index: i})
      }
    }
  } //if the date is before the beginning of the range of dates
  else if (date.startOf('day').valueOf() < moment(dates[0]).valueOf()) {
    ref.scrollToIndex({animated: true, index: 0})
  } //if the date is after the end of the range of dates
  else if (date.startOf('day').valueOf() > moment(dates[dates.length-1]).valueOf()) {
    ref.scrollToIndex({animated: true, index: dates.length-1})
  }
}

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

  return (
    <SafeAreaView style={{alignItems:'center', paddingTop: '3%', height: '100%'}}>
      <View style={{width: '90%'}}>
        <View style={{ backgroundColor: 'rgba(3, 71, 50, .5)', borderRadius: 25, height: '52%', marginBottom: 15 }}>
            <View style={{flexDirection:'row', alignItems:'center', paddingVertical:10, paddingTop:30, width: '90%'}}>
                <Text style={{paddingLeft: 20, fontSize: 25, fontWeight: 'bold', color: '#fff'}}>Calendar</Text>
                <CalendarDaysIcon size={25} style={{color:'#034732', marginLeft: 5}}/>
            </View>
      <View style={{paddingBottom: 15, width: '90%',marginLeft:'5%'}}>
      <CalendarPicker
      onDateChange={changeDate}
      width={Dimensions.get('window').width*.8}
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
      headerWrapperStyle={[{backgroundColor:'#F97068', paddingTop: 5, borderRadius: 25, paddingBottom:5}, styles.shadow]}
      customDatesStyles={customDatesStylesCallback}/>
      </View>
        </View>

      <View style={{height: '44.5%', backgroundColor:'rgba(249,112,104,.5)', borderRadius: 25, overflow:'hidden'}}>

          <View style={{flexDirection:'row', alignItems:'center', paddingTop:10, paddingTop:30, marginLeft: 15}}>
              <Text style={{fontSize: 25, fontWeight: 'bold', color: '#fff'}}>Reminders</Text>
              <FontAwesome
                style={{marginLeft: 5}}
                name='bell'
                size={20}
                color='rgba(249,112,104,1)'
                />
            </View>

      <FlatList
          ref={(ref) => {
             setRef(ref);
             }}
          showsVerticalScrollIndicator={false}
          data={dateInfo}
          getItemLayout={(data, index) => ({
             length: 168,
             offset: 168 * index,
             index,
             })}
          renderItem={({item, index}) => {
            let total = 0
            return (
            <View key={index} style={[{paddingBottom: 20}, item.date.toString() === moment().startOf('day').toString() ? {backgroundColor:'rgba(249,112,104,.5)'}: null]}>
              {/* <Text>
                {moment(item.date).format('DD')}
                </Text> */}
                <View style={{paddingHorizontal:15}}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 15}}>
                      <Text style={[{ fontWeight:'bold',fontSize:40, marginTop: 10}, !item.nextPlantsToWater && !item.previouslyWateredPlants ? {color:'rgba(255,255,255,.5)'} : {color:'#fff',}]}>{moment(item.date).format('DD')}</Text>
                      <View style={{justifyContent:'center'}}>
                          <Text style={[{ fontWeight:'bold',fontSize:16, textAlign:'right'}, !item.nextPlantsToWater && !item.previouslyWateredPlants ? {color:'rgba(255,255,255,.5)'} : {color:'rgba(255,255,255,.9)'}]}>{moment(item.date).format('dddd')}</Text>
                          <Text style={[{fontWeight:'bold',fontSize:12, textAlign:'right'}, !item.nextPlantsToWater && !item.previouslyWateredPlants ? {color:'rgba(255,255,255,.25)'} : {color:'rgba(255,255,255,.75)',}]}>{moment(item.date).format('MMMM')}</Text>
                      </View>
                  </View>



                  <ScrollView style={{height: 75}}
                  ref={scrollViewRef}
                  persistentScrollbar={true}
                  scrollEventThrottle={400}
                  >
                  {item.date.toString() === moment().startOf('day').toString() && item.nextPlantsToWater === undefined && item.previouslyWateredPlants === undefined ? <View key={index} style={{flexDirection:'row', marginBottom:7.5}}>
                  <Text style={{fontWeight:'bold', opacity:0,paddingRight: '5%'}}>TODO</Text><Text style={{color:'#fff'}}>No tasks today</Text>
                      </View> : null}

                  {item.nextPlantsToWater ? item.nextPlantsToWater.map((plant, index) => {
                    total += 1
                    return (
                      <View key={index} style={{flexDirection:'row', marginBottom:7.5}}>
                        <Text style={{fontWeight:'bold', color:'#034732', paddingRight: '5%'}}>TODO</Text><Text style={{color:'#fff'}}>Water {plant.name}</Text>
                      </View>
                    )
                  }) : null}

                  {item.previouslyWateredPlants ? item.previouslyWateredPlants.map((plant, idx) => {
                    total +=1
                    return (
                      <View key={idx} style={{flexDirection:'row', marginBottom:7.5}}>
                        <Text style={{fontWeight:'bold', color:'#034732', paddingRight: '5%'}}>DONE</Text><Text style={{color:'white'}}>Water {plant.name}</Text>
                      </View>
                    )
                  }) : null}
                  </ScrollView>

                    {total >= 4 ?<Blink duration={1000}>
                      <FontAwesome
                        style={{position:'absolute', bottom:10, right:8.5}}
                        color='rgba(249,112,104,.75)'
                        name='sort-desc'
                        size={35}
                      />
                    </Blink> : null}



                </View>
            </View>
            )
          }}
        />

        {wateringDays && nextWateringDays ? null : <Text style={{textAlign:'center', fontSize: 18,fontWeight:'bold', color:'white', paddingTop: 100}}>No Reminders</Text>}

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
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
});
