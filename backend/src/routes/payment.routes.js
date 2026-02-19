const express = require('express');
const {
  createPayment,
  getAllPayments,
  getPayment,
  updatePayment,
  deletePayment
} = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(createPayment)
  .get(getAllPayments);

router
  .route('/:id')
  .get(getPayment)
  .put(updatePayment)
  .delete(deletePayment);

module.exports = router;
