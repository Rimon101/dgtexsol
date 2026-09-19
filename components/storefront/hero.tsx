import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowDown, Smartphone, Wrench, ShieldCheck, Repeat } from "lucide-react";

interface HeroProps {
  productCount: number;
}

export function Hero({ productCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-radial-[at_top_center] from-primary/10 via-background to-background py-20 sm:py-28 border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium">
          <Smartphone className="h-3.5 w-3.5" />
          <span>Digital Exchange &amp; Solution • {productCount} {productCount === 1 ? "Product" : "Products"} Available</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="#catalog"
            className={buttonVariants({
              size: "lg",
              className: "gap-2 shadow-md hover:shadow-lg transition-all",
            })}
          >
            <span>Our Products</span>
            <ArrowDown className="h-4 w-4" />
          </Link>

          <Link
            href="#custom-clocks"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "gap-2",
            })}
          >
            <span>Custom Clocks</span>
            <ArrowDown className="h-4 w-4" />
          </Link>
        </div>

        {/* Feature badges */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/70 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Expert Repairs</p>
              <p className="text-[11px] text-muted-foreground">Phones &amp; electrical</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/70 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Repeat className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Buy, Sell &amp; Exchange</p>
              <p className="text-[11px] text-muted-foreground">Best trade-in deals</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/70 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Trusted Service</p>
              <p className="text-[11px] text-muted-foreground">Quality guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
