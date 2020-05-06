import * as moment from 'moment-timezone';
import { storeDetails } from '../../lib/storeDetails';
import { getTimeZone } from '../utility/DateHelper';
const YMD_DASH = "YYYY-MM-DD";

export const getOrderDate = (dateString) => {
        const TIME_ZONE = storeDetails() && storeDetails().timeZone ? getTimeZone(storeDetails().timeZone) : "UTC"
        // console.log("check timeZone", TIME_ZONE, moment.tz(dateString, TIME_ZONE).format(YMD_DASH), dateString);
        return moment.tz(dateString, TIME_ZONE).format(YMD_DASH);
};

export const getOrderDatePromise = (dateString) => {
        let TIME_ZONE;

        let promise = new Promise(function (resolve, reject) {
                TIME_ZONE = getTimeZone(storeDetails() && storeDetails().timeZone);
                resolve(moment.tz(dateString, TIME_ZONE).format(YMD_DASH));
        })
        return promise;
};