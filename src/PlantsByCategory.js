import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { firebase } from '../config'

import SearchListItem from './SearchListItem'
import SearchListItem2 from './SearchListItem2'
import CategoryDescription from './CategoryDescription'
import { useNavigation } from '@react-navigation/native'

// import { BookOpenIcon, ArrowDownLeftIcon } from 'react-native-heroicons/solid'
// import Animated, { withSpring, useSharedValue, useAnimatedGestureHandler, useAnimatedStyle } from 'react-native-reanimated';
// import { TapGestureHandler } from 'react-native-gesture-handler'


const Reminders = ({route}) => {
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState(true);
  const [plants, setPlants] = useState([])
  const [endCursor, setEndCursor] = useState({})

  const fbRoute = () => {
    if(route.params.name === 'culinary'){
      return 'culinary herb'
    } else {
      return route.params.name
    }
  }
  const snapshot = firebase.firestore().collection('plant').where('tags','array-contains', fbRoute()).orderBy('commonName')

  const getNextPlants = () => {
    snapshot
    .startAfter(endCursor)
    .limit(26)
    .onSnapshot(
      querySnapshot => {
        const plantsArr = []
        querySnapshot.forEach((plant) => {
          plantsArr.push({...plant.data(), id: plant.id})
        })
        setEndCursor(querySnapshot.docs[querySnapshot.docs.length-1])
        let newdata = plants.concat(plantsArr)
        setPlants(newdata)
      }
    )
  }

  useEffect(() => {
    //we will need to process route params for 'fruit', 'hydroponic', 'medicinal'
    snapshot
    .limit(26)
    .onSnapshot(
      querySnapshot => {
        const plantsArr = []
        querySnapshot.forEach((plant) => {
          plantsArr.push({...plant.data(), id: plant.id})
        })
        setRefreshing(false);
        setEndCursor(querySnapshot.docs[querySnapshot.docs.length-1])
        setPlants(plantsArr)
      }
    )

  }, [])
  return (
    <View>
      <View style={[{height:'11%', marginBottom: '2.5%'}, styles.shadow]}>
              <View style={[{backgroundColor: "rgba(0, 0, 0, 0.35)", justifyContent:'flex-end', height:'100%'}, styles.shadow]}>
                <Text style={[{fontSize: 25, marginLeft: 125, fontWeight: '900', color: 'white', marginVertical: 10, }]}>{route.params.name === 'culinary' ? 'Culinary Herbs' : `${route.params.name[0].toUpperCase()+route.params.name.slice(1)}${route.params.name[route.params.name.length-1] === 's' ? '' : 's'}`}</Text>
              </View>

      </View>

      {!plants
           ? <View></View>
           :<FlatList style={{flexDirection:'column', height:'89%', width:'100%', overflow:'hidden'}}
          data={plants}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.01}
          scrollEventThrottle={100}
          numColumns={2}
          onEndReached={getNextPlants}
          renderItem={(item) => {
            // console.log(item.index)
             return (
              <SearchListItem2 key={item.item.id} navigation={navigation} item={item}/>
            )
          }} />}

          {refreshing ? <ActivityIndicator key={'asdasdasdas'} style={{justifyContent:'center', alignItems:'center'}} size={'large'}/> : null}

          <CategoryDescription name={route.params.name}/>
    </View>
  )
}

export default Reminders

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C9E4CA',
    height: '100%'
  },
  input: {
    height: 40,
    marginLeft: '2.5%',
    borderTopLeftRadius:5,
    borderBottomLeftRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    width: '60%',
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
    borderRadius: 5,
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
    borderRadius: 5,
    backgroundColor: '#E4F1E4',
    marginTop: '1%',
    alignItems: 'center',
    width: '49%',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    color: 'white'
  },
  textView: {
    height: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
})

