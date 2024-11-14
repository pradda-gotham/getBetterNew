"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Steps } from "@/components/interview-flow/steps";
import { ResumeStep } from "@/components/interview-flow/resume-step";
import { JobProfileStep } from "@/components/interview-flow/job-profile-step";
import { QuestionGenerationStep } from "@/components/interview-flow/question-generation-step";
import { InterviewStep } from "@/components/interview-flow/interview-step";
import { AnalysisStep } from "@/components/interview-flow/analysis-step";

export default function InterviewFlowPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [flowData, setFlowData] = useState<any>({});

  // Fetch user data including resume and job matches
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

  const steps = [
    {
      title: "Resume Upload",
      description: "Upload and analyze your resume",
      component: (
        <ResumeStep
          existingResume={userData?.resumeAnalysis}
          onComplete={(resumeData) => {
            setFlowData((prev: any) => ({ ...prev, resume: resumeData }));
            setCurrentStep(1);
          }}
        />
      ),
    },
    {
      title: "Job Profile",
      description: "Select or enter job details",
      component: (
        <JobProfileStep
          resumeData={flowData.resume}
          onComplete={(jobData) => {
            setFlowData((prev: any) => ({ ...prev, job: jobData }));
            setCurrentStep(2);
          }}
        />
      ),
    },
    {
      title: "Question Generation",
      description: "AI generates targeted questions",
      component: (
        <QuestionGenerationStep
          resumeData={flowData.resume}
          jobData={flowData.job}
          onComplete={(questions) => {
            setFlowData((prev: any) => ({ ...prev, questions }));
            setCurrentStep(3);
          }}
        />
      ),
    },
    {
      title: "Interview Practice",
      description: "Practice with AI-generated questions",
      component: (
        <InterviewStep
          questions={flowData.questions}
          onComplete={(responses) => {
            setFlowData((prev: any) => ({ ...prev, responses }));
            setCurrentStep(4);
          }}
        />
      ),
    },
    {
      title: "Analysis Report",
      description: "Review your performance analysis",
      component: (
        <AnalysisStep
          flowData={flowData}
          onComplete={() => {
            toast({
              title: "Interview Session Complete",
              description: "Your practice session has been saved.",
            });
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Interview Practice</h2>
        <p className="text-muted-foreground">
          Complete each step to practice with AI-powered interview questions.
        </p>
      </div>

      <Steps steps={steps} currentStep={currentStep} />

      <Card className="p-6">
        {steps[currentStep].component}
      </Card>
    </div>
  );
}