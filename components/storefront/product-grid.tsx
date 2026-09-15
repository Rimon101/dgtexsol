"use client";

import * as React from "react";
import type { ProductWithCategoryName } from "@/actions/products";
import type { CategoryItem } from "@/actions/categories";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductModal } from "@/components/storefront/product-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, SlidersHorizontal } from "lucide-react";

interface ProductGridProps {
  initialProducts: ProductWithCategoryName[];
  categories: CategoryItem[];
}

export function ProductGrid({ initialProducts, categories }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  const [inStockOnly, setInStockOnly] = React.useState(false);

  const [activeModalProduct, setActiveModalProduct] = React.useState<ProductWithCategoryName | null>(null);

  // Compute category counts (for tabs)
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    initialProducts.forEach((p) => {
      if (p.category_id) {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      }
    });
    return counts;
  }, [initialProducts]);

  // Filter & sort logic
  const filteredProducts = React.useMemo(() => {
    let list = initialProducts.filter((p) => {
      // 1. Search filter
      if (search.trim() !== "") {
        const q = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      // 2. Category filter
      if (selectedCategory !== "all" && p.category_id !== selectedCategory) {
        return false;
      }

      // 3. In stock only
      if (inStockOnly && p.is_sold_out) {
        return false;
      }

      return true;
    });

    // Sort
    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // Featured / Sort order
      list = [...list].sort((a, b) => a.sort_order - b.sort_order);
    }

    return list;
  }, [initialProducts, search, selectedCategory, inStockOnly, sortBy]);

  return (
    <section id="catalog" className="py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Our Products
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Explore our full catalog of curated quality goods.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-9 h-10 rounded-xl"
            />
          </div>
        </div>

        {/* Category Tabs & Sorting Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-border">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              All ({initialProducts.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {cat.name} ({categoryCounts[cat.id] || 0})
              </button>
            ))}
          </div>

          {/* Sort & Availability Controls */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
              />
              <span>In-stock only</span>
            </label>

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring dark:bg-input/30"
              >
                <option value="featured" className="bg-background text-foreground">
                  Sort: Featured
                </option>
                <option value="price-asc" className="bg-background text-foreground">
                  Price: Low to High
                </option>
                <option value="price-desc" className="bg-background text-foreground">
                  Price: High to Low
                </option>
                <option value="newest" className="bg-background text-foreground">
                  Newest
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20 px-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {initialProducts.length === 0
                ? "Store is preparing new products"
                : "No products match your filters"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              {initialProducts.length === 0
                ? "Check back soon as we stock our catalog with new arrivals."
                : "Try changing your search terms, selecting another category, or resetting filters."}
            </p>
            {initialProducts.length > 0 && (
              <div className="mt-5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setInStockOnly(false);
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </section>
  );
}

