import type { Metadata } from "next";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { ProductTable } from "@/components/admin/product-table";

export const metadata: Metadata = {
  title: "Products Management",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ProductTable products={products} categories={categories} />;
}
