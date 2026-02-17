const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    expenseName: {
      type: String,
      required: [true, "Expense name is required"],
      trim: true,
    },
    accountType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Account type is required"],
    },
    expenseCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpenseCategory",
      required: [true, "Expense category is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    expenseAmount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [1, "Expense amount must be greater than 0"],
    },
    expenseDate: {
      type: Date,
      required: [true, "Expense date is required"],
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
