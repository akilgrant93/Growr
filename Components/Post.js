import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TextInput, Picker, Button, TouchableHighlight, Image, TouchableOpacity } from 'react-native'
import firebase from '../fb'
import ReactDOM from 'react-dom'
import { postUserPlant } from '../actions'
// import plants from '../plantseed'
import { connect } from 'react-redux'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component'

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:'Search',
      tableHead: ['Name'],
      tableData: [
      ]
    }
    this.handleChange = this.handleChange.bind(this);
  }

  multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
      // console.log(JSON.stringify(arr[i]))
        var stringified = JSON.stringify(arr[i].name);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
  }

  // db = firebase.firestore();
  searchByName = async ({
    search = '',
    limit = 100,
    lastNameOfLastPlant = ''
  } = {}) => {
    console.log('search',search)
    const db = firebase.firestore();
    const snapshot = await db.collection('plants')
      .where('keywords', 'array-contains', search.toLowerCase())
      .orderBy('name.scientificName')
      .limit(limit)
      .get();
    return snapshot.docs.reduce((acc, doc) => {
      const name = doc.data().name;
      this.setState({tableData: this.multiDimensionalUnique([...this.state.tableData, name.commonName !== '' ? {name: name.commonName, key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`} : {name: name.scientificName, key: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`}])})
    }, '');
  };d

  handleChange = async() => {
    console.log(this.state)
    this.setState({tableData: []})
    await this.searchByName({search: this.state.value})
  }


  submit = () => {
    this.props.postUserPlant(this.state.name, this.state.type)
    this.setState({
      type:""
    })
    this.props.navigation.navigate('Home')
  }

  render() {
    console.log('tabledata', this.state.tableData)
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
          // clearTextOnFocus= {true}
          // inlineImageLeft='search_icon'
          // autoCapitalize="sentences"
          defaultValue="Search" onChangeText={name => this.setState({value:name})}
          //  value={this.state.name}
           />
           <TouchableHighlight style={styles.button} onPress={this.handleChange}>
            <View style={{flexDirection: 'column',padding: '5%'}}>
              <Text style={styles.buttonTxt}>SUBMIT</Text>
            </View>
        </TouchableHighlight>
        </View>

        <View>
           {!this.state.tableData ? <View></View> : <FlatList style={{width:'100%'}}
          data={this.state.tableData}
          keyExtractor={(item) => item.key}
          renderItem={(item) => {
            console.log('item',item)
             return (
              <View style={styles.plantListItem}>
                {item.index % 2
                ? <View style={styles.textView}>
                <View>
                <Text style={styles.title}>
                 {item.item.name}
                </Text>
                </View>
                </View>
                : <View style={styles.textView2}>
                <View>
                <Text style={styles.title}>
                 {item.item.name}
                </Text>
                </View>
                </View>
                }
              </View>
            )
          }} />
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
    paddingBottom: '1%',
    paddingTop: '1%',
    paddingLeft: '1%',
    backgroundColor:  '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textView: {
    paddingBottom: '1%',
    paddingTop: '1%',
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

export default connect(null, { postUserPlant})(Post)
