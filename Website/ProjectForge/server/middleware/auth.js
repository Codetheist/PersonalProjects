// imports
const httpErrors = require('http-errors');
const { UsersRepo } = require('../repos/users.repo');

// create users repo instance
const usersRepo = new UsersRepo();

// Require auth
function requireAuth(req, res, next) {
    try {
        const userId = req.session?.userId;
        
        if (!userId) {
            return next(httpErrors(401, "Unauthorized"));
        }
        
        // Find user by id
        const user = usersRepo.findUserById(userId);
        
        if (!user || user.is_active !== 1) {
            return next(httpErrors(401, "Unauthorized"));
        }
        
        req.user = user;
        
        next();
    
    } catch (err) {
        next(err);
    }
}

// Guest only middleware
function guestOnlyMiddleware(req, res, next) {
    if (req.session?.userId) {
        return next(httpErrors(403, "Forbidden"));
    }
    
    next();
};

module.exports = {
    requireAuth,
    guestOnlyMiddleware,
}