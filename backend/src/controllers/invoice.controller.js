const { Customer, SalesSeries, Product, TaxConfig, Invoice } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Joi = require('joi');

const invoiceSchema = Joi.object({
    customerId: Joi.string().required().messages({
        'string.empty': 'Customer is required',
        'any.required': 'Customer is required'
    }),
    salesSeriesId: Joi.string().required().messages({
        'string.empty': 'Sales series is required',
        'any.required': 'Sales series is required'
    }),
    invoiceNumber: Joi.string().trim().required().messages({
        'string.empty': 'Invoice number is required',
        'any.required': 'Invoice number is required'
    }),
    shippingAddress: Joi.string().trim().allow('', null),
    shippingAmount: Joi.number().min(0).default(0),
    paidAmount: Joi.number().min(0).default(0),
    grossAmount: Joi.number().min(0).required().messages({
        'number.base': 'Gross amount must be a number',
        'any.required': 'Gross amount is required'
    }),
    invoiceDate: Joi.date().required().messages({
        'date.base': 'Invalid invoice date',
        'any.required': 'Invoice date is required'
    }),
    dueDate: Joi.date().required().messages({
        'date.base': 'Invalid due date',
        'any.required': 'Due date is required'
    }),
    items: Joi.array().items(
        Joi.object({
            itemId: Joi.string().required().messages({
                'string.empty': 'Item is required',
                'any.required': 'Item is required'
            }),
            price: Joi.number().min(0).required().messages({
                'number.base': 'Price must be a number',
                'any.required': 'Price is required'
            }),
            quantity: Joi.number().min(1).required().messages({
                'number.base': 'Quantity must be a number',
                'number.min': 'Quantity must be at least 1',
                'any.required': 'Quantity is required'
            }),
            rate: Joi.number().min(0).default(0),
            discountPercentage: Joi.number().min(0).max(100).default(0)
        })
    ).min(1).required().messages({
        'array.min': 'Invoice must have at least one item',
        'any.required': 'Items are required'
    })
});

exports.createInvoice = catchAsync(async (req, res, next) => {
    const { error, value } = invoiceSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }

    // Check if customer exists
    const customer = await Customer.findOne({
        _id: value.customerId,
        tenant: req.user.tenantId
    });

    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    // Check if sales series exists
    const salesSeries = await SalesSeries.findOne({
        _id: value.salesSeriesId,
        tenant: req.user.tenantId
    });

    if (!salesSeries) {
        return next(new ApiError(404, 'Sales series not found'));
    }

    // Validate all items exist
    const itemIds = value.items.map(item => item.itemId);
    const products = await Product.find({
        _id: { $in: itemIds },
        tenant: req.user.tenantId
    });

    if (products.length !== itemIds.length) {
        return next(new ApiError(404, 'One or more products not found'));
    }

    const invoice = await Invoice.create({
        ...value,
        tenant: req.user.tenantId
    });

    res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: { invoice }
    });
});

exports.getInvoiceBaseData = catchAsync(async (req, res) => {
    const [customers, invoiceSeries, products, taxConfigs] = await Promise.all([
        Customer.find({ tenant: req.user.tenantId }).select('-tenant -__v -createdAt -updatedAt -creditPeriodDays -openingBalance -balanceType'),
        SalesSeries.find({ tenant: req.user.tenantId }).select('-tenant -__v -invoiceSeriesTerms -createdAt -updatedAt'),
        Product.find({ tenant: req.user.tenantId }).select('-tenant -__v -unit -category -createdAt -updatedAt -barcodeNumber'),
        TaxConfig.find({ tenant: req.user.tenantId }).select('-tenant -__v -updatedAt -createdAt -_id ')
    ]);

    res.status(200).json({
        success: true,
        data: {
            customers: customers || [],
            invoiceSeries: invoiceSeries || [],
            products: products || [],
            taxConfigs: taxConfigs || []
        }
    });
});
