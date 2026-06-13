const { initDB } = require('../db/db');
const path = require('path');
const fs = require('fs');
const { config } = require("../config");

beforeAll(() => {
    const dbFilePath = path.resolve(__dirname, "..", config.dbPath);

    const dbExists = fs.existsSync(dbFilePath);

    if (!dbExists) {
        initDB();
    }
});