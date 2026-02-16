const express = require("express");
const router = express.Router();
const productUnitController = require("../controllers/productUnit.controller");
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router
  .route("/")
  .post(productUnitController.createProductUnit)
  .get(productUnitController.getProductUnits);

router
  .route("/:id")
  .get(productUnitController.getProductUnit)
  .put(productUnitController.updateProductUnit)
  .delete(productUnitController.deleteProductUnit);

module.exports = router;
