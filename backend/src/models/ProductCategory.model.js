const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    categoryDescription: {
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

module.exports = mongoose.model("ProductCategory", productCategorySchema);
