const express = require('express');
const authRoutes = require('./auth.routes');
const customerRoutes = require('./customer.routes');

const router = express.Router();

router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working! Multi-tenant billing system ready.'
  });
});

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);

module.exports = router;