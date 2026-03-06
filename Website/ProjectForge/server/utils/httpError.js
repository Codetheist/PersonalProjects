const createError = require('http-errors');

function httpError(status, message) {
    return createError(status, message);
}
module.exports = {
    createError,
    httpError
}