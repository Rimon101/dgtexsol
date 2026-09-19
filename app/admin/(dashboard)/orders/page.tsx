import * as React from "react";
import type { Metadata } from "next";
import { getOrders } from "@/actions/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Phone,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const completedCount = orders.filter((o) => o.status === "completed").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.amount), 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Receipt className="h-6 w-6 text-primary" />
          Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track and manage customer orders and payments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Orders</p>
          <p className="text-2xl font-bold text-foreground">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</p>
          <p className="text-2xl font-bold text-foreground">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Receipt className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No orders yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Orders will appear here when customers make purchases.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Trx ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-medium text-foreground">
                        {order.order_id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground truncate max-w-[200px]">
                          {order.product_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        {order.customer_name && (
                          <div className="flex items-center gap-1 text-foreground">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{order.customer_name}</span>
                          </div>
                        )}
                        {order.customer_phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{order.customer_phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-foreground">
                        {formatPrice(order.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          order.status === "completed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {order.status === "completed" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : order.status === "pending" ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {order.trx_id || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

