"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageSquare, Star } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  expectedPoints: string[];
  followUpQuestions: string[];
}

interface QuestionDetailsProps {
  question: Question;
  onPractice: (question: Question) => void;
}

export function QuestionDetails({ question, onPractice }: QuestionDetailsProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {question.type}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {question.difficulty}
          </Badge>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium flex items-center mb-2">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Key Points to Address
              </h4>
              <ul className="space-y-2">
                {question.expectedPoints.map((point, index) => (
                  <li key={index} className="text-sm flex items-start space-x-2">
                    <span className="text-green-500">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium flex items-center mb-2">
                <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                Follow-up Questions
              </h4>
              <ul className="space-y-2">
                {question.followUpQuestions.map((followUp, index) => (
                  <li key={index} className="text-sm flex items-start space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>{followUp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={() => onPractice(question)}>
        Practice This Question
      </Button>
    </Card>
  );
}</content>