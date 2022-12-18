import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Keyboard, FlatList, ImageBackground } from 'react-native'
import React, {useState, useEffect} from 'react'
import { firebase } from '../config'
import CustomSVG from './CustomSVG'
import { FontAwesome } from '@expo/vector-icons'

const SearchPlant = ({route, navigation}) => {
  const [startCursor, setStartCursor] = useState({})
  const [endCursor, setEndCursor] = useState({})
  const [initialValue, setInitialValue] = useState({})
  const [previousStart, setPreviousStart] = useState({})
  const [value, setValue]= useState('')
  const [tableData, setTableData] = useState([])
  const [edible, setEdible] = useState([])
  const [herbal, setHerbal] = useState([])
  const [tropical, setTropical] = useState([])
  const [aquatic, setAquatic] = useState([])
  const [succulent, setSucculent] = useState([])
  const [fruit, setFruit] = useState([])
  const limit = 12

    const searchByName =  async ({search = ''}) => {
      if(search[search.length-1] === ' '){
        search = search.slice(0,search.length-1)
      }

      const snapshot = await firebase.firestore()
      .collection('plants')
      .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('scientificName')
      .limit(limit)
      .get();

      const firstValue = snapshot.docs[0]
      setInitialValue(firstValue)
      setStartCursor(firstValue)
      setStartCursor(firstValue)
      setPreviousStart()
      setEndCursor(snapshot.docs[snapshot.docs.length-1])

      return snapshot.docs.reduce((acc, doc) => {
        const name = doc.data();
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

    const prev = async({search = value }) => {
      if(search[search.length-1] === ' '){
        search = search.slice(0,search.length-1)
      }
      const snapshot = await firebase.firestore().collection('plants')
      .where('keywords', 'array-contains', search.toLowerCase())
        .orderBy('scientificName','desc')
        .limit(limit)
        .startAfter(endCursor)
        .get();

        let arr = []
        for (let i = 0; i < snapshot.docs.length; i++){
          const name = snapshot.docs[i].data()
          arr.push({
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
            key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`})
        }
        setTableData(arr)
        setStartCursor(snapshot.docs[0])
        setEndCursor(snapshot.docs[snapshot.docs.length-1])
    }

    const next = async({search = value }) => {
      if(search[search.length-1] === ' '){
        search = search.slice(0,search.length-1)
      }
      const snapshot = await firebase.firestore().collection('plants')
      .where('keywords', 'array-contains', search.toLowerCase())
        .orderBy('scientificName')
        .limit(limit)
        .startAfter(endCursor)
        .get();

        let arr = []
        for (let i = 0; i < snapshot.docs.length; i++){
          const name = snapshot.docs[i].data()
          arr.push({
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
            key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`})
        }
        setTableData(arr)
        setPreviousStart(startCursor)
        setStartCursor(snapshot.docs[0])
        setEndCursor(snapshot.docs[snapshot.docs.length-1])
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
      <TouchableOpacity style={styles.button}onPress={cancelSearch}>
         <Text style={{color:'white', fontWeight:'bold'}}>X</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2}onPress={submitSearch}>
         <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      </View>
      </View>

      <View style={{width:'95%', marginLeft: '2.5%', flexDirection: 'row'}}>

     {!tableData.length
     ?
      <TouchableOpacity style={styles.button3} disabled={true}>
          <FontAwesome
                size={25}
                name='caret-left'
                color='#C9E4CA'
              />
              <Text style={{marginLeft: 10, fontWeight:'bold', color:'#C9E4CA'}}>Prev</Text>
      </TouchableOpacity>
      : initialValue.data().scientificName === tableData[0].scientificName
     ? <TouchableOpacity style={styles.button3} disabled={true}>
     <FontAwesome
           size={25}
           name='caret-left'
           color='#C9E4CA'
         />
         <Text style={{marginLeft: 10, fontWeight:'bold', color:'#C9E4CA'}}>Prev</Text>
 </TouchableOpacity>
     :
     <TouchableOpacity style={styles.button3} onPress={prev}>
          <FontAwesome
                size={25}
                name='caret-left'
                color='#034732'
              />
              <Text style={{marginLeft: 10, fontWeight:'bold', color:'#034732'}}>Prev</Text>
      </TouchableOpacity>
      }

      {!tableData.length ?
      <TouchableOpacity style={styles.button4} onPress={next} disabled={true}>
      <Text style={{marginRight: 10, fontWeight:'bold',color:'#C9E4CA'}}>Next</Text>
      <FontAwesome
                size={25}
                name='caret-right'
                color='#C9E4CA'
              />
      </TouchableOpacity>
      : limit > tableData.length
      ? <TouchableOpacity style={styles.button4} onPress={next} disabled={true}>
      <Text style={{marginRight: 10, fontWeight:'bold',color:'#C9E4CA'}}>Next</Text>
      <FontAwesome
                size={25}
                name='caret-right'
                color='#C9E4CA'
              />
      </TouchableOpacity>
      : <TouchableOpacity style={styles.button4} onPress={next}>
      <Text style={{marginRight: 10, fontWeight:'bold',color:'#034732'}}>Next</Text>
      <FontAwesome
                size={25}
                name='caret-right'
                color='#034732'
              />
      </TouchableOpacity>}
      </View>

{/* resize these images */}
      {tableData.length < 1 ?
      <View style={{flexDirection:'row', flex:1, alignItems:'center', justifyContent: 'center', marginTop: 10}}>
        <ImageBackground source={require('../assets/edible.jpg')} resizeMode="cover" style={{flex: .9}}>
            <Text style={{color: "white",
    fontSize: 30,
    lineHeight: 184,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)"}}>Edible</Text>
        </ImageBackground>

        <ImageBackground source={require('../assets/medicinal.jpg')} resizeMode="cover" style={{flex: .9}}>
            <Text style={{color: "white",
    fontSize: 30,
    lineHeight: 184,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)"}}>Medicinal</Text>
        </ImageBackground>
      </View>
      : <View/>}

      {tableData.length < 1 ?
      <View style={{flexDirection:'row', flex:1, alignItems:'center', justifyContent: 'center'}}>
        <ImageBackground source={require('../assets/fruit.jpg')} resizeMode="cover" style={{flex: .9}}>
            <Text style={{color: "white",
    fontSize: 30,
    lineHeight: 184,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)"}}>Fruit</Text>
        </ImageBackground>

        <ImageBackground source={require('../assets/tropical.jpg')} resizeMode="cover" style={{flex: .9}}>
            <Text style={{color: "white",
    fontSize: 30,
    lineHeight: 184,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)"}}>Tropical</Text>
        </ImageBackground>
      </View>
      : <View/>}

      {tableData.length < 1 ?
      <View style={{flexDirection:'row', flex:1, alignItems:'center', justifyContent: 'center'}}>
        <ImageBackground source={require('../assets/succulent.jpg')} resizeMode="cover" style={{flex: .9}}>
            <Text style={{color: "white",
    fontSize: 30,
    lineHeight: 184,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)"}}>Succulent</Text>
        </ImageBackground>

        <ImageBackground source={require('../assets/hydroponic.jpg')} resizeMode="cover" style={{flex: .9}}>
            <Text style={{color: "white",
    fontSize: 30,
    lineHeight: 184,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)"}}>Hydroponic</Text>
        </ImageBackground>
      </View>
      : <View/>}
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
