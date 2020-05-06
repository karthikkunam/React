const URL = 'http://ordering-development.com.s3-website-us-east-1.amazonaws.com/';
const BFF_ORDERING_API = 'https://40nevj7r9a.execute-api.us-east-1.amazonaws.com/live/store/categories';
const ORDER_DETAIL_API = 'https://72b0uqva0i.execute-api.us-east-1.amazonaws.com/live/stores/37126/ordering/dailyorders/2018-12-20';
const localHostUrl = "http://localhost:3006/#/";
const ID_X_PATH = 'input[id=userId]';
const ID_X_VALUE = '41';
const PASSWORD_X_PATH = 'input[id=password]';
const PASSWORD_X_VALUE = '711291';
const SUBMIT_X_PATH = 'input[class=login-submit]';


module.exports = {
    URL,
    localHostUrl,
    ID_X_PATH,
    ID_X_VALUE,
    PASSWORD_X_PATH,
    PASSWORD_X_VALUE,
    SUBMIT_X_PATH,
    BFF_ORDERING_API,
    ORDER_DETAIL_API
  }