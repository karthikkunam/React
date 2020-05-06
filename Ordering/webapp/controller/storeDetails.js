import jwtDecode from 'jwt-decode';
import _ from 'lodash';

/**
 * Common library that takes token value and return store and user details derived from decoding the token
 * @param {String} token 
 */
export const storeDetails = (token) => {
    const decodedTokenValue = jwtDecode(token);
    if (decodedTokenValue && !_.isEmpty(decodedTokenValue) && !_.isEmpty(decodedTokenValue.user) && !_.isEmpty(decodedTokenValue.store)) {
        const {
            store: {
                storeId,
                timeZone,
                address
            },
            user: {
                userId,
                firstName,
                lastName,
                assignedRoles
            }
        } = decodedTokenValue;

        return {
            storeId,
            timeZone,
            address,
            userId,
            firstName,
            lastName,
            assignedRoles,
        }
    } else {
        //console.log(`unable to get details of store and user from token`)
        return null;
    }
}
// usage:
// console.log(
//     storeDetails(tokenvalue).storeId)