import { NON_DAILY, VENDOR_STRING } from "../../constants/ActionTypes";

export const grRecapSubmitData = (grData,vendorData, storeId, grDropdown) => {
    let ItemsArray = [];
    grDropdown === NON_DAILY && grData && grData.length > 0  && grData.forEach(category => {        
        category && category.items && category.items.forEach(item => {
            if(item["isSelectedByUser"] && item["untransmittedOrderQty"] >= 0 ){
                ItemsArray.push(item);
            }      
        });
    });
   grDropdown === VENDOR_STRING && vendorData && vendorData.length > 0  && vendorData.forEach(category => {        
        category && category.items && category.items.forEach(item => {
            if(item["isSelectedByUser"] && item["untransmittedOrderQty"] >= 0 ){
                ItemsArray.push(item);
            }      
        });
    });
    return {
        Items: ItemsArray,
        storeId: storeId
    };
}