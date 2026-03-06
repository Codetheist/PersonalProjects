const { httpError } = require("../utils/httpError");

// Custom error message configuration for validation errors
const CUSTOM_ERROR_MESSAGE = {
    status: 400,
    message: "Invalid request.",
    exposeIssues: true,
    concatMessage: true,
    issueFormatter: formatZodError
};

// Formats Zod errors into a more readable structure
function formatZodError(errors) {
    return errors.map((issue) => ({
        path: issue.path && issue.path.length ? issue.path.join(".") : "",
        message: issue.message,
        code: issue.code,
    }));
}

// Validates data against a Zod schema and throws an HTTP error if validation fails
function defaultErrorMessage(formattedErrors) {
    const parts = formattedErrors.map((e) =>
        e.path ? `${e.path}: ${e.message}` : e.message
    );
    return parts.join(" | ") || "Invalid request.";
}

// Validates data against a Zod schema and throws an HTTP error if validation fails
function validate(schema, data, options = {}) {
    options = { ...CUSTOM_ERROR_MESSAGE, ...options };
    
    const result = schema.safeParse(data);
    
    if (result.success) {
        return result.data;
    }
    
    const formattedErrors = options.issueFormatter(result.error.issues);
    
    const message = options.concatMessage && formattedErrors.length ?
        defaultErrorMessage(formattedErrors) : options.message;
    
    const err = httpError(options.status, message);
    err.type = "VALIDATION_ERROR";
    
    if (options.exposeIssues) {
        err.issues = formattedErrors;
    }

    throw err;
}

// Factory function to create validation middleware for different parts of the request
function makeValidationMiddleware(getter, setter) {
    return (schema, options = {}) => (req, res, next) => {
        try {
            const data = getter(req);
            const validatedData = validate(schema, data, options);
            setter(req, validatedData);
            next();
        } catch (err) {
            next(err);
        }
    };
}

// Middleware for validating different parts of the request (body, query, params)
const validateBody = makeValidationMiddleware(
    (req) => req.body,
    (req, validatedData) => {
        req.body = validatedData;
    }
);

const validateQuery = makeValidationMiddleware(
    (req) => req.query,
    (req, validatedData) => {
        req.query = validatedData;
    }
);

const validateParams = makeValidationMiddleware(
    (req) => req.params,
    (req, validatedData) => {
        req.params = validatedData;
    }
);

module.exports = {
    validate,
    validateBody,
    validateQuery,
    validateParams
};
