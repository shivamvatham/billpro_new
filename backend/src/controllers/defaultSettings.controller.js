const DefaultSettings = require("../models/DefaultSettings.model");
const SalesSeries = require("../models/SalesSeries.model");
const Account = require("../models/Account.model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.getDefaults = catchAsync(async (req, res, next) => {
  const tenantId = req.user.tenantId;
  
  let defaults = await DefaultSettings.findOne({ tenant: tenantId })
    .select("defaultInvoiceSeries defaultAccount");

  if (!defaults) {
    defaults = await DefaultSettings.create({ tenant: tenantId });
  }

  res.status(200).json({
    success: true,
    data: {
      defaultInvoiceSeries: defaults.defaultInvoiceSeries,
      defaultAccount: defaults.defaultAccount,
    },
  });
});

exports.updateDefaults = catchAsync(async (req, res, next) => {
  const tenantId = req.user.tenantId;
  const { defaultInvoiceSeries, defaultAccount } = req.body;

  // Reset all defaults for this tenant
  await Promise.all([
    SalesSeries.updateMany({ tenant: tenantId }, { default: false }),
    Account.updateMany({ tenant: tenantId }, { default: false }),
  ]);

  // Set new defaults in SalesSeries and Account
  if (defaultInvoiceSeries) {
    await SalesSeries.findByIdAndUpdate(defaultInvoiceSeries, { default: true });
  }
  if (defaultAccount) {
    await Account.findByIdAndUpdate(defaultAccount, { default: true });
  }

  // Save in DefaultSettings model
  let defaults = await DefaultSettings.findOne({ tenant: tenantId });
  
  if (!defaults) {
    defaults = await DefaultSettings.create({
      tenant: tenantId,
      defaultInvoiceSeries,
      defaultAccount,
    });
  } else {
    defaults.defaultInvoiceSeries = defaultInvoiceSeries;
    defaults.defaultAccount = defaultAccount;
    await defaults.save();
  }

  res.status(200).json({
    success: true,
    message: "Default settings updated successfully",
    data: {
      defaultInvoiceSeries: defaults.defaultInvoiceSeries,
      defaultAccount: defaults.defaultAccount,
    },
  });
});
