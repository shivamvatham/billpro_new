const express = require('express');
const {
  createReceipt,
  getAllReceipts,
  getReceipt,
  updateReceipt,
  deleteReceipt
} = require('../controllers/receipt.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(createReceipt)
  .get(getAllReceipts);

router
  .route('/:id')
  .get(getReceipt)
  .put(updateReceipt)
  .delete(deleteReceipt);

module.exports = router;
