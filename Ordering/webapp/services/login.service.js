import * as request from 'request';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import * as randomize from 'randomatic';
import { SIGN_OPTIONS, DEV_BFF_URL } from '../util/constants';
import { secretsManager } from '../util/secretsManager/index';

class LoginService {

    authenticate(userPayload, randomtoken) {
        let bffUrl = process.env.bff_base_url || DEV_BFF_URL;
        let options = {
            url: bffUrl+'/services/authenticate',
            method: 'POST',
            body: JSON.stringify(userPayload),
            headers: {
                "content-type": "application/json"
            }
        };
        return new Promise(async (resolve, reject) => {
            //let privateKey = await secretsManager.getPrivateKey();
            let privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8');
            request.post(options, (err, response, body) => {
                if (err) {
                  console.log(`Error from authenticate: ${JSON.stringify(err)}`);
                    reject(err);
                } else if (response.statusCode !== 200) {
                    reject({code: response.statusCode, message: JSON.parse(response.body).message});
                } else {
                    let result = JSON.parse(body);
                    let payload = result.body[0];
                    let token = jwt.sign(payload, privateKey, SIGN_OPTIONS);
                    let refreshToken = randomtoken || randomize('0', 20);
                    let response = {
                        userId: payload.userId,
                        storeId: payload.storeId,
                        token: token,
                        refreshToken: refreshToken
                    };
                    resolve(response);
                }
            })
        });
    }

    refreshAccessToken(userId, storeId) {
        let bffUrl = process.env.bff_base_url || DEV_BFF_URL;
        let options = {
            url: bffUrl+'/services/stores/'+storeId+'/users/'+userId,
            method: 'GET',
            headers: {
                "content-type": "application/json"
            }
        }
        return new Promise(async (resolve, reject) => {
            //let privateKey = await secretsManager.getPrivateKey();
            let privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8');
            request.get(options, (err, response, body) => {
                if (err) {
                    console.log(`Error in refreshAccessToken: ${JSON.stringify(err)}`);
                    reject(err);
                } else {
                    let result = JSON.parse(body);
                    let payload = result.body[0];
                    let token = jwt.sign(payload, privateKey, SIGN_OPTIONS);
                    resolve(token);
                }
            })
        });
    }

    generateJWT(userId, storeId, randomtoken) {
        let bffUrl = process.env.bff_base_url || DEV_BFF_URL;
        let options = {
            url: bffUrl+'/services/stores/' + storeId + '/users/' + userId,
            method: 'GET',
            headers: {
                "content-type": "application/json"
            }
        }
        return new Promise(async (resolve, reject) => {
            //let privateKey = await secretsManager.getPrivateKey();
            let privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8');
            request.get(options, (err, response, body) => {
                if (err) {
                  console.log(`Error from generateJWT: ${JSON.stringify(err)}`);
                    reject(err);
                } else {
                    let result = JSON.parse(body);
                    if (result && result.body) {
                        let payload = result.body[0];
                        let token = jwt.sign(payload, privateKey, SIGN_OPTIONS);
                        let refreshToken = randomtoken || randomize('0', 20);
                        let response = {
                            userId: payload.userId,
                            storeId: payload.storeId,
                            token: token,
                            refreshToken: refreshToken
                        }
                        resolve(response);
                    } else {
                        reject({message: 'UnAuthorized'});
                    }
                }
            })
        });
    }
}
let loginService = new LoginService();
export {
    loginService
}
