import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Picker, Button } from 'react-native'
import { postPlant } from '../actions'
import { connect } from 'react-redux'

class Post extends Component {
  state={
    name:"",
    type:""
  }
  submit = () => {
    this.props.postPlant(this.state.name, this.state.type)
    this.setState({
      name:"",
      type:""
    })
    this.props.navigation.navigate('Home')
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> What kind of plant are you growing? </Text>
        <TextInput style={{marginTop:20, height:40, borderColor: 'gray', borderWidth: 1, backgroundColor: '#ccffcc'}}placholder="Name" onChangeText={name => this.setState({name})} value={this.state.name} />
        <Picker
          selectedValue={this.state.type}
          style={{height: 60, borderColor: '#004d00', borderWidth: 1, backgroundColor: '#99ff99', textAlign: 'center'}}
          onValueChange={(itemValue, itemIndex) =>
          this.setState({type: itemValue})
          }>
            <Picker.Item label="Pick a type!" value="" />
            <Picker.Item label="Vegetable" value="vegetable" />
            <Picker.Item label="Carnivorous" value="carnivorous" />
            <Picker.Item label="Tropical" value="tropical" />
            <Picker.Item label="Succulent" value="Succulent" />
            <Picker.Item label="Herbaceous" value="herbaceous" />
        </Picker>
        <Button title="Submit" onPress={this.submit} color='#004d00'/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#e6ffe6'
  },
  text: {
    fontSize: 17,
    color:  '#004d00',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default connect(null, {postPlant})(Post)
