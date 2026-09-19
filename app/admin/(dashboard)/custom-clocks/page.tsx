import * as React from "react";
import type { Metadata } from "next";
import { getAdminCustomClocks } from "@/actions/custom-clocks";
import { CustomClocksManager } from "@/components/admin/custom-clocks-manager";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Clocks",
  robots: { index: false, follow: false },
};

export default async function AdminCustomClocksPage() {
  const clocks = await getAdminCustomClocks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Custom Clocks
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload and manage clock photos displayed in the Custom Clocks showcase on your storefront.
        </p>
      </div>

      <CustomClocksManager initialClocks={clocks} />
    </div>
  );
}
