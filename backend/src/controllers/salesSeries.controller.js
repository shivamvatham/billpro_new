const Joi = require('joi');
const SalesSeries = require('../models/SalesSeries.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const salesSeriesSchema = Joi.object({
    invoiceSeriesName: Joi.string().trim().required().messages({
        'string.empty': 'Invoice series name is required',
        'any.required': 'Invoice series name is required'
    }),
    invoiceSeriesTitle: Joi.string().trim().required().messages({
        'string.empty': 'Invoice series title is required',
        'any.required': 'Invoice series title is required'
    }),
    invoiceSeriesPrefix: Joi.string().trim().allow('', null),
    invoiceSeriesTerms: Joi.string().trim().allow('', null),
    invoiceSeriesStartingNumber: Joi.number().integer().min(1).required().messages({
        'number.base': 'Starting number must be a number',
        'number.min': 'Starting number must be at least 1',
        'any.required': 'Starting number is required'
    }),
    invoiceTemplateNumber: Joi.number().integer().min(1).required().messages({
        'number.base': 'Template number must be a number',
        'number.min': 'Template number must be at least 1',
        'any.required': 'Template number is required'
    })
});

exports.createSalesSeries = catchAsync(async (req, res, next) => {
    const { error, value } = salesSeriesSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }

    const existingSeries = await SalesSeries.findOne({
        invoiceSeriesName: value.invoiceSeriesName,
        tenant: req.user.tenantId
    });

    if (existingSeries) {
        return next(new ApiError(400, 'Invoice series name already exists'));
    }

    const salesSeries = await SalesSeries.create({
        ...value,
        tenant: req.user.tenantId
    });

    res.status(201).json({
        success: true,
        message: 'Sales series created successfully',
        data: { salesSeries }
    });
});

exports.getAllSalesSeries = catchAsync(async (req, res, next) => {
    const salesSeries = await SalesSeries.find({ tenant: req.user.tenantId })
        .sort({ createdAt: -1 })
        .select('-__v -tenant');

    const total = await SalesSeries.countDocuments({ tenant: req.user.tenantId });

    res.status(200).json({
        success: true,
        data: {
            salesSeries,
            totalSalesSeries: total
        }
    });
});

exports.getSalesSeries = catchAsync(async (req, res, next) => {
    const salesSeries = await SalesSeries.findOne({
        _id: req.params.id,
        tenant: req.user.tenantId
    }).select('-__v -tenant');

    if (!salesSeries) {
        return next(new ApiError(404, 'Sales series not found'));
    }

    res.status(200).json({
        success: true,
        data: { salesSeries }
    });
});

exports.updateSalesSeries = catchAsync(async (req, res, next) => {
    const { error, value } = salesSeriesSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }

    const existingSeries = await SalesSeries.findOne({
        invoiceSeriesName: value.invoiceSeriesName,
        tenant: req.user.tenantId,
        _id: { $ne: req.params.id }
    });

    if (existingSeries) {
        return next(new ApiError(400, 'Invoice series name already exists'));
    }

    const salesSeries = await SalesSeries.findOneAndUpdate(
        { _id: req.params.id, tenant: req.user.tenantId },
        value,
        { new: true, runValidators: true }
    );

    if (!salesSeries) {
        return next(new ApiError(404, 'Sales series not found'));
    }

    res.status(200).json({
        success: true,
        message: 'Sales series updated successfully',
        data: { salesSeries }
    });
});

exports.deleteSalesSeries = catchAsync(async (req, res, next) => {
    const salesSeries = await SalesSeries.findOneAndDelete({
        _id: req.params.id,
        tenant: req.user.tenantId
    });

    if (!salesSeries) {
        return next(new ApiError(404, 'Sales series not found'));
    }

    res.status(200).json({
        success: true,
        message: 'Sales series deleted successfully'
    });
});
