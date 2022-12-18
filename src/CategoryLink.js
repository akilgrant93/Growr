import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native'
import React, {useEffect} from 'react'

const CategoryLink = (props) => {
  return (
    <View style={{flex: .9}}>
      <TouchableOpacity onPress={() => props.navigation.navigate('PlantsByCategory', props.type)}>
          <ImageBackground
          source={
            props.type === 'edible'
            ? require(`../assets/edible.jpg`)
            : props.type === 'medicinal'
            ? require(`../assets/medicinal.jpg`)
            : props.type === 'fruit'
            ? require(`../assets/fruit.jpg`)
            : props.type === 'tropical'
            ? require(`../assets/tropical.jpg`)
            : props.type === 'succulent'
            ? require(`../assets/succulent.jpg`)
            : require(`../assets/hydroponic.jpg`)} resizeMode="cover">
          <Text style={{
            color: "white",
            fontSize: 30,
            lineHeight: 184,
            fontWeight: "bold",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.25)"}}>{props.type[0].toUpperCase()+props.type.slice(1)}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  )
}

export default CategoryLink

const styles = StyleSheet.create({})
