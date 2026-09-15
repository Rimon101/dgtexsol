"use client";

import * as React from "react";
import { formatPrice } from "@/lib/utils";
import type { ProductWithCategoryName } from "@/actions/products";
import { X, Package, CheckCircle2, AlertCircle } from "lucide-react";

interface ProductModalProps {
  product: ProductWithCategoryName | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (product) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) / product.compare_at_price) * 100
        )
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-background/80 backdrop-blur-xs border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Image Preview Container */}
            <div className="relative aspect-square w-full rounded-xl bg-muted border border-border overflow-hidden flex items-center justify-center">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-16 w-16 text-muted-foreground/50" />
              )}

              {/* Discount / Sold Out badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.is_sold_out ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-xs">
                    Sold Out
                  </span>
                ) : discount ? (
                  <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-xs">
                    Save {discount}%
                  </span>
                ) : null}
              </div>
            </div>

            {/* Product Meta */}
            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground mb-2">
                  {product.category?.name ?? "General"}
                </span>
                <h2
                  id="product-detail-title"
                  className="text-2xl font-bold text-foreground tracking-tight"
                >
                  {product.name}
                </h2>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-border">
                <span className="text-3xl font-extrabold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && (
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-sm">
                {product.is_sold_out ? (
                  <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    <span>Currently Sold Out</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>In Stock & Available</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-1.5 pt-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </h3>
                  <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
