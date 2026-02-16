const mongoose = require("mongoose");

const productUnitSchema = new mongoose.Schema(
  {
    unitName: {
      type: String,
      required: true,
      trim: true,
    },
    unitDescription: {
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

module.exports = mongoose.model("ProductUnit", productUnitSchema);