const mongoose = require('mongoose')

const cutomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    contactNumber: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || v.length >= 3;
            },
            message: 'Contact number cannot be less than 3 digits'
        },
        default: null,
    },
    email: {
        type: String,
        lowercase: true,
        default: null,
    },
    address: {
        type: String,
        default: null,
    },
    state: {
        type: String,
        default: '24-Gujarat'
    },
    gstNumber: {
        type: String,
        default: null,
    },
    creditPeriodDays: {
        type: Number,
        default: 0,
    },
    openingBalance: {
        type: Number,
        default: 0,
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', cutomerSchema);