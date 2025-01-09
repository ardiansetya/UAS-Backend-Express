const express = require('express');
const { register, login } = require('../controller/authController');
const router = express.Router();

// Endpoint untuk register
router.post('/register', register);

// Endpoint untuk login
router.post('/login', login);

module.exports = router;
