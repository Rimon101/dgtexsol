"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createProductAction,
  updateProductAction,
  type ProductWithCategoryName,
  type ProductActionResult,
} from "@/actions/products";
import type { CategoryItem } from "@/actions/categories";
import { slugify } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ProductFormProps {
  initialData?: ProductWithCategoryName | null;
  categories: CategoryItem[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [name, setName] = React.useState(initialData?.name ?? "");
  const [slug, setSlug] = React.useState(initialData?.slug ?? "");
  const [slugModified, setSlugModified] = React.useState(Boolean(initialData));
  const [imageUrl, setImageUrl] = React.useState<string | null>(
    initialData?.image_url ?? null
  );
  const [isActive, setIsActive] = React.useState(initialData?.is_active ?? true);
  const [isSoldOut, setIsSoldOut] = React.useState(initialData?.is_sold_out ?? false);

  // Auto-generate slug from name if not manually modified
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slugModified) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugModified(true);
    setSlug(slugify(e.target.value));
  };

  const [state, formAction, isPending] = React.useActionState(
    async (prevState: ProductActionResult | null, formData: FormData) => {
      let result: ProductActionResult;
      if (isEditing && initialData) {
        result = await updateProductAction(initialData.id, prevState, formData);
      } else {
        result = await createProductAction(prevState, formData);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
        router.push("/admin/products");
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight">
            {isEditing ? `Edit: ${initialData?.name}` : "Create New Product"}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Cancel
          </Link>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </div>

      {state?.error && (
        <div
          role="alert"
          className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <CardDescription>
                Title, URL slug, and full description of the product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Ergonomic Office Chair"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  URL Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. ergonomic-office-chair"
                  required
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  URL path: <code>/products/{slug || "slug-preview"}</code>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={initialData?.description ?? ""}
                  placeholder="Write details about the product, materials, specifications..."
                  rows={5}
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pricing</CardTitle>
              <CardDescription>
                Set the selling price and optional compare-at discount price.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price ($) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={initialData?.price ?? ""}
                  placeholder="29.99"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compare_at_price">Compare-at Price ($)</Label>
                <Input
                  id="compare_at_price"
                  name="compare_at_price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={initialData?.compare_at_price ?? ""}
                  placeholder="39.99 (original price)"
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Shows a strikethrough discount price on the card.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Media / Image Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Image</CardTitle>
              <CardDescription>
                Upload an image to Supabase Storage or link an external image URL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                disabled={isPending}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Settings & Status */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status & Visibility</CardTitle>
              <CardDescription>
                Control storefront appearance and availability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Active on Storefront</Label>
                  <p className="text-xs text-muted-foreground">
                    Only active products appear on the public landing page.
                  </p>
                </div>
                <Switch
                  id="is_active"
                  name="is_active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={isPending}
                />
              </div>

              <div className="border-t pt-4 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <Label htmlFor="is_sold_out">Sold Out Badge</Label>
                  <p className="text-xs text-muted-foreground">
                    Displays a clear &quot;Sold Out&quot; state on the product card.
                  </p>
                </div>
                <Switch
                  id="is_sold_out"
                  name="is_sold_out"
                  checked={isSoldOut}
                  onCheckedChange={setIsSoldOut}
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          {/* Organization / Category Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization</CardTitle>
              <CardDescription>
                Assign category and catalog display ordering.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <select
                  id="category_id"
                  name="category_id"
                  defaultValue={initialData?.category_id ?? ""}
                  disabled={isPending}
                  className="w-full h-9 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:bg-input/30"
                >
                  <option value="" className="bg-background text-foreground">
                    -- Uncategorized --
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
                <p className="text-xs text-muted-foreground">
                  Manage categories in the{" "}
                  <Link href="/admin/categories" className="text-primary hover:underline">
                    Categories section
                  </Link>
                  .
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  step="1"
                  defaultValue={initialData?.sort_order ?? 0}
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first on the landing page (e.g. 1, 2, 3).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
