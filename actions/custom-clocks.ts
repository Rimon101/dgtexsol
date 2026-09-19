"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/actions/auth";
import { deleteStorageImageByUrl } from "@/actions/storage";
import { revalidatePath } from "next/cache";

export interface CustomClockItem {
  id: string;
  image_url: string;
  title: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Public: Fetch active custom clocks for the storefront landing page.
 */
export async function getCustomClocks(): Promise<CustomClockItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("custom_clocks")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching custom clocks:", error);
    return [];
  }

  return (data as CustomClockItem[]) ?? [];
}

/**
 * Admin: Fetch all custom clocks for the admin dashboard.
 */
export async function getAdminCustomClocks(): Promise<CustomClockItem[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("custom_clocks")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin custom clocks:", error);
    return [];
  }

  return (data as CustomClockItem[]) ?? [];
}

/**
 * Admin: Upload a new clock image and create the record.
 */
export async function uploadCustomClockAction(formData: FormData): Promise<{
  success?: boolean;
  error?: string;
  clock?: CustomClockItem;
}> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized. You must be signed in as an admin." };
  }

  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string | null)?.trim() || null;

  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: "Please select an image file to upload." };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      error: `Invalid file format: ${file.type}. Allowed formats: JPG, PNG, WebP, GIF, AVIF.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "File size exceeds 5 MB limit." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const uniqueId = crypto.randomUUID().slice(0, 8);
  const filePath = `clocks/${Date.now()}-${uniqueId}.${ext}`;

  const adminSupabase = createAdminClient();
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await adminSupabase.storage
    .from("product-images")
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = adminSupabase.storage.from("product-images").getPublicUrl(filePath);

  const supabase = await createClient();
  const { data: newClock, error: dbError } = await supabase
    .from("custom_clocks")
    .insert({
      image_url: publicUrl,
      title,
      is_active: true,
      sort_order: 0,
    })
    .select("*")
    .single();

  if (dbError) {
    console.error("Database insert error:", dbError);
    // Cleanup storage file on db error
    await deleteStorageImageByUrl(publicUrl);
    return { error: dbError.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/custom-clocks");

  return { success: true, clock: newClock as CustomClockItem };
}

/**
 * Admin: Delete a custom clock and its image from storage.
 */
export async function deleteCustomClockAction(id: string): Promise<{
  success?: boolean;
  error?: string;
}> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized. You must be signed in as an admin." };
  }

  const supabase = await createClient();

  const { data: clock, error: fetchError } = await supabase
    .from("custom_clocks")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError || !clock) {
    return { error: "Clock record not found." };
  }

  const { error: deleteError } = await supabase
    .from("custom_clocks")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Database delete error:", deleteError);
    return { error: deleteError.message };
  }

  if (clock.image_url) {
    await deleteStorageImageByUrl(clock.image_url);
  }

  revalidatePath("/");
  revalidatePath("/admin/custom-clocks");

  return { success: true };
}

/**
 * Admin: Toggle active status of a custom clock.
 */
export async function toggleCustomClockAction(
  id: string,
  isActive: boolean
): Promise<{ success?: boolean; error?: string }> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized. You must be signed in as an admin." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("custom_clocks")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    console.error("Update error:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/custom-clocks");

  return { success: true };
}

