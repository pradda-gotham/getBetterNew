"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Mic, StopCircle, Loader2 } from "lucide-react";

interface InterviewSessionProps {
  question: any;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (audioBlob: Blob) => void;
}

export function InterviewSession({
  question,
  isRecording,
  onStartRecording,
  onStopRecording,
}: InterviewSessionProps) {
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
        onStopRecording(audioBlob);
      };

      mediaRecorder.start();
      onStartRecording();
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
    }
  };

  if (!question) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Waiting for Question</h3>
          <p className="text-muted-foreground">
            AI is preparing your next interview question...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{question.type}</Badge>
          {isRecording && (
            <div className="flex items-center text-red-500">
              <Mic className="h-4 w-4 mr-1 animate-pulse" />
              <span className="text-sm">Recording</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">{question.question}</h3>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Key points to address:</p>
            <ul className="list-disc list-inside space-y-1">
              {question.expectedPoints.map((point: string, index: number) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          {!isRecording ? (
            <Button onClick={startRecording}>
              <Mic className="mr-2 h-4 w-4" />
              Start Response
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopRecording}>
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}