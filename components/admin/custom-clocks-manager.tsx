"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CustomClockItem,
  uploadCustomClockAction,
  deleteCustomClockAction,
  toggleCustomClockAction,
} from "@/actions/custom-clocks";
import { formatDate } from "@/lib/utils";
import {
  Upload,
  Clock,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

interface CustomClocksManagerProps {
  initialClocks: CustomClockItem[];
}

export function CustomClocksManager({ initialClocks }: CustomClocksManagerProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [clocks, setClocks] = React.useState<CustomClockItem[]>(initialClocks);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setClocks(initialClocks);
  }, [initialClocks]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5 MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }

  function clearSelectedFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitle("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (title.trim()) formData.append("title", title.trim());

    try {
      const res = await uploadCustomClockAction(formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.clock) {
        toast.success("Custom clock image uploaded successfully!");
        setClocks((prev) => [res.clock!, ...prev]);
        clearSelectedFile();
        router.refresh();
      }
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this custom clock image?")) return;

    setDeletingId(id);
    try {
      const res = await deleteCustomClockAction(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Clock image deleted.");
        setClocks((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete clock image.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(id: string, currentActive: boolean) {
    setTogglingId(id);
    try {
      const res = await toggleCustomClockAction(id, !currentActive);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(!currentActive ? "Clock is now visible." : "Clock is now hidden.");
        setClocks((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_active: !currentActive } : c))
        );
        router.refresh();
      }
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Upload Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Upload Custom Clock</h2>
            <p className="text-xs text-muted-foreground">
              Add a new custom clock photo to showcase on the storefront.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Drop / File Selector Area */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="clock-file-input"
                disabled={isUploading}
              />
              <label
                htmlFor="clock-file-input"
                className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  previewUrl
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-contain rounded-xl p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center p-4 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs font-medium text-foreground">
                      Click to choose clock photo
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1">
                      JPG, PNG, WebP up to 5 MB
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Meta details & submit */}
            <div className="flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <label
                  htmlFor="clock-title"
                  className="text-xs font-medium text-foreground"
                >
                  Clock Title / Model (Optional)
                </label>
                <input
                  id="clock-title"
                  type="text"
                  placeholder="e.g. Handmade Wooden Wall Clock"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                  className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                />
                <p className="text-[11px] text-muted-foreground">
                  Customers who click this clock will see WhatsApp contact details to place their order.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {selectedFile && (
                  <button
                    type="button"
                    onClick={clearSelectedFile}
                    disabled={isUploading}
                    className="px-3 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload to Storefront</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Clock List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Uploaded Clocks ({clocks.length})
            </h3>
            <p className="text-xs text-muted-foreground">
              Manage custom clock photos visible on the landing page.
            </p>
          </div>
        </div>

        {clocks.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
              <Clock className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">No clocks uploaded yet</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Use the upload form above to add custom clock photos to your landing page gallery.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {clocks.map((clock) => {
              const isDeleting = deletingId === clock.id;
              const isToggling = togglingId === clock.id;

              return (
                <div
                  key={clock.id}
                  className={`group relative rounded-xl border border-border bg-card overflow-hidden transition-all shadow-xs flex flex-col ${
                    !clock.is_active ? "opacity-60" : ""
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square w-full bg-muted overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clock.image_url}
                      alt={clock.title || "Custom Clock"}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />

                    {/* Active/Hidden pill */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          clock.is_active
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "bg-muted-foreground text-white"
                        }`}
                      >
                        {clock.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </div>

                  {/* Actions & info */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <p className="text-xs font-medium text-foreground truncate">
                      {clock.title || "Custom Clock"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDate(clock.created_at)}
                    </p>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => handleToggle(clock.id, clock.is_active)}
                        disabled={isToggling || isDeleting}
                        title={clock.is_active ? "Hide from storefront" : "Show on storefront"}
                        className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md text-[11px] font-medium border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isToggling ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : clock.is_active ? (
                          <>
                            <EyeOff className="h-3 w-3 text-muted-foreground" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 text-emerald-600" />
                            <span>Show</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(clock.id)}
                        disabled={isDeleting || isToggling}
                        title="Delete image"
                        className="p-1 rounded-md text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
