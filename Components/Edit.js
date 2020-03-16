import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Picker, Button } from 'react-native'
import { editPlant } from '../actions'
import { connect } from 'react-redux'

class Edit extends Component {
  state={
    name:this.props.navigation.state.params.item.name,
    type:this.props.navigation.state.params.item.type,
    key:this.props.navigation.state.params.item.key

  }
  submit = () => {
    this.props.editPlant(this.state.name, this.state.type, this.state.key)
    this.setState({
      name: "",
      type: "",
      key: ""
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

export default connect(null, {editPlant})(Edit)
