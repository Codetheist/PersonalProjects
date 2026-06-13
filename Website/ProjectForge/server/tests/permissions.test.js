// Import
const request = require('supertest');
const app = require('../app');

async function createUser(prefix) {
    const stamp = Date.now() + Math.floor(Math.random() * 1000);
    const agent = request.agent(app);

    const res = await agent
        .post('/api/auth/register')
        .send({
            username: `${prefix}${stamp}`,
            email: `${prefix}${stamp}@example.com`,
            password: 'password123'
        });
    
    expect(res.statusCode).toBe(201);

    return {
        agent,
        user: res.body.user
    };
}

describe('Permissions rules', () => {
    test("non-member cannot view another user's project", async () => {
        const owner = await createUser('owner');
        const nonMember = await createUser('nonmember');

        const projectRes = await owner.agent
            .post('/api/projects')
            .send({
                name: 'Private Project'
            });
        
        const projectId = projectRes.body.project.id;
        
        const res = await nonMember.agent
            .get(`/api/projects/${projectId}`);
        
        expect(res.status).toBe(403);
    });

    test('non-owner cannot delete another user\'s project', async () => {
        const owner = await createUser('ownerDelete');
        const nonOwner = await createUser('nonOwnerDelete');

        const projectRes = await owner.agent
            .post('/api/projects')
            .send({
                name: 'Owner only Project'
            });
        
        const projectId = projectRes.body.project.id;

        await owner.agent.post(`/api/projects/${projectId}/members`)
            .send({
                user_id: nonOwner.user.id,
                role: 'member'
            });
        
        const res = await nonOwner.agent
            .delete(`/api/projects/${projectId}`);
        
        expect(res.status).toBe(403);
    });

    test('project member can view project', async () => {
        const owner = await createUser('ownerProject');
        const member = await createUser('memberProject');

        const projectRes = await owner.agent
            .post('/api/projects')
            .send({
                name: 'Team Project'
            });
        
        const projectId = projectRes.body.project.id;
        
        await owner.agent
            .post(`/api/projects/${projectId}/members`)
            .send({
                user_id: member.user.id,
                role: 'member'
            });
        
        const res = await member.agent
            .get(`/api/projects/${projectId}`);
        
        expect(res.status).toBe(200);
    });
});