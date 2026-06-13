// Import
const request = require('supertest');
const app = require('../app');

async function createTaskSetup() {
    const stamp = Date.now();
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
        username: `commenter${stamp}`,
        email: `commenter${stamp}@example.com`,
        password: 'password123'
    });

    const projectRes = await agent.post('/api/projects').send({
        name: `Comment Project`
    });

    expect(projectRes.statusCode).toBe(201);

    const projectId = projectRes.body.project.id;
    const taskRes = await agent.post(`/api/projects/${projectId}/tasks`).send({
        title: `Comment Task`
    });

    expect(taskRes.statusCode).toBe(201);

    return {
        agent,
        projectId,
        taskId: taskRes.body.task.id
    };
}

describe('Comments routes', () => {
    test('project member can create comment', async () => {
        const { agent, taskId } = await createTaskSetup();

        const res = await agent.post(`/api/tasks/${taskId}/comments`).send({
            body: 'This is a test comment'
        });

        expect(res.status).toBe(201);
        expect(res.body.comment).toBeDefined();
        expect(res.body.comment.task_id).toBe(taskId);
    });

    test('project member can get task comments', async () => {
        const { agent, taskId } = await createTaskSetup();

        await agent.post(`/api/tasks/${taskId}/comments`).send({
            body: 'Read this comment'
        });
        const res = await agent.get(`/api/tasks/${taskId}/comments`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.comments)).toBe(true);
    });

    test('project member can update comment', async () => {
        const { agent, taskId } = await createTaskSetup();

        const commentRes = await agent.post(`/api/tasks/${taskId}/comments`).send({
            body: 'Original comment'
        });
        const commentId = commentRes.body.comment.id;

        const res = await agent.patch(`/api/comments/${commentId}`).send({
            body: 'Updated comment'
        });

        expect(res.status).toBe(200);
        expect(res.body.comment.body).toBe('Updated comment');
    });

    test('project member can delete comment', async () => {
        const { agent, taskId } = await createTaskSetup();
        
        const commentRes = await agent.post(`/api/tasks/${taskId}/comments`).send({
            body: 'Delete comment'
        });

        const commentId = commentRes.body.comment.id;

        const res = await agent.delete(`/api/comments/${commentId}`);

        expect(res.status).toBe(204);
    });
});
