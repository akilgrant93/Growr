import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, Modal } from 'react-native'
import { postUserPlant } from '../actions'
import { AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux'
import firebase from 'firebase'

class ListedPlant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    }
  }

  displayModal(show){
    this.setState({isVisible: show})
  }
  postPlant(name){
    console.log('this.props in postPlant',this.props)
    // this.props.postUserPlant.bind(this, this.props.item.commonName)
    this.props.postUserPlant(this.props.item.commonName)
    this.setState({isVisible: false})
  }
  render() {
    const uid = firebase.auth().currentUser.uid
    return (
      <View style={this.props.style % 2
        ? styles.textView
        : styles.textView2} >
        <Modal
          animationType = {"slide"}
          transparent={true}
          visible={this.state.isVisible}
          onRequestClose={() => {
          Alert.alert('Modal has now been closed.');}}>
            <View style={ styles.modal }>
              <Text style = { styles.text }>
                  {this.props.item.commonName} <Text style={{fontStyle: 'italic'}}>({this.props.item.scientificName})</Text>
              </Text>
              <View style={styles.modalFooter}>

              <TouchableOpacity onPress={() => {this.displayModal(!this.state.isVisible);}}>
                <Text style={styles.closeText}>Close</Text>
                <AntDesign style={{marginLeft: 'auto', marginRight: 'auto'}} name="close" size={24} color="black" />
              </TouchableOpacity>

              <TouchableOpacity onPress={
                // console.log(firebase.auth().currentUser.uid)
                // this.props.postUserPlant.bind(this, this.props.item.commonName)
                this.postPlant.bind(this, this.props.item.commonName)
              }
                >
                  <Text style={styles.closeText}>Track</Text>
                  <AntDesign style={{marginLeft: 'auto', marginRight: 'auto'}} name="plussquareo" size={24} color="black" />
              </TouchableOpacity>

              </View>
            </View>
          </Modal>

          <TouchableOpacity onPress={() => {
          this.displayModal(true)}}>
            <View style={styles.textView}>
              <Text style={styles.title}>
                {!this.props.item.commonName
                  ? this.props.item.scientificName
                  : this.props.item.commonName}
              </Text>
            </View>
          </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
    fontSize: 14,
    color:  '#004d00',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2%',
    paddingBottom: '7.5%',
    paddingTop: '5%',
  }
})

export default connect(null, {postUserPlant})(ListedPlant)
