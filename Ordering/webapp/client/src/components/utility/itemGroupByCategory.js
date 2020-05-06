import _ from 'lodash';
export const itemGroupByCategory = (items, isFiltered) => {
  let itemGroupByCategory = [];
  let itemGroup;

  const ItemsArray = filterItems(items);
  let grouped = _.groupBy(ItemsArray, function (item) {
    return item.subCatName;
  });

  Object.keys(grouped).forEach(function (key, index) {
    if (isFiltered) {
      itemGroup = {
        deliveryDate: grouped[key][0].deliveryDate,
        psa: grouped[key][0].psa,
        cat: grouped[key][0].cat
      }
      itemGroupByCategory.push(itemGroup)
    } else {
      itemGroup = {
        catName: key,
        items: grouped[key],
        orderCycleType: grouped[key][0].orderCycleTypeCode,
        deliveryDate: grouped[key][0].deliveryDate,
        psa: grouped[key][0].psa,
        cat: grouped[key][0].cat
      }
      itemGroupByCategory.push(itemGroup)
    }

  });
  return itemGroupByCategory;
}

function filterItems(items) {
  let ItemsArray = [];
  items && items.length > 0 && items.forEach(item => {
    item["oldValue"] = item.untransmittedOrderQty;
    ItemsArray.push(item);
    //}      
  });
  return ItemsArray
}

export const filterItemsOnReviewAndFinalize = (items) => {
  let ItemsArray = [];
  items && items.length > 0 && items.forEach(item => {
    //if((item["untransmittedOrderQty"] !== null && item["untransmittedOrderQty"] !== '' && typeof item["untransmittedOrderQty"] != 'undefined') || item["isStoreOrderBlocked"]){
    ItemsArray.push(item);
    //}      
  });
  return ItemsArray
}

export const RemoveDuplicateRequestParams = (requestParamsString) => {
  const duplciates = requestParamsString.split(",");
  const nonDuplciates = [];
  duplciates.forEach(x => {
    if (!nonDuplciates.includes(x)) {
      nonDuplciates.push(x);
    }
  });
  if (nonDuplciates && nonDuplciates.length) {
    return nonDuplciates.join(",");
  }
}