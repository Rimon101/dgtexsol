import type { Metadata } from "next";
import { getCategories } from "@/actions/categories";
import { CategoryManager } from "@/components/admin/category-manager";

export const metadata: Metadata = {
  title: "Categories Management",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <CategoryManager categories={categories} />;
}
