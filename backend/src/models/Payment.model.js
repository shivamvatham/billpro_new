const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    paymentAmount: {
        type: Number,
        required: true,
        min: [0.01, 'Payment amount must be greater than 0']
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    paymentDescription: {
        type: String,
        trim: true,
        default: null,
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
