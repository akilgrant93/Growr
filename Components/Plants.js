import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableHighlight, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { getUserPlants, deleteUserPlant } from '../actions'
import { connect } from 'react-redux'
import _ from 'lodash'
import firebase from 'firebase'
import * as Notifications from 'expo-notifications';

class Plants extends Component {
  constructor(props){
    super(props)
    this.state = {
      token: '',
      data: null,
      origin: null,
    }
  }
//replace that goofy ass activity indicated with a plant themed animation
  async componentDidMount(){
    const uid = firebase.auth().currentUser.uid
    //easy way to pass pushtoken
    const token = await Notifications.getExpoPushTokenAsync()
    await this.props.getUserPlants(uid)
    console.log('mounted in plants component')
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.props.loadingReducer
          ? <View style={{marginTop: '-80%'}}>
            <Text style={styles.loadText}>Loading</Text>
            <ActivityIndicator color="#004d00" size="large" style={styles.activityIndicator}/>
          </View>
          :
          <View styles={styles.buttonContainer}>
            {!this.props.listOfPlants.length
            ?<TouchableOpacity style={styles.emptyButton} onPress={() => this.props.navigation.navigate('Post')}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Image
                source={{ uri: 'https://images.squarespace-cdn.com/content/5363e3d1e4b0b6dbd37bcdd6/1584445483698-RRG2H8VCNCLB0QIGMXFJ/leaf.png?content-type=image%2Fpng'}}
              style={{ width: 30, height: 30, }} />
            </View>
          </TouchableOpacity>
            :<TouchableOpacity style={styles.floatingButton} onPress={() => this.props.navigation.navigate('Post')}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Image
                source={{ uri: 'https://images.squarespace-cdn.com/content/5363e3d1e4b0b6dbd37bcdd6/1584445483698-RRG2H8VCNCLB0QIGMXFJ/leaf.png?content-type=image%2Fpng'}}
              style={{ width: 30, height: 30, }} />
            </View>
          </TouchableOpacity>}
          <FlatList style={{width:'100%'}}
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
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    height: 100
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  emptyButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    left:     '25%',
    top:      '87.50%',
    backgroundColor: '#fff',
    padding: '3.5%',
    shadowOpacity: .25,
    shadowOffset: {
      width: 2,
      height: 3
    },
    borderRadius: 40,
    // zIndex: 5
  },
  floatingButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    left:     '67.5%',
    top:      '87.50%',
    backgroundColor: '#fff',
    padding: '3.5%',
    shadowOpacity: .25,
    shadowOffset: {
      width: 2,
      height: 3
    },
    borderRadius: 40,
    zIndex: 5
  },
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
  loadText:{
    color: '#004d00',
    fontWeight: 'bold',
    fontSize: 20,
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


