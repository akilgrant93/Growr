import firebase from '../fb'
let app = firebase.app()
const db = firebase.firestore()

//actually gets all plants
export function getUserPlants(){
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

export function postUserPlant(name, type){
  return (dispatch) => {
    firebase.database().ref('/plants').push({name, type})
  }
}

export function deletePlant(key){
  return (dispatch) => {
    firebase.database().ref(`/plants/${key}`).remove()
  }
}

export function editPlant(name, type, key){
  return (dispatch) => {
    firebase.database().ref(`/plants`).child(key).update({name, type})
  }
}
