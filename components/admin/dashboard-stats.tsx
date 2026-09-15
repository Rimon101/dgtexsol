import * as React from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import type { DashboardStats, RecentProduct } from "@/actions/dashboard";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  Plus,
  ExternalLink,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

interface DashboardOverviewProps {
  stats: DashboardStats;
  recentProducts: RecentProduct[];
}

export function DashboardOverview({
  stats,
  recentProducts,
}: DashboardOverviewProps) {
  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: `${stats.inactiveProducts} inactive / draft`,
      icon: Package,
      iconColor: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
      href: "/admin/products",
    },
    {
      title: "Active on Website",
      value: stats.activeProducts,
      description: "Visible to public visitors",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
      href: "/admin/products",
    },
    {
      title: "Sold Out Items",
      value: stats.soldOutProducts,
      description: "Marked as unavailable",
      icon: AlertCircle,
      iconColor: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
      href: "/admin/products",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      description: "Organizing store catalog",
      icon: FolderTree,
      iconColor: "text-purple-600 bg-purple-100 dark:bg-purple-950 dark:text-purple-400",
      href: "/admin/categories",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Heading & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Store Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage your products, availability, and catalog categories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Add Product</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <span>View Store</span>
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="relative overflow-hidden hover:shadow-md transition-shadow border-border/70"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-foreground">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  className="mt-3 inline-flex items-center text-xs text-primary hover:underline font-medium"
                >
                  <span>View all</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Products Section */}
      <Card className="border-border/70">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Products</CardTitle>
            <CardDescription>
              Latest items added to your catalog
            </CardDescription>
          </div>
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <span>See all products</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentProducts.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed rounded-lg bg-muted/20">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                No products yet
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Get started by creating your first product to display on your landing page.
              </p>
              <div className="mt-4">
                <Link
                  href="/admin/products/new"
                  className={buttonVariants({ size: "sm" })}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span>Add First Product</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between py-3.5 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-md bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                      {prod.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prod.image_url}
                          alt={prod.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {prod.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Added {formatDate(prod.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold text-sm">
                      {formatPrice(prod.price)}
                    </span>

                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        prod.is_active
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {prod.is_active ? "Active" : "Inactive"}
                    </span>

                    {prod.is_sold_out && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Sold Out
                      </span>
                    )}

                    <Link
                      href={`/admin/products/${prod.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
