import type { Metadata } from "next";
import { getCategories } from "@/actions/categories";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Create Product",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return <ProductForm categories={categories} />;
}

