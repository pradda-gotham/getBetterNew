import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Target,
} from "lucide-react";

interface JobMatchAnalysisProps {
  analysis: {
    matchingSkills: string[];
    missingSkills: string[];
    recommendations: string[];
    keyRequirements: string[];
    strengthAreas: string[];
    developmentAreas: string[];
  };
}

export function JobMatchAnalysis({ analysis }: JobMatchAnalysisProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Key Requirements</h3>
        </div>
        <div className="space-y-4">
          {analysis.keyRequirements.map((req, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
              <span className="text-sm">{req}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h3 className="font-semibold">Matching Skills</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.matchingSkills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-green-500/10">
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold">Areas for Development</h3>
        </div>
        <div className="space-y-2">
          {analysis.developmentAreas.map((area, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-yellow-500">•</span>
              <span className="text-sm">{area}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Recommendations</h3>
        </div>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <span className="text-sm">{rec}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}