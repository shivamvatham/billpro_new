const express = require('express');
const {
  createSalesSeries,
  getAllSalesSeries,
  getSalesSeries,
  updateSalesSeries,
  deleteSalesSeries
} = require('../controllers/salesSeries.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(createSalesSeries)
  .get(getAllSalesSeries);

router
  .route('/:id')
  .get(getSalesSeries)
  .put(updateSalesSeries)
  .delete(deleteSalesSeries);

module.exports = router;
