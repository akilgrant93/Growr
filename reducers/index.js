import { combineReducers } from 'redux'
import  PlantReducer  from './PlantReducer'
import  LoadingReducer  from './LoadingReducer'

const rootReducer = combineReducers({
  plantsList: PlantReducer,
  loadingReducer: LoadingReducer
})

export default rootReducer;
