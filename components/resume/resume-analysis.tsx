"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Briefcase,
  GraduationCap,
  Code,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

interface ResumeAnalysisProps {
  analysis: {
    skills: string[];
    experience: {
      title: string;
      details: string;
    }[];
    education: {
      degree: string;
      institution: string;
    }[];
    projects: {
      name: string;
      description: string;
    }[];
    recommendations: string[];
    summary: string;
  };
}

export function ResumeAnalysis({ analysis }: ResumeAnalysisProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Analysis Results</h3>
        </div>
        <p className="text-sm text-muted-foreground">{analysis.summary}</p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Skills Identified</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Experience</h4>
          </div>
          <div className="space-y-4">
            {analysis.experience.map((exp, index) => (
              <div key={index}>
                <h5 className="font-medium">{exp.title}</h5>
                <p className="text-sm text-muted-foreground">{exp.details}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Code className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Projects</h4>
          </div>
          <div className="space-y-4">
            {analysis.projects.map((project, index) => (
              <div key={index}>
                <h5 className="font-medium">{project.name}</h5>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Recommendations</h4>
          </div>
          <ul className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}