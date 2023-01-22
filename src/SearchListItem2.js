import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native'
import React from 'react'
import CustomSVG from './CustomSVG'
import { ScrollView } from 'react-native-gesture-handler'
import Animated, { FadeInLeft } from 'react-native-reanimated';

const SearchListItem2 = (props) => {
  // console.log(props.item.item.tags)
  const tagsArr = [...new Set(props.item.item.tags)]
  //might need to refactor the animation delay w/ regard to the lazy loading
  return (
    <Animated.View entering={FadeInLeft.delay(200*props.item.index)} style={[props.item.index % 2 ? {} : {marginLeft: '4.25%'},styles.shadow]}>
                <View style={props.item.index > 1 ?{
                  marginTop: '4%'
                } : null}>
                    <TouchableOpacity
                    onPress={() => props.navigation.navigate('PostModal',{item:props.item.item})}>
                      <View style={{flexDirection: 'row',
                       overflow:'hidden', shadowOpacity: .25,shadowOffset: {width:1,height:1}, shadowRadius: 2}}>
                        <View style={styles.textView}>

                          <ImageBackground source={{uri: props.item.item.imgSrc}} style={{height: Dimensions.get('window').width*.44, width: Dimensions.get('window').width*.44, resizeMode: 'cover', marginLeft:'2%', borderRadius: 15, overflow:'hidden'}}>
                          <View style={{height:'100%', width:'100%', backgroundColor:'rgba(0,0,0,.45)', justifyContent:'center', alignItems:'center'}}>
                          <Text style={{fontSize: 18, fontWeight: '800', color:'#fff', width: '90%', textAlign:'center'}}>
                          {!props.item.item.commonName
                            ? props.item.item.scientificName.split(' ').map((word) => {
                              return word[0].toUpperCase() + word.substr(1);
                            }).join(' ')
                            : props.item.item.commonName.split(' ').map((word) => {
                              return word[0].toUpperCase() + word.substr(1);
                            }).join(' ')}
                          </Text>

                          {/* <View style={{alignItems:'center', marginTop: 20}}>
                          {tagsArr.map((tag, idx) => {
                            return (
                            <View style={[{flexDirection:'row', padding: .5}, idx > 0 ? {marginTop: '2.5%'} : {}]}>
                              <Text style={{color:'white', fontWeight:'900', fontSize: 12}}>{tag[0].toUpperCase()+tag.slice(1)}</Text>
                              <CustomSVG name={tag} size={14} color={'#fff'}/>
                            </View>)
                          })}
                          </View> */}

                          </View>
                          </ImageBackground>

                        {/* <View style={{height: Dimensions.get('window').width*.475, width: Dimensions.get('window').width*.475,alignSelf:'center', backgroundColor:'#fff', marginLeft: '2.5%', borderRadius:15, overflow:'hidden'}}>
                          <View style={[{padding: 7}, styles.shadow, props.item.index % 2 ? {backgroundColor:'#F97068'} : {backgroundColor:'#F5928D'}]}>
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
                        </View> */}

                        </View>
                      </View>
                    </TouchableOpacity>
                </View>
    </Animated.View>
  )
}

export default SearchListItem2

const styles = StyleSheet.create({
  textView: {
    // height: 40,
    flexDirection: 'row',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
})
