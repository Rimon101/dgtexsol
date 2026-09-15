import type { MetadataRoute } from "next";
import { createPublicServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  let products: Array<{ slug: string; updated_at: string; created_at: string }> = [];
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from("products")
      .select("slug, updated_at, created_at")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (data) {
      products = data;
    }
  } catch (err) {
    console.error("Error generating sitemap products:", err);
  }

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/#${product.slug}`,
    lastModified: new Date(product.updated_at || product.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...productEntries,
  ];
}

