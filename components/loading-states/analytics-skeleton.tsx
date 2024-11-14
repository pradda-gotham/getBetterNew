import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-lg border">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-lg border">
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="p-6 rounded-lg border">
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  );
}