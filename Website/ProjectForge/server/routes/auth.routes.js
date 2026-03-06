const { authRegisterSchema, authLoginSchema } = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../validation/validate');
const express = require('express');
const { UsersRepo } = require('../repos/users.repo');
const rateLimit = require('express-rate-limit');

function authRoutes(db) {
    const usersRepo = new UsersRepo(db);
    const router = express.Router();

    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // limit each IP to 10 login requests per window
        standardHeaders: true,
        legacyHeaders: false,
    });

    // Registration route
    router.post('/register', asyncHandler(async (req, res) => {
        const { username, email, password } = validate(authRegisterSchema, req.body);
        const user = await usersRepo.createUser({ username, email, password });
        req.session.userId = user.id;
        res.status(201).json({ user });
    }));

    // Login route
    router.post('/login', authLimiter, asyncHandler(async (req, res) => {
        const { identifier, password } = validate(authLoginSchema, req.body);
        const user = await usersRepo.authenticate(identifier, password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.session.userId = user.id;
        res.json({ user });
    }));

    return router;
}

module.exports = {
    authRoutes
};