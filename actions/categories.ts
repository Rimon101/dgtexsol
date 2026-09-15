"use server";

import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validations/category";
import { getSessionUser } from "@/actions/auth";
import { revalidatePath } from "next/cache";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
  products_count?: number;
}

export interface CategoryActionResult {
  success?: boolean;
  error?: string;
  category?: CategoryItem;
}

/**
 * Fetch all categories ordered by sort_order ASC, name ASC.
 */
export async function getCategories(): Promise<CategoryItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order, created_at, products(count)")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return (
    data?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      sort_order: cat.sort_order,
      created_at: cat.created_at,
      products_count: (cat.products as unknown as { count: number }[])?.[0]?.count ?? 0,
    })) ?? []
  );
}

/**
 * Create a new category.
 */
export async function createCategoryAction(
  prevState: CategoryActionResult | null,
  formData: FormData
): Promise<CategoryActionResult> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized. You must be signed in as an admin." };
  }

  const name = formData.get("name")?.toString() ?? "";
  const slug = formData.get("slug")?.toString() ?? "";
  const sortOrderRaw = formData.get("sort_order");
  const sort_order = sortOrderRaw ? parseInt(sortOrderRaw.toString(), 10) : 0;

  const validated = categorySchema.safeParse({
    name,
    slug,
    sort_order: isNaN(sort_order) ? 0 : sort_order,
  });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Invalid category data" };
  }

  const supabase = await createClient();

  // Check if slug or name already exists
  const { data: existing } = await supabase
    .from("categories")
    .select("id, name, slug")
    .or(`name.eq."${validated.data.name}",slug.eq."${validated.data.slug}"`)
    .limit(1);

  if (existing && existing.length > 0) {
    return { error: "A category with this name or slug already exists." };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: validated.data.name,
      slug: validated.data.slug,
      sort_order: validated.data.sort_order,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");

  return { success: true, category: data as CategoryItem };
}

/**
 * Delete a category.
 */
export async function deleteCategoryAction(id: string): Promise<{ success?: boolean; error?: string }> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized. You must be signed in as an admin." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");

  return { success: true };
}

