"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/auth";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { DateRangePicker } from "@/components/analytics/date-range-picker";
import { PerformanceMetrics } from "@/components/analytics/performance-metrics";
import { SkillsAnalytics } from "@/components/analytics/skills-analytics";
import { ProgressTimeline } from "@/components/analytics/progress-timeline";
import { PeerComparison } from "@/components/analytics/peer-comparison";
import { Download, Filter } from "lucide-react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    new Date()
  ]);

  // Fetch user's interview sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["interview-sessions", user?.uid, dateRange],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      const sessionsRef = collection(db, "interview_sessions");
      const q = query(
        sessionsRef,
        where("userId", "==", user.uid),
        where("timestamp", ">=", dateRange[0]),
        where("timestamp", "<=", dateRange[1])
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    enabled: !!user?.uid
  });

  // Fetch peer comparison data
  const { data: peerData } = useQuery({
    queryKey: ["peer-data", dateRange],
    queryFn: async () => {
      const peersRef = collection(db, "interview_sessions");
      const q = query(
        peersRef,
        where("timestamp", ">=", dateRange[0]),
        where("timestamp", "<=", dateRange[1])
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    }
  });

  const handleExportData = async () => {
    try {
      const data = {
        sessions,
        metrics: calculateMetrics(sessions),
        skills: analyzeSkills(sessions),
        progress: calculateProgress(sessions),
        peerComparison: compareToPeers(sessions, peerData)
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interview-analytics-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Your analytics data has been exported successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
          <p className="text-muted-foreground">
            Track your interview performance and skill development over time.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <PerformanceMetrics
        sessions={sessions}
        dateRange={dateRange}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <SkillsAnalytics
            sessions={sessions}
            dateRange={dateRange}
          />
        </Card>

        <Card className="p-6">
          <ProgressTimeline
            sessions={sessions}
            dateRange={dateRange}
          />
        </Card>
      </div>

      <Card className="p-6">
        <PeerComparison
          userSessions={sessions}
          peerData={peerData}
          dateRange={dateRange}
        />
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

function calculateProgress(sessions: any[]) {
  if (!sessions?.length) return null;

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return sortedSessions.map(session => ({
    date: session.timestamp,
    score: session.score,
    skills: session.skills,
    improvements: session.improvements,
  }));
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