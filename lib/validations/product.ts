import { z } from "zod/v4";
import { slugify } from "@/lib/utils";

/**
 * Product validation schema — shared between client forms and server actions.
 */
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(200, "Product name must be 200 characters or less"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200, "Slug must be 200 characters or less")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  description: z
    .string()
    .max(5000, "Description must be 5000 characters or less")
    .default(""),

  price: z
    .number()
    .nonnegative("Price must be zero or positive")
    .max(999999.99, "Price is too high"),

  compare_at_price: z
    .number()
    .nonnegative("Compare-at price must be zero or positive")
    .max(999999.99, "Compare-at price is too high")
    .nullable()
    .default(null),

  image_url: z.string().nullable().default(null),

  category_id: z.string().uuid("Invalid category").nullable().default(null),

  is_active: z.boolean().default(true),

  is_sold_out: z.boolean().default(false),

  sort_order: z.number().int("Sort order must be a whole number").default(0),
});

export type ProductSchemaType = z.infer<typeof productSchema>;

/**
 * Generate a default slug from a product name.
 */
export function generateSlug(name: string): string {
  return slugify(name);
}

