require('dotenv').config();
const { LoggerFactory, flushLogs } = require('./logger');
const chalk = require('chalk');
const currentEnvironment = process.env.ENVIRONMENT;


const logger = {
    info: (message) => {
        if (currentEnvironment === 'local') {
            console.log(chalk.green(JSON.stringify(message)));
        }
    },
    error: (message) => {
        if (currentEnvironment === 'local') {
            console.log(chalk.red(JSON.stringify(message)));
        }
    },
    debug: (message) => {
        if (currentEnvironment === 'local') {
            console.log(chalk.blue(JSON.stringify(message)));
        }
    }
};

const startLogging = async () => {
    try {
        if (currentEnvironment === 'local') {
            global.logger = logger;
        } else {
            await LoggerFactory.initializeLogger();
        }
    } catch (error) {
        console.error(error, 'Error starting to intialize logger');
    }
};

const publishLogs = async () => {
    try {
        await flushLogs();
    } catch (error) {
        console.error(`${JSON.stringify(error)} some issue flushing logs`);
        throw new Error(`some issue flushing logs: ${error}`);
    }
};

module.exports = {
    startLogging,
    publishLogs,
};
