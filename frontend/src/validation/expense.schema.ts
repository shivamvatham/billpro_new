import { z } from "zod";

export const expenseSchema = z.object({
  expenseName: z.string().min(1, "Expense name is required"),
  accountType: z.string().min(1, "Account type is required"),
  expenseCategory: z.string().min(1, "Expense category is required"),
  description: z.string(),
  expenseAmount: z.union([
    z.number().min(1, "Expense amount must be greater than 0"),
    z.undefined(),
    z.nan()
  ]).refine((val) => val !== undefined && !isNaN(val), {
    message: "Expense amount is required"
  }),
  expenseDate: z.string().min(1, "Expense date is required"),
});

export type Expense = z.infer<typeof expenseSchema> & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};
