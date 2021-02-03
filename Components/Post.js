import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TextInput, Picker, Button, TouchableHighlight, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native'
import firebase from '../fb'
import ReactDOM from 'react-dom'
// import plants from '../plantseed'
import { AntDesign } from '@expo/vector-icons';
import ListedPlant from './ListedPlant'
//make header component - experiment w/ react navigation

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endCursor: {},
      startCursor: {},
      limit: 40,
      value:'Search',
      tableHead: ['Name'],
      tableData: [
      ]
    }
    this.offset = 1;
    this.handleChange = this.handleChange.bind(this);
  }

  multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
      var stringified = JSON.stringify(arr[i].commonName)+JSON.stringify(arr[i].scientificName);
      if(itemsFound[stringified]) { continue; }
      uniques.push(arr[i]);
      itemsFound[stringified] = true;
    }
    return uniques;
  }

  prev = async({
    search = this.state.value,
  } = {}) => {
    const db = firebase.firestore();
    const snapshot = await db.collection('plants')
    .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('name.scientificName','desc')
      .limit(this.state.limit)
      .startAfter(this.state.startCursor)
      .get();
    this.setState({tableData: [], startCursor: snapshot.docs[snapshot.docs.length-1], endCursor: snapshot.docs[0]})
    return snapshot.docs.reverse().reduce((acc, doc) => {
      const name = doc.data().name;
      this.setState({
        tableData:
        this.multiDimensionalUnique(
            [...this.state.tableData,
              {commonName: name.commonName, scientificName: name.scientificName, key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}
            ]
          )
        })
    }, '');
  }

  next = async({
    search = this.state.value,
  } = {}) => {
    const db = firebase.firestore();
    const snapshot = await db.collection('plants')
    .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('name.scientificName')
      .limit(this.state.limit)
      .startAfter(this.state.endCursor)
      .get();
    this.setState({tableData: [], startCursor: snapshot.docs[0],endCursor: snapshot.docs[snapshot.docs.length-1]})
    return snapshot.docs.reduce((acc, doc) => {
      const name = doc.data().name;
      // console.log('name',name)
      this.setState({
        tableData:
        this.multiDimensionalUnique(
          [...this.state.tableData,
            {commonName: name.commonName, scientificName: name.scientificName, key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}
          ]
          )
        })
    }, '');
  }

  searchByName = async ({
    search = '',
  } = {}) => {

    const db = firebase.firestore();
    const snapshot = await db.collection('plants')
      .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('name.scientificName')
      .limit(this.state.limit)
      .get();
    this.state.endCursor = snapshot.docs[snapshot.docs.length-1]
    return snapshot.docs.reduce((acc, doc) => {
      const name = doc.data().name;
      this.count++
      // console.log(doc.data().name)
      this.setState({
        tableData:
        this.multiDimensionalUnique(
          [...this.state.tableData,
            {commonName: name.commonName, scientificName: name.scientificName, key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}
          ]
          )
        })
    }, '');
  }

  handleChange = async() => {
    this.setState({tableData: []})
    await this.searchByName({search: this.state.value})
  }

  render() {
    return (
      <View style={styles.container}>
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
           <TouchableHighlight style={styles.button} onPress={this.handleChange}>
            <View style={{flexDirection: 'column',padding: '5%'}}>
              <Text style={styles.buttonTxt}>SUBMIT</Text>
            </View>
        </TouchableHighlight>
        </View>
        <View>
           {!this.state.tableData ? <View></View> : <FlatList style={{width:'100%',marginTop: '5%'}}
          data={this.state.tableData}
          keyExtractor={(item) => item.key}
          renderItem={(item) => {
            // console.log(item)
             return (
              <View style={styles.plantListItem}>
                {item.index % 2
                  ? <ListedPlant item={item.item} style={1}/>
                  : <ListedPlant item={item.item} style={2}/>
                }
              </View>
            )
          }} />
        }
        {
          this.state.tableData.length === 0
            ? <View></View>
            : <View style = {{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-around', marginTop: '5%', width: '70%', marginLeft: '15%'}}>
                  <TouchableHighlight onPress={this.prev}>
                  <View>
                  <AntDesign name="leftcircleo" size={40} color="green" />
                  </View>
                </TouchableHighlight>
                {this.state.tableData.length < this.state.limit/2
                  ? <TouchableHighlight>
                  <View>
                  <AntDesign name="rightcircleo" size={40} color="grey" />
                  </View>
                </TouchableHighlight>
                  : <TouchableHighlight onPress={this.next}>
                  <View>
                  <AntDesign name="rightcircleo" size={40} color="green" />
                  </View>
                </TouchableHighlight>}
                </View>
              }
        </View>
        </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
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
    display: 'flex',
    marginTop: '25%',
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
    paddingBottom: '2%',
    paddingTop: '2%',
    paddingLeft: '1%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 17,
    color:  '#004d00',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2%'
  }
})
