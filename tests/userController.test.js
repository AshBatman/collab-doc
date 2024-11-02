const request = require('supertest');
const express = require('express');
const userController = require('../src/controllers/userController');
const Users = require('../src/models/userModel');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.get('/api/users/:userName', userController.createUser); // Route for the getUser function

jest.mock('../src/models/userModel');

describe('User Controller - createUser', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should return 400 error with user name not unique', async () => {
        const mockUser = {
            userName: 'testuser',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Mock implementation for Users model's findOne method
        Users.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
            .get(`/api/users/testuser`); // Using GET request to fetch user

        // Assertions
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Username is not uniue' });
        expect(Users.findOne).toHaveBeenCalledWith({ userName: 'testuser' });
    });

    test('should return 500 on server error', async () => {
        // Mock implementation to simulate a server error
        Users.findOne.mockRejectedValue(new Error('Database Error'));

        const response = await request(app)
            .get('/api/users/testuser'); // Attempt to fetch user

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
    });
});
