const Joi = require("joi");
const Expense = require("../models/Expense.model");
const Account = require("../models/Account.model");
const { ExpenseCategory } = require("../models");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const expenseSchema = Joi.object({
  expenseName: Joi.string().trim().required().messages({
    "string.empty": "Expense name is required",
    "any.required": "Expense name is required",
  }),
  accountType: Joi.string().required().messages({
    "any.required": "Account type is required",
  }),
  expenseCategory: Joi.string().required().messages({
    "any.required": "Expense category is required",
  }),
  description: Joi.string().trim().allow("", null),
  expenseAmount: Joi.number().min(1).required().messages({
    "number.base": "Expense amount must be a number",
    "number.min": "Expense amount must be greater than 0",
    "any.required": "Expense amount is required",
  }),
  expenseDate: Joi.date().required().messages({
    "date.base": "Expense date must be a valid date",
    "any.required": "Expense date is required",
  }),
});

exports.createExpense = catchAsync(async (req, res, next) => {
  const { error, value } = expenseSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const accountExists = await Account.findOne({
    _id: value.accountType,
    tenant: req.user.tenantId,
  });

  if (!accountExists) {
    return next(new ApiError(400, "Invalid account"));
  }

  const categoryExists = await ExpenseCategory.findOne({
    _id: value.expenseCategory,
    tenant: req.user.tenantId,
  });

  if (!categoryExists) {
    return next(new ApiError(400, "Invalid expense category"));
  }

  const expense = await Expense.create({
    ...value,
    tenant: req.user.tenantId,
  });

  await Account.findByIdAndUpdate(value.accountType, {
    $inc: { currentBalance: -value.expenseAmount },
  });

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: { expense },
  });
});

exports.getExpenses = catchAsync(async (req, res) => {
  const expenses = await Expense.find({ tenant: req.user.tenantId })
    .populate("accountType", "accountName")
    .populate("expenseCategory", "categoryName")
    .select("-tenant -__v");

  res.status(200).json({
    success: true,
    data: { expenses: expenses || [] },
  });
});

exports.getExpense = catchAsync(async (req, res) => {
  const expense = await Expense.findOne({
    _id: req.params.id,
    tenant: req.user.tenantId,
  })
    .populate("accountType", "accountName")
    .populate("expenseCategory", "categoryName")
    .select("-tenant -__v");

  if (!expense) {
    return res.status(200).json({
      success: true,
      data: { expense: [] },
    });
  }

  res.status(200).json({
    success: true,
    data: { expense },
  });
});

exports.updateExpense = catchAsync(async (req, res, next) => {
  const { error, value } = expenseSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const oldExpense = await Expense.findOne({
    _id: req.params.id,
    tenant: req.user.tenantId,
  });

  if (!oldExpense) {
    return next(new ApiError(404, "Expense not found"));
  }

  if (value.accountType) {
    const accountExists = await Account.findOne({
      _id: value.accountType,
      tenant: req.user.tenantId,
    });

    if (!accountExists) {
      return next(new ApiError(400, "Invalid account"));
    }
  }

  if (value.expenseCategory) {
    const categoryExists = await ExpenseCategory.findOne({
      _id: value.expenseCategory,
      tenant: req.user.tenantId,
    });

    if (!categoryExists) {
      return next(new ApiError(400, "Invalid expense category"));
    }
  }

  await Account.findByIdAndUpdate(oldExpense.accountType, {
    $inc: { currentBalance: oldExpense.expenseAmount },
  });

  await Account.findByIdAndUpdate(value.accountType, {
    $inc: { currentBalance: -value.expenseAmount },
  });

  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenantId },
    value,
    { new: true, runValidators: true }
  ).select("-tenant -__v");

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: { expense },
  });
});

exports.deleteExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findOne({
    _id: req.params.id,
    tenant: req.user.tenantId,
  });

  if (!expense) {
    return next(new ApiError(404, "Expense not found"));
  }

  await Account.findByIdAndUpdate(expense.accountType, {
    $inc: { currentBalance: expense.expenseAmount },
  });

  await expense.deleteOne();

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
});
