"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

interface PerformanceMetricsProps {
  sessions: any[];
  dateRange: [Date, Date];
}

export function PerformanceMetrics({ sessions, dateRange }: PerformanceMetricsProps) {
  const metrics = calculateMetrics(sessions);

  if (!metrics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </p>
            <h3 className="text-2xl font-bold">{metrics.totalSessions}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Target className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Average Score
            </p>
            <h3 className="text-2xl font-bold">{metrics.averageScore}%</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Practice Time
            </p>
            <h3 className="text-2xl font-bold">
              {formatDuration(metrics.totalDuration)}
            </h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <TrendingUp className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Improvement
            </p>
            <h3 className="text-2xl font-bold">
              {metrics.improvement > 0 ? "+" : ""}
              {metrics.improvement}%
            </h3>
          </div>
        </div>
      </Card>
    </div>
  );
}

function calculateMetrics(sessions: any[]) {
  if (!sessions?.length) return null;

  return {
    totalSessions: sessions.length,
    averageScore: Math.round(
      sessions.reduce((acc, session) => acc + session.score, 0) / sessions.length
    ),
    totalDuration: sessions.reduce((acc, session) => acc + session.duration, 0),
    improvement: calculateImprovement(sessions),
  };
}

function calculateImprovement(sessions: any[]) {
  if (sessions.length < 2) return 0;

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const firstFive = sortedSessions.slice(0, 5);
  const lastFive = sortedSessions.slice(-5);

  const initialAverage = firstFive.reduce((acc, session) => acc + session.score, 0) / firstFive.length;
  const currentAverage = lastFive.reduce((acc, session) => acc + session.score, 0) / lastFive.length;

  return Math.round(((currentAverage - initialAverage) / initialAverage) * 100);
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}