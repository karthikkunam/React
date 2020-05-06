import * as babelpollifil from 'babel-polyfill';
import * as sinon from 'sinon';
import {AuthUtil} from '../util/auth.util';
import {authService} from "../services/auth.service.js";
import {authController} from "../controller/auth.controller";
import * as moment from 'moment';
import * as httpMock from "node-mocks-http";

let utcValue = moment.utc().valueOf().toString();
let currentUtcTime = parseInt(utcValue.slice(0, -3));

const testObject = {
    "userId": 41,
    "storeId": "18473",
    "deviceType": "ISP",
    "feature": "ordering",
    "ip": "192.168.137.29",
    "password": "711291",
    "dateTime": `${moment.utc().format()}`,
    "timeZone": "Utc"
};

const testToken = {
    value: "TwHZCeS2Yo%2bl3NFkhGT%2bAbZsMdlMsn6Ea0wLiyQp7%2bK%2f2qITWZvmzV%2bEnTG6r7EciDZ%2b33jiHJWBwWT07Q%2brao4vLi%2flq4FdUB2tTHckkehEM4bxmU8%2bULZVkU0LlOveern2%2fCaZ00R3VgJjmZkCHjz0Nj6FZfHRjf%2bJMrajWxZ%2fo5RD%2fQlFafnSVnE8Oc48nnnBai%2bRZkP521vNZrDdk4GUD2QRlTpIP02WqmSKLrDXf%2bDTrcYiALMXh5mvQ4gAntQZ04ElutkKUII001OBZhasPeutmrFPXstSJU3ImDcRgpTTpRaA%2bSL3jaHmuKnuRK5PrhWYLexDTwqSu0hrx8%2foDwRhvrRZPyLxKf2DgvCX2Hc%2fV1bTu7fMSX51BbN1Uxz8kQJLlLimndS%2b8Qu1zCDpd19mo4jaUD%2f8e4NvbT6Wu52yc0nLRqan%2f9OiiWQr%2fdl0aDABOPiwMhMWaMIrf2CvPUl49OUSCGeVZtt53H2Vi0TM%2bBNKQKxl7Z16O63581UzafjlZeMQCGprED2VwKTcWfrOpLEiJ9toAELvzZi%2b8yqaret92NTq9L6F1XhaUOUij9c%2fdOrdlsYYVN5O1KbZi9z8NR9i88pzR3%2fNwz2kEyQAN9JMzYHoKaPBaPrRyGsBrSk9JTK9MFmyuiq%2bFO3rtblGm%2b2uXgT2H3ytYUU%3d"
};

let generateJWTStub = sinon.stub(authService, 'generateJWT');
let validateJWTStub = sinon.stub(authService, 'validateJWT');

describe('authController', () => {
    before(() => {
        testObject.timeStamp = currentUtcTime;
    });

    after(() => {
        testObject.timeStamp = currentUtcTime;
    });

    afterEach( () => {
        generateJWTStub.restore();
    });

    it('Should authenticate the request', async () => {
        const tokenString = JSON.stringify(testObject);
        const encryptedToken = await AuthUtil.encrypt(tokenString);
        const params = { "token": encryptedToken };
        let payload = { userId: 41, storeId: "18473", token: testToken.value, refreshToken: "7boss1970" };
        sinon.replace(authService, "generateJWT", generateJWTStub, () => { return payload });
        let req = httpMock.createRequest({ url:'7boss/launch/',params:params });
        let res = httpMock.createResponse({ eventEmitter: require('events').EventEmitter });
        await authController.authenticate(req, res, () => { logger.info('Authenticated request') });
        sinon.assert.calledOnce(generateJWTStub);
    });

    it('Fails to authenticate the request', async () => {
        const expiredTimestamp = 1570179780;
        testObject.timeStamp = expiredTimestamp;
        const tokenString = JSON.stringify(testObject);
        const encryptedToken = await AuthUtil.encrypt(tokenString);
        const params = { "token": encryptedToken };
        let req = httpMock.createRequest({ url:'7boss/launch/',params:params });
        let res = httpMock.createResponse({ eventEmitter: require('events').EventEmitter });
        await authController.authenticate(req, res, () => { logger.info('Failed to authenticate request') });
        sinon.assert.calledOnce(generateJWTStub);
    });

    it('Should validate JWT', async () => {
        let req = httpMock.createRequest({ headers: { authorization: testToken.value } });
        let res = httpMock.createResponse({ eventEmitter: require('events').EventEmitter });
        await authController.validateJWT(req, res, () => { logger.info('JWT validated') });
        sinon.assert.calledOnce(validateJWTStub);
    });
});

