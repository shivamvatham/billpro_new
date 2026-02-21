const { Customer, SalesSeries, Product, TaxConfig, Invoice, CompanyDetails } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Joi = require('joi');
const { validateTaxableInvoice, calculateInvoiceTotal } = require('../helpers/invoiceHelper');

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

    const customer = await Customer.findOne({
        _id: value.customerId,
        tenant: req.user.tenantId
    });

    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    const salesSeries = await SalesSeries.findOne({
        _id: value.salesSeriesId,
        tenant: req.user.tenantId
    });

    if (!salesSeries) {
        return next(new ApiError(404, 'Sales series not found'));
    }

    const [taxConfig, companyDetails] = await Promise.all([
        TaxConfig.findOne({ tenant: req.user.tenantId }),
        CompanyDetails.findOne({ tenant: req.user.tenantId })
    ]);

    validateTaxableInvoice(salesSeries, taxConfig);

    const itemIds = value.items.map(item => item.itemId);
    const products = await Product.find({
        _id: { $in: itemIds },
        tenant: req.user.tenantId
    });

    if (products.length !== itemIds.length) {
        return next(new ApiError(404, 'One or more products not found'));
    }

    const calculatedTotal = calculateInvoiceTotal(value.items, products, salesSeries, taxConfig, customer, companyDetails);
    const expectedGrossAmount = calculatedTotal + (value.shippingAmount || 0);

    if (Math.abs(expectedGrossAmount - value.grossAmount) > 0.01) {
        return next(new ApiError(400, `Gross amount mismatch. Expected: ${expectedGrossAmount.toFixed(2)}, Received: ${value.grossAmount}`));
    }

    const invoice = await Invoice.create({
        ...value,
        tenant: req.user.tenantId
    });

    // Add invoice amount to customer balance
    await Customer.findByIdAndUpdate(
        value.customerId,
        { $inc: { openingBalance: value.grossAmount } }
    );

    await SalesSeries.findByIdAndUpdate(
        value.salesSeriesId,
        { $inc: { invoiceSeriesStartingNumber: 1 } }
    );

    res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: { invoice }
    });
});

exports.getInvoiceBaseData = catchAsync(async (req, res) => {
    const [customers, invoiceSeries, productsRaw, taxConfigs] = await Promise.all([
        Customer.find({ tenant: req.user.tenantId }).select('-tenant -__v -createdAt -updatedAt -creditPeriodDays -openingBalance -balanceType'),
        SalesSeries.find({ tenant: req.user.tenantId }).select('-tenant -__v -invoiceSeriesTerms -createdAt -updatedAt'),
        Product.find({ tenant: req.user.tenantId }).select('-tenant -__v -unit -category -createdAt -updatedAt -barcodeNumber -reorder').lean(),
        TaxConfig.find({ tenant: req.user.tenantId }).select('-tenant -__v -updatedAt -createdAt -_id ')
    ]);

    const products = productsRaw.map(product => {
    const { productTax, ...rest } = product;
    
    return {
      ...rest,
      tax1Rate: productTax?.tax1Rate ?? null,
      tax2Rate: productTax?.tax2Rate ?? null,
      tax3Rate: productTax?.tax2Rate ?? null,
    };
  });

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

exports.getInvoice = catchAsync(async (req, res, next) => {
    const invoice = await Invoice.findOne({
        _id: req.params.id,
        tenant: req.user.tenantId
    }).select('-tenant -__v');

    if (!invoice) {
        return next(new ApiError(404, 'Invoice not found'));
    }

    res.status(200).json({
        success: true,
        data: { invoice }
    });
});

exports.getAllInvoices = catchAsync(async (req, res) => {
    const invoices = await Invoice.find({ tenant: req.user.tenantId })
        .sort({ createdAt: -1 })
        .select('-tenant -__v');

    const total = await Invoice.countDocuments({ tenant: req.user.tenantId });

    res.status(200).json({
        success: true,
        data: {
            invoices,
            totalInvoices: total
        }
    });
});

exports.updateInvoice = catchAsync(async (req, res, next) => {
    const { error, value } = invoiceSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }

    const invoice = await Invoice.findOne({
        _id: req.params.id,
        tenant: req.user.tenantId
    });

    if (!invoice) {
        return next(new ApiError(404, 'Invoice not found'));
    }

    const customer = await Customer.findOne({
        _id: value.customerId,
        tenant: req.user.tenantId
    });

    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    const salesSeries = await SalesSeries.findOne({
        _id: value.salesSeriesId,
        tenant: req.user.tenantId
    });

    if (!salesSeries) {
        return next(new ApiError(404, 'Sales series not found'));
    }

    const [taxConfig, companyDetails] = await Promise.all([
        TaxConfig.findOne({ tenant: req.user.tenantId }),
        CompanyDetails.findOne({ tenant: req.user.tenantId })
    ]);

    validateTaxableInvoice(salesSeries, taxConfig);

    const itemIds = value.items.map(item => item.itemId);
    const products = await Product.find({
        _id: { $in: itemIds },
        tenant: req.user.tenantId
    });

    if (products.length !== itemIds.length) {
        return next(new ApiError(404, 'One or more products not found'));
    }

    const calculatedTotal = calculateInvoiceTotal(value.items, products, salesSeries, taxConfig, customer, companyDetails);
    const expectedGrossAmount = calculatedTotal + (value.shippingAmount || 0);

    if (Math.abs(expectedGrossAmount - value.grossAmount) > 0.01) {
        return next(new ApiError(400, `Gross amount mismatch. Expected: ${expectedGrossAmount.toFixed(2)}, Received: ${value.grossAmount}`));
    }

    const updatedInvoice = await Invoice.findOneAndUpdate(
        { _id: req.params.id, tenant: req.user.tenantId },
        value,
        { new: true, runValidators: true }
    );

    // Adjust customer balance: deduct old amount and add new amount
    const balanceAdjustment = value.grossAmount - invoice.grossAmount;
    await Customer.findByIdAndUpdate(
        value.customerId,
        { $inc: { openingBalance: balanceAdjustment } }
    );

    res.status(200).json({
        success: true,
        message: 'Invoice updated successfully',
        data: { invoice: updatedInvoice }
    });
});

exports.deleteInvoice = catchAsync(async (req, res, next) => {
    const invoice = await Invoice.findOneAndDelete({
        _id: req.params.id,
        tenant: req.user.tenantId
    });

    if (!invoice) {
        return next(new ApiError(404, 'Invoice not found'));
    }

    // Deduct invoice amount from customer balance
    await Customer.findByIdAndUpdate(
        invoice.customerId,
        { $inc: { openingBalance: -invoice.grossAmount } }
    );

    res.status(200).json({
        success: true,
        message: 'Invoice deleted successfully'
    });
});