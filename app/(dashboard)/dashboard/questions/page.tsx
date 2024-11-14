"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Brain, Loader2 } from "lucide-react";
import { QuestionList } from "@/components/dashboard/question-generation/question-list";
import { QuestionDetails } from "@/components/dashboard/question-generation/question-details";
import { useRouter } from "next/navigation";

export default function QuestionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  // Fetch user's profile data
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

  // Generate questions
  const handleGenerateQuestions = async () => {
    if (!userData?.resumeAnalysis || !userData?.jobMatch) {
      toast({
        title: "Missing Information",
        description: "Please upload your resume and analyze a job match first.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: userData.resumeAnalysis,
          jobData: userData.jobMatch,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate questions");
      const data = await response.json();
      setSelectedQuestion(data.questions[0]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handlePractice = (question: any) => {
    router.push(`/dashboard/practice?questionId=${question.id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Interview Questions</h2>
        <p className="text-muted-foreground">
          Generate and practice with AI-powered interview questions.
        </p>
      </div>

      {!userData?.resumeAnalysis || !userData?.jobMatch ? (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <Brain className="h-12 w-12 text-primary mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Complete Your Profile</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your resume and analyze a job match to generate personalized questions.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/resume")}
              >
                Upload Resume
              </Button>
              <Button onClick={() => router.push("/dashboard/job-profile")}>
                Analyze Job Match
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Questions</h3>
                <Button
                  onClick={handleGenerateQuestions}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate New
                    </>
                  )}
                </Button>
              </div>
              {userData.questions && (
                <QuestionList
                  questions={userData.questions}
                  selectedId={selectedQuestion?.id}
                  onSelect={setSelectedQuestion}
                />
              )}
            </div>
          </Card>

          {selectedQuestion && (
            <QuestionDetails
              question={selectedQuestion}
              onPractice={handlePractice}
            />
          )}
        </div>
      )}
    </div>
  );
}</content>