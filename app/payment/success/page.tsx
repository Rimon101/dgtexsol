import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getOrderByOrderId } from "@/actions/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { CheckCircle2, Home, Clock, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful — Digital Exchange & Solution",
  robots: { index: false, follow: false },
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.order_id;
  const order = orderId ? await getOrderByOrderId(orderId) : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Payment Successful!
          </h1>
          <p className="text-sm text-muted-foreground">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        {/* Order Details */}
        {order ? (
          <div className="rounded-xl border border-border bg-card p-5 text-left space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Package className="h-4 w-4" />
              <span>Order Details</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono text-xs font-medium text-foreground">{order.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product</span>
                <span className="font-medium text-foreground">{order.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-foreground">{formatPrice(order.amount)}</span>
              </div>
              {order.trx_id && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-xs font-medium text-foreground">{order.trx_id}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  order.status === "completed"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}>
                  {order.status === "completed" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {order.status === "completed" ? "Completed" : "Processing"}
                </span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid At</span>
                  <span className="text-xs text-foreground">{formatDate(order.paid_at)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <p className="text-sm text-muted-foreground">
              {orderId
                ? "Your payment is being processed. Please check back shortly."
                : "No order information available."}
            </p>
          </div>
        )}

        {/* Action */}
        <Link
          href="/"
          className={buttonVariants({
            size: "lg",
            className: "gap-2 w-full",
          })}
        >
          <Home className="h-4 w-4" />
          <span>Back to Store</span>
        </Link>
      </div>
    </div>
  );
}

