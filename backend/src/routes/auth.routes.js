const express = require('express');
const { login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;