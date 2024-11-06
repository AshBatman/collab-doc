const request = require('supertest');
const express = require('express');
const userController = require('../src/controllers/userController');
const Users = require('../src/models/userModel');

const app = express();
app.use(express.json());
app.get('/api/users/:userName', userController.createUser);

jest.mock('../src/models/userModel');

describe('User Controller - createUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 200 success while creating new user', async () => {
        const mockUser = {
            userName: 'testuser',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        Users.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
            .get(`/api/users/testuser`);

        expect(response.status).toBe(200);
        expect(Users.findOne).toHaveBeenCalledWith({ userName: 'testuser' });
    });

    test('should return 500 on server error', async () => {
        Users.findOne.mockRejectedValue(new Error('Database Error'));

        const response = await request(app)
            .get('/api/users/testuser');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
    });
});
