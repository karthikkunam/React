import * as babelpollifil from 'babel-polyfill';
import { expect } from 'chai';
import * as sinon from 'sinon';
import fs from 'fs';
import { loginService } from './login.service.js';
import * as request from 'request';
import { secretsManager } from '../util/secretsManager/index';

var userPayload = require('../data/users.json');
let sandbox;
let PRIVATE_KEY;
secretsManager.getPrivateKey().then((key) => { PRIVATE_KEY = key });

describe('loginservice', () => {
    beforeEach(() => {
        sinon.defaultConfig = {
            injectInto: null,
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],
            useFakeTimers: true,
            useFakeServer: true
        }
        sandbox = sinon.createSandbox(sinon.defaultConfig);
    });

    it('successful authentication', (done) => {
        let payload = {
            userId: 41,
            password: '711291',
            storeId: '12200'
        }
        let privateKey = PRIVATE_KEY;
        sandbox.replace(request, "post", () => {
            return userPayload[0];
        });
        sandbox.replace(fs, "readFileSync", () => {
            return privateKey;
        });

        loginService.authenticate(payload, '07205623645237424').then(response => {
            expect(response).to.be.an.instanceOf(Object);
            expect(response.userId).to.equal(payload.userId);
            expect(response.storeId).to.equal(payload.storeId);
            expect(response.token).to.not.equal(undefined);
            expect(response.refreshToken).to.not.equal(undefined);
            done();
        });
    });

    it('token expired', (done) => {
        let userId = 41, storeId = '12200';
        let privateKey = PRIVATE_KEY;
        sandbox.replace(request, "post", () => {
            return userPayload[0];
        });
        sandbox.replace(fs, "readFileSync", () => {
            return privateKey;
        });
        loginService.refreshAccessToken(userId, storeId).then(token => {
            expect(token).to.not.equal(undefined);
            done();
        });
    });
    afterEach(() => {
        sandbox.restore();
    });
});

