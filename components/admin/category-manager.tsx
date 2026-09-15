"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createCategoryAction,
  deleteCategoryAction,
  type CategoryItem,
  type CategoryActionResult,
} from "@/actions/categories";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderTree, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CategoryManagerProps {
  categories: CategoryItem[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [slugModified, setSlugModified] = React.useState(false);

  const [deletingId, setDeletingId] = React.useState<string | null>(null);

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
    async (prevState: CategoryActionResult | null, formData: FormData) => {
      const result = await createCategoryAction(prevState, formData);
      if (result.success) {
        setName("");
        setSlug("");
        setSlugModified(false);
        toast.success(`Category "${result.category?.name ?? "New Category"}" created successfully!`);
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
      return result;
    },
    null
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? Products in this category will become Uncategorized.`)) {
      return;
    }

    setDeletingId(id);
    const result = await deleteCategoryAction(id);
    setDeletingId(null);

    if (result.success) {
      toast.success(`Category "${name}" deleted`);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Categories
        </h1>
        <p className="text-sm text-muted-foreground">
          Organize your store products into customer-facing categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Category Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add New Category</span>
              </CardTitle>
              <CardDescription>
                Create a category to group products.
              </CardDescription>
            </CardHeader>
            <form action={formAction}>
              <CardContent className="space-y-4">
                {state?.error && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="cat-name">Category Name</Label>
                  <Input
                    id="cat-name"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Ergonomic Chairs"
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-slug">URL Slug</Label>
                  <Input
                    id="cat-slug"
                    name="slug"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="e.g. ergonomic-chairs"
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-sort">Sort Order</Label>
                  <Input
                    id="cat-sort"
                    name="sort_order"
                    type="number"
                    defaultValue={0}
                    disabled={isPending}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Lower numbers appear first.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    "Save Category"
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FolderTree className="h-4 w-4" />
                <span>Existing Categories ({categories.length})</span>
              </CardTitle>
              <CardDescription>
                Categories currently available to assign to products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg bg-muted/10 text-muted-foreground">
                  <FolderTree className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No categories added yet</p>
                  <p className="text-xs mt-1">Use the form on the left to add your first category.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between py-3 gap-4"
                    >
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {cat.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Slug: <code>{cat.slug}</code> • Order: {cat.sort_order}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                          {cat.products_count ?? 0} {cat.products_count === 1 ? "product" : "products"}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          disabled={deletingId === cat.id}
                          title="Delete category"
                        >
                          {deletingId === cat.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

