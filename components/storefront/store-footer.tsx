import * as React from "react";
import Link from "next/link";
import { Smartphone, Shield, Heart } from "lucide-react";

export function StoreFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="about" className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Smartphone className="h-4 w-4" />
              </div>
              <span className="text-foreground">Digital Exchange &amp; Solution</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Your trusted partner for phone sales, exchanges, expert repairs, and electrical solutions. We provide quality devices and reliable service you can count on.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-foreground tracking-wide">Our Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#catalog" className="hover:text-foreground transition-colors">
                  Phone Sales &amp; Exchange
                </Link>
              </li>
              <li>
                <Link href="#catalog" className="hover:text-foreground transition-colors">
                  Phone &amp; Electrical Repair
                </Link>
              </li>
              <li>
                <Link href="#catalog" className="hover:text-foreground transition-colors">
                  Accessories &amp; Parts
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Management */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-foreground tracking-wide">Management</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-medium text-primary"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin Dashboard</span>
                </Link>
              </li>
              <li>
                <span className="text-xs text-muted-foreground">
                  Store Owner Portal
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {currentYear} Digital Exchange &amp; Solution. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>for our customers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
