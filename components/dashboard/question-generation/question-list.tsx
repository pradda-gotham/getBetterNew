"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, Star } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  expectedPoints: string[];
  followUpQuestions: string[];
}

interface QuestionListProps {
  questions: Question[];
  selectedId?: string;
  onSelect: (question: Question) => void;
}

export function QuestionList({ questions, selectedId, onSelect }: QuestionListProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card
          key={question.id}
          className={cn(
            "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
            selectedId === question.id && "border-primary"
          )}
          onClick={() => onSelect(question)}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="capitalize">
                {question.type}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className={`h-4 w-4 ${getDifficultyColor(question.difficulty)}`} />
                <span className={`text-sm ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </div>
            </div>
            <p className="font-medium line-clamp-2">{question.question}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{question.expectedPoints.length} key points</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}</content>