
const sortForecastByDateKey = (inp1, inp2) => inp1.date < inp2.date;

export const generateTrendDataForEachItem = (trendDetails, orderCycleTypeCode) => {
    const allForecastDetails = new Map();

    if (trendDetails && trendDetails.length) {
        trendDetails.forEach(eachTrend => {
            if (eachTrend && eachTrend.itemId && eachTrend.forecast) {
                let forecast;
                // console.log(`--- orderCycleTypeCode ---`, (orderCycleTypeCode).toUpperCase())
                if ((orderCycleTypeCode).toUpperCase() === "DAILY-OTHER") {
                    if (eachTrend.forecast && eachTrend.forecast.sellDay.length) {
                        const sortedForecastDetails = (eachTrend.forecast.sellDay).sort(sortForecastByDateKey);
                        sortedForecastDetails.forEach((eachTrend, index) => {
                            if (eachTrend['SALE']) {
                                forecast = {
                                    ...forecast,
                                    [`fp${index}`]: eachTrend.SALE
                                }
                            } else {
                                forecast = {
                                    ...forecast,
                                    [`fp${index}`]: null
                                }
                            }
                        });
                    }
                } else {
                    if (eachTrend.forecast && eachTrend.forecast.length) {
                        const sortedForecastDetails = (eachTrend.forecast).sort(sortForecastByDateKey);
                        sortedForecastDetails.forEach((eachTrend, index) => {
                            if (eachTrend['SALE']) {
                                forecast = {
                                    ...forecast,
                                    [`fp${index}`]: eachTrend.SALE
                                }
                            } else {
                                forecast = {
                                    ...forecast,
                                    [`fp${index}`]: null
                                }
                            }
                        });
                    }
                }

                allForecastDetails.set(eachTrend.itemId, {
                    daily: eachTrend ? eachTrend.daily : null,
                    forecast: eachTrend ? eachTrend.forecast : null,
                    forecastHistory: forecast
                })
            }
        });
    };
    return allForecastDetails;
}

export const aggregateItemDetailsAndTrendData = (trendMap, itemDetails) => {
    if (itemDetails && itemDetails.length) {
        let alLGroupDetails = [];
        itemDetails.forEach(eachItem => {
            let currentGroupItems = [];
            const allItems = eachItem.items;
            delete eachItem.items;
            allItems.forEach(singleItem => {
                currentGroupItems.push({
                    ...singleItem,
                    daily: trendMap.get(singleItem.itemId) ? trendMap.get(singleItem.itemId).daily : null,
                    forecast: trendMap.get(singleItem.itemId) ? trendMap.get(singleItem.itemId).forecast : null,
                    forecastHistory: trendMap.get(singleItem.itemId) ? trendMap.get(singleItem.itemId).forecastHistory : null
                });
            });
            alLGroupDetails.push({
                ...eachItem,
                items: [...currentGroupItems]
            })
        });
        return alLGroupDetails;
    }
}