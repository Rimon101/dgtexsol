import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Edit Product",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} categories={categories} />;
}

