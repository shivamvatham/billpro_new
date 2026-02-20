const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    rate: {
        type: Number,
        default: 0
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    salesSeriesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SalesSeries',
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        trim: true
    },
    shippingAddress: {
        type: String,
        trim: true,
        default: ''
    },
    shippingAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    grossAmount: {
        type: Number,
        required: true,
        min: 0
    },
    invoiceDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    items: {
        type: [invoiceItemSchema],
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Invoice must have at least one item'
        }
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
