import { firebase } from '../config'
// import {React, useState}

export const searchByName = async (value) => {
  if(value[value.length-1] === ' '){
    value = value.slice(0,search.value-1)
  }
  console.log(value)
  const plantsArr = new Array()
  const snapshot = firebase.firestore()
    .collection('plant')
    .where('keywords', 'array-contains', value.toLowerCase())
    .orderBy('commonName')
    .limit(25)
    .get()

    const lastVisible = snapshot.docs[snapshot.docs.length-1];


    snapshot.forEach((plant) => {
      let plantData = plant.data()
      plantData.plantId = plant.id
      plantsArr.push(plantData)
      })

      // setRefreshing(false);
      // setEndCursor(querySnapshot.docs[querySnapshot.docs.length-1])
      // setPlants(plantsArr)

  return {plantsArr, lastVisible}
}
