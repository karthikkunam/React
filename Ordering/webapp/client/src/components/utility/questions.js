import {
    addDays,
    subtractDays,
    toISOFormat
} from "./DateFormatter";

export const missedParamError = (paramName) => {
    return `${paramName} is required`;
}

//TODO: this should base on store timezone, but for now just return it as it is. 
export const getOrderDate = (submitDate) => {
    return submitDate;
}

const getFormulaDates = (itemDetailList, cycleType) => {
    if (itemDetailList && cycleType) {
        if (!itemDetailList || !itemDetailList.length) {
            return {};
        }
        let result = {
            errors: []
        };

        for (let i = 0; i < itemDetailList.length; i++) {
            const itemDetail = itemDetailList[i];
            const {
                itemId,
                forecastPeriod,
                leadTime,
                shelfLife,
                deliveryDate,
                submitDate
            } = itemDetail;
            if (!itemId) {
                result.errors.push({
                    error: 'Item Id is required',
                    itemDetail
                });
                continue;
            } else {
                result[itemId] = {};
                if (!cycleType) {
                    result[itemId].error = missedParamError('cycleType');
                }

                if (cycleType === 'SINGLE_DAY') {
                } else if (cycleType === 'MULTI_DAY') {
                    if (!leadTime) {
                        result[itemId].error = missedParamError('leadTime');
                        continue;
                    }
                    if (!shelfLife) {
                        result[itemId].error = missedParamError('shelfLife');
                        continue;
                    }

                    result[itemId] = {
                        expire: [],
                        ordreDaySell: [],
                        forecastSell: []
                    };
                    result[itemId].expire.push(submitDate);
                    result[itemId].ordreDaySell.push(submitDate);
                    if (leadTime === 2) {
                        result[itemId].ordreDaySell.push(addDays(submitDate, 1));
                        result[itemId].forecastSell.push(toISOFormat(deliveryDate));
                        if (shelfLife === 3) {
                            result[itemId].expire.push(addDays(submitDate, 1));
                        } else if (shelfLife === 4) {
                            result[itemId].expire.push(addDays(submitDate, 1));
                            result[itemId].forecastSell.push(addDays(deliveryDate, 1));
                        }

                    } else if (leadTime === 1) {
                        result[itemId].forecastSell.push(toISOFormat(deliveryDate));
                        if (shelfLife > 2) {
                            result[itemId].forecastSell.push(addDays(deliveryDate, 1));
                        }
                    }
                }
                else if (cycleType === 'NON_DAILY') {
                    if (!forecastPeriod) {
                        result[itemId].error = missedParamError(forecastPeriod)
                    }
                    result[itemId].deliveryDate = toISOFormat(deliveryDate);
                    result[itemId].forecastSell = addDays(subtractDays(deliveryDate, 1), forecastPeriod);
                } else {
                    result[itemId].error = 'Cycle type must be one of SINGLE_DAY, MULTI_DAY or NON_DAILY';
                }
            }
        }
        return result;
    }
}

export default getFormulaDates;