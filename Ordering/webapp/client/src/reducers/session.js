import { combineReducers } from 'redux'
import { SESSION, MESSAGE, USER_ACTIVITY } from '../constants/ActionTypes'

const sessionData = (state = {}, action) => {
  switch (action.type) {
    case SESSION:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

const messageData = (state = {}, action) => {
  switch (action.type) {
    case MESSAGE:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

const lastUserActivity = (state = {}, action) => {
  switch (action.type) {
    case USER_ACTIVITY:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

export default combineReducers({
    sessionData,
    messageData,
    lastUserActivity
})
