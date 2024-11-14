import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  type: string;
  question: string;
}

interface AIInsightsProps {
  review: Review;
}

export function AIInsights({ review }: AIInsightsProps) {
  // Mock AI insights data
  const insights = {
    keyTakeaways: [
      "Strong understanding of dependency injection principles",
      "Good balance of theoretical knowledge and practical examples",
      "Clear communication of technical concepts",
    ],
    suggestedTopics: [
      "Dependency Injection Containers",
      "Service Lifetimes",
      "Testing with Mocked Dependencies",
    ],
    communicationPatterns: {
      positives: [
        "Structured response format",
        "Effective use of examples",
        "Clear technical explanations",
      ],
      improvements: [
        "Could use more industry-specific examples",
        "Consider adding performance implications",
      ],
    },
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Key Takeaways</h3>
        </div>
        <ul className="space-y-2">
          {insights.keyTakeaways.map((takeaway, index) => (
            <li key={index} className="text-sm flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Suggested Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {insights.suggestedTopics.map((topic, index) => (
            <Badge key={index} variant="secondary">
              {topic}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Communication Analysis</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2 text-green-500">Effective Patterns</h4>
            <ul className="space-y-2">
              {insights.communicationPatterns.positives.map((positive, index) => (
                <li key={index} className="text-sm flex items-start space-x-2">
                  <span className="text-green-500">•</span>
                  <span>{positive}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-blue-500">Suggestions</h4>
            <ul className="space-y-2">
              {insights.communicationPatterns.improvements.map((improvement, index) => (
                <li key={index} className="text-sm flex items-start space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}