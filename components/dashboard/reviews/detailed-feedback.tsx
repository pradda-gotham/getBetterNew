import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  ThumbsDown,
  Target,
  TrendingUp,
  MessageSquare,
  Clock,
} from "lucide-react";

interface Review {
  id: string;
  date: string;
  type: string;
  question: string;
  duration: string;
  score: number;
  status: string;
}

interface DetailedFeedbackProps {
  review: Review;
}

export function DetailedFeedback({ review }: DetailedFeedbackProps) {
  // Mock detailed feedback data
  const feedback = {
    strengths: [
      "Clear and structured response",
      "Good use of technical terminology",
      "Provided relevant examples",
    ],
    improvements: [
      "Could elaborate more on implementation details",
      "Consider discussing alternative approaches",
    ],
    communication: 90,
    technicalAccuracy: 85,
    clarity: 88,
    completeness: 82,
    keywords: ["dependency injection", "inversion of control", "SOLID principles"],
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{review.question}</h3>
            <Badge variant="outline">{review.type}</Badge>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">Strengths</h4>
              </div>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="text-sm flex items-start space-x-2">
                    <span className="text-green-500">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">Areas for Improvement</h4>
              </div>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm flex items-start space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Performance Metrics</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Communication</span>
              <span>{feedback.communication}%</span>
            </div>
            <Progress value={feedback.communication} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Technical Accuracy</span>
              <span>{feedback.technicalAccuracy}%</span>
            </div>
            <Progress value={feedback.technicalAccuracy} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Clarity</span>
              <span>{feedback.clarity}%</span>
            </div>
            <Progress value={feedback.clarity} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completeness</span>
              <span>{feedback.completeness}%</span>
            </div>
            <Progress value={feedback.completeness} />
          </div>
        </div>
      </Card>
    </div>
  );
}