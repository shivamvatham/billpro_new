const Joi = require("joi");
const ProductUnit = require("../models/ProductUnit.model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const productUnitSchema = Joi.object({
  unitName: Joi.string().trim().required().messages({
    "string.empty": "Unit name is required",
    "any.required": "Unit name is required",
  }),
  unitDescription: Joi.string().trim().allow("", null).messages({
    "string.base": "Unit description must be a string",
  }),
});

// Create ProductUnit
exports.createProductUnit = catchAsync(async (req, res, next) => {
  const { error, value } = productUnitSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const productUnit = await ProductUnit.create({
    ...value,
    tenant: req.user.tenantId,
  });

  res.status(201).json({
    success: true,
    message: "Product unit created successfully",
    data: { productUnit },
  });
});

// Get all ProductUnits
exports.getProductUnits = catchAsync(async (req, res, next) => {
  const productUnits = await ProductUnit.find({
    tenant: req.user.tenantId,
  }).select("-tenant -__v");

  res.status(200).json({
    success: true,
    data: { productUnits },
  });
});

// Get ProductUnit by ID
exports.getProductUnit = catchAsync(async (req, res, next) => {
  const productUnit = await ProductUnit.findOne({
    _id: req.params.id,
    tenant: req.user.tenantId,
  }).select("-tenant -__v");

  if (!productUnit) {
    return next(new ApiError(404, "Product unit not found"));
  }

  res.status(200).json({
    success: true,
    data: { productUnit },
  });
});

// Update ProductUnit
exports.updateProductUnit = catchAsync(async (req, res, next) => {
  const { error, value } = productUnitSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const productUnit = await ProductUnit.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenantId },
    value,
    { new: true, runValidators: true }
  ).select("-tenant -__v");

  if (!productUnit) {
    return next(new ApiError(404, "Product unit not found"));
  }

  res.status(200).json({
    success: true,
    message: "Product unit updated successfully",
    data: { productUnit },
  });
});

// Delete ProductUnit
exports.deleteProductUnit = catchAsync(async (req, res, next) => {
  const productUnit = await ProductUnit.findOneAndDelete({
    _id: req.params.id,
    tenant: req.user.tenantId,
  });

  if (!productUnit) {
    return next(new ApiError(404, "Product unit not found"));
  }

  res.status(200).json({
    success: true,
    message: "Product unit deleted successfully",
  });
});
