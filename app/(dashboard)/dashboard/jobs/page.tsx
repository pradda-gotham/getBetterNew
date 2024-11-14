"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobList } from "@/components/dashboard/jobs/job-list";
import { JobDetails } from "@/components/dashboard/jobs/job-details";
import { AddJobDialog } from "@/components/dashboard/jobs/add-job-dialog";
import { JobStats } from "@/components/dashboard/jobs/job-stats";
import { Plus, Briefcase } from "lucide-react";

// Mock data for demonstration
const mockJobs = [
  {
    id: "1",
    company: "TechCorp",
    position: "Senior Software Engineer",
    status: "applied",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$150,000 - $180,000",
    appliedDate: "2024-04-01",
    nextStep: "Technical Interview",
    nextDate: "2024-04-15",
    description: "Looking for a senior engineer to join our core platform team...",
    requirements: [
      "8+ years of experience in software development",
      "Strong knowledge of distributed systems",
      "Experience with cloud platforms (AWS/GCP)",
    ],
    notes: "Had initial call with recruiter, positive feedback",
  },
  {
    id: "2",
    company: "StartupX",
    position: "Full Stack Developer",
    status: "interviewing",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    appliedDate: "2024-03-28",
    nextStep: "Final Interview",
    nextDate: "2024-04-10",
    description: "Join our fast-growing startup building the future of...",
    requirements: [
      "5+ years of full-stack development",
      "Experience with React and Node.js",
      "Strong problem-solving skills",
    ],
    notes: "Completed technical assessment, scheduled final round",
  },
];

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(mockJobs[0]);
  const [showAddJob, setShowAddJob] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
          <p className="text-muted-foreground">
            Track your job applications and prepare for interviews.
          </p>
        </div>
        <Button onClick={() => setShowAddJob(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>

      <JobStats />

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4 p-6">
          <JobList
            jobs={mockJobs}
            selectedId={selectedJob?.id}
            onSelect={setSelectedJob}
          />
        </Card>

        <div className="lg:col-span-8">
          <JobDetails job={selectedJob} />
        </div>
      </div>

      <AddJobDialog open={showAddJob} onOpenChange={setShowAddJob} />
    </div>
  );
}