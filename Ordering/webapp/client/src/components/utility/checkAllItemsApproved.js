import { NON_DAILY, VENDOR_STRING} from '../../constants/ActionTypes'

export const checkAllItemsApproved = (data,vendorData, grDroppdown) => {
    let allApproved = true;

     grDroppdown === NON_DAILY && data && data.length > 0 && data.forEach((category)=>{
        category && category.items && category.items.length > 0 && category.items.forEach((item)=>{
            if(item && item.orderChangeStatus !== "Approved"){
                allApproved = false
                return;
            }
        })
    });

    grDroppdown === VENDOR_STRING && vendorData && vendorData.length > 0 && vendorData.forEach((category)=>{
        category && category.items && category.items.length > 0 && category.items.forEach((item)=>{
            if(item && item.orderChangeStatus !== "Approved"){
                allApproved = false
                return;
            }
        })
    });
 return allApproved;
}