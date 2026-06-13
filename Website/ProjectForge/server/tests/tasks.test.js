// Import
const request = require('supertest');
const app = require('../app');

async function createProject() {
    const stamp = Date.now();
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
        username: `taskuser${stamp}`,
        email: `taskuser${stamp}@example.com`,
        password: 'password123'
    });

    const projectRes = await agent.post('/api/projects').send({
        name: `Task Project ${stamp}`
    });

    return { agent, projectId: projectRes.body.project.id };
}

describe('Task routes', () => {
    test('project owner can create task', async () => {
        const { agent, projectId } = await createProject();

        const res = await agent.post(`/api/projects/${projectId}/tasks`).send({
            title: 'Test Task',
            description: 'This is a test task'
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.task).toBeDefined();
        expect(res.body.task.project_id).toBe(projectId);
    });

    test('project owner can read task', async () => {
        const { agent, projectId } = await createProject();
        const taskRes = await agent.post(`/api/projects/${projectId}/tasks`).send({
            title: 'Read Task'
        });

        const taskId = taskRes.body.task.id;
        const res = await agent.get(`/api/projects/${projectId}/tasks/${taskId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.task.id).toBe(taskId);
    });

    test('project owner can update task', async () => {
        const { agent, projectId } = await createProject();
        const taskRes = await agent.post(`/api/projects/${projectId}/tasks`).send({
            title: 'Old Task'
        });

        const taskId = taskRes.body.task.id;
        const res = await agent.patch(`/api/projects/${projectId}/tasks/${taskId}`).send({
            title: 'Updated Task'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.task.title).toBe('Updated Task');
    });

    test('project owner can delete task', async () => {
        const { agent, projectId } = await createProject();
        const taskRes = await agent.post(`/api/projects/${projectId}/tasks`).send({
            title: 'Delete Task'
        });

        const taskId = taskRes.body.task.id;
        const res = await agent.delete(`/api/projects/${projectId}/tasks/${taskId}`);
        expect(res.statusCode).toBe(200);
    });
});