import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Target,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface JobMatchScoreProps {
  analysis: {
    overallMatch: number;
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    missingSkills: string[];
  };
}

export function JobMatchScore({ analysis }: JobMatchScoreProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Overall Match</h3>
            </div>
            <span className="text-2xl font-bold">{analysis.overallMatch}%</span>
          </div>
          <Progress value={analysis.overallMatch} className="h-2" />
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Skills Match</span>
              <span>{analysis.skillsMatch}%</span>
            </div>
            <Progress value={analysis.skillsMatch} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Experience Match</span>
              <span>{analysis.experienceMatch}%</span>
            </div>
            <Progress value={analysis.experienceMatch} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Education Match</span>
              <span>{analysis.educationMatch}%</span>
            </div>
            <Progress value={analysis.educationMatch} className="h-1.5" />
          </div>
        </div>

        {analysis.missingSkills.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Missing Skills</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {analysis.missingSkills.join(", ")}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}