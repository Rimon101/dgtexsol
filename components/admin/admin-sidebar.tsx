"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/lib/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ExternalLink,
  Store,
  User,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail?: string | null;
  className?: string;
  onNavigate?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Package,
  FolderTree,
};

export function AdminSidebar({
  userEmail,
  className,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-card border-r border-border",
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-border">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2.5 font-bold text-lg text-foreground tracking-tight"
          onClick={onNavigate}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Store className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight">Business Admin</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              Store Management
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation items */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
          Management
        </div>
        {ADMIN_NAV_ITEMS.map((item) => {
          const IconComponent = iconMap[item.icon] ?? Package;
          const isActive =
            item.href === "/admin/dashboard"
              ? pathname === "/admin/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              <IconComponent className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}

        <div className="pt-4 px-3 py-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
          Quick Links
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
        >
          <span className="flex items-center gap-3">
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span>View Public Store</span>
          </span>
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
            ↗
          </span>
        </Link>
      </div>

      {/* User & Logout section */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-foreground truncate">
              {userEmail ?? "Admin Owner"}
            </span>
            <span className="text-[10px] text-muted-foreground">Store Owner</span>
          </div>
        </div>
        <LogoutButton className="w-full justify-center" size="sm" />
      </div>
    </aside>
  );
}

