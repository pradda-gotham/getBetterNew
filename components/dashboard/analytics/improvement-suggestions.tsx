import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";

export function ImprovementSuggestions() {
  const suggestions = [
    {
      title: "Practice Technical Questions",
      description:
        "Focus on system design and algorithm questions to improve technical scores.",
      action: "Start Practice",
      href: "/dashboard/practice",
    },
    {
      title: "Review Past Interviews",
      description:
        "Analyze your previous responses to identify patterns and areas for improvement.",
      action: "View History",
      href: "/dashboard/analytics?tab=history",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {suggestions.map((suggestion, index) => (
        <Card key={index} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{suggestion.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {suggestion.description}
            </p>
            <Link href={suggestion.href}>
              <Button className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                {suggestion.action}
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}