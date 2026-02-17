const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router
  .route("/")
  .post(expenseController.createExpense)
  .get(expenseController.getExpenses);

router
  .route("/:id")
  .get(expenseController.getExpense)
  .put(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

module.exports = router;
