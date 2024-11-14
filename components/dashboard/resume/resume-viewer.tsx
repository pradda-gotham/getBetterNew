import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ResumeViewerProps {
  url: string;
}

export function ResumeViewer({ url }: ResumeViewerProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Resume Preview</h3>
      <div className="aspect-[8.5/11] w-full rounded-lg border bg-white">
        <iframe
          src={url}
          className="h-full w-full rounded-lg"
          title="Resume preview"
        />
      </div>
    </div>
  );
}