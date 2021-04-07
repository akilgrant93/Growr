import React, { Component } from 'react'
import { Text, StyleSheet, FlatList, TextInput, TouchableHighlight, Image, TouchableOpacity, Modal } from 'react-native'
import * as Notifications from 'expo-notifications';
import firebase from '../fb'
import { AntDesign, Entypo, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { postUserPlant } from '../actions'
import { connect } from 'react-redux'
import { Container, Header, View, Button, Icon, Fab, CheckBox} from 'native-base'
import { HeaderHeightContext } from '@react-navigation/stack';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isPotted: false,
      isIndoors: false,
      selectedPlant: '',
      endCursor: {},
      startCursor: {},
      count: 0,
      active: false,
      value:'Search',
      tableHead: ['Name'],
      tableData: [
      ]
    }
    this.offset = 1;
    this.submitPlantName = this.submitPlantName.bind(this);
  }

  //pagination functions - the prev function has some render bug. may have to be replaced.
  prev = async({
    search = this.state.value,
  } = {}) => {
    const db = firebase.firestore();
    const snapshot = await db.collection('plants')
    .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('scientificName','desc')
      .limit(7)
      .startAfter(this.state.startCursor)
      .get();

    const exactNameSnapshot = await db.collection('plants').where('commonName', '==', `${search}`).get();
    if(this.state.count <= 2){
      exactNameSnapshot.forEach(doc =>{
        const name = doc.data();
        this.setState({tableData: [{
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
          key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}], startCursor: snapshot.docs[snapshot.docs.length-1], endCursor: snapshot.docs[0], count: this.state.count-1})
      })

    } else {
      this.setState({tableData: [], startCursor: snapshot.docs[snapshot.docs.length-1], endCursor: snapshot.docs[0], count: this.state.count-1})
    }
    return snapshot.docs.reverse().reduce((acc, doc) => {
      const name = doc.data();
      this.setState({
        tableData:
            [...this.state.tableData,
              {
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
                key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}
            ]
        })
    }, '');
  }

  next = async({
    search = this.state.value,
  } = {}) => {
    const db = firebase.firestore();
    const snapshot = await db.collection('plants')
    .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('scientificName')
      .limit(8)
      .startAfter(this.state.endCursor)
      .get();
    this.setState({tableData: [], startCursor: snapshot.docs[0],endCursor: snapshot.docs[snapshot.docs.length-1], count: this.state.count+1})
    return snapshot.docs.reduce((acc, doc) => {
      const name = doc.data();
      this.setState({
        tableData:
          [...this.state.tableData,
            {
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
              key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}
          ]
        })
    }, '');
  }

  searchByName = async ({
    search = '',
  } = {}) => {

    const db = firebase.firestore();

    const exactNameSnapshot = await db.collection('plants').where('commonName', '==', `${search}`).get();

    const snapshot = await db.collection('plants')
      .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('scientificName')
      .limit(7)
      .get();

    this.setState({
      endCursor:
        snapshot.docs[snapshot.docs.length-1], count: this.state.count+1
      })
    exactNameSnapshot.forEach(doc =>{
      const name = doc.data();
      this.setState({
          tableData: [{
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
          key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}]
        })
    })
    return snapshot.docs.reduce((acc, doc) => {
      const name = doc.data();
      this.setState({
        count: this.state.count++,
        tableData:
          [...this.state.tableData,
            {
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
              key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}]
        })
    }, '');
  }

  //submits plants name to search function
  submitPlantName = async() => {
    this.setState({tableData: []})
    await this.searchByName({search: this.state.value})
  }

  cancelSearch = () => {
    this.setState({tableData: [], value: 'Search', tableHead: ['Name']})
  }

  //posting functions
  togglePotted = () => {
    if(this.state.isPotted === false){
      this.setState({isPotted: true})
    } else {
      this.setState({isPotted: false})
    }
 }

  toggleIndoors = () => {
    if(this.state.isIndoors === false){
      this.setState({isIndoors: true})
    } else {
      this.setState({isIndoors: false})
    }
}

  async displayModal(show, plantId){
    if(!show){
      await this.setState({isVisible: show, selectedPlant: ''})
    } else {
      await this.setState({isVisible: show, selectedPlant: plantId})
    }

    const db = firebase.firestore();
  }

  //message needs to contain more info about plant and user requirements to influence reminders, will be taken as args
  async postPlant(plant){
    console.log(plant)
    //if the common name is bugged
    if(typeof plant === 'string'){
      this.props.postUserPlant(plant, this.state.isPotted, this.state.isIndoors)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Water your ${plant}!`,
          body: 'Now!',
        },
        trigger: {
          seconds: 5,
          // repeats: true
        }
      })
    }
    //if theres a common name
    if(plant.commonName){

      this.props.postUserPlant(
        plant.commonName,
        this.state.isPotted,
        this.state.isIndoors
      )
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Water your ${plant.commonName}!`,
          body: 'Now!',
        },
        trigger: {
          seconds: 5,
          // repeats: true
        }
      })
    //otherwise refer to the scientific name
    } else if(!plant.commonName && typeof plant !== 'string') {
      this.props.postUserPlant(plant.scientificName, this.state.isPotted, this.state.isIndoors)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Water your ${plant.scientificName}!`,
          body: 'Now!',
        },
        trigger: {
          seconds: 5,
          // repeats: true
        }
      })
    }
    this.setState({isVisible: false, isPotted: false, isIndoors: false, tableHead: ['Name'], tableData: []})
    this.props.navigation.navigate('My Plants')
  }

  render() {
    return (
      <HeaderHeightContext.Consumer>
  {headerHeight => (
      <View style={!this.state.tableData.length ? styles.containerFlex : styles.container}>
        { !this.state.tableData.length
        ? <Fab
            direction="up"
            containerStyle={{ bottom: 35, right: 35 }}
            style={{ backgroundColor: '#1a5127'}}
            position="bottomRight"
            onPress={() => this.props.navigation.navigate('My Plants')}>
            <Icon name="ios-close" />
          </Fab>
          : <Fab
          active={this.state.active}
          direction="left"
          containerStyle={{ bottom: 35, right: 35 }}
          style={{ backgroundColor: '#1a5127'}}
          position="bottomRight"
          onPress={() => this.setState({ active: !this.state.active })}>
          <Icon name="add-outline" />

          <Button style={{ backgroundColor: '#247237' }} onPress={() => this.next()}>
            <Icon name="arrow-forward-outline" />
          </Button>

          { this.state.count >= 1
            ? <Button style={{ backgroundColor: '#247237' }} onPress={()=> this.prev()}><Icon name="arrow-back-outline" /></Button>
            : <Button style={{ backgroundColor: '#A9A9A9' }}><Icon name="arrow-back-outline" /></Button>
          }

          <Button style={{ backgroundColor: '#247237' }} onPress={() => this.cancelSearch()}>
            <Icon name="ios-close" />
          </Button>

        </Fab> }
        <View style={{ marginTop: headerHeight }}>



        <Text style={styles.text}> What kind of plant are you growing? </Text>
        <View style={{display:'flex',flexDirection:'row', justifyContent: 'center'}}>
        <TextInput
          id ='textBoxSearch'
          style = {{
            flexBasis: 200,
            height:40,
            backgroundColor: '#ccffcc',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            paddingLeft: '5%',
            fontSize: 14,
            color: '#004d00'
          }}
          clearButtonMode='always'
          defaultValue="Search" onChangeText={name => this.setState({value:name})}
           />
           <TouchableHighlight style={styles.button} onPress={this.submitPlantName}>
            <View style={{flexDirection: 'column',padding: '5%'}}>
              <Text style={styles.buttonTxt}>SUBMIT</Text>
            </View>
        </TouchableHighlight>
        </View>


        <View>
           {!this.state.tableData ? <View></View> : <FlatList style={{width:'100%',marginTop: '5%'}}
          data={this.state.tableData}
          keyExtractor={(item) => item.key}
          scrollEnabled={false}
          renderItem={(item) => {
            //conver these to card components for visual effect
            // console.log(item)
             return (
              <View>
                <View style={{paddingBottom: '1%',
                paddingTop: '1%',
                flexDirection: 'column',
                justifyContent: 'space-between'}}>
                  <Modal
                    animationType = {"slide"}
                    transparent={true}
                    visible={this.state.selectedPlant === item.item.key ? this.state.isVisible : false}
                    onRequestClose={() => {
                    Alert.alert('Modal has now been closed.');}}>
                      <View style={ styles.modal }>
                        <View style = {{width: '90%', marginLeft: 'auto', marginRight:'auto'}}>
                        <Text style = { styles.text3 }>
                            {item.item.commonName} <Text style={{fontStyle: 'italic'}}>({item.item.scientificName})</Text>
                        </Text>
                        {item.item.medicinalUse ? <Text style={{fontSize: 11}}>{item.item.medicinalUse}</Text> : <View/>}
                        <View>
                        {item.item.diseases.map(disease => { const diseaseImpacts = disease.split(':')
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

                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        {item.item.tags.map(tag => {
                          console.log(tag)
                          return <View key = {Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)} style={{backgroundColor: '#004d00', padding: '1.5%', marginLeft: '2%', borderRadius: '2.5%'}}><Text style={{ fontSize:9 ,color: '#fff'}}>{tag}</Text></View>
                        })}
                        </View>
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
                            <Text style={{fontSize:9}}>Potted</Text>
                            </View>
                          </View>

                          <View style={{flexDirection:'row'}}>
                          <CheckBox color = {'#004d00'} onPress = {this.toggleIndoors} checked = {this.state.isIndoors}/>
                            <View style={{marginLeft: '15%', flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={{fontSize:9}}>Indoors</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.modalFooter2}>

                        <TouchableOpacity onPress={() => {this.displayModal(!this.state.isVisible)}}>
                          <Text style={styles.closeText}>Close</Text>
                          <AntDesign style={{marginLeft: 'auto', marginRight: 'auto'}} name="close" size={12} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={
                          this.postPlant.bind(this, item.item)
                        }
                          >
                            <Text style={styles.closeText}>Track</Text>
                            <AntDesign style={{marginLeft: 'auto', marginRight: 'auto'}} name="plussquareo" size={12} color="black" />
                        </TouchableOpacity>

                        </View>
                      </View>
                    </Modal>

                    <TouchableOpacity onPress={() => {
                    this.displayModal(true, item.item.key)}}>
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
                        <View style={{ flexDirection: 'row', marginRight: '2%'}}>
                          {item.item.poisonous ? <FontAwesome5  name="skull-crossbones" size={25} color="black"/> : <View></View>}
                          {item.item.edible || item.item.tags.includes('Edible')  ? <MaterialCommunityIcons  name="silverware-fork-knife" size={25} color="black"/> : <View></View>}
                          {item.item.tags.includes('Herbal') || item.item.herbal ? <MaterialCommunityIcons  name="medical-bag" size={25} color="black"/> : <View></View>}
                          {item.item.tags.includes('Cactus') || item.item.tags.includes('Succulent') || item.item.familyName === 'Cactaceae'  || item.item.succulent ? <MaterialCommunityIcons  name="cactus" size={25} color="black"/> : <View></View>}
                          {item.item.tags.includes('Aquatic - Freshwater') || item.item.freshWaterAquatic ? <Entypo  name="drop" size={25} color="black"/> : <View></View>}
                        </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                </View>

              </View>
            )
          }} />
        }
        </View>

        </View>
        </View>
        )}
        </HeaderHeightContext.Consumer>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flexBasis: 75,
    marginLeft: '2.5%',
    // marginRight: '5%',
    backgroundColor: '#004d00',
    borderRadius: 2.5,
    justifyContent: 'center'
  },
  buttonTxt: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  containerFlex: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#e6ffe6'
  },
  container: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#e6ffe6'
  },
  container2: {
    backgroundColor: '#fff'
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff'
  },
  modal: {
    shadowOpacity: .5,
    shadowOffset: {width:2,height:2},
    shadowRadius: 2,
    display: 'flex',
    marginTop: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '75%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: '2%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text2: {
    margin: 5,
    fontSize: 10,
    color:  '#004d00',
    fontWeight: 'bold',
    textAlign: 'center'
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
  textView2: {
    paddingBottom: '2%',
    paddingTop: '2%',
    paddingLeft: '1%',
    backgroundColor:  '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textView: {
    paddingBottom: '3%',
    paddingTop: '3%',
    marginLeft: '2%',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 17,
    color:  '#004d00',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2%'
  },
  modal: {
    display: 'flex',
    marginTop: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '75%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
  text3: {
    fontSize: 14,
    color:  '#004d00',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2%',
    paddingBottom: '2%',
    paddingTop: '4%',
  }
})

export default connect(null, {postUserPlant})(Post)
