import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic } from "lucide-react";

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string;
}

interface InterviewQuestionProps {
  question: Question;
  isRecording: boolean;
}

export function InterviewQuestion({ question, isRecording }: InterviewQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Badge>{question.category}</Badge>
          <Badge variant="outline">{question.difficulty}</Badge>
        </div>
        {isRecording && (
          <div className="flex items-center text-red-500">
            <Mic className="h-4 w-4 mr-1" />
            <span className="text-sm">Recording</span>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold">{question.question}</h3>
      <div className="text-sm text-muted-foreground">
        <p>Tips:</p>
        <ul className="list-disc list-inside">
          <li>Structure your answer using the STAR method</li>
          <li>Provide specific examples</li>
          <li>Keep your response under 2-3 minutes</li>
        </ul>
      </div>
    </div>
  );
}