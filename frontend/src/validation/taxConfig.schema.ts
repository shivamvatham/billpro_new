import { z } from "zod";

const taxItemSchema = z.object({
  taxName: z.string().nullable(),
  taxRate: z.number().nullable(),
});

export const taxConfigSchema = z.object({
  taxType: z.enum(["None", "GST", "Service"]).refine((val) => val !== undefined, {
    message: "Tax type is required",
  }),
  taxNumber: z.string().optional().nullable(),
  tax1: taxItemSchema.optional().nullable(),
  tax2: taxItemSchema.optional().nullable(),
  tax3: taxItemSchema.optional().nullable(),
})
.refine(
  (data) => {
    if (data.taxType === "GST" || data.taxType === "Service") {
      return data.taxNumber && data.taxNumber.trim() !== "";
    }
    return true;
  },
  {
    message: "Tax number is required",
    path: ["taxNumber"],
  }
)
.refine(
  (data) => {
    if (data.taxType === "GST" || data.taxType === "Service") {
      return data.tax1 && data.tax1.taxName && data.tax1.taxName.trim() !== "";
    }
    return true;
  },
  {
    message: "Tax 1 name is required",
    path: ["tax1.taxName"],
  }
)
.refine(
  (data) => {
    if (data.taxType === "GST" || data.taxType === "Service") {
      return data.tax1 && data.tax1.taxRate && data.tax1.taxRate > 0;
    }
    return true;
  },
  {
    message: "Tax 1 rate is required",
    path: ["tax1.taxRate"],
  }
)
.refine(
  (data) => {
    if ((data.taxType === "GST" || data.taxType === "Service") && data.tax1?.taxRate) {
      return data.tax1.taxRate >= 1 && data.tax1.taxRate <= 100;
    }
    return true;
  },
  {
    message: "Tax 1 rate must be between 1 and 100",
    path: ["tax1.taxRate"],
  }
)
.refine(
  (data) => {
    if (data.taxType === "GST") {
      return data.tax2 && data.tax2.taxName && data.tax2.taxName.trim() !== "";
    }
    if (data.taxType === "Service" && data.tax2?.taxRate && data.tax2.taxRate > 0) {
      return data.tax2.taxName && data.tax2.taxName.trim() !== "";
    }
    if (data.taxType === "Service" && (data.tax3?.taxName || data.tax3?.taxRate)) {
      return data.tax2?.taxName && data.tax2.taxName.trim() !== "";
    }
    return true;
  },
  {
    message: "Tax 2 name is required",
    path: ["tax2.taxName"],
  }
)
.refine(
  (data) => {
    if (data.taxType === "GST") {
      return data.tax2 && data.tax2.taxRate && data.tax2.taxRate > 0;
    }
    if (data.taxType === "Service" && data.tax2?.taxName && data.tax2.taxName.trim() !== "") {
      return data.tax2.taxRate && data.tax2.taxRate > 0;
    }
    if (data.taxType === "Service" && (data.tax3?.taxName || data.tax3?.taxRate)) {
      return data.tax2?.taxRate && data.tax2.taxRate > 0;
    }
    return true;
  },
  {
    message: "Tax 2 rate is required",
    path: ["tax2.taxRate"],
  }
)
.refine(
  (data) => {
    if (data.taxType === "GST" && data.tax2?.taxRate) {
      return data.tax2.taxRate >= 1 && data.tax2.taxRate <= 100;
    }
    if (data.taxType === "Service" && data.tax2?.taxRate) {
      return data.tax2.taxRate >= 1 && data.tax2.taxRate <= 100;
    }
    return true;
  },
  {
    message: "Tax 2 rate must be between 1 and 100",
    path: ["tax2.taxRate"],
  }
)
.refine(
  (data) => {
    if (data.taxType === "GST") {
      return data.tax3 && data.tax3.taxName && data.tax3.taxName.trim() !== "";
    }
    if (data.taxType === "Service" && data.tax3?.taxRate && data.tax3.taxRate > 0) {
      return data.tax3.taxName && data.tax3.taxName.trim() !== "";
    }
    return true;
  },
  {
    message: "Tax 3 name is required",
    path: ["tax3.taxName"],
  }
)
.refine(
  (data) => {
    if (data.taxType === "GST") {
      return data.tax3 && data.tax3.taxRate && data.tax3.taxRate > 0;
    }
    if (data.taxType === "Service" && data.tax3?.taxName && data.tax3.taxName.trim() !== "") {
      return data.tax3.taxRate && data.tax3.taxRate > 0;
    }
    return true;
  },
  {
    message: "Tax 3 rate is required",
    path: ["tax3.taxRate"],
  }
)
.refine(
  (data) => {
    if (data.taxType === "GST" && data.tax3?.taxRate) {
      return data.tax3.taxRate >= 1 && data.tax3.taxRate <= 100;
    }
    if (data.taxType === "Service" && data.tax3?.taxRate) {
      return data.tax3.taxRate >= 1 && data.tax3.taxRate <= 100;
    }
    return true;
  },
  {
    message: "Tax 3 rate must be between 1 and 100",
    path: ["tax3.taxRate"],
  }
);

export type TaxConfig = z.infer<typeof taxConfigSchema>;
