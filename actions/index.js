import firebase from '../fb'
let app = firebase.app()
const db = firebase.firestore()

//admin functions

//gets all plants
export function getAllPlants(){
  return(dispatch) => {
    dispatch({
      type: "PLANTS_LOADING",
      paylod: true
    })
    firebase.database().ref('/plants').on('value', snapshot => {
      dispatch({
        type: "PLANTS_FETCH",
        payload: snapshot.val()
      })

      dispatch({
        type: "PLANTS_LOADING",
        paylod: false
      })
    })
  }
}

//add a plant to searchable db
export function postPlant(name, type){
  return (dispatch) => {
    firebase.firestore().ref('/plants').push({name, type})
  }
}

//delete a plant from the searchable db
export function deletePlant(key){
  return (dispatch) => {
    firebase.database().ref(`/plants/${key}`).remove()
  }
}

//edit a plant on the searchable db
export function editPlant(name, type, key){
  return (dispatch) => {
    firebase.database().ref(`/plants`).child(key).update({name, type})
  }
}

//user functions

//gets users plants
export function getUserPlants(uid){
  return(dispatch) => {
    dispatch({
      type: "PLANTS_LOADING",
      paylod: true
    })
    firebase.database().ref(`/userPlants/${uid}/plants`).on('value', snapshot => {
      dispatch({
        type: "PLANTS_FETCH",
        payload: snapshot.val()
      })

      dispatch({
        type: "PLANTS_LOADING",
        paylod: false
      })
    })
  }
}

//add a plant to a users list of tracked plants will come with more settings other than "name" in the long term
export function postUserPlant(name, isPotted, isIndoors){
  const uid = firebase.auth().currentUser.uid
  const needsWater = false
  //timestamp needs to be translatedd into real date for calendar functions
  const lastWatered = firebase.database.ServerValue.TIMESTAMP
  console.log(firebase.database.ServerValue.TIMESTAMP)
  console.log('LAST WATERED', lastWatered)
  return (dispatch) => {
    firebase.database().ref(`/userPlants/${uid}/plants`).push({name, needsWater, lastWatered, isPotted, isIndoors})
  }
}

//delete a plant from the users list of tracked plants
export function deleteUserPlant(key){
  return (dispatch) => {
    const uid = firebase.auth().currentUser.uid
    firebase.database().ref(`/userPlants/${uid}/plants/${key}`).remove()
  }
}

//edit a plant on the users db - will be updated as functionality is added
export function editUserPlant(name, type, key){
  return (dispatch) => {
    const uid = firebase.auth().currentUser.uid
    firebase.database().ref(`/userPlants/${uid}/plants/${key}`).update({name, type})
  }
}
