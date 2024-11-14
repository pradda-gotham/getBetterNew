import { Card } from "@/components/ui/card";
import {
  Briefcase,
  Send,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";

export function JobStats() {
  const stats = [
    {
      label: "Total Applications",
      value: "12",
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      label: "Applied",
      value: "5",
      icon: Send,
      color: "text-green-500",
    },
    {
      label: "Interviewing",
      value: "3",
      icon: MessageSquare,
      color: "text-yellow-500",
    },
    {
      label: "Offers",
      value: "1",
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      label: "Rejected",
      value: "3",
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center space-x-4">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}