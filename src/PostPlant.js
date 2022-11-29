import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'

const PostPlant = () => {
  const [addData, setAddData] = useState('')
    //add a plant from users list of plant entries
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
           setAddData('')
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
      <TextInput
        style={styles.input}
        placeholder="Add A New Plant"
        placeholderTextColor='#aaaaaa'
        onChangeText={(heading) => setAddData(heading)}
        value={addData}
        underlineColorAndroid='transparent'
        autoCapitalize='none'
      />
      <TouchableOpacity style={styles.button2}onPress={addPlant}>
         <Text style={styles.buttonText}>Add Plant</Text>
      </TouchableOpacity>
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
    width: '80%',
  },
  button2: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 100,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

})
