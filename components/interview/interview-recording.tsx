"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Mic,
  StopCircle,
  Waveform,
  AlertCircle,
  Clock,
} from "lucide-react";

interface InterviewRecordingProps {
  question: {
    id: string;
    question: string;
    type: string;
    difficulty: string;
    expectedPoints: string[];
  };
  onComplete: (audioBlob: Blob) => void;
}

export function InterviewRecording({ question, onComplete }: InterviewRecordingProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        onComplete(audioBlob);
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);
      updateMetrics();

      toast({
        title: "Recording Started",
        description: "Speak clearly and address all key points.",
      });
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const updateMetrics = () => {
    // Update duration
    setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));

    // Update volume meter
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setVolume(average);
    }

    animationFrameRef.current = requestAnimationFrame(updateMetrics);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {question.type}
          </Badge>
          {isRecording && (
            <div className="flex items-center space-x-2 text-red-500">
              <Waveform className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{question.question}</h3>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Key points to address:</p>
            <ul className="list-disc list-inside space-y-1">
              {question.expectedPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        {isRecording && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(duration)}</span>
              </div>
              {duration > 180 && (
                <div className="flex items-center space-x-2 text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Consider wrapping up your response</span>
                </div>
              )}
            </div>
            <Progress value={Math.min((volume / 255) * 100, 100)} />
          </div>
        )}

        <div className="flex justify-end">
          {!isRecording ? (
            <Button onClick={startRecording}>
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
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