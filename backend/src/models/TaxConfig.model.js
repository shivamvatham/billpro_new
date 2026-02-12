const mongoose = require("mongoose");

const taxConfigSchema = new mongoose.Schema(
  {
    taxType: {
      type: String,
      required: true,
      enum: ["None", "GST", "Service"],
    },
    tax1: {
      taxName: {
        type: String,
        required: function () {
          return this.taxType === "GST" || this.taxType === "Service";
        },
      },
      taxRate: {
        type: Number,
        required: function () {
          return this.taxType === "GST" || this.taxType === "Service";
        },
      },
    },
    tax2: {
      taxName: {
        type: String,
        required: function () {
          return this.taxType === "GST";
        },
      },
      taxRate: {
        type: Number,
        required: function () {
          return this.taxType === "GST";
        },
      },
    },
    tax3: {
      taxName: {
        type: String,
        required: function () {
          return this.taxType === "GST";
        },
      },
      taxRate: {
        type: Number,
        required: function () {
          return this.taxType === "GST";
        },
      },
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaxConfig", taxConfigSchema);
