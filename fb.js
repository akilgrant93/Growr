import * as firebase from 'firebase'
import 'firebase/firestore';

export let firebaseConfig = {
  apiKey: "AIzaSyB_f7-flGSfGXOzc3BpwTErFnf1fOoDRP4",
  authDomain: "growr-65834.firebaseapp.com",
  databaseURL: "https://growr-65834.firebaseio.com",
  projectId: "growr-65834",
  storageBucket: "growr-65834.appspot.com",
  messagingSenderId: "522687291798",
  appId: "1:522687291798:web:c620a83a8450debbe4bdb7",
  measurementId: "G-KP6D7PCWPZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase
