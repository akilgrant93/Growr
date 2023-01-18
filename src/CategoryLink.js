import { Text, View, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'

const CategoryLink = (props) => {
  function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }

  return (
    <View style={{flex: .9}}>
      <TouchableOpacity onPress={() => props.navigation.navigate('PlantsByCategory', {name:props.type, navigation:props.navigation})}>
          <ImageBackground
          style={{height:176}}
          source={
            props.type === 'fruit'
            ? require(`../assets/fruit.jpg`)
            : props.type === 'vegetable'
            ? require(`../assets/vegetable.jpg`)
            : props.type === 'culinary herb'
            ? require(`../assets/culinary_herb.jpg`)
            : props.type === 'hydroponic'
            ? require(`../assets/hydroponic.jpg`)
            : props.type === 'houseplant'
            ? require(`../assets/houseplant.jpg`)
            : require(`../assets/carnivorous.jpg`)} resizeMode="cover">
              <View style={{height:'100%', width:'100%',backgroundColor: "rgba(0, 0, 0, 0.25)", justifyContent:'center', alignItems:'center'}}>

          <Text style={{
            color: "white",
            fontSize: 26,
            width: '90%',
            fontWeight: "bold",
            textAlign: "center"}}>{props.type.split(' ').length === 1 ? props.type[0].toUpperCase()+props.type.slice(1) : titleCase(props.type)}
          </Text>
              </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  )
}

export default CategoryLink

