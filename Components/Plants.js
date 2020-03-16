import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, FlatList, TouchableHighlight, Image } from 'react-native'
import { getPlants, deletePlant } from '../actions'
import { connect } from 'react-redux'
import _ from 'lodash'
import Icon from 'react-native-vector-icons'

class Plants extends Component {
  componentDidMount(){
    this.props.getPlants()
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
                <Text style={styles.title}>
                  {item.item.name}
                </Text>
                <Text style={styles.subtitle}>
                  {item.item.type.toUpperCase()}
                </Text>
                <View style={{flexDirection: 'row', paddingRight: '1em', justifyContent: 'flex-end'}}>
                  <TouchableHighlight style={{backgroundColor:'#004d00'}} onPress={() => this.props.navigation.navigate('Edit', {...item})}>
                    <View style={styles.imgFlex}>
                      <Text style={styles.buttonText}>EDIT</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight style={{backgroundColor:'#b3ffb3'}} onPress={() => this.props.deletePlant(item.item.key) }>
                    <View style={styles.imgFlex}>
                      <Text style={styles.buttonText2}>DELETE</Text>
                    </View>
                  </TouchableHighlight>
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
  color:  '#fff',
  fontWeight: 'bold',
  padding: '.5em',
  },
  buttonText2: {
    fontSize: 8,
    color:  '#004d00',
    fontWeight: 'bold',
    padding: '.5em',
    },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6ffe6'
  },
  imgFlex: {
    display: 'flex',
  },
  plantListItem: {
    elevation: 8,
    marginTop:20,
    height:75,
    width: '90%',
    paddingTop: '.5m',
    marginLeft: '5%',
    borderRadius: '5px',
    borderColor: '#004d00',
    borderWidth: 1,
  },
  title: {
    textAlign: 'center',
    color: '#004d00',
    fontWeight: 'bold',
    paddingTop: '.5em'
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 10,
    padding: '.5em'
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

export default connect(mapState, {getPlants, deletePlant})(Plants)


