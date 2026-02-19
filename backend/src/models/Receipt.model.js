const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
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
    receiptAmount: {
        type: Number,
        required: true,
        min: [0.01, 'Receipt amount must be greater than 0']
    },
    receiptDate: {
        type: Date,
        required: true,
    },
    receiptDescription: {
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

module.exports = mongoose.model('Receipt', receiptSchema);
