function getEnv(envName, fallbackValue) {
    const envValue = process.env[envName];
    if (envValue === undefined || envValue === "") return fallbackValue;
    return envValue;
}

const config = {
    nodeEnv: getEnv("NODE_ENV","development"),
    port: Number(getEnv("PORT","3000")),
    jwtSecret: getEnv("JWT_SECRET",""),
    cookieName: getEnv("COOKIE_NAME",""),
    corsOrigin: getEnv("CORS_ORIGIN", true),
    dbPath: getEnv("DB_PATH",""),
    isProd: getEnv("NODE_ENV","development") === "production"
};

if (!config.jwtSecret) {
    throw new Error("Missing JWT_SECRET in environment.");
}

module.exports = { config };