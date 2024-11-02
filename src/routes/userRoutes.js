const express = require('express');
const { createUser } = require('../controllers/userController');

const router = express.Router();

// Healthz API
router.get('/user/:userName', createUser);

module.exports = router;