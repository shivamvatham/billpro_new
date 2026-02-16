import { z } from "zod";

export const productUnitSchema = z.object({
  unitName: z.string().min(1, "Unit name is required"),
  unitDescription: z.string().optional(),
});

export type ProductUnit = z.infer<typeof productUnitSchema> & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};
