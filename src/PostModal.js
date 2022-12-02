import { StyleSheet, Text, View, TextInput, Pressable, Keyboard,  } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import Slider from '@react-native-community/slider';
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'
import * as Notifications from 'expo-notifications';

const PostModal = ({route, navigation}) => {
  const [isPotted, setIsPotted]= useState(false)
  const [isIndoors, setIsIndoors]= useState(false)
  //this state value will disable the checkboxes for isPotted and isIndoors
  const [isHydroponic, setIsHydroponic]= useState(false)

  const [active, setActive]= useState(false)
  const [sliderValue, setSliderValue]= useState(0)
  const [slidingState, setSlidingState]= useState('inactive')
  const [hoverValue, setHoverValue]= useState(0)

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

  //leave unfinished until we complete search function and modal page

  const resolveAfterTime = function(time, key) {
    return new Promise(resolve => {
      setTimeout(() => {
        plantNeedsWaterNotif(key)
      }, time * 1000);
    });
  }

  //triggers with notification
const plantNeedsWaterNotif = (key) => {
    const uid=firebase.auth().currentUser.uid
  //timestamp needs to be translated into real date for calendar functions
    // return(dispatch) => {
    //   firebase.database().ref(`/users/${uid}/plants/${key}`).update({isThirsty: true})
    // }
  }

  const postPlant = async(plant, indoors, potted, hydroponic) => {


    let indoorStatus = ''
    let pottedStatus = ''
    let hydroponicStatus = ''
    let succulent

    if(indoors){
      indoorStatus = "Indoor"
    } else {
      indoorStatus = "Outdoor"
    }
    if(potted){
      pottedStatus = "Potted"
    } else {
      pottedStatus = "In-Ground"
    }
    if(hydroponic){
      hydroponicStatus = 'Hydroponic'
      pottedStatus = ''
    }

    if(plant.tags.includes('Succulent') || plant.tags.includes('Cactus') || plant.familyName === 'Cactaceae'){
      succulent = true
    } else {
      succulent = false
    }

    let base = 7

    if(hydroponic){
      base = 14
    }

    //
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
      } else if (!suculent && !indoors){
        base = 3
      //if indoors not succulent
      } else {
        base = 7
      }
      }

    //if the common name is bugged
    if(typeof plant === 'string'){
      let notificationID = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${indoorStatus} ${hydroponicStatus} ${pottedStatus} ${plant}`,
          body: 'Needs water.',
        },
        trigger: {
          seconds: base,
          repeats: false
        }
      })

      postUserPlant(plant, isPotted, isIndoors,
        isHydroponic,
        succulent, '', base, notificationID, plant.firestoreID)
      resolveAfterTime(base);
      }

    //if theres a common name
    if(plant.commonName){
      let notificationID = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${indoorStatus} ${hydroponicStatus} ${pottedStatus} ${plant.commonName}`,
          body: 'Needs water.',
        },
        trigger: {
          seconds: base,
          repeats: false
        }
      })
      postUserPlant(
        plant.commonName,
        isPotted,
        isIndoors,
        isHydroponic,
        succulent, '', base, notificationID, plant.firestoreID
      )
      resolveAfterTime(base);
    //otherwise refer to the scientific name
    } else if(!plant.commonName && typeof plant !== 'string') {
      let notificationID = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${indoorStatus} ${hydroponicStatus} ${pottedStatus} ${plant.scientificName}`,
          body: 'Needs water.',
        },
        trigger: {
          seconds: base,
          repeats: false
        }
      })
      postUserPlant(plant.scientificName, isPotted, isIndoors,
        isHydroponic,
        succulent, '', base, notificationID, notificationIDplant.firestoreID)
      resolveAfterTime(base);
    }
    setIsPotted(false)
    setIsIndoors(false)
    setIsHydroponic(false)
    // pass this from the postPlant component
    // setTableData(false)
    navigation.navigate('Dashboard')

    console.log('TIME TILL WATERNOTIF ',base,' seconds')
  }

   function postUserPlant(name, isPotted, isIndoors, isHydroponic, isSucculent, notes, notificationInterval, notificationId, firestoreID){
    const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')

     console.log('FIRESTORE ID FIRESTORE ID FIRESTORE ID',firestoreID)
     const uid = firebase.auth().currentUser.uid

     //will take a value 0-7 and calculate the isThirsty property of the newPlant variable accordingly
     // const lastWatered = (days) => {}

    //  return (dispatch) => {
      const today = firebase.firestore.FieldValue.serverTimestamp()
      const data = {
        name,
        initialized:today,
        isPotted,
        isIndoors,
        isHydroponic,
        isSucculent,
        firestoreID,
        notes,
        notificationId,
        notificationInterval
      }
      plantsRef
      .add(data)
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
    //   .set(
    //     {name,
    //     initialized:today,
    //     isPotted,
    //     isIndoors,
    //     isHydroponic,
    //     isSucculent,
    //     firestoreID,
    //     notes}
    //   )
    // .catch((error) => {
    //     alert.error("Error writing document: ", error);
    // });




    //  }
    }


//   const postUserPlant = (item, isIndoors, isPotted, isHydroponic, notes,notificationInterval, notificationId, firestoreID) => {
//     if(addData && addData.length > 0){
//      //timestamp
//      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
//      const data = {
//        heading: addData,
//        createdAt: timestamp,
//      }
//      plantsRef
//        .add(data)
//        .then(() => {
//          setValue('')
//          //release keyboard
//          Keyboard.dismiss()
//        })
//        .catch((error) => {
//          alert(error)
//        })
//     }
//  }

  //modal functions
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

  // useEffect(() => {
  //   console.log('route params',route.params)
  //   console.log('USER USER USER USER USER USER', user)
  // }, [])

  return (
    <View style={styles.container}>
      {/* if commonName exists, commonName else scientificName */}
      <Text style={{textAlign:'center'}}>{route.params.item.commonName ? route.params.item.commonName : route.params.item.scientificName}</Text>

      {/* if commonName exists, scientificName else nothing */}
      {route.params.item.commonName ? <View/> : <Text style={{textAlign:'center'}}>{route.params.item.scientificName}</Text>}

      {/* if familyName exists, familyName else nothing */}
      {route.params.item.family ?
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
      : ''}

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
          return <Text style={{paddingTop:1}}>•Resistant to {formattedDiseaseName}</Text>
        } else if (currDiseaseStatus === 'Susceptible'){
          return <Text style={{paddingTop:1, color:'red'}}>•Susceptible to {formattedDiseaseName}</Text>
        }

      })}
      </View>
      </View>
      : ''}


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
          onSlidingComplete={value => console.log(sliderValue)}
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

          {/* notes textbox field */}

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
