"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import {
  deleteProductAction,
  toggleProductFieldAction,
  type ProductWithCategoryName,
} from "@/actions/products";
import type { CategoryItem } from "@/actions/categories";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

interface ProductTableProps {
  products: ProductWithCategoryName[];
  categories: CategoryItem[];
}

export function ProductTable({ products, categories }: ProductTableProps) {
  const router = useRouter();

  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState<"all" | "active" | "inactive" | "sold_out">("all");

  // Deletion modal state
  const [deletingProduct, setDeletingProduct] = React.useState<ProductWithCategoryName | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");

  // Toggle loading state map
  const [pendingToggles, setPendingToggles] = React.useState<Record<string, boolean>>({});

  // Client-side instant filtering
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      // 1. Search filter
      if (search.trim() !== "") {
        const query = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSlug = p.slug.toLowerCase().includes(query);
        if (!matchesName && !matchesSlug) return false;
      }

      // 2. Category filter
      if (selectedCategory !== "all") {
        if (p.category_id !== selectedCategory) return false;
      }

      // 3. Status filter
      if (selectedStatus === "active" && !p.is_active) return false;
      if (selectedStatus === "inactive" && p.is_active) return false;
      if (selectedStatus === "sold_out" && !p.is_sold_out) return false;

      return true;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  // Handle instant field toggle
  const handleToggle = async (
    id: string,
    field: "is_active" | "is_sold_out",
    currentVal: boolean
  ) => {
    const key = `${id}-${field}`;
    setPendingToggles((prev) => ({ ...prev, [key]: true }));

    try {
      const result = await toggleProductFieldAction(id, field, !currentVal);
      if (result.success) {
        toast.success(
          field === "is_active"
            ? !currentVal
              ? "Product is now visible on storefront"
              : "Product hidden from storefront"
            : !currentVal
              ? "Product marked as sold out"
              : "Product marked as available in stock"
        );
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to update product status");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("An unexpected error occurred while updating status");
    } finally {
      setPendingToggles((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Handle product deletion
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    setDeleteError("");

    const result = await deleteProductAction(deletingProduct.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success(`Product "${deletingProduct.name}" deleted successfully`);
      setDeletingProduct(null);
      router.refresh();
    } else {
      setDeleteError(result.error ?? "Failed to delete product");
      toast.error(result.error ?? "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage product catalog, pricing, availability, and active display status.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or slug..."
            className="pl-9 h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:bg-input/30"
          >
            <option value="all" className="bg-background text-foreground">
              All Categories
            </option>
            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
                className="bg-background text-foreground"
              >
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value as "all" | "active" | "inactive" | "sold_out"
              )
            }
            className="h-9 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:bg-input/30"
          >
            <option value="all" className="bg-background text-foreground">
              All Statuses
            </option>
            <option value="active" className="bg-background text-foreground">
              Active only
            </option>
            <option value="inactive" className="bg-background text-foreground">
              Inactive only
            </option>
            <option value="sold_out" className="bg-background text-foreground">
              Sold out only
            </option>
          </select>
        </div>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      {filteredProducts.length === 0 ? (
        <Card className="border-border/70">
          <CardContent className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {products.length === 0
                ? "No products added yet"
                : "No matching products found"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              {products.length === 0
                ? "Get started by adding your first product to display on your landing page."
                : "Try adjusting your search query or filters to find what you're looking for."}
            </p>
            <div className="mt-4">
              {products.length === 0 ? (
                <Link
                  href="/admin/products/new"
                  className={buttonVariants({ size: "sm" })}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span>Add First Product</span>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                  }}
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4 text-center">Active</th>
                  <th className="py-3.5 px-4 text-center">Sold Out</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((prod) => (
                  <tr
                    key={prod.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Product info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                          {prod.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={prod.image_url}
                              alt={prod.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-medium text-foreground truncate">
                            {prod.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            /{prod.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        {prod.category?.name ?? "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-foreground">
                          {formatPrice(prod.price)}
                        </span>
                        {prod.compare_at_price && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(prod.compare_at_price)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Active Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <Switch
                          checked={prod.is_active}
                          onCheckedChange={() =>
                            handleToggle(prod.id, "is_active", prod.is_active)
                          }
                          disabled={pendingToggles[`${prod.id}-is_active`]}
                          aria-label={`Toggle active for ${prod.name}`}
                        />
                        <span className="text-[10px] text-muted-foreground mt-1">
                          {prod.is_active ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </td>

                    {/* Sold Out Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <Switch
                          checked={prod.is_sold_out}
                          onCheckedChange={() =>
                            handleToggle(prod.id, "is_sold_out", prod.is_sold_out)
                          }
                          disabled={pendingToggles[`${prod.id}-is_sold_out`]}
                          aria-label={`Toggle sold out for ${prod.name}`}
                        />
                        <span className="text-[10px] text-muted-foreground mt-1">
                          {prod.is_sold_out ? "Sold Out" : "In Stock"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/admin/products/${prod.id}/edit`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "icon",
                            className: "h-8 w-8",
                          })}
                          title="Edit product"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            setDeletingProduct(prod);
                            setDeleteError("");
                          }}
                          title="Delete product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (< md) */}
          <div className="md:hidden divide-y divide-border">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                      {prod.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prod.image_url}
                          alt={prod.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {prod.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {prod.category?.name ?? "Uncategorized"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/products/${prod.id}/edit`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "icon",
                        className: "h-8 w-8",
                      })}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        setDeletingProduct(prod);
                        setDeleteError("");
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
                  <div>
                    <span className="font-bold text-sm">
                      {formatPrice(prod.price)}
                    </span>
                    {prod.compare_at_price && (
                      <span className="text-muted-foreground line-through ml-1.5">
                        {formatPrice(prod.compare_at_price)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <span className="text-muted-foreground">Active:</span>
                      <Switch
                        checked={prod.is_active}
                        onCheckedChange={() =>
                          handleToggle(prod.id, "is_active", prod.is_active)
                        }
                        disabled={pendingToggles[`${prod.id}-is_active`]}
                      />
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <span className="text-muted-foreground">Sold Out:</span>
                      <Switch
                        checked={prod.is_sold_out}
                        onCheckedChange={() =>
                          handleToggle(prod.id, "is_sold_out", prod.is_sold_out)
                        }
                        disabled={pendingToggles[`${prod.id}-is_sold_out`]}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {deletingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-2xl border border-border animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-destructive mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 id="modal-title" className="text-lg font-bold text-foreground">
                Delete Product
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                &quot;{deletingProduct.name}&quot;
              </strong>
              ? This action is permanent and cannot be undone.
            </p>

            {deleteError && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs"
              >
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Yes, Delete Product"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
