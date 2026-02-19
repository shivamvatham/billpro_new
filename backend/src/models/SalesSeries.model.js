const mongoose = require('mongoose');

const salesSeriesSchema = new mongoose.Schema({
    invoiceSeriesName: {
        type: String,
        required: true,
        trim: true,
    },
    invoiceSeriesTitle: {
        type: String,
        required: true,
        trim: true,
    },
    invoiceSeriesPrefix: {
        type: String,
        trim: true,
        default: '',
    },
    invoiceSeriesTerms: {
        type: String,
        trim: true,
        default: '',
    },
    invoiceSeriesStartingNumber: {
        type: Number,
        required: true,
        min: [1, 'Starting number must be at least 1']
    },
    invoiceTemplateNumber: {
        type: Number,
        required: true,
        default: 1,
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SalesSeries', salesSeriesSchema);
