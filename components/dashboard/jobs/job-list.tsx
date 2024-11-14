import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  location: string;
  appliedDate: string;
  nextStep?: string;
  nextDate?: string;
}

interface JobListProps {
  jobs: Job[];
  selectedId?: string;
  onSelect: (job: Job) => void;
}

const statusColors = {
  applied: "bg-blue-500/10 text-blue-500",
  interviewing: "bg-yellow-500/10 text-yellow-500",
  offered: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
};

export function JobList({ jobs, selectedId, onSelect }: JobListProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Applications</h3>
      <div className="space-y-2">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className={cn(
              "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              selectedId === job.id && "border-primary"
            )}
            onClick={() => onSelect(job)}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{job.company}</h4>
                <Badge
                  variant="secondary"
                  className={cn(
                    statusColors[job.status as keyof typeof statusColors]
                  )}
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm font-medium">{job.position}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {job.appliedDate}
                </div>
              </div>
              {job.nextStep && (
                <div className="text-sm text-muted-foreground">
                  Next: {job.nextStep} ({job.nextDate})
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}