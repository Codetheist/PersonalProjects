// Imports
const { httpError } = require('../utils/httpError');
const { UsersRepo } = require('../repos/users.repo');
const { MembersRepo } = require('../repos/members.repo');

// Create repo instances
const usersRepo = new UsersRepo();
const membersRepo = new MembersRepo();

// Require auth
async function requireAuth(req, res, next) {
    try {
        const userId = req.session?.userId;
        
        if (!userId) {
            return next(httpError(401, "Unauthorized"));
        }
        
        // Find user by id
        const user = await usersRepo.findUserById(userId);
        
        if (!user || user.is_active !== 1) {
            return next(httpError(401, "Unauthorized"));
        }
        
        req.user = user;
        
        next();
    
    } catch (err) {
        next(err);
    }
}

// Guest only
function guestOnly(req, res, next) {
    if (req.session?.userId) {
        return next(httpError(403, "Forbidden"));
    }
    
    next();
};

// Authorization
function requireProjectOwner(req, res, next) {
    if (!req.user || !req.project) {
        return next(httpError(500, "Internal Server Error"));
    }

    if (req.project.owner_id !== req.user.id) {
        return next(httpError(403, "Forbidden"));
    }

    next();
}

async function requireProjectMembership(req, res, next) {
    try {
        if (!req.project || !req.user) {
            return next(httpError(500, "Internal Server Error"));
        }

        if (req.project.owner_id === req.user.id) {
            req.role = 'admin';
            return next();
        }

        const membership = await membersRepo.getMembership(req.project.id, req.user.id);
        
        if (!membership) {
            return next(httpError(403, "Forbidden"));
        }
        
        req.membership = membership;
        req.role = membership.role;
        next();
    } catch (err) {
        if (err.status === 404) {
            return next(httpError(403, "Forbidden"));
        }
        next(err);
    }
}

function requireTaskAccess(req, res, next) {
    if (!req.user || !req.project || !req.task) {
        return next(httpError(500, "Internal Server Error"));
    }

    const isProjectOwner = req.project.owner_id === req.user.id;
    const isProjectMember = req.membership &&
        req.membership.project_id === req.project.id &&
        req.membership.user_id === req.user.id;

    if (!isProjectOwner && !isProjectMember) {
        return next(httpError(403, "Forbidden"));
    }
    
    next();
}

function requireCommentAccess(req, res, next) {
    if (!req.user || !req.project || !req.comment) {
        return next(httpError(500, "Internal Server Error"));
    }

    const isProjectOwner = req.project.owner_id === req.user.id;
    const isProjectMember = req.membership &&
        req.membership.project_id === req.project.id &&
        req.membership.user_id === req.user.id;
    
    if (isProjectOwner || isProjectMember) {
        return next();
    }

    return next(httpError(403, "Forbidden"));
}

// Export
module.exports = {
    requireAuth,
    guestOnly,
    requireProjectOwner,
    requireProjectMembership,
    requireTaskAccess,
    requireCommentAccess,
}