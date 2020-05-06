import { combineReducers } from 'redux'
import { STORE_PROFILE, STORE_SELECTED, ERROR_MESSAGE, STORE_FUNCTION, HOME } from '../constants/ActionTypes'

const INITIAL_STATE = {}
const getStoreProfile = (state = {}, action) => {
      switch (action.type) {
        case STORE_PROFILE:
          return {
            ...state,
            ...action
          }
        case HOME:
            return INITIAL_STATE;   
        default:
          return state
      }
}

export const getStoresList = state => {
  let storeInfo = [];
  for (let [key, store] of Object.entries(state.getStores)) {
    storeInfo.push({
      key,
      id: store.storeId,
      title: store.name
    });
  }
  return storeInfo;
}

const storeSelected = (state = {}, action) => {
  switch (action.type) {
    case STORE_SELECTED:
      return {
        ...state,
        ...action
      }
    case HOME:
      return INITIAL_STATE;   
    default:
      return state
  }
}


const storeFunction = (state = {}, action) => {
  switch (action.type) {
    case STORE_FUNCTION:
      return {
        ...state,
        ...action
      }
    case HOME:
        return INITIAL_STATE;   
    default:
      return state
  }
}

const errorMessage = (state = {}, action) => {
  switch (action.type) {
    case ERROR_MESSAGE:
      return {
        ...state,
        ...action
      }
    case HOME:
        return INITIAL_STATE;   
    default:
      return state
  }
}

export default combineReducers({
  getStoreProfile,
  storeSelected,
  errorMessage,
  storeFunction
})