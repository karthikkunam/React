import { cycleTypes } from '../../constants/ActionTypes';
import { calculateCarryOverForLD1, calculateCarryOverForLD2, calculateCarryOverForLD2SH3 } from './calculateCarryOverMultiDay';
import { calculateInventory } from './calculateInventoryForNonDaily';
import { validateOrderQty as checkIfValueExists } from './validateOrderQty';

export const filterItemsBeforeSubmit = (Items, postMohData) => {
    let ItemsArray = [];
    Items.forEach(item => {
        if (item.untransmittedOrderQty !== "" && typeof item["untransmittedOrderQty"] != 'undefined' && item.untransmittedOrderQty !== null && !item.isStoreOrderBlocked) {
            let itemObj = {};
            itemObj.itemId = item.itemId;
            itemObj.untransmittedOrderQty = parseInt(item.untransmittedOrderQty);
            itemObj.orderWindowEndDate = item.orderWindowEndDate;
            itemObj.orderChangeStatus = "Approved";
            /**This flag sets only for GR!! */
            itemObj.isUserModifiedItemOrderQty = item.isUserModifiedItemOrderQty ? item.isUserModifiedItemOrderQty : false;
            if (cycleTypes['singleDay'] === item.orderCycleTypeCode) {
                itemObj.todaySalesForecastQty = parseInt(item.untransmittedOrderQty);
                /**Post Forecast Details for reporting use */
                itemObj.forecastPeriod1 = (item.forecast) && (item.forecast[0].SALE || 0);
                itemObj.forecastPeriod2 = (item.forecast) && (item.forecast[1].SALE || 0);
                itemObj.forecastPeriod3 = (item.forecast) && (item.forecast[2].SALE || 0);
                itemObj.forecastPeriod4 = (item.forecast) && (item.forecast[3].SALE || 0);
            } else if (cycleTypes['multiDay'] === item.orderCycleTypeCode) {
                itemObj.todaySalesForecastQty = parseInt(item.totalSell);
                itemObj.todayBalanceOnHandQty = parseInt(item.totalExpire);
                itemObj.totalBalanceOnHandQty = parseInt(item.totalUnits);
                itemObj.tomorrowSalesForecastQty = parseInt(item.totalSellWeekly);
                /**Post Forecast Details for reporting use */
                itemObj.forecastPeriod1 = (item.forecast) && (item.forecast.sellDay) && (item.forecast.sellDay[0].SALE || 0);
                itemObj.forecastPeriod2 = (item.forecast) && (item.forecast.sellDay) && (item.forecast.sellDay[1].SALE || 0);
                itemObj.forecastPeriod3 = (item.forecast) && (item.forecast.sellDay) && (item.forecast.sellDay[2].SALE || 0);
                itemObj.forecastPeriod4 = (item.forecast) && (item.forecast.sellDay) && (item.forecast.sellDay[3].SALE || 0);
                /**Post Carry Over details for reporting use */
                if(item.leadTime === 1 && checkIfValueExists(item.totalUnits) && checkIfValueExists(item.totalExpire) && checkIfValueExists(item.totalSell) && checkIfValueExists(item.totalSellWeekly)){
                    itemObj.carryOverInventoryQty = calculateCarryOverForLD1(item);
                }else if((item.leadTime === 2 && item.shelfLife === 2) && checkIfValueExists(item.totalUnits) && checkIfValueExists(item.totalExpire) && checkIfValueExists(item.totalSell) && checkIfValueExists(item.totalSellWeekly)){
                    itemObj.carryOverInventoryQty = calculateCarryOverForLD2(item);  
                }else if((item.leadTime === 2 && item.shelfLife > 2) && checkIfValueExists(item.totalUnits) && checkIfValueExists(item.totalExpire) && checkIfValueExists(item.totalSell) && checkIfValueExists(item.totalSellWeekly)){
                    itemObj.carryOverInventoryQty = calculateCarryOverForLD2SH3(item);  
                }else{
                    itemObj.carryOverInventoryQty = null;
                }
            } else if((cycleTypes['nonDaily'] === item.orderCycleTypeCode) || (cycleTypes['guidedReplenishment'] === item.orderCycleTypeCode)) {
                if(postMohData){
                    itemObj.isMoh = true;
                    itemObj.minimumOnHandQty = checkIfValueExists(item.minimumOnHandQty) ? parseInt(item.minimumOnHandQty) : null;
                    itemObj.isUserModifiedItemOrderQty = false;
                }else{
                    itemObj.tomorrowSalesForecastQty = checkIfValueExists(item.forecastSellQnty) ? parseInt(item.forecastSellQnty) : null;
                    itemObj.totalBalanceOnHandQty = checkIfValueExists(item.totalBalanceOnHandQty) ? parseInt(item.totalBalanceOnHandQty) : null;
                    itemObj.minimumOnHandQty = checkIfValueExists(item.minimumOnHandQty) ? parseInt(item.minimumOnHandQty) : null;
                    itemObj.pendingDeliveryQty = checkIfValueExists(item.pendingDeliveryQty) ? parseInt(item.pendingDeliveryQty) : null;
                    //carryOverInventoryQty is used in reporting(column I=) - multi, non-daily & GR
                    itemObj.carryOverInventoryQty = calculateInventory(item.totalBalanceOnHandQty, item.pendingDeliveryQty);
                    /**Post Forecast Details for reporting use */
                    itemObj.forecastPeriod1 = (item.forecast) && (item.forecast[0].SALE || 0);
                    itemObj.forecastPeriod2 = (item.forecast) && (item.forecast[1].SALE || 0);
                    itemObj.forecastPeriod3 = (item.forecast) && (item.forecast[2].SALE || 0);
                    itemObj.forecastPeriod4 = (item.forecast) && (item.forecast[3].SALE || 0);
                    //Setting this flag to True for any user modified item. Used in GR for updating user edited field
                    itemObj.isUserModifiedItemOrderQty = true;
                }   
            } else { }
            ItemsArray.push(itemObj)
        } else {
            console.log(`Trying to send empty order quantity data for the item: ${item.itemId}`);
        }
    });
    return ItemsArray;
}