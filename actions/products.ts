"use server";

import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import { deleteStorageImageByUrl } from "@/actions/storage";
import { getSessionUser } from "@/actions/auth";
import { revalidatePath } from "next/cache";

export interface ProductWithCategoryName {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  is_sold_out: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface ProductActionResult {
  success?: boolean;
  error?: string;
  productId?: string;
}

/**
 * Fetch products with optional filtering by search query, category, and status.
 */
export async function getProducts(options?: {
  search?: string;
  categoryId?: string;
  status?: "all" | "active" | "inactive" | "sold_out";
}): Promise<ProductWithCategoryName[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (options?.search && options.search.trim() !== "") {
    query = query.ilike("name", `%${options.search.trim()}%`);
  }

  if (options?.categoryId && options.categoryId !== "all") {
    query = query.eq("category_id", options.categoryId);
  }

  if (options?.status === "active") {
    query = query.eq("is_active", true);
  } else if (options?.status === "inactive") {
    query = query.eq("is_active", false);
  } else if (options?.status === "sold_out") {
    query = query.eq("is_sold_out", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data as unknown as ProductWithCategoryName[]) ?? [];
}

/**
 * Fetch a single product by its UUID.
 */
export async function getProductById(id: string): Promise<ProductWithCategoryName | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as unknown as ProductWithCategoryName;
}

/**
 * Server Action: Create a new product.
 */
export async function createProductAction(
  prevState: ProductActionResult | null,
  formData: FormData
): Promise<ProductActionResult> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized. You must be signed in as an admin." };
  }

  const name = formData.get("name")?.toString() ?? "";
  let slug = formData.get("slug")?.toString() ?? "";
  if (!slug || slug.trim() === "") {
    slug = slugify(name);
  }

  const description = formData.get("description")?.toString() ?? "";
  const priceRaw = formData.get("price");
  const price = priceRaw ? parseFloat(priceRaw.toString()) : NaN;

  const compareAtPriceRaw = formData.get("compare_at_price");
  const compare_at_price =
    compareAtPriceRaw && compareAtPriceRaw.toString().trim() !== ""
      ? parseFloat(compareAtPriceRaw.toString())
      : null;

  const image_url = formData.get("image_url")?.toString()?.trim() || null;
  const category_id = formData.get("category_id")?.toString()?.trim() || null;
  const is_active = formData.get("is_active") === "true";
  const is_sold_out = formData.get("is_sold_out") === "true";

  const sortOrderRaw = formData.get("sort_order");
  const sort_order = sortOrderRaw ? parseInt(sortOrderRaw.toString(), 10) : 0;

  const validated = productSchema.safeParse({
    name,
    slug,
    description,
    price,
    compare_at_price,
    image_url,
    category_id: category_id === "" ? null : category_id,
    is_active,
    is_sold_out,
    sort_order: isNaN(sort_order) ? 0 : sort_order,
  });

  if (!validated.success) {
    const firstIssue = validated.error.issues[0];
    return { error: `${firstIssue?.path.join(".")}: ${firstIssue?.message}` };
  }

  const supabase = await createClient();

  // Check slug uniqueness
  const { data: existingSlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", validated.data.slug)
    .limit(1);

  let finalSlug = validated.data.slug;
  if (existingSlug && existingSlug.length > 0) {
    finalSlug = `${validated.data.slug}-${Date.now().toString().slice(-4)}`;
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: validated.data.name,
      slug: finalSlug,
      description: validated.data.description,
      price: validated.data.price,
      compare_at_price: validated.data.compare_at_price,
      image_url: validated.data.image_url,
      category_id: validated.data.category_id,
      is_active: validated.data.is_active,
      is_sold_out: validated.data.is_sold_out,
      sort_order: validated.data.sort_order,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");

  return { success: true, productId: data.id };
}

/**
 * Server Action: Update an existing product.
 */
export async function updateProductAction(
  id: string,
  prevState: ProductActionResult | null,
  formData: FormData
): Promise<ProductActionResult> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized. You must be signed in as an admin." };
  }

  const name = formData.get("name")?.toString() ?? "";
  let slug = formData.get("slug")?.toString() ?? "";
  if (!slug || slug.trim() === "") {
    slug = slugify(name);
  }

  const description = formData.get("description")?.toString() ?? "";
  const priceRaw = formData.get("price");
  const price = priceRaw ? parseFloat(priceRaw.toString()) : NaN;

  const compareAtPriceRaw = formData.get("compare_at_price");
  const compare_at_price =
    compareAtPriceRaw && compareAtPriceRaw.toString().trim() !== ""
      ? parseFloat(compareAtPriceRaw.toString())
      : null;

  const image_url = formData.get("image_url")?.toString()?.trim() || null;
  const category_id = formData.get("category_id")?.toString()?.trim() || null;
  const is_active = formData.get("is_active") === "true";
  const is_sold_out = formData.get("is_sold_out") === "true";

  const sortOrderRaw = formData.get("sort_order");
  const sort_order = sortOrderRaw ? parseInt(sortOrderRaw.toString(), 10) : 0;

  const validated = productSchema.safeParse({
    name,
    slug,
    description,
    price,
    compare_at_price,
    image_url,
    category_id: category_id === "" ? null : category_id,
    is_active,
    is_sold_out,
    sort_order: isNaN(sort_order) ? 0 : sort_order,
  });

  if (!validated.success) {
    const firstIssue = validated.error.issues[0];
    return { error: `${firstIssue?.path.join(".")}: ${firstIssue?.message}` };
  }

  const supabase = await createClient();

  // Check slug uniqueness excluding this product
  const { data: existingSlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", validated.data.slug)
    .neq("id", id)
    .limit(1);

  if (existingSlug && existingSlug.length > 0) {
    return { error: "A product with this slug already exists. Please choose a different slug." };
  }

  // Fetch existing product to check if old image needs cleanup
  const { data: currentProduct } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("products")
    .update({
      name: validated.data.name,
      slug: validated.data.slug,
      description: validated.data.description,
      price: validated.data.price,
      compare_at_price: validated.data.compare_at_price,
      image_url: validated.data.image_url,
      category_id: validated.data.category_id,
      is_active: validated.data.is_active,
      is_sold_out: validated.data.is_sold_out,
      sort_order: validated.data.sort_order,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // If image was replaced, remove old image from storage to avoid orphans
  if (
    currentProduct?.image_url &&
    currentProduct.image_url !== validated.data.image_url
  ) {
    await deleteStorageImageByUrl(currentProduct.image_url);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath("/admin/dashboard");
  revalidatePath("/");

  return { success: true, productId: id };
}

/**
 * Server Action: Delete a product by its UUID.
 * Automatically cleans up any associated image in Supabase Storage.
 */
export async function deleteProductAction(id: string): Promise<{ success?: boolean; error?: string }> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized. You must be signed in as an admin." };
  }

  const supabase = await createClient();

  // 1. Get image_url before deleting product
  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  // 2. Delete database record
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // 3. Clean up associated storage file if stored on Supabase
  if (product?.image_url) {
    await deleteStorageImageByUrl(product.image_url);
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");

  return { success: true };
}

/**
 * Server Action: Instantly toggle a boolean field (is_active or is_sold_out).
 */
export async function toggleProductFieldAction(
  id: string,
  field: "is_active" | "is_sold_out",
  newValue: boolean
): Promise<{ success?: boolean; error?: string }> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized. You must be signed in as an admin." };
  }

  const supabase = await createClient();

  const updatePayload =
    field === "is_active"
      ? { is_active: newValue }
      : { is_sold_out: newValue };

  const { error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");

  return { success: true };
}
