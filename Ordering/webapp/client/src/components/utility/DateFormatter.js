import * as moment from 'moment-timezone';
import { DEFAULT_TIME_ZONE, ISO_FORMAT, CENTRAL_TIME_ZONE } from './constants';
import { currentWeekDays } from './DateHelper';

const SHORT_DAY_FORMAT = 'ddd';
const DATE_SEPARATOR = '-';

export const addDays = (date, days, timezone = DEFAULT_TIME_ZONE, format) => {
    format = format ? format : ISO_FORMAT;
    return moment(date).tz(timezone).add(days, 'days').format(format);
}

export const subtractDays = (date, days, timezone = DEFAULT_TIME_ZONE, format) => {
    format = format ? format : ISO_FORMAT;
    return moment(date).tz(timezone).subtract(days, 'days').tz(timezone).format(format);;
}

export const toISOFormat = (date) => moment(date).tz(DEFAULT_TIME_ZONE).format(ISO_FORMAT);

export const datesToString = (dates, { dayFormat = SHORT_DAY_FORMAT, separator = DATE_SEPARATOR }) => {

    if (Array.isArray(dates)) {
        if (dates.length === 0) {
            return null;
        }
        if (dates.length === 1) {
            return moment(dates[0]).day.format(SHORT_DAY_FORMAT);
        }

        if (dates.length > 1) {
            const start = moment(dates[0]).day.format(SHORT_DAY_FORMAT);
            const end = moment(dates[dates.length - 1]).day.format(SHORT_DAY_FORMAT);
            return `${start}${separator}${end}`;
        }
        dates.map(date => moment(date).day.format(SHORT_DAY_FORMAT)).join(DATE_SEPARATOR);
    }
    else {
        moment(dates).day().format(SHORT_DAY_FORMAT);
    }
}

export const numberOfDaysBetween = (date1, date2) => {
    return moment(date1).tz(DEFAULT_TIME_ZONE).diff(moment(date2).tz(DEFAULT_TIME_ZONE), 'days');
}

export const getCurrentWeekDaysFormatted = () => {
    const daysArray = currentWeekDays();
    let finalResult = [];
    daysArray.forEach(eachDayArray => {
        finalResult.push(moment(eachDayArray).format("MM/DD"));
    });
    return finalResult;
}

export const dayOfTheDate = (inputDate) => moment(inputDate).format('dddd')

export const getDayNameAndDateMMDD = (inputDate) => {
    let daysArray;
    if (inputDate && inputDate !== 'N/A') {
        daysArray = currentWeekDays(inputDate);
    } else {
        daysArray = currentWeekDays();
    }
    let finalResult = [];
    daysArray.forEach(eachDayArray => {
        finalResult.push({
            day: moment(eachDayArray).format("MM/DD"),
            name: dayOfTheDate(eachDayArray),
            date: moment(eachDayArray).format("YYYY-MM-DD")
        });
    });
    return finalResult;
}

export const orderBatchDate = () => moment.tz(moment.tz(CENTRAL_TIME_ZONE).toDate(), CENTRAL_TIME_ZONE).format('YYYY-MM-DD');