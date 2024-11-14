"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Waveform,
} from "lucide-react";

interface InterviewFeedbackProps {
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
    analysis: {
      score: number;
      keyPoints: string[];
      strengths: string[];
      improvements: string[];
    };
    metrics: {
      clarity: number;
      relevance: number;
      confidence: number;
      completeness: number;
    };
  };
}

export function InterviewFeedback({ feedback }: InterviewFeedbackProps) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Analysis</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Score</span>
              <span className="text-2xl font-bold">{feedback.analysis.score}%</span>
            </div>
            <Progress value={feedback.analysis.score} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Clarity</label>
              <Progress value={feedback.metrics.clarity} className="h-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Relevance</label>
              <Progress value={feedback.metrics.relevance} className="h-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confidence</label>
              <Progress value={feedback.metrics.confidence} className="h-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Completeness</label>
              <Progress value={feedback.metrics.completeness} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <h4 className="font-medium">Strengths</h4>
          </div>
          <ul className="space-y-1">
            {feedback.analysis.strengths.map((strength, index) => (
              <li key={index} className="text-sm flex items-start space-x-2">
                <span className="text-green-500">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <h4 className="font-medium">Areas for Improvement</h4>
          </div>
          <ul className="space-y-1">
            {feedback.analysis.improvements.map((improvement, index) => (
              <li key={index} className="text-sm flex items-start space-x-2">
                <span className="text-yellow-500">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <h4 className="font-medium">Key Points Covered</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {feedback.analysis.keyPoints.map((point, index) => (
              <Badge key={index} variant="secondary">
                {point}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Waveform className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Transcript</h4>
          </div>
          <p className="text-sm text-muted-foreground">{feedback.transcript}</p>
        </div>
      </div>
    </Card>
  );
}