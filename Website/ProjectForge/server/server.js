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
app.get("/", (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
});

//app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Project Forge is running on port ${config.port}`);
});