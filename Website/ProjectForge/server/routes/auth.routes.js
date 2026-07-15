// Imports
const {
    authRegisterSchema,
    authLoginSchema,
    authChangePasswordSchema,
    authForgotPasswordSchema,
    authResetPasswordSchema
} = require('../validation/schemas');
const crypto = require('crypto');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../utils/httpError');
const { validate } = require('../validation/validate');
const express = require('express');
const { UsersRepo } = require('../repos/users.repo');
const { requireAuth, guestOnly } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimit');
const { config } = require('../config');
const { sendPasswordResetEmail } = require('../services/email');

// Create router and repo instances
const router = express.Router();
const usersRepo = new UsersRepo();

// Registration
router.post('/register', authRateLimiter, guestOnly, asyncHandler(async (req, res, next) => {
    //Validate body
    const { username, email, password } = validate(authRegisterSchema, req.body);
    
    // Create user
    const user = await usersRepo.createUser({ username, email, password });

    // Set session
    req.session.regenerate(err => {
        if (err) return next(err);
        req.session.userId = user.id;

        // Return user
        res.status(201).json({ user });
    });   
}));

// Login
router.post('/login', authRateLimiter, guestOnly, asyncHandler(async (req, res, next) => {
    // Validate body
    const { identifier, password } = validate(authLoginSchema, req.body);

    // Authenticate user
    const user = await usersRepo.authenticate(identifier, password);

    // Invalid credentials
    if (!user) {
        throw httpError(401, 'Invalid credentials');
    }

    // Set session
    req.session.regenerate(err => {
        if (err) return next(err);
        req.session.userId = user.id;

        // Return user
        res.status(200).json({ user });
    });
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
router.get('/me', asyncHandler(async (req, res) => {
    // Check if user is logged in
    if (!req.session?.userId) {
        return res.json({ user: null });
    }
    
    // Fetch user from database
    const user = await usersRepo.findUserById(req.session.userId);
    
    if (!user) {
        return res.json({ user: null });
    }

    // Return user
    res.status(200).json({ user });
}));

// Change password
router.patch('/change-password', requireAuth, asyncHandler(async (req, res) => {
    // validate body
    const { currentPassword, newPassword } = validate(authChangePasswordSchema, req.body);

    // verify current password
    const isCurrentPasswordValid = await usersRepo.verifyPassword(req.session.userId, currentPassword);
    if (!isCurrentPasswordValid) {
        throw httpError(401, "Current password is incorrect");
    }

    if (currentPassword === newPassword) {
        throw httpError(400, "New password cannot be the same as the current password");
    }

    // update to new password
    await usersRepo.updatePassword(req.session.userId, newPassword);

    // return success response
    res.status(200).json({ message: "Password changed successfully" });
}));

// Forgot Password
router.post('/forgot-password', authRateLimiter, asyncHandler(async (req, res) => {
    // validate body
    const { email } = validate(authForgotPasswordSchema, req.body);

    // find user by email
    const user = await usersRepo.findUserByEmail(email);
    if (user) {
        const passwordResetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(passwordResetToken)
            .digest('hex');
        
        const expiresAt = Date.now() + 15 * 60 * 1000;

        await usersRepo.savePasswordResetToken(user.id, hashedToken, expiresAt);

        const resetUrl = `${config.frontendBaseUrl}/reset-password?token=${passwordResetToken}`;

        sendPasswordResetEmail(user.email, resetUrl).catch((err) => {
            logger.error({ err, userId: user.id }, "Failed to send password reset email");
        });
    }

    // return success response
    res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
}));

// Reset Password
router.post('/reset-password', authRateLimiter, asyncHandler(async (req, res) => {
    // validate body
    const { token, password } = validate(authResetPasswordSchema, req.body);
    
    // verify reset token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // check token expiration
    const user = await usersRepo.findUserByResetToken(hashedToken);

    if (!user || user.passwordResetExpiresAt < Date.now()) {
        throw httpError(400, "Invalid or expired password reset token.");
    }

    // check if new password is same as current password
    const isCurrentPassword = await usersRepo.verifyPassword(user.id, password);
    
    if (isCurrentPassword) {
        throw httpError(400, "New password cannot be the same as the current password");
    }

    // update password
    await usersRepo.updatePassword(user.id, password);

    // clear used reset token data
    await usersRepo.clearPasswordResetToken(user.id);

    // return success response
    res.status(200).json({ message: "Password has been reset successfully" });
}));

/* Future tasks
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