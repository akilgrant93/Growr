import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import CustomSVG from './CustomSVG'
import { ScrollView } from 'react-native-gesture-handler'
import Animated, { FadeInLeft } from 'react-native-reanimated';

const SearchListItem = (props) => {
  //might need to refactor the animation delay w/ regard to the lazy loading
  return (
    <Animated.View entering={FadeInLeft.delay(200*props.item.index)} style={styles.shadow}>
                <View style={{
                marginBottom: 1,
                }}>
                    <TouchableOpacity
                    onPress={() => props.navigation.navigate('PostModal',{item:props.item.item, navigation:props.navigation})}>
                      <View style={{flexDirection: 'row',
                       overflow:'hidden', shadowOpacity: .25,shadowOffset: {width:1,height:1}, shadowRadius: 2, backgroundColor: '#fff'}}>
                        <View style={styles.textView}>

                          <Image source={{uri: props.item.item.imgSrc}} style={{height:112, width: 112}}/>

                        <View style={{alignSelf:'center', width: '62.5%', marginLeft: '1.5%', paddingTop: '1.5%'}}>
                          <View style={[{borderRadius: 25, padding: 7}, styles.shadow, props.item.index % 2 ? {backgroundColor:'#F97068'} : {backgroundColor:'#F5928D'}]}>
                        <Text style={{fontSize: 14, fontWeight: 'bold', color:'#fff'}}>
                          {!props.item.item.commonName
                            ? props.item.item.scientificName.split(' ').map((word) => {
                              return word[0].toUpperCase() + word.substr(1);
                            }).join(' ')
                            : props.item.item.commonName.split(' ').map((word) => {
                              return word[0].toUpperCase() + word.substr(1);
                            }).join(' ')}
                        </Text>
                          </View>

                        <Text style={{paddingLeft: 7, fontSize: 10, marginTop: 2.5,color:'rgba(0,0,0,.5)'}}>{props.item.item.family}</Text>
                        <ScrollView style={{height:60}}>

                        <Text style={{paddingLeft: 7, fontSize: 10, color:'#000'}}>{props.item.item.commonName.length > 20 ? props.item.item.description.slice(0,125)+'...' : props.item.item.description.slice(0,150)+'...'}</Text>
                        </ScrollView>
                        </View>




                        {/* {props.item.item.tags.includes('Edible') ? <CustomSVG size={20} name='edible'/> : <View />}
                        {props.item.item.tags.includes('Herbal') ? <CustomSVG   size={20} name='pagelines'/> : <View />}
                        {props.item.item.tags.includes('Pine') ? <CustomSVG   size={20} name='tree'/> : <View />}
                        {props.item.item.tags.includes('Carnivorous') ? <CustomSVG   size={20} name='bug'/> : <View />}
                        {props.item.item.tags.includes('Rose') || props.item.item.tags.includes('Cannabaceae') || props.item.item.tags.includes('Cane Fruit') || props.item.item.tags.includes('Stone Fruit') || props.item.item.tags.includes('Buckthorn') ? <CustomSVG   size={20} name='rose'/> : <View />}
                        {props.item.item.tags.includes('Tropical') ? <CustomSVG   size={22} name='palm'/> : <View />}
                        {props.item.item.tags.includes('Cannabaceae') ? <CustomSVG   size={18} name='cannabis'/> : <View />}
                        {props.item.item.tags.includes('Poisonous') ? <CustomSVG   size={18} name='poison'/> : <View />}
                        {props.item.item.tags.includes('Aquatic - Freshwater') ? <CustomSVG   size={18} name='aquatic'/> : <View />}
                        {props.item.item.tags.includes('Passion Fruit') || props.item.item.tags.includes('Gooseberry/Currant') || props.item.item.tags.includes('Cane Fruit') || props.item.item.tags.includes('Stone Fruit')  || props.item.item.tags.includes('Mulberry/Fig') || props.item.item.scientificName.split(' ')[0] === 'Citrus' ? <CustomSVG   size={18} name='fruit'/> : <View />}
                        {props.item.item.tags.includes('Cactus') || props.item.item.tags.includes('Succulent')? <CustomSVG   size={20} name='succulent'/> : <View />}
                        {props.item.item.tags.includes('Walnut') || props.item.item.tags.includes('Chestnut') || props.item.item.tags.includes('Hazelnut') || props.item.item.tags.includes('Pecan') ? <CustomSVG   size={20} name='nut'/> : <View />} */}

                        </View>
                      </View>
                    </TouchableOpacity>
                </View>
    </Animated.View>
  )
}

export default SearchListItem

const styles = StyleSheet.create({
  textView: {
    // height: 40,
    flexDirection: 'row',
    width: '100%',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
})
