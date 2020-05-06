export const calculateInventory = (totalBalanceOnHandQty, pendingDeliveryQty) => {
    let totalBOH, pendingDvyQty;
    if(totalBalanceOnHandQty === '' || totalBalanceOnHandQty === null || typeof(totalBalanceOnHandQty) === 'undefined'){
        totalBOH = 0;
    }else{
        totalBOH = totalBalanceOnHandQty;
    }

    if(pendingDeliveryQty === '' || pendingDeliveryQty === null || typeof(pendingDeliveryQty) === 'undefined'){
        pendingDvyQty = 0;
    }else{
        pendingDvyQty = pendingDeliveryQty;
    }

    return (parseInt(totalBOH ) + parseInt(pendingDvyQty)) >= 0 ? (parseInt(totalBOH ) + parseInt(pendingDvyQty)) : 0;
}
