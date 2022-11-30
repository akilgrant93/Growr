import { StyleSheet, Text, View, TextInput, Pressable,  } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config'

const Detail = ({route, navigation}) => {
  const [isPotted, setIsPotted]= useState(false)
  const [isIndoors, setIsIndoors]= useState(false)

  //this state value will disable the checkboxes for isPotted and isIndoors
  const [isHydroponic, setIsHydroponic]= useState(false)

  const [active, setActive]= useState(false)
  const [sliderValue, setSliderValue]= useState(0)
  const [slidingState, setSlidingState]= useState('inactive')
  const [hoverValue, setHoverValue]= useState(0)

  const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
  // const [textHeading, onChangeHeadingText] = useState(route.params.item.name)

  //leave unfinished until we complete search function and modal page
//   const addPlant = () => {
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
    } else {
      setIsPotted(true)
    }
 }

  const toggleIndoors = () => {
    if(isIndoors === false){
      setIsPotted(true)
      setIsIndoors(true)
    } else {
      setIsPotted(false)
      setIsIndoors(false)
    }
}

const toggleHydroponic = () => {
  if(isHydroponic === false){
    setIsHydroponic(true)
  } else {
    setIsHydroponic(false)
  }
}

  useEffect(() => {
    console.log('route params',route.params)
  }, [])

  return (
    <View style={styles.container}>

      {/* if commonName exists, commonName else scientificName */}
      <Text style={{textAlign:'center'}}>{route.params.item.commonName ? route.params.item.commonName : route.params.item.scientificName}</Text>

      {/* if commonName exists, scientificName else nothing */}
      {route.params.item.commonName ? '' : <Text style={{textAlign:'center'}}>{route.params.item.scientificName}</Text>}

      {/* if familyName exists, familyName else nothing */}
      {route.params.item.family ? <Text style={{textAlign:'center'}}>{route.params.item.familyName}</Text> : ''}


      {/* tag map ternary */}
      {route.params.item.tags.length > 0
      ?<View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop: 10,}}>
       {route.params.item.tags.map(tag => {
       return  <Text style={{padding: 7.5, marginRight:5,backgroundColor:'green', color:'white'}}>{tag}</Text>
      })}
      {/* poison ternary */}
      {/* edible ternary */}
      {/* carnivorous ternary */}
      {/* aquatic ternary */}
      {/* succulent ternary */}
      {/* tropical ternary */}
      {/* medicinalUse ternary */}
      </View>
      : ''}

      {/* disease map ternary */}
      {route.params.item.diseases.length > 0
      ?<View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop: 10,}}>
       {route.params.item.diseases.map(disease => {
       return  <Text style={disease.split(':')[1] === 'resistant'
       ? {padding: 7.5, marginRight:5,backgroundColor:'green', color:'white'}
       : {padding: 7.5, marginRight:5,backgroundColor:'red', color:'white'}}
       >{disease.split(':')[0]}: {disease.split(':')[1][0].toUpperCase()+disease.split(':')[1].slice(1)}</Text>
      })}

<BouncyCheckbox
  size={25}
  fillColor="red"
  unfillColor="#FFFFFF"
  text="Custom Checkbox"
  iconStyle={{ borderColor: "red" }}
  innerIconStyle={{ borderWidth: 2 }}
  textStyle={{ fontFamily: "JosefinSans-Regular" }}
/>
      {/* <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
      <CheckBox color = {'#004d00'} onPress = {togglePotted} checked = {isPotted}/>
      <CheckBox color = {'#004d00'} onPress = {toggleHydroponic} checked = {isHydroponic}/>
      <CheckBox color = {'#004d00'} onPress = {toggleIndoors} checked = {isIndoors}/>
      </View> */}

      </View>
      : ''}

      <Pressable
        style={styles.updateButton}
        onPress={() => {console.log('pressed')}}
      >
        <Text>POST PLANT</Text>
      </Pressable>
    </View>
  )
}

export default Detail

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginHorizontal: 15,

  },
  textField: {
    marginBottom: 10,
    padding: 10,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  updateButton: {
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: '#0de065'
  }
})
