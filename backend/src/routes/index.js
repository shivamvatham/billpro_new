const express = require('express');
const authRoutes = require('./auth.routes');
const customerRoutes = require('./customer.routes');
const taxConfig = require('./taxConfig.routes');
const companyDetail = require('./companyDetail.routes');
const productUnitRoutes = require('./productUnit.routes');
const productCategoryRoutes = require('./productCategory.routes');
const productRoutes = require('./product.routes');
const accountRoutes = require('./account.routes');
const expenseCategoryRoutes = require('./expenseCategory.routes');
const expenseRoutes = require('./expense.routes');
const paymentRoutes = require('./payment.routes');
const receiptRoutes = require('./receipt.routes');
const salesSeriesRoutes = require('./salesSeries.routes');
const invoiceRoutes = require('./invoice.routes');

const router = express.Router();

router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working! Multi-tenant billing system ready.'
  });
});

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/taxconfig', taxConfig);
router.use('/companydetail', companyDetail);
router.use('/productunits', productUnitRoutes);
router.use('/productcategories', productCategoryRoutes);
router.use('/products', productRoutes);
router.use('/accounts', accountRoutes);
router.use('/expensecategories', expenseCategoryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/payments', paymentRoutes);
router.use('/receipts', receiptRoutes);
router.use('/salesseries', salesSeriesRoutes);
router.use('/invoices', invoiceRoutes);

module.exports = router;