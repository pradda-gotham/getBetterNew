"use client";

import { ResumeUpload } from "@/components/resume/resume-upload";
import { ResumeAnalysis } from "@/components/resume/resume-analysis";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload } from "lucide-react";

interface ResumeStepProps {
  existingResume: any;
  onComplete: (resumeData: any) => void;
}

export function ResumeStep({ existingResume, onComplete }: ResumeStepProps) {
  return (
    <div className="space-y-6">
      {existingResume ? (
        <div className="space-y-6">
          <ResumeAnalysis analysis={existingResume} />
          <div className="flex justify-between">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Resume
            </Button>
            <Button onClick={() => onComplete(existingResume)}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <ResumeUpload />
      )}
    </div>
  );
}