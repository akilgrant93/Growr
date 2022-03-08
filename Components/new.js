
  useEffect(() => {

    const getData = async () => {
      const uid = firebase.auth().currentUser.uid
      let response = null

      firebase.database().ref(`/users/${uid}/userPlants`).on('value', (snapshot) => {
        response = snapshot.val();
      }, (errorObject) => {
        console.log('The read failed: ' + errorObject.name);
      });

     let itemObj = {}
     for (const property in response) {
      for (const innerProp in response[property]){

        if (typeof(response[property][innerProp])=== 'number'){
          const propName = response[property][innerProp].toString()

          itemObj[propName] = response[property][innerProp]
        }
      }
     }


    setItems(itemObj);


    };

    getData();
  }, []);
