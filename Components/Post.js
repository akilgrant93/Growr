import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Picker, Button, TouchableHighlight } from 'react-native'
import { postPlant } from '../actions'
import { connect } from 'react-redux'

class Post extends Component {
  state={
    name:"Type name here...",
    type:""
  }
  submit = () => {
    this.props.postPlant(this.state.name, this.state.type)
    this.setState({
      name:"Type name here...",
      type:""
    })
    this.props.navigation.navigate('Home')
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> What kind of plant are you growing? </Text>
        <TextInput
          style = {{
            marginTop:20,
            height:40,
            backgroundColor: '#ccffcc',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            paddingLeft: '5%',
            fontSize: 14,
            color: '#004d00'
          }}
          autoCapitalize="sentences"
          placholder="Name" onChangeText={name => this.setState({name})} value={this.state.name} />
        <Text style={styles.pickText}>Type of Plant</Text>
        <Picker
          selectedValue={this.state.type}
          style={{backgroundColor: '#66ff66', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}
          itemStyle={{ fontSize: 14, color: 'fff'}}
          mode="dropdown"
          onValueChange={(itemValue, itemIndex) =>
          this.setState({type: itemValue})
          }>
            <Picker.Item label="Vegetable" value="vegetable" />
            <Picker.Item label="Carnivorous" value="carnivorous" />
            <Picker.Item label="Tropical" value="tropical" />
            <Picker.Item label="Succulent" value="Succulent" />
            <Picker.Item label="Herbaceous" value="herbaceous" />
        </Picker>
        <TouchableHighlight style={styles.button} onPress={this.submit}>
            <View style={{padding: '5%'}}>
              <Text style={styles.buttonTxt}>SUBMIT</Text>
            </View>
        </TouchableHighlight>
      </View>
    )
  }
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

export default connect(null, {postPlant})(Post)
