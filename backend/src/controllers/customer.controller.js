// src/controllers/customer.controller.js
const Joi = require('joi');
const Customer = require('../models/Customer.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// Validation Schema
const customerSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Customer name is required',
        'any.required': 'Customer name is required'
    }),
    contactNumber: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(3)
        .max(20)
        .allow(null, '')
        .messages({
            'string.pattern.base': 'Contact number is not valid',
            'string.min': 'Contact number cannot less than 3 digits',
            'string.max': 'Contact number cannot exceed 20 digits',
        }),
    email: Joi.string()
        .email()
        .lowercase()
        .allow(null, '')
        .messages({
            'string.email': 'Please provide a valid email address'
        }),
    address: Joi.string().allow(null, '').max(500),
    state: Joi.string().default('24-Gujarat'),
    gstNumber: Joi.string()
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
        .allow(null, '')
        .messages({
            'string.pattern.base': 'Invalid GST number format'
        }),
    creditPeriodDays: Joi.number().integer().min(0).default(0),
    openingBalance: Joi.number().default(0)
});

// Create Customer
exports.createCustomer = catchAsync(async (req, res, next) => {
    const { error, value } = customerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message).join(', ');
        return next(new ApiError(400, errors));
    }

    const existingCustomer = await Customer.findOne({
        name: value.name,
        tenant: req.user.tenantId
    });

    if (existingCustomer) {
        return next(new ApiError(400, 'Customer name already exists'));
    }

    const customer = await Customer.create({
        ...value,
        tenant: req.user.tenantId
    });

    res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: { customer }
    });
});

// Get All Customers (for current tenant)
exports.getAllCustomers = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const customers = await Customer.find({ tenant: req.user.tenantId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Customer.countDocuments({ tenant: req.user.tenantId });

    res.status(200).json({
        success: true,
        data: {
            customers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalCustomers: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        }
    });
});

// Get Single Customer
exports.getCustomer = catchAsync(async (req, res, next) => {
    const customer = await Customer.findOne({
        _id: req.params.id,
        tenant: req.user.tenantId
    });

    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    res.status(200).json({
        success: true,
        data: { customer }
    });
});

// Update Customer
exports.updateCustomer = catchAsync(async (req, res, next) => {
    const { error, value } = customerSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        const errors = error.details.map(detail => detail.message).join(', ');
        return next(new ApiError(400, errors));
    }

    // Prevent name conflict with another customer in same tenant
    if (value.name) {
        const nameExists = await Customer.findOne({
            name: value.name,
            tenant: req.user.tenantId,
            _id: { $ne: req.params.id }
        });

        if (nameExists) {
            return next(new ApiError(400, 'Another customer with this name already exists'));
        }
    }

    const customer = await Customer.findOneAndUpdate(
        { _id: req.params.id, tenant: req.user.tenantId },
        value,
        { new: true, runValidators: true }
    );

    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: { customer }
    });
});

// Delete Customer
exports.deleteCustomer = catchAsync(async (req, res, next) => {
    const customer = await Customer.findOneAndDelete({
        _id: req.params.id,
        tenant: req.user.tenantId
    });

    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    res.status(200).json({
        success: true,
        message: 'Customer deleted successfully'
    });
});