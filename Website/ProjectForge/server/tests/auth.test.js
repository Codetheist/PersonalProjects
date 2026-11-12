// Import
const request = require('supertest');
const app = require('../app');

// Test suite for authentication
describe('Authentication', () => {
    // Register test
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

    // Logout test
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
        
        expect(res.statusCode).toBe(200);
        expect(res.body.user).toBeNull();
    });

    // Login with correct credentials test
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

    // Login test
    test('/me requires login', async () => {
        const res = await request(app)
            .get('/api/auth/me');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.user).toBeNull();
    });

    // Logged in user test
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
        
        const res = await agent
            .get('/api/auth/me');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.user.username).toBeDefined();
    });

    // Update profile test
    test('update profile works', async () => {
        const stamp = Date.now();
        const agent = request.agent(app);

        await agent
            .post('/api/auth/register')
            .send({
                username: `testuser${stamp}`,
                email: `testuser${stamp}@example.com`,
                password: 'password123'
            });

        const newUsername = `updateduser${stamp}`;
        const newEmail = `updateduser${stamp}@example.com`;

        const res = await agent
            .patch('/api/auth/me')
            .send({
                username: newUsername,
                email: newEmail
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.username).toBe(newUsername);
        expect(res.body.user.email).toBe(newEmail);
    });

    // Change password test
    test('change password', async () => {
        const stamp = Date.now();
        const agent = request.agent(app);

        await agent
            .post('/api/auth/register')
            .send({
                username: `testuser${stamp}`,
                email: `testuser${stamp}@example.com`,
                password: 'password123'
            });
        
        const res = await agent
            .patch('/api/auth/change-password')
            .send({
                currentPassword: 'password123',
                newPassword: 'newpassword123',
                confirmPassword: 'newpassword123'
            });
        expect(res.statusCode).toBe(200);
    });

    /*
    test.todo('forgot password');
    test.todo('reset password');
    test.todo('verify email');
    */
});
/* Template:
test('feature name', async () => {
    const stamp = Date.now();
    const agent = request.agent(app);
    await agent
        .post('/api/auth/register')
        .send({
            username: `testuser${stamp}`,
            email: `testuser${stamp}@example.com`,
            password: 'password123'
        });
    
    // action being tested
    const res = await agent
        .method('METHOD_NAME')
        .send({
            // request payload here
        });
    
    // assertions
    expect(res.statusCode).toBe(200);
});
*/