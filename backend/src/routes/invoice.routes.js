const express = require('express');
const { getInvoiceBaseData, createInvoice, getInvoice, getAllInvoices, updateInvoice, deleteInvoice } = require('../controllers/invoice.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/getBaseData', getInvoiceBaseData);
router.post('/', createInvoice);
router.get('/', getAllInvoices);
router.get('/:id', getInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

module.exports = router;
