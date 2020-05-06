/**
 * This is the utility function to generate required data for transmit delivery schedule page.
 * We obtain data from API, remove the duplicate transmot delivery dates and then remove empty row and return the response
 * to render the data into the page.
 */
// const calendarData = require('./calendar.json');
import _ from 'lodash';
import { getDayNameAndDateMMDD } from './DateFormatter';
import { getNextWeekDateFromDayCode, formatDateToMMDDYYYY } from './DateHelper';

const generateKeyPair = (key, value) => {
    return `${key}-${value}`;
}

const vendorAgentNamesorting = (objectDetails) => {
    const sortedList =
        objectDetails.sort(function (a, b) {
            if (a.agentName < b.agentName) { return -1; }
            if (a.agentName > b.agentName) { return 1; }
            return 0;
        });
    return sortedList;
}

export const getCalendarFormattedData = (apiResponseData) => {

    let results = [];
    let calendarUpdateDate;
    if (apiResponseData && apiResponseData.length > 0) {
        calendarUpdateDate = apiResponseData[0].calendarEffectiveUpdateDate;
    } else {
        calendarUpdateDate = null;
    }

    if (apiResponseData && apiResponseData.length > 0) {
        const calendarDetails = apiResponseData[0].calendarDetails;
        let agentCodesHasMap = new Map();
        _.forEach(calendarDetails, (eachCalendar) => {
            const {
                vendorCode,
                deliveryAgentName: {
                    name
                },
                cycleCode,
                deliveryAgentCode,
                orderAndDeliveryDates
            } = eachCalendar;
            let data = [];
            let monday = "";
            let tuesday = "";
            let wednesday = "";
            let thursday = "";
            let friday = "";
            let saturday = "";
            let sunday = "";
            _.forEach(orderAndDeliveryDates, (eachDate) => {

                const {
                    orderDayOfWeekCode,
                    deliveryDayOfWeekCode
                } = eachDate;

                /**
                 * This is needed to remove duplicates from the obtained API response. So that we will not have same transmit dates as two rows
                 * for same agent for the given order week codes.
                 */

                if (agentCodesHasMap.has(deliveryAgentCode + '-' + orderDayOfWeekCode + '-' + deliveryDayOfWeekCode + '-' + cycleCode)) {
                    // console.log(`Already exists for`, deliveryAgentCode + '-' + orderDayOfWeekCode + '-' + deliveryDayOfWeekCode + '-' + cycleCode)
                } else {
                    agentCodesHasMap.set(deliveryAgentCode + '-' + orderDayOfWeekCode + '-' + deliveryDayOfWeekCode + '-' + cycleCode)
                    if (orderDayOfWeekCode === 1) {
                        monday = monday + dateGeneratorForRecords(orderDayOfWeekCode, deliveryDayOfWeekCode, calendarUpdateDate);
                    } if (orderDayOfWeekCode === 2) {
                        tuesday = tuesday + dateGeneratorForRecords(orderDayOfWeekCode, deliveryDayOfWeekCode, calendarUpdateDate);
                    } if (orderDayOfWeekCode === 3) {
                        wednesday = wednesday + dateGeneratorForRecords(orderDayOfWeekCode, deliveryDayOfWeekCode, calendarUpdateDate);
                    } if (orderDayOfWeekCode === 4) {
                        thursday = thursday + dateGeneratorForRecords(orderDayOfWeekCode, deliveryDayOfWeekCode, calendarUpdateDate);
                    } if (orderDayOfWeekCode === 5) {
                        friday = friday + dateGeneratorForRecords(orderDayOfWeekCode, deliveryDayOfWeekCode, calendarUpdateDate);
                    } if (orderDayOfWeekCode === 6) {
                        saturday = saturday + dateGeneratorForRecords(orderDayOfWeekCode, deliveryDayOfWeekCode, calendarUpdateDate);
                    } if (orderDayOfWeekCode === 7) {
                        sunday = sunday + dateGeneratorForRecords(orderDayOfWeekCode, deliveryDayOfWeekCode, calendarUpdateDate);
                    }
                }
            });
            data.push.apply(data, [monday, tuesday, wednesday, thursday, friday, saturday, sunday]);
            let check = 0;
            if (data && data.length > 0) {
                data.forEach(eachData => {
                    if (eachData.length > 0) {
                    } else {
                        check++;
                    }
                });
            };
            // This is to check if there are any empty results for the week i.e. no transmit dates present in the week for the agent
            if (check === 7) {
                // console.log(`check fail`, vendorCode, deliveryAgentCode, cycleCode, data, name || eachCalendar.deliveryAgentName)
            } else {
                results.push({
                    vendorCode,
                    deliveryAgentCode,
                    cycleCode,
                    agentName: name ? name : eachCalendar.deliveryAgentName,
                    calendarData: data
                });
            }
        });
    }
    return vendorAgentNamesorting(results);
}

export const getCalendarUpdatedDate = (apiResponseData) => {
    if (apiResponseData && apiResponseData.length > 0) {
        return formatDateToMMDDYYYY(apiResponseData[0].calendarEffectiveUpdateDate);
    } else {
        return "N/A";
    }
}

const dateGeneratorForRecords = (orderCode, deliveryDayWeekCode, calendarUpdateDate) => {
    let weeklyDates;
    if (calendarUpdateDate && calendarUpdateDate !== 'N/A') {
        weeklyDates = getDayNameAndDateMMDD(calendarUpdateDate);
    } else {
        weeklyDates = getDayNameAndDateMMDD();
    }
    let finalData;
    if (orderCode < deliveryDayWeekCode || orderCode === deliveryDayWeekCode) {
        finalData = generateKeyPair(weeklyDates[deliveryDayWeekCode - 1] ? (weeklyDates[deliveryDayWeekCode - 1].name).slice(0, 3) : "",
            weeklyDates[deliveryDayWeekCode - 1] ? (weeklyDates[deliveryDayWeekCode - 1].day) : "");

        // `${weeklyDates[deliveryDayWeekCode - 1] ? (weeklyDates[deliveryDayWeekCode - 1].name).slice(0, 3) : "-"}-${weeklyDates[deliveryDayWeekCode - 1]
        // ? (weeklyDates[deliveryDayWeekCode - 1].day) : "-"}`;
    } else {
        finalData = generateKeyPair((weeklyDates[deliveryDayWeekCode - 1].name).slice(0, 3),
            weeklyDates[deliveryDayWeekCode - 1] ?
                getNextWeekDateFromDayCode(weeklyDates[deliveryDayWeekCode - 1].date, deliveryDayWeekCode) : "");
        // `${(weeklyDates[deliveryDayWeekCode - 1].name).slice(0, 3)}-${weeklyDates[deliveryDayWeekCode - 1] ?
        //     getNextWeekDateFromDayCode(weeklyDates[deliveryDayWeekCode - 1].date, deliveryDayWeekCode) : "-"}`;
    }
    return finalData;

}