import { combineReducers } from 'redux'
import { 
  REPORTING_DETAILS, 
  REPORTING_VENDOR_DETAILS,
  REPORTING_ITEM_DETAILS,
  SELECTED_REPORTING_DATA, 
  HOME,
  REPORTING_PREVIOUS, 
  SINGLE_DAY, 
  MULTI_DAY, 
  NON_DAILY,
  NON_DAILY_VENDOR,
  GR,
  REPORT_GR,
  REPORTING_CYCLES_SELECTED,
  RESET_REPORTING_DETAIL_DATA,
  REPORTING_ITEM_DETAILS_DATE
 } from '../constants/ActionTypes'

const INITIAL_STATE = {}

const reportingData = (state = {}, action) => {
  switch (action.type) {
    case REPORTING_DETAILS: 
      return Object.assign({}, state, { reportingDetails: action.payload });
    case REPORTING_VENDOR_DETAILS: 
      return Object.assign({}, state, { reportingVendorDetails: action.payload });
    // case REPORTING_ITEM_DETAILS: 
    //   return Object.assign({}, state, { reportingItemDetails: action.payload });
    case REPORTING_ITEM_DETAILS_DATE: 
      return Object.assign({}, state, { reportingItemDetails: action.payload });
    case SELECTED_REPORTING_DATA: 
      return Object.assign({}, state, { selectedReportingData: action.payload });
    case REPORTING_PREVIOUS: 
      return Object.assign({}, state, { previousPage: action.payload });
    case REPORTING_CYCLES_SELECTED: 
      return Object.assign({}, state, { orderCycles: action.payload });
    case HOME:
        return INITIAL_STATE;   
    default:
      return state
  }
}

const reportingItemDetails = (state = {}, action) => {
  switch (action.type) {
    case `${REPORTING_ITEM_DETAILS}-${SINGLE_DAY}`: 
      return Object.assign({}, state, { singleDay: action.payload });
    case `${REPORTING_ITEM_DETAILS}-${MULTI_DAY}`: 
      return Object.assign({}, state, { multiDay: action.payload });    
    case `${REPORTING_ITEM_DETAILS}-${NON_DAILY}`: 
      return Object.assign({}, state, { nonDaily: action.payload });    
    case `${REPORTING_ITEM_DETAILS}-${GR}`: 
      return Object.assign({}, state, { [GR]: action.payload });
      case `${REPORTING_ITEM_DETAILS}-${NON_DAILY_VENDOR}`: 
      return Object.assign({}, state, { [NON_DAILY_VENDOR]: action.payload });  
    case RESET_REPORTING_DETAIL_DATA: 
      return INITIAL_STATE;
    case HOME:
        return INITIAL_STATE;   
    default:
      return state
  }
}

const reportingItemDetailsDate= (state = {}, action) => {
  switch (action.type) {
    case `${REPORTING_ITEM_DETAILS_DATE}-${SINGLE_DAY}`: 
      return Object.assign({}, state, { singleDay: action.payload });
    case `${REPORTING_ITEM_DETAILS_DATE}-${MULTI_DAY}`: 
      return Object.assign({}, state, { multiDay: action.payload });    
    case `${REPORTING_ITEM_DETAILS_DATE}-${NON_DAILY}`: 
      return Object.assign({}, state, { nonDaily: action.payload }); 
    case `${REPORTING_ITEM_DETAILS_DATE}-${GR}`: 
      return Object.assign({}, state, { [GR]: action.payload });   
    case `${REPORTING_ITEM_DETAILS_DATE}-${REPORT_GR}`: 
      return Object.assign({}, state, { [REPORT_GR]: action.payload });
      case `${REPORTING_ITEM_DETAILS_DATE}-${NON_DAILY_VENDOR}`: 
      return Object.assign({}, state, { [NON_DAILY_VENDOR]: action.payload });  
    case RESET_REPORTING_DETAIL_DATA: 
      return INITIAL_STATE;
    case HOME:
        return INITIAL_STATE;   
    default:
      return state
  }
}

export default combineReducers({
    reportingData,
    reportingItemDetails,
    reportingItemDetailsDate
})
