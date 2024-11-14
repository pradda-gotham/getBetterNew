"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Download, Loader2 } from "lucide-react";
import { exportUserData } from "@/lib/firebase/queries";
import { useAuth } from "@/app/auth";

export function ExportButton() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    if (!user) return;

    setExporting(true);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const blob = await exportUserData(user.uid);
      
      clearInterval(progressInterval);
      setProgress(100);

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interview-data-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleExport}
        disabled={exporting}
        className="w-full"
      >
        {exporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </>
        )}
      </Button>

      {exporting && (
        <Progress value={progress} className="h-2" />
      )}
    </div>
  );
}