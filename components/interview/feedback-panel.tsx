"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  ExternalLink,
  Clock,
  PlayCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

interface FeedbackPanelProps {
  feedback: {
    suggestions: string[];
    nextSteps: string[];
    resources: {
      title: string;
      url: string;
      type: string;
    }[];
    practiceExercises: {
      title: string;
      description: string;
      duration: string;
    }[];
  };
}

export function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Personalized Feedback</h3>
          <div className="space-y-2">
            {feedback.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Lightbulb className="h-4 w-4 text-primary mt-1" />
                <span className="text-sm">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Next Steps</h4>
          <div className="space-y-2">
            {feedback.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-2">
                <ArrowRight className="h-4 w-4 text-blue-500 mt-1" />
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Recommended Resources</h4>
          <div className="grid gap-4 md:grid-cols-2">
            {feedback.resources.map((resource, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start space-x-4">
                  {resource.type === "documentation" ? (
                    <Book className="h-5 w-5 text-primary" />
                  ) : resource.type === "video" ? (
                    <PlayCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Book className="h-5 w-5 text-primary" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{resource.title}</h5>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-2"
                      onClick={() => window.open(resource.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Resource
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Practice Exercises</h4>
          <div className="space-y-4">
            {feedback.practiceExercises.map((exercise, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{exercise.title}</h5>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {exercise.duration}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {exercise.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}