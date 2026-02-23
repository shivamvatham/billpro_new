const ApiError = require('../utils/ApiError');

const calculateTaxRate = (product, taxConfig, customer, companyDetails, isTaxable) => {
    if (!isTaxable) {
        console.log('Tax Rate: 0% (Not taxable)');
        return 0;
    }

    if (taxConfig?.taxType === 'GST') {
        console.log('Customer GST:', customer.gstNumber);
        console.log('Company GST:', companyDetails?.gstNumber);
        const isSameState = customer.gstNumber && companyDetails?.gstNumber && 
                            customer.gstNumber.substring(0, 2) === companyDetails.gstNumber.substring(0, 2);
        console.log('isSameState:', isSameState);
        
        if (isSameState || !customer.gstNumber) {
            console.log('TaxConfig:', taxConfig);
            console.log('Product Tax Rates:', product?.productTax);
            const taxRate = (product?.productTax?.tax2Rate || taxConfig.tax2?.taxRate || 0) + 
                   (product?.productTax?.tax3Rate || taxConfig.tax3?.taxRate || 0);
            console.log(`Tax Rate: ${taxRate}% (Intra-state GST)`);
            return taxRate;
        } else {
            const taxRate = product?.productTax?.tax1Rate || taxConfig.tax1?.taxRate || 0;
            console.log(`Tax Rate: ${taxRate}% (Inter-state GST)`);
            return taxRate;
        }
    }
    // } else if (taxConfig?.taxType === 'Service') {
    //     return (product?.productTax?.tax1Rate || taxConfig.tax1?.taxRate || 0) + 
    //            (product?.productTax?.tax2Rate || taxConfig.tax2?.taxRate || 0) + 
    //            (product?.productTax?.tax3Rate || taxConfig.tax3?.taxRate || 0);
    // }
    
    console.log('Tax Rate: 0% (No tax config)');
    return 0;
};

const validateTaxableInvoice = (salesSeries, taxConfig) => {
    if (salesSeries.invoiceTaxable && (!taxConfig || taxConfig.taxType === 'None')) {
        throw new ApiError(400, 'Tax configuration is required for taxable invoices');
    }
};

const calculateInvoiceTotal = (items, products, salesSeries, taxConfig, customer, companyDetails) => {
    const productMap = new Map(products.map(p => [p._id.toString(), p]));
    return items.reduce((total, item) => {
        const product = productMap.get(item.itemId);
        const itemTotal = item.price * item.quantity;
        const discount = (itemTotal * (item.discountPercentage || 0)) / 100;
        let itemAmount = itemTotal - discount;
        
        const taxRate = calculateTaxRate(product, taxConfig, customer, companyDetails, salesSeries.invoiceTaxable);
        itemAmount += (itemAmount * taxRate) / 100;
        
        return total + itemAmount;
    }, 0);
};

module.exports = {
    calculateTaxRate,
    validateTaxableInvoice,
    calculateInvoiceTotal
};
