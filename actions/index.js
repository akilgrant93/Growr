import firebase from '../fb'
let app = firebase.app()
const db = firebase.firestore()

//admin functions

//gets all plants
export function getAllPlants(){
  return(dispatch) => {
    dispatch({
      type: "PLANTS_LOADING",
      payload: true
    })
    firebase.database().ref('/plants').on('value', snapshot => {
      dispatch({
        type: "PLANTS_FETCH",
        payload: snapshot.val()
      })

      dispatch({
        type: "PLANTS_LOADING",
        payload: false
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
    firebase.firestore().ref(`/plants/${key}`).remove()
  }
}

//edit a plant on the searchable db
export function editPlant(name, type, key){
  return (dispatch) => {
    firebase.firestore().ref(`/plants`).child(key).update({name, type})
  }
}

//user functions

//gets users plants
export function getUserPlants(uid){
  return(dispatch) => {
    dispatch({
      type: "PLANTS_LOADING",
      payload: true
    })
    firebase.database().ref(`/userPlants/${uid}/plants`).on('value', snapshot => {
      dispatch({
        type: "PLANTS_FETCH",
        payload: snapshot.val()
      })

      dispatch({
        type: "PLANTS_LOADING",
        payload: false
      })
    })
  }
}

//add a plant to a users list of tracked plants will come with more settings other than "name" in the long term
export function postUserPlant(name, isPotted, isIndoors, isHydroponic, isSucculent, notes, date, notificationId){
  const uid = firebase.auth().currentUser.uid

  //timestamp needs to be translatedd into real date for calendar functions
  const lastWatered = firebase.database.ServerValue.TIMESTAMP

  return (dispatch) => {
    const newPlant = firebase.database().ref(`/userPlants/${uid}/plants`).push({name, needsWater: false, lastWatered, isPotted, isIndoors, isHydroponic, isSucculent, notes})

    const key = newPlant.key

    firebase.database().ref(`/userCalendar/${uid}/dates/${key}`).push({plantId:key, [date]:false, notificationId})
  }
}

//update a plant on a users list of tracked plants
export function updateUserPlant(key, isPotted, isIndoors, isHydroponic, notes){
  const uid = firebase.auth().currentUser.uid

  return (dispatch) => {
    firebase.database().ref(`/userPlants/${uid}/plants/${key}`).update({isPotted, isIndoors, isHydroponic, notes})
  }
}

//triggers with notification
export function plantNeedsWater(key){
  const uid = firebase.auth().currentUser.uid
  //timestamp needs to be translatedd into real date for calendar functions

  return (dispatch) => {
    firebase.database().ref(`/userPlants/${uid}/plants/${key}`).update({ needsWater: true})
  }
}

//triggers with reset of notification
export function waterUserPlant(key, date){
  const uid = firebase.auth().currentUser.uid
  //timestamp needs to be translatedd into real date for calendar functions
  const lastWatered = firebase.database.ServerValue.TIMESTAMP

  return (dispatch) => {
    firebase.database().ref(`/userPlants/${uid}/plants/${key}`).update({lastWatered: lastWatered, needsWater: false})

    firebase.database().ref(`/userCalendar/${uid}/dates/${key}/${date}`).update({plantId:key, [date]:false})
  }
}

//delete a plant from the users list of tracked plants
export function deleteUserPlant(key){
  return (dispatch) => {
    const uid = firebase.auth().currentUser.uid
    firebase.database().ref(`/userPlants/${uid}/plants/${key}`).remove()
    firebase.database().ref(`/userPlants/${uid}/dates/${key}`).remove()
  }
}


export function createUserCalendar(){
  const uid = firebase.auth().currentUser.uid

  return (dispatch) => {
    const newPlant = firebase.database().ref(`/userPlants/${uid}/plants`).push({name, needsWater: false, lastWatered, isPotted, isIndoors, isHydroponic, isSucculent, notes})

    const key = newPlant.key

    firebase.database().ref(`/userCalendar/${uid}/dates/${key}`).push({plantId:key, [date]:false, notificationId})
  }
}


// export function postUserPlant(name, isPotted, isIndoors, isHydroponic, isSucculent, notes, date, notificationId){
//   const uid = firebase.auth().currentUser.uid

//   //timestamp needs to be translatedd into real date for calendar functions
//   const lastWatered = firebase.database.ServerValue.TIMESTAMP

//   return (dispatch) => {
//     const newPlant = firebase.database().ref(`/userPlants/${uid}/plants`).push({name, needsWater: false, lastWatered, isPotted, isIndoors, isHydroponic, isSucculent, notes})

//     const key = newPlant.key

//     firebase.database().ref(`/userCalendar/${uid}/dates/${key}`).push({plantId:key, [date]:false, notificationId})
//   }
// }
