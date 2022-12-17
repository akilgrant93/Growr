import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Keyboard, FlatList } from 'react-native'
import React, {useState} from 'react'
import { firebase } from '../config'
import Svg, { Path } from 'react-native-svg'
import CustomSVG from './CustomSVG'
import { FontAwesome } from '@expo/vector-icons'

const SearchPlant = ({route, navigation}) => {
  const [endCursor, setEndCursor]= useState({})
  const [startCursor, setStartCursor]= useState({})
  const [count, setCount]= useState(0)
  const [value, setValue]= useState('')
  const [tableData, setTableData]= useState([])

  const plantsRef= firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')

    //add a plant from users list of plant entries
    //need to setup next and previous buttons
    const searchByName =  async ({search = ''}) => {
      if(search[search.length-1] === ' '){
        search = search.slice(0,search.length-1)
      }

      const exactNameSnapshot = await firebase.firestore().collection('plants').where('commonName', '==', `${search}`).get();

      const snapshot = await firebase.firestore()
      .collection('plants')
      .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('scientificName')
      .limit(13)
      .get();

      exactNameSnapshot.forEach(doc =>{
        const name = doc.data();
            setTableData([{
            commonName: name.commonName,
            scientificName: name.scientificName,
            carnivorous: name.carnivorous,
            diseases:
            name.diseases,
            edible: name.edible,
            familyName: name.familyName,
            freshWaterAquatic: name.freshWaterAquatic,
            herb: name.herb,
            medicinalUse: name.medicinalUse,
            poisonous: name.poisonous,
            succulent: name.succulent,
            tags: name.tags,
            key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}])

      })

      return snapshot.docs.reduce((acc, doc) => {
        const name = doc.data();
        // console.log(tableData)
        setCount(count+1)
        // common plant item object structure found here
        setTableData(tableData => [...tableData, {
          commonName: name.commonName,
          scientificName: name.scientificName,
          carnivorous: name.carnivorous,
          diseases:
          name.diseases,
          edible: name.edible,
          familyName: name.familyName,
          freshWaterAquatic: name.freshWaterAquatic,
          herb: name.herb,
          medicinalUse: name.medicinalUse,
          poisonous: name.poisonous,
          succulent: name.succulent,
          tags: name.tags,
          firestoreID: doc.id,
          key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}])
      }, '');
    }

    const submitSearch = async () => {
      if(value===''){
        return
      }
      setTableData([])
      await searchByName({search:value})
      Keyboard.dismiss()
    }

    const cancelSearch = () => {
      setValue('')
      // setTableHead(['Name'])
      setTableData([])
    }

  return (
    <SafeAreaView style={styles.container}>
      <View>
      {!tableData
           ? <View></View>
           :
       <FlatList style={{flexDirection:'column', width:'100%',marginTop: '1%'}}
          data={tableData}
          keyExtractor={(item) => item.key}
          scrollEnabled={false}
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
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                      shadowOpacity: .25,shadowOffset: {width:1,height:1}, shadowRadius: 2, borderRadius: 5, backgroundColor: '#fff' }}>
                        <View style={styles.textView}>

                        <View style={{marginLeft: 35}}>
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

                        <View style={{ flexDirection: 'row-reverse', marginLeft: 35, alignItems:'center'}}>

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

      {/* pagination here, reduce count on limit to compensate */}

      <View style={{flexDirection:'row', marginTop: 5}}>
      <TextInput
        style={styles.input}
        placeholder="Add A New Plant"
        placeholderTextColor='#aaaaaa'
        onChangeText={(heading) => setValue(heading)}
        value={value}
        underlineColorAndroid='transparent'
        autoCapitalize='none'
      />
      {/* make cancel color style responsive to whether or not base text has been changed*/}
      <TouchableOpacity style={styles.button}onPress={cancelSearch}>
         <Text style={{color:'white', fontWeight:'bold'}}>X</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2}onPress={submitSearch}>
         <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      </View>
      </View>

      {/* <TouchableOpacity style={styles.button2}onPress={addPlant}>
         <Text style={styles.buttonText}>Add Plant</Text>
      </TouchableOpacity> */}

    </SafeAreaView>
  )
}

export default SearchPlant

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
  buttonText: {
    color: 'white'
  },
  textView: {
    paddingVertical: 6,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    // marginBottom: 5,
  }
})
