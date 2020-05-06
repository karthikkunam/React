export const filterItemsOnReviewAndFinalize = (items) => {
    let ItemsArray = [];
    items && items.length > 0  && items.forEach(item => {
        if( item["untransmittedOrderQty"] && (parseInt(item["untransmittedOrderQty"]) >= 0) ){
            ItemsArray.push(item);
        }      
    });
    return ItemsArray
}