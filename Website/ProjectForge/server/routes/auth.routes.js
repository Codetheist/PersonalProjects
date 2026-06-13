// Imports
const { authRegisterSchema, authLoginSchema } = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../utils/httpError');
const { validate } = require('../validation/validate');
const express = require('express');
const { UsersRepo } = require('../repos/users.repo');
const { requireAuth, guestOnly } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimit');
const { config } = require('../config');


// Create router and repo instances
const router = express.Router();
const usersRepo = new UsersRepo();

// Registration
router.post('/register', authRateLimiter, guestOnly, asyncHandler(async (req, res) => {
    //Validate body
    const { username, email, password } = validate(authRegisterSchema, req.body);
    
    // Create user
    const user = await usersRepo.createUser({ username, email, password });

    // Set session
    req.session.userId = user.id;

    // Return user
    res.status(201).json({ user });    
}));

// Login
router.post('/login', authRateLimiter, guestOnly, asyncHandler(async (req, res) => {
    // Validate body
    const { identifier, password } = validate(authLoginSchema, req.body);

    // Authenticate user
    const user = await usersRepo.authenticate(identifier, password);

    // Invalid credentials
    if (!user) {
        throw httpError(401, 'Invalid credentials');
    }

    // Set session
    req.session.userId = user.id;
    
    // Return user
    res.json({ user });
}));

// Logout
router.post('/logout', requireAuth, (req, res, next) => {
    // Destroy session
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }

        res.clearCookie(config.cookieName);

        res.status(200).json({
            message: 'Logout successful'
        });
    });
});

// Me
router.get('/me', (req, res) => {
    if (!req.session?.userId) {
        return res.json({ user: null });
    }
    
    const user = usersRepo.findUserById(req.session.userId);
    
    if (!user) {
        return res.json({ user: null });
    }

    res.json({ user });
});

/* Future tasks
// Change password
router.patch('/change-password', requireAuth, asyncHandler(async (req, res) => {
    // validate body
    // verify current password
    // update to new password
    // optionally invalidate other sessions
    // return success response
}));

// Forgot Password
router.post('/forgot-password', asyncHandler(async (req, res) => {
    // validate body
    // find user by email
    // generate reset token
    // save hashed token / expiry if your design uses DB storage
    // send reset email or return placeholder response
    // return success response
}));

// Reset Password
router.post('/reset-password', asyncHandler(async (req, res) => {
    // validate body
    // verify reset token
    // check token expiration
    // update password
    // clear used reset token data
    // optionally create fresh session
    // return success response
}));

// Verify Email
router.post('/verify-email', asyncHandler(async (req, res) => {
    // validate token or code
    // verify token
    // mark user as verified
    // clear used verification token data
    // return success response
}));

// Resend Verification Email
router.post('/resend-verification-email', asyncHandler(async (req, res) => {
    // Resend verification email
    // validate body or use current session user
    // generate new verification token
    // send verification email
    // return success response
}));*/

module.exports = router;
