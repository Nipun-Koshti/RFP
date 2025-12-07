import { z } from "zod";

export const quoteValidator = z.object({
  vendor: z.string().min(1, "Vendor ID is required"),

  amount: z.number().optional(),  

  quotevalue: z.array(
    z.object({
      name: z.string().min(1, "Item name is required"),
      quantity: z.number().min(1, "Quantity must be greater than 0"),
      unitPrice: z.number().min(0, "Unit price cannot be negative"),
      total: z.number().optional(),  
      description: z.string().optional()
    })
  ).min(1, "At least 1 line item is required")
});
