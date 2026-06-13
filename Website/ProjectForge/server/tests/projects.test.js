// Import
const request = require('supertest');
const app = require('../app');

async function createLoginAgent() {
    const stamp = Date.now();
    const agent = request.agent(app);

    await agent
        .post('/api/auth/register')
        .send({
            username: `projectuser${stamp}`,
            email: `projectuser${stamp}@example.com`,
            password: 'password123'
        });

    return agent;
}

describe('Projects routes', () => {
    test('logged in user can create project', async () => {
        const agent = await createLoginAgent();

        const res = await agent
            .post('/api/projects')
            .send({
                name: 'Test Project'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.project).toBeDefined();
        expect(res.body.project.name).toBe('Test Project');
    });

    test('logged in user can get own projects', async () => {
        const agent = await createLoginAgent();
        await agent
            .post('/api/projects')
            .send({
                name: 'Project List Test'
            });
        const res = await agent.get('/api/projects');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.projects)).toBe(true);
    });

    test('owner can update project', async () => {
        const agent = await createLoginAgent();
        const createRes = await agent
            .post('/api/projects')
            .send({
                name: 'Old Project Name'
            });
        const projectId = createRes.body.project.id;
        const res = await agent
            .patch(`/api/projects/${projectId}`)
            .send({
                name: 'Updated Project Name'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.project.name).toBe('Updated Project Name');
    });

    test('owner can delete project', async () => {
        const agent = await createLoginAgent();
        const createRes = await agent
            .post('/api/projects')
            .send({
                name: 'Delete Project'
            });
        const projectId = createRes.body.project.id;
        const res = await agent.delete(`/api/projects/${projectId}`);
        expect(res.statusCode).toBe(200);
    });
});