// Environment variables
require("dotenv").config();

function getEnv(envName, fallbackValue) {
    const envValue = process.env[envName];
    
    if (envValue === undefined || envValue === "") {
        return fallbackValue;
    }
    
    return envValue;
}

const nodeEnv = getEnv("NODE_ENV", "development");
const port = Number(getEnv("PORT", "3000"));

if (Number.isNaN(port)) {
    throw new Error("PORT must be a valid number.");
}

const config = {
    nodeEnv,
    port,
    sessionSecret: getEnv("SESSION_SECRET",""),
    cookieName: getEnv("COOKIE_NAME","projectforge.sid"),
    corsOrigin: getEnv("CORS_ORIGIN", "http://localhost:5173"),
    dbPath: getEnv("DB_PATH","./data/projectforge.db"),
    isProd: nodeEnv === "production"
};

if (!config.sessionSecret) {
    throw new Error("Missing SESSION_SECRET in environment.");
}

module.exports = {
    config
};