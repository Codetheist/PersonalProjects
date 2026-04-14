const {taskCreateSchema, taskUpdateSchema, taskIdParamSchema, projectIdParamSchema} = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../validation/validate');
/*
    TODO: Implement the following routes:
    - Get all tasks
    - Get tasks by project
    - Get single task
    - Create task
    - Update task
    - Delete task
*/

function tasksRoutes(db) {
    const router = express.Router();
    // repo instance

    // Get all tasks
    // get all tasks
    // return tasks

    // Get tasks by project
    // validate params
    // get tasks by project
    // return tasks

    // Get single task
    // validate params
    // get single task
    // handle not found if needed
    // return task

    // Create task
    // validate params if needed
    // validate body
    // create task
    // return created task

    // Update task
    // validate params
    // validate body
    // update task
    // handle not found if needed
    // return updated task

    // Delete task
    // validate params
    // delete task
    // handle not found if needed
    // return success response

    return router;
}

module.exports = {
    tasksRoutes
};