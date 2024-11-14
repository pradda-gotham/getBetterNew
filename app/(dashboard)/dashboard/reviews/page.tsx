"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewList } from "@/components/dashboard/reviews/review-list";
import { DetailedFeedback } from "@/components/dashboard/reviews/detailed-feedback";
import { TranscriptViewer } from "@/components/dashboard/reviews/transcript-viewer";
import { AIInsights } from "@/components/dashboard/reviews/ai-insights";
import { Brain, MessageSquare, FileText, Lightbulb } from "lucide-react";

// Mock data for demonstration
const mockReviews = [
  {
    id: "1",
    date: "2024-04-01",
    type: "Technical Interview",
    question: "Explain the concept of dependency injection",
    duration: "4:32",
    score: 85,
    status: "completed",
  },
  {
    id: "2",
    date: "2024-03-28",
    type: "Behavioral Interview",
    question: "Tell me about a time you handled a difficult team situation",
    duration: "5:15",
    score: 92,
    status: "completed",
  },
];

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState(mockReviews[0]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Interview Reviews</h2>
        <p className="text-muted-foreground">
          Review your past interviews and analyze your performance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4 p-6">
          <ReviewList
            reviews={mockReviews}
            selectedId={selectedReview.id}
            onSelect={setSelectedReview}
          />
        </Card>

        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="feedback" className="space-y-4">
            <TabsList>
              <TabsTrigger value="feedback">
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback
              </TabsTrigger>
              <TabsTrigger value="transcript">
                <FileText className="h-4 w-4 mr-2" />
                Transcript
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Lightbulb className="h-4 w-4 mr-2" />
                AI Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feedback">
              <DetailedFeedback review={selectedReview} />
            </TabsContent>

            <TabsContent value="transcript">
              <TranscriptViewer review={selectedReview} />
            </TabsContent>

            <TabsContent value="insights">
              <AIInsights review={selectedReview} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}