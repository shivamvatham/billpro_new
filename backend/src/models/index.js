// src/models/index.js
// This file ensures all models are registered with Mongoose

const tenent = require("./Tenant.model");
const user = require("./User.model");
const customer = require("./Customer.model");
const taxConfig = require("./TaxConfig.model");

// Optional: Export them if you want to use elsewhere
module.exports = {
  Tenant: tenent,
  User: user,
  Customer: customer,
  TaxConfig: taxConfig,
};
