import firebase from '../fb'

export function getPlants(){
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

export function postPlant(name, type){
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
