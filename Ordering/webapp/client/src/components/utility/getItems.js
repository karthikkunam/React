import _ from 'lodash';

export const getItems = (data, isCarried, orderRemainingItems) => {
    let ItemsArray = [];
    data && data && data.category.forEach(category => {
        category && category.subCategories && category.subCategories.forEach(subCategory => {
            if (subCategory["isSelectedByUser"]) {
                let itemsArray = isCarried ? subCategory.carriedItems : subCategory.items;
                itemsArray && itemsArray.forEach(item => {
                    if (orderRemainingItems && item.untransmittedOrderQty && item.untransmittedOrderQty >= 0) {
                    } else {
                        item.itemStatus = "New";
                        ItemsArray.push(item);
                    }
                });
            }
        });
    });
    return ItemsArray;
}

export const generateOrderingHomeDetails = (inputData) => {
    let finalData = [];

    if (inputData) {
        _.forEach(inputData, (eachData) => {
            const categories = eachData.categories;
            if (categories && categories.length > 0) {
                _.forEach(categories, (eachCategory) => {
                    const items = eachCategory.items;
                    _.forEach(items, (eachItem) => {
                        let itemDetails = {
                            ...eachItem,
                            subCatName: eachCategory.name,
                            catName: "TEST",
                        }
                        finalData.push(itemDetails);
                    });
                })
            }
        })
    }
    return finalData;
}

export const generateTrendRequestDetails = (itemDetails) => {
    const finalItemRequest = [];
    if (itemDetails && itemDetails.length) {
        itemDetails.forEach(eachItem => {
            if (eachItem.items && eachItem.items.length) {
                const itemsList = eachItem.items;
                itemsList.forEach(eachItemDetail => {
                    finalItemRequest.push({
                        itemId: eachItemDetail.itemId,
                        forecastPeriod: eachItemDetail.forecastPeriod,
                        shelfLife: eachItemDetail.shelfLife,
                        deliveryDate: eachItemDetail.deliveryDate
                    });
                })
            }
        });
    }
    return finalItemRequest;
}



export const generateTrendRequestDetailsOrderingFlow = (itemDetails) => {
    const finalItemRequest = [];
    if (itemDetails && itemDetails.length) {
        itemDetails.forEach(eachItem => {
            finalItemRequest.push({
                itemId: eachItem.itemId,
                forecastPeriod: eachItem.forecastPeriod,
                shelfLife: eachItem.shelfLife,
                deliveryDate: eachItem.deliveryDate
            });
        });
    }
    return finalItemRequest;
}

export const generateIdMappedTrendsData = (trendDetails) => {
    const trendResponse = new Map();
    const leadTimeDetails = new Map();
    const submitDetails = new Map();
    const shelLifeNumber = new Map();
    if (trendDetails && trendDetails.length) {
        trendDetails.forEach(eachTrend => {
            trendResponse.set(eachTrend.itemId, {
                daily: eachTrend.daily,
                forecast: eachTrend.forecast
            });
            leadTimeDetails.set(eachTrend.itemId, eachTrend.leadTime);
            submitDetails.set(eachTrend.itemId, eachTrend.submitDate);
            shelLifeNumber.set(eachTrend.itemId, eachTrend.shelfLife);
        });
    }
    return { trendResponse, leadTimeDetails, submitDetails, shelLifeNumber };
}

export const aggregateTrendAndItemDetails = (trendDetails, itemDetails) => {
    const finalResponse = [];
    const { trendResponse, leadTimeDetails, submitDetails, shelLifeNumber } = generateIdMappedTrendsData(trendDetails);
    if (itemDetails && itemDetails.length) {
        itemDetails.forEach(eachItem => {
            const details = trendResponse.get(eachItem.itemId).daily;
            const weeklyDetails = trendResponse.get(eachItem.itemId).forecast;
            let sortedWeekly;
            if (eachItem.orderCycleTypeCode === "DAILY-OTHER") {
                sortedWeekly = weeklyDetails;
            } else {
                sortedWeekly = weeklyDetails.sort((a, b) => (a.date > b.date) ? 1 : -1);
            }
            finalResponse.push({
                ...eachItem,
                daily: details,
                forecast: sortedWeekly,
                leadTime: leadTimeDetails.get(eachItem.itemId),
                submitDate: submitDetails.get(eachItem.itemId),
                shelfLife: shelLifeNumber.get(eachItem.itemId)
            });
        })
    }
    return finalResponse;
}


export const sortItemByName = (itemDetails) => {
    let finalSortedList = [];
    if (itemDetails && itemDetails.length) {
        finalSortedList = itemDetails.sort((a, b) => (a.itemShortName > b.itemShortName) ? 1 : -1);
    }
    return finalSortedList;
}

export const orderingFlowBlackMagic = (trendDetails, itemDetails) => {
    const orderingFLowResponse = aggregateTrendAndItemDetails(trendDetails, itemDetails);
    const sortedList = sortItemByName(orderingFLowResponse);
    return sortedList;
}