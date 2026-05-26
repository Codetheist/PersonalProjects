// imports
const cors = require('cors');

//
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',')
        .map(origin => origin.trim())
        .filter(Boolean)
    : [];


// CORS options
const corsOptions = {
    origin(origin, callback) {
        if (!origin) {
            // Allow requests with no origin (like mobile apps or curl requests)
            return callback(null, true);
        }

        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Create CORS middleware
const corsMiddleware = cors(corsOptions);

module.exports = {
    corsMiddleware,
}