import { z } from "zod";

export const invoiceItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  description: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be at least 0"),
  discountPercentage: z.number().min(0).max(100).optional(),
  tax: z.number().min(0).optional(),
  finalPrice: z.number().min(0).optional()
});

export const invoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  salesSeriesId: z.string().min(1, "Sales series is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  shippingAddress: z.string().optional(),
  shippingAmount: z.number().min(0).optional(),
  grossAmount: z.number().min(0, "Gross amount is required"),
  invoiceDate: z.date(),
  dueDate: z.date(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required")
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
