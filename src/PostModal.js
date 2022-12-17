import { StyleSheet, Text, View, TextInput, Pressable, Keyboard,  } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import Slider from '@react-native-community/slider';
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import * as Notifications from 'expo-notifications';
import * as Calendar from "expo-calendar";
import moment from 'moment';

const PostModal = ({route, navigation}) => {
  const [isPotted, setIsPotted]= useState(false)
  const [isIndoors, setIsIndoors]= useState(false)
  //this state value will disable the checkboxes for isPotted and isIndoors
  const [isHydroponic, setIsHydroponic]= useState(false)

  const [active, setActive]= useState(false)
  const [sliderValue, setSliderValue]= useState(0)
  const [slidingState, setSlidingState]= useState('inactive')
  const [hoverValue, setHoverValue]= useState(0)
  const [calendars, setCalendars]= useState([])

  const diseasesObj = {
    rootRot:'Root Rot',
    canker:'Canker',
    verticilliumWilt:'Verticillium Wilt',
    mosaicVirus:'Mosaic Virus',
    leafBlight:'Leaf Blight',
    blackSpot:'Black Spot',
    powderyMildew:'Powdery Mildew',
    blackDot:'Black Dot',
    caneBlight:'Cane Blight'
  }

  //notification function

  const postPlant = (plant, indoors, potted, hydroponic) => {
    let succulent

    if(plant.tags.includes('Succulent') || plant.tags.includes('Cactus') || plant.familyName === 'Cactaceae'){
      succulent = true
    } else {
      succulent = false
    }

    let base = 7
    if(hydroponic){
      base = 14
    }

    if(succulent){
      //if indoors
      if(indoors){
        base = 14
      }
      //if outdoors and potted
      else if (!indoors && potted){
        base = 7
      }
      //outdoors in the ground
      else if (!indoors && !potted){
        base = 28
      }
    }

    //if potted
    else if(potted){
      //if succulent and outdoors
      if(succulent && !indoors){
        base = 7
      //if succulent and indoors
      } else if (succulent && indoors) {
        base = 14
      //if outdoors and not succulent
      } else if (!succulent && !indoors){
        base = 3
      //if indoors not succulent
      } else {
        base = 7
      }
      }

    //if the common name is bugged
    if(typeof plant === 'string'){
      postUserPlant(
        plant,
        isPotted,
        isIndoors,
        isHydroponic,
        succulent, '', base, sliderValue,plant.firestoreID
        )
      }

    //if theres a common name
    if(plant.commonName){
      postUserPlant(
        plant.commonName,
        isPotted,
        isIndoors,
        isHydroponic,
        succulent, '', base, sliderValue,plant.firestoreID
      )
    //otherwise refer to the scientific name
    } else if(!plant.commonName && typeof plant !== 'string') {
      postUserPlant(
        plant.scientificName,
        isPotted,
        isIndoors,
        isHydroponic,
        succulent, '', base, sliderValue,plant.firestoreID)
    }
    setIsPotted(false)
    setIsIndoors(false)
    setIsHydroponic(false)
    // pass this from the postPlant component
    // setTableData(false)
    navigation.navigate('My Garden')
  }

   const postUserPlant = async(
    name,
    isPotted,
    isIndoors,
    isHydroponic,
    isSucculent, notes, notificationInterval, lastWatered,firestoreID) => {

    const one_day=1000*60*60*24;
    const now = moment()
    const today = now.startOf('day')
    const lastWateringDate = now.clone().subtract(lastWatered, 'days').startOf('day')
    const nextWateringDate = lastWateringDate.clone().add(notificationInterval, 'days')

    let date1_ms = today.valueOf();
    let date2_ms = lastWateringDate.clone().valueOf()
    const difference_ms = date1_ms - date2_ms;
    const difference_days = Math.round(difference_ms/one_day)

    let isThirsty
    let notificationID

    const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
    const newUserPlant = plantsRef.doc()
    const newUserPlantID = newUserPlant.id

    //no notification immediate alert
    if(difference_days >= notificationInterval){
      isThirsty = true
      notificationID = null

    }
    //notification with alert tied to notificationInterval
    else {
    let date1_ms = today.valueOf();
    let date2_ms = nextWateringDate.valueOf()

    const difference_ms = date2_ms - date1_ms;
    const difference_days = Math.round(difference_ms/one_day)
      isThirsty = false
      notificationID = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${
            isHydroponic
            ? 'Hydroponic'
            : isPotted
            ? 'Potted'
            : isIndoors
            ? 'Indoor'
            : 'Outdoor'} ${name}`,
          body: 'Needs water.',
          data: {
            firestoreplantID: newUserPlantID,
          }
        },
        //will need to switch seconds to days
        trigger: {
          seconds: difference_days,
          repeats: false
        }
      })
    }

    //  const eventData = {
    //   wateringDates: [lastWateringDate.valueOf()],
    //   nextWateringDate:nextWateringDate.valueOf(),
    //   notificationInterval,
    //   name,
    //   notes,
    //   plantID:newUserPlantID,
    //   firestoreID
    //  }
    //  addNewEvent(eventData)
      const plantData = {
        name,
        isPotted,
        isIndoors,
        isHydroponic,
        isSucculent,
        firestoreID,
        notes,
        notificationID,
        notificationInterval,
        nextWateringDate:nextWateringDate.valueOf(),
        lastWateringDate:lastWateringDate.valueOf(),
        isThirsty,
        wateringDates: [lastWateringDate.valueOf()],
      }
      newUserPlant
      .set(plantData)
      .then(() => {
        setSliderValue(0)
        setIsHydroponic(false)
        setIsIndoors(false)
        setIsPotted(false)
        Keyboard.dismiss()
        if(isThirsty){
          alert(`Your ${name} needs water!`)
        }
      })
      .catch((error) => {
        alert(error)
      })
    }


  const togglePotted = () => {
    if(isPotted === false){
      setIsPotted(true)
      setIsHydroponic(false)
    } else {
      setIsPotted(false)
      setIsIndoors(false)
    }
 }

  const toggleIndoors = () => {
    if(isIndoors === false){
      setIsPotted(true)
      setIsIndoors(true)
    } else {
      setIsIndoors(false)
    }
}

const toggleHydroponic = () => {
  if(isHydroponic === false){
    setIsHydroponic(true)
    setIsIndoors(false)
    setIsPotted(false)
  } else {
    setIsHydroponic(false)
  }
}

//calendar functions
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
      : { isLocalAccount: true, name: 'Growr Plant Calendar' };

  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Growr Plant Calendar',
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

//fix asap
const addNewEvent = async (eventData) => {
  try {

    console.log(eventData)

    let needsInit = true
    let calendarId

    for(let i = 0; i < calendars.length; i++){
      if(Object.values(calendars[i])[4] === 'Growr Plant Calendar'){
        needsInit = false
        calendarId = calendars[i].id
      }
    }

    if(needsInit === true){
      calendarId = await createCalendar();
    }

    //this needs createReminderAsync
    //fed via eventData
    const res = await Calendar.createEventAsync(calendarId, {
      //startDate and endDate are a reflection of lastWatered slider and potted/hydroponic/indoor status
      endDate: eventData.nextWateringDate,
      startDate: eventData.nextWateringDate,
      //conditional mirrors the notification ternary
      title: `Water ${hydroponicstatus} ${plant}`
    });
    alert('Reminder Created!');
  } catch (e) {
    console.log(e);
  }
};


useEffect(() => {
  (async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const userCalendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      setCalendars(userCalendars)
    }
  });

}, []);

  return (
    <View style={styles.container}>
      {/* if commonName exists, commonName else scientificName */}
      <Text style={{textAlign:'center'}}>{route.params.item.commonName ? route.params.item.commonName : route.params.item.scientificName}</Text>

      {/* if commonName exists, scientificName else nothing */}
      {!route.params.item.commonName ? <View/> : <Text style={{textAlign:'center'}}>{route.params.item.scientificName}</Text>}

      {/* if familyName exists, familyName else nothing */}
      {!route.params.item.family ?
      <Text style={{textAlign:'center'}}>{route.params.item.familyName}</Text> : <View/>}

      {/* icon ternaries - will be combined with tags*/}
      {/* poison icon ternary */}
      {/* edible icon ternary */}
      {/* carnivorous icon ternary */}
      {/* aquatic icon ternary */}
      {/* succulent icon ternary */}
      {/* tropical icon ternary */}
      {/* medicinalUse icon ternary */}

      {/* tag map ternary needs flexwrap*/}
      {route.params.item.tags.length > 0
      ?<View style={styles.tagBox}>
       {route.params.item.tags.map((tag, idx) => {
       return  <View key={idx} style={styles.tag}><Text style={{color:'white'}}>{tag}</Text></View>
      })}
      </View>
      : <View/>}

      {/* disease map ternary needs restyle and formatting to be text based*/}
      {route.params.item.diseases.length > 0
      ?
      <View style={{alignItems:'center'}}>
      <View style={styles.diseaseText}>
       {route.params.item.diseases.map((disease, idx) => {

        const currDisease = disease.split(':')[0]
        const currDiseaseStatus = disease.split(':')[1][0].toUpperCase()+disease.split(':')[1].slice(1)
        const formattedDiseaseName = diseasesObj[currDisease]

        if(currDiseaseStatus === 'Resistant'){
          return <Text key={idx} style={{paddingTop:1}}>•Resistant to {formattedDiseaseName}</Text>
        } else if (currDiseaseStatus === 'Susceptible'){
          return <Text key={idx} style={{paddingTop:1, color:'red'}}>•Susceptible to {formattedDiseaseName}</Text>
        }

      })}
      </View>
      </View>
      : <View/>}


      {/* icons needed */}
      <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center', marginTop: 15}}>
        <BouncyCheckbox
        style={{marginRight: 15}}
        size={20}
        textContainerStyle={{marginLeft: 5}}
        disableBuiltInState
        textStyle={{textDecorationLine: "none", fontSize: 12}}
        fillColor={isHydroponic?"#E0E0E0":"#004d00"}
        unfillColor="#FFFFFF"
        text="Potted"
        bounceEffectIn={isHydroponic ? 1 : 0.8}
        bounceEffectOut={1}
        iconStyle={isHydroponic ?{ borderColor: "#E0E0E0" }:{ borderColor: "#004d00" }}
        innerIconStyle={{ borderWidth: 2 }}
        onPress = {isHydroponic ? '' :togglePotted}
        isChecked = {isPotted}/>
        <BouncyCheckbox
        style={{marginRight: 15}}
        size={20}
        textContainerStyle={{marginLeft: 5}}
        disableBuiltInState
        textStyle={{textDecorationLine: "none", fontSize: 12}}
        fillColor={route.params.item.tags.includes('Cactus') || route.params.item.tags.includes('Succulent')?"#E0E0E0":"#004d00"}
        unfillColor="#FFFFFF"
        text="Hydroponic"
        bounceEffectIn={route.params.item.tags.includes('Cactus') || route.params.item.tags.includes('Succulent') ? 1: 0.8}
        iconStyle={route.params.item.tags.includes('Cactus') || route.params.item.tags.includes('Succulent') ?{ borderColor: "#E0E0E0" }:{ borderColor: "#004d00" }}
        innerIconStyle={{ borderWidth: 2 }}
        onPress = {route.params.item.tags.includes('Cactus') || route.params.item.tags.includes('Succulent') ? '' :toggleHydroponic}
        isChecked = {isHydroponic}/>
        <BouncyCheckbox
        size={20}
        textContainerStyle={{marginLeft: 5}}
        disableBuiltInState
        textStyle={{textDecorationLine: "none", fontSize: 12}}
        fillColor={isHydroponic?"#E0E0E0":"#004d00"}
        unfillColor="#FFFFFF"
        text="Indoors"
        bounceEffectIn={isHydroponic ? 1: 0.8}
        bounceEffectOut={1}
        bounceEffect={0}
        iconStyle={isHydroponic?{ borderColor: "#E0E0E0" }:{ borderColor: "#004d00" }}
        innerIconStyle={{ borderWidth: 2 }}
        onPress = {isHydroponic?'':toggleIndoors}
        isChecked = {isIndoors}/>
      </View>

            {/* slider form control will go here and load conditionally based on plant.tags OR isHydroponic state */}
      <Slider
          // value={value}
          style={{marginTop: 15,width:'75%', alignSelf:'center'}}
          onValueChange={value => setSliderValue(parseInt(value))}
          minimumTrackTintColor={'#004d00'}
          maximumValue={route.params.item.tags.includes('Cactus') || route.params.item.tags.includes('Succulent') || isHydroponic ? 15 : 8}
          minimumValue={0}
          value={0}
          onSlidingStart={value => setHoverValue(parseInt(value))}
          // onSlidingComplete={value => console.log(sliderValue)}
          step={1}
                />
                {/* needs to say "last resevior change" if hydroponic */}
        <Text style={{textAlign:'center'}}>Last watered {
          sliderValue === 0
          ? 'today'
          : sliderValue === 1
          ? 'yesterday'
          : sliderValue > 1 && sliderValue <= 6
          ? `${sliderValue} days ago`
          : sliderValue === 7
          ? 'a week ago'
          : sliderValue > 7 && sliderValue <= 13
          ? `${sliderValue} days ago`
          : sliderValue === 14
          ? 'two weeks ago'
          : 'over two weeks ago'
          }</Text>

          {/* notes textInput */}

        <Pressable
          style={styles.postButton}
          onPress={() => {postPlant(route.params.item, isIndoors, isPotted, isHydroponic)}}
        >
        <Text>POST PLANT</Text>
      </Pressable>
    </View>
  )
}

export default PostModal

const styles = StyleSheet.create({
  container: {
    marginTop: '50%',
    marginHorizontal: 15,
    alignItems:'center'
  },
  diseaseText: {
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'left',
    marginTop: 10,
    width: '70%'
  },
  postButton: {
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: '#0de065'
  },
  tagBox: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 10,
  },
  tag: {
    padding: 8,
    marginRight:5,
    backgroundColor:'green',
    color:'white',
    borderRadius: '5%'
  }
})
