const Joi = require("joi");
const Account = require("../models/Account.model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const accountSchema = Joi.object({
  accountName: Joi.string().trim().required().messages({
    "string.empty": "Account name is required",
    "any.required": "Account name is required",
  }),
  accountDescription: Joi.string().trim().allow("", null).messages({
    "string.base": "Account description must be a string",
  }),
  openingBalance: Joi.number().default(0).messages({
    "number.base": "Opening balance must be a number",
  }),
});

exports.createAccount = catchAsync(async (req, res, next) => {
  const { error, value } = accountSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const existingAccount = await Account.findOne({
    accountName: value.accountName,
    tenant: req.user.tenantId,
  });

  if (existingAccount) {
    return next(new ApiError(400, "Account name already exists"));
  }

  const account = await Account.create({
    ...value,
    tenant: req.user.tenantId,
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: { account },
  });
});

exports.getAccounts = catchAsync(async (req, res, next) => {
  const accounts = await Account.find({
    tenant: req.user.tenantId,
  }).select("-tenant -__v");

  res.status(200).json({
    success: true,
    data: { accounts: accounts || [] },
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  const account = await Account.findOne({
    _id: req.params.id,
    tenant: req.user.tenantId,
  }).select("-tenant -__v");

  if (!account) {
    return res.status(200).json({
      success: true,
      data: { account: [] },
    });
  }

  res.status(200).json({
    success: true,
    data: { account },
  });
});

exports.updateAccount = catchAsync(async (req, res, next) => {
  const { error, value } = accountSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  if (value.accountName) {
    const nameExists = await Account.findOne({
      accountName: value.accountName,
      tenant: req.user.tenantId,
      _id: { $ne: req.params.id },
    });

    if (nameExists) {
      return next(new ApiError(400, "Account name already exists"));
    }
  }

  const account = await Account.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenantId },
    value,
    { new: true, runValidators: true }
  ).select("-tenant -__v");

  if (!account) {
    return next(new ApiError(404, "Account not found"));
  }

  res.status(200).json({
    success: true,
    message: "Account updated successfully",
    data: { account },
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  const account = await Account.findOneAndDelete({
    _id: req.params.id,
    tenant: req.user.tenantId,
  });

  if (!account) {
    return next(new ApiError(404, "Account not found"));
  }

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});
