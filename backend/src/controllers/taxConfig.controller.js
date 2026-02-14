const Joi = require("joi");
const TaxConfig = require("../models/TaxConfig.model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const taxConfigSchema = Joi.object({
  taxType: Joi.string().valid("None", "Service", "GST").required().messages({
    "string.empty": "Tax type is required",
    "any.required": "Tax type must be GST, Service, or None",
    "any.only": "Tax type must be GST, Service, or None",
  }),
  taxNumber: Joi.string().when("taxType", {
    is: Joi.valid("GST", "Service"),
    then: Joi.required().messages({
      "string.empty": "Tax number is required",
      "any.required": "Tax number is required",
    }),
    otherwise: Joi.optional().allow(null, ""),
  }),
  tax1: Joi.object({
    taxName: Joi.string().required().messages({
      "string.empty": "Tax name is required",
      "any.required": "Tax name is required",
    }),
    taxRate: Joi.number().min(1).max(100).required().messages({
      "number.base": "Tax rate must be a number",
      "number.min": "Tax rate must be at least 1",
      "number.max": "Tax rate cannot exceed 100",
      "any.required": "Tax rate is required",
    }),
  }).when("taxType", {
    is: Joi.valid("GST", "Service"),
    then: Joi.required(),
    otherwise: Joi.optional().allow(null),
  }),
  tax2: Joi.object({
    taxName: Joi.string().required().messages({
      "string.empty": "Tax name is required",
      "any.required": "Tax name is required",
    }),
    taxRate: Joi.number().min(1).max(100).required().messages({
      "number.base": "Tax rate must be a number",
      "number.min": "Tax rate must be at least 1",
      "number.max": "Tax rate cannot exceed 100",
      "any.required": "Tax rate is required",
    }),
  }).when("taxType", {
    is: Joi.valid("GST"),
    then: Joi.required(),
    otherwise: Joi.optional().allow(null),
  }),
  tax3: Joi.object({
    taxName: Joi.string().required().messages({
      "string.empty": "Tax name is required",
      "any.required": "Tax name is required",
    }),
    taxRate: Joi.number().min(1).max(100).required().messages({
      "number.base": "Tax rate must be a number",
      "number.min": "Tax rate must be at least 1",
      "number.max": "Tax rate cannot exceed 100",
      "any.required": "Tax rate is required",
    }),
  }).when("taxType", {
    is: Joi.valid("GST"),
    then: Joi.required(),
    otherwise: Joi.optional().allow(null),
  }),
});

// Create Tax Config
exports.createTaxConfig = catchAsync(async (req, res, next) => {
  const { error, value } = taxConfigSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    // const errors = error.details.map((detail) => detail.message).join(", ");
    return next(new ApiError(400, error.details[0].message));
  }

  let updateData = { ...value, tenant: req.user.tenantId };
  if (value.taxType === "None") {
    updateData.taxNumber = null;
    updateData.tax1 = null;
    updateData.tax2 = null;
    updateData.tax3 = null;
  }

  const taxConfig = await TaxConfig.findOneAndUpdate(
    { tenant: req.user.tenantId },
    updateData,
    { new: true, upsert: true, runValidators: true }
  ).select("-_id -tenant -__v -createdAt -updatedAt");

  res.status(201).json({
    success: true,
    message: "Tax config saved successfully",
    data: { taxConfig },
  });
});

// get config
exports.getTaxConfig = catchAsync(async (req, res, next) => {
  let taxConfig = await TaxConfig.findOne({ tenant: req.user.tenantId }).select(
    "-_id -tenant -__v -createdAt -updatedAt"
  );

  if (!taxConfig) {
    taxConfig = {
      taxType: "None",
      taxNumber: null,
      tax1: null,
      tax2: null,
      tax3: null,
    };
  }

  res.status(200).json({
    success: true,
    data: { taxConfig },
  });
});
