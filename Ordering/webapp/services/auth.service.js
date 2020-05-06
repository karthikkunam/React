import jwt from 'jsonwebtoken';
import fs from 'fs';
import * as request from 'request';
import * as randomize from 'randomatic';
import { SIGN_OPTIONS } from '../util/constants';
import { BaseService } from './base.service';
//import { log } from '../logging/logger';
import * as chalk from 'chalk';
import { secretsManager } from '../util/secretsManager/index';
import * as LoggingConstants from '../util/loggingConstants';

const warning = chalk.yellowBright;
const good = chalk.greenBright;
const bad = chalk.redBright;
//@log
class AuthService extends BaseService {
    authenticate(userPayload, randomToken) {
        logger.debug('Authenticating token', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
        return new Promise(async (resolve, reject) => {
            let url = '/services/authenticate';
            try {
                let result = await this.httpPost(url, userPayload);
                logger.debug(`Result: ${JSON.stringify(result)}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                logger.debug(`result.code: ${result.statusCode}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                if (result.data && result.data.storeId && result.data.userId) {
                    //let respones = this.generateJWT(result.user.userId, result.user.storeId, randomToken, true);
                    let response = await this.generateJWT(userPayload, randomToken, true);
                    if (response) {
                        logger.debug('Response found from generateJWT', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                        resolve(response);
                    } else {
                        logger.debug('Token Unauthorized');
                        reject({message: 'UnAuthorized'});
                    }
                } else {
                    logger.debug(`Failed to authorize, statusCode: ${result.statusCode}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                    reject({code: result.statusCode, message: JSON.parse(result.body).message});
                }
            } catch (err) {
                logger.error(err, 'Error while authenticating', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                reject({message: 'UnAuthorized'});
            }
        });
    }

    // refreshAccessToken(incoming, randomToken) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             logger.debug(`Incoming in service.refreshAccessToken: ${JSON.stringify(incoming)}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
    //             let response = this.generateToken(incoming, randomToken, false);
    //             if (response) {
    //                 logger.debug('Refreshed access token', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
    //                 resolve(response);
    //             } else {
    //                 logger.debug('Failed to refresh access token', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
    //                 reject({message: 'UnAuthorized'});
    //             }
    //         } catch (err) {
    //             logger.error(err, 'Error refreshing access token', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
    //             reject({message: 'UnAuthorized'});
    //         }
    //     });
    // }

    async refreshAccessToken(incoming) {
        let options = {
            url: `${process.env.bff_auth_base_url}/7boss/order/auth/refresh/token`,
            method: 'POST',
            body: JSON.stringify(incoming),
            headers: {
                "content-type": "application/json"
            }
        }
        return new Promise(async (resolve, reject) => {
            request.post(options, (err, response, body) => {
                if (err) {
                    console.log(`'Error refreshing access token ${JSON.stringify(err)}`);
                    reject(err);
                } else if (response.statusCode !== 200) {
                    reject({
                        code: response.statusCode,
                        message: JSON.parse(response.body).message
                    });
                } else {
                    resolve(response);
                }
            })
        });
    }

    generateJWT(incoming, randomToken) {
        return new Promise(async (resolve, reject) => {
            try {
                logger.debug('Generating token...', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                let response = await this.generateToken(incoming, randomToken, true);
                if (response) {
                    resolve(response);
                } else {
                    logger.debug('Failed to generate token', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                    reject({message: 'UnAuthorized'});
                }
            } catch (err) {
                logger.error(err, 'Error generating JWT', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                reject({message: 'UnAuthorized'});
            }
        });
    }

    async generateToken(incoming, randomToken, generateRefreshToken) {
        try {
            let lr = incoming;
            if (lr.password) {
                delete lr['password'];
            }
            logger.debug(`Generating token from payload ${JSON.stringify(lr)}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });

            let response = await this.signJWT(lr, generateRefreshToken, randomToken);
            logger.debug('Token generation successful', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            return response;
        } catch (error) {
            logger.error(error, `Error generating token, ERROR: ${JSON.stringify(error)}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            throw(error);
        }
    }

    /* REMOTE LOGIN */
    async validateJWT(authorizationToken) {
        let options = {
            url: `${process.env.bff_auth_base_url}/7boss/order/auth/validate`,
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": authorizationToken
            }
        }
        return new Promise(async (resolve, reject) => {
            request.get(options, (err, response, body) => {
                if (body && body.error) {
                    reject(body.error);
                }
                resolve(body);
            })
        });
    }

    // validateJWT(authorizationToken) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             logger.debug('Verifying JWT', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
    //             let publicKey = await secretsManager.getPublicKey();
    //             let decodedAuthPayload = jwt.verify(authorizationToken, publicKey, SIGN_OPTIONS);
    //             logger.debug('Finished verifying JWT', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
    //             resolve(decodedAuthPayload);
    //         } catch (err) {
    //             logger.error(err, 'Error validating JWT');
    //             reject(err);
    //         }
    //     });
    // }

    signJWT(result, needRefreshToken, randomtoken) {
        return new Promise(async (resolve, reject) => {
        try {
            let response;
            logger.debug('Attempting to sign JWT', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            if (result) {
                let payload = result;
                let privateKey = await secretsManager.getPrivateKey();
                let token = jwt.sign(payload, privateKey, SIGN_OPTIONS);
                if (needRefreshToken) {
                    let refreshToken = randomtoken || randomize('0', 20);
                    logger.debug(`payload : ${JSON.stringify(payload)}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                    response = {
                        userId: payload.userId,
                        storeId: payload.storeId,
                        token: token,
                        refreshToken: refreshToken
                    }
                } else {
                    response = token;
                }
            }
            logger.debug('Finished signing JWT', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            resolve(response);
        } catch (error) {
            logger.error(error, 'Error signing JWT', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            reject(error);
        }
        })
    }


    getUserData(userId, storeId) {
        return new Promise(async (resolve, reject) => {
            let userData = null;
            if (!storeId || !userId) {
                resolve(userData);
            }
            logger.debug(`Getting user data with userId ${userId} and store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            let url = '/services/stores/' + storeId + '/users/' + userId;
            try {
                let response = await this.httpGet(url);
                logger.debug(`http response code for User Request : ${JSON.stringify(response.data)}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                if (response && !response.code && response.data) {
                    userData = response.data;
                }
                logger.debug(`Got userData ${JSON.stringify(userData)}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                resolve(userData);
            } catch (err) {
                logger.error(err, 'Error getting user data', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                reject({"code": 404, "message": JSON.parse(err).messaage});
            }
        });
    }

    getStoreProfile(storeId) {
        return new Promise(async (resolve, reject) => {
            logger.debug(`Getting storeProfile for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            let storeProfile = null;
            if (!storeId) {
                logger.debug(`StoreProfile not found for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                resolve(storeProfile);
            }
            let store = {};
            try {
                let storeInfo = await this.getStoreSettings(storeId);
                if (!storeInfo) {
                    logger.debug(`Failed to get storeInfo for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                }
                let storeFeatures = await this.getStoreFeatures(storeId);
                if (!storeFeatures) {
                    logger.debug(`Failed to get storeFeatures for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                }

                if (storeInfo && storeFeatures) {
                    store = storeInfo;
                    store.features = storeFeatures;
                    logger.debug(`Fetching storeProfile successful for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                    resolve(store);
                } else {
                    logger.debug(`Failed to get storeInfo for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                    reject({"code": 404, message: 'Store Info not found!'});
                }
            } catch (err) {
                logger.error(err, `Error getting storeProfile for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                reject({"code": 500, message: 'Server Error while retrieving store settings/features'});
            }
        });
    }

    getStoreSettings(storeId) {
        return new Promise(async (resolve, reject) => {
            let url = '/services/stores/' + storeId;
            try {
                logger.debug(`Getting store settings for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                let response = await this.httpGet(url);
                if (response && !response.code && response.data) {
                    logger.debug(`Fetching storeSettings successful for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                    resolve(response.data);
                } else {
                    logger.debug(`Failed to get StoreSettings for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                    reject({"code": 404, message: 'Store settings not available!'});
                }
            } catch (err) {
                logger.error(JSON.stringify(err), `Error getting store settings for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                reject({"code": 500, message: 'Server Error while retrieving store settings.'});
            }
        });
    }

    getStoreFeatures(storeId) {
        return new Promise(async (resolve, reject) => {
            let url = '/services/stores/' + storeId + '/features';
            try {
                logger.debug(`Getting store features for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                let response = await this.httpGet(url);
                if (response && !response.code && response.data) {
                    logger.debug(`Fetching storeFeatures successful for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                    resolve(response.data);
                } else {
                    logger.debug(`Failed to get storeFeatures for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                    reject({"code": 404, message: 'Store features not available'});
                }
            } catch (err) {
                logger.error(JSON.stringify(err), `Error getting storeFeatures for store ${storeId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                reject({"code": 500, message: 'Server Error while retrieving store features'});
            }
        });
    }

    async buildPayload(decryptedPayload, userData, storeProfile) {
        try {
            let payloadObject = decryptedPayload;
            logger.debug(`Building payload for user ${userData.userId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            delete payloadObject['timeZone'];
            payloadObject.store = storeProfile;
            payloadObject.store.user = {
                userId: userData.userId,
                fullName: (userData.firstName ? userData.firstName : '') + ' ' + (userData.lastName ? userData.lastName : ''),
                roles: userData.roles
            };
            logger.debug(`Built payload for user ${userData.userId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            return Promise.resolve((payloadObject));
        } catch (err) {
            logger.error(JSON.stringify(err), `Error building payload for user ${userData.userId}`, { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            return Promise.reject({ message: 'Error building payload' });
        }
    }

    async getUuid(uuid) {
        let options = {
            url: `${process.env.bff_auth_base_url}/7boss/order/auth/${uuid}`,
            method: 'GET',
            headers: {
                "content-type": "application/json"
            }
        }
        return new Promise(async (resolve, reject) => {
            request.get(options, (err, response, body) => {
                if (body && body.error) {
                    reject(body.error);
                }
                let statusCode = response.statusCode;
                if (statusCode === 200) {
                    resolve(body);
                } else {
                    resolve("error");
                }
            })
        });
    }

}

let authService = new AuthService();

export {
    authService
}
