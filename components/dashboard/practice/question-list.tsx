import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string;
}

interface QuestionListProps {
  questions: Question[];
  onSelect: (question: Question) => void;
  activeId?: string;
}

export function QuestionList({ questions, onSelect, activeId }: QuestionListProps) {
  return (
    <div className="space-y-2">
      {questions.map((question) => (
        <Card
          key={question.id}
          className={cn(
            "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
            activeId === question.id && "border-primary"
          )}
          onClick={() => onSelect(question)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium line-clamp-2">{question.question}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)} · {question.category}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
}