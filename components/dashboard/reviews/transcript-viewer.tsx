import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Review {
  id: string;
  type: string;
  question: string;
}

interface TranscriptViewerProps {
  review: Review;
}

export function TranscriptViewer({ review }: TranscriptViewerProps) {
  // Mock transcript data
  const transcript = {
    segments: [
      {
        speaker: "Interviewer",
        text: review.question,
        timestamp: "00:00",
      },
      {
        speaker: "You",
        text: "Dependency injection is a design pattern that implements inversion of control for resolving dependencies. Instead of having a class create or find its dependencies, they are passed in through constructor parameters or setter methods.",
        timestamp: "00:15",
      },
      {
        speaker: "You",
        text: "This makes the code more modular, easier to test, and follows the dependency inversion principle from SOLID. For example, instead of a service class creating its own database connection, it receives it as a dependency.",
        timestamp: "00:45",
      },
      {
        speaker: "Interviewer",
        text: "Can you provide a specific example of how you've used dependency injection in a project?",
        timestamp: "01:15",
      },
      {
        speaker: "You",
        text: "In a recent project, I implemented a user service that required both a database repository and an email service. Instead of creating these dependencies inside the user service, I injected them through the constructor...",
        timestamp: "01:30",
      },
    ],
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Interview Transcript</h3>
          <Badge variant="outline">{review.type}</Badge>
        </div>
        
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {transcript.segments.map((segment, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {segment.speaker}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {segment.timestamp}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{segment.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}