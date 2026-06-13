// Import
const request = require('supertest');
const app = require('../app');

// Test suite for authentication
describe('Authentication', () => {
    test('register creates a new user', async () => {
        const stamp = Date.now();

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: `testuser${stamp}`,
                email: `testuser${stamp}@example.com`,
                password: 'password123'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user).toHaveProperty('username', `testuser${stamp}`);
    });

    test('logout works', async () => {
        const stamp = Date.now();
        const agent = request.agent(app);
        
        await agent
            .post('/api/auth/register')
            .send({
                username: `logoutuser${stamp}`,
                email: `logoutuser${stamp}@example.com`,
                password: 'password123'
            });
        
        const logoutRes = await agent
            .post('/api/auth/logout');
        
        expect(logoutRes.statusCode).toBe(200);
        
        const res = await agent
            .get('/api/auth/me');
        
        expect(res.statusCode).toBe(401);
    });

    test('login works with correct credentials', async () => {
        const stamp = Date.now();
        
        await request(app)
            .post('/api/auth/register')
            .send({
                username: `testuser${stamp}`,
                email: `testuser${stamp}@example.com`,
                password: 'password123'
            });
        
        const agent = request.agent(app);

        const res = await agent
            .post('/api/auth/login')
            .send({
                identifier: `testuser${stamp}@example.com`,
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.username).toBeDefined();
    });

    test('/me requires login', async () => {
        const res = await request(app)
            .get('/api/auth/me');
        
        expect(res.statusCode).toBe(401);
    });

    test('/me works when logged in', async () => {
        const stamp = Date.now();
        const agent = request.agent(app);

        await agent
            .post('/api/auth/register')
            .send({
                username: `testuser${stamp}`,
                email: `testuser${stamp}@example.com`,
                password: 'password123'
            });

        // Then, attempt to log in with the same credentials
        const res = await agent
            .get('/api/auth/me');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.user.username).toBeDefined();
    });

    /*
    test.todo('change password');
    test.todo('forgot password');
    test.todo('reset password');
    test.todo('verify email');
    */
});
