"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { ResumeUpload } from "@/components/resume/resume-upload";
import { ResumeAnalysis } from "@/components/resume/resume-analysis";
import { ResumeHistory } from "@/components/resume/resume-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, History, Brain } from "lucide-react";

export default function ResumePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("current");

  // Fetch user's resume data
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    },
    enabled: !!user?.uid,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Resume Analysis</h2>
        <p className="text-muted-foreground">
          Upload your resume for AI-powered analysis and skill extraction.
        </p>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">
            <FileText className="h-4 w-4 mr-2" />
            Current Resume
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Version History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <ResumeUpload
            onAnalysisComplete={() => {
              toast({
                title: "Analysis Complete",
                description: "Your resume has been analyzed successfully.",
              });
            }}
          />

          {userData?.resumeAnalysis && (
            <ResumeAnalysis analysis={userData.resumeAnalysis} />
          )}
        </TabsContent>

        <TabsContent value="history">
          <ResumeHistory
            history={userData?.resumeHistory || []}
            onRestore={(version) => {
              toast({
                title: "Version Restored",
                description: "Previous resume version has been restored.",
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}