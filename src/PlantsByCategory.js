import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground, ActivityIndicator, RefreshControl } from 'react-native'
import React, {useState, useEffect} from 'react'
import CustomSVG from './CustomSVG'
import { firebase } from '../config'

const Reminders = ({route, navigation}) => {
  const [refreshing, setRefreshing] = useState(true);
  const [plants, setPlants] = useState([])
  const [endCursor, setEndCursor] = useState({})
  const snapshot = firebase.firestore().collection('plants').where('tags','array-contains', `${route.params[0].toUpperCase()+route.params.slice(1)}`).orderBy('scientificName')

  const getNextPlants = () => {
    snapshot
    .startAfter(endCursor)
    .limit(25)
    .onSnapshot(
      querySnapshot => {
        const plantsArr = []
        querySnapshot.forEach((plant) => {
          plantsArr.push(plant.data())
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
    .limit(25)
    .onSnapshot(
      querySnapshot => {
        const plantsArr = []
        querySnapshot.forEach((plant) => {
          plantsArr.push(plant.data())
        })
        setRefreshing(false);
        setEndCursor(querySnapshot.docs[querySnapshot.docs.length-1])
        setPlants(plantsArr)
      }
    )

  }, [])
  return (
    <View>
      <ImageBackground
          source={
            route.params === 'edible'
            ? require(`../assets/edible.jpg`)
            : route.params === 'medicinal'
            ? require(`../assets/medicinal.jpg`)
            : route.params === 'fruit'
            ? require(`../assets/fruit.jpg`)
            : route.params === 'tropical'
            ? require(`../assets/tropical.jpg`)
            : route.params === 'succulent'
            ? require(`../assets/succulent.jpg`)
            : require(`../assets/hydroponic.jpg`)} resizeMode="cover">
              <View style={{backgroundColor: "rgba(0, 0, 0, 0.25)"}}>
                <Text style={{fontSize: 40, marginLeft: 45, fontWeight: 'bold', color: 'white', marginVertical: 10, }}>{`${route.params[0].toUpperCase()+route.params.slice(1)}s`}</Text>
              </View>
            </ImageBackground>
      {!plants
           ? <View></View>
           :<FlatList style={{flexDirection:'column', width:'100%'}}
          data={plants}
          onEndReached={getNextPlants}
          onEndReachedThreshold={0.01}
          scrollEventThrottle={150}
          keyExtractor={(item) => item.key}
          renderItem={(item) => {
             return (
              <View key={item.index || item.index}>
                <View style={{
                flexDirection: 'column',
                width: '95%',
                marginLeft: '2.5%',
                marginBottom: 1,
                }}>
                    <TouchableOpacity
                    onPress={() => navigation.navigate('PostModal',item)}>
                      <View style={{ flexDirection: 'row',
                       overflow:'hidden',justifyContent: 'space-between',
                      shadowOpacity: .25,shadowOffset: {width:1,height:1}, shadowRadius: 2, borderRadius: 5, backgroundColor: '#fff' }}>
                        <View style={styles.textView}>

                        <View style={{marginLeft: 35, alignSelf:'center'}}>
                        <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                          {!item.item.commonName
                            ?
                            item.item.scientificName.split(' ').map((word) => {
                              return word
                            }).join(' ')
                            : item.item.commonName.split(' ').map((word) => {
                              return word
                            }).join(' ')}
                        </Text>

                        <Text style={{fontSize: 10}}>{item.item.familyName}</Text>
                        </View>

                        <View style={{ flexDirection: 'row-reverse', width: '25%',
                        paddingLeft: '5%',alignItems:'center', backgroundColor: '#E4F1E4', height: '100%', paddingVertical: 10}}>

                        {item.item.tags.includes('Edible') ? <CustomSVG size={20} name='edible'/> : <View />}
                        {item.item.tags.includes('Herbal') ? <CustomSVG   size={20} name='pagelines'/> : <View />}
                        {item.item.tags.includes('Pine') ? <CustomSVG   size={20} name='tree'/> : <View />}
                        {item.item.tags.includes('Carnivorous') ? <CustomSVG   size={20} name='bug'/> : <View />}
                        {item.item.tags.includes('Rose') || item.item.tags.includes('Cannabaceae') || item.item.tags.includes('Cane Fruit') || item.item.tags.includes('Stone Fruit') || item.item.tags.includes('Buckthorn') ? <CustomSVG   size={20} name='rose'/> : <View />}
                        {item.item.tags.includes('Tropical') ? <CustomSVG   size={22} name='palm'/> : <View />}
                        {item.item.tags.includes('Cannabaceae') ? <CustomSVG   size={18} name='cannabis'/> : <View />}
                        {item.item.tags.includes('Poisonous') ? <CustomSVG   size={18} name='poison'/> : <View />}
                        {item.item.tags.includes('Aquatic - Freshwater') ? <CustomSVG   size={18} name='aquatic'/> : <View />}
                        {item.item.tags.includes('Passion Fruit') || item.item.tags.includes('Gooseberry/Currant') || item.item.tags.includes('Cane Fruit') || item.item.tags.includes('Stone Fruit')  || item.item.tags.includes('Mulberry/Fig') || item.item.scientificName.split(' ')[0] === 'Citrus' ? <CustomSVG   size={18} name='fruit'/> : <View />}
                        {item.item.tags.includes('Cactus') || item.item.tags.includes('Succulent')? <CustomSVG   size={20} name='succulent'/> : <View />}
                        {item.item.tags.includes('Walnut') || item.item.tags.includes('Chestnut') || item.item.tags.includes('Hazelnut') || item.item.tags.includes('Pecan') ? <CustomSVG   size={20} name='nut'/> : <View />}
                        </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                </View>
              </View>
            )
          }} />}
          {refreshing ? <ActivityIndicator style={{justifyContent:'center', alignItems:'center'}} size={'large'}/> : null}
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
  }
})

