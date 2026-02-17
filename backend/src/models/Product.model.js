const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    hsnCode: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductUnit",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    productTax: {
      tax1Rate: {
        type: Number,
      },
      tax2Rate: {
        type: Number,
      },
      tax3Rate: {
        type: Number,
      },
    },
    quantity: {
      type: Number,
    },
    reorder: {
      type: Number,
    },
    barcodeNumber: {
      type: String,
      trim: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
