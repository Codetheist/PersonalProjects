const pino = require('pino');
const { multistream } = pino;
require('dotenv').config();

// Load configuration from environment variables
const appName = process.env.APP_NAME || '';
const logLevel =
    process.env.LOG_LEVEL || 
    (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const silentLogs = process.env.SILENT_LOGS === '1';
const requestFormat = (process.env.LOG_FORMAT || 'json').toLowerCase();
const safeFormat = requestFormat === 'pretty' || requestFormat === 'json' ? requestFormat : 'json';
const logFormat = 
    (safeFormat === 'pretty' && process.env.NODE_ENV === 'production')
        ? 'json'
        : safeFormat;

// Function to build the appropriate stream based on the log format
function buildStream() {
    // If pretty format is requested, try to use pino-pretty. If it fails, fall back to JSON format.
    if (logFormat === 'pretty') {
        let pretty
        try {
            pretty = require('pino-pretty');
        } catch {
            return multistream(
                [
                    { level: 'debug', stream: process.stdout },
                    { level: 'warn', stream: process.stderr },
                ],
                { dedupe: true },
            );
        }
        
        const prettyStdout = pretty({
            colorize: true,
            translateTime: 'SYS:standard',
        }, process.stdout);
        
        const prettyStderr = pretty({
            colorize: true,
            translateTime: 'SYS:standard',
        }, process.stderr);
        
        return multistream(
            [
                { level: 'debug', stream: prettyStdout },
                { level: 'warn', stream: prettyStderr },
            ],
            { dedupe: true },
        );
    }
    
    return multistream(
        [
            { level: 'debug', stream: process.stdout },
            { level: 'warn', stream: process.stderr },
        ],
        { dedupe: true },
    );
}

// Create the base logger instance
const baseLogger = pino(
    {
        name: appName || undefined,
        level: logLevel,
        enabled: !silentLogs,
    },
    buildStream()
);

// Create a wrapper logger that provides a consistent interface and supports child loggers
const logger = {
    debug: (msg, meta) => baseLogger.debug(meta ?? undefined, msg),
    info: (msg, meta) => baseLogger.info(meta ?? undefined, msg),
    warn: (msg, meta) => baseLogger.warn(meta ?? undefined, msg),
    error: (msg, meta) => {
        if (meta instanceof Error) {
            return baseLogger.error({ err: meta }, msg);
        }
        return baseLogger.error(meta ?? undefined, msg);
    },
    childLogger: (childOptions = {}) =>
        baseLogger.child({
            name: (childOptions.appName ?? appName) || undefined,
            ...(childOptions.meta || {}),
        }),
};

// Function to create a child logger with specific options
function createLogger(options = {}) {
    return baseLogger.child({
        name: (options.appName ?? appName) || undefined,
        ...(options.meta || {}),
    });
}

module.exports = {
    createLogger,
    logger,
};