const express = require("express");
const router = express.Router();
const expenseCategoryController = require("../controllers/expenseCategory.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router
  .route("/")
  .post(expenseCategoryController.createExpenseCategory)
  .get(expenseCategoryController.getExpenseCategories);

router
  .route("/:id")
  .get(expenseCategoryController.getExpenseCategoryById)
  .put(expenseCategoryController.updateExpenseCategory)
  .delete(expenseCategoryController.deleteExpenseCategory);

module.exports = router;
