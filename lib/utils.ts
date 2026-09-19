import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names with clsx + tailwind-merge.
 * This is the standard shadcn/ui utility.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generate a URL-friendly slug from a string.
 * Handles unicode, strips non-alphanumeric characters, and collapses hyphens.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/[^\w-]+/g, "") // remove non-word chars
    .replace(/--+/g, "-") // collapse double hyphens
    .replace(/^-+/, "") // trim leading hyphens
    .replace(/-+$/, ""); // trim trailing hyphens
}

/**
 * Format a number as currency.
 * Defaults to USD — can be changed via the `currency` parameter.
 */
export function formatPrice(
  amount: number,
  currency: string = "BDT",
  locale: string = "en-BD"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a Date or ISO string into a human-readable date.
 */
export function formatDate(
  date: string | Date,
  locale: string = "en-US"
): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
