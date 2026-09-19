"use client";

import * as React from "react";
import { formatPrice } from "@/lib/utils";
import type { ProductWithCategoryName } from "@/actions/products";
import { Package, Eye, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: ProductWithCategoryName;
  onSelect: (product: ProductWithCategoryName) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) / product.compare_at_price) * 100
        )
      : null;

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-border"
    >
      {/* Media container */}
      <div
        onClick={() => onSelect(product)}
        className="relative aspect-square w-full bg-muted/50 overflow-hidden flex items-center justify-center cursor-pointer"
      >
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              product.is_sold_out ? "grayscale-30 opacity-80" : ""
            }`}
          />
        ) : (
          <Package className="h-12 w-12 text-muted-foreground/40" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_sold_out ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-xs">
              Sold Out
            </span>
          ) : discount ? (
            <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold shadow-xs">
              Save {discount}%
            </span>
          ) : null}
        </div>

        {/* Hover Quick View overlay button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 text-foreground text-xs font-semibold shadow-md backdrop-blur-xs">
            <Eye className="h-3.5 w-3.5" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1 cursor-pointer" onClick={() => onSelect(product)}>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {product.category?.name ?? "Collection"}
          </p>
          <h3 className="font-semibold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline justify-between pt-2 border-t border-border/50">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          <span
            className={`text-[11px] font-medium ${
              product.is_sold_out
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {product.is_sold_out ? "Sold Out" : "Available"}
          </span>
        </div>

        {/* Buy Now Button */}
        {!product.is_sold_out && (
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Buy Now</span>
          </button>
        )}
      </div>
    </div>
  );
}
