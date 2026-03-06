const { z } = require("zod");

// Shared schemas
const emailSchema = z.preprocess(
    (val) => typeof val === "string" ? val.trim() : val, z.email()
);
const usernameSchema = z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9._-]+$/, "Username can only contain letters, numbers, dots, underscores, and hyphens.");
const identifierSchema = z.string().trim().min(3).max(254).refine((val) => {
    if (val.includes('@')) {
        return emailSchema.safeParse(val).success;
    } else {
        return usernameSchema.safeParse(val).success;
    }
}, "Must be a valid email or username.");
const passwordSchema = z.string()
    .min(8)
    .max(128)
    .refine((val) => val === val.trim(), "Password cannot have leading or trailing whitespace.");
const statusProjectSchema = z.enum(['active', 'completed', 'archived']).default('active');
const statusTaskSchema = z.enum(['todo', 'doing', 'done']).default('todo');
const priorityTaskSchema = z.enum(['low', 'medium', 'high']).default('medium');
const roleSchema = z.enum(['admin', 'member']).default('member');
const dueDateSchema = z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format; enter a date in the format YYYY-MM-DD.")
    .refine((val) => {
        const [year, month, day] = val.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
}, "Must be a valid date string in ISO format (YYYY-MM-DD).");
const uuidSchema = z.preprocess(
    (val) => typeof val === "string" ? val.trim() : val, z.uuid()
);
const nameSchema = z.string().min(3).max(100);
const titleSchema = z.string().min(3).max(100);
const descriptionSchema = z.string().max(500);
const bodySchema = z.string().min(1).max(5000);

// Auth user schemas
const authRegisterSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema
}).strict();

const authLoginSchema = z.object({
    identifier: identifierSchema,
    password: passwordSchema
}).strict();

// Project schemas
const projectCreateSchema = z.object({
    name: nameSchema,
    description: descriptionSchema.optional(),
    status: statusProjectSchema.optional(),
    due_date: dueDateSchema.optional()
}).strict();

const projectUpdateSchema = z.object({
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    status: statusProjectSchema.optional(),
    due_date: dueDateSchema.optional()
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update."
}).strict();

const projectIdParamSchema = z.object({
    project_id: uuidSchema
}).strict();

// Project members schemas
const projectMemberAddSchema = z.object({
    user_id: uuidSchema,
    role: roleSchema.optional()
}).strict();

const projectMemberUpdateSchema = z.object({
    role: roleSchema
}).strict();

const projectMemberParamsSchema = z.object({
    project_id: uuidSchema,
    user_id: uuidSchema
}).strict();

// Task schemas
const taskCreateSchema = z.object({
    title: titleSchema,
    description: descriptionSchema.optional(),
    status: statusTaskSchema.optional(),
    priority: priorityTaskSchema.optional(),
    due_date: dueDateSchema.optional()
}).strict();

const taskUpdateSchema = z.object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    status: statusTaskSchema.optional(),
    priority: priorityTaskSchema.optional(),
    due_date: dueDateSchema.optional()
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update."
}).strict();

const taskIdParamSchema = z.object({
    task_id: uuidSchema
}).strict();

// Comment schemas
const commentCreateSchema = z.object({
    body: bodySchema
}).strict();

const commentUpdateSchema = z.object({
    body: bodySchema
}).strict();

const commentIdParamSchema = z.object({
    comment_id: uuidSchema
}).strict();

// Export schemas
module.exports = {
    authRegisterSchema,
    authLoginSchema,
    projectCreateSchema,
    projectUpdateSchema,
    projectIdParamSchema,
    projectMemberAddSchema,
    projectMemberUpdateSchema,
    projectMemberParamsSchema,
    taskCreateSchema,
    taskUpdateSchema,
    taskIdParamSchema,
    commentCreateSchema,
    commentUpdateSchema,
    commentIdParamSchema
};