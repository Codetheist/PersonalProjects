const { authRegisterSchema, authLoginSchema } = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../validation/validate');
const express = require('express');
const { UsersRepo } = require('../repos/users.repo');
<<<<<<< HEAD
=======
const rateLimit = require('express-rate-limit');
>>>>>>> 530cc1bbe15b14874ca4898bcf536c3c0105a555

function authRoutes(db) {
    const usersRepo = new UsersRepo(db);
    const router = express.Router();

<<<<<<< HEAD
=======
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // limit each IP to 10 login requests per window
        standardHeaders: true,
        legacyHeaders: false,
    });

>>>>>>> 530cc1bbe15b14874ca4898bcf536c3c0105a555
    // Registration route
    router.post('/register', asyncHandler(async (req, res) => {
        const { username, email, password } = validate(authRegisterSchema, req.body);
        const user = await usersRepo.createUser({ username, email, password });
        req.session.userId = user.id;
        res.status(201).json({ user });
    }));

    // Login route
<<<<<<< HEAD
    router.post('/login', asyncHandler(async (req, res) => {
=======
    router.post('/login', authLimiter, asyncHandler(async (req, res) => {
>>>>>>> 530cc1bbe15b14874ca4898bcf536c3c0105a555
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