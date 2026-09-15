import type { Metadata } from "next";
import { getDashboardData } from "@/actions/dashboard";
import { DashboardOverview } from "@/components/admin/dashboard-stats";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const { stats, recentProducts } = await getDashboardData();

  return <DashboardOverview stats={stats} recentProducts={recentProducts} />;
}

