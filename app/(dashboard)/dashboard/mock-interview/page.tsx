"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mic, MicOff, Play, StopCircle, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, addDoc, collection } from "firebase/firestore";
import { useAuth } from "@/app/auth";
import { InterviewSession } from "@/components/mock-interview/interview-session";
import { AIFeedback } from "@/components/mock-interview/ai-feedback";
import { QuestionGenerator } from "@/components/mock-interview/question-generator";

export default function MockInterviewPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);

  // Fetch user's profile and preferences for personalized questions
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    },
    enabled: !!user?.uid,
  });

  // Start new interview session
  const startSession = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const session = await addDoc(collection(db, "interview_sessions"), {
        userId: user.uid,
        startTime: new Date().toISOString(),
        status: "in_progress",
        type: "mock_interview",
      });

      return session.id;
    },
    onSuccess: (sessionId) => {
      setSessionId(sessionId);
      toast({
        title: "Interview Session Started",
        description: "AI will now generate personalized questions based on your profile.",
      });
    },
  });

  // Generate next question using AI
  const generateQuestion = useMutation({
    mutationFn: async (context: any) => {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userProfile,
          previousQuestions: context.previousQuestions,
          previousResponses: context.previousResponses,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate question");
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentQuestion(data);
    },
  });

  // Process interview response
  const processResponse = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      if (!sessionId || !currentQuestion) return null;

      // Upload audio to Firebase Storage
      const audioRef = ref(storage, `interviews/${sessionId}/${Date.now()}.webm`);
      await uploadBytes(audioRef, audioBlob);
      const audioUrl = await getDownloadURL(audioRef);

      // Process response with AI
      const response = await fetch("/api/analyze-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          audioUrl,
          question: currentQuestion.question,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze response");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Response Analyzed",
        description: "AI has analyzed your response and provided feedback.",
      });
    },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p>Please log in to access mock interviews.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Mock Interview</h2>
        <p className="text-muted-foreground">
          Practice with our AI interviewer for personalized feedback and improvement suggestions.
        </p>
      </div>

      {!sessionId ? (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Ready to Start?</h3>
            <p className="text-muted-foreground">
              Our AI will conduct a personalized interview based on your profile and preferences.
            </p>
            <Button
              onClick={() => startSession.mutate()}
              disabled={startSession.isLoading}
            >
              {startSession.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Session...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Mock Interview
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <InterviewSession
            question={currentQuestion}
            isRecording={isRecording}
            onStartRecording={() => setIsRecording(true)}
            onStopRecording={(audioBlob) => {
              setIsRecording(false);
              processResponse.mutate(audioBlob);
            }}
          />

          {processResponse.data && (
            <AIFeedback feedback={processResponse.data} />
          )}

          {!currentQuestion && !processResponse.isLoading && (
            <QuestionGenerator
              onGenerate={() => generateQuestion.mutate({})}
              isLoading={generateQuestion.isLoading}
            />
          )}
        </div>
      )}
    </div>
  );
}