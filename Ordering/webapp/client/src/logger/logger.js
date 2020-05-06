'use strict';


import winston from 'winston';
import winstonKinesis from '@7eleven/winston-kinesis';

// const winston = require('winston');
// const winstonKinesis = require('@7eleven/winston-kinesis');
//const constants = require('../utilities/constants').appConstants.APP_CONSTANTS;
//const dbConnectionProvider = require('../database/connection-provider');

let cached = false;
let kinesisTransport = null;

export const initialize = (event)  => {
	return new Promise(function(resolve, reject) {
		console.log('Initializing components');
		//const originatorName = 'invokeUPC'
		const injectMetaDetails = winston.format((info) => {
			info.team = 'ris2DataTransformation';
			info.cached = cached;
			info.userId = 'rthak';
			info.canonicalId = 'DT';
			return info;
		});

		const logger = winston.loggers.add(process.env.REACT_APP_ApplicationName, {
			level: 'info', // Log only if event level less than or equal to this level
			format: winston.format.combine(injectMetaDetails(), winston.format.json()),
			exitOnError: false,
			silent: false
		});
		logger.on('error', function(err) {
			console.error('Unhandled logger error: ', err.message);
			reject(err);
		});

		if (process.env.REACT_APP_EnvironmentName === 'local') {
			logger.add(
				new winston.transports.Console({
					format: winston.format.simple(),
					colorize: true,
					level: 'info'
				})
			);
		} else {
			console.log('into transport');
			kinesisTransport = new winstonKinesis({
				kinesisStreamName: process.env.REACT_APP_LogsKinesisStream,
				logsWriterRoleArn:
					'arn:aws:iam::774047977279:role/app-7logs-master-infrastructure-pr-7LogsWriterRole-ONZ60NU7KSMV',
				application: process.env.REACT_APP_ApplicationName,
				environment: 'dev',
				originator: 'invokeUPC'
			});
			logger.add(kinesisTransport);
		}

		global.logger = winston.loggers.get(process.env.REACT_APP_ApplicationName);
		resolve();
	});
}

export const flushLogs = () => {
	return new Promise(function(resolve, reject) {
		if (kinesisTransport) {
			console.log('transport object');
			kinesisTransport.flush(function(err, msg) {
				console.log('into flushlogs');
				if (err) {
					console.error('Error flushing logs: ', err);
					reject(err);
				} else {
					console.log('Kinesis transport success: ', msg);
					resolve('Logs sent to Kinesis');
				}
			});
		} else {
			resolve('Nothing to flush');
		}
	});
}

module.exports = {
	initialize,
	flushLogs
};
