"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface ProgressTimelineProps {
  sessions: any[];
  dateRange: [Date, Date];
}

export function ProgressTimeline({ sessions, dateRange }: ProgressTimelineProps) {
  const progressData = calculateProgress(sessions);

  if (!progressData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Progress Timeline</h3>
        <p className="text-sm text-muted-foreground">
          Track your performance improvement over time
        </p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(new Date(value), "MMM d")}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-2">
                      <p className="text-sm font-medium">
                        {format(new Date(label), "MMM d, yyyy")}
                      </p>
                      <p className="text-sm">
                        Score: {payload[0].value}%
                      </p>
                    </Card>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function calculateProgress(sessions: any[]) {
  if (!sessions?.length) return null;

  return [...sessions]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(session => ({
      date: session.timestamp,
      score: session.score,
    }));
}