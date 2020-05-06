import { combineReducers } from 'redux'
import { RECEIVE_WEATHER } from '../constants/ActionTypes'

const getWeatherReducer = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_WEATHER:
      return [
        ...action.payload.foreCasts,
        ...action.payload.observations
      ]
    default:
      return state
  }
}

export default combineReducers({
  getWeatherReducer
})
