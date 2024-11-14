import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock } from "lucide-react";

interface Interview {
  id: number;
  type: string;
  date: string;
  duration: string;
  score: number;
  strengths: string[];
  improvements: string[];
}

interface InterviewHistoryProps {
  interviews: Interview[];
}

export function InterviewHistory({ interviews }: InterviewHistoryProps) {
  return (
    <div className="space-y-4">
      {interviews.map((interview) => (
        <Card key={interview.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge>{interview.type}</Badge>
                <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {interview.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {interview.duration}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{interview.score}%</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
            </div>

            <Progress value={interview.score} className="h-2" />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {interview.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="text-sm flex items-start space-x-2"
                    >
                      <span className="text-green-500">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Areas for Improvement</h4>
                <ul className="space-y-1">
                  {interview.improvements.map((improvement, index) => (
                    <li
                      key={index}
                      className="text-sm flex items-start space-x-2"
                    >
                      <span className="text-blue-500">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}