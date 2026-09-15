import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/actions/auth";

export const metadata: Metadata = {
  title: "Connection Diagnostic",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestPage() {
  const user = await getSessionUser();
  if (!user) {
    notFound();
  }

  let serverStatus: "success" | "error" = "error";
  let serverMessage = "";
  let adminStatus: "success" | "error" = "error";
  let adminMessage = "";
  let tablesExist = false;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "not set";

  // 1. Test Server (Anon) client querying products table
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").select("id").limit(1);

    if (!error) {
      serverStatus = "success";
      tablesExist = true;
      serverMessage = `Connected & queried products table successfully (${data?.length ?? 0} rows found)`;
    } else if (
      error.code === "42P01" ||
      error.message.includes("does not exist") ||
      error.message.includes("schema cache")
    ) {
      serverStatus = "success";
      tablesExist = false;
      serverMessage = "Connection active, but 'products' table not created in database yet.";
    } else {
      serverMessage = error.message;
    }
  } catch (e) {
    serverMessage = e instanceof Error ? e.message : "Unknown error";
  }

  // 2. Test Admin client querying categories table
  try {
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase.from("categories").select("id").limit(1);

    if (!error) {
      adminStatus = "success";
      adminMessage = `Admin client connected & queried categories table (${data?.length ?? 0} rows found)`;
    } else if (
      error.code === "42P01" ||
      error.message.includes("does not exist") ||
      error.message.includes("schema cache")
    ) {
      adminStatus = "success";
      adminMessage = "Admin connection active, but 'categories' table not created yet.";
    } else {
      adminMessage = error.message;
    }
  } catch (e) {
    adminMessage = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-xl w-full space-y-6 text-center">
        <h1 className="text-2xl font-bold">Phase 3 — Database & Schema Status</h1>

        <div className="space-y-4 text-left">
          {/* Schema Migration Status */}
          <div
            className={`p-4 rounded-lg border-2 ${
              tablesExist
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : "border-amber-500 bg-amber-50 text-amber-900"
            }`}
          >
            <p className="font-semibold text-base">
              {tablesExist
                ? "✅ Database Tables (categories & products) Active"
                : "⚠️ Schema Migration Pending in Supabase"}
            </p>
            <p className="mt-1 text-sm">
              {tablesExist
                ? "Both tables are active and responding to PostgREST queries."
                : "Run the SQL in supabase/migrations/001_initial_schema.sql in your Supabase SQL Editor."}
            </p>
          </div>

          {/* Server client */}
          <div
            className={`p-4 rounded-lg border ${
              serverStatus === "success"
                ? "border-border bg-card text-card-foreground"
                : "border-destructive bg-destructive/10 text-destructive"
            }`}
          >
            <p className="font-medium text-sm">Public / Server Client (Anon)</p>
            <p className="mt-1 text-xs text-muted-foreground">{serverMessage}</p>
          </div>

          {/* Admin client */}
          <div
            className={`p-4 rounded-lg border ${
              adminStatus === "success"
                ? "border-border bg-card text-card-foreground"
                : "border-destructive bg-destructive/10 text-destructive"
            }`}
          >
            <p className="font-medium text-sm">Admin Client (Service Role)</p>
            <p className="mt-1 text-xs text-muted-foreground">{adminMessage}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Connected Project: <code className="font-mono">{supabaseUrl}</code>
        </p>
      </div>
    </main>
  );
}
