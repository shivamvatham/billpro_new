import { z } from "zod";

export const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  hsnCode: z.string().optional().or(z.literal("")),
  price: z.number().min(0),
  unit: z.string().min(1, "Unit is required"),
  category: z.string().min(1, "Category is required"),
  productTax: z.object({
    tax1Rate: z.number().optional(),
    tax2Rate: z.number().optional(),
    tax3Rate: z.number().optional(),
  }).optional(),
  quantity: z.number().optional(),
  reorder: z.number().optional(),
  barcodeNumber: z.string().optional().or(z.literal("")),
});

export type Product = z.infer<typeof productSchema> & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};
