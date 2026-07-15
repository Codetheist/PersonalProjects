// Config
const { config } = require("./config");

// Database
const { initDb } = require("./db/db");

// App
const app = require("./app");

// Initialize the database
initDb();

// Start the server
app.listen(config.port, () => {
    console.log("Project Forge is online");
});