const TOKEN = 'token';
const IV = 'Jo302KLRxdOVjMOPU7it4w==';
const ALGORITHM = 'aes-256-cbc';
const DECRYPT_KEY = 'bPeShVmYq3t6w9z$C&F)H@McQfTjWnZr';
const IP_PATTERN = /^(10)\.([0-9]|[1-8][0-9]|9[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-8][0-9]|9[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.(10)$/;
const ISP = 'ISP';
const PRODUCTION = 'production';
const SIGN_OPTIONS = {
    expiresIn: 15 * 60,
    algorithm: 'RS256'
};
const DEV_BFF_URL = 'http://storesytemservice.ris-dev.7-eleven.com'; // UPDATED DEV BFF URL
// const DEV_BFF_URL = 'http://app-S-LoadB-12T6HRWGZCNK7-d3dd5873c2e1e4fb.elb.us-east-1.amazonaws.com'; // THIS IS QA FOR LOCAL TESTING
const REDIS_STORE_ID_KEY = 'redisStoreId';
const FLAGGED_STORE_ID = '37126';
const REPLACE_STORE_ID = {
    '37126': '35408',
    '35408': '37067',
    '37067': '35378',
    '35378': '35408'
};
const ACCESS_TOKEN_EXPIRY = 240;
const GET = 'GET';
const POST = 'POST';
const ENTER_METHOD = 'Entering the method: ';
const EXIT_METHOD = 'Exiting the method: ';
const EXCEPTION_STRING = 'Exception Occured in: ';
const AUTHORIZATION = 'authorization';

export {
    TOKEN,
    IV,
    ALGORITHM,
    DECRYPT_KEY,
    IP_PATTERN,
    ISP,
    PRODUCTION,
    SIGN_OPTIONS,
    DEV_BFF_URL,
    ACCESS_TOKEN_EXPIRY,
    GET,
    POST,
    ENTER_METHOD,
    EXIT_METHOD,
    EXCEPTION_STRING,
    AUTHORIZATION,
    FLAGGED_STORE_ID,
    REPLACE_STORE_ID,
    REDIS_STORE_ID_KEY
}
