"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Upload, Loader2 } from "lucide-react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "@/app/auth";

interface ResumeUploadProps {
  onAnalysisComplete: () => void;
}

export function ResumeUpload({ onAnalysisComplete }: ResumeUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !user) return;

    if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        .includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `resumes/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Simulate progress for better UX
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Process resume with AI
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: url }),
      });

      if (!response.ok) throw new Error("Failed to analyze resume");
      const analysis = await response.json();

      // Update user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        resumeUrl: url,
        resumeAnalysis: analysis,
        resumeHistory: arrayUnion({
          url,
          analysis,
          timestamp: new Date().toISOString(),
          fileName: file.name,
        }),
      });

      onAnalysisComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [user, toast, onAnalysisComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <Card className="p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors ${
          isDragActive ? "border-primary" : "border-muted"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <FileText className="h-8 w-8 text-muted-foreground" />
          {isDragActive ? (
            <p>Drop your resume here...</p>
          ) : (
            <>
              <p className="font-medium">Upload your resume</p>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to select (PDF or DOCX)
              </p>
            </>
          )}
        </div>
      </div>

      {uploading && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Processing resume...</span>
          </div>
          <Progress value={progress} />
        </div>
      )}
    </Card>
  );
}