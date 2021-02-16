export default function (state={}, action){
  switch(action.type){
    case "PLANTS_FETCH":
      return {
        ...state, plantsList: action.payload
      }
    default:
      return state
  }
}
