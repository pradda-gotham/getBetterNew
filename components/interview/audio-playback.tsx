"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";

interface AudioPlaybackProps {
  question: {
    id: string;
    question: string;
    type: string;
    difficulty: string;
  };
  onComplete: () => void;
}

export function AudioPlayback({ question, onComplete }: AudioPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = useRef<string | null>(null);

  const generateSpeech = async () => {
    if (audioUrl.current) {
      playAudio();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question.question }),
      });

      if (!response.ok) throw new Error("Failed to generate speech");
      const { audioUrl: url } = await response.json();
      audioUrl.current = url;

      await setupAudio(url);
      playAudio();
    } catch (error) {
      console.error("Speech generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupAudio = async (url: string) => {
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgress(progress);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
      onComplete();
    });

    await audio.load();
  };

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const restartAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    playAudio();
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      handleVolumeChange(1);
    } else {
      handleVolumeChange(0);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {question.type}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {question.difficulty}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{question.question}</h3>
          <p className="text-sm text-muted-foreground">
            Click play to hear the question read aloud
          </p>
        </div>

        <div className="space-y-4">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={isPlaying ? pauseAudio : generateSpeech}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={restartAudio}
                disabled={!audioUrl.current || isLoading}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                disabled={isLoading}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="w-24">
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) => handleVolumeChange(value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}