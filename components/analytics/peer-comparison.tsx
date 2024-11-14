"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PeerComparisonProps {
  userSessions: any[];
  peerData: any[];
  dateRange: [Date, Date];
}

export function PeerComparison({
  userSessions,
  peerData,
  dateRange,
}: PeerComparisonProps) {
  const comparison = compareToPeers(userSessions, peerData);

  if (!comparison) return null;

  const distributionData = calculateScoreDistribution(peerData);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Peer Comparison</h3>
        <p className="text-sm text-muted-foreground">
          See how your performance compares to others
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your Average</span>
              <span>{Math.round(comparison.userAverage)}%</span>
            </div>
            <Progress value={comparison.userAverage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Peer Average</span>
              <span>{Math.round(comparison.peerAverage)}%</span>
            </div>
            <Progress value={comparison.peerAverage} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Performance Percentile</span>
            <Badge variant="outline" className="text-lg">
              {comparison.percentile}th
            </Badge>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card className="p-2">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-sm">
                          Count: {payload[0].value}
                        </p>
                      </Card>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function compareToPeers(userSessions: any[], peerData: any[]) {
  if (!userSessions?.length || !peerData?.length) return null;

  const userAverage = userSessions.reduce((acc, session) => acc + session.score, 0) / userSessions.length;
  const peerAverage = peerData.reduce((acc, session) => acc + session.score, 0) / peerData.length;

  return {
    userAverage,
    peerAverage,
    percentile: calculatePercentile(userAverage, peerData.map(session => session.score)),
  };
}

function calculatePercentile(score: number, allScores: number[]) {
  const sortedScores = [...allScores].sort((a, b) => a - b);
  const index = sortedScores.findIndex(s => s >= score);
  return Math.round((index / sortedScores.length) * 100);
}

function calculateScoreDistribution(peerData: any[]) {
  const ranges = Array.from({ length: 10 }, (_, i) => ({
    min: i * 10,
    max: (i + 1) * 10,
    count: 0,
  }));

  peerData.forEach(session => {
    const range = Math.floor(session.score / 10);
    if (range >= 0 && range < 10) {
      ranges[range].count++;
    }
  });

  return ranges.map(range => ({
    range: `${range.min}-${range.max}`,
    count: range.count,
  }));
}