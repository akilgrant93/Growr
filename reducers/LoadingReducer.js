export default function LoadingReducer(state={}, action){
  switch(action.type){
    case "PLANTS_LOADING":
      return {
        ...state,
        loadingReducer: action.payload
      }
    default:
      return state
  }
}

