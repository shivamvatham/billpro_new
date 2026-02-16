const Joi = require("joi");
const ProductCategory = require("../models/ProductCategory.model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const productCategorySchema = Joi.object({
  categoryName: Joi.string().trim().required().messages({
    "string.empty": "Category name is required",
    "any.required": "Category name is required",
  }),
  categoryDescription: Joi.string().trim().allow("", null).messages({
    "string.base": "Category description must be a string",
  }),
});

exports.createProductCategory = catchAsync(async (req, res, next) => {
  const { error, value } = productCategorySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const productCategory = await ProductCategory.create({
    ...value,
    tenant: req.user.tenantId,
  });

  res.status(201).json({
    success: true,
    message: "Product category created successfully",
    data: { productCategory },
  });
});

exports.getProductCategories = catchAsync(async (req, res, next) => {
  const productCategories = await ProductCategory.find({
    tenant: req.user.tenantId,
  }).select("-tenant -__v");

  res.status(200).json({
    success: true,
    data: { productCategories },
  });
});

exports.getProductCategory = catchAsync(async (req, res, next) => {
  const productCategory = await ProductCategory.findOne({
    _id: req.params.id,
    tenant: req.user.tenantId,
  }).select("-tenant -__v");

  if (!productCategory) {
    return next(new ApiError(404, "Product category not found"));
  }

  res.status(200).json({
    success: true,
    data: { productCategory },
  });
});

exports.updateProductCategory = catchAsync(async (req, res, next) => {
  const { error, value } = productCategorySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const productCategory = await ProductCategory.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenantId },
    value,
    { new: true, runValidators: true }
  ).select("-tenant -__v");

  if (!productCategory) {
    return next(new ApiError(404, "Product category not found"));
  }

  res.status(200).json({
    success: true,
    message: "Product category updated successfully",
    data: { productCategory },
  });
});

exports.deleteProductCategory = catchAsync(async (req, res, next) => {
  const productCategory = await ProductCategory.findOneAndDelete({
    _id: req.params.id,
    tenant: req.user.tenantId,
  });

  if (!productCategory) {
    return next(new ApiError(404, "Product category not found"));
  }

  res.status(200).json({
    success: true,
    message: "Product category deleted successfully",
  });
});
