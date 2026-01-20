// src/routes/customer.routes.js
const express = require('express');
const {
  createCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes protected and tenant-scoped automatically
router.use(protect); // Requires login

// Optional: restrict to admin only
// router.use(authorize('admin'));

router
  .route('/')
  .post(createCustomer)
  .get(getAllCustomers);

router
  .route('/:id')
  .get(getCustomer)
  .patch(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;