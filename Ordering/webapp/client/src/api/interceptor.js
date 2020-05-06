import axios from 'axios';
import store from '../index';
import * as types from '../constants/ActionTypes'


// let isRefreshing = false;
// let lastRefreshedTokenAt;
// let refreshSubscribers = [];
// const sesssionTimeoutVal = 1000 * 60 * 15;

const createApiClient = (url) => {
    const instance = axios.create({
        baseURL: url
    });
    instance.interceptors.request.use((req) => requestHandler(req));
    instance.interceptors.response.use(response => successHandler(response), err => errorHandler(err));
    return instance;
}

const requestHandler = (req) => {
    const state = store.getState();
    let loginPayload = state.login.loginData.payload;
    req.headers['content-type'] = 'application/json';
    req.headers['authorization'] = loginPayload.token;
    return req;
}

const successHandler = (response) => {
    return response;
}

const errorHandler = async (err) => {
    const { response } = err;
    console.log(err);
    if( response && response.status === 401){
        store.dispatch({ type: types.LOGIN, payload : false });
    }

    /** Refresh the bearer token after getting the 401 from the server approach
    const state = store.getState();
    const { config, response: { status } } = err;
    const originalRequest = config;

    if (status === 401) {
        let lastActivityAt = state.session.sessionData.lastActivityAt;
        if (isTokenRefreshValid(lastActivityAt)) {
            const loginPayload = state.login.loginData.payload;
            let refreshTokenPromise = refresherAccessToken(loginPayload);
            isRefreshing = true;
            refreshTokenPromise.then(result => {
                isRefreshing = false;
                lastRefreshedTokenAt = moment();
                let token = result.data;
                afterRefresh(token);
                refreshSubscribers = [];
            });

        }
        const retryOriginalRequest = new Promise((resolve, reject) => {
            addRefreshSubscriber(token => {
                // replace the expired token and retry
                originalRequest.headers['authorization'] = token;
                originalRequest.url = '';
                resolve(axios(originalRequest));
            });
        });
        return retryOriginalRequest;
    } else {
        return Promise.reject(err);
    } */
}

// const refresherAccessToken = (loginPayload) => {
//     return new Promise(async (resolve, reject) => {
//         const refreshPayload = {
//             userId: loginPayload.userId,
//             storeId: loginPayload.storeId,
//             refreshToken: loginPayload.refreshToken
//         }
//         const refreshSessionToken = () => createApiClient('/token');
//         let response = await refreshSessionToken().post('', refreshPayload);
//         resolve(response);
//     });
// }

// const addRefreshSubscriber = (callback) => refreshSubscribers.push(callback);

// const afterRefresh = (token) => refreshSubscribers.map(callback => callback(token));

// const isTokenRefreshValid = (lastActivityAt) => {
//     let currentTime = moment();
//     let isValid = !isRefreshing &&
//         moment.duration(currentTime.diff(lastActivityAt)).asMinutes() < sesssionTimeoutVal &&
//         (!lastRefreshedTokenAt || moment.duration(currentTime.diff(lastRefreshedTokenAt)).asMinutes() >= sesssionTimeoutVal);
//     return isValid;
// }

export default createApiClient;