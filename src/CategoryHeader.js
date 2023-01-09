import { ImageBackground, StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'

const CategoryHeader = (props) => {
  console.log(props.title)
  const title = `../assets/${props.title}.jpg`

  return (
    <View/>
  )
}

export default CategoryHeader

const styles = StyleSheet.create({

})
