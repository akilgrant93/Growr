import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import firebase from '../fb'

export default class EmailAndPassword extends Component {
  state = {
    email: "",
    password: "",
    error: "",
    loading: false,
    accountCreated: false
  }

  //sign-in function
  onSubmit = () =>{
    firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
    .then(this.loginSucceeded)
    .catch(err => {
      this.setState({
        error:err.message
      })

    })

  }

  onSignUp = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(err) {
      this.setState({
        error: err.message
      })

    });
    this.setState({
      accountCreated: true
    })
  }

loginSucceeded =  () =>{
    this.setState({
        error:"",
        loading:false
    })
}

  render() {
    return (
      <View styles={styles.container}>
        <TextInput
        placeholder="email"
        keyboardType="email-address"
        style={styles.input}
        value={this.state.email}
        onChangeText = {email => this.setState({email})}
        />
        <TextInput
        placeholder="password"
        style={styles.input}
        value={this.state.password}
        onChangeText = {password => this.setState({password})}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.onSubmit}>
          <Text style={styles.buttonTxt}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.onSignUp}>
          <Text style={styles.buttonTxt}>Sign Up</Text>
        </TouchableOpacity>
          <Text style={styles.error}>
          {this.state.error}
          </Text>
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    fontSize: 15,
    backgroundColor: 'rgba(0, 77, 0, .25)',
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 40,
    marginBottom: 15,
    textAlign: 'center'
  },
  error: {
    marginTop: 10,
    fontSize: 12,
    color: 'red',
    alignSelf: 'center',
  },
  buttonTxt: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 12,
  },
  buttonContainer: {
     backgroundColor: "#004d00",
     padding: 15,
     minWidth: 300,
     marginTop: 15,
     borderRadius: 8,
  }
}
