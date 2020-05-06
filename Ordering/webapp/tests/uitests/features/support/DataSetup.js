var rq = require("request-promise");
const moment = require("moment-timezone");
var scope = require("./scope");

//America/Los_Angeles
//America/Chicago
scope.timeZone = "America/Chicago";
console.log("Time Zone - " + scope.timeZone);
var time = moment().tz(scope.timeZone).format("HH");

if(time >= 10 ) {
    var today = moment().add(1, "days").format("YYYY-MM-DD");
} else {
    today = moment().format("YYYY-MM-DD");
}

async function GetSingleDayItemDetails(itemName) {
    const response = await rq({
        "method": "GET",
        "uri":  scope.API + "/stores/" + scope.StoreNumber + "/ordering/dailyorders/"+ today +"?ordercycletypecode=DAILY+FRESH+FOODS&orderremaining=false",
        "json": true,
        "resolveWithFullResponse": true,
        "headers": {
            Connection: "keep-alive",
            "x-api-key": scope.APIKEY,
            "Content-Type": "application/json" } 
    });

    var Details = {
    };

    if (response.body) {
        response.body.forEach(function (Item) {
            if (Item.itemShortName == itemName || Item.itemName == itemName) {
                Details["itemShortName"] = Item.itemShortName;
                Details["itemLongName"] = Item.itemName;
                Details["UPC"] = Item.itemUPC;
                Details["itemId"] = Item.itemId;
                Details["ldu"] = Item.ldu;
                Details["minimumAllowableOrderQty"] = Item.minimumAllowableOrderQty;
                Details["maximumAllowableOrderQty"] = Item.maximumAllowableOrderQty;
                Details["storeRank"] = Item.storeRank;
                Details["marketRank"] = Item.marketRank;
                Details["registrationStatus"] = Item.registrationStatus;
                Details["retailPrice"] = Item.retailPrice;
                Details["isBillBackAvailable"] = Item.isBillBackAvailable;
                Details["itemStatus"] = Item.itemStatus;
            }
        });
    }
    return Details;
}

async function GetNonDailyItemDetails(itemName) {
    const response = await rq({
        "method": "GET",
        "uri":  scope.API + "/stores/" + scope.StoreNumber + "/ordering/dailyorders/"+ today +"?ordercycletypecode=NON-DAILY",
        "json": true,
        "resolveWithFullResponse": true,
        "headers": {
            Connection: "keep-alive",
            "x-api-key": scope.APIKEY,
            "Content-Type": "application/json" } 
    });

    var Details = {
    };

    var count =0;

    if (response.body) {
        response.body.forEach(function (Item) {
            count = parseInt(count) + 1;
            if (Item.itemShortName == itemName || Item.itemName == itemName) {
                Details["itemShortName"] = Item.itemShortName;
                Details["itemLongName"] = Item.itemName;
                Details["UPC"] = Item.itemUPC;
                Details["itemId"] = Item.itemId;
                Details["ldu"] = Item.ldu;
                Details["minimumAllowableOrderQty"] = Item.minimumAllowableOrderQty;
                Details["maximumAllowableOrderQty"] = Item.maximumAllowableOrderQty;
                Details["minimumOnHandQty"] = Item.minimumOnHandQty;
                Details["totalBalanceOnHandQty"] = Item.totalBalanceOnHandQty;
                Details["pendingDeliveryQty"] = Item.pendingDeliveryQty;
                Details["storeRank"] = Item.storeRank;
                Details["marketRank"] = Item.marketRank;
                Details["registrationStatus"] = Item.registrationStatus;
                Details["retailPrice"] = Item.retailPrice;
                // Details["Billback"] = Item.isBillBackAvailable;
                Details["itemStatus"] = Item.itemStatus;
            }
        });
    }
    return Details;
}

async function GetMultiDayItemDetails(itemName) {
    const response = await rq({
        "method": "GET",
        "uri":  scope.API + "/stores/" + scope.StoreNumber + "/ordering/dailyorders/"+ today +"?ordercycletypecode=DAILY-OTHER",
        "json": true,
        "resolveWithFullResponse": true,
        "headers": {
            Connection: "keep-alive",
            "x-api-key": scope.APIKEY,
            "Content-Type": "application/json" } 
    });

    var Details = {
    };

    if (response.body) {
        response.body.forEach(function (Item) {
            if (Item.itemShortName == itemName || Item.itemName == itemName) {
                Details["itemShortName"] = Item.itemShortName;
                Details["itemLongName"] = Item.itemName;
                Details["UPC"] = Item.itemUPC;
                Details["itemId"] = Item.itemId;
                Details["ldu"] = Item.ldu;
                Details["minimumAllowableOrderQty"] = Item.minimumAllowableOrderQty;
                Details["maximumAllowableOrderQty"] = Item.maximumAllowableOrderQty;
                Details["storeRank"] = Item.storeRank;
                Details["marketRank"] = Item.marketRank;
                Details["registrationStatus"] = Item.registrationStatus;
                Details["retailPrice"] = Item.retailPrice;
                Details["isBillBackAvailable"] = Item.isBillBackAvailable;
                Details["itemStatus"] = Item.itemStatus;
                Details["leadTime"] = Item.leadTime;
                Details["shelfLife"] = Item.shelfLife;
            }
        });
    }
    return Details;
}

async function GetNonDailyGRItemDetails(itemName) {
    const response = await rq({
        "method": "GET",
        "uri":  scope.API + "/stores/" + scope.StoreNumber + "/ordering/dailyorders/"+ today +"?ordercycletypecode=GUIDED%20REPLENISHMENT&registrationStatus=Carry&orderremaining=false",
        "json": true,
        "resolveWithFullResponse": true,
        "headers": {
            Connection: "keep-alive",
            "x-api-key": scope.APIKEY,
            "Content-Type": "application/json" } 
    });
    
    var Details = {
    };

    if (response.body) {
        response.body.forEach(function (Item) {
            if (Item.itemShortName == itemName || Item.itemName == itemName) {
                Details["itemShortName"] = Item.itemShortName;
                Details["itemLongName"] = Item.itemName;
                Details["UPC"] = Item.itemUPC;
                Details["itemId"] = Item.itemId;
                Details["ldu"] = Item.ldu;
                Details["minimumAllowableOrderQty"] = Item.minimumAllowableOrderQty;
                Details["maximumAllowableOrderQty"] = Item.maximumAllowableOrderQty;
                Details["minimumOnHandQty"] = Item.minimumOnHandQty;
                Details["totalBalanceOnHandQty"] = Item.totalBalanceOnHandQty;
                Details["pendingDeliveryQty"] = Item.pendingDeliveryQty;
                Details["untransmittedOrderQty"] = Item.untransmittedOrderQty;
                Details["storeRank"] = Item.storeRank;
                Details["marketRank"] = Item.marketRank;
                Details["registrationStatus"] = Item.registrationStatus;
                Details["retailPrice"] = Item.retailPrice;
                Details["isBillBackAvailable"] = Item.isBillBackAvailable;
                Details["itemStatus"] = Item.itemStatus;
            }
        });
    }
    return Details;
}

module.exports = {
    GetSingleDayItemDetails,
    GetNonDailyItemDetails,
    GetMultiDayItemDetails,
    GetNonDailyGRItemDetails,
};