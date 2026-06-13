// imports
const { httpError } = require('../utils/httpError');
const { config } = require('../config');
const isDevelopment = config.nodeEnv === 'development';

// Not found handler
function notFound(req, res, next) {
    next(httpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Error handler
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    
    const statusCode = getStatusCode(err);

    const response = {
        error: {
            status: statusCode,
            message: getErrorMessage(err, statusCode),
        },
    };

    if (err.type) {
        response.error.type = err.type;
    }

    if (err.issues) {
        response.error.issues = err.issues;
    }

    if (isDevelopment) {
        response.error.stack = err.stack;
    }

    res.status(statusCode).json(response);
}

function getStatusCode(err) {
    const status = err.status || err.statusCode;

    if (typeof status === 'number' && status >= 400 && status <= 599) {
        return status;
    }

    return 500;
}

function getErrorMessage(err = {}, statusCode) {
    if (statusCode >= 500 && !isDevelopment) {
        return 'Internal Server Error';
    }

    return err.message || "Internal Server Error";
}

module.exports = {
    notFound,
    errorHandler,
};