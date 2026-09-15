"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/actions/auth";

export interface UploadResult {
  success?: boolean;
  error?: string;
  url?: string;
  path?: string;
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
 * Server action to upload a product image to the 'product-images' Supabase Storage bucket.
 * Verifies admin authentication, then securely uploads via admin client.
 */
export async function uploadProductImageAction(formData: FormData): Promise<UploadResult> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized. You must be signed in as an admin to upload images." };
  }

  const file = formData.get("file") as File | null;

  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: "No image file provided." };
  }

  // 1. Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      error: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP, GIF, AVIF.`,
    };
  }

  // 2. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      error: `File is too large (${sizeInMb} MB). Maximum allowed size is 5 MB.`,
    };
  }

  // 3. Generate sanitized unique path
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const uniqueId = crypto.randomUUID().slice(0, 8);
  const filePath = `products/${Date.now()}-${uniqueId}.${ext}`;

  // 4. Upload file buffer via admin client (server-side, bypasses storage RLS)
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

  // 5. Get public URL
  const {
    data: { publicUrl },
  } = adminSupabase.storage.from("product-images").getPublicUrl(filePath);

  return {
    success: true,
    url: publicUrl,
    path: filePath,
  };
}

/**
 * Helper to check if an image URL belongs to our Supabase Storage 'product-images' bucket.
 */
export async function isSupabaseStorageUrl(url: string | null | undefined): Promise<boolean> {
  if (!url) return false;
  return url.includes("/storage/v1/object/public/product-images/");
}

/**
 * Extract storage path from a full public Supabase Storage URL.
 */
export async function extractStoragePath(url: string): Promise<string | null> {
  const marker = "/storage/v1/object/public/product-images/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

/**
 * Delete a product image from Supabase Storage by its public URL.
 * Handles orphaned-image cleanup safely.
 */
export async function deleteStorageImageByUrl(url: string | null | undefined): Promise<boolean> {
  if (!url) return false;

  const path = await extractStoragePath(url);
  if (!path) return false;

  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.storage
    .from("product-images")
    .remove([path]);

  if (error) {
    console.error("Failed to delete storage file:", error);
    return false;
  }

  return true;
}

