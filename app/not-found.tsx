import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Home, PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
      <div className="max-w-md w-full space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <PackageX className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground">
            Sorry, we couldn&apos;t find the product or page you were looking for. It may have been moved, renamed, or deleted.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "gap-2",
            })}
          >
            <Home className="h-4 w-4" />
            <span>Return to Store</span>
          </Link>

          <Link
            href="/admin/dashboard"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "gap-2",
            })}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

