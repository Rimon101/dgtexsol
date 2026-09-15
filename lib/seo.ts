/**
 * SEO & Site Configuration Utilities
 */

export const siteConfig = {
  name: "Digital Exchange & Solution",
  description:
    "Your trusted destination for phone sales, exchanges, repairs, and electrical solutions. Browse our inventory, get expert repairs, and find the best deals on smartphones and electronics.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  currency: "USD",
  locale: "en_US",
  keywords: [
    "phone repair",
    "phone exchange",
    "buy sell phones",
    "electrical solutions",
    "smartphone store",
    "electronics repair",
    "used phones",
    "phone accessories",
    "digital exchange",
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

