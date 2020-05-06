import _ from 'lodash';
import { cycleTypes, DSD_VENDOR, CDC_VENDOR, GR_EXTENSION } from '../../constants/ActionTypes';

/**
 * Process order by group detailed data. Including total count details.
 * @param {Object} inputData 
 * @param {String} dayName 
 * @param {String} dayCode 
 * @param {String} storeId 
 * @param {String} cycleName 
 */
const getFinalRelatedData = (inputData, dayName, dayCode, storeId, cycleName) => {

    let finalOrderedCount = 0;
    let finalAvailableCount = 0;
    let finalCarriedOrderedCount = 0;
    let finalCarriedAvailableCount = 0;

    let category = [];

    _.forEach(inputData, (eachMultiDay) => {
        let subCategories = [];
        const {
            orderGroupCode,
            orderGroupName,
            totalOrderedCount,
            carriedAvailableCount,
            carriedOrderedCount,
            availableCount,
            categories,
        } = eachMultiDay;
        // console.log(`---------->`, eachMultiDay, finalAvailableCount + availableCount)

        finalAvailableCount = finalAvailableCount + availableCount;
        finalOrderedCount = finalOrderedCount + totalOrderedCount;
        finalCarriedAvailableCount = finalCarriedAvailableCount + carriedAvailableCount;
        finalCarriedOrderedCount = finalCarriedOrderedCount + carriedOrderedCount;

        if (categories && categories.length > 0) {

            _.forEach(categories, (eachCategory) => {
                const {
                    categoryName,
                    psa,
                    cat,
                    count,
                    totalOrderedCount,
                    carriedAvailableCount,
                    carriedOrderedCount
                } = eachCategory;
                subCategories.push({
                    allItemCounts: count,
                    allOrderCounts: (count - totalOrderedCount),
                    carriedOrderCounts: (carriedAvailableCount - carriedOrderedCount),
                    carriedItemCounts: carriedAvailableCount,
                    psa,
                    cat: cat,
                    psaDescription: categoryName
                });
            });
        }
        category.push({
            orderGroupCode,
            orderGroupCodeName: orderGroupName,
            allItemCounts: availableCount,
            allOrderCounts: (availableCount - totalOrderedCount),
            carriedOrderCounts: (carriedAvailableCount - carriedOrderedCount),
            carriedItemCounts: carriedAvailableCount,
            subCategories
        });
    });

    const finalData = {
        All: {
            itemCounts: finalAvailableCount,
            OrderCount: (finalAvailableCount - finalOrderedCount)
        },
        Carried: {
            OrderCount: (finalCarriedAvailableCount - finalCarriedOrderedCount),
            itemCounts: finalCarriedAvailableCount
        },
        orderCycleTypeCode: dayCode,
        orderCycleTypeName: dayName,
        orderCycleTypeDBName: cycleName,
        category,
        storeId
    }
    return finalData;

}

/**
 * Process DSD vendor details data
 * @param {Object} inputData 
 * @param {String} storeId 
 */
const finalVendorData = (inputData, storeId) => {

    let finalOrderedCount = 0;
    let finalAvailableCount = 0;
    let finalCarriedOrderedCount = 0;
    let finalCarriedAvailableCount = 0;

    let category = [];

    _.forEach(inputData, (eachMultiDay) => {
        let subCategories = [];
        const {
            merchandiseVendorCode,
            vendorName,
            totalOrderedCount,
            carriedAvailableCount,
            carriedOrderedCount,
            availableCount,
        } = eachMultiDay;

        finalAvailableCount = finalAvailableCount + availableCount;
        finalOrderedCount = finalOrderedCount + totalOrderedCount;
        finalCarriedAvailableCount = finalCarriedAvailableCount + carriedAvailableCount;
        finalCarriedOrderedCount = finalCarriedOrderedCount + carriedOrderedCount;

        category.push({
            orderGroupCode: merchandiseVendorCode,
            orderGroupCodeName: vendorName,
            allItemCounts: availableCount,
            allOrderCounts: (availableCount - totalOrderedCount),
            carriedOrderCounts: (carriedAvailableCount - carriedOrderedCount),
            carriedItemCounts: carriedAvailableCount,
            subCategories
        })
    })

    const finalData = {
        All: {
            itemCounts: finalAvailableCount,
            OrderCount: (finalAvailableCount - finalOrderedCount)
        },
        Carried: {
            OrderCount: (finalCarriedAvailableCount - finalCarriedOrderedCount),
            itemCounts: finalCarriedAvailableCount
        },
        category,
        storeId
    }
    return finalData;

}

/**
 * To process Order By Group total count details
 * @param {Object} inputAPIData 
 * @param {String} storeId 
 */
export const processDataAndSend = (inputAPIData, storeId) => {

    // TODO: Reset to data.
    const countData = inputAPIData.data.body;


    let finalGuidedData = [];
    _.forEach(countData[cycleTypes.guidedReplenishment], (eachGRData) => {
        const groupName = eachGRData.orderGroupName;
        delete eachGRData.orderGroupName;
        finalGuidedData.push({
            ...eachGRData,
            orderGroupName: groupName + GR_EXTENSION,
        });
    })

    const multiDayData = countData[cycleTypes.multiDay];
    const singleDayData = countData[cycleTypes.singleDay];
    const nonDailyData = [...countData[cycleTypes.nonDaily],
    ...finalGuidedData];


    const singleDayCycle = "Single Day";
    const multiDayCycle = "Multi Day";
    const nonDailyCycle = "Non-Daily";
    // const storeId = "36312";

    const singleDay = getFinalRelatedData(singleDayData, singleDayCycle, cycleTypes.singleDayCode, storeId, cycleTypes.singleDay);
    const multiDay = getFinalRelatedData(multiDayData, multiDayCycle, cycleTypes.multiDayCode, storeId, cycleTypes.multiDay);
    const nonDaily = getFinalRelatedData(nonDailyData, nonDailyCycle, cycleTypes.nonDailyCode, storeId, cycleTypes.nonDaily);

    const finalPayload = {
        singleDay,
        multiDay,
        nonDaily
    };
    return finalPayload;
}


/**
 * To Process vendor level total count details
 * @param {Object} inputAPIData 
 * @param {String} storeId 
 */
export const processVendorDataAndSend = (inputAPIData, storeId) => {
    const countData = inputAPIData.data.body;

    const cdcData = countData[CDC_VENDOR];
    const dsdData = countData[DSD_VENDOR];

    const CDC = getFinalRelatedData(cdcData, null, null, storeId, null);
    const DSD = finalVendorData(dsdData, storeId);

    const finalPayload = {
        CDC,
        DSD
    }

    return finalPayload;
}