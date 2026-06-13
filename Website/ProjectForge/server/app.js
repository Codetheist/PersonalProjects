// Core dependencies
const express = require("express");
const path = require("path");
const session = require("express-session");
const helmet = require('helmet');
const compression = require('compression');

// Config
const { config } = require("./config");

// Middleware
const { corsMiddleware } = require('./middleware/cors');
const { apiRateLimiter } = require('./middleware/rateLimit');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth.routes');
const projectsRoutes = require('./routes/projects.routes');
const tasksRoutes = require('./routes/tasks.routes');
const commentsRoutes = require('./routes/comments.routes');
const membersRoutes = require('./routes/members.routes');

// Initialize Express app
const app = express();

// Security
app.use(helmet());
app.use("/api", corsMiddleware);
app.use(compression());

// Rate limiting
app.use("/api", apiRateLimiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session
app.use(session({
    name: config.cookieName,
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.isProd,
    },
}));

// Static Files
const staticDir = path.resolve(__dirname, '..', 'client', 'pages');
const assetsDir = path.resolve(__dirname, '..', 'client', 'assets');

if (!config.isProd) {
    app.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-store');
        next();
    });
}

app.use('/assets', express.static(assetsDir, {
    etag: config.isProd,
    lastModified: config.isProd,
    cacheControl: config.isProd,
}));

app.use(express.static(staticDir, {
    etag: config.isProd,
    lastModified: config.isProd,
    cacheControl: config.isProd,
}));


// Page route
app.get("/", (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(staticDir, 'dashboard.html'));
});

app.get("/project/:id", (req, res) => {
    res.sendFile(path.join(staticDir, 'project.html'));
});

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/projects', tasksRoutes)
app.use('/api/projects', membersRoutes)
app.use('/api', commentsRoutes)

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;