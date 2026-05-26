// Environment variables
require("dotenv").config();

// Core dependencies
const express = require("express");
const path = require("path");
const session = require("express-session");
const helmet = require('helmet');
const compression = require('compression');

// Application config
const { config } = require("./config");

// Database
const { initDb } = require("./db/db");

// Middleware
const { corsMiddleware } = require('./middleware/cors');
const { apiRateLimiter } = require('./middleware/rateLimit');
const { notFound, errorHandler } = require('./middleware/error');

// Routes
// import from ./routes/auth.routes.js
// import from ./routes/projects.routes.js
// import from ./routes/tasks.routes.js
// import from ./routes/comments.routes.js
// import from ./routes/members.routes.js

// Initialize the database
initDb();

// Initialize Express app
const app = express();

// Security
app.use(helmet());
app.use(corsMiddleware);
app.use(compression());

// Rate limiting
app.use("/api", apiRateLimiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session
if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is required");
}

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    },
}));

// Static Pages
const staticDir = path.resolve(__dirname, '..', 'client', 'pages');

// Root route
app.get("/", (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
});

// API routes
// app.use('/api/auth', authRoutes(db))
// app.use('/api/projects', projectsRoutes(db))
// app.use('/api/tasks', tasksRoutes(db))
// app.use('/api/comments', commentsRoutes(db))
// app.use('/api/members', membersRoutes(db))

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(config.port, () => {
    console.log(`Project Forge is running on port ${config.port}`);
});