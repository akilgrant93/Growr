import React, { Component } from 'react'
import { Text, StyleSheet, FlatList, TouchableHighlight, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native'
import { getUserPlants, deleteUserPlant } from '../actions'
import { connect } from 'react-redux'
import _ from 'lodash'
import firebase from 'firebase'
import { AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Container, Header, View, Button, Icon, Fab } from 'native-base'


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


class Plants extends Component {
  constructor(props){
    super(props)
    this.state = {
      notification: {},
      active: false,
      token: '',
      data: null,
      origin: null,
    }
  }
//replace that goofy ass activity indicated with a plant themed animation
//under "add a plant - include some kind of illustration"

async registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

  async componentDidMount(){
    const uid = firebase.auth().currentUser.uid

    await this.props.getUserPlants(uid)
    console.log('mounted in plants component')
    this.registerForPushNotificationsAsync();

    Notifications.addNotificationReceivedListener(this._handleNotification);

    Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);

  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

  _handleNotificationResponse = response => {
    console.log(response);
  };

  render() {
    return (
      <Container style={styles.container}>
        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ bottom: 35, right: 35 }}
            style={{ backgroundColor: '#1a5127'}}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="add-outline" />
            <Button style={{ backgroundColor: '#48ac60' }} onPress={() => this.props.navigation.navigate('New Plants')}>
              <Icon name="leaf-outline" />
            </Button>
            <Button style={{ backgroundColor: '#2e9247' }}>
              <Icon name="calendar-sharp" />
            </Button>
            <Button style={{ backgroundColor: '#247237' }}>
              <Icon name="md-cog-sharp" />
            </Button>
          </Fab>

        {
          this.props.loadingReducer
          ? <View style={{marginTop: '-80%'}}>
            <Text style={styles.loadText}>Loading</Text>
            <ActivityIndicator color="#004d00" size="large" style={styles.activityIndicator}/>
          </View>
          :
          <View styles={styles.buttonContainer}>

            {!this.props.listOfPlants.length
              ? <View style={{marginTop: '75%'}}>
              <Text style={styles.title2}>Add a plant!</Text>
              </View>
              : <Text></Text>}

          <FlatList style={{width:'100%'}}
          //there is a frontend bug on item.item.name
          data={this.props.listOfPlants}
          keyExtractor={(item) => item.key}
          renderItem={(item) => {
             return (
              <View style={styles.plantListItem}>
                <View>

                  <TouchableOpacity style={{paddingLeft: '2.5%', paddingRight: '1.25%',flexDirection: 'row', minWidth: '85%',justifyContent: 'space-between'}}onPress={() =>     this.props.navigation.navigate('Edit', {...item})}>
                      <View style={{flexDirection: 'column',
                      // justifyContent: 'flex-end'
                      }}>
                      <Text style={styles.plantName}>
                      {item.item.name}
                      </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                        //functionality to unsubcribe from repeating notifications inevtiably gets added here.
                        this.props.deleteUserPlant(item.item.key) }>
                        <AntDesign name="close" size={20} color="#004d00" style={{paddingTop: '2%'}}/>
                      </TouchableOpacity>
                  </TouchableOpacity>

                </View>
              </View>
            )
          }} />
          </View>
        }
        </View>
      </Container>
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
    //linked with left in floatingbutton
    left:     '36%',
    top:      '87.50%',
    backgroundColor: '#fff',
    padding: '3.5%',
    shadowOpacity: .25,
    shadowOffset: {
      width: 2,
      height: 3
    },
    borderRadius: 40,
  },
  floatingButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    //some kind of toxic math going on here idk
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
    backgroundColor: '#e6ffe6'
  },
  imgFlex: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor:'#90F890',

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
    height:35,
    width: '90%',
    paddingLeft: '5%',
    paddingRight: '5%',
    marginLeft: '5%',
    borderRadius: 5,
    borderColor: '#004d00',
    backgroundColor: '#C0FBC0'
  },
  plantName: {
    textAlign: 'center',
    color: '#004d00',
    fontWeight: 'bold',
    paddingTop: '3%',
    paddingRight: '25%',
  },
  title: {
    textAlign: 'center',
    color: '#004d00',
    fontWeight: 'bold',
    paddingTop: '3%',
  },
  title2: {
    textAlign: 'center',
    color: '#004d00',
    fontWeight: 'bold',
    paddingTop: '2%',
    fontSize: 20,
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


