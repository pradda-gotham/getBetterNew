"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AudioProcessor } from "@/lib/audio-processor";
import {
  Mic,
  StopCircle,
  Volume2,
  AlertCircle,
  Waveform,
  VolumeX,
} from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (result: { audioBlob: Blob; analysis: any }) => void;
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [qualityIssues, setQualityIssues] = useState<string[]>([]);
  const audioProcessorRef = useRef<AudioProcessor | null>(null);

  useEffect(() => {
    // Initialize audio processor
    audioProcessorRef.current = new AudioProcessor(
      process.env.NEXT_PUBLIC_ASSEMBLY_AI_KEY!,
      handleVolumeChange,
      handleNoiseLevel,
      handleQualityIssue
    );

    return () => {
      audioProcessorRef.current?.cleanup();
    };
  }, []);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(normalizeVolume(newVolume));
  };

  const handleNoiseLevel = (level: number) => {
    setNoiseLevel(normalizeVolume(level));
  };

  const handleQualityIssue = (issue: string) => {
    setQualityIssues(prev => {
      if (!prev.includes(issue)) {
        return [...prev, issue];
      }
      return prev;
    });

    // Clear issue after 3 seconds
    setTimeout(() => {
      setQualityIssues(prev => prev.filter(i => i !== issue));
    }, 3000);
  };

  const startRecording = async () => {
    try {
      await audioProcessorRef.current?.startRecording();
      setIsRecording(true);
      setQualityIssues([]);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    try {
      if (!audioProcessorRef.current) return;

      const result = await audioProcessorRef.current.stopRecording();
      setIsRecording(false);
      onRecordingComplete(result);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isRecording ? (
              <Waveform className="h-5 w-5 text-red-500 animate-pulse" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            <span className="font-medium">
              {isRecording ? "Recording in Progress" : "Ready to Record"}
            </span>
          </div>
          {qualityIssues.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              <AlertCircle className="h-4 w-4 mr-1" />
              {qualityIssues[0]}
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Volume Level</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <Progress value={volume * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Background Noise</span>
              <span>{Math.round(noiseLevel * 100)}%</span>
            </div>
            <Progress 
              value={noiseLevel * 100} 
              className="h-2"
              variant={noiseLevel > 0.3 ? "destructive" : "default"}
            />
          </div>

          {isRecording && (
            <div className="flex items-center justify-center">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary animate-pulse"
                    style={{
                      height: `${20 + Math.random() * 30}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
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

function normalizeVolume(volume: number): number {
  // Convert from dB to normalized value between 0 and 1
  const normalized = (volume + 100) / 100;
  return Math.max(0, Math.min(1, normalized));
}