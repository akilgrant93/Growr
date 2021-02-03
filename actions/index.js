import firebase from '../fb'
let app = firebase.app()
const db = firebase.firestore()

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

//gets users plants
export function getUserPlants(uid){
  return(dispatch) => {
    dispatch({
      type: "PLANTS_LOADING",
      paylod: true
    })
    firebase.database().ref('/userPlants').child(`${uid}`).on('value', snapshot => {
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

//add a plant to a users list of tracked plants
export function postUserPlant(name){
  // console.log(name)
  const uid = firebase.auth().currentUser.uid
  // console.log(uid)
  return (dispatch) => {
    firebase.database().ref(`/userPlants/${uid}/plants`).push({name})
  }
}

