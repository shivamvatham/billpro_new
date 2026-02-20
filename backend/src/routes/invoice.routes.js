const express = require('express');
const { getInvoiceBaseData, createInvoice } = require('../controllers/invoice.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/getBaseData', getInvoiceBaseData);
router.post('/', createInvoice);

module.exports = router;
