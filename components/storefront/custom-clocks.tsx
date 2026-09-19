"use client";

import * as React from "react";
import { CustomClockItem } from "@/actions/custom-clocks";
import { Clock, X, MessageCircle, ExternalLink } from "lucide-react";

interface CustomClocksSectionProps {
  clocks: CustomClockItem[];
}

const WHATSAPP_NUMBER = "+8801990253414";
const WHATSAPP_URL = "https://wa.me/8801990253414";

export function CustomClocksSection({ clocks }: CustomClocksSectionProps) {
  const [selectedClock, setSelectedClock] = React.useState<CustomClockItem | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedClock(null);
    };
    if (selectedClock) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedClock]);

  return (
    <section id="custom-clocks" className="py-16 scroll-mt-16 border-t border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Special Collection</span>
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Custom Clocks
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse our unique custom clocks. Click any design to order directly via WhatsApp.
            </p>
          </div>
        </div>

        {/* Clocks Grid */}
        {clocks.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-card px-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Clock className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              New Custom Clocks Coming Soon
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              We are updating our custom clock catalog with handcrafted designs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {clocks.map((clock) => (
              <div
                key={clock.id}
                onClick={() => setSelectedClock(clock)}
                className="group relative flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-border cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full bg-muted/40 overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={clock.image_url}
                    alt={clock.title || "Custom Clock"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/95 text-foreground text-xs font-semibold shadow-md backdrop-blur-xs">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Order on WhatsApp</span>
                    </span>
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-3 flex items-center justify-between border-t border-border/50">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {clock.title || "Custom Clock Design"}
                  </p>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                    WhatsApp Order
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clock Details Modal */}
      {selectedClock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedClock(null)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedClock(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-background/80 backdrop-blur-xs border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="overflow-y-auto p-6 space-y-5">
              {/* Image Preview */}
              <div className="relative aspect-square w-full rounded-xl bg-muted border border-border overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedClock.image_url}
                  alt={selectedClock.title || "Custom Clock"}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Title if provided */}
              {selectedClock.title && (
                <h3 className="text-lg font-bold text-foreground text-center">
                  {selectedClock.title}
                </h3>
              )}

              {/* WhatsApp Order Notice Box */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-3">
                <p className="text-sm sm:text-base font-medium text-emerald-950 dark:text-emerald-200 leading-relaxed">
                  এই ঘড়িটি অর্ডার করতে এই হোয়াটসঅ্যাপ(
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors"
                  >
                    {WHATSAPP_NUMBER}
                  </a>
                  ) এ যোগাযোগ করুন
                </p>

                {/* Direct WhatsApp Action Button */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp-এ মেসেজ পাঠান (+8801990253414)</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

