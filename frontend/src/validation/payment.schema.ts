import { z } from "zod";

export const paymentSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  account: z.string().min(1, "Payment account is required"),
  paymentAmount: z.number().positive("Payment amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentDescription: z.string().max(500).optional(),
});

export type Payment = z.infer<typeof paymentSchema>;
