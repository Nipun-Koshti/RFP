import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(3, "Street address is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
});

const supplierSchema = z.object({
  name: z.string().min(2, "Contact name is required."),
  email: z.string().email("Must be a valid email address."),
  phone: z.string().min(10, "Phone must be at least 10 digits."),
});

// Main Vendor Schema
export const vendorSchema = z.object({
  vendorName: z.string().min(3, "Vendor name is required."),
  email: z.string().email("A valid company email is required."),
  
  phone: z.string().regex(/^\d{10,}$/, "Phone must be a valid number (min 10 digits)."),
  
  gst: z.string().regex(/^[A-Za-z0-9]{12,15}$/, "GST must be 12-15 digits."),
  
  address: addressSchema,
  
  personal: z.array(supplierSchema).min(1, "At least one key contact is required."),
});