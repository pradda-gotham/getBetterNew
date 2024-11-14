import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface TopicData {
  topic: string;
  averageScore: number;
  count: number;
}

interface TopicAnalysisProps {
  data: TopicData[];
}

export function TopicAnalysis({ data }: TopicAnalysisProps) {
  return (
    <div className="space-y-4">
      {data.map((topic) => (
        <div key={topic.topic} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{topic.topic}</span>
              <Badge variant="outline">{topic.count} sessions</Badge>
            </div>
            <span className="text-sm font-medium">{topic.averageScore}%</span>
          </div>
          <Progress value={topic.averageScore} className="h-2" />
        </div>
      ))}
    </div>
  );
}