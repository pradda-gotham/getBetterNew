import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
}

export function MetricCard({ title, value, change, trend }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold">{value}</h3>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {change}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}