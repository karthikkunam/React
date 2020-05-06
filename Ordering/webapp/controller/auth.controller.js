import { authService } from '../services/auth.service';
import * as moment from 'moment';
import {
  TOKEN,
  ISP,
  IP_PATTERN,
  PRODUCTION,
  ACCESS_TOKEN_EXPIRY,
  AUTHORIZATION,
  FLAGGED_STORE_ID,
  REPLACE_STORE_ID,
  REDIS_STORE_ID_KEY,
} from '../util/constants';
import { AuthUtil } from '../util/auth.util';
//import { log } from '../logging/logger';
import { RedisUtil } from '../util/redis.util';
import { readOnlyUtil } from '../util/readOnlyUtil';
import { encode } from '../util/string.util';
import * as LoggingConstants from '../util/loggingConstants';
var appPackage = require('../package.json');

// @log
class AuthController {
  async authenticate(req, res, next) {
    if (req.params && req.params[TOKEN]) {
      let encryptedData = req.params[TOKEN];
      try {
        logger.debug(`Authenticating token ${JSON.stringify(encryptedData)}`, {
          [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID,
        });
        console.log(`Authenticating token ${JSON.stringify(encryptedData)}`);
        // auth controller for test
        let decryptedPayload = await AuthUtil.decrypt(encryptedData);
        if (
          (process.env.ENVIRONMENT === 'local' ||
            process.env.ENVIRONMENT === 'dev' ||
            process.env.ENVIRONMENT === 'qa') &&
          decryptedPayload.storeId === FLAGGED_STORE_ID
        ) {
          logger.debug(`StoreId ${decryptedPayload.storeId} flagged`);
          const storeIdInRedis = await RedisUtil.getFromRedis(
            REDIS_STORE_ID_KEY
          );
          logger.debug(
            `storeID's in Redis ${storeIdInRedis}, StoreIDKey: ${REDIS_STORE_ID_KEY}`
          );

          if (!storeIdInRedis || storeIdInRedis === undefined) {
            logger.debug(
              `REPLACE_STORE_ID[0] : ${REPLACE_STORE_ID[0]} ${JSON.stringify(
                REPLACE_STORE_ID
              )}`
            );
            decryptedPayload.storeId = REPLACE_STORE_ID[FLAGGED_STORE_ID];
          } else {
            decryptedPayload.storeId = REPLACE_STORE_ID[storeIdInRedis];
          }
          await RedisUtil.setToRedis(
            REDIS_STORE_ID_KEY,
            decryptedPayload.storeId
          );
          logger.debug(`Replaced storeId with ${decryptedPayload.storeId}`);
        }
        // TODO This code should be enabled once ARIS pushes PROMO functionality to production to validate Ip Address
        // let clientIpAddress = null;
        // if (req.connection && req.connection.remoteAddress) {
        //     let clientIpAddressArray = req.connection.remoteAddress.split(':');
        //     clientIpAddress = clientIpAddressArray[clientIpAddressArray.length - 1];
        //     logger.info(`Extracted clientIpAddress from request as ${clientIpAddress}`);
        // }
        // if (clientIpAddress !== decryptedPayload.ip) {
        //     console.log(`clientIp ${clientIpAddress} does not match with the ip address ${decryptedPayload.ip} in the token`);
        //     next();
        // }
        let utcValue = moment.utc().valueOf().toString();
        let currentUtcTime = parseInt(utcValue.slice(0, -3));
        let ageOfToken = currentUtcTime - parseInt(decryptedPayload.timeStamp);
        logger.debug(
          `Environment: ${process.env.ENVIRONMENT}, package Version: ${appPackage.version}`,
          {
            [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID,
            [LoggingConstants.STORE_ID]: decryptedPayload.storeId,
          }
        );
        if (ageOfToken <= ACCESS_TOKEN_EXPIRY) {
          let userData;
          let isOrderingEnabled = false;
          let userDataExists = false;
          const allowedStore = await authService.getStoreProfile(
            decryptedPayload.storeId
          );
          if (
            allowedStore &&
            allowedStore.features &&
            allowedStore.features.boss
          ) {
            isOrderingEnabled = allowedStore.features.boss.isOrderingEnabled;
          }
          if (isOrderingEnabled) {
            userData = await authService.getUserData(
              decryptedPayload.userId,
              decryptedPayload.storeId
            );
            if (userData && !userData.code) {
              userDataExists = true;
            }
          }
          if (userDataExists && isOrderingEnabled) {
            let payload = await authService.buildPayload(
              decryptedPayload,
              userData,
              allowedStore
            );
            payload.app = {
              environment: process.env.ENVIRONMENT
                ? process.env.ENVIRONMENT
                : 'local',
              version: appPackage.version ? appPackage.version : '0.0.1-alpha',
            };
            let updatedPayload;
            let refreshToken = await this.getRefreshToken(payload.storeId);
            if (payload.deviceType === ISP) {
              logger.debug('Authenticating user from ISP', {
                [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID,
              });
              updatedPayload = await authService.generateJWT(
                payload,
                refreshToken
              );
            } else {
              logger.debug('Authenticating user from 7MD', {
                [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID,
              });
              //updatedPayload = await authService.authenticate(payload, refreshToken);

              //Temporary until auth service url starts working.
              updatedPayload = await authService.generateJWT(
                payload,
                refreshToken
              );
            }
            updatedPayload.timezone = decryptedPayload.timezone;
            updatedPayload.deviceType = decryptedPayload.deviceType;
            res.locals.oAuthTokenPayload = updatedPayload;
            logger.info(
              `JWT oAuth token ${JSON.stringify(updatedPayload.token)}`,
              {
                [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID,
                [LoggingConstants.STORE_ID]: decryptedPayload.storeId,
              }
            );
            let encodedPayload = encode(JSON.stringify(decryptedPayload));
            await RedisUtil.setToRedis(
              updatedPayload.refreshToken,
              encodedPayload
            );
            next();
          } else {
            logger.info(
              `User or Ordering is not allowed at store: ${decryptedPayload.storeId} with userId ${userData.userId}`,
              {
                [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID,
                [LoggingConstants.STORE_ID]: decryptedPayload.storeId,
              }
            );
            next();
          }
        } else {
          logger.info('Launch token is expired', {
            [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID,
          });
          next();
        }
      } catch (err) {
        logger.error(`${JSON.stringify(err)} In Error condition`);
        return next();
      }
    } else {
      next();
    }
  }

  async getUuidController(req, res, next) {
    const uuid = req.params.token;
    let uuidData = await authService.getUuid(uuid);
    return `${uuidData}`;
  }

  /* REMOTE LOGIN */
  async validateJWT(req, res, next) {
    let authorizationToken = req.headers[AUTHORIZATION];
    if (authorizationToken) {
      try {
        logger.debug('Validating JWT', {
          [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID,
        });
        let decodedAuthPayload = await authService.validateJWT(
          authorizationToken
        );
        req.header('user', decodedAuthPayload);
        next();
      } catch (err) {
        logger.error(`${JSON.stringify(err)}`, {
          [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID,
        });
        if (err.name === 'TokenExpiredError') {
          res.status(401).send('Token Expired');
        } else {
          res.status(401).send('Unauthorized');
        }
      }
    } else {
      logger.debug('Failed to validate JWT', {
        [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID,
      });
      res.status(401).send('Unauthorized');
    }
  }

  // async validateJWT(req, res, next) {
  //     let authorizationToken = req.headers[AUTHORIZATION];
  //     if (authorizationToken) {
  //         try {
  //             logger.debug('Validating JWT', { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
  //             let decodedAuthPayload = await authService.validateJWT(authorizationToken);
  //             /**Validate Post calls for Roles & readOnlyView */
  //             if(decodedAuthPayload){
  //                 const isUserRequestInvalid = readOnlyUtil(decodedAuthPayload);
  //                 //console.log("isUserRequestInvalid", req.method, isUserRequestInvalid);
  //                 if(isUserRequestInvalid && req.method === "PUT"){
  //                     res.status(401).send("Unauthorized");
  //                 }
  //             }
  //             req.header('user', decodedAuthPayload);
  //             next();
  //         } catch (err) {
  //             logger.error(`${JSON.stringify(err)}`, {[LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
  //             if (err.name === 'TokenExpiredError') {
  //                 res.status(401).send("Token Expired");
  //             } else {
  //                 res.status(401).send("Unauthorized");
  //             }
  //         }
  //     } else {
  //         logger.debug('Failed to validate JWT', {[LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
  //         res.status(401).send("Unauthorized");
  //     }
  // }

  async getRefreshToken(storeId) {
    let currentUtcTime = parseInt(
      moment.utc().valueOf().toString().slice(0, -3)
    );
    logger.debug(
      `************************ 7boss_${storeId}_${currentUtcTime}`,
      { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID }
    );
    return `7boss_${storeId}_${currentUtcTime}`;
  }

  async isTokenValid(req, res) {
    let authorizationToken = req.headers[AUTHORIZATION];
    if (authorizationToken) {
      try {
        let decodedAuthPayload = await authService.validateJWT(
          authorizationToken
        );
        decodedAuthPayload
          ? res.status(200).send(true)
          : res.status(200).send(false);
      } catch (err) {
        logger.error(err);
        res.status(200).send(false);
      }
    }
  }

  async refreshAccessToken(req, res) {
    try {
      logger.info('refresh token called');
      let inputData = req.body;
      let payload = {
        userId: inputData.userId,
        storeId: inputData.storeId,
        refreshToken: inputData.refreshToken,
      };
      let result = await authService.refreshAccessToken(payload);
      res.status(200).send(result);
    } catch (error) {
      logger.error(error);
      res.status(500).send({
        message: 'Internal Server Error',
      });
    }
  }

  // async refreshAccessToken(req, res) {
  //     try {
  //         logger.info('refresh token called');
  //         let inputData = req.body;
  //         let userId = inputData.userId;
  //         let storeId = inputData.storeId;
  //         let refreshToken = inputData.refreshToken;
  //         let userPayloadFromRedis = await RedisUtil.getFromRedis(refreshToken);
  //         if(!userPayloadFromRedis){
  //             res.status(401).send("Session Expired");
  //         } else {
  //             let decodedRedisPayload = decode(userPayloadFromRedis);
  //             if ((decodedRedisPayload) &&
  //                 (decodedRedisPayload.userId === userId &&
  //                     decodedRedisPayload.storeId === storeId)) {
  //                 let currentUtcTime = parseInt(moment.utc().format().toString().slice(0,-3));
  //                 //let result = await authService.refreshAccessToken(userId, storeId, currentUtcTime);
  //                 let result = await authService.refreshAccessToken(decodedRedisPayload, currentUtcTime);
  //                 res.status(200).send(result);
  //             }
  //             else {
  //                 res.status(401).send("Session Expired");
  //             }
  //         }
  //     } catch (error) {
  //         logger.error(error);
  //         res.status(500).send({ message: "Internal Server Error" });
  //     }
  // }
}

let authController = new AuthController();

export { authController };
