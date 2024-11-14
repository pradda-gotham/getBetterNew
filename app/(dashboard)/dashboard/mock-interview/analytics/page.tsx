"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/app/auth";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { PerformanceOverTime } from "@/components/mock-interview/analytics/performance-over-time";
import { SkillBreakdown } from "@/components/mock-interview/analytics/skill-breakdown";
import { TopicAnalysis } from "@/components/mock-interview/analytics/topic-analysis";
import { ImprovementTracking } from "@/components/mock-interview/analytics/improvement-tracking";
import { useQuery } from "@tanstack/react-query";

export default function MockInterviewAnalyticsPage() {
  const { user } = useAuth();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["interview-sessions", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      const sessionsRef = collection(db, "interview_sessions");
      const q = query(
        sessionsRef,
        where("userId", "==", user.uid),
        where("type", "==", "mock_interview")
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    enabled: !!user?.uid
  });

  const processedData = sessions ? processSessionData(sessions) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Interview Analytics</h2>
        <p className="text-muted-foreground">
          Track your progress and identify areas for improvement.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Sessions"
          value={sessions?.length || 0}
          change="+12%"
          trend="up"
        />
        <MetricCard
          title="Average Score"
          value={`${processedData?.averageScore || 0}%`}
          change="+5%"
          trend="up"
        />
        <MetricCard
          title="Best Performance"
          value={`${processedData?.bestScore || 0}%`}
          change="0"
          trend="neutral"
        />
        <MetricCard
          title="Areas Mastered"
          value={processedData?.masteredTopics || 0}
          change="+2"
          trend="up"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
          <PerformanceOverTime data={processedData?.performanceData || []} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Skill Breakdown</h3>
          <SkillBreakdown data={processedData?.skillsData || {}} />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Topic Analysis</h3>
          <TopicAnalysis data={processedData?.topicData || []} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Improvement Tracking</h3>
          <ImprovementTracking data={processedData?.improvementData || []} />
        </Card>
      </div>
    </div>
  );
}

function processSessionData(sessions: any[]) {
  // Calculate average score
  const scores = sessions.map(s => s.analysis?.score || 0);
  const averageScore = Math.round(
    scores.reduce((acc, score) => acc + score, 0) / scores.length
  );

  // Find best score
  const bestScore = Math.max(...scores);

  // Process performance over time
  const performanceData = sessions
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .map(session => ({
      date: new Date(session.startTime).toLocaleDateString(),
      score: session.analysis?.score || 0,
      clarity: session.analysis?.metrics?.clarity || 0,
      relevance: session.analysis?.metrics?.relevance || 0,
      technical: session.analysis?.metrics?.technicalAccuracy || 0,
    }));

  // Calculate skills data
  const skillsData = sessions.reduce((acc, session) => {
    const metrics = session.analysis?.metrics || {};
    Object.entries(metrics).forEach(([skill, value]) => {
      if (!acc[skill]) acc[skill] = [];
      acc[skill].push(value);
    });
    return acc;
  }, {});

  // Process topic performance
  const topicData = sessions.reduce((acc, session) => {
    const topic = session.question?.type || 'general';
    if (!acc[topic]) {
      acc[topic] = {
        count: 0,
        totalScore: 0,
      };
    }
    acc[topic].count += 1;
    acc[topic].totalScore += session.analysis?.score || 0;
    return acc;
  }, {});

  // Calculate mastered topics
  const masteredTopics = Object.values(topicData).filter(
    (topic: any) => topic.totalScore / topic.count >= 85
  ).length;

  // Track improvements over time
  const improvementData = sessions.map(session => ({
    date: new Date(session.startTime).toLocaleDateString(),
    improvements: session.analysis?.improvements || [],
    strengths: session.analysis?.strengths || [],
  }));

  return {
    averageScore,
    bestScore,
    masteredTopics,
    performanceData,
    skillsData,
    topicData: Object.entries(topicData).map(([topic, data]: [string, any]) => ({
      topic,
      averageScore: Math.round(data.totalScore / data.count),
      count: data.count,
    })),
    improvementData,
  };
}