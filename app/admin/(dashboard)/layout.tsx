import * as React from "react";
import type { Metadata } from "next";
import { getSessionUser } from "@/actions/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile top header with drawer toggle */}
      <AdminHeader userEmail={user?.email} />

      {/* Desktop fixed sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
        <AdminSidebar userEmail={user?.email} />
      </div>

      {/* Main content body */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

