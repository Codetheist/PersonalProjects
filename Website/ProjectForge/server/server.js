// Environment variables
require("dotenv").config();

// Core dependencies
const express = require("express");
const path = require("path");
const liveReload = require("livereload");
const connectLiveReload = require("connect-livereload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
<<<<<<< HEAD
=======
const RateLimit = require("express-rate-limit");
>>>>>>> 530cc1bbe15b14874ca4898bcf536c3c0105a555

// Application config
const { config } = require("./config");

// Middleware functions
//const { requireAuth } = require("./middleware/auth");
//const { errorHandler } = require("./middleware/error");

// Route builders
const { buildAuthRouter } = require("./routes/auth.routes");
const { buildTasksRouter } = require("./routes/tasks.routes");

// Reposity factories
/*const { buildUsersRepo } = require("./db/users.repo");
const { buildTasksRepo } = require("./db/tasks.repo");*/

// Database utilities
const { db, initDb, parseTaskRow } = require("./db/db");

const app = express();

<<<<<<< HEAD
=======
const rootLimiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs for the root route
});

>>>>>>> 530cc1bbe15b14874ca4898bcf536c3c0105a555
app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Static Pages and Reloading Pages
const staticDir = path.resolve(__dirname, '..', 'client', 'pages');
const liveReloadServer = liveReload.createServer({
    exts: ['html', 'css', 'js', 'png', 'jpg', 'svg'],
    delay: 100
});
liveReloadServer.watch(staticDir);

app.use(connectLiveReload());

//
app.use(express.static(staticDir, {
    etag: false,
    lastModified: false,
    setHeaders(res) {
        res.setHeader('Cache-Control', 'no-store');
    }
}));

// initDb();

/*const usersRepo = buildUsersRepo(db);
const tasksRepo = buildTasksRepo(db);*/

const JWT_SECRET = config.jwtSecret;
const COOKIE_NAME = config.cookieName;

// const requireAuthMw = requireAuth(JWT_SECRET, COOKIE_NAME);

/*app.use("/api/auth", ({
    //
}));

app.use("/api/tasks", ({
    //
}));*/

// Root route
<<<<<<< HEAD
app.get("/", (req, res) => {
=======
app.get("/", rootLimiter, (req, res) => {
>>>>>>> 530cc1bbe15b14874ca4898bcf536c3c0105a555
    res.sendFile(path.join(staticDir, 'index.html'));
});

//app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Project Forge is running on port ${config.port}`);
});