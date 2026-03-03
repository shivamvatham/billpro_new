const Joi = require('joi');
const Receipt = require('../models/Receipt.model');
const Customer = require('../models/Customer.model');
const Account = require('../models/Account.model');
const Invoice = require('../models/Invoice.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

const receiptSchema = Joi.object({
    customer: Joi.string().required().messages({
        'string.empty': 'Customer is required',
        'any.required': 'Customer is required'
    }),
    invoiceId: Joi.string().allow(null, ''),
    account: Joi.string().required().messages({
        'string.empty': 'Receipt account is required',
        'any.required': 'Receipt account is required'
    }),
    receiptAmount: Joi.number().greater(0).required().messages({
        'number.base': 'Receipt amount must be a number',
        'number.greater': 'Receipt amount must be greater than 0',
        'any.required': 'Receipt amount is required'
    }),
    receiptDate: Joi.date().required().messages({
        'date.base': 'Invalid receipt date',
        'any.required': 'Receipt date is required'
    }),
    receiptDescription: Joi.string().allow(null, '').max(500)
});

exports.createReceipt = catchAsync(async (req, res, next) => {
    const { error, value } = receiptSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const customer = await Customer.findOne({
            _id: value.customer,
            tenant: req.user.tenantId
        }).session(session);

        if (!customer) {
            await session.abortTransaction();
            return next(new ApiError(404, 'Customer not found'));
        }

        const account = await Account.findOne({
            _id: value.account,
            tenant: req.user.tenantId
        }).session(session);

        if (!account) {
            await session.abortTransaction();
            return next(new ApiError(404, 'Account not found'));
        }

        if (value.invoiceId) {
            const invoice = await Invoice.findOne({
                _id: value.invoiceId,
                tenant: req.user.tenantId
            }).session(session);

            if (!invoice) {
                await session.abortTransaction();
                return next(new ApiError(404, 'Invoice not found'));
            }

            invoice.paidAmount = (invoice.paidAmount || 0) + value.receiptAmount;
            await invoice.save({ session });
        }

        customer.openingBalance -= value.receiptAmount;
        await customer.save({ session });

        account.currentBalance += value.receiptAmount;
        await account.save({ session });

        const receipt = await Receipt.create([{
            ...value,
            tenant: req.user.tenantId
        }], { session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'Receipt created successfully',
            data: { receipt: receipt[0] }
        });
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
});

exports.getAllReceipts = catchAsync(async (req, res, next) => {
    const receipts = await Receipt.find({ tenant: req.user.tenantId })
        .populate('customer', 'name')
        .populate('account', 'accountName')
        .populate('invoiceId', 'invoiceNumber invoicePrefix')
        .sort({ receiptDate: -1 })
        .select('-__v -tenant');

    const total = await Receipt.countDocuments({ tenant: req.user.tenantId });

    res.status(200).json({
        success: true,
        data: {
            receipts,
            totalReceipts: total
        }
    });
});

exports.getReceipt = catchAsync(async (req, res, next) => {
    const receipt = await Receipt.findOne({
        _id: req.params.id,
        tenant: req.user.tenantId
    })
        .populate('customer', 'name')
        .populate('account', 'accountName')
        .populate('invoiceId', 'invoiceNumber invoicePrefix')
        .select('-__v -tenant');

    res.status(200).json({
        success: true,
        data: { receipt: receipt || [] }
    });
});

exports.deleteReceipt = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const receipt = await Receipt.findOne({
            _id: req.params.id,
            tenant: req.user.tenantId
        }).session(session);

        if (!receipt) {
            await session.abortTransaction();
            return next(new ApiError(404, 'Receipt not found'));
        }

        const customer = await Customer.findById(receipt.customer).session(session);
        const account = await Account.findById(receipt.account).session(session);

        if (receipt.invoiceId) {
            const invoice = await Invoice.findById(receipt.invoiceId).session(session);
            if (invoice) {
                invoice.paidAmount = Math.max(0, (invoice.paidAmount || 0) - receipt.receiptAmount);
                await invoice.save({ session });
            }
        }

        if (customer) {
            customer.openingBalance += receipt.receiptAmount;
            await customer.save({ session });
        }

        account.currentBalance -= receipt.receiptAmount;
        await account.save({ session });

        await receipt.deleteOne({ session });

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Receipt deleted successfully'
        });
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
});

exports.updateReceipt = catchAsync(async (req, res, next) => {
    const { error, value } = receiptSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const oldReceipt = await Receipt.findOne({
            _id: req.params.id,
            tenant: req.user.tenantId
        }).session(session);

        if (!oldReceipt) {
            await session.abortTransaction();
            return next(new ApiError(404, 'Receipt not found'));
        }

        const customer = await Customer.findOne({
            _id: value.customer,
            tenant: req.user.tenantId
        }).session(session);

        if (!customer) {
            await session.abortTransaction();
            return next(new ApiError(404, 'Customer not found'));
        }

        const account = await Account.findOne({
            _id: value.account,
            tenant: req.user.tenantId
        }).session(session);

        if (!account) {
            await session.abortTransaction();
            return next(new ApiError(404, 'Account not found'));
        }

        const oldCustomer = await Customer.findById(oldReceipt.customer).session(session);
        const oldAccount = await Account.findById(oldReceipt.account).session(session);

        if (oldReceipt.invoiceId) {
            const oldInvoice = await Invoice.findById(oldReceipt.invoiceId).session(session);
            if (oldInvoice) {
                oldInvoice.paidAmount = Math.max(0, (oldInvoice.paidAmount || 0) - oldReceipt.receiptAmount);
                await oldInvoice.save({ session });
            }
        }

        if (value.invoiceId) {
            const newInvoice = await Invoice.findOne({
                _id: value.invoiceId,
                tenant: req.user.tenantId
            }).session(session);

            if (!newInvoice) {
                await session.abortTransaction();
                return next(new ApiError(404, 'Invoice not found'));
            }

            newInvoice.paidAmount = (newInvoice.paidAmount || 0) + value.receiptAmount;
            await newInvoice.save({ session });
        }

        if (oldCustomer) {
            oldCustomer.openingBalance += oldReceipt.receiptAmount;
            await oldCustomer.save({ session });
        }

        oldAccount.currentBalance -= oldReceipt.receiptAmount;
        await oldAccount.save({ session });

        customer.openingBalance -= value.receiptAmount;
        await customer.save({ session });

        account.currentBalance += value.receiptAmount;
        await account.save({ session });

        oldReceipt.customer = value.customer;
        oldReceipt.invoiceId = value.invoiceId || null;
        oldReceipt.account = value.account;
        oldReceipt.receiptAmount = value.receiptAmount;
        oldReceipt.receiptDate = value.receiptDate;
        oldReceipt.receiptDescription = value.receiptDescription;
        await oldReceipt.save({ session });

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Receipt updated successfully',
            data: { receipt: oldReceipt }
        });
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
});
