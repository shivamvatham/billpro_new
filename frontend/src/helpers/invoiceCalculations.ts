interface InvoiceItem {
  price: number;
  quantity: number;
  discountPercentage: number;
  tax: number;
  itemId: string;
  [key: string]: string | number | undefined;
}

interface Product {
  _id: string;
  tax1Rate?: number;
  tax2Rate?: number;
  tax3Rate?: number;
}

interface TaxConfig {
  taxType: string;
  taxNumber?: string;
  tax1?: { taxRate?: number; taxName?: string };
  tax2?: { taxRate?: number; taxName?: string };
  tax3?: { taxRate?: number; taxName?: string };
}

interface TaxDetail {
  amount: number;
  percentage: number;
}

export const calculateItemTotal = (
  price: number,
  quantity: number,
  discountPercentage: number = 0,
  tax: number = 0
) => {
  const subtotal = price * quantity;
  const discountAmount = (subtotal * discountPercentage) / 100;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * tax) / 100;
  const finalPrice = afterDiscount + taxAmount;

  return {
    subtotal,
    discountAmount,
    afterDiscount,
    taxAmount,
    finalPrice,
  };
};

export const calculateInvoiceTotal = (
  items: InvoiceItem[],
  shippingAmount: number = 0
) => {
  const itemsTotal = items.reduce((sum, item) => {
    const calc = calculateItemTotal(
      item.price || 0,
      item.quantity || 0,
      item.discountPercentage || 0,
      item.tax || 0
    );
    return sum + calc.finalPrice;
  }, 0);

  return itemsTotal + shippingAmount;
};

export const isSameState = (customerGst?: string, companyGst?: string) => {
  return (
    customerGst &&
    companyGst &&
    customerGst.substring(0, 2) === companyGst.substring(0, 2)
  );
};

export const calculateGSTRate = (
  product: Product,
  taxConfig: TaxConfig,
  customerGst?: string
) => {
  if (!taxConfig || taxConfig.taxType !== "GST") return 0;
  if (isSameState(customerGst, taxConfig.taxNumber) || !customerGst) {
    return (
      (product?.tax2Rate ?? taxConfig.tax2?.taxRate ?? 0) +
      (product?.tax3Rate ?? taxConfig.tax3?.taxRate ?? 0)
    );
  } else {
    return product?.tax1Rate ?? taxConfig.tax1?.taxRate ?? 0;
  }
};

export const calculateTaxBreakdown = (
  items: InvoiceItem[],
  products: Product[],
  taxConfig: TaxConfig,
  customerGst?: string
) => {
  if (!taxConfig) return [];

  const sameState =
    isSameState(customerGst, taxConfig.taxNumber) || !customerGst;
  const taxes: Record<string, number> = {};

  items.forEach((item) => {
    const product = products.find((p) => p._id === item.itemId);
    if (!product) return;

    const subtotal = (item.price || 0) * (item.quantity || 0);
    const afterDiscount =
      subtotal - (subtotal * (item.discountPercentage || 0)) / 100;

    if (sameState) {
      if (taxConfig.tax2?.taxName) {
        const rate =
          product?.tax2Rate ?? taxConfig.tax2?.taxRate ?? 0;
        taxes[taxConfig.tax2.taxName] =
          (taxes[taxConfig.tax2.taxName] || 0) + (afterDiscount * rate) / 100;
      }
      if (taxConfig.tax3?.taxName) {
        const rate =
          product?.tax3Rate ?? taxConfig.tax3?.taxRate ?? 0;
        taxes[taxConfig.tax3.taxName] =
          (taxes[taxConfig.tax3.taxName] || 0) + (afterDiscount * rate) / 100;
      }
    } else {
      if (taxConfig.tax1?.taxName) {
        const rate =
          product?.tax1Rate ?? taxConfig.tax1?.taxRate ?? 0;
        taxes[taxConfig.tax1.taxName] =
          (taxes[taxConfig.tax1.taxName] || 0) + (afterDiscount * rate) / 100;
      }
    }
  });

  return Object.entries(taxes).map(([name, amount]) => ({
    name,
    amount: amount as number,
  }));
};

export const calculateItemTaxDetails = (
  item: InvoiceItem,
  product: Product | undefined,
  taxConfig: TaxConfig | undefined,
  customerGst?: string,
  isTaxable: boolean = true
) => {
  const subtotal = (item.price || 0) * (item.quantity || 0);
  const discountAmount = (subtotal * (item.discountPercentage || 0)) / 100;
  const afterDiscount = subtotal - discountAmount;

  let tax1: TaxDetail = { amount: 0, percentage: 0 };
  let tax2: TaxDetail = { amount: 0, percentage: 0 };
  let tax3: TaxDetail = { amount: 0, percentage: 0 };

  if (isTaxable && product && taxConfig) {
    const sameState =
      isSameState(customerGst, taxConfig.taxNumber) || !customerGst;

    if (sameState) {
      const tax2Rate =
        product?.tax2Rate ?? taxConfig.tax2?.taxRate ?? 0;
      const tax3Rate =
        product?.tax3Rate ?? taxConfig.tax3?.taxRate ?? 0;
      tax2 = { amount: (afterDiscount * tax2Rate) / 100, percentage: tax2Rate };
      tax3 = { amount: (afterDiscount * tax3Rate) / 100, percentage: tax3Rate };
    } else {
      const tax1Rate =
        product?.tax1Rate ?? taxConfig.tax1?.taxRate ?? 0;
      tax1 = { amount: (afterDiscount * tax1Rate) / 100, percentage: tax1Rate };
    }
  }

  const finalPrice = afterDiscount + tax1.amount + tax2.amount + tax3.amount;

  return {
    discountAmount,
    tax1,
    tax2,
    tax3,
    finalPrice,
  };
};
