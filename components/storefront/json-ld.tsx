import * as React from "react";
import type { ProductWithCategoryName } from "@/actions/products";
import { getSiteUrl, siteConfig } from "@/lib/seo";

interface JsonLdProps {
  products: ProductWithCategoryName[];
}

export function JsonLd({ products }: JsonLdProps) {
  const siteUrl = getSiteUrl();

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        "@id": `${siteUrl}/#store`,
        name: siteConfig.name,
        url: siteUrl,
        description: siteConfig.description,
        priceRange: "$",
        currenciesAccepted: siteConfig.currency,
      },
      {
        "@type": "ItemList",
        name: `${siteConfig.name} Catalog`,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            "@id": `${siteUrl}/#product-${product.slug}`,
            name: product.name,
            description: product.description || product.name,
            image: product.image_url ? [product.image_url] : [],
            sku: product.slug,
            category: product.category?.name ?? "General",
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: siteConfig.currency,
              availability: product.is_sold_out
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
              url: `${siteUrl}/#${product.slug}`,
            },
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}
