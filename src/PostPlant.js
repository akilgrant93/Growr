import { StyleSheet, Text, View, Keyboard, Platform, ImageBackground, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import Slider from '@react-native-community/slider';
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Calendar from "expo-calendar";
import moment from 'moment';
import { PlusCircleIcon } from 'react-native-heroicons/outline'
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons'
import Blink from './Blink'
import { useNavigation } from '@react-navigation/native';

const PostModal = ({route}) => {
  const navigation = useNavigation()
  const [image, setImage] = useState(null);
  const [isPotted, setIsPotted]= useState(false)
  const [isIndoors, setIsIndoors]= useState(false)
  const [isHydroponic, setIsHydroponic]= useState(false)
  const [sliderValue, setSliderValue]= useState(0)
  const [hoverValue, setHoverValue]= useState(0)
  const [calendars, setCalendars]= useState([])
  const [bottomReached, setBottomReached] = useState(false)

  // imgsrc.
  // const diseasesObj = {
  //   rootRot:'Root Rot',
  //   canker:'Canker',
  //   verticilliumWilt:'Verticillium Wilt',
  //   bacterialWilt:'Bacterial Wilt',
  //   mosaicVirus:'Mosaic Virus',
  //   leafBlight:'Leaf Blight',
  //   blackSpot:'Black Spot',
  //   powderyMildew:'Powdery Mildew',
  //   blackDot:'Black Dot',
  //   caneBlight:'Cane Blight'
  // }
  //notification function
  const setMaxSliderValue = () => {
    if(route.params.item.tags.includes('Cactus') || route.params.item.tags.includes('Succulent') || isHydroponic){
      return 15
    } else {
      return 8
    }
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }

  const postPlant = (plant, indoors, potted, hydroponic) => {
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

      postUserPlant(
        plant.commonName,
        plant,
        isPotted,
        isIndoors,
        isHydroponic,
        succulent, '', base, sliderValue
      )

    setIsPotted(false)
    setIsIndoors(false)
    setIsHydroponic(false)
    navigation.navigate('My Garden')
  }

   const postUserPlant = async(
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
    const newUserPlant = plantsRef.doc()
    const newUserPlantID = newUserPlant.id

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
            plant,
          }
        },
        //will need to switch seconds to days

        //calculate seconds such that it actually translates to days - eventually landing on the exact date at 12 PM. Change notification time function added in later updates.
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
        id: newUserPlantID,
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
      newUserPlant
      .set(plantData)
      .then(() => {
        setSliderValue(0)
        setIsHydroponic(false)
        setIsIndoors(false)
        setIsPotted(false)
        Keyboard.dismiss()
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

const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};

  return (
    <View style={[styles.container, {backgroundColor: '#034732'}]}>
      <SafeAreaView style={{backgroundColor:'rgba(240,240,240,.25)', width:'100%', height: '100%'}}>
      <View style={[{backgroundColor: '#F97068', position:'absolute', marginLeft: 150, width: '60%', marginTop: 35, borderTopLeftRadius: 25, borderBottomLeftRadius: 25, height: 51, justifyContent:'center'}, styles.shadow]}>
      <Text style={{fontSize: 15, padding:7.5, paddingLeft: 15,fontWeight:'900', color:'white', }}>{route.params.item.commonName}</Text>
      </View>
        <View style={[styles.shadow, {height: '92.5%'}]}>
        <View style={{alignItems:'center', height: '100%', width: '90%', marginLeft: '5%', marginTop: 50, borderRadius: 25, overflow:'hidden', backgroundColor:'#82A398'}}>
        <View style={{flexDirection:'row', backgroundColor:'#82A398'}}>

<ImageBackground source={{ uri: route.params.item.imgSrc }} style={{width: '100%', height: 270}}>

<View style={{flex:1, justifyContent:'center', backgroundColor:'rgba(0,0,0,.25)'}}>

<View style={{justifyContent:'space-between', paddingTop: 10, paddingHorizontal: 10, justifyContent:'center', alignItems:'center'}}>
<Text style={{color:'white', textAlign:'center', paddingVertical: '17.5%', fontWeight:'800', fontSize: 24}}>
  {route.params.item.commonName}
</Text>
<View style={{alignItems:'center'}}>
{route.params.item.tags.length > 0
  ?<View style={[styles.tagBox, {padding:10, paddingHorizontal:15, width: '100%'}]}>
 {route.params.item.tags.map((tag, idx) => {
 return  <View key={idx} style={[styles.tag, styles.shadow, {marginVertical:2.5}]}><Text style={{color:'white'}}>{titleCase(tag[0].toUpperCase()+tag.slice(1))}</Text></View>
  })}
  </View>
  : <View/>}
  {route.params.item.tags.includes('carnivorous') ? <Text style={{color:'white', fontWeight:'bold'}}>*Distilled or rainwater only</Text> : null}
</View>
</View>


</View>

</ImageBackground>

  </View>

  <View style={{width:'100%', flex:1}}>
  <View  style={{width: '100%', paddingBottom: 5, paddingHorizontal: 15, paddingTop: 7.5}}>
    <View style={[styles.shadow, {flexDirection:'row'}]}>
    <View style={[moment(route.params.item.nextWateringDate).startOf('day').diff(moment().startOf('day'), 'days') > 0 ?{backgroundColor:'#545B98'}:{backgroundColor:'#F97068'}, {borderRadius: 25, overflow:'hidden', padding: 10, marginBottom: 10,width: '40%'}]}>
      <Text style={{fontWeight:'bold', color:'white'}}>Description:</Text>
    </View>
    </View>
<ScrollView style={[{height:140, padding:15, backgroundColor:'rgba(255,255,255, .75)', borderRadius: 10}, styles.shadow]} onScroll={({nativeEvent}) => {
  if (isCloseToBottom(nativeEvent)) {
  setBottomReached(true)
  }
  }}
scrollEventThrottle={400}>
<Text style={{paddingBottom: 25}}>
{route.params.item.description}
</Text>
</ScrollView>
 {!bottomReached && <Blink delay={500} duration={1000} style={{position:'absolute', top: 185, right: 15}}>
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
        style={{width:'80%', alignSelf:'center'}}
        onValueChange={value => (setSliderValue(parseInt(value)))}
        minimumTrackTintColor={setMaxSliderValue() === sliderValue || moment(route.params.item.nextWateringDate).startOf('day').diff(moment().startOf('day'), 'days') < 0 ? '#F97068' : '#545B98'}
        //refactor for succulents when added to db
        // maximumValue={route.params.item.tags.includes('Cactus') || route.params.item.tags.includes('Succulent') || isHydroponic ? 15 : 8}
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

      {!isHydroponic && sliderValue === setMaxSliderValue() ?
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
  <View style={{flexDirection: 'row', justifyContent:'space-evenly', alignItems:'center', borderTopColor: 'rgba(3, 71, 50, .25)',borderTopWidth: 1, paddingVertical:15, width: '100%'}}>
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

  {/* notes textInput */}
  {/* <View style={{width: '90%'}}>
      <TextInput placeholder='Write some notes about your plant' style={{marginTop: 5,padding: 5,width: 340}}/>
  </View> */}

  </View>

        <View style={{width: '101%', alignItems:'flex-end'}}>
      <TouchableOpacity
          onPress={() => {postPlant(route.params.item, isIndoors, isPotted, isHydroponic)}}
          style={{backgroundColor:'#545B98', padding: 15, borderTopLeftRadius: 100, flexDirection:'row', alignItems:'flex-end'}}
        >
          <Text style={{color:'#fff', paddingHorizontal: 5, paddingLeft: 10, fontWeight:'bold'}}>Track</Text>
          <PlusCircleIcon style={styles.shadow} color={'white'} size={25}/>
        </TouchableOpacity>
      </View>


        </View>
        </View>
      </SafeAreaView>

    </View>
  )
}

export default PostModal

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
    backgroundColor:'#F5928D',
    color:'white',
    borderRadius: '5%'
  }
})
