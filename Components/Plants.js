import React, { Component } from 'react'
import { Text, StyleSheet, FlatList, TouchableHighlight, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Modal } from 'react-native'
import { getUserPlants, updateUserPlant, deleteUserPlant, plantNeedsWaterNotif } from '../actions'
import { connect } from 'react-redux'
import _ from 'lodash'
import firebase from 'firebase'
import { AntDesign } from '@expo/vector-icons';
import Weather from './Weather'
import MyNotifications from './notifications'
import { Container, View, Button, Icon, Fab, CheckBox } from 'native-base'
import { HeaderHeightContext } from '@react-navigation/stack';

class Plants extends Component {
  constructor(props){
        super(props)
        this.state = {
          active: false,
          isVisible: false,
          isPotted: false,
          isIndoors: false,
          isHydroponic: false,
          notificationInterval: '',
          selectedPlant: '',
          notes: '',
          needsWater: false,
          selectedPlantData: [],
        }
      }

//replace that goofy ass activity indicated with a plant themed animation
//under "add a plant - include some kind of illustration"

  async componentDidMount(){
    const uid = firebase.auth().currentUser.uid
    await this.props.getUserPlants(uid)
  }

  //modal functions
  togglePotted = () => {
    if(this.state.isPotted === false){
      this.setState({isPotted: true})
    } else {
      this.setState({isPotted: false})
    }
 }

  toggleIndoors = () => {
      if(this.state.isIndoors === false){
        this.setState({isIndoors: true, isPotted: true})
      } else {
        this.setState({isIndoors: false, isPotted: false})
      }
  }

  toggleHydroponic = () => {
      if(this.state.isHydroponic === false){
        this.setState({isHydroponic: true, isPotted: true})
      } else {
        this.setState({isHydroponic: false, isPotted: false})
      }
    }

  async displayModal(show, plantId, firestoreID){
        // console.log(plantId)
          const db = firebase.firestore()
          const rtdb = firebase.database()
          const uid = firebase.auth().currentUser.uid

          const plantfireStoreRef = db.collection("plants").doc(firestoreID);
          const plantsRealtimeRef = rtdb.ref()

          if(!show){
            await this.setState({isVisible: show, selectedPlant: '', selectedPlantData: []})
          } else {
            plantfireStoreRef.get().then((doc) => {
            if (doc.exists) {
                this.setState({selectedPlantData: doc.data(),isVisible: show, selectedPlant: plantId,})
            } else {
                console.log("No such document!");
            }
            }).catch((error) => {
            console.log("Error getting document:", error);
            });
            plantsRealtimeRef.child(`users/${uid}/userPlants/${plantId}`).get().then((snapshot) => {
              if (snapshot.exists()){

                //return to this
                console.log(snapshot.val())

                this.setState({isPotted: snapshot.val().isPotted, isHydroponic: snapshot.val().isHydroponic, isIndoors: snapshot.val().isIndoors, notes: snapshot.val().notes, notificationInterval: snapshot.val().notificationInterval})
              } else {
                console.log("No data available")
              }
            }).catch((error) => {
              console.error(error)
            })
          }

        }

  resolveAfterTime = function(time, key) {
    return new Promise(resolve => {
      setTimeout(() => {
        plantNeedsWaterNotif(key)
      }, time * 1000);
    });
  }

  async updatePlant(plant, indoors, potted, hydroponic, wasWatered){

      console.log('plant',plant)

      let indoorStatus = this.state.isIndoors
      let pottedStatus = this.state.isIndoors
      let hydroponicStatus = this.state.isIndoors
      let notes = this.state.notes
      let succulent

      Notifications.cancelScheduledNotificationAsync(plant.notificationId)

      if(indoors){
        indoorStatus = "Indoor"
      } else {
        indoorStatus = "Outdoor"
      }
      if(potted){
        pottedStatus = "Potted"
      } else {
        pottedStatus = "In-Ground"
      }
      if(hydroponic){
        hydroponicStatus = 'Hydroponic'
        pottedStatus = ''
      }

      if(this.state.selectedPlantData.tags.includes('Succulent') || this.state.selectedPlantData.tags.includes('Cactus') || plant.name === 'Cactaceae'){
        succulent = true
      } else {
        succulent = false
      }

      let daysBetweenWatering = 7

      //hyrdroponic water resevior replacement schedule
      if(hydroponic){
        daysBetweenWatering = 14
      }

      //succulent plants watering schedules
      if(succulent){
        if(indoors){
          daysBetweenWatering = 14
        }
        else if (!indoors && potted){
          daysBetweenWatering = 7
        }
        else if (!indoors && !potted){
          daysBetweenWatering = 28
        }
      }

      //potted plants watering schedules
      else if(potted){
        if(succulent && !indoors){
          daysBetweenWatering = 7
        } else if (succulent && indoors) {
          daysBetweenWatering = 14
        } else if (!suculent && !indoors){
          daysBetweenWatering = 3
        //if indoors not succulent
        } else {
          daysBetweenWatering = 7
        }
        }

      if(typeof plant.name === 'string'){
        console.log(`${indoorStatus} ${hydroponicStatus ? hydroponicStatus :''}${pottedStatus ? pottedStatus :''} ${plant.name}`)
        let notificationID = await Notifications.scheduleNotificationAsync({
          content: {
            title: `${indoorStatus} ${hydroponicStatus ? hydroponicStatus :''}${pottedStatus ? pottedStatus :''} ${plant.name}`,
            body: 'Needs water.',
          },
          trigger: {
            seconds: daysBetweenWatering*20,
          }
        })

        //daysbetweenwatering output needs to be converted into a format to feed into resolveaftertime properly - use a function, maybe one exists already as a method.

        this.props.updateUserPlant(
          plant.key,
          this.state.isPotted,
          this.state.isIndoors,
          this.state.isHydroponic,
          notes, daysBetweenWatering, notificationID)
        this.resolveAfterTime(daysBetweenWatering);
        }

      this.setState({isVisible: false, isPotted: false, isIndoors: false, isHydroponic: false})
      this.displayModal(false)
    }

  render() {
    //make the FAB component into a responsive functional component to reduce complexity
    return (
      <HeaderHeightContext.Consumer>
  {headerHeight => (
      <Container style={{backgroundColor: '#e6ffe6' }}>
        <View style={{ flex: 1, marginTop: headerHeight }}>
          <MyNotifications/>

          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ bottom: 65, right: 25 }}
            style={{ backgroundColor: '#1a5127'}}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="add-outline" />
            <Button style={{ backgroundColor: '#48ac60' }} onPress={() => this.props.navigation.navigate('New Plants')}>
              <Icon name="leaf-outline" />
            </Button>
            <Button style={{ backgroundColor: '#2e9247' }}>
              <Icon name="calendar-sharp"
              onPress={() => this.props.navigation.navigate('My Calendar')}/>
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

          <FlatList style={{width:'100%', maxHeight: '87.5%'}}
          //there is a frontend bug on item.item.name
          data={this.props.listOfPlants}
          keyExtractor={(item) => item.key}
          renderItem={(item) => {
            // console.log(this.state)
             return (
              <View style={styles.plantListItem}>
                <View>

                <Modal
                    animationType = {"slide"}
                    transparent={true}
                    visible={this.state.selectedPlant === item.item.key ? this.state.isVisible : false}
                    onRequestClose={() => {
                    Alert.alert('Modal has now been closed.');}}>
                      <View style={ styles.modal }>
                        <View style = {{width: '90%', marginLeft: 'auto', marginRight:'auto'}}>
                        <Text style = { styles.text3 }>{item.item.name}</Text>
                        {item.item.medicinalUse ? <Text style={{fontSize: 11}}>{item.item.medicinalUse}</Text> : <View/>}
                        <View>

                        {this.state.isVisible
                        ? <View>
                          {this.state.selectedPlantData.diseases.map(disease => { const diseaseImpacts = disease.split(':')
                        const diseases = ['rootRot:root rot','canker:canker','verticilliumWilt:verticillium wilt','mosaicVirus:mosaic virus','leafBlight:leaf blight','blackSpot:black spot','powderyMildew:powdery mildew','blackDot:Black Dot','caneBlight:cane blight']
                        const status = diseaseImpacts[1].charAt(0).toUpperCase() + diseaseImpacts[1].slice(1);
                        for(let i = 0; i < diseases.length; i++){
                          const currDisease = diseases[i].split(':')[0]
                          const formatted = diseases[i].split(':')[1]
                          if(currDisease === diseaseImpacts[0]){
                            return <Text style={{fontSize: 10, paddingBottom: '2%',paddingTop: '2%'}} key = {Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}>{status} to {formatted}.</Text>
                          }
                        }
                        })}
                        </View>
                        : <View></View>}

                        {this.state.isVisible
                        ? <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                   {this.state.selectedPlantData.tags.map(tag => {
                          return <View key = {Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)} style={{backgroundColor: '#004d00', padding: '1.5%', marginLeft: '2%', borderRadius: '2.5%'}}><Text style={{ fontSize:9 ,color: '#fff'}}>{tag}</Text></View>
                        })}
                          </View>
                        :
                        <View>
                        </View>
                        }

                        </View>

                        </View>
                        <View
                          style={{
                            width: '90%',
                            borderBottomColor: '#E5E4E2',
                            borderBottomWidth: 1,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: '3%',
                            marginBottom: '3%'
                            }}/>
                        <View style={styles.modalFooter}>
                          <View style={{flexDirection:'row'}}>
                            <CheckBox color = {'#004d00'} onPress = {this.togglePotted} checked = {this.state.isPotted}/>
                            <View style={{marginLeft: '15%', flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={{fontSize:10}}>Potted</Text>
                            </View>
                          </View>

                          <View style={{flexDirection:'row'}}>
                          <CheckBox color = {'#004d00'} onPress = {this.toggleIndoors} checked = {this.state.isIndoors}/>
                            <View style={{marginLeft: '15%', flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={{fontSize:10}}>Indoors</Text>
                            </View>
                          </View>

                          <View style={{flexDirection:'row'}}>
                          <CheckBox color = {'#004d00'} onPress = {this.toggleHydroponic} checked = {this.state.isHydroponic}/>
                            <View style={{marginLeft: '15%', flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={{fontSize:10}}>Hydroponic</Text>
                            </View>
                          </View>

                        </View>

                        <View style={styles.modalFooter2}>

                        <TouchableOpacity onPress={() => {this.displayModal(!this.state.isVisible)}}>
                          <Text style={styles.closeText}>Close</Text>
                          <AntDesign style={{marginLeft: 'auto', marginRight: 'auto'}} name="close" size={12} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.updatePlant.bind(this, item.item, this.state.isIndoors, this.state.isPotted, this.state.isHydroponic)
                        }>
  <Text style={styles.closeText}>Edit</Text>
  <AntDesign style={{marginLeft: 'auto', marginRight: 'auto'}} name="plussquareo" size={12} color="black" />
  </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>


                  <TouchableOpacity style={{paddingLeft: '2.5%', paddingRight: '1.25%',flexDirection: 'row', minWidth: '85%',justifyContent: 'space-between'}}
                  //this onpress may need some work regarding the contents of the item

                  //we will launch the modal here.
                  onPress={() => {
                    this.displayModal(true, item.item.key, item.item.firestoreID)}}>
                      <View style={{flexDirection: 'column',
                      }}>
                      <Text style={styles.plantName}>
                      {item.item.name}
                      </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
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

        {/* <Weather/> */}
        </View>
      </Container>
  )}
  </HeaderHeightContext.Consumer>
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
    justifyContent: 'center',
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
  // container: {
  //   backgroundColor: '#e6ffe6'
  // },
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
  },
  modal: {
    shadowOpacity: .25,
    shadowOffset: {width:1,height:1},
    shadowRadius: 2,
    display: 'flex',
    marginTop: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '75%',
    backgroundColor: 'rgba(250, 255, 250, 0.95)',
    borderRadius: 10,
    padding: '2%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalFooter2: {
    display: 'flex',
    paddingTop: '4%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
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


