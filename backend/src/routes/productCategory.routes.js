const express = require("express");
const router = express.Router();
const productCategoryController = require("../controllers/productCategory.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router
  .route("/")
  .post(productCategoryController.createProductCategory)
  .get(productCategoryController.getProductCategories);

router
  .route("/:id")
  .get(productCategoryController.getProductCategory)
  .put(productCategoryController.updateProductCategory)
  .delete(productCategoryController.deleteProductCategory);

module.exports = router;
