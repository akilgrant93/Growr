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
import Blink from './Blink'
import { FontAwesome } from '@expo/vector-icons'
import { ArrowUpOnSquareIcon, TrashIcon } from 'react-native-heroicons/outline'
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

const UpdateModal = ({route, navigation}) => {
  console.log(route.params.item.notificationID)

  const [isPotted, setIsPotted]= useState(false)
  const [isIndoors, setIsIndoors]= useState(false)
  const [isHydroponic, setIsHydroponic]= useState(false)
  const [plant, setPlant] = useState({})
  const [sliderValue, setSliderValue]= useState(0)
  const [hoverValue, setHoverValue]= useState(0)
  const [calendars, setCalendars]= useState([])
  const [bottomReached, setBottomReached] = useState(false)
  const [toggled, setToggled] = useState(false)

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
  const titleCase = (str) => {
    return str.toLowerCase().split(' ').map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  //notification function

  const updatePlant = (plant, indoors, potted, hydroponic) => {
    let succulent


    if(plant.tags.includes('Succulent') || plant.tags.includes('Cactus') || plant.family === 'Cactaceae'){
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

    if(plant.commonName){
      updateUserPlant(
        route.params.item.name,
        plant,
        isPotted,
        isIndoors,
        isHydroponic,
        succulent,'', base, sliderValue
      )
    }
    setIsPotted(false)
    setIsIndoors(false)
    setIsHydroponic(false)
    navigation.navigate('My Garden')
  }

   const updateUserPlant = async(
    name,
    plant,
    isPotted,
    isIndoors,
    isHydroponic,
    isSucculent, notes, notificationInterval, lastWatered) => {

    const one_day=1000*60*60*24;
    const now = moment()
    const today = now.startOf('day')
    const lastWateringDate = now.clone().subtract(lastWatered, 'days').startOf('day')
    const nextWateringDate = lastWateringDate.clone().add(notificationInterval, 'days')

    let date1_ms = today.valueOf();
    let date2_ms = lastWateringDate.clone().valueOf()
    const difference_ms = date1_ms - date2_ms;
    const difference_days = Math.round(difference_ms/one_day)

    let notificationID


    const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
    const currentUserPlant = plantsRef.doc(route.params.item.id)

    console.log('testing')
    //no notification immediate alert
    if(difference_days >= notificationInterval){
      notificationID = null
    }
    //notification with alert tied to notificationInterval
    else {
    let date1_ms = today.valueOf();
    let date2_ms = nextWateringDate.valueOf()

    const difference_ms = date2_ms - date1_ms;
    const difference_days = Math.round(difference_ms/one_day)

    //if the date slider OR notificationinterval has changed has been moved (cancel old notification if it exists)
    if(toggled || route.params.item.notificationInterval === notificationInterval){
      console.log('?????')

      // await Notifications.cancelScheduledNotificationAsync(route.params.item.notificationID)

      // console.log('cancelled')

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
            firestoreplantID: route.params.item.id,
          }
        },
        //will need to switch seconds to days
        trigger: {
          seconds: difference_days*60,
          repeats: false,
        }
      })
    }
    //if the date slider hasn't been moved (notification data remains the same)
    else {
      notificationID = route.params.item.notificationID
    }

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
        id: route.params.item.id,
        plant,
        isPotted,
        isIndoors,
        isHydroponic,
        isSucculent,
        notes,
        notificationID,
        notificationInterval,
        nextWateringDate:nextWateringDate.valueOf(),
        lastWateringDate:lastWateringDate.valueOf(),
        wateringDates: [lastWateringDate.valueOf()],
      }

      currentUserPlant
      .set(plantData, {merge: true})
      .then(() => {
        setSliderValue(0)
        setIsHydroponic(false)
        setIsIndoors(false)
        setIsPotted(false)
        Keyboard.dismiss()
        if(difference_days <= 0){
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
setBottomReached(false)
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
    // console.log(route.params.item.id)
    const plantRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants').doc(route.params.item.id)

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

  const setMaxSliderValue = () => {
    if(route.params.item.plant.tags.includes('Cactus') || route.params.item.plant.tags.includes('Succulent') || isHydroponic){
      return 15
    } else {
      return 8
    }
  }

  //delete a plant from users list of plant entries
  const deletePlant = (plant) => {
    const currentPlantRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants').doc(plant.id)

    currentPlantRef
    .delete()
    .then(() => {
      alert('Deleted Successfully')
    })
    .then(() => {
      navigation.navigate('My Garden')
    })
    .catch( error =>{
      alert('Error deleting the plant')
    })
  }

  const changeValue = (value) => {
    setToggled(true)
    setSliderValue(parseInt(value))
  }

  return (
    <View style={[styles.container, {backgroundColor: '#034732'}]}>
      <SafeAreaView style={{backgroundColor:'rgba(240,240,240,.25)', width:'100%', height: '100%'}}>
      <View style={[{backgroundColor: '#545B98', position:'absolute', marginLeft: 150, width: '60%', marginTop: 35, borderTopLeftRadius: 25, borderBottomLeftRadius: 25, height: 51, justifyContent:'center'}, styles.shadow]}>
      <Text style={{fontSize: 15, padding:7.5, paddingLeft: 15,fontWeight:'900', color:'white', }}>My {route.params.item.plant.commonName}</Text>
      </View>
        <View style={[styles.shadow, {height: '92.5%'}]}>
        <View style={{alignItems:'center', height: '100%', width: '90%', marginLeft: '5%', marginTop: 50, borderRadius: 25, overflow:'hidden', backgroundColor:'#82A398'}}>
        <View style={{flexDirection:'row', backgroundColor:'rgba(3, 71, 50, .7)'}}>
      <Image source={{ uri: route.params.item.plant.imgSrc }} style={{width: 115, height: 115}} />
      <View style={{flex:1}}>

      <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth: 2, borderBottomColor: 'rgba(3, 71, 50, .25)', paddingVertical: 10, paddingRight: 10, paddingLeft: 5}}>
      <Text style={{fontWeight:'bold', color:'rgba(0,0,0,.25)'}}>
        Family
      </Text>
      <Text style={{color:'white'}}>
        {route.params.item.plant.family}
      </Text>
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth: 2, borderBottomColor: 'rgba(3, 71, 50, .25)', paddingVertical: 10, paddingRight: 10, paddingLeft: 5}}>
      <Text style={{fontWeight:'bold', color:'rgba(0,0,0,.25)'}}>
        Genus
      </Text>
      <Text style={{color:'white'}}>
        {route.params.item.plant.genus}
      </Text>
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between', paddingVertical: 10, paddingRight: 10, paddingLeft: 5}}>
      <Text style={{fontWeight:'bold', color:'rgba(0,0,0,.25)'}}>
        Species
      </Text>
      <Text style={{color:'white'}}>
        {route.params.item.plant.species}
      </Text>
      </View>

      </View>

        </View>

        <View style={{width:'100%', flex:1}}>
        <View  style={{width: '100%', paddingVertical:15, paddingHorizontal: 15}}>
          <View style={styles.shadow}>
          <View style={[moment(route.params.item.nextWateringDate).startOf('day').diff(moment().startOf('day'), 'days') > 0 ?{backgroundColor:'#545B98'}:{backgroundColor:'#F97068'}, {borderRadius: 25, overflow:'hidden', padding: 10, marginBottom: 10,width: '40%'}]}>
            <Text style={{fontWeight:'bold', color:'white'}}>Description: </Text>
          </View>
          </View>
      <ScrollView style={[{height:120, padding:15, marginBottom: 5, backgroundColor:'rgba(255,255,255, .75)', borderRadius: 10}, styles.shadow]} onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)) {
        setBottomReached(true)
        }
        }}
      scrollEventThrottle={400}>
      <Text style={{paddingBottom: 25}}>
      {route.params.item.plant.description}
      </Text>
      </ScrollView>
       {!bottomReached && <Blink delay={500} duration={1000} style={{position:'absolute', top: 175, right: 15}}>
        <FontAwesome
        style={{}}
        color='rgba(249,112,104,.75)'
        name='sort-desc'
        size={30}
        />
      </Blink>}
        </View>

           {/* slider form control will go here and load conditionally based on plant.tags OR isHydroponic state */}
      <View style={[{ paddingBottom:15, width: '100%', paddingHorizontal:15}]}>
            <Slider
          // value={value}
              style={{marginTop: 5,width:'90%', alignSelf:'center'}}
              onValueChange={value => changeValue(value)}
              minimumTrackTintColor={setMaxSliderValue() === sliderValue || moment(route.params.item.nextWateringDate).startOf('day').diff(moment().startOf('day'), 'days') < 0 ? '#F97068' : '#545B98'}
              //refactor for succulents when added to db
              // maximumValue={route.params.item.plant.tags.includes('Cactus') || route.params.item.plant.tags.includes('Succulent') || isHydroponic ? 15 : 8}
              maximumValue={setMaxSliderValue()}
              maximumTrackTintColor={'#F97068'}
              minimumValue={0}
              value={0}
              onSlidingStart={value => setHoverValue(parseInt(value))}
              step={1}
                />
                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:25}}>

            <Text style={{textAlign:'center', fontWeight:'bold',color:'#545B98'}}>{isHydroponic ? 'Resevior water changed' : 'Watered'} {
          sliderValue === 0
          ? 'today'
          : sliderValue === 1
          ? 'yesterday'
          : sliderValue > 1 && sliderValue <= 6
          ? `${sliderValue} days ago`
          : sliderValue === 7
          ? 'a week ago'
          : sliderValue > 7 && sliderValue <= 13 && setMaxSliderValue() === 15
          ? `${sliderValue} days ago`
          : sliderValue > 7 && sliderValue <= 13 && setMaxSliderValue() === 8
          ? `over a week ago`
          : sliderValue === 14
          ? 'two weeks ago'
          : 'over two weeks ago'
          }</Text>

            {!isHydroponic && sliderValue === setMaxSliderValue() || !isHydroponic && moment(route.params.item.nextWateringDate).startOf('day').diff(moment().startOf('day'), 'days') <= 0 ?
                  <Animated.View exiting={FadeOutRight} entering={FadeInRight} style={[{backgroundColor:'#F97068',padding: 5, alignSelf:'center', borderRadius: 5,marginLeft: 5,}, styles.shadow]}>
                    <Text style={{color:'white', textAlign:'center'}}>Needs water</Text>
                  </Animated.View>
                  : null}
                </View>
                {isHydroponic && <View style={{height:25, marginTop: 5}}>
                  {sliderValue === setMaxSliderValue() || moment(route.params.item.nextWateringDate).startOf('day').diff(moment().startOf('day'), 'days') < 0 ?
                  <Animated.View exiting={FadeOutRight} entering={FadeInRight} style={[{backgroundColor:'#F97068',padding: 5, alignSelf:'center', borderRadius: 5}, styles.shadow]}>
                    <Text style={{color:'white', textAlign:'center'}}>Needs resevior change</Text>
                  </Animated.View>
                  : null}
                </View>}
      </View>

        {/* icons needed */}
        <View style={{flexDirection: 'row', justifyContent:'space-evenly', alignItems:'center', borderBottomColor: 'rgba(3, 71, 50, .25)', borderBottomWidth: 1, borderTopColor: 'rgba(3, 71, 50, .25)',borderTopWidth: 1, paddingVertical:15, width: '100%'}}>
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
        ?<View style={[styles.tagBox, {padding:10, paddingHorizontal:15, width: '100%'}]}>
       {route.params.item.plant.tags.map((tag, idx) => {
       return  <View key={idx} style={[styles.tag, styles.shadow, {marginVertical:2.5}]}><Text style={{color:'white'}}>{titleCase(tag[0].toUpperCase()+tag.slice(1))}</Text></View>
        })}
        </View>
        : <View/>}

        {/* notes textInput */}
        {/* <View style={{width: '90%'}}>
            <TextInput placeholder='Write some notes about your plant' style={{marginTop: 5,padding: 5,width: 340}}/>
        </View> */}

        </View>

      <View style={{width: '101%', flexDirection:'row',justifyContent:'space-between'}}>
        <TouchableOpacity
          onPress={() => {deletePlant(route.params.item)}}
          style={{backgroundColor:'#F97068', padding: 15, borderTopRightRadius: 100, flexDirection:'row', alignItems:'flex-end'}}
        >
          <TrashIcon style={styles.shadow} color={'#fff'} size={25}/>
          <Text style={{color:'#fff', paddingHorizontal: 5, paddingRight: 10, fontWeight:'bold'}}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {updatePlant(route.params.item.plant, isIndoors, isPotted, isHydroponic)}}
          style={{backgroundColor:'#545B98', padding: 15, borderTopLeftRadius: 100, flexDirection:'row', alignItems:'flex-end'}}
        >
          <Text style={{color:'#fff', paddingHorizontal: 5, paddingLeft: 10, fontWeight:'bold'}}>Update</Text>
          <ArrowUpOnSquareIcon style={styles.shadow} color={'#fff'} size={25}/>
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
    backgroundColor: '#82A398',
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
    backgroundColor:'#F5928D',
    borderRadius: '5%'
  }
})
