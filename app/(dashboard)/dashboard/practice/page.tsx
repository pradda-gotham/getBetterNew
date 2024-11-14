"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Mic, MicOff, Play, StopCircle, Loader2 } from "lucide-react";
import { InterviewQuestion } from "@/components/dashboard/practice/interview-question";
import { FeedbackPanel } from "@/components/dashboard/practice/feedback-panel";
import { QuestionList } from "@/components/dashboard/practice/question-list";
import { useQuery, useMutation } from "@tanstack/react-query";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, addDoc, collection } from "firebase/firestore";
import { useAuth } from "@/app/auth";

export default function PracticePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Fetch questions from Firestore
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["interview-questions"],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  });

  // Process audio and get AI feedback
  const processMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      if (!user || !activeQuestion) return null;

      // Upload audio to Firebase Storage
      const audioRef = ref(storage, `interviews/${user.uid}/${Date.now()}.webm`);
      await uploadBytes(audioRef, audioBlob);
      const audioUrl = await getDownloadURL(audioRef);

      // Create interview session document
      const sessionRef = await addDoc(collection(db, "interview_sessions"), {
        userId: user.uid,
        questionId: activeQuestion.id,
        audioUrl,
        timestamp: new Date().toISOString(),
        status: "processing"
      });

      // Start AI processing
      const response = await fetch("/api/process-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioUrl,
          questionId: activeQuestion.id,
          sessionId: sessionRef.id
        })
      });

      if (!response.ok) throw new Error("Failed to process interview");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: "Your interview response has been analyzed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process interview response.",
        variant: "destructive",
      });
    }
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        processMutation.mutate(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Your response is being recorded.",
      });
    } catch (error) {
      toast({
        title: "Permission denied",
        description: "Please allow access to microphone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  if (questionsLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Interview Practice</h2>
        <p className="text-muted-foreground">
          Practice your interview responses with AI-powered feedback.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Tabs defaultValue="behavioral" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="behavioral" className="w-full">
                Behavioral
              </TabsTrigger>
              <TabsTrigger value="technical" className="w-full">
                Technical
              </TabsTrigger>
            </TabsList>
            <TabsContent value="behavioral">
              <QuestionList
                questions={questions?.filter(q => q.type === "behavioral") || []}
                onSelect={setActiveQuestion}
                activeId={activeQuestion?.id}
              />
            </TabsContent>
            <TabsContent value="technical">
              <QuestionList
                questions={questions?.filter(q => q.type === "technical") || []}
                onSelect={setActiveQuestion}
                activeId={activeQuestion?.id}
              />
            </TabsContent>
          </Tabs>

          {activeQuestion && (
            <Card className="p-6">
              <InterviewQuestion
                question={activeQuestion}
                isRecording={isRecording}
              />
              <div className="mt-4 flex justify-end space-x-2">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording}
                    disabled={processMutation.isLoading}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={stopRecording}
                  >
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        {processMutation.data && (
          <FeedbackPanel feedback={processMutation.data} />
        )}

        {processMutation.isLoading && (
          <Card className="p-6 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Analyzing your response...
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}