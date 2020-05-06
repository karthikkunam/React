import { combineReducers } from 'redux'
import { STORE_ORDER_ERRORS, HOME, 
  FETCH_ORDER_HISTORY_BY_VENDOR_START,
  FETCH_ORDER_HISTORY_BY_VENDOR_SUCCESS,
  FETCH_ORDER_HISTORY_BY_VENDOR_FAILED,
  TRANSMIT_DELIVERY_SCHEDULE, 
  DSD_VENDOR_FETCH_ORDER_DETAILS_SUCCESS,
  DSD_VENDOR_FETCH_ORDER_DETAILS_START,
  DSD_VENDOR_FETCH_ORDER_DETAILS_FAILED, 
  DSD_VENDOR_SET_SELECTED_ORDERS, 
  DSD_VENDOR_SET_CURRENT_INDEX} from '../constants/ActionTypes'
import _ from 'lodash';

const INITIAL_STATE = {}

const storeOrderErrors = (state = {}, action) => {
    switch (action.type) {
      case STORE_ORDER_ERRORS:
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

  const orderHistoryVendor = (state = {}, action) => {
    switch (action.type) {
      case FETCH_ORDER_HISTORY_BY_VENDOR_SUCCESS:
        return {
          ...state,
          isLoading:false, 
          ...action
        }
        case FETCH_ORDER_HISTORY_BY_VENDOR_START:
        return {
          ...INITIAL_STATE,
          isLoading:true,
          ...action
        }
        case FETCH_ORDER_HISTORY_BY_VENDOR_FAILED:
        return {
          ...state,
          isLoading:false,
          ...action
        }
      case DSD_VENDOR_SET_SELECTED_ORDERS: {
        const orders = action.payload || []; 
        return { 
          ...state, 
          selectedOrders: orders,
         
        }
      }
      case DSD_VENDOR_SET_CURRENT_INDEX: { 
        return { 
          ...state, 
          currentIndex: action.payload
        }
      }
      case DSD_VENDOR_FETCH_ORDER_DETAILS_SUCCESS: {
        const query = action.payload.query || [];
        const key = query.join('-');
        return { 
          ...state,
          isLoading:false,
          orders: {
            ...state.orders, [key]: { isLoading:false, ..._.get(action.payload, 'data.data.body[0]')}
          }
        }
      }
      case DSD_VENDOR_FETCH_ORDER_DETAILS_START: {
        const query = action.payload.query || [];
        const key = query.join('-');
        return { 
          ...state,
          isLoading:true,
          orderDetails: {
            ...state.orderDetails, [key]: {isLoading:true, data:[] }
          }
        }
      }
      case DSD_VENDOR_FETCH_ORDER_DETAILS_FAILED: {
        const query = action.payload.query || [];
        const key = query.join('-');
        return { 
          ...state,
          isLoading:false,
          orderDetails: {
            ...state.orderDetails, [key]: {isLoading:false, error: action.payload.error}
          }
        }
      }
      case HOME:
        return INITIAL_STATE; 
      default:
        return state
    }
  }

  const transmitDeliverySchedule = (state = {}, action) => {
    switch (action.type) {
      case TRANSMIT_DELIVERY_SCHEDULE:
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
    storeOrderErrors,
    orderHistoryVendor,
    transmitDeliverySchedule
})
