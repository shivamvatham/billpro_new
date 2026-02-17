// src/models/index.js
// This file ensures all models are registered with Mongoose

const tenent = require("./Tenant.model");
const user = require("./User.model");
const customer = require("./Customer.model");
const taxConfig = require("./TaxConfig.model");
const companyDetails = require("./CompanyDetails.model");
const productUnit = require("./ProductUnit.model");
const productCategory = require("./ProductCategory.model");
const product = require("./Product.model");
const account = require("./Account.model");
const expenseCategory = require("./ExpenseCategory.model");

// Optional: Export them if you want to use elsewhere
module.exports = {
  Tenant: tenent,
  User: user,
  Customer: customer,
  TaxConfig: taxConfig,
  CompanyDetails: companyDetails,
  ProductUnit: productUnit,
  ProductCategory: productCategory,
  Product: product,
  Account: account,
  ExpenseCategory: expenseCategory,
};
