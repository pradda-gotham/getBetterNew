import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  List,
  MessageSquare,
  Play,
} from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  location: string;
  type: string;
  salary: string;
  appliedDate: string;
  nextStep?: string;
  nextDate?: string;
  description: string;
  requirements: string[];
  notes: string;
}

interface JobDetailsProps {
  job: Job;
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{job.position}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{job.company}</span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="text-lg px-4 py-1"
            >
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Applied: {job.appliedDate}</span>
            </div>
          </div>

          {job.nextStep && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium">Next Step</h4>
              <p className="text-sm mt-1">
                {job.nextStep} - {job.nextDate}
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5" />
            <h4 className="font-medium">Job Description</h4>
          </div>
          <p className="text-sm text-muted-foreground">{job.description}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <List className="h-5 w-5" />
            <h4 className="font-medium">Requirements</h4>
          </div>
          <ul className="space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="text-sm flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="h-5 w-5" />
          <h4 className="font-medium">Notes</h4>
        </div>
        <p className="text-sm text-muted-foreground">{job.notes}</p>
      </Card>

      <div className="flex space-x-4">
        <Link href="/dashboard/practice" className="flex-1">
          <Button className="w-full">
            <Play className="mr-2 h-4 w-4" />
            Practice Interview
          </Button>
        </Link>
        <Button variant="outline" className="flex-1">
          Update Status
        </Button>
      </div>
    </div>
  );
}