import { z } from "zod";

const lineItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(0, "Quantity must be at least 1"),
  description: z.string().optional(),
  unitPrice: z.number().min(0, "Unit price cannot be negative").optional(),
});

const vendorQuoteSchema = z.object({
  vendor: z.string().min(1, "Vendor ID is required"),
  quotation: z.string().optional().nullable(),
});

export const rfpValidator = z.object({
  subject: z.string().min(1, "Subject is required"),

  budget: z.number().min(0, "Budget must be non-negative"),

  billingAddress: z.string().min(1, "Billing address is required"),

  delivery: z.string().pipe(
    z.coerce.date().refine(
      (date) => !isNaN(date.getTime()),
      "Invalid delivery date"
    )
  ),

  vendors: z.array(vendorQuoteSchema).optional(),

  lineItem: z.array(lineItemSchema).optional(),

  remark: z.string().optional(),

  status: z.enum(["Pending", "Cancelled", "Quoted", "Submitted"]).optional(),
});
