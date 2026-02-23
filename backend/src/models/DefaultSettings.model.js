const mongoose = require("mongoose");

const defaultSettingsSchema = new mongoose.Schema(
  {
    defaultInvoiceSeries: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesSeries",
    },
    defaultAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DefaultSettings", defaultSettingsSchema);
