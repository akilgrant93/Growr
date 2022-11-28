import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../config'

const Detail = ({route}) => {
  const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
  const [textHeading, onChangeHeadingText] = useState(route.params.item.name)
  const navigation = useNavigation()

  const updatePlant = () => {
    if(textHeading && textHeading.length > 0){
      plantsRef
      .doc(route.params.item.id)
      .update({
        heading: textHeading,
      }).then(() => {
        navigation.navigate('Dashboard')
      }).catch((error) => {
        alert(error.message)
      })
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textField}
        onChangeText={onChangeHeadingText}
        value={textHeading}
        placeholder='Update Plant'
      />
      <Pressable
        style={styles.updateButton}
        onPress={() => {updatePlant()}}
      >
        <Text>UPDATE PLANT</Text>
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
