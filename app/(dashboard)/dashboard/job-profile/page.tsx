"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Search, Loader2 } from "lucide-react";
import { JobMatchScore } from "@/components/dashboard/job-profile/job-match-score";
import { JobMatchAnalysis } from "@/components/dashboard/job-profile/job-match-analysis";

export default function JobProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  // Fetch user's resume data
  const { data: userData } = useQuery({
    queryKey: ["userData", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    },
    enabled: !!user?.uid,
  });

  const handleAnalyze = async () => {
    if (!userData?.resumeAnalysis) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume first to analyze job matches.",
        variant: "destructive",
      });
      return;
    }

    if (!jobTitle || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide both job title and description.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch("/api/jobs/analyze-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeAnalysis: userData.resumeAnalysis,
          jobTitle,
          jobDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze job match");
      const data = await response.json();
      setAnalysis(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Job Profile Analysis</h2>
        <p className="text-muted-foreground">
          Compare your profile with job requirements for personalized insights.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <Input
                placeholder="e.g., Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description</label>
              <Textarea
                placeholder="Paste the full job description here..."
                className="min-h-[200px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze Match
                </>
              )}
            </Button>
          </div>
        </Card>

        {analysis && (
          <>
            <JobMatchScore analysis={analysis} />
            <div className="lg:col-span-2">
              <JobMatchAnalysis analysis={analysis} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}