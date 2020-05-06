import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import proxy from 'express-http-proxy';
import {DEV_BFF_URL} from './util/constants';
import {authController} from './controller/auth.controller';

const {startLogging, publishLogs} = require('./logging/logWrapper');
import * as moment from 'moment';
import {AuthUtil} from './util/auth.util';
import * as chalk from 'chalk';
import {authService} from "./services/auth.service";
import * as requestIp from 'request-ip';

const helmet = require('helmet');
const LoggingConstants = require('./util/loggingConstants');
const idUtil = require('./util/idUtil');

const warning = chalk.yellowBright;
const good = chalk.greenBright;
const bad = chalk.redBright;

//TESING

let app = express();
app.use(cors());
const router = express.Router();
app.use(express.static(__dirname + '/public'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(requestIp.mw());
app.use(helmet());
// app.set('etag', false);

app.use(function (req, res, next) {
    setTraceId();
    initializeLogger();
    req.headers[LoggingConstants.TRACE_ID_KEY] = LoggingConstants.TRACE_ID;
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, accesstoken");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    next();
});

const initializeLogger = async () => {
    await startLogging();
};

const setTraceId = () => {
    LoggingConstants.TRACE_ID = idUtil.IDGenerator.v4();
};

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(function (req, res, next) {
    if (req.url.indexOf('/7boss/') >= 0 && req.url.indexOf('/7boss/order/') < 0 && (req.url.indexOf('/healthcheck') < 0)) {
        req.url = req.url.replace('/7boss/', '/7boss/order/');
        if (req.url.indexOf('/7boss/order/') >= 0) {
            logger.info(`REQ URL AND INDEX: ${req.url.indexOf('/7boss/order/')}, url updated to ${req.url}`);
        }
    }
    next();
});

router.get('/:deviceType/launch/:storeid/:userid/:password?', async (req, res, next) => {
    logger.debug(`Launching store... EnvironmentName: ${process.env.ENVIRONMENT}, StoreId: ${req.params.storeid}, UserId: ${req.params.userid}, clientIp: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}, Token if any ${req.query.launchtoken}`);
    console.log(`Launching store... EnvironmentName: ${process.env.ENVIRONMENT}, StoreId: ${req.params.storeid}, UserId: ${req.params.userid}, clientIp: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}, Token if any ${req.query.launchtoken}`);


    let launchToken = 'c1d1a5cd-56e8-4e51-b381-eede370006a8';
    // TODO Removed this check for prod once 7boss/order/auth/launch/?token is working
    if (process.env.ENVIRONMENT === 'prod' || process.env.ENVIRONMENT === 'dev' || process.env.ENVIRONMENT === 'qa' || process.env.ENVIRONMENT === 'uat' || process.env.ENVIRONMENT === 'local') {
        let tokenString = '{"userId":REPLACE_USERID, "storeId":"REPLACE_STOREID", "deviceType":"REPLACE_DEVICETYPE", "dateTime":"REPLACE_UTC_DATETIME", "timeStamp":"REPLACE_TIMESTAMP", "timezone":"Utc"}'
        if (req.params && req.params['storeid']) {
            try {
                let storeId = req.params.storeid;
                let userId = (req.params.userid) ? req.params.userid : 99;
                let reqLaunchToken = req.query.launchtoken;
                if ((process.env.ENVIRONMENT === 'prod' && launchToken !== reqLaunchToken) || (process.env.ENVIRONMENT === 'prod' && userId === '40')) {
                    logger.error(`Token ${launchtoken}, Env: ${process.env.ENVIRONMENT}, Error launching store`);
                    res.status(401).send({message: "Unauthorized" + `Token ${launchtoken}, Env: ${process.env.ENVIRONMENT}`});
                } else {
                    // let password = (req.params.password) ? req.params.password : "711290";
                    let deviceType = (req.params.deviceType) ? req.params.deviceType.toUpperCase() : "ISP";
                    let isOrderingEnabled = false;
                    const allowedStore = await authService.getStoreProfile(storeId);
                    if (allowedStore && allowedStore.features && allowedStore.features.boss) {
                        isOrderingEnabled = allowedStore.features.boss.isOrderingEnabled;
                    }
                    if (!isOrderingEnabled) {
                        logger.debug(`Requested storeId is not an allowed ordering store ${storeId}, changing store to 18473`);
                        storeId = "18473";
                        userId = userId;
                    }
                    let utcValue = moment.utc().valueOf().toString();
                    let currentUtcTime = parseInt(utcValue.slice(0, -3));
                    var readOnlyView = false;
                    console.log(`Getting store with storeId user ID`, userId, 41);
                    if (process.env.ENVIRONMENT === 'prod' && (parseInt(userId) === 38 || parseInt(userId) === 40)) {
                        readOnlyView = true;
                    }

                    let token = {
                        "userId": parseInt(userId),
                        "storeId": `${storeId}`,
                        "deviceType": `${deviceType}`,
                        "feature": "ordering",
                        "ip": "192.168.137.29",
                        "readOnly": readOnlyView,
                        "dateTime": `${moment.utc().format()}`,
                        "timeStamp": `${currentUtcTime}`,
                        "timeZone": "Utc"
                    };
                    tokenString = tokenString.replace('REPLACE_USERID', userId).replace('REPLACE_STOREID', storeId).replace('REPLACE_UTC_DATETIME', moment.utc().format()).replace('REPLACE_TIMESTAMP', currentUtcTime);
                    tokenString = JSON.stringify(token);
                    let encryptedString = await AuthUtil.encrypt(tokenString);
                    //res.send(token);
                    logger.debug(`Environment: ${JSON.stringify(process.env.ENVIRONMENT)}, Redirecting user ${userId}...`);
                    //res.status(200).send("GOOD");
                    if (process.env.ENVIRONMENT === "local") {
                        res.redirect('http://localhost:3000/7boss/launch/' + encryptedString);
                    } else {
                        res.redirect('/7boss/launch/' + encryptedString);
                    }
                }
            } catch (err) {
                logger.error(`${JSON.stringify(err)}, Error launching store ${storeId}`);
                res.send('Please call with /7boss/order/isp/:storeid/:userid, userid is optional. with error : ' + JSON.stringify(err) + ', Error ' + err);
            }
        } else {
            logger.info(`Failed to get storeId from request`);
            res.send(`Please call with /7boss/order/isp/:storeid/:userid, userid is optional. ${req.url}`);
        }
    } else {
        logger.error(`Request not allowed in this ENVIRONMENT: ${process.env.ENVIRONMENT}`);
        res.status(401).send({message: "Unauthorized"});
    }
    await publishLogs();
});

router.get('/launch/:token', async (req, res, next) => {
    await publishLogs();
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

/* REMOTE LOGIN */
router.get('/auth/launch/:token', async (req, res, next) => {
    logger.info(`Authenticate request with URL: ${req.url}`, {
        [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID
    });
    console.log('Trying to authenticate token and launch store');
    let response = await authController.getUuidController(req, res);
    if (response && response !== "error") {
        res.status(200).send(response);
    } else {
        res.status(500).send({
            message: "Invalid Token"
        });
    }
});

// router.get('/auth/launch/:token', async (req, res, next) => {
//     logger.info(`Authenticate request with URL: ${req.url}`, {
//         [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID
//     });
//     console.log('Trying to authenticate token and launch store');
//     await authController.authenticate(req, res, next);
// }, async (req, res) => {
//     if (res.locals.oAuthTokenPayload) {
//         let options = {
//             maxAge: 1000 * 60 * 1,
//             sameSite: 'Strict'
//         };
//         logger.debug(`COOKIE IN TOKEN: ', ${JSON.stringify(res.locals.oAuthTokenPayload)}, Successfully authenticated with token!`);
//         res.status(200).send(res.locals.oAuthTokenPayload);
//     } else {
//         logger.error('Failed to authenticate due to invalid token');
//         res.status(500).send({
//             message: "Invalid Token"
//         });
//     }
//     await publishLogs();
// });

router.post('/auth/refresh/token', async (req, res) => {
    await authController.refreshAccessToken(req, res);
    await publishLogs();
});

router.get('/auth/ping', async (req, res) => {
    await authController.isTokenValid(req, res);
    await publishLogs();
});

router.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.use(express.json());

app.get('/headrs/:id', (req, res) => {
    try {
        logger.info('Getting debug information');
        let results = {};
        let verificationId = req.params.id;
        if (!verificationId || verificationId !== 'c1d1a5cd-56e8-4e51-b381-eede370006a8') {
            res.status(500).send({message: "Could not get headers"});
        }
        if (verificationId === 'c1d1a5cd-56e8-4e51-b381-eede370006a8') {
            const reqIP = req.header('x-forwarded-for');
            const clientIpFromMiddleware = req.clientIp;
            results.reqH = req.headers;
            if (reqIP) {
                results.reqIp = reqIP;
            }
            if (clientIpFromMiddleware) {
                results.clientIpFromMiddleware = clientIpFromMiddleware;
            }
        }
        res.status(200).json(results);
    } catch (error) {
        logger.error(error, 'Could not get headers');
        res.status(500).send({message: "Could not get headers"});
    }
});

app.use('/7boss/order', router);

app.get('/healthcheck', (req, res) => {
    res.status(200).send(true);
});

app.all(/^\/services\/(.*)/, async (req, res, next) => {
    authController.validateJWT(req, res, next);
    await publishLogs();
}, proxy(process.env.bff_base_url || DEV_BFF_URL, {
    proxyReqPathResolver: (req, res) => {
        return req.url;
    }
}));

app.listen(5000, function () {
    console.log('Server started on: 5000');
});
