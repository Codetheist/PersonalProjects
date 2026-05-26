// imports
const rateLimit = require('express-rate-limit');
const httpErrors = require("http-errors");

function rateLimitError(message) {
    return (req, res, next) => {
        next(httpErrors(429, message));
    };
}

// Auth rate limiter
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    handler: rateLimitError("Too many authentication attempts from this IP, please try again later.")
});

// General API rate limiter
const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    handler: rateLimitError("Too many requests from this IP, please try again later.")
});

// Optional stricter limiter
const sensitiveRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    handler: rateLimitError("Too many requests from this IP, please try again later.")
});

module.exports = {
    authRateLimiter,
    apiRateLimiter,
    sensitiveRateLimiter
};