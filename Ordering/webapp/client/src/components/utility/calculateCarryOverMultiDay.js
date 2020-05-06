export const calculateCarryOverForLD1=(Item)=>{
    let totalUnits = Item.totalUnits;
    let totalExpire = Item.totalExpire || Item.todayBalanceOnHandQty;
    let totalSell = Item.totalSell || Item.todaySalesForecastQty;
    let calMaxExpSell = Math.max(totalExpire, totalSell)
    let total = totalUnits - calMaxExpSell;

    if (Item.inventory) {
        return Item.inventory;
    } else {
        return Math.max(0, total)
    }
}

export const calculateMaxSellExp = (Item) => {
    return Math.max(Item.totalExpire, Item.totalSell);
}

export const calculateCarryOverForLD2 = (Item) => {
    let carryOver = 0;
    let totalUnits = Item.totalUnits;
    let expireSell = calculateMaxSellExp(Item);
    let pendingQnty = Item.pendingDeliveryQty;
    let pendingDvyQty;

    if(pendingQnty === '' || pendingQnty === null || typeof(pendingQnty) === 'undefined'){
        pendingDvyQty = 0;
    }else{
        pendingDvyQty = pendingQnty;
    }

    carryOver = (totalUnits - expireSell) + pendingDvyQty;
    return Math.max(0, carryOver);
}

export const  calculateCarryOverForLD2SH3 = (Item) => {
    let carryOver = 0;
    let totalUnits = Item.totalUnits;
    let expireSell = calculateMaxSellExp(Item);
    let pendingQnty = Item.pendingDeliveryQty;
    let pendingDvyQty;

    if(pendingQnty === '' || pendingQnty === null || typeof(pendingQnty) === 'undefined'){
        pendingDvyQty = 0;
    }else{
        pendingDvyQty = pendingQnty;
    }

    carryOver = (totalUnits - expireSell) + pendingDvyQty;
    return Math.max(0, carryOver);
}