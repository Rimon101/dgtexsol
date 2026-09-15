import type { MetadataRoute } from "next";
import { getProducts } from "@/actions/products";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  let products: Array<{ slug: string; updated_at: string; created_at: string }> = [];
  try {
    const fetched = await getProducts({ status: "active" });
    products = fetched;
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

