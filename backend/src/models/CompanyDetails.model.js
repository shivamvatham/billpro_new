const mongoose = require("mongoose");

const companyDetailSchema = new mongoose.Schema(
  {
    companyName: {
      required: true,
      type: String,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    gstNumber: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompanyDetail", companyDetailSchema);
