"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface SkillsAnalyticsProps {
  sessions: any[];
  dateRange: [Date, Date];
}

export function SkillsAnalytics({ sessions, dateRange }: SkillsAnalyticsProps) {
  const skillsData = analyzeSkills(sessions);

  if (!skillsData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Skills Proficiency</h3>
        <p className="text-sm text-muted-foreground">
          Track your skill development across different areas
        </p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={skillsData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Proficiency"
              dataKey="proficiency"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-2">
        {skillsData.map((skill) => (
          <Badge key={skill.name} variant="secondary">
            {skill.name}: {skill.proficiency}%
          </Badge>
        ))}
      </div>
    </div>
  );
}

function analyzeSkills(sessions: any[]) {
  if (!sessions?.length) return null;

  const skills = sessions.reduce((acc: any, session) => {
    session.skills?.forEach((skill: string) => {
      if (!acc[skill]) {
        acc[skill] = {
          count: 0,
          scores: [],
        };
      }
      acc[skill].count++;
      acc[skill].scores.push(session.score);
    });
    return acc;
  }, {});

  return Object.entries(skills).map(([skill, data]: [string, any]) => ({
    name: skill,
    proficiency: Math.round(
      data.scores.reduce((acc: number, score: number) => acc + score, 0) / data.scores.length
    ),
    frequency: data.count,
  }));
}