const Joi = require("joi");
const Product = require("../models/Product.model");
const ProductUnit = require("../models/ProductUnit.model");
const ProductCategory = require("../models/ProductCategory.model");
const TaxConfig = require("../models/TaxConfig.model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const productSchema = Joi.object({
  productName: Joi.string().trim().required().messages({
    "string.empty": "Product name is required",
    "any.required": "Product name is required",
  }),
  hsnCode: Joi.string().trim().allow(null, ""),
  price: Joi.number().default(0),
  unit: Joi.string().required().messages({
    "any.required": "Unit is required",
  }),
  category: Joi.string().required().messages({
    "any.required": "Category is required",
  }),
  productTax: Joi.object({
    tax1Rate: Joi.number().allow(null),
    tax2Rate: Joi.number().allow(null),
    tax3Rate: Joi.number().allow(null),
  }).optional(),
  quantity: Joi.number(),
  reorder: Joi.number(),
  barcodeNumber: Joi.string().trim().allow(null, ""),
});

const validateProductTax = async (productTax, tenantId, next) => {
  if (productTax && (productTax.tax1Rate || productTax.tax2Rate || productTax.tax3Rate)) {
    const taxConfig = await TaxConfig.findOne({ tenant: tenantId });
    if (!taxConfig) {
      return next(new ApiError(400, "Tax config not set"));
    }
    if (productTax.tax1Rate && !taxConfig.tax1?.taxRate) {
      return next(new ApiError(400, "Tax1 not configured"));
    }
    if (productTax.tax2Rate && !taxConfig.tax2?.taxRate) {
      return next(new ApiError(400, "Tax2 not configured"));
    }
    if (productTax.tax3Rate && !taxConfig.tax3?.taxRate) {
      return next(new ApiError(400, "Tax3 not configured"));
    }
  }
};

exports.createProduct = catchAsync(async (req, res, next) => {
  const { error, value } = productSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const existingProduct = await Product.findOne({
    productName: value.productName,
    tenant: req.user.tenantId,
  });

  if (existingProduct) {
    return next(new ApiError(400, "Product name already exists"));
  }

  const unitExists = await ProductUnit.findOne({
    _id: value.unit,
    tenant: req.user.tenantId,
  });
  if (!unitExists) {
    return next(new ApiError(400, "Invalid unit"));
  }

  const categoryExists = await ProductCategory.findOne({
    _id: value.category,
    tenant: req.user.tenantId,
  });
  if (!categoryExists) {
    return next(new ApiError(400, "Invalid category"));
  }

  await validateProductTax(value.productTax, req.user.tenantId, next);

  const product = await Product.create({
    ...value,
    tenant: req.user.tenantId,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: { product },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ tenant: req.user.tenantId })
    .populate("unit", "unitName")
    .populate("category", "categoryName")
    .sort({ createdAt: -1 })
    .select("-__v -tenant");

  res.status(200).json({
    success: true,
    data: {
      products,
      totalProducts: products.length,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,
    tenant: req.user.tenantId,
  })
    .populate("unit", "unitName")
    .populate("category", "categoryName")
    .select("-__v -tenant");

  if (!product) {
    return res.status(200).json({
      success: true,
      data: { product: [] },
    });
  }

  res.status(200).json({
    success: true,
    data: { product },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { error, value } = productSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  if (value.productName) {
    const nameExists = await Product.findOne({
      productName: value.productName,
      tenant: req.user.tenantId,
      _id: { $ne: req.params.id },
    });

    if (nameExists) {
      return next(new ApiError(400, "Product name already exists"));
    }
  }

  if (value.unit) {
    const unitExists = await ProductUnit.findOne({
      _id: value.unit,
      tenant: req.user.tenantId,
    });
    if (!unitExists) {
      return next(new ApiError(400, "Invalid unit"));
    }
  }

  if (value.category) {
    const categoryExists = await ProductCategory.findOne({
      _id: value.category,
      tenant: req.user.tenantId,
    });
    if (!categoryExists) {
      return next(new ApiError(400, "Invalid category"));
    }
  }

  await validateProductTax(value.productTax, req.user.tenantId, next);

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenantId },
    value,
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: { product },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    tenant: req.user.tenantId,
  });

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
