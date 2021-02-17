import React, { Component, useState } from 'react'
import { Text, View, StyleSheet, Button, FlatList, TouchableHighlight, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native'
import { getUserPlants, deleteUserPlant } from '../actions'
import { connect } from 'react-redux'
import _ from 'lodash'
import Icon from 'react-native-vector-icons'
import firebase from 'firebase'
import * as Notifications from 'expo-notifications';

class Plants extends Component {
  async componentDidMount(){
    const uid = firebase.auth().currentUser.uid
    //easy way to pass pushtoken
    const token = await Notifications.getExpoPushTokenAsync()
    await this.props.getUserPlants(uid)
  }
  render() {
    return (
      <View style={styles.container}>

        {
          this.props.loadingReducer ? <Text>Loading Please Wait</Text> : <FlatList style={{width:'100%'}}
          data={this.props.listOfPlants}
          keyExtractor={(item) => item.key}
          renderItem={(item) => {
             return (
              <View style={styles.plantListItem}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={styles.textView}>
                <Text style={styles.title}>
                  {item.item.name}
                </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableHighlight style={styles.imgFlex} onPress={() => this.props.navigation.navigate('Edit', {...item})}>
                    <View >
                      <Text style={styles.buttonText}>EDIT</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight style={styles.imgFlex2} onPress={() => this.props.deleteUserPlant(item.item.key) }>
                    <View >
                      <Text style={styles.buttonText2}>DELETE</Text>
                    </View>
                  </TouchableHighlight>
                  </View>
                </View>
              </View>
            )
          }} />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonText: {
  fontSize: 8,
  color:  '#004d00',
  fontWeight: 'bold',
  padding: '3%',
  },
  buttonText2: {
    fontSize: 8,
    color:  '#fff',
    fontWeight: 'bold',
    padding: '3%',
    },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6ffe6'
  },
  imgFlex: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor:'#90F890'

  },
  imgFlex2: {
    display: 'flex',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor:'#00e600',
  },
  plantListItem: {
    marginTop:10,
    minHeight:35,
    width: '90%',
    marginLeft: '5%',
    borderRadius: 5,
    borderColor: '#004d00',
    backgroundColor: '#C0FBC0'
  },
  title: {
    textAlign: 'center',
    color: '#004d00',
    fontWeight: 'bold',
    paddingTop: '2%',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 10,
    padding: '2%'
  },
  textView: {
    display: 'flex',
    width: '60%',
    paddingTop: '2%',
    paddingBottom: '2%',
    flexDirection: 'column'
  }
})

function mapState(state){
  const listOfPlants = _.map(state.plantsList.plantsList, (val, key) => {
    return{
      ...val,
      key:key
    }
  })
  return {
    listOfPlants,
    loadingReducer: state.loadingReducer.loadingReducer
  }
}

export default connect(mapState, {getUserPlants, deleteUserPlant})(Plants)


