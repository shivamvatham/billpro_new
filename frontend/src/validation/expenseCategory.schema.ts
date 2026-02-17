import { z } from "zod";

export const expenseCategorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  categoryDescription: z.string(),
});

export type ExpenseCategory = z.infer<typeof expenseCategorySchema> & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};
