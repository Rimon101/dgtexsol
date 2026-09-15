"use client";

import * as React from "react";
import { uploadProductImageAction } from "@/actions/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  X,
  Loader2,
  RefreshCw,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface ImageUploadProps {
  name?: string;
  defaultValue?: string | null;
  value?: string | null;
  onChange?: (url: string | null) => void;
  disabled?: boolean;
}

export function ImageUpload({
  name = "image_url",
  defaultValue,
  value: controlledValue,
  onChange,
  disabled = false,
}: ImageUploadProps) {
  const [internalValue, setInternalValue] = React.useState<string | null>(
    defaultValue || null
  );
  const currentUrl = controlledValue !== undefined ? controlledValue : internalValue;

  const [mode, setMode] = React.useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = React.useState(currentUrl || "");
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateValue = (newUrl: string | null) => {
    setInternalValue(newUrl);
    setUrlInput(newUrl || "");
    onChange?.(newUrl);
  };

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    // Client-side validations
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid format. Please upload JPEG, PNG, WebP, GIF, or AVIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image exceeds 5 MB. Please upload a smaller image.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadProductImageAction(formData);

      if (result.success && result.url) {
        updateValue(result.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(result.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden input to pass value in form submission */}
      <input type="hidden" name={name} value={currentUrl || ""} />

      {/* Mode toggle (Upload from Computer vs. Paste Image URL) */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {currentUrl ? "Current Image" : "Choose upload method:"}
        </span>

        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-1 rounded transition-colors ${
              mode === "upload"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-1 rounded transition-colors ${
              mode === "url"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Image Link
          </button>
        </div>
      </div>

      {/* Error / Success Notifications */}
      {uploadError && (
        <div
          role="alert"
          className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Image uploaded and stored in Supabase Storage!</span>
        </div>
      )}

      {/* When an image exists: Preview & Replace/Remove Actions */}
      {currentUrl && currentUrl.trim() !== "" ? (
        <div className="relative rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative h-32 w-32 rounded-lg bg-muted border overflow-hidden shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUrl}
              alt="Uploaded product preview"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
            <p className="text-xs font-medium text-foreground truncate max-w-sm">
              {currentUrl}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {currentUrl.includes("supabase.co")
                ? "Stored in Supabase Storage (product-images)"
                : "External hosted image"}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                )}
                <span>Replace Image</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled || isUploading}
                onClick={() => updateValue(null)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                <span>Remove</span>
              </Button>
            </div>
          </div>
        </div>
      ) : mode === "upload" ? (
        /* Drag & Drop File Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/20"
          } ${disabled || isUploading ? "pointer-events-none opacity-50" : ""}`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>

          <p className="text-sm font-semibold text-foreground">
            {isUploading
              ? "Uploading to Supabase Storage..."
              : "Click to upload or drag & drop image"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, WebP, GIF, or AVIF up to 5 MB
          </p>
        </div>
      ) : (
        /* Direct URL Input */
        <div className="space-y-2 p-4 rounded-xl border border-border bg-card">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/... or https://..."
              disabled={disabled}
              className="text-sm"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => updateValue(urlInput.trim() || null)}
              disabled={disabled || !urlInput.trim()}
            >
              <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
              <span>Apply</span>
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Paste any direct image URL to use as the product image.
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
          // Reset input so re-selecting same file triggers onChange
          e.target.value = "";
        }}
      />
    </div>
  );
}
