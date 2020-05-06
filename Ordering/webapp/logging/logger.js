import * as winston from 'winston';
import * as winstonKinesis from '@7eleven/winston-kinesis';
import * as moment from "moment";
import { ENTER_METHOD, EXIT_METHOD, PRODUCTION, EXCEPTION_STRING } from '../util/constants';
import { loadConfig } from '../config/config';
import * as LoggingConstants from '../util/loggingConstants';

let cached = false;
let kinesisTransport = null;
let correlationId = null;
const enableDebugLogs = false;

class LoggerFactory {
    static _logger;
    static injectMetaDetails = winston.format((info) => {
        info.team = 'ris2OrderingUI';
        info.cached = cached;
        if (correlationId != null) info.correlationId = correlationId;
        return info;
    });

    static async initializeLogger() {
        try {
            // console.log('Trying to initialize logger..........');
            if (process.env.NODE_ENV !== PRODUCTION) {
                loadConfig();
            }
            const currentEnv = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : "dev";
            if (this._logger == null) {
                this._logger = winston.loggers.add(process.env.ApplicationName, {
                    // Log only if event level less than or equal to this level
                    levels: {
                        debug: 3,
                        error: 2,
                        info: 1,
                    },
                    level: 'debug',
                    format: winston.format.combine( // Formatting for messages
                        this.injectMetaDetails(),
                        winston.format.json()
                    ),
                    exitOnError: false,
                    silent: false
                });
                this._logger.on('error', (err) => {
                    console.error(`Unhandled logger error: ', ${JSON.stringify(err.message)}`);
                    // reject(err);
                });
                if (currentEnv === 'local') {
                    this._logger.add(new winston.transports.Console({
                        format: winston.format.simple(),
                        colorize: true,
                        levels: 'debug',
                    })
                    );
                } else {
                    kinesisTransport = new (winstonKinesis)({
                        kinesisStreamName: process.env.logsKinesisStream,
                        logsWriterRoleArn: process.env.writerRoleArn,
                        application: process.env.ApplicationName,
                        environment: process.env.ENVIRONMENT,
                        originator: process.env.originator
                    });
                    this._logger.add(kinesisTransport);
                }
            }
            const appName = process.env.ApplicationName;
            const LoggerObject = winston.loggers.get(appName);

            global.logger = LoggerObject;
            // console.log('Logger initialization successful');
            return Promise.resolve();
        } catch (error) {
            console.error(`${JSON.stringify(error)}, Failed to initialize logger`);
            return Promise.reject(error, 'Error initializing logger');
        }
    }
}

function log(target) {
    for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
        const isMethod = descriptor.value instanceof Function;
        if (!isMethod) {
            continue;
        }
        logMethodDecorator(target, propertyName, descriptor);
    }
}

function logMethodDecorator(target, propertyKey, descriptor) {
    let entryMessage = ENTER_METHOD + target.name + '.' + propertyKey.toString();
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        let result;
        try {
            logger.info(JSON.stringify(entryMessage), { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            let startTime = moment();
            let duration;
            result = originalMethod.apply(this, args);
            if (result instanceof Promise) {
                result.then(() => {
                    duration = moment.duration(moment().diff(startTime));
                    let exitMessage = EXIT_METHOD + target.name + '.' + propertyKey.toString();
                    logger.info(JSON.stringify(exitMessage), { [LoggingConstants.EXECUTION_TIME]: duration.asMilliseconds(), [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                }, err => {
                    let exceptionMessage = EXCEPTION_STRING + target.name + '.' + propertyKey.toString() + '\n';
                    logger.error(JSON.stringify(exceptionMessage), { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                    logger.error(JSON.stringify(err), { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
                });
            } else {
                duration = moment.duration(moment().diff(startTime));
                let exitMessage = EXIT_METHOD + target.name + '.' + propertyKey.toString();
                logger.info(JSON.stringify(exitMessage), { [LoggingConstants.EXECUTION_TIME]: duration.asMilliseconds(), [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            }
            return result;
        } catch (err) {
            let exceptionMessage = EXCEPTION_STRING + target.name + '.' + propertyKey.toString() + '\n';
            logger.error(JSON.stringify(exceptionMessage), { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
            logger.error(JSON.stringify(err), { [LoggingConstants.TRACE_ID_KEY]: LoggingConstants.TRACE_ID });
        }
    };
    Object.defineProperty(target.prototype, propertyKey, descriptor);
}

async function flushLogs() {
        if (kinesisTransport) {
            kinesisTransport.flush((err, msg) => {
                if (err) {
                    logger.error(`${JSON.stringify(err)} Error flushing logs`);
                    return Promise.reject(err, 'Error flushing logs');
                } else {
                    logger.info(`Kinesis transport success with , ${msg}`);
                    return Promise.resolve('Logs sent to kinesis');
                }
            });
        } else {
            console.error('Kinesis transport not found, Cannot flush logs');
            return Promise.resolve('Nothing to flush');
        }
    }

export {
    log,
    flushLogs,
    logMethodDecorator,
    LoggerFactory
}
