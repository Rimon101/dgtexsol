"use server";

import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  soldOutProducts: number;
  totalCategories: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export interface RecentProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  is_active: boolean;
  is_sold_out: boolean;
  image_url: string | null;
  created_at: string;
}

/**
 * Server action to fetch overview statistics and recent products for the admin dashboard.
 */
export async function getDashboardData(): Promise<{
  stats: DashboardStats;
  recentProducts: RecentProduct[];
}> {
  const supabase = await createClient();

  // Run count queries in parallel for efficiency
  const [
    totalProductsRes,
    activeProductsRes,
    soldOutProductsRes,
    categoriesRes,
    recentProductsRes,
    ordersRes,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_sold_out", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id, name, slug, price, is_active, is_sold_out, image_url, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("orders").select("status, amount"),
  ]);

  const total = totalProductsRes.count ?? 0;
  const active = activeProductsRes.count ?? 0;
  const soldOut = soldOutProductsRes.count ?? 0;
  const inactive = Math.max(0, total - active);
  const categoriesCount = categoriesRes.count ?? 0;

  // Order stats
  const orders = ordersRes.data ?? [];
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.amount), 0);

  return {
    stats: {
      totalProducts: total,
      activeProducts: active,
      inactiveProducts: inactive,
      soldOutProducts: soldOut,
      totalCategories: categoriesCount,
      totalOrders,
      completedOrders,
      totalRevenue,
    },
    recentProducts: (recentProductsRes.data as RecentProduct[]) ?? [],
  };
}

