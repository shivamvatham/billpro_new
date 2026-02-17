const mongoose = require("mongoose");

const expenseCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    categoryDescription: {
      type: String,
      trim: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExpenseCategory = mongoose.model("ExpenseCategory", expenseCategorySchema);

module.exports = ExpenseCategory;
