import * as babelpollifil from 'babel-polyfill';
import { expect } from 'chai';
import * as sinon from 'sinon';
import fs from 'fs';
import { loginController } from './login.controller.js';
import * as httpMock from 'node-mocks-http';
import { loginService } from '../services/login.service.js';
import jwt from 'jsonwebtoken';
import { secretsManager } from '../util/secretsManager/index';

sinon.defaultConfig = {
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock", "server", "requests"],
    useFakeTimers: true,
    useFakeServer: true
}
let sandbox = sinon.createSandbox(sinon.defaultConfig);
let PRIVATE_KEY;
secretsManager.getPrivateKey().then((key) => { PRIVATE_KEY = key });

describe('logincontroller', () => {
    beforeEach(() => {
    });

    it('successful authentication', (done) => {
        let payload = {
            userId: 41,
            storeId: "12200",
            token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZUlkIjoiMTIyMDAiLCJ1c2VySWQiOjQxLCJhc3NpZ25lZFJvbGVzIjpbeyJyZXNvdXJjZVByaXZpbGVnZXMiOlt7InJlc291cmNlU2NvcGUiOlsiSVNQIiwiR09UIl0sInJlc291cmNlQWNjZXNzIjpbInJlYWQiLCJ3cml0ZSIsIm1vZGlmeSIsImRlbGV0ZSJdLCJyZXNvdXJjZU5hbWUiOiJTaW5nbGVEYXlPcmRlcmluZyIsInJlc291cmNlVHlwZSI6IlNjcmVlbiJ9XSwicm9sZUlkIjoxLCJyb2xlTmFtZSI6IlN0b3JlIE1hbmFnZXJcIiIsInJvbGVEZXNjcmlwdGlvbiI6Ik1hbmFnZXIgcmVzcG9uc2libGUgZm9yIHRoZSBzdG9yZSBvcGVyYXRpb25zIiwicm9sZVR5cGUiOiJJbi1TdG9yZSIsInNlY3VyaXR5TGV2ZWwiOiIzIiwic3lzdGVtUHJpdmlsZWdlcyI6eyJhc3NpZ25Sb2xlcyI6IlkiLCJyZXNldFBhc3N3b3JkIjoiWSIsInJlc2V0UGFzc3dvcmRPdGhlcnMiOiJZIn0sInVwZGF0ZWRUaW1lU3RhbXAiOiIyMDE5LTA0LTAyVDE2OjAwOjM0LjAwMFoiLCJ1cGRhdGVkQnkiOiJJbnN0YWxsZXIifV0sImlhdCI6MTU1ODM4NDQzMSwiZXhwIjoxNTU4Mzg0NDkxfQ.Ry - Dd38iPRYtlpaRSOZCE - G9Mn5ppKqsGPMf9321vb8nukWlEeEPI3zzIr7vleoiWHLxy60F51nVe_0WWkjTXw",
            refreshToken: "70945116332783710487"
        }
        sandbox.replace(loginService, "authenticate", () => {
            return payload;
        });
        let req = httpMock.createRequest({
            method: 'POST',
            url: '/login',
            body: {
                userId: 41,
                storeId: "12200",
                password: "711291"
            }
        });
        let res = httpMock.createResponse({ eventEmitter: require('events').EventEmitter });
        loginController.authenticate(req, res).then(() => {
            expect(res.statusCode).to.equal(200);
            let result = res._getData();
            expect(result).to.be.an.instanceOf(Object);
            expect(result).to.deep.equal(payload);
            done();
        });
    });

    it('token expired and return refresh token', (done) => {
        let privateKey = PRIVATE_KEYl;
        sandbox.replace(fs, "readFileSync", () => {
            return privateKey;
        });
        let refreshTokens = {
            70945116332783710487: {
                userId: 41,
                password: "711291",
                storeId: "12200",
                iat: 1558456607,
                exp: 1558456907
            }
        }
        let req = httpMock.createRequest({
            method: 'POST',
            url: '/token',
            body: {
                userId: 41,
                storeId: "12200",
                refreshToken: "70945116332783710487"
            },
            app: {
                get(refretokens) {
                    return refreshTokens;
                }
            }
        });

        let signOptions = {
            expiresIn: 60,
            algorithm: 'RS256'
        }
        let newToken = jwt.sign(req.body, privateKey, signOptions);
        let res = httpMock.createResponse({ eventEmitter: require('events').EventEmitter });
        sandbox.replace(loginService, "refreshAccessToken", () => {
            return newToken;
        });
        loginController.refreshAccessToken(req, res).then(() => {
            expect(res._getData()).to.not.equal(undefined);
            done();
        });
    });
    afterEach(() => {
        sandbox.restore();
    });
});

