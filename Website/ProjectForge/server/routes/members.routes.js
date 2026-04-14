const {projectMemberAddSchema, projectMemberUpdateSchema, projectMemberParamsSchema} = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../validation/validate');
/*
    TODO: Implement the following routes:
    - Get members by project
    - Add member to project
    - Update member in project
    - Remove member from project
*/

function membersRoutes(db) {
    const router = express.Router();
    // repo instance

    // Get members by project
    // validate params
    // get members by project
    // return members

    // Add member to project
    // validate params
    // validate body
    // add member
    // return created member

    // Update member in project
    // validate params
    // validate body
    // update member
    // handle not found if needed
    // return updated member

    // Remove member from project
    // validate params
    // remove member
    // handle not found if needed
    // return success response

    return router;
}

module.exports = {
    membersRoutes
};