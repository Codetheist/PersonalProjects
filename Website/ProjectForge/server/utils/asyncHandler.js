// Utility function to wrap async route handlers and catch errors
function asyncHandler(fn) {
    return function(req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = {asyncHandler}; 