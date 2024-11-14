import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface ImprovementData {
  date: string;
  improvements: string[];
  strengths: string[];
}

interface ImprovementTrackingProps {
  data: ImprovementData[];
}

export function ImprovementTracking({ data }: ImprovementTrackingProps) {
  const recentSession = data[data.length - 1];
  const previousSession = data[data.length - 2];

  const newStrengths = recentSession?.strengths.filter(
    strength => !previousSession?.strengths.includes(strength)
  );

  const resolvedImprovements = previousSession?.improvements.filter(
    improvement => !recentSession?.improvements.includes(improvement)
  );

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <h4 className="font-medium">New Strengths</h4>
          </div>
          <div className="space-y-2">
            {newStrengths?.map((strength, index) => (
              <Card key={index} className="p-2">
                <p className="text-sm">{strength}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <h4 className="font-medium">Current Focus Areas</h4>
          </div>
          <div className="space-y-2">
            {recentSession?.improvements.map((improvement, index) => (
              <Card key={index} className="p-2">
                <p className="text-sm">{improvement}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <h4 className="font-medium">Resolved Improvements</h4>
          </div>
          <div className="space-y-2">
            {resolvedImprovements?.map((improvement, index) => (
              <Card key={index} className="p-2">
                <p className="text-sm">{improvement}</p>
                <Badge className="mt-1" variant="outline">
                  Resolved
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}