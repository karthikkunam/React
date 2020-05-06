export const getItemsForSelectedCategories = ( data, vendorData, orderByVendor) => {
  return [checkSingleMultiDay(data.singleDay, orderByVendor), checkSingleMultiDay(data.multiDay, orderByVendor),checkNonDailyData(data.nonDaily,vendorData, orderByVendor)]
}

function checkSingleMultiDay (data, orderByVendor){
 let isSingleDayselected = false ;
 !orderByVendor && data && data.category.forEach(category => {
    category && category.subCategories && category.subCategories.forEach(subCategory => {
        if(subCategory["isSelectedByUser"]){
          isSingleDayselected = true;
          return;
        }  
    });
  });
  return isSingleDayselected;
}

 function checkNonDailyData (data,vendorData, orderByVendor){
  let isNonDailtselected = false ;
  !orderByVendor && data && data.category.forEach(category => {
     category && category.subCategories && category.subCategories.forEach(subCategory => {
         if(subCategory["isSelectedByUser"]){
          isNonDailtselected = true;
           return;
         }  
     });
   });

   orderByVendor && !isNonDailtselected && vendorData && vendorData.CDC && vendorData.CDC.category.forEach(function (category) {
    category.subCategories && category.subCategories.forEach(function (subCategory) {
        if (subCategory.isSelectedByUser === true) {
          isNonDailtselected = true;
          return;
        }
    });
});

orderByVendor && !isNonDailtselected && vendorData.DSD && vendorData.DSD.category && vendorData.DSD.category.forEach(function (category) {
    if (category.isSelectedByUser === true) {
      isNonDailtselected = true;
      return;
    }
});

   return isNonDailtselected;
 }