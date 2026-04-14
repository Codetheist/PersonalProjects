const { authRegisterSchema, authLoginSchema } = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../validation/validate');
const express = require('express');
const { UsersRepo } = require('../repos/users.repo');
/*
    TODO: Implement the following auth features:
    Session-based authentication
    Password hashing and verification
    Email verification for new registrations
    Password reset functionality (request reset, reset password)
    Session management (login, logout, session expiration)
    Middleware to protect routes that require authentication
*/

function authRoutes(db) {
    const router = express.Router();
    const usersRepo = new UsersRepo(db);

    // Registration
    router.post('/register', asyncHandler(async (req, res) => {
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
    router.post('/login', asyncHandler(async (req, res) => {
        // Validate body
        const { identifier, password } = validate(authLoginSchema, req.body);

        // Authenticate user
        const user = await usersRepo.authenticate(identifier, password);

        // Invalid credentials
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Set session
        req.session.userId = user.id;

        // Return user
        res.json({ user });
    }));

    // Logout
    router.post('/logout', asyncHandler(async (req, res) => {
        // destroy or clear session
        // return success response
    }));

    // Me
    router.get('/me', asyncHandler(async (req, res) => {
        // check session
        // get current user
        // handle unauthorized if needed
        // return user
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

    // Change Password
    router.post('/change-password', asyncHandler(async (req, res) => {
        // require authenticated session
        // validate body
        // get current user
        // verify current password
        // update to new password
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
    }));

    return router;
}

module.exports = {
    authRoutes
};