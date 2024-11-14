import { AnalyticsSkeleton } from "@/components/loading-states/analytics-skeleton";

export default function Loading() {
  return (
    <div className="container-responsive py-8">
      <AnalyticsSkeleton />
    </div>
  );
}