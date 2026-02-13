const Joi = require("joi");
const CompanyDetail = require("../models/CompanyDetails.model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const fs = require("fs");
const path = require("path");

const companyDetailSchema = Joi.object({
  companyName: Joi.string().trim().required().messages({
    "string.empty": "Company name is required",
    "any.required": "Company name is required",
    "string.base": "Company name must be a string",
  }),
  address: Joi.string().trim().required().messages({
    "string.empty": "Address is required",
    "any.required": "Address is required",
    "string.base": "Address must be a string",
  }),
  contactNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(3)
    .max(20)
    .required()
    .messages({
      "string.pattern.base": "Contact number is not valid",
      "string.min": "Contact number cannot less than 3 digits",
      "string.max": "Contact number cannot exceed 20 digits",
      "any.required": "Contact number is required",
    }),
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "string.base": "Email must be a string",
    "any.required": "Email is required",
  }),
  gstNumber: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid GST number format",
    }),
});

// Create/Update Company Detail
exports.createCompanyDetail = catchAsync(async (req, res, next) => {
  const { error, value } = companyDetailSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message).join(", ");
    return next(new ApiError(400, errors));
  }

  const companyDetail = await CompanyDetail.findOneAndUpdate(
    { tenant: req.user.tenantId },
    { ...value, tenant: req.user.tenantId },
    { new: true, upsert: true, runValidators: true }
  ).select("-_id -tenant -__v -createdAt -updatedAt");

  res.status(201).json({
    success: true,
    message: "Company details saved successfully",
    data: { companyDetail },
  });
});

// Get Company Detail
exports.getCompanyDetail = catchAsync(async (req, res, next) => {
  const companyDetail = await CompanyDetail.findOne({
    tenant: req.user.tenantId,
  }).select("-_id -tenant -__v -createdAt -updatedAt");

  if (!companyDetail) {
    return res.status(200).json({ status: true, data: { companyDetail: {} } });
  }

  res.status(200).json({
    success: true,
    data: { companyDetail },
  });
});

// Update Logo
exports.updateLogo = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(400, "Logo file is required"));
  }

  const companyDetail = await CompanyDetail.findOne({
    tenant: req.user.tenantId,
  });

  // Delete old logo if exists
  if (companyDetail && companyDetail.logo) {
    const oldLogoPath = path.join(__dirname, "../../", companyDetail.logo);
    if (fs.existsSync(oldLogoPath)) {
      fs.unlinkSync(oldLogoPath);
    }
  }

  const logoPath = `/uploads/logos/${req.file.filename}`;

  await CompanyDetail.findOneAndUpdate(
    { tenant: req.user.tenantId },
    { logo: logoPath, tenant: req.user.tenantId },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Logo updated successfully",
    data: { logo: logoPath },
  });
});
