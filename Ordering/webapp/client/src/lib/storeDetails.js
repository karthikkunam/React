import jwtDecode from 'jwt-decode';
import _ from 'lodash';
import store from '../index';

/**
 * Common library that takes token value and return store and user details derived from decoding the token
 * @param {String} token
 */
export const storeDetails = () => {
  const state = store && store.getState();
  let token =
    state &&
    state.login &&
    state.login.loginData &&
    state.login.loginData.payload &&
    state.login.loginData.payload.token;

  const decodedTokenValue = token && jwtDecode(token);
  if (decodedTokenValue && !_.isEmpty(decodedTokenValue)) {
    const {
      store: {
        storeId,
        timeZone,
        user: { userId, fullName, roles },
        features: {
          store: { isGRAutoApprove },
        },
      },
      app: { environment, version },
      address,
      deviceType,
      readOnly,
    } = decodedTokenValue;

    return {
      storeId,
      timeZone,
      address,
      userId,
      fullName,
      roles,
      deviceType,
      isGRAutoApprove,
      environment,
      version,
      readOnly,
    };
  } else {
    //console.log(`unable to get details of store and user from token`)
    return null;
  }
};
// usage:
// console.log(
//     storeDetails(tokenvalue).storeId)
