const { z } = require("zod");
const crypto = require("crypto");

const uuidSchema = z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val), z.uuid()
);

// Utility function to generate a unique identifier (UUID)
function uid() {
    return crypto.randomUUID();
}

// Utility function to validate and parse a UUID
function requireUUID(id) {
    return uuidSchema.parse(id);
}

module.exports = {
    uid,
    requireUUID
};