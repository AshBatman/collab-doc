const express = require('express');
const { createUser } = require('../controllers/userController');

const router = express.Router();

// API to create user
router.get('/user/:userName', createUser);

module.exports = router;