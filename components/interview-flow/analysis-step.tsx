"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Download,
} from "lucide-react";

interface AnalysisStepProps {
  flowData: any;
  onComplete: () => void;
}

export function AnalysisStep({ flowData, onComplete }: AnalysisStepProps) {
  const overallScore = calculateOverallScore(flowData.responses);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{overallScore}%</h3>
              <p className="text-sm text-muted-foreground">Overall Performance</p>
            </div>
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <Progress value={overallScore} className="h-2" />
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {flowData.responses.map((response: any, index: number) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge>Question {index + 1}</Badge>
                <span className="text-2xl font-bold">
                  {response.analysis.score}%
                </span>
              </div>

              <div>
                <h4 className="font-medium mb-2">Strengths</h4>
                <div className="space-y-2">
                  {response.analysis.strengths.map((strength: string, i: number) => (
                    <div key={i} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Areas for Improvement</h4>
                <div className="space-y-2">
                  {response.analysis.improvements.map((improvement: string, i: number) => (
                    <div key={i} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1" />
                      <span className="text-sm">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        <Button onClick={onComplete}>
          <TrendingUp className="mr-2 h-4 w-4" />
          View Detailed Analytics
        </Button>
      </div>
    </div>
  );
}

function calculateOverallScore(responses: any[]): number {
  if (!responses.length) return 0;
  const total = responses.reduce(
    (sum, response) => sum + response.analysis.score,
    0
  );
  return Math.round(total / responses.length);
}