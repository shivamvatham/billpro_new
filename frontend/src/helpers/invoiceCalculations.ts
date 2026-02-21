export const calculateItemTotal = (price: number, quantity: number, discountPercentage: number = 0, tax: number = 0) => {
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
    finalPrice
  };
};

export const calculateInvoiceTotal = (items: any[], shippingAmount: number = 0) => {
  const itemsTotal = items.reduce((sum, item) => {
    const calc = calculateItemTotal(item.price, item.quantity, item.discountPercentage, item.tax);
    return sum + calc.finalPrice;
  }, 0);
  
  return itemsTotal + shippingAmount;
};
