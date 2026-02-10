import { z } from "zod";

export const customerSchema = z.object({
    _id: z.number().optional(),
    name: z
        .string()
        .trim()
        .min(1, { message: "Customer name is required" }),

    contactNumber: z
        .string()
        .trim()
        .default("")
        .refine(
            (val) => val === "" || /^[0-9]+$/.test(val),
            { message: "Contact number is not valid" }
        )
        .refine(
            (val) => val === "" || val.length >= 3,
            { message: "Contact number cannot be less than 3 digits" }
        )
        .refine(
            (val) => val === "" || val.length <= 20,
            { message: "Contact number cannot exceed 20 digits" }
        ),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .optional()
        .default("")
        .refine(
            (val) => val === "" || z.string().email().safeParse(val).success,
            { message: "Please provide a valid email address" }
        ),

    address: z
        .string()
        .trim()
        .max(500, { message: "Address cannot exceed 500 characters" })
        .optional()
        .default(""),

    state: z.string().default("24-Gujarat"),

    gstNumber: z
        .string()
        .trim()
        .optional()
        .default("")
        .refine((val) => val === "" || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val),
            { message: "Invalid GST number format" }
        ),

    creditPeriodDays: z
        .number()
        .int({ message: "Credit period must be a whole number" })
        .min(0, { message: "Credit period cannot be negative" })
        .nullable(),

    openingBalance: z.number().nullable(),
});

export type Customer = z.infer<typeof customerSchema>;
