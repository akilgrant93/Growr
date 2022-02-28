import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Picker, Button, TouchableHighlight } from 'react-native'
import { editUserPlant } from '../actions'
import { connect } from 'react-redux'
import { HeaderHeightContext } from '@react-navigation/stack';


//needs to change in correspondence with the post page, however that itself isn't worth cleaning until we change our db and know what kind of variables we will be dealing with
function Edit({ route, navigation }){
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [key, setKey] = useState('')

  const submit = () => {
    props.editUserPlant(name, type, key)
    setName('Type name here...')
    props.navigation.navigate('Home')
  }

  useEffect(()=>{
    console.log('navigation props',route.params)
  },[])

    return (
      <View style={styles.container}>
        <Text style={styles.text}> What kind of plant are you growing? </Text>

        <TouchableHighlight style={styles.button} onPress={submit}>
            <View style={{padding: '5%'}}>
              <Text style={styles.buttonTxt}>SUBMIT</Text>
            </View>
        </TouchableHighlight>
      </View>
    )

}

const styles = StyleSheet.create({
  button: {
    width: '30%',
    marginTop: '2%',
    marginLeft: '35%',
    marginRight: '35%',
    backgroundColor: '#004d00',
    borderRadius: 5,
  },
  buttonTxt: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#e6ffe6'
  },
  pickText: {
    backgroundColor: '#99ff99',
    fontSize: 14,
    color: '#004d00',
    paddingTop: '4%',
    paddingBottom: '4%',
    textAlign: 'center',
    fontWeight: '600'
  },
  text: {
    fontSize: 17,
    color:  '#004d00',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default connect(null, {editUserPlant})(Edit)
