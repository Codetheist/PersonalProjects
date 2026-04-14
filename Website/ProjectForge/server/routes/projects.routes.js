const {projectCreateSchema, projectUpdateSchema, projectIdParamSchema} = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../validation/validate');
/*
    TODO: Implement the following routes:
    - Get all projects
    - Get single project
    - Create project
    - Update project
    - Delete project
*/

function projectsRoutes(db) {
    const router = express.Router();
    // repo instance

    // Get all projects
    // get all projects
    // return projects

    // Get single project
    // validate params
    // get single project
    // handle not found if needed
    // return project

    // Create project
    // validate body
    // create project
    // return created project

    // Update project
    // validate params
    // validate body
    // update project
    // handle not found if needed
    // return updated project

    // Delete project
    // validate params
    // delete project
    // handle not found if needed
    // return success response

    return router;
}

module.exports = {
    projectsRoutes
};