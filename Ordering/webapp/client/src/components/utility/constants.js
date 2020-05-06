const SHORT_DAY_FORMAT = 'ddd';
const DATE_SEPARATOR = '-';
const DATE_PERIOD_SEPARATOR = '. ';
const DEFAULT_TIME_ZONE = 'UTC';
const ISO_FORMAT = 'YYYY-MM-DD';
const MM_DD_FORMAT = 'MM/DD';
const DAY_DATE_FORMAT = 'ddd MM/DD';
const SESSION_EXPIRED = 'Session Expired';
const APPLICATION_SESSION_TIMEOUT = 15 * 60;
const TOKEN_REFRESH_TIME = 294000;
const SESSION_EXPIRY_MSG = `<p>Your session expired as its been idle for ${APPLICATION_SESSION_TIMEOUT / (60)} mins.</p>`;
const CLIENT_SESSION_TIMEOUT = 900000;
const UNAUTHORIZED_TITLE = 'Unauthorized';
const UNAUTHORIZED_MSG = 'You are not authorized to view the application, please close the browser and relogin';
const ORDERING = 'ordering';
const SAVE_TIME_INTERVAL = 60000;
const UNSAVED_MSG_TITLE = 'Unsaved Items';
const UNSAVED_MSG_BODY = 'Are you sure you want to exit?';
const CENTRAL_TIME_ZONE = "America/Chicago";
const ORDER_QTY_REGEX = /^[0-9\b]{0,4}$/;
const TOTAL_REGEX = /^^[-+]?\d{0,4}$/;
const VALID_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const ALLOWED_KEY_CODES = [8,9,13];
const DISALLOWED_KEY_CODES = [69,190]
const DISALLOWED_KEYS = ["+","-","_",".",","]

const MOMENT_TIMEZONE = (key) => {
    switch (key) {
        case "CST" || "C": return 'America/Chicago';
        case "UTC": return 'UTC';
        case "MST" || "M": return 'America/Denver';
        case "PST" || "P": return 'America/Los_Angeles';
        case "EST" || "E": return 'America/New_York';
        default: return key;
    }
};
export {
    SHORT_DAY_FORMAT,
    DATE_SEPARATOR,
    DEFAULT_TIME_ZONE,
    ISO_FORMAT,
    MM_DD_FORMAT,
    DAY_DATE_FORMAT,
    DATE_PERIOD_SEPARATOR,
    SESSION_EXPIRED,
    SESSION_EXPIRY_MSG,
    CLIENT_SESSION_TIMEOUT,
    UNAUTHORIZED_TITLE,
    UNAUTHORIZED_MSG,
    ORDERING,
    SAVE_TIME_INTERVAL,
    UNSAVED_MSG_TITLE,
    UNSAVED_MSG_BODY,
    CENTRAL_TIME_ZONE,
    TOKEN_REFRESH_TIME,
    APPLICATION_SESSION_TIMEOUT,
    MOMENT_TIMEZONE,
    ORDER_QTY_REGEX,
    TOTAL_REGEX,
    VALID_KEYS,
    ALLOWED_KEY_CODES,
    DISALLOWED_KEY_CODES,
    DISALLOWED_KEYS
}

