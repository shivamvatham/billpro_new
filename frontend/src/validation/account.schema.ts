import { z } from "zod";

export const accountSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountDescription: z.string(),
  openingBalance: z.number().nullable(),
});

export type Account = z.infer<typeof accountSchema> & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};
