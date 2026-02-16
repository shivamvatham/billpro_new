import { z } from "zod";

export const productCategorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  categoryDescription: z.string().optional(),
});

export type ProductCategory = z.infer<typeof productCategorySchema> & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};
