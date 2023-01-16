import { StyleSheet, Text, View, Keyboard, Platform, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import Slider from '@react-native-community/slider';
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Calendar from "expo-calendar";
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore";
import { PlusCircleIcon } from 'react-native-heroicons/solid'

const UpdateModal = ({route, navigation}) => {
  const [isPotted, setIsPotted]= useState(false)
  const [isIndoors, setIsIndoors]= useState(false)
  const [isHydroponic, setIsHydroponic]= useState(false)
  const [plant, setPlant] = useState({})
  const [sliderValue, setSliderValue]= useState(0)
  const [hoverValue, setHoverValue]= useState(0)
  const [calendars, setCalendars]= useState([])

  // const diseasesObj = {
  //   rootRot:'Root Rot',
  //   canker:'Canker',
  //   verticilliumWilt:'Verticillium Wilt',
  //   mosaicVirus:'Mosaic Virus',
  //   leafBlight:'Leaf Blight',
  //   blackSpot:'Black Spot',
  //   powderyMildew:'Powdery Mildew',
  //   blackDot:'Black Dot',
  //   caneBlight:'Cane Blight'
  // }

  //notification function

  const updatePlant = (plant, indoors, potted, hydroponic) => {
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
        calendar:{
          wateringDates: [lastWateringDate.valueOf()],
          nextWateringDate:nextWateringDate.valueOf(),
          notificationInterval,
          name,
          notes,
         }
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
console.log('item',route.params.item.isIndoors)
}, []);

useFocusEffect(
  React.useCallback(() => {
      (async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const userCalendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      setCalendars(userCalendars)
    }
    const plantRef = firebase.firestore().collection('plant').doc(route.params.item.plant.id)

    plantRef.get().then((doc) => {
      if (doc.exists) {
          setPlant(doc.data())
          setIsHydroponic(route.params.item.isHydroponic)
          setIsIndoors(route.params.item.isIndoors)
          setIsPotted(route.params.item.isPotted)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  })();
  }, [])
);

  return (
    <View style={[styles.container, {backgroundColor: '#034732'}]}>
      <SafeAreaView style={{backgroundColor:'rgba(240,240,240,.25)', width:'100%', height: '100%'}}>
        <View style={[styles.shadow, {height: '92.5%'}]}>
        <View style={{alignItems:'center', height: '100%', width: '90%', marginLeft: '5%', marginTop: 50, borderRadius: 25, overflow:'hidden', backgroundColor:'#fff'}}>
        <View style={{flexDirection:'row', backgroundColor:'rgba(3, 71, 50, .5)'}}>
      <Image source={{ uri: route.params.item.plant.imgSrc }} style={route.params.item.plant.commonName.split(' ').length === 2 && route.params.item.plant.commonName.length > 25 ? {width: 156, height: 156} : {width: 140, height: 140}} />
      <View style={{flex:1}}>

      <View style={[{backgroundColor:'#034732', marginTop: 5,borderRadius:25,width:'95%', marginLeft: '2.5%',paddingVertical: 10, paddingHorizontal: 5}, styles.shadow]}>
      <Text style={{color:'white', paddingLeft: 5,fontWeight:'bold', fontSize: 14}}>
        {route.params.item.plant.commonName}
      </Text>
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth: 2, borderBottomColor: 'rgba(3, 71, 50, .25)', paddingVertical: 7, paddingRight: 10, paddingLeft: 5}}>
      <Text style={{fontWeight:'bold', color:'rgba(0,0,0,.25)'}}>
        Family
      </Text>
      <Text style={{color:'white'}}>
        {route.params.item.plant.family}
      </Text>
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth: 2, borderBottomColor: 'rgba(3, 71, 50, .25)', paddingVertical: 7, paddingRight: 10, paddingLeft: 5}}>
      <Text style={{fontWeight:'bold', color:'rgba(0,0,0,.25)'}}>
        Genus
      </Text>
      <Text style={{color:'white'}}>
        {route.params.item.plant.genus}
      </Text>
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between', paddingVertical: 7, paddingRight: 10, paddingLeft: 5}}>
      <Text style={{fontWeight:'bold', color:'rgba(0,0,0,.25)'}}>
        Species
      </Text>
      <Text style={{color:'white'}}>
        {route.params.item.plant.species}
      </Text>
      </View>

      </View>

        </View>

        <ScrollView style={{width:'100%'}}>
        <View  style={{width: '100%', paddingVertical:15, borderBottomColor: 'rgba(3, 71, 50, .25)',borderBottomWidth: 2, paddingHorizontal: 15}}>
          <View style={styles.shadow}>
          <View style={{backgroundColor:'#F97068', borderRadius: 25, overflow:'hidden', padding: 10, marginBottom: 5,width: '60%'}}>
            <Text style={{fontWeight:'bold', color:'white'}}>Description: </Text>
          </View>
          </View>
      <ScrollView style={{height:120, paddingHorizontal:5}}>
      <Text>
      {route.params.item.plant.description}
      </Text>
      </ScrollView>
        </View>

           {/* slider form control will go here and load conditionally based on plant.tags OR isHydroponic state */}
      <View style={{borderBottomColor: 'rgba(3, 71, 50, .25)', borderBottomWidth: 2, paddingBottom:15, width: '100%', paddingHorizontal:15}}>
            <Slider
          // value={value}
              style={{marginTop: 15,width:'100%', alignSelf:'center'}}
              onValueChange={value => setSliderValue(parseInt(value))}
              minimumTrackTintColor={'#004d00'}
              maximumValue={route.params.item.plant.tags.includes('Cactus') || route.params.item.plant.tags.includes('Succulent') || isHydroponic ? 15 : 8}
              minimumValue={0}
              value={0}
              onSlidingStart={value => setHoverValue(parseInt(value))}
              step={1}
                />
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
      </View>

        {/* icons needed */}
        <View style={{flexDirection: 'row', justifyContent:'space-evenly', alignItems:'center', borderBottomColor: 'rgba(3, 71, 50, .25)', borderBottomWidth: 2, paddingVertical:15, width: '100%'}}>
        <BouncyCheckbox
        style={{marginRight: 15}}
        size={20}
        textContainerStyle={{marginLeft: 5}}
        disableBuiltInState
        textStyle={{textDecorationLine: "none", fontSize: 12, color:'black'}}
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
        textStyle={{textDecorationLine: "none", fontSize: 12, color:'black'}}
        fillColor={route.params.item.plant.tags.includes('Cactus') || route.params.item.plant.tags.includes('Succulent')?"#E0E0E0":"#004d00"}
        unfillColor="#FFFFFF"
        text="Hydroponic"
        bounceEffectIn={route.params.item.plant.tags.includes('Cactus') || route.params.item.plant.tags.includes('Succulent') ? 1: 0.8}
        iconStyle={route.params.item.plant.tags.includes('Cactus') || route.params.item.plant.tags.includes('Succulent') ?{ borderColor: "#E0E0E0" }:{ borderColor: "#004d00" }}
        innerIconStyle={{ borderWidth: 2 }}
        onPress = {route.params.item.plant.tags.includes('Cactus') || route.params.item.plant.tags.includes('Succulent') ? '' :toggleHydroponic}
        isChecked = {isHydroponic}/>
        <BouncyCheckbox
        size={20}
        textContainerStyle={{marginLeft: 5}}
        disableBuiltInState
        textStyle={{textDecorationLine: "none", fontSize: 12, color:'black'}}
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



              {/* tag map ternary needs flexwrap*/}
              {route.params.item.plant.tags.length > 0
        ?<View style={[styles.tagBox, { borderBottomColor: 'rgba(3, 71, 50, .25)', borderBottomWidth: 2, padding:10, paddingHorizontal:15, width: '100%'}]}>
       {route.params.item.plant.tags.map((tag, idx) => {
       return  <View key={idx} style={[styles.tag, styles.shadow, {marginVertical:2.5}]}><Text style={{color:'white'}}>{tag[0].toUpperCase()+tag.slice(1)}</Text></View>
        })}
        </View>
        : <View/>}

        {/* notes textInput */}
        {/* <View style={{width: '90%'}}>
            <TextInput placeholder='Write some notes about your plant' style={{marginTop: 5,padding: 5,width: 340}}/>
        </View> */}

        </ScrollView>
      <View style={{width: '100%', alignItems:'flex-end', paddingBottom: 10, paddingRight: 10}}>
        <TouchableOpacity
          onPress={() => {postPlant(route.params.item.plant, isIndoors, isPotted, isHydroponic)}}
        >
          <PlusCircleIcon style={styles.shadow} color={'#034732'} size={50}/>
        </TouchableOpacity>
      </View>


        </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default UpdateModal

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    alignItems:'center'
  },
  diseaseText: {
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'left',
    marginTop: 5,
    width: '70%'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  tagBox: {
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    flexWrap: 'wrap'
  },
  tag: {
    padding: 8,
    marginRight:5,
    backgroundColor:'#F97068',
    color:'white',
    borderRadius: '5%'
  }
})
