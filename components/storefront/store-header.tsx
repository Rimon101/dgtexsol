"use client";

import * as React from "react";
import Link from "next/link";
import { Smartphone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StoreHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Smartphone className="h-5 w-5" />
          </div>
          <span className="text-foreground">Digital Exchange</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#custom-clocks" className="hover:text-foreground transition-colors">
            Custom Clocks
          </Link>
          <Link href="#catalog" className="hover:text-foreground transition-colors">
            Our Products
          </Link>
          <Link href="#about" className="hover:text-foreground transition-colors">
            About Us
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
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
            href="#custom-clocks"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
          >
            Custom Clocks
          </Link>
          <Link
            href="#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
          >
            Our Products
          </Link>
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
          >
            About Us
          </Link>
        </div>
      )}
    </header>
  );
}
