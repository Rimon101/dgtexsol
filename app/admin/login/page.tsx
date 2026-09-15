import * as React from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <React.Suspense
        fallback={
          <div className="w-full max-w-md h-96 rounded-xl border border-border/60 bg-card animate-pulse" />
        }
      >
        <LoginForm />
      </React.Suspense>
    </main>
  );
}

