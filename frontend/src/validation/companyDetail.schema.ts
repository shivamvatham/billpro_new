import { z } from "zod";

export const companyDetailSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z
    .string()
    .min(3, "Contact number must be at least 3 digits")
    .max(20, "Contact number cannot exceed 20 digits")
    .regex(/^[0-9]+$/, "Contact number must contain only digits"),
  email: z.string().email("Please provide a valid email address"),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number format"
    )
    .optional()
    .or(z.literal("")),
});

export type CompanyDetail = z.infer<typeof companyDetailSchema>;
