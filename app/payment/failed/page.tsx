import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { XCircle, Home, RotateCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Failed — Digital Exchange & Solution",
  robots: { index: false, follow: false },
};

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Failed Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Payment Failed
          </h1>
          <p className="text-sm text-muted-foreground">
            Something went wrong with your payment. No charges were applied. Please try again.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/#catalog"
            className={buttonVariants({
              size: "lg",
              className: "gap-2 w-full",
            })}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </Link>

          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "gap-2 w-full",
            })}
          >
            <Home className="h-4 w-4" />
            <span>Back to Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

