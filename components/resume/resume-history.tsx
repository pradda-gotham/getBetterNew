"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, FileText, RotateCcw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ResumeVersion {
  url: string;
  analysis: any;
  timestamp: string;
  fileName: string;
}

interface ResumeHistoryProps {
  history: ResumeVersion[];
  onRestore: (version: ResumeVersion) => void;
}

export function ResumeHistory({ history, onRestore }: ResumeHistoryProps) {
  if (!history.length) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-2">
          <History className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="font-medium">No Resume History</p>
          <p className="text-sm text-muted-foreground">
            Previous versions of your resume will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {history
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map((version, index) => (
            <Card key={version.timestamp} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{version.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(version.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(version)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {version.analysis.skills.slice(0, 5).map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {version.analysis.skills.length > 5 && (
                        <Badge variant="outline">
                          +{version.analysis.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Experience Level</p>
                    <p className="text-sm text-muted-foreground">
                      {version.analysis.experience}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </ScrollArea>
  );
}