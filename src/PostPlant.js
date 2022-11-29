import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Keyboard, FlatList } from 'react-native'
import React, {useState} from 'react'
import { firebase } from '../config'

const PostPlant = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isPotted, setIsPotted]= useState(false)
  const [isIndoors, setIsIndoors]= useState(false)
  const [isHydroponic, setIsHydroponic]= useState(false)
  const [isSucculent, setIsSucculent]= useState(false)
  const [selectedPlant, setSelectedPlant]= useState('')
  const [endCursor, setEndCursor]= useState({})
  const [startCursor, setStartCursor]= useState({})
  const [count, setCount]= useState(0)
  const [active, setActive]= useState(false)
  const [sliderValue, setSliderValue]= useState(0)
  const [slidingState, setSlidingState]=useState('inactive')
  const [hoverValue, setHoverValue]= useState(0)
  const [value, setValue]=useState('Search')
  const [tableHead, setTableHead]= (['Name'])
  const [tableData, setTableData]= useState([])
  const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')

    //add a plant from users list of plant entries
    const searchByName =  async ({search = ''}) => {
      if(search[search.length-1] === ' '){
        search = search.slice(0,search.length-1)
      }

      const exactNameSnapshot = await firebase.firestore().collection('plants').where('commonName', '==', `${search}`).get();

      const snapshot = await firebase.firestore()
      .collection('plants')
      .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('scientificName')
      .limit(7)
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
        setCount(count+1)
        setTableData([...tableData, {
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

    const cancelSearch = () => {
      setValue('Search')
      setTableHead(['Name'])
      setTableData([])
    }

    const submitSearch = async () => {
      setTableData([])
      console.log(value)
      await searchByName({search:value})
    }

    const addPlant = () => {
      if(addData && addData.length > 0){
       //timestamp
       const timestamp = firebase.firestore.FieldValue.serverTimestamp()
       const data = {
         heading: addData,
         createdAt: timestamp,
       }
       plantsRef
         .add(data)
         .then(() => {
           setValue('')
           //release keyboard
           Keyboard.dismiss()
         })
         .catch((error) => {
           alert(error)
         })
      }
   }

  return (
    <SafeAreaView>
      <View>
      {!tableData
           ? <View></View>
           :
       <FlatList style={{flexDirection:'column', width:'100%',marginTop: '5%'}}
          data={tableData}
          keyExtractor={(item) => item.key}
          scrollEnabled={false}
          renderItem={(item) => {
            // console.log('ITEM ITEM ITEM ITEM ITEM',item)
            //convert these to card components for visual effect
             return (
              <View>
                <View style={{paddingBottom: '1%',
                paddingTop: '1%',
                flexDirection: 'column',
                justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => {
                    displayModal(true, item.item.key)}}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                      shadowOpacity: .25,
                      width: '99%',shadowOffset: {width:1,height:1}, shadowRadius: 2, borderRadius: 5, backgroundColor: '#fff' }}>
                        <View style={styles.textView}>
                        <Text style={{fontSize: 18}}>
                          {!item.item.commonName
                            ? item.item.scientificName
                            : item.item.commonName}
                        </Text>
                          <Text style={{fontSize: 10}}>{item.item.familyName}</Text>
                        </View>

                        <View style={{ flexDirection: 'column', justifyContent: 'center'}}>
                        {/* <View style={{ flexDirection: 'row', marginRight: '2%'}}>
                          {item.item.poisonous ? <FontAwesome5  name="skull-crossbones" size={25} color="black"/> : <View></View>}
                          {item.item.edible || item.item.tags.includes('Edible')  ? <MaterialCommunityIcons  name="silverware-fork-knife" size={25} color="black"/> : <View></View>}
                          {item.item.tags.includes('Herbal') || item.item.herbal ? <MaterialCommunityIcons  name="medical-bag" size={25} color="black"/> : <View></View>}
                          {item.item.tags.includes('Cactus') || item.item.tags.includes('Succulent') || item.item.familyName === 'Cactaceae'  || item.item.succulent ? <MaterialCommunityIcons  name="cactus" size={25} color="black"/> : <View></View>}
                          {item.item.tags.includes('Aquatic - Freshwater') || item.item.freshWaterAquatic ? <Entypo  name="drop" size={25} color="black"/> : <View></View>}
                        </View> */}
                        </View>
                      </View>
                    </TouchableOpacity>
                </View>

              </View>
            )
          }} />}
      <View style={{flexDirection:'row',}}>
      <TextInput
        style={styles.input}
        placeholder="Add A New Plant"
        placeholderTextColor='#aaaaaa'
        onChangeText={(heading) => setValue(heading)}
        value={value}
        underlineColorAndroid='transparent'
        autoCapitalize='none'
      />
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

export default PostPlant

const styles = StyleSheet.create({
  input: {
    height: 28,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    marginRight: 5,
    marginTop: 50,
    width: '70%',
  },
  button2: {
    height: 28,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 100,
    marginTop: 50,
    alignItems: 'center',
    width: '25%',
    justifyContent: 'center',
  },

})
