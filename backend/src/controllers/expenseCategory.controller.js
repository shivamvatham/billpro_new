const { ExpenseCategory } = require("../models");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.createExpenseCategory = catchAsync(async (req, res, next) => {
  const { categoryName, categoryDescription } = req.body;

  const existingCategory = await ExpenseCategory.findOne({
    categoryName,
    tenant: req.user.tenantId,
  });

  if (existingCategory) {
    return next(new ApiError(400, "Category name already exists"));
  }

  const expenseCategory = await ExpenseCategory.create({
    categoryName,
    categoryDescription,
    tenant: req.user.tenantId,
  });
  res.status(201).json({ expenseCategory });
});

exports.getExpenseCategories = catchAsync(async (req, res) => {
  const expenseCategories = await ExpenseCategory.find({ tenant: req.user.tenantId });
  res.status(200).json({
    success: true,
    data: { expenseCategories: expenseCategories || [] },
  });
});

exports.getExpenseCategoryById = catchAsync(async (req, res) => {
  const expenseCategory = await ExpenseCategory.findOne({
    _id: req.params.id,
    tenant: req.user.tenantId,
  });
  if (!expenseCategory) {
    return res.status(200).json({
      success: true,
      data: { expenseCategory: [] },
    });
  }
  res.status(200).json({
    success: true,
    data: { expenseCategory },
  });
});

exports.updateExpenseCategory = catchAsync(async (req, res, next) => {
  const { categoryName, categoryDescription } = req.body;

  if (categoryName) {
    const nameExists = await ExpenseCategory.findOne({
      categoryName,
      tenant: req.user.tenantId,
      _id: { $ne: req.params.id },
    });

    if (nameExists) {
      return next(new ApiError(400, "Category name already exists"));
    }
  }

  const expenseCategory = await ExpenseCategory.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenantId },
    { categoryName, categoryDescription },
    { new: true, runValidators: true }
  );
  if (!expenseCategory) {
    return res.status(404).json({ message: "Expense category not found" });
  }
  res.status(200).json({ expenseCategory });
});

exports.deleteExpenseCategory = catchAsync(async (req, res) => {
  const expenseCategory = await ExpenseCategory.findOneAndDelete({
    _id: req.params.id,
    tenant: req.user.tenantId,
  });
  if (!expenseCategory) {
    return res.status(404).json({ message: "Expense category not found" });
  }
  res.status(200).json({ message: "Expense category deleted successfully" });
});
