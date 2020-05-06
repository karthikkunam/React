import * as types from '../constants/ActionTypes'
import { filterItemsBeforeSubmit } from '../components/utility/filterItemBeforeSubmit';
import { processDataAndSend, processVendorDataAndSend } from '../components/utility/saga'
import { itemGroupByCategory, RemoveDuplicateRequestParams } from '../components/utility/itemGroupByCategory';
import { getOrderDate } from '../components/utility/getOrderDate';
import _ from 'lodash';
import DateHelper from '../components/utility/DateHelper';
import { generateTrendDataForEachItem, aggregateItemDetailsAndTrendData } from '../components/utility/reportingUtil';
import { generateTrendRequestDetails } from '../components/utility/getItems';
import BffRoute from '../api/default/bffRoute';
import BffV1Route from '../api/v1/bffV1Route';
import { storeDetails } from '../lib/storeDetails';
// import TestLocal from '../api/default/testLocal'
// import { customizedgrData } from '../components/utility/sortGrData';

const orderDate = getOrderDate(new Date());

export const LoginReducer = payload => {
  return (dispatch) => {
    dispatch({
      type: types.LOGIN,
      payload
    })
  }
}

export const currentOrderCycle = payload => {
  return (dispatch) => {
    dispatch({
      type: types.ORDER_CYCLE_TYPE,
      payload
    })
  }
}

export const storeSelectedReducer = payload => {
  return (dispatch) => {
    dispatch({
      type: types.STORE_SELECTED,
      payload
    })
  }
}

export const itemSelectedQty = payload => {
  return (dispatch) => {
    dispatch({
      type: types[payload.OrderingCycleType],
      payload: payload.selectedItems
    })

  }
}

export const action = payload => {
  return (dispatch) => {
    dispatch({
      type: types[payload.type],
      payload: payload.data
    })

  }
}

export const submitOrderByGroup = payload => {
  return (dispatch) => {
    dispatch({
      type: types.SUBMIT_ORDER,
      payload
    })
  }
}


export const orderingSelectedLink = payload => {
  return (dispatch) => {
    dispatch({
      type: types.ORDERING_SELECTED_LINK,
      payload
    })
  }
}

export const orderingContinueButton = payload => {
  return (dispatch) => {
    dispatch({
      type: types.ORDERING_CONTINUE_BUTTON,
      payload
    })
  }
}

export const storeSelectedFunction = payload => {
  return (dispatch) => {
    dispatch({
      type: types.STORE_FUNCTION,
      payload
    })
  }
}

export const highlightSelectedTrendBox = payload => {
  return (dispatch) => {
    dispatch({
      type: types.TREND_BOX,
      payload
    })
  }
}

export const messageData = payload => {
  return (dispatch) => {
    dispatch({
      type: types.MESSAGE,
      payload
    });
  }
}

/** All Ordering Info */
export const getOrderingDetails = (storeId) => async dispatch => {
  dispatch({
    type: types.ORDERING_STATUS,
    payload: "PENDING"
  })
  await BffV1Route().get(`stores/${storeId}/ordering/dailyorders/ordercycle/${DateHelper().orderBatchDate}/counts`, {}).then((response) => {
      const resultSet = processDataAndSend(response, storeId);
      dispatch({
        type: types.ORDERING_CATEGORY_DETAILS,
        payload: resultSet
      })
      dispatch({
        type: types.ORDERING_STATUS,
        payload: "COMPLETE"
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.ERROR_MESSAGE,
        payload: error
      });
      dispatch({
        type: types.ORDERING_STATUS,
        payload: "NETWORK_ERROR"
      })
    })
}

/** All Ordering BOH Info */
export const postOrderingBOHDetails = (storeId, bohObject, transactionType) => async dispatch => {
  await BffRoute().put(`/stores/${storeId}/inventory/sync/${transactionType}`, bohObject).then((response) => {
      dispatch({
        type: types.BOH,
        payload: response.data
      })
    })
    .catch(function (error) {
      //  dispatch({type: types.ERROR_MESSAGE, payload: error});
    })
}

/**System Availability Check for Ordering */
export const getSystemAvailabilityStatus = (storeId, history) => async dispatch => {
  await BffRoute().get(`stores/${storeId}/ordering/availability`).then((response) => {
      dispatch({
        type: types.SYSTEM_STATUS,
        payload: response
      })
      let data = response.data.body[0];
      //console.log("data in UI", data, data.isServiceUp);
      if (data.isOrderBatchRunning === false && data.isSystemAvailable === true && data.isServiceUp === true) {
        dispatch({
          type: types.AVAILABILITY_CHECK,
          payload: "SYSTEM_AVAILABLE"
        });
        //window.location.href = 'ordering';
        history.push(`ordering`);

      } else if (data.isOrderBatchRunning === true || data.isSystemAvailable === false || data.isServiceUp === false) {
        dispatch({
          type: types.AVAILABILITY_CHECK,
          payload: "SYSTEM_DOWN_FOR_MAINTENANCE"
        });
      } else if (typeof (data) === 'undefined' || Object.keys(data).length === 0) {
        dispatch({
          type: types.AVAILABILITY_CHECK,
          payload: "SYSTEM_DOWN_FOR_MAINTENANCE"
        });
      } else if (data.isServiceUp === true) {
        dispatch({
          type: types.AVAILABILITY_CHECK,
          payload: "SYSTEM_AVAILABLE"
        });
        // window.location.href = 'ordering';
        history.push(`ordering`);

      } else {}
    })
    .catch(function (error) {
      dispatch({
        type: types.ERROR_MESSAGE,
        payload: error
      });
      dispatch({
        type: types.AVAILABILITY_CHECK,
        payload: "SYSTEM_DOWN_FOR_MAINTENANCE"
      });
    })
}

export const getOrderingStatus = (payload) => {
  return (dispatch) => {
    dispatch({
      type: types.ORDERING_STATUS,
      payload: payload
    })
  }
}

/** All Ordering vendor Info : DEPRECATED CURRENTLY AS OFF 10/12... NOT USING ANY MORE --> NEED TO USE LATER CORRECTLY (POST MVP) --> Sai Manikanta G*/
export const getOrderByVendorDetails = (storeId) => async dispatch => {
  /**To Do: API call to fetch item details */
  await BffV1Route().get(`stores/${storeId}/ordering/dailyorders/vendors/${DateHelper().orderBatchDate}/counts`, {}).then((response) => {
      const finalresult = processVendorDataAndSend(response);
      dispatch({
        type: types.ORDER_BY_VENDOR,
        payload: finalresult
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.ERROR_MESSAGE,
        payload: error
      });
    })
}


export const getStoreProfileDetails = () => async dispatch => {
  await BffRoute().get('/store/profiles').then((response) => {
      dispatch({
        type: types.STORE_PROFILE,
        payload: response.data
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.ERROR_MESSAGE,
        payload: error
      });
    })
}


/*** ---------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ALL ORDERING FLOW CALLS HERE i.e. DAILY ORDER DETAILS CALL. 
 * NOTE: Currently both Vendors and Regaular Groups calls are handled by below single function itself. 
 * Future: May need to change the vendor call seperately and groups call seperately.
 * 
 */
/** All Item Detail Info */
export const getItemDetailsByOrderCycle = (storeId, ItemDetailData, isCarried, timeZone, orderCycle, orderRemainingItems, orrderByVendor) => async dispatch => {
  dispatch({
    type: types[orderCycle],
    payload: null
  });
  let finalQueryParams = {};
  let vendorQueryParams = {};
  let registrationStatusParams = {};
  let CDCOnly = {};
  if (ItemDetailData.ordergroupcode && (ItemDetailData.ordergroupcode).length) {
    finalQueryParams = {
      ...finalQueryParams,
      ordergroupcode: RemoveDuplicateRequestParams(ItemDetailData.ordergroupcode.join()),
    }
  }
  if (ItemDetailData.cat && (ItemDetailData.cat).length) {
    finalQueryParams = {
      ...finalQueryParams,
      cat: RemoveDuplicateRequestParams(ItemDetailData.cat.join()),
    }
  }
  if (ItemDetailData.psa && (ItemDetailData.psa).length) {
    finalQueryParams = {
      ...finalQueryParams,
      psa: RemoveDuplicateRequestParams(ItemDetailData.psa.join()),
    }
  }
  if (ItemDetailData.merchandisevendorCode && (ItemDetailData.merchandisevendorCode).length) {
    vendorQueryParams = {
      ...vendorQueryParams,
      merchandisevendorcode: RemoveDuplicateRequestParams(ItemDetailData.merchandisevendorCode.join()),
      merchandisevendorgroupcode: 'DSD'
    }
  }
  if (isCarried) {
    registrationStatusParams = {
      ...registrationStatusParams,
      registrationStatus: "Carry"
    }
  }
  if ((orrderByVendor || orrderByVendor === 'true') && !(ItemDetailData.merchandisevendorCode && (ItemDetailData.merchandisevendorCode).length)) {
    CDCOnly = {
      ...CDCOnly,
      merchandisevendorgroupcode: 'CDC'
    }
  }
  let APIData = [];
  if (finalQueryParams && !_.isEmpty(finalQueryParams)) {

    dispatch({
      type: types.ITEM_DETAIL_STATUS + orderCycle,
      payload: "PENDING"
    })
    await BffRoute().get(`/stores/${storeId}/ordering/orderdetails/${DateHelper().orderBatchDate}`, {
      params: {
        ordercycletypecode: ItemDetailData.orderCycleTypeName,
        timeZone: timeZone,
        orderremaining: ItemDetailData.itemAggregates > 0 ? orderRemainingItems : false,
        ...finalQueryParams,
        ...registrationStatusParams,
        ...CDCOnly
      }
    }).then((response) => {
      APIData = [...APIData, ...response.data.body];
      dispatch({
        type: types[orderCycle],
        payload: APIData
      })
      dispatch({
        type: types.ITEM_DETAIL_STATUS + orderCycle,
        payload: "COMPLETE"
      })
    }).catch(function (error) {
      dispatch({
        type: types[orderCycle],
        payload: []
      });
      dispatch({
        type: types.ITEM_DETAIL_STATUS + orderCycle,
        payload: "NETWORK_ERROR"
      })
    })
  }

  if (vendorQueryParams && !_.isEmpty(vendorQueryParams)) {

    dispatch({
      type: types.ITEM_DETAIL_STATUS + orderCycle,
      payload: "PENDING"
    })
    await BffRoute().get(`/stores/${storeId}/ordering/orderdetails/${DateHelper().orderBatchDate}`, {
      params: {
        ordercycletypecode: ItemDetailData.orderCycleTypeName,
        timeZone: timeZone,
        orderremaining: ItemDetailData.itemAggregates > 0 ? orderRemainingItems : false,
        ...vendorQueryParams,
        ...registrationStatusParams,
        ...CDCOnly
      }
    }).then((response) => {
      APIData = [...APIData, ...response.data.body];
      dispatch({
        type: types[orderCycle],
        payload: APIData
      })
      dispatch({
        type: types.ITEM_DETAIL_STATUS + orderCycle,
        payload: "COMPLETE"
      })
    }).catch(function (error) {
      dispatch({
        type: types[orderCycle],
        payload: []
      });
      dispatch({
        type: types.ITEM_DETAIL_STATUS + orderCycle,
        payload: "NETWORK_ERROR"
      })
    })

  }
}

/*** ---------------------------------------------------------------------------------------------------------------------------------------------------------------
 * SUBMIT ORDERS (POST ORDERS API)
 * 
 */
export const postOrderDetails = (itemsData) => async dispatch => {
  if (itemsData.Items && itemsData.Items.length > 0) {
    const itemDetails = filterItemsBeforeSubmit(itemsData.Items, itemsData.postMohData);
    if (itemDetails && itemDetails.length > 0) {
      await BffRoute().put(`stores/${itemsData.storeId}/submit-order`, filterItemsBeforeSubmit(itemsData.Items, itemsData.postMohData)).then((response) => {
          console.log("submit complete", response);
        })
        .catch(function (error) {
        });
    } else {
      console.log(`Trying to send empty order quantity data for items, hence rejecting it!`);
      return 'Sending empty order quantity data for item list, hence was rejected!';
    }
  } else {
    console.log(`Submit API has no data to process!`);
    return 'Nothing to submit!';
  }
}



/*** ---------------------------------------------------------------------------------------------------------------------------------------------------------------
 * TRENDS *** THIS IS JUST A SUPPORTING FUNCTION (COMMON UTILITY)
 * 
 */
const trendsAPICall = async (storeId, itemDetails, ordercycletype, orderDate) => {
  const trendResponse = await BffRoute().post(`/stores/${storeId}/items/trends`, {
    items: itemDetails,
    isCarried: false,
    orderRemainingItems: false,
    storeId: storeId,
    timezone: storeDetails().timeZone,
    orderCycleTypeCode: types.CYCLETYPES_TO_CODE_MAPPING(ordercycletype),
    orderDate: orderDate,
    propertyListSorting: types.sortingUtil.propertyListSorting
  });
  if (trendResponse && trendResponse.data && trendResponse.data.body) {
    return trendResponse.data.body
  } else {
    return [{
      message: "Some Issue occured with trends API call"
    }];
  }
}


export const getItemTrendAtGroupLevel = (data, storeId) => async dispatch => {
  /** TO DO: Integrate with BFF*/
  await BffRoute().post(`stores/${storeId}/categories/trends`, {
      storeId: storeId,
      orderDate: DateHelper().orderBatchDate,
      ordercycletypecode: types.cycleTypes[data.orderCycleTypeCode],
      timeZone: data.timeZone,
      categories: itemGroupByCategory(data.Items, true)
    }).then((response) => {
      dispatch({
        type: types.TREND_DETAILS_AT_GROUP_LEVEL,
        payload: response.data.body
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.ERROR_MESSAGE,
        payload: error
      });
    })

}


/*** ---------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Weather DATA API Call
 * 
 */
export const getWeatherData = (storeId) => async dispatch => {
  //console.log("getWeatherData", storeId);
  await BffRoute().get(`/stores/${storeId}/weather?forecastLimit=15&observationLimit=30&date=${orderDate}`).then((response) => {
      dispatch({
        type: types.RECEIVE_WEATHER,
        payload: response.data && response.data.weather
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.ERROR_MESSAGE,
        payload: error
      });
    })
}

/*** ---------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ALL GR RELATED API CALLS BELOW
 * 
 */

/** All GR Info */
export const getDataForGr = (storeId) => async dispatch => {
  dispatch({
    type: types.GR_STATUS,
    payload: "PENDING"
  })
  await BffRoute().get(`/stores/${storeId}/ordering/dailyorders/${DateHelper().orderBatchDate}/grrecap`, {}).then((response) => {
      dispatch({
        type: types.GR_RECAP,
        payload: response.data
      })
      dispatch({
        type: types.GR_STATUS,
        payload: "COMPLETE"
      })

    })
    .catch(function (error) {
      dispatch({
        type: types.GR_RECAP,
        payload: []
      });
      dispatch({
        type: types.GR_STATUS,
        payload: "NETWORK_ERROR"
      })
    })
}

export const getGRVendorDetails = (storeId) => async dispatch => {
  dispatch({
    type: types.GR_STATUS,
    payload: "PENDING"
  })
  await BffRoute().get(`/stores/${storeId}/ordering/dailyorders/vendors/${DateHelper().orderBatchDate}/grrecap`, {}).then((response) => {
      dispatch({
        type: types.GR_VENDOR_LIST,
        payload: response.data
      })
      dispatch({
        type: types.GR_STATUS,
        payload: "COMPLETE"
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.GR_VENDOR_LIST,
        payload: {
          CDC: [],
          DSD: []
        }
      });
      dispatch({
        type: types.GR_STATUS,
        payload: "NETWORK_ERROR"
      })
    })
}

/** GR Recalculate */
export const getRecalculateDataForGr = (storeId) => async dispatch => {
  dispatch({
    type: types.GR_STATUS,
    payload: "PENDING"
  })
  await BffV1Route().get(`/stores/${storeId}/ordering/dailyorders/recalculate/${DateHelper().orderBatchDate}`, {
      params: {
        orderCycleTypeCode: 'GUIDED REPLENISHMENT',
        groupBy: "groups"
      }
    }).then((response) => {
      dispatch({
        type: types.GR_RECAP,
        payload: response.data
      })
      dispatch({
        type: types.GR_STATUS,
        payload: "COMPLETE"
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.GR_RECAP,
        payload: []
      });
      dispatch({
        type: types.GR_STATUS,
        payload: "NETWORK_ERROR"
      })
    })
}
export const getGRRecalculateVendorDetails = (storeId) => async dispatch => {
  dispatch({
    type: types.GR_STATUS,
    payload: "PENDING"
  })
  await BffV1Route().get(`/stores/${storeId}/ordering/dailyorders/recalculate/${DateHelper().orderBatchDate}`, {
      params: {
        orderCycleTypeCode: 'GUIDED REPLENISHMENT',
        groupBy: "vendors"
      }
    }).then((response) => {
      dispatch({
        type: types.GR_VENDOR_LIST,
        payload: response.data
      })
      dispatch({
        type: types.GR_STATUS,
        payload: "COMPLETE"
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.GR_VENDOR_LIST,
        payload: {
          CDC: [],
          DSD: []
        }
      });
      dispatch({
        type: types.GR_STATUS,
        payload: "NETWORK_ERROR"
      })
    })
}


/** ---------------------------------------------------------------------------------------------------------------------------------------------------------------
 * 
 * * * STORE FUNCTION API CALLS START HERE
 */

export const getStoreOrderErrorData = (storeId, orderDate) => async dispatch => {
  await BffRoute().get(`/stores/${storeId}/ordering/errors/${getOrderDate(orderDate)}`).then((response) => {
      // await BffRoute().get(`/stores/26809/ordering/errors/2018-12-16`).then((response) => {
      dispatch({
        type: types.STORE_ORDER_ERRORS,
        payload: response.data
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.ERROR_MESSAGE,
        payload: error
      });
    })
}

/** Transmit Delivery Schedule */
export const getTransmitDeliverySchedule = (storeId) => async dispatch => {
  /**To Do: API call to fetch item details */
  dispatch({
    type: types.ORDERING_STATUS,
    payload: "PENDING"
  })
  await BffRoute().get(`stores/${storeId}/ordering/deliverycalendar`, {
      //  params:{
      //    storeId: 36312
      //  }
    }).then((response) => {
      dispatch({
        type: types.TRANSMIT_DELIVERY_SCHEDULE,
        payload: response
      })
      dispatch({
        type: types.ORDERING_STATUS,
        payload: "COMPLETE"
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.TRANSMIT_DELIVERY_SCHEDULE,
        payload: []
      });
      dispatch({
        type: types.ORDERING_STATUS,
        payload: "NETWORK_ERROR"
      })
    })
}


/** Order History By Vendor */
export const getOrderHistory = (storeId) => async dispatch => {
  // dispatch({ type: types.FETCH_ORDER_HISTORY_BY_VENDOR_START });
  await BffRoute().get(`/stores/${storeId}/ordering/history/vendors/counts?merchandiseVendorGroupCode=DSD&numberOfOrders=4`, {}).then((response) => {
      dispatch({
        type: types.FETCH_ORDER_HISTORY_BY_VENDOR_SUCCESS,
        payload: response
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.FETCH_ORDER_HISTORY_BY_VENDOR_FAILED,
        error
      })
      dispatch({
        type: types.FETCH_ORDER_HISTORY_BY_VENDOR_SUCCESS,
        payload: []
      });
    })
}


// DSD by vendor actions
export const dsdSetSelectedOrders = (storeId, selectedItems = []) => async dispatch => {
  dispatch({
    type: types.DSD_VENDOR_SET_SELECTED_ORDERS,
    payload: selectedItems
  });
  dispatch({
    type: types.DSD_VENDOR_SET_CURRENT_INDEX,
    payload: selectedItems.length ? 0 : -1
  });
}

export const dsdUpdateCurrentPageIndex = (index) => async dispatch => {
  await dispatch({
    type: types.DSD_VENDOR_SET_CURRENT_INDEX,
    payload: index
  });
}

export const dsdLoadOrderDetails = (storeId, vendorGroupCode, orderDate) => async (dispatch, state) => {
  const key = `${storeId}-${vendorGroupCode}-${orderDate}`;
  //check if the order is already loaded.
  const order = _.get(state(), `storeFunctions.orderHistoryVendor.orders[${key}]`);
  if (order) {
    return;
  } else {
    dispatch({
      type: types.DSD_VENDOR_FETCH_ORDER_DETAILS_START,
      payload: [storeId, vendorGroupCode, orderDate]
    });
    //http://localhost:3100/services/stores/36312/ordering/history/vendors?merchandiseVendorGroupCode=79986,79099&orderDate=2020-07-21
    await BffRoute().get(`/stores/${storeId}/ordering/history/vendors?merchandiseVendorCode=${vendorGroupCode}&orderDate=${orderDate}`, {}).then((response) => {
        dispatch({
          type: types.DSD_VENDOR_FETCH_ORDER_DETAILS_SUCCESS,
          payload: {
            query: [storeId, vendorGroupCode, orderDate],
            data: response
          }
        })
      })
      .catch(function (error) {
        dispatch({
          type: types.DSD_VENDOR_FETCH_ORDER_DETAILS_FAILED,
          payload: {
            query: [storeId, vendorGroupCode, orderDate],
            error
          }
        })
        dispatch({
          type: types.ERROR_MESSAGE,
          payload: error
        });
      })
  }

}

/** ---------------------------------------------------------------------------------------------------------------------------------------------------------------
 * 
 * * ALL REPORTING RELATED API CALLS AND DETAILS 
 */

export const getReportingItemDetails = (params) => async dispatch => {
  if (params) {
    const {
      psa,
      cat,
      ordercycletype,
      orderDate,
      storeId,
      groupCodes,
      orderCycleType,
      isFirstPage
    } = params;

    let url, dateurl;
    let finalPsa = RemoveDuplicateRequestParams(psa);
    let finalCat = RemoveDuplicateRequestParams(cat);
    let finalordergroupCodes = RemoveDuplicateRequestParams(groupCodes);
    try {

      if (isFirstPage) {
        if (orderCycleType === types.GR) {
          dateurl = `stores/${storeId}/reporting/orderDates/${types.GR}?orderGroupCode=${finalordergroupCodes}&psa=${finalPsa}&cat=${finalCat}`
        } else {
          dateurl = `stores/${storeId}/reporting/orderDates/${ordercycletype}?orderGroupCode=${finalordergroupCodes}&psa=${finalPsa}&cat=${finalCat}`
        }

        const dateItemsResponse = await BffRoute().get(dateurl);
        const dateItems = dateItemsResponse.data.data[0];
        if (dateItems && dateItems.availableDates.length > 0) {
          dispatch({
            type: `${types.REPORTING_ITEM_DETAILS_DATE}-${orderCycleType}`,
            payload: dateItems
          });
         // orderDateTrend = `${dateItems.availableDates[0]}`;
         // url = `stores/${storeId}/reporting/${orderDate}`
        }
      } 
      // else {
      //   orderDateTrend = orderDate;
      //   url = `stores/${storeId}/reporting/${orderDate}`
      // }
      url = `stores/${storeId}/reporting/${orderDate}`
      if (ordercycletype === types.GR) {
        url = url + `/${types.GR}?orderGroupCode=${finalordergroupCodes}&psa=${finalPsa}&cat=${finalCat}`
      } else {
        url = url + `/${ordercycletype}?orderGroupCode=${finalordergroupCodes}&psa=${finalPsa}&cat=${finalCat}`

      }
      const itemDetailsResponse = await BffRoute().get(url);
      const itemDetails = itemDetailsResponse.data.data;
      // const initialResponse = itemDetailsResponse;
      const finalTrendItemDetails = generateTrendRequestDetails(itemDetails);
      // const trendsData = await itemDetails.forEach
      const trendDetails = await trendsAPICall(storeId, finalTrendItemDetails, ordercycletype, orderDate);

      const trendDataMappedWithItemId = generateTrendDataForEachItem(trendDetails, ordercycletype);
      const aggregateItemDetailList = aggregateItemDetailsAndTrendData(trendDataMappedWithItemId, itemDetails);
      dispatch({
        type: `${types.REPORTING_ITEM_DETAILS}-${orderCycleType}`,
        payload: aggregateItemDetailList
      });

    } catch (error) {
      dispatch({
        type: types.ERROR_MESSAGE,
        payload: error
      });
    }
  }
}

export const getReportingItemVendorDetails = (params) => async dispatch => {
  if (params) {
    const {
      psa,
      cat,
      ordercycletype,
      orderDate,
      storeId,
      orderCycleType,
      groupCodes,
      merchandiseVendorCode,
      isFirstPage
    } = params;
    /**
     * Removing unnecessary duplicates from request params strings
     */
    let finalPsa, finalCat, finalMerchVendorCode, finalordergroupCodes, dateurl, url;
    if (isFirstPage) {
      if (merchandiseVendorCode) {
        finalMerchVendorCode = RemoveDuplicateRequestParams(merchandiseVendorCode);
        dateurl = `stores/${storeId}/reporting/orderDates/${ordercycletype}?merchandiseVendorCode=${finalMerchVendorCode}`
      } else {
        finalPsa = RemoveDuplicateRequestParams(psa);
        finalCat = RemoveDuplicateRequestParams(cat);
        finalordergroupCodes = RemoveDuplicateRequestParams(groupCodes);
        dateurl = `stores/${storeId}/reporting/orderDates/${ordercycletype}?orderGroupCode=${finalordergroupCodes}&psa=${finalPsa}&cat=${finalCat}`
      }

      const dateItemsResponse = await BffRoute().get(dateurl);
      const dateItems = dateItemsResponse.data.data[0];
      if (dateItems && dateItems.availableDates.length > 0) {
        dispatch({
          type: `${types.REPORTING_ITEM_DETAILS_DATE}-${orderCycleType}`,
          payload: dateItems
        });
        // orderDateTrend = `${ dateItems.availableDates[0]}`;

        // url = `stores/${storeId}/reporting/vendors/${orderDateTrend}/${ordercycletype}?reporting=true`;
      }
      }
      //  else {
      //   orderDateTrend = orderDate;
      //   url = `stores/${storeId}/reporting/vendors/${orderDate}/${ordercycletype}?reporting=true`;
      // }
      url = `stores/${storeId}/reporting/vendors/${orderDate}/${ordercycletype}?reporting=true`;

    if (merchandiseVendorCode) {
      finalMerchVendorCode = RemoveDuplicateRequestParams(merchandiseVendorCode);
      // const finalMerchVendorCode = RemoveDuplicateRequestParams(merchandiseVendorCode);
      url = url + '&merchandiseVendorCode=' + finalMerchVendorCode
    } else {
      finalPsa = RemoveDuplicateRequestParams(psa);
      finalCat = RemoveDuplicateRequestParams(cat);
      finalordergroupCodes = RemoveDuplicateRequestParams(groupCodes);
      url = url + '&psa=' + finalPsa + '&cat=' + finalCat
    }

    await BffRoute().get(url, {}).then(async (response) => {
        let trendRequestBodyCDC = [];
        let trendRequestBodyDSD = [];
        let finalList = {};
        /**
         * Checking if CDC data exists in response if so, process the data
         */
        if (response.data && response.data.CDC) {
          trendRequestBodyCDC = [...generateTrendRequestDetails(response.data.CDC)];

          const CDCTrendDetails = await trendsAPICall(storeId, trendRequestBodyCDC, types.cycleTypes.nonDailyCode, orderDate);
          const trendDataMappedWithItemIdCDC = generateTrendDataForEachItem(CDCTrendDetails, types.cycleTypes.nonDailyCode);
          const aggregateItemDetailListCDC = aggregateItemDetailsAndTrendData(trendDataMappedWithItemIdCDC, response.data.CDC);

          finalList = {
            ...finalList,
            CDC: aggregateItemDetailListCDC
          };
        }
        /**
         * Checking if DSD data exists in response if so, process the data
         */
        if (response.data && response.data.DSD) {

          trendRequestBodyDSD = [...generateTrendRequestDetails(response.data.DSD)];

          const DSDTrendDetails = await trendsAPICall(storeId, trendRequestBodyDSD, types.cycleTypes.nonDailyCode, orderDate)

          const trendDataMappedWithItemIdDSD = generateTrendDataForEachItem(DSDTrendDetails, types.cycleTypes.nonDailyCode);
          const aggregateItemDetailListDSD = aggregateItemDetailsAndTrendData(trendDataMappedWithItemIdDSD, response.data.DSD);

          finalList = {
            ...finalList,
            DSD: aggregateItemDetailListDSD
          }
        }

        dispatch({
          type: `${types.REPORTING_ITEM_DETAILS}-${orderCycleType}`,
          payload: finalList
        })
      })
      .catch(function (error) {
        dispatch({
          type: types.ERROR_MESSAGE,
          payload: error
        });
      })

  }
}

export const getSelectedReportingData = (seletedData) => async dispatch => {
  dispatch({
    type: types.SELECTED_REPORTING_DATA,
    payload: seletedData
  })
}

export const setReportingPrevious = (from) => async dispatch => {
  dispatch({
    type: types.REPORTING_PREVIOUS,
    payload: from
  })
}


/** All REporting Info */
export const getReportingDetails = (storeId, orderDate) => async dispatch => {
  await BffV1Route().get(`stores/${storeId}/ordering/dailyorders/ordercycle/${getOrderDate(orderDate)}/counts`, {}).then((response) => {
      const resultSet = processDataAndSend(response, storeId);
      dispatch({
        type: types.REPORTING_DETAILS,
        payload: resultSet
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.ERROR_MESSAGE,
        payload: error
      });
    })
}

/** All Reporting Vendor Info */
export const getReportingyVendorDetails = (storeId, orderDate) => async dispatch => {
  /**To Do: API call to fetch item details */
  await BffV1Route().get(`stores/${storeId}/ordering/dailyorders/vendors/${getOrderDate(orderDate)}/counts`, {}).then((response) => {
      const finalresult = processVendorDataAndSend(response);
      dispatch({
        type: types.REPORTING_VENDOR_DETAILS,
        payload: finalresult
      })
    })
    .catch(function (error) {
      dispatch({
        type: types.ERROR_MESSAGE,
        payload: error
      });
    })
}