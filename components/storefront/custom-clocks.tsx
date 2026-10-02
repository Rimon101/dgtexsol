"use client";

import * as React from "react";
import { CustomClockItem } from "@/actions/custom-clocks";
import { X, MessageCircle, ExternalLink } from "lucide-react";

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

  if (clocks.length === 0) return null;

  return (
    <section id="custom-clocks" className="py-12 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Heading */}
        <h2 className="text-2xl font-bold text-foreground">Custom Clocks</h2>

        {/* Clocks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {clocks.map((clock) => (
            <div
              key={clock.id}
              onClick={() => setSelectedClock(clock)}
              className="group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="aspect-square w-full bg-muted/30 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clock.image_url}
                  alt={clock.title || "Custom Clock"}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              {clock.title && (
                <div className="p-2">
                  <p className="text-xs font-medium text-foreground truncate">{clock.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedClock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0"
            onClick={() => setSelectedClock(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md rounded-xl bg-card border border-border shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            <button
              type="button"
              onClick={() => setSelectedClock(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-background/80 border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="overflow-y-auto p-5 space-y-4">
              <div className="aspect-square w-full rounded-lg bg-muted overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedClock.image_url}
                  alt={selectedClock.title || "Custom Clock"}
                  className="h-full w-full object-contain"
                />
              </div>

              {selectedClock.title && (
                <p className="text-base font-semibold text-foreground text-center">
                  {selectedClock.title}
                </p>
              )}

              {/* WhatsApp Order */}
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-3">
                <p className="text-sm font-medium text-emerald-950 dark:text-emerald-200 leading-relaxed">
                  এই ঘড়িটি অর্ডার করতে এই হোয়াটসঅ্যাপ(
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-emerald-700 dark:text-emerald-400"
                  >
                    {WHATSAPP_NUMBER}
                  </a>
                  ) এ যোগাযোগ করুন
                </p>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp-এ মেসেজ পাঠান</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
