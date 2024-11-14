import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  ThumbsDown,
  Target,
  TrendingUp,
  MessageSquare,
  Waveform,
} from "lucide-react";

interface FeedbackProps {
  feedback: {
    transcript: string;
    sentiment: {
      text: string;
      sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
      confidence: number;
    }[];
    entities: {
      entity_type: string;
      text: string;
    }[];
    highlights: {
      text: string;
      rank: number;
    }[];
    feedback: {
      content: string;
      score: number;
      keyPoints: string[];
      improvements: string[];
    };
  };
}

export function FeedbackPanel({ feedback }: FeedbackProps) {
  const overallSentiment = calculateOverallSentiment(feedback.sentiment);

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Score</span>
            <span className="text-2xl font-bold">{feedback.feedback.score}%</span>
          </div>
          <Progress value={feedback.feedback.score} className="h-2" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Waveform className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Response Transcript</h4>
          </div>
          <p className="text-sm text-muted-foreground">{feedback.transcript}</p>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <ThumbsUp className="h-5 w-5 text-green-500" />
            <h4 className="font-medium">Key Points</h4>
          </div>
          <ul className="space-y-2">
            {feedback.feedback.keyPoints.map((point, index) => (
              <li key={index} className="text-sm flex items-start space-x-2">
                <span className="text-green-500">•</span>
                <span>{point}</span>
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
            {feedback.feedback.improvements.map((improvement, index) => (
              <li key={index} className="text-sm flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-purple-500" />
            <h4 className="font-medium">Key Topics Mentioned</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {feedback.entities.map((entity, index) => (
              <Badge key={index} variant="secondary">
                {entity.text}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            <h4 className="font-medium">Sentiment Analysis</h4>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(overallSentiment).map(([sentiment, percentage]) => (
              <div key={sentiment} className="text-center">
                <div className="text-sm font-medium">{sentiment}</div>
                <div className="text-2xl font-bold">{percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function calculateOverallSentiment(sentiments: FeedbackProps["feedback"]["sentiment"]) {
  const total = sentiments.length;
  const counts = sentiments.reduce(
    (acc, curr) => {
      acc[curr.sentiment]++;
      return acc;
    },
    { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 }
  );

  return {
    Positive: Math.round((counts.POSITIVE / total) * 100),
    Negative: Math.round((counts.NEGATIVE / total) * 100),
    Neutral: Math.round((counts.NEUTRAL / total) * 100),
  };
}