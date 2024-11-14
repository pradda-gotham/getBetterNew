"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Brain, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuestionGenerationStepProps {
  resumeData: any;
  jobData: any;
  onComplete: (questions: any[]) => void;
}

export function QuestionGenerationStep({
  resumeData,
  jobData,
  onComplete,
}: QuestionGenerationStepProps) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  const generateQuestions = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          jobData,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate questions");
      const data = await response.json();
      setQuestions(data.questions);
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
    <div className="space-y-6">
      {questions.length === 0 ? (
        <div className="text-center space-y-4">
          <Brain className="h-12 w-12 text-primary mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Generate Interview Questions</h3>
            <p className="text-sm text-muted-foreground mt-1">
              AI will analyze your resume and the job requirements to generate relevant questions.
            </p>
          </div>
          <Button
            onClick={generateQuestions}
            disabled={generating}
            className="w-full max-w-sm"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Questions
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">
            {questions.map((question, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge>{question.type}</Badge>
                    <Badge variant="outline">
                      {question.difficulty}
                    </Badge>
                  </div>
                  <p className="font-medium">{question.question}</p>
                  {question.expectedPoints && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Key points to address:</p>
                      <ul className="list-disc list-inside">
                        {question.expectedPoints.map((point: string, i: number) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onComplete(questions)}>
              Start Practice
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}