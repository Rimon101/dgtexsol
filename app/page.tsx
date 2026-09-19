import type { Metadata } from "next";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getCustomClocks } from "@/actions/custom-clocks";
import { StoreHeader } from "@/components/storefront/store-header";
import { Hero } from "@/components/storefront/hero";
import { ProductGrid } from "@/components/storefront/product-grid";
import { CustomClocksSection } from "@/components/storefront/custom-clocks";
import { StoreFooter } from "@/components/storefront/store-footer";
import { JsonLd } from "@/components/storefront/json-ld";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Curated Quality Products for Modern Living`,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [products, categories, customClocks] = await Promise.all([
    getProducts({ status: "active" }),
    getCategories(),
    getCustomClocks(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <JsonLd products={products} />
      <StoreHeader />
      <main className="flex-1">
        <Hero productCount={products.length} />
        <CustomClocksSection clocks={customClocks} />
        <ProductGrid initialProducts={products} categories={categories} />
      </main>
      <StoreFooter />
    </div>
  );
}
