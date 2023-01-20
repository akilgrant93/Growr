import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Keyboard, FlatList, ActivityIndicator } from 'react-native'
import React, {useState} from 'react'
import { firebase } from '../config'

import { FontAwesome } from '@expo/vector-icons'
import CategoryLink from './CategoryLink'
import SearchListItem from './SearchListItem'
import SearchListItem2 from './SearchListItem2'

const SearchPlant = ({route, navigation}) => {
  const [endCursor, setEndCursor] = useState({})
  const [refreshing, setRefreshing] = useState(true);
  const [value, setValue]= useState('')
  const [plants, setPlants] = useState([])
  const [lastPlant, setLastPlant] = useState(false)
  const limit = 12

    const searchByName = (value) => {
      if(value[value.length-1] === ' '){
        value = value.slice(0,search.value-1)
      }
      const snapshot = firebase.firestore().collection('plant').where('keywords', 'array-contains', value.toLowerCase())
      .orderBy('commonName')

      snapshot
      .limit(limit)
      .onSnapshot(
        querySnapshot => {
          const plantsArr = []
          querySnapshot.forEach((plant) => {
            const plantData = plant.data()
            plantData.id = plant.id
            plantData.tags = [...new Set(plantData.tags)]
            plantsArr.push(plantData)
          })
          setRefreshing(false);
          setEndCursor(querySnapshot.docs[querySnapshot.docs.length-1])
          setPlants(plantsArr)
        }
      );
    }

    const searchMoreByName = (value) => {
      if(value[value.length-1] === ' '){
        value = value.slice(0,search.value-1)
      }
      const snapshot = firebase.firestore().collection('plant').where('keywords', 'array-contains', value.toLowerCase())
      .orderBy('commonName')

      snapshot
      .startAfter(endCursor)
      .limit(limit)
      .onSnapshot(
        querySnapshot => {
          const plantsArr = []
          querySnapshot.forEach((plant) => {
            plantsArr.push(plant.data())
          })
          setRefreshing(false);
          setEndCursor(querySnapshot.docs[querySnapshot.docs.length-1])
          setPlants([...plants, ...plantsArr])
        }
      );
    }

    const submitSearch = async () => {
      if(value===''){
        return
      }
      setPlants([])
      await searchByName(value)
      Keyboard.dismiss()
    }

    const submitMoreSearches = async () => {
      if(!lastPlant && plants.length >= limit){
        await searchMoreByName(value)
        plants.length==0?setLastPlant(true):setLastPlant(false)
      }
    }

    const cancelSearch = () => {
      setValue('')
      setPlants([])
    }

  return (
    <View style={{width: '100%', height: '100%', backgroundColor:'#034732'}}>
    <SafeAreaView style={[styles.container, styles.shadow]}>
      <View style={[{backgroundColor: '#82A398', width:'90%', marginLeft: '5%', borderRadius: 25,overflow:'hidden'}, plants.length > 0 ? {marginBottom:5, paddingBottom:10} : { height:'20%'}]}>
      <View style={{flexDirection:'row', alignItems:'center', paddingVertical:10, paddingTop:30, width: '90%',borderRadius: 25}}>
                <Text style={{paddingLeft: 20, fontSize: 25, fontWeight: '900', color: '#fff'}}>Discover</Text>
                <FontAwesome
                style={{paddingLeft: 5}}
                name='search'
                 color='#034732'
                 size={22}
              />
      </View>

      <View style={{width: '90%', marginLeft: '5%'}}>
      <View style={[{flexDirection:'row', marginTop: 5}, styles.shadow]}>
      <TextInput
        style={styles.input}
        placeholder="Add A New Plant"
        placeholderTextColor='#aaaaaa'
        onChangeText={(heading) => setValue(heading ? heading[0].toUpperCase()+heading.slice(1): '')}
        value={value}
        underlineColorAndroid='transparent'
        autoCapitalize='none'
      />
      <TouchableOpacity style={[styles.button, styles.shadow]}onPress={cancelSearch}>
         <Text style={{color:'white', fontWeight:'bold'}}>X</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button2, styles.shadow]}onPress={submitSearch}>
         <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      </View>
      </View>

      </View>

      {plants.length < 1 ?
      <View style={{marginTop: '3%',marginLeft: '2.5%', width: '92.5%'}}>
        <View style={{flexDirection:'row'}}>
        <CategoryLink timescale={1} navigation={navigation} type='fruit'/>
        <CategoryLink timescale={2}  navigation={navigation} type='vegetable'/>
        </View>
        <View style={{flexDirection:'row', paddingTop: '2.5%'}}>
        <CategoryLink timescale={3}  navigation={navigation} type='culinary'/>
        <CategoryLink timescale={4}  navigation={navigation} type='hydroponic'/>
        </View>
        <View style={{flexDirection:'row', paddingTop: '2.5%'}}>
        <CategoryLink timescale={5}  navigation={navigation} type='carnivorous'/>
        <CategoryLink timescale={6}  navigation={navigation} type='houseplant'/>
        </View>
      </View>
      : <View/>}

      {!plants
           ? <View></View>
           :
       <FlatList style={{marginTop: '1%', borderRadius: 5, overflow:'hidden'}}
          data={plants}
          onEndReached={submitMoreSearches}
          onEndReachedThreshold={0.01}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={150}
          numColumns={2}
          ListFooterComponent={() =>
            plants[plants.length] !== undefined && plants.length == true &&
          <ActivityIndicator key={'asd'} color={'#F97068'}/>}
          renderItem={(item) => {
             return (
              <SearchListItem2 key={item.item.id} navigation={navigation} item={item}/>
            )
          }} />}

    </SafeAreaView>
    </View>
  )
}

export default SearchPlant

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: "rgba(240,240,240,.25)"
  },
  input: {
    height: 40,
    fontWeight:'bold',
    borderTopLeftRadius:5,
    borderBottomLeftRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 35,
    width: '65%',
    marginTop: '1%',
  },
  button: {
    height: 40,
    borderTopRightRadius:5,
    borderBottomRightRadius: 5,
    backgroundColor: '#F97068',
    width: '8.5%',
    marginTop: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  button2: {
    height: 40,
    borderRadius: 5,
    backgroundColor: '#034732',
    marginTop: '1%',
    alignItems: 'center',
    width: '25%',
    justifyContent: 'center',
  },
  button3: {
    height: 28,
    borderRadius: 25,
    backgroundColor: '#E4F1E4',
    marginTop: '1%',
    alignItems: 'center',
    width: '49%',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  button4: {
    height: 28,
    marginLeft: '1.5%',
    borderRadius: 25,
    backgroundColor: '#E4F1E4',
    marginTop: '1%',
    alignItems: 'center',
    width: '49%',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    color: 'white',
    fontWeight:'bold'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
})
