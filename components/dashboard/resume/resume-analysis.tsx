import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Lightbulb, Award, AlertTriangle } from "lucide-react";

interface ResumeAnalysisProps {
  analysis: {
    skills: string[];
    experience: string;
    recommendations: string[];
  };
}

export function ResumeAnalysis({ analysis }: ResumeAnalysisProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">AI Analysis Results</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Skills Identified</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Experience Level</h4>
          </div>
          <p className="text-2xl font-bold">{analysis.experience}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Recommendations</h4>
        </div>
        <ul className="space-y-2">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span className="text-sm">{recommendation}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}