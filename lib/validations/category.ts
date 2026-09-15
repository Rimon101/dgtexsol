import { z } from "zod/v4";

/**
 * Category validation schema.
 */
export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name must be 100 characters or less"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100, "Slug must be 100 characters or less")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  sort_order: z.number().int("Sort order must be a whole number").default(0),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;

