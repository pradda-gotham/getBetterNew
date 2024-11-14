"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Brain,
  Loader2,
  Settings,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface QuestionGeneratorProps {
  resumeData: any;
  jobData: any;
  onQuestionsGenerated: (questions: any[]) => void;
}

export function QuestionGenerator({
  resumeData,
  jobData,
  onQuestionsGenerated,
}: QuestionGeneratorProps) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateQuestions = async () => {
    setGenerating(true);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          jobData,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) throw new Error("Failed to generate questions");
      const data = await response.json();
      
      setProgress(100);
      onQuestionsGenerated(data.questions);

      toast({
        title: "Questions Generated",
        description: "AI has generated personalized interview questions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Question Generator</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateQuestions}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Generate Questions
              </>
            )}
          </Button>
        </div>

        {generating && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Generating questions...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Analyzing profile and job requirements</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Calibrating difficulty levels</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                {progress > 50 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>Generating personalized questions</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                {progress > 75 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>Finalizing question set</span>
              </div>
            </div>
          </div>
        )}

        {!generating && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge variant="outline">Profile Analysis</Badge>
              <p className="text-sm text-muted-foreground">
                Experience: {resumeData.experience}
              </p>
              <p className="text-sm text-muted-foreground">
                Skills: {resumeData.skills.slice(0, 3).join(", ")}...
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">Job Requirements</Badge>
              <p className="text-sm text-muted-foreground">
                Role: {jobData.title}
              </p>
              <p className="text-sm text-muted-foreground">
                Level: {jobData.level}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}