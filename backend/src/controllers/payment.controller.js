const Joi = require('joi');
const Payment = require('../models/Payment.model');
const Customer = require('../models/Customer.model');
const Account = require('../models/Account.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

const paymentSchema = Joi.object({
    customer: Joi.string().required().messages({
        'string.empty': 'Customer is required',
        'any.required': 'Customer is required'
    }),
    account: Joi.string().required().messages({
        'string.empty': 'Payment account is required',
        'any.required': 'Payment account is required'
    }),
    paymentAmount: Joi.number().greater(0).required().messages({
        'number.base': 'Payment amount must be a number',
        'number.greater': 'Payment amount must be greater than 0',
        'any.required': 'Payment amount is required'
    }),
    paymentDate: Joi.date().required().messages({
        'date.base': 'Invalid payment date',
        'any.required': 'Payment date is required'
    }),
    paymentDescription: Joi.string().allow(null, '').max(500)
});

exports.createPayment = catchAsync(async (req, res, next) => {
    const { error, value } = paymentSchema.validate(req.body, { abortEarly: false });

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

        customer.openingBalance += value.paymentAmount;
        await customer.save({ session });

        account.currentBalance -= value.paymentAmount;
        await account.save({ session });

        const payment = await Payment.create([{
            ...value,
            tenant: req.user.tenantId
        }], { session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            data: { payment: payment[0] }
        });
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
});

exports.getAllPayments = catchAsync(async (req, res, next) => {
    const payments = await Payment.find({ tenant: req.user.tenantId })
        .populate('customer', 'name')
        .populate('account', 'accountName')
        .sort({ paymentDate: -1 })
        .select('-__v -tenant');

    const total = await Payment.countDocuments({ tenant: req.user.tenantId });

    res.status(200).json({
        success: true,
        data: {
            payments,
            totalPayments: total
        }
    });
});

exports.getPayment = catchAsync(async (req, res, next) => {
    const payment = await Payment.findOne({
        _id: req.params.id,
        tenant: req.user.tenantId
    })
        .populate('customer', 'name')
        .populate('account', 'accountName')
        .select('-__v -tenant');

    res.status(200).json({
        success: true,
        data: { payment: payment || [] }
    });
});

exports.deletePayment = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const payment = await Payment.findOne({
            _id: req.params.id,
            tenant: req.user.tenantId
        }).session(session);

        if (!payment) {
            await session.abortTransaction();
            return next(new ApiError(404, 'Payment not found'));
        }

        const customer = await Customer.findById(payment.customer).session(session);
        const account = await Account.findById(payment.account).session(session);

        customer.openingBalance -= payment.paymentAmount;
        await customer.save({ session });

        account.currentBalance += payment.paymentAmount;
        await account.save({ session });

        await payment.deleteOne({ session });

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Payment deleted successfully'
        });
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
});

exports.updatePayment = catchAsync(async (req, res, next) => {
    const { error, value } = paymentSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return next(new ApiError(400, error.details[0].message));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const oldPayment = await Payment.findOne({
            _id: req.params.id,
            tenant: req.user.tenantId
        }).session(session);

        if (!oldPayment) {
            await session.abortTransaction();
            return next(new ApiError(404, 'Payment not found'));
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

        const oldCustomer = await Customer.findById(oldPayment.customer).session(session);
        const oldAccount = await Account.findById(oldPayment.account).session(session);

        oldCustomer.openingBalance -= oldPayment.paymentAmount;
        await oldCustomer.save({ session });

        oldAccount.currentBalance += oldPayment.paymentAmount;
        await oldAccount.save({ session });

        customer.openingBalance += value.paymentAmount;
        await customer.save({ session });

        account.currentBalance -= value.paymentAmount;
        await account.save({ session });

        oldPayment.customer = value.customer;
        oldPayment.account = value.account;
        oldPayment.paymentAmount = value.paymentAmount;
        oldPayment.paymentDate = value.paymentDate;
        oldPayment.paymentDescription = value.paymentDescription;
        await oldPayment.save({ session });

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Payment updated successfully',
            data: { payment: oldPayment }
        });
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
});
