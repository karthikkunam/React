import { combineReducers } from 'redux'
import { LOGIN } from '../constants/ActionTypes'

const loginData = (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

export default combineReducers({
    loginData
})
