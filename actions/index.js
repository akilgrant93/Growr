import firebase from '../fb'
import * as Notifications from 'expo-notifications';
//admin functions

//gets all plants
export function getAllPlants(){
  return(dispatch) => {
    dispatch({
      type: "PLANTS_LOADING",
      payload: true
    })
    firebase.database().ref('/plants').on('value', snapshot => {
      dispatch({
        type: "PLANTS_FETCH",
        payload: snapshot.val()
      })

      dispatch({
        type: "PLANTS_LOADING",
        payload: false
      })
    })
  }
}

//add a plant to searchable db
export function postPlant(name, type){
  return (dispatch) => {
    firebase.firestore().ref('/plants').push({name, type})
  }
}

//delete a plant from the searchable db
export function deletePlant(key){
  return (dispatch) => {
    firebase.firestore().ref(`/plants/${key}`).remove()
  }
}

//edit a plant on the searchable db
export function editPlant(name, type, key){
  return (dispatch) => {
    firebase.firestore().ref(`/plants`).child(key).update({name, type})
  }
}


//user functions

//gets users plants
export function getUserPlants(uid){
  return(dispatch) => {
    dispatch({
      type: "PLANTS_LOADING",
      payload: true
    })
    firebase.database().ref(`/users/${uid}/userPlants`).on('value', snapshot => {
      dispatch({
        type: "PLANTS_FETCH",
        payload: snapshot.val()
      })

      dispatch({
        type: "PLANTS_LOADING",
        payload: false
      })
    })
  }
}

//add a plant to a users list of tracked plants will come with more settings other than "name" in the long term
export function postUserPlant(name, isPotted, isIndoors, isHydroponic, isSucculent, notes, notificationInterval, notificationId, firestoreID){
  console.log('FIRESTORE ID FIRESTORE ID FIRESTORE ID',firestoreID)
  const uid = firebase.auth().currentUser.uid

  //will take a value 0-7 and calculate the isThirsty property of the newPlant variable accordingly
  // const lastWatered = (days) => {}

  return (dispatch) => {
    const today = firebase.database.ServerValue.TIMESTAMP

    const newPlant = firebase.database().ref(`/users/${uid}/userPlants/`).push({name, isThirsty: false, initialized: today, isPotted, isIndoors, isHydroponic, isSucculent, firestoreID, notes})

    const key = newPlant.key

    firebase.database().ref(`users/${uid}/calendar/dates/${key}`).push({ notificationId, name, 'notificationInterval':notificationInterval})
  }
}

//update a plant on a users list of tracked plants
export function updateUserPlant(key, isPotted, isIndoors, isHydroponic, notes, notificationInterval, notificationId){
  const uid = firebase.auth().currentUser.uid

  return (dispatch) => {
    firebase.database().ref(`/users/${uid}/userPlants/${key}`).update({isPotted, isIndoors, notificationId, notificationInterval, isHydroponic, notes})
  }
}

//triggers with notification
export function plantNeedsWaterNotif(key){
  const uid = firebase.auth().currentUser.uid
  //timestamp needs to be translatedd into real date for calendar functions
  return (dispatch) => {
    firebase.database().ref(`/users/${uid}/userPlants/${key}`).update({isThirsty: true})
  }
}

//triggers with reset of notification
export function waterUserPlant(key, date){
  const uid = firebase.auth().currentUser.uid
  //timestamp needs to be translatedd into real date for calendar functions
  const lastWatered = firebase.database.ServerValue.TIMESTAMP

  return (dispatch) => {
    firebase.database().ref(`/user/${uid}/userPlants/${key}`).update({lastWatered: lastWatered, isThirsty: false})

    firebase.database().ref(`/user/${uid}/calendar/dates/${key}/${date}`).update({plantId:key, [date]:false})
  }
}

//delete a plant from the users list of tracked plants, and removes future notification alerts
export function deleteUserPlant(key){
  return (dispatch) => {

    const uid = firebase.auth().currentUser.uid
    let ref = firebase.database().ref()
    ref.child(`users/${uid}/calendar/dates`).child(`${key}`).get().then((snapshot) => {
      if (snapshot.exists()) {
        // console.log('notificationId ',Object.entries(snapshot.val())[0][1].notificationId);

        // Notifications.cancelAllScheduledNotificationsAsync()

        Notifications.cancelScheduledNotificationAsync(Object.entries(snapshot.val())[0][1].notificationId)


      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

    firebase.database().ref(`/users/${uid}/userPlants/${key}`).remove()
    firebase.database().ref(`users/${uid}/calendar/dates/${key}`).remove()

  }
}

//adds plant to users calendar entries
// export function createUserCalendar(){
//   const uid = firebase.auth().currentUser.uid

//   return (dispatch) => {
//     const newPlant = firebase.database().ref(`/userPlants/${uid}/plants`).push({name, isThirsty: false, lastWatered, isPotted, isIndoors, isHydroponic, isSucculent, notes})

//     const key = newPlant.key

//     firebase.database().ref(`/userCalendar/${uid}/dates/${key}`).push({plantId:key, [date]:false, notificationId})
//   }
// }

//water needs calculation function
export function needsWater(){

}

