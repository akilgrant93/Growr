import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Keyboard, FlatList } from 'react-native'
import React, {useState} from 'react'
import { firebase } from '../config'

const PostPlant = ({route, navigation}) => {
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
      setTableData([])
      await searchByName({search:value})
    }

    const cancelSearch = () => {
      setValue('')
      // setTableHead(['Name'])
      setTableData([])
    }

  return (
    <SafeAreaView>
      <View>
      {!tableData
           ? <View></View>
           :
       <FlatList style={{flexDirection:'column', width:'100%',marginTop: '1%'}}
          data={tableData}
          keyExtractor={(item) => item.key}
          scrollEnabled={false}
          renderItem={(item) => {
            // console.log('ITEM ITEM ITEM ITEM ITEM',tableData.length)
            //convert these to card components for visual effect
             return (
              <View>
                <View style={{paddingBottom: '1%',
                paddingTop: '1%',
                flexDirection: 'column',
                justifyContent: 'space-between'}}>
                    <TouchableOpacity
                    onPress={() => navigation.navigate('PostPlant',item)}>
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
                        </View>
                      </View>
                    </TouchableOpacity>
                </View>

              </View>
            )
          }} />}

      {/* pagination here, reduce count on limit to compensate */}

      <View style={{flexDirection:'row'}}>
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

export default PostPlant

const styles = StyleSheet.create({
  input: {
    height: 28,
    marginLeft: 5,
    borderTopLeftRadius:5,
    borderBottomLeftRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    width: '60%',
    marginTop: '1%',
  },
  button: {
    height: 28,
    borderTopRightRadius:5,
    borderBottomRightRadius: 5,
    backgroundColor: 'red',
    width: '10%',
    marginTop: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  button2: {
    height: 28,
    borderRadius: 5,
    backgroundColor: '#788eec',
    marginTop: '1%',
    alignItems: 'center',
    width: '25%',
    justifyContent: 'center',
  },
})
