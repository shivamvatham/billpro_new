import { z } from "zod";

export const receiptSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  account: z.string().min(1, "Receipt account is required"),
  receiptAmount: z.number().positive("Receipt amount must be greater than 0"),
  receiptDate: z.string().min(1, "Receipt date is required"),
  receiptDescription: z.string().max(500).optional(),
  invoiceId: z.string().optional(),
});

export type Receipt = z.infer<typeof receiptSchema>;
