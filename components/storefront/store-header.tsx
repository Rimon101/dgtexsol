"use client";

import * as React from "react";
import Link from "next/link";
import { Store, Shield, Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export function StoreHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-foreground">Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#catalog" className="hover:text-foreground transition-colors">
            All Products
          </Link>
          <Link href="#featured" className="hover:text-foreground transition-colors">
            Featured
          </Link>
          <Link href="#about" className="hover:text-foreground transition-colors">
            About
          </Link>
        </nav>

        {/* Right side Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "text-xs gap-1.5",
            })}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/admin"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
              className: "h-9 w-9",
            })}
            aria-label="Admin Portal"
          >
            <Shield className="h-4 w-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="h-9 w-9"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <Link
            href="#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
          >
            All Products
          </Link>
          <Link
            href="#featured"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
          >
            Featured Items
          </Link>
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
          >
            About Business
          </Link>
          <div className="pt-2 border-t border-border">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "w-full justify-center gap-2",
              })}
            >
              <Shield className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
