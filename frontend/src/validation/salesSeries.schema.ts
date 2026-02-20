import { z } from "zod";

export const salesSeriesSchema = z.object({
  invoiceSeriesName: z.string().min(1, "Invoice series name is required"),
  invoiceSeriesTitle: z.string().min(1, "Invoice series title is required"),
  invoiceSeriesPrefix: z.string().optional(),
  invoiceSeriesTerms: z.string().optional(),
  invoiceSeriesStartingNumber: z.number().int().min(1, "Starting number must be at least 1"),
  invoiceTemplateNumber: z.number().int().min(1, "Template number is required"),
  invoiceTaxable: z.boolean().default(true),
});

export type SalesSeries = z.infer<typeof salesSeriesSchema>;
