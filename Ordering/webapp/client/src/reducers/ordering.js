import { combineReducers } from 'redux'
import { 
  ORDERING_CATEGORY_DETAILS, 
  SINGLE_DAY,GR_RECAP,
  ORDERING_CONTINUE_BUTTON,
  ORDERING_SELECTED_LINK,
  ORDER_BY_VENDOR,
  SELECTED_ITEMS_QTY,
  SUBMIT_ORDER, 
  MULTI_DAY,
  NON_DAILY,
  INPUT_ITEM_QNTY,
  NOTIFICATION_DATE,
  TREND_BOX,
  ORDER_REMAINING_ITEMS,
  GR_VENDOR_LIST,
  TREND_DETAILS_AT_GROUP_LEVEL,
  ADD_TO_MODIFIED_LIST,
  DEDUCT_FROM_MODIFIED_LIST,
  HOME,
  ORDERING_STATUS,
  AVAILABILITY_CHECK,
  SYSTEM_STATUS,
  ORDER_CYCLE_TYPE,
  PANNEL_OPENNER,
  GR_STATUS,
  ITEM_DETAIL_STATUS
} from '../constants/ActionTypes'

const INITIAL_STATE = {};
const INITIAL_ARRAY_STATE = [];


const getGrRecapData = (state = {}, action) => {

  switch (action.type) {
    case GR_RECAP: 
      return Object.assign({}, state, { GR_RECAP: action.payload });
      case GR_VENDOR_LIST: 
      return Object.assign({}, state, { GR_VENDOR_LIST: action.payload });
    case ORDERING_SELECTED_LINK:
        if(action.payload !== "GR"){
          return INITIAL_STATE;  
        }
        /* falls through */
    case HOME:
      return INITIAL_STATE;  
    default:
      return state
  }
}

  const getOrderingCategoryDetails = (state = {}, action) => {
    switch (action.type) {
      case ORDERING_CATEGORY_DETAILS:
        return {
          ...state,
          ...action
        }
        case ORDERING_SELECTED_LINK:
            if(action.payload !== "Ordering"){
              return INITIAL_STATE;  
            }
            /* falls through */
        case HOME:
            return INITIAL_STATE; 
      default:
        return state
    }
  }

  const getOrderingStatus = (state = {}, action) => {
    switch (action.type) {
      case ORDERING_STATUS:
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

  const getItemDetailStatus = (state = {}, action) => {
    switch (action.type) {
        case ITEM_DETAIL_STATUS+"SINGLE_DAY": 
          return Object.assign({}, state, { SINGLE_DAY: action.payload });
        case ITEM_DETAIL_STATUS+"MULTI_DAY": 
          return Object.assign({}, state, { MULTI_DAY: action.payload });
        case ITEM_DETAIL_STATUS+"NON_DAILY": 
          return Object.assign({}, state, { NON_DAILY: action.payload });
        case HOME:
            return INITIAL_STATE; 
      default:
        return state
    }
  }

  const getGRStatus = (state = {}, action) => {
    switch (action.type) {
      case GR_STATUS:
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

  const currentOrderCycleType = (state = {}, action) => {
    switch (action.type) {
      case ORDER_CYCLE_TYPE:
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

  const getAvailabilityCheck = (state = {}, action) => {
    switch (action.type) {
      case AVAILABILITY_CHECK:
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

  const getSystemStatus = (state = {}, action) => {
    switch (action.type) {
      case SYSTEM_STATUS:
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

  const getOrderByVendorDetails = (state = {}, action) => {
    switch (action.type) {
      case ORDER_BY_VENDOR:
        return {
          ...state,
          ...action
        }
      case ORDERING_SELECTED_LINK:
          if(action.payload !== "Ordering"){
            return INITIAL_STATE;  
          }
          /* falls through */
        case HOME:
            return INITIAL_STATE; 
      default:
        return state
    }
  }

  const orderingContiueButton = (state = {}, action) => {
    switch (action.type) {
      case ORDERING_CONTINUE_BUTTON:
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

  const orderingSelectedLink = (state = {}, action) => {
    switch (action.type) {
      case ORDERING_SELECTED_LINK:
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

  const orderingItemQty = (state = {}, action) => {
    switch (action.type) {
      case SELECTED_ITEMS_QTY:
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

  const getItemDetailsForSelectedCategory = (state = {}, action) => {
    switch (action.type) {
      case SINGLE_DAY: 
        return Object.assign({}, state, { SINGLE_DAY: action.payload });
        case MULTI_DAY: 
        return Object.assign({}, state, { MULTI_DAY: action.payload });
        case NON_DAILY: 
        return Object.assign({}, state, { NON_DAILY: action.payload });
      case HOME:
          return INITIAL_STATE;   
      default:
        return state
    }
  }

  const submitOrderByGroup = (state = {}, action) => {
    switch (action.type) {
      case SUBMIT_ORDER:
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

  const inputItmQnty = (state = {}, action) => {
    switch (action.type) {
      case INPUT_ITEM_QNTY:
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

  const notificationDate = (state = {}, action) => {
    switch (action.type) {
      case NOTIFICATION_DATE:
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

  const trendBox = (state = {}, action) => {
    switch (action.type) {
      case TREND_BOX:
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

  const orderingRemainingItems = (state = {}, action) => {
    switch (action.type) {
      case ORDER_REMAINING_ITEMS:
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

  const groupLevelTrendDetails = (state = {}, action) => {
    switch (action.type) {
      case TREND_DETAILS_AT_GROUP_LEVEL:
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

  const modifiedItems = (state = [], action) => {
    switch (action.type) {
      case ADD_TO_MODIFIED_LIST:
        let index = state.findIndex(el => el.itemId === action.payload.itemId);
        if(index === -1){
          return [...state, action.payload];
        } else {
          let newState = [...state];
          newState.splice(newState.findIndex(stateItem => stateItem.itemId === action.payload.itemId ), 1);        
          return [...newState,action.payload]
        }
      case DEDUCT_FROM_MODIFIED_LIST:
          let newState = [...state];
          action.payload.forEach(item => {
            newState.splice(newState.findIndex(stateItem => stateItem.itemId === item.itemId ), 1)        
          })
        return newState;
      case HOME:
        return INITIAL_ARRAY_STATE;   
    default:
      return state
    }
  }

  const panelOpener = (state = {}, action) => {
    switch (action.type) {
      case PANNEL_OPENNER:
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
    getGrRecapData,
    getItemDetailsForSelectedCategory,
    getOrderingCategoryDetails,
    orderingContiueButton,
    orderingSelectedLink,
    orderingItemQty,
    getOrderByVendorDetails,
    submitOrderByGroup,
    inputItmQnty,
    notificationDate,
    trendBox,
    orderingRemainingItems,
    groupLevelTrendDetails,
    modifiedItems,
    getOrderingStatus,
    getSystemStatus,
    getAvailabilityCheck,
    currentOrderCycleType,
    panelOpener,
    getGRStatus,
    getItemDetailStatus
  })

