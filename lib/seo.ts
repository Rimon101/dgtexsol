/**
 * SEO & Site Configuration Utilities
 */

export const siteConfig = {
  name: "Modern Store",
  description:
    "Discover our curated collection of premium products. Browse categories, explore verified details, and shop with confidence.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  currency: "USD",
  locale: "en_US",
  keywords: [
    "e-commerce",
    "online store",
    "shopping",
    "curated products",
    "lifestyle goods",
    "quality store",
  ],
};

/**
 * Returns the resolved canonical base URL for the site.
 * Prefers NEXT_PUBLIC_SITE_URL, falls back to VERCEL_URL, then localhost.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

