// import moment from 'moment';
import * as moment from 'moment-timezone';
import { SHORT_DAY_FORMAT, DATE_SEPARATOR, DEFAULT_TIME_ZONE, MOMENT_TIMEZONE } from './constants';
import { storeDetails } from '../../lib/storeDetails';
const TimeZone = MOMENT_TIMEZONE(storeDetails() && storeDetails().timeZone) || DEFAULT_TIME_ZONE;

const DateHelper = (localStoreTimeStamp) => {

   //const StoreLocalTime = moment(Date.now()).format('MM/DD/YYYY, h:mm a');
   //const cutOffTime = moment(Date.now()).format('MM/DD/YYYY, h:mm a');
   //TO DO: Parse the time returned from order detail API
   const storeTimeZone = storeDetails() && storeDetails().timeZone ? storeDetails().timeZone : "UTC";
   let StoreLocalTime = moment.tz(MOMENT_TIMEZONE(storeTimeZone)).format("HH:mm");

   // Setting close time as 10:00AM
   let closeTime = new Date();
   closeTime.setHours(10);
   closeTime.setMinutes(0);

   const orderCutOffTime = moment(closeTime).format('HH:mm');

   let orderTime, deliveryTime, forecastTime, orderBatchDate, orderCutOffTimeStamp;
   if (StoreLocalTime > orderCutOffTime) {

      //set the order submit date
      orderTime = moment().add(1, 'day').format('MM/DD/YY')

      //set the required order batch date in API request format
      //TODO: THIS IS REALLY !!!IMPORTANT TO RESTORE, i.e. Add +1 date
      // orderBatchDate = moment().add(1, 'day').format('YYYY-MM-DD')
      orderBatchDate = moment.tz(MOMENT_TIMEZONE(storeTimeZone)).add(1, 'day').format('YYYY-MM-DD');

      orderCutOffTimeStamp = moment.tz(MOMENT_TIMEZONE(storeTimeZone)).add(1, 'day').format();

      //set the delivery date
      deliveryTime = moment().add(2, 'day').format('MM/DD/YY')

      //set the forecasting date
      forecastTime = moment().add(2, 'day').format('MM/DD/YY')

   } else {
      //set the order submit date
      orderTime = moment().format('MM/DD/YY')

      //set the required order batch date in API request format
      orderBatchDate = moment.tz(MOMENT_TIMEZONE(storeTimeZone)).format('YYYY-MM-DD')

      orderCutOffTimeStamp = moment.tz(MOMENT_TIMEZONE(storeTimeZone)).format()


      //set the delivery date
      deliveryTime = moment().add(1, 'day').format('MM/DD/YY')

      //set the forecasting date
      forecastTime = moment().add(1, 'day').format('MM/DD/YY')
   }

   return {
      orderTime,
      deliveryTime,
      forecastTime,
      orderBatchDate,
      orderCutOffTimeStamp
   }

}

export const datesToString = (dates, dateOnly = false, { dayFormat = SHORT_DAY_FORMAT, separator = DATE_SEPARATOR } = {}) => {
   const timezone = getTimeZone(storeDetails().timeZone) || DEFAULT_TIME_ZONE;
   
   let start, end;
   if (Array.isArray(dates)) {
      if (dates.length === 0) {
         return null;
      }
      if (dates.length === 1) {
         return moment.tz(dates[0],timezone).format(dayFormat);
      }
      if (dates.length > 1) {
         start = moment.tz(dates[0],timezone).format(dayFormat);
         //if (dateOnly) {
         //end = moment(dates[dates.length - 1]).tz(timezone).date();
         //} else {
         end = moment.tz(dates[dates.length - 1],timezone).format(dayFormat);
         //}
         return `${start}${separator}${end}`;
      }
      return dates.map(date => moment.tz(date,timezone).format(dayFormat)).join(separator);
   }
   else {
      return moment.tz(dates,timezone).format(dayFormat);
   }
}


export const currentWeekDays = (inputDates) => {
   let startOfWeek = moment().startOf('isoWeek');
   let endOfWeek = moment().endOf('isoWeek');

   if (inputDates) {
      startOfWeek = moment(inputDates).startOf('isoWeek');
      endOfWeek = moment(inputDates).endOf('isoWeek');
   } else {
      startOfWeek = moment().startOf('isoWeek');
      endOfWeek = moment().endOf('isoWeek');
   }

   var days = [];
   var day = startOfWeek;

   while (day <= endOfWeek) {
      days.push(day.toDate());
      day = day.clone().add(1, 'd');
   }
   return days;
}

export const getTimeZone = (key) => {
   return MOMENT_TIMEZONE(key);
}

export const getTimeZoneTimeStamp = (timeZone) => {
   const momentTimeZone = getTimeZone(timeZone);
   return moment.tz(momentTimeZone).toDate();
}

export const getNextWeekDateFromDayCode = (givenDate, weekDayCode) => {
   const resultDate = moment(givenDate).day(weekDayCode + 7);
   return moment(resultDate).format("MM/DD");
}

export const formatDateToMMDDYYYY = inputDate => moment.tz(inputDate, TimeZone).format('YYYY-MM-DD');

export const convertStringToDate = (inputDateString) => {
   return moment(inputDateString).toDate();
}

export default DateHelper;