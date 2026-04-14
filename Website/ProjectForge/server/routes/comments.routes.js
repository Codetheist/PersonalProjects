const {commentCreateSchema, commentUpdateSchema, commentIdParamSchema, taskIdParamSchema} = require('../validation/schemas');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../validation/validate');
/*
    TODO: Implement the following routes:
    - Get comments by task
    - Create comment
    - Update comment
    - Delete comment
*/

function commentsRoutes(db) {
    const router = express.Router();
    // repo instance

    // Get comments by task
    // validate params
    // get comments by task
    // return comments

    // Create comment
    // validate params
    // validate body
    // create comment
    // return created comment

    // Update comment
    // validate params
    // validate body
    // update comment
    // handle not found if needed
    // return updated comment

    // Delete comment
    // validate params
    // delete comment
    // handle not found if needed
    // return success response

    return router;
}

module.exports = {
    commentsRoutes
};