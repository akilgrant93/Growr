import { StyleSheet, Text, TouchableOpacity, SafeAreaView, FlatList, View, Keyboard, TextInput } from 'react-native'
import React, {useState,useEffect} from 'react'
import {firebase} from '../config'
import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Pressable } from 'react-native'

const Dashboard = () => {
  const [name, setName] = useState('')
  const [ plants, setPlants] = useState([])
  const plantsRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('plants')
  const [addData, setAddData] = useState('')
  const navigation = useNavigation( )

  // change the users current password
  const changePassword = () => {
    firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.uid)
    .then(() => {
      alert('Password reset email sent')
    }).catch((error) => {
      alert(error)
    })
  }

  useEffect(()=> {
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
    .then((snapshot) => {
      if(snapshot.exists){
        setName(snapshot.data())
      } else {
        console.log('User does not exist')
      }
    })
    plantsRef
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      querySnapshot => {
        const plants = []
        querySnapshot.forEach((doc) => {
          const {heading} = doc.data()
          plants.push({
            id: doc.id,
            heading
          })
        })
        setPlants(plants)
      }
    )
  }, [])

  //delete a plant from users list of plant entries
  const deletePlant = (userPlants) => {
    plantsRef
    .doc(userPlants.id)
    .delete()
    .then(() => {
      alert('Deleted Successfully')
    })
    .catch( error =>{
      alert('Error deleting the message')
    })
  }

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
    <SafeAreaView style={styles.formContainer}>
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

      <FlatList
        data={plants}
        numColumns={1}
        renderItem={({item}) => (
          <View>
            <Pressable
              style={styles.container}
              onPress={() => navigation.navigate('Detail', {item})}
            >
              <FontAwesome
                name='trash-o'
                 color='red'
                 onPress={() => deletePlant(item)}
                 style={styles.plantIcon}
              />
              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>
                  {item.heading[0].toUpperCase() + item.heading.slice(1)}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => {changePassword()}}
        style={styles.button}
      >
        <Text style={{fontWeight: 'bold', fontSize:20}}>
            Change Password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {firebase.auth().signOut()}}
        style={styles.button}
      >
        <Text style={{fontWeight: 'bold', fontSize:20}}>
            Sign out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
     alignItems: 'center',
     flexDirection:'column',
     marginLeft: 45,
  },
  itemHeading: {
    fontWeight:'bold',
    fontSize: 18,
    marginRight:22,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
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
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: '#026efd',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 50,
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
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 14
  },

})

