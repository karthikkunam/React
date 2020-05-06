const winston = require("winston");
const winstonKinesis = require("@7eleven/winston-kinesis");
var os = require("os");


// Global variables 
let initialized = false; 
let cached = false; 
let logger = null; 
let correlationId = null; 
let kinesisTransport = null; 
let hostname = os.hostname();

// Inject additional common meta details into all log messages (completely optional) 
const injectMetaDetails = winston.format((info) => { 
    info.cached = cached; 
    if (correlationId != null) info.correlationId = correlationId; 
    return info; 
}); 
 
// Initialize 
async function initialize() { 
    if (initialized) { 
        // Record we've been cached (e.g. warm lambda) 
        cached = true; 
        return "Already initialized"; 
    } 
 
    // Make sure we don't have the default logger (in case we are re-initializing) 
    if (winston.loggers.has("default")) { 
        // We must be re-initializing, close out the default 
        winston.loggers.close("default"); 
    } 
 
    // Create the logger in such a way to retrieve it by any other modules 
    //      e.g. const logger = winston.loggers.get("default"); 
    logger = winston.loggers.add("default", { 
        level: process.env.LOG_LEVEL,   // Log only if event level less than or equal to this level 
        format: winston.format.combine(
            injectMetaDetails(), 
            winston.format.json() 
        ), 
        exitOnError: false, 
        silent: false 
    }); 
 
    // Catch unhandled exceptions and log for awareness, but don't exit 
    logger.on("error", function (err) { 
        console.error("Unhandled logger error: ", err); 
 
        // On next execution, make sure to re-create the logger 
        initialized = false; 
    }); 
 
    // Set up the appropriate transport based on environment 
    // if (process.env.ENVIRONMENT === "local") { 
    //     // If we're in our local environment, then log to the `console` with the format: 
    //     // `${info.level}: ${info.message} JSON.stringify({ ...rest }) ` 
    //     logger.add(new winston.transports.Console({ 
    //         format: winston.format.simple() 
    //     })); 
    // } else { 
    // Create Kinesis Transport 
    kinesisTransport = new (winstonKinesis)({ 
        kinesisStreamName: "prod-7LogsKinesisStream", //process.env.KINESIS_STREAM, 
        awsAccessKeyId: "AKIA3IOG2Z47WXJTE4Z2", //process.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: "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", //process.env.AWS_SECRET_ACCESS_KEY,
        awsRegion:"us-east-1",
        application: "RIS2.0", //process.env.APPLICATION, 
        environment: "prod", //process.env.ENVIRONMENT, 
        originator: hostname, //process.env.AWS_LAMBDA_FUNCTION_NAME 
    }); 
 
    // Add Kinesis transport 
    logger.add(kinesisTransport); 
    //  } 
 
    // Mark as initialized (i.e. so we only do this once for each cold lambda) 
    initialized = true; 
 
    //logger.info("Successfully initialized"); 
    return "Successfully initialized"; 
} 
 
// Flush all messages in buffer; otherwise, they are dropped 
async function flushLogs() { 
    return new Promise(function (resolve, reject) { 
        // If we aren't using the Kinesis Transport, nothing to do 
        if (kinesisTransport) { 
            // Flush all messages to Kinesis 
            kinesisTransport.flush(function (err, msg) { 
                if (err) { 
                    console.error("Error flushing logs: ", err); 
                    reject(err); 
                } else { 
                    console.log(msg); 
                    resolve(msg); 
                } 
            }); 
        } else { 
            resolve("Nothing to flush"); 
        } 
    }); 
} 
 
// Primary entry point 
async function LogActivity(message,myObj) { 
    try { 
        // Create unique id for run 
        correlationId = "c9d9ac7a-3560-4558-8c83-4a20b89035a8"; 
 
        // Initialize container 
        await initialize(); 
       
      
        logger.info(message, myObj);
       
        // Flush & return 
        await flushLogs(); 
    } catch (error) { 
        //logger.error("Caught unhandled error, flushing logs: ", error); 
        console.log(error);
        // Flush & return 
        await flushLogs(); 
    } 
} 

module.exports = {
    LogActivity  
};