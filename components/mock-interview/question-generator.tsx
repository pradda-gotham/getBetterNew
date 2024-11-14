import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";

interface QuestionGeneratorProps {
  onGenerate: () => void;
  isLoading: boolean;
}

export function QuestionGenerator({ onGenerate, isLoading }: QuestionGeneratorProps) {
  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <Brain className="h-12 w-12 text-primary mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">Generate Next Question</h3>
          <p className="text-sm text-muted-foreground mt-1">
            AI will analyze your previous responses to generate a relevant follow-up question.
          </p>
        </div>
        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Question...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Generate Question
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}