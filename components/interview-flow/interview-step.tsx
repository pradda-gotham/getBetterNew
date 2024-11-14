"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mic, StopCircle, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface InterviewStepProps {
  questions: any[];
  onComplete: (responses: any[]) => void;
}

export function InterviewStep({ questions, onComplete }: InterviewStepProps) {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await processResponse(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processResponse = async (audioBlob: Blob) => {
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("questionId", currentQuestion.id);

      const response = await fetch("/api/interview/analyze-response", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze response");
      const analysis = await response.json();

      setResponses(prev => [...prev, {
        questionId: currentQuestion.id,
        analysis,
      }]);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        onComplete(responses);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <Progress
            value={(currentQuestionIndex / questions.length) * 100}
            className="w-[200px]"
          />
        </div>
        <Badge>{currentQuestion.type}</Badge>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{currentQuestion.question}</h3>
            {currentQuestion.expectedPoints && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Key points to address:</p>
                <ul className="list-disc list-inside">
                  {currentQuestion.expectedPoints.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            {!isRecording ? (
              <Button onClick={startRecording} disabled={processing}>
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={stopRecording}
                disabled={processing}
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>
      </Card>

      {processing && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Processing response...</span>
        </div>
      )}
    </div>
  );
}