import { Skeleton } from "@/components/ui/skeleton";

export default function StoreLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-border/60 px-4 sm:px-8 flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      {/* Hero Skeleton */}
      <div className="py-20 text-center max-w-4xl mx-auto px-4 space-y-6 flex flex-col items-center">
        <Skeleton className="h-6 w-48 rounded-full" />
        <Skeleton className="h-14 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-md" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-11 w-36 rounded-lg" />
          <Skeleton className="h-11 w-36 rounded-lg" />
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border p-4 space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="pt-2 border-t border-border flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

