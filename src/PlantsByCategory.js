import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import CustomSVG from './CustomSVG'
import { firebase } from '../config'

const PlantsByCategory = ({route, navigation}) => {
  const [plants, setPlants] = useState([])

  const getNextPlants = () => {

  }

  useEffect(() => {
    console.log('params in plantsbyCategory',route.params)
    //we will need to process route params for 'fruit', 'hydroponic', 'medicinal'

    const snapshot = firebase.firestore().collection('plants').where('tags','array-contains', `${route.params[0].toUpperCase()+route.params.slice(1)}`).orderBy('scientificName').limit(25)
    .onSnapshot(
      querySnapshot => {
        const plantsArr = []
        querySnapshot.forEach((plant) => {
          plantsArr.push(plant.data())
        })
        setPlants(plantsArr)
      }
    )



    // console.log(snapshot.map((snapshot) => {
    //   return snapshot.doc.data()
    // }))

    // console.log(snapshot)


  }, [])
  return (
    <View>
      {!plants
           ? <View></View>
           :<FlatList style={{flexDirection:'column', width:'100%',marginTop: '5%'}}
          data={plants}
          keyExtractor={(item) => item.key}
          renderItem={(item) => {
             return (
              <View>
                <View style={{
                flexDirection: 'column',
                width: '95%',
                marginLeft: '2.5%',
                marginBottom: 1,
                }}>
                    <TouchableOpacity
                    onPress={() => navigation.navigate('SearchPlant',item)}>
                      <View style={{ flexDirection: 'row',
                       overflow:'hidden',justifyContent: 'space-between',
                      shadowOpacity: .25,shadowOffset: {width:1,height:1}, shadowRadius: 2, borderRadius: 5, backgroundColor: '#fff' }}>
                        <View style={styles.textView}>

                        <View style={{marginLeft: 35, alignSelf:'center'}}>
                        <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                          {!item.item.commonName
                            ? item.item.scientificName.split(' ').map((word) => {
                              return word[0].toUpperCase() + word.substr(1);
                            }).join(' ')
                            : item.item.commonName.split(' ').map((word) => {
                              return word[0].toUpperCase() + word.substr(1);
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
    </View>
  )
}

export default PlantsByCategory

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

