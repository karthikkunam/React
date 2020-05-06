export const RECEIVE_WEATHER = 'RECEIVE_WEATHER'
export const LOGIN = 'LOGIN'
export const STORE_PROFILE = 'STORE_PROFILE'
export const STORE_SELECTED = 'STORE_SELECTED'
export const ERROR_MESSAGE = 'ERROR_MESSAGE'
export const STORE_FUNCTION = 'STORE_FUNCTION'
export const GR_RECAP = 'GR_RECAP'
export const ORDERING_CATEGORY_DETAILS = 'ORDERING_CATEGORY_DETAILS'
export const SINGLE_DAY = 'singleDay'
export const MULTI_DAY = 'multiDay'
export const NON_DAILY = 'nonDaily'
export const VENDOR_STRING = "vendor"
export const NON_DAILY_VENDOR = 'nonDailyVendor'
export const ORDERING_CONTINUE_BUTTON = 'ORDERING_CONTINUE_BUTTON'
export const ORDERING_SELECTED_LINK = 'ORDERING_SELECTED_LINK'
export const SELECTED_ITEMS_QTY = 'SELECTED_ITEMS_QTY'
export const ORDER_BY_VENDOR = 'ORDER_BY_VENDOR'
export const GR_VENDOR_LIST = 'GR_VENDOR_LIST'
export const singleDay = "SINGLE_DAY"
export const multiDay = "MULTI_DAY"
export const nonDaily = "NON_DAILY"
export const REPORT_GR = 'gr';
export const GR = "GUIDED REPLENISHMENT"
export const SUBMIT_ORDER = "SUBMIT ORDER"
export const INPUT_ITEM_QNTY = "INPUT_ITEM_QNTY"
export const NOTIFICATION_DATE = "NOTIFICATION_DATE"
export const TREND_BOX = "TREND_BOX"
export const CDC = "CDC"
export const DSD = "DSD"
export const BOH = "BOH"
export const ORDER_REMAINING_ITEMS = "ORDER_REMAINING_ITEMS"
export const SESSION = 'SESSION'
export const TREND_DETAILS_AT_GROUP_LEVEL = "TREND_DETAILS_AT_GROUP_LEVEL"
export const REPORTING_DETAILS = "REPORTING_DETAILS"
export const REPORTING_VENDOR_DETAILS = "REPORTING_VENDOR_DETAILS"
export const REPORTING_ITEM_DETAILS = "REPORTING_ITEM_DETAILS"
export const REPORTING_ITEM_DETAILS_DATE = "REPORTING_ITEM_DETAILS_DATE"
export const SELECTED_REPORTING_DATA = "SELECTED_REPORTING_DATA "
export const HOME = "HOME"
export const STORE_ORDER_ERRORS = "STORE_ORDER_ERRORS"
export const ORDER_HISTORY_BY_VENDOR = "ORDER_HISTORY_BY_VENDOR"
export const MESSAGE = 'MESSAGE';
export const TRANSMIT_DELIVERY_SCHEDULE = "TRANSMIT_DELIVERY_SCHEDULE"
export const SINGLE_DAY_REPORTING = 'daily fresh foods'
export const OTHER = 'daily-other'
export const REPORTING_PREVIOUS = "REPORTING_PREVIOUS"
export const REPORTING_CYCLES_SELECTED = "REPORTING_CYCLES_SELECTED"
export const RESET_REPORTING_DETAIL_DATA = "RESET_REPORTING_DETAIL_DATA"
export const ADD_TO_MODIFIED_LIST = "ADD_TO_MODIFIED_LIST"
export const DEDUCT_FROM_MODIFIED_LIST = "DEDUCT_FROM_MODIFIED_LIST"

export const FETCH_ORDER_HISTORY_BY_VENDOR_START = "ORDER_HISTORY_BY_VENDOR_START"
export const FETCH_ORDER_HISTORY_BY_VENDOR_SUCCESS = "ORDER_HISTORY_BY_VENDOR_SUCCESS"
export const FETCH_ORDER_HISTORY_BY_VENDOR_FAILED = "ORDER_HISTORY_BY_VENDOR_FAILED"
export const DSD_VENDOR_SET_SELECTED_ORDERS = "DSD_VENDOR_SET_SELECTED_ORDERS";
export const DSD_VENDOR_FETCH_ORDER_DETAILS_START = "DSD_VENDOR_FETCH_ORDER_DETAILS_START";
export const DSD_VENDOR_FETCH_ORDER_DETAILS_SUCCESS = "DSD_VENDOR_FETCH_ORDER_DETAILS_SUCCESS";
export const DSD_VENDOR_FETCH_ORDER_DETAILS_FAILED = "DSD_VENDOR_FETCH_ORDER_DETAILS_FAILED";
export const DSD_VENDOR_SET_CURRENT_INDEX = "DSD_VENDOR_SET_CURRENT_INDEX";
export const USER_ACTIVITY = "USER_ACTIVITY";

export const APPROVED_STATUS = "Approved";
export const ORDERING_STATUS = "ORDERING_STATUS"
export const ITEM_DETAIL_STATUS = "ITEM_DETAIL_STATUS"
export const GR_STATUS = "GR_STATUS"
export const SYSTEM_STATUS = "SYSTEM_STATUS"
export const AVAILABILITY_CHECK = "AVAILABILITY_CHECK"
export const ORDER_CYCLE_TYPE = "ORDER_CYCLE_TYPE"
export const PANNEL_OPENNER = "PANNEL_OPENNER"
export const HISTORY = "HISTORY"

export const IMAGE_KEY = "722852f45616a6ecdd7319061179bdc32fccd4dfa3cec451ccbfe3cbac7ece"

export const START_PROMOTION = 'STARTING PROMO';
export const ON_PROMOTION = 'ON PROMO';
export const END_PROMOTION = 'ENDING PROMO';

export const cycleTypes = {
    singleDay: 'DAILY FRESH FOODS',
    singleDayCode: 'D',
    multiDay: 'DAILY-OTHER',
    multiDayCode: 'O',
    nonDaily: 'NON-DAILY',
    nonDailyCode: 'N',
    guidedReplenishment: 'GUIDED REPLENISHMENT',
    guidedReplenishmentCode: 'G'
}

export const routeCycleTypes = {
    singleday: "SINGLE_DAY",
    multiday: "MULTI_DAY",
    nondaily: "NON_DAILY"
}

export const sortingUtil = {
    propertyListSorting: {
        "sortCriteriaNewItem": [{ "value": "itemStatus", "sortOrder": "DESC" }, { "value": "itemShortName", "sortOrder": "ASC" }],
        "sortCriteriaShelfItem": [{ "value": "shelfSequenceNumber", "sortOrder": "ASC" }, { "value": "itemShortName", "sortOrder": "ASC" }],
        "sortCriteriaNonShelfItem": [{ "value": "shelfSequenceNumber", "sortOrder": "ASC" }, { "value": "itemShortName", "sortOrder": "ASC" }]
    }

}

export const CYCLETYPES_TO_CODE_MAPPING = (type) => {
    if (type.toUpperCase() === cycleTypes.singleDay) {
        return cycleTypes.singleDayCode;
    }
    else if (type.toUpperCase() === cycleTypes.multiDay) {
        return cycleTypes.multiDayCode;
    } else if (type.toUpperCase() === cycleTypes.nonDaily) {
        return cycleTypes.nonDailyCode;
    } else if (type.toUpperCase() === cycleTypes.guidedReplenishment) {
        return cycleTypes.nonDailyCode;
    }
}

export const DSD_VENDOR = 'DSD';
export const CDC_VENDOR = 'CDC';
export const GR_EXTENSION = ' - GR';