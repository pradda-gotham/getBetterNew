import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

interface Review {
  id: string;
  date: string;
  type: string;
  question: string;
  duration: string;
  score: number;
  status: string;
}

interface ReviewListProps {
  reviews: Review[];
  selectedId: string;
  onSelect: (review: Review) => void;
}

export function ReviewList({ reviews, selectedId, onSelect }: ReviewListProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Past Interviews</h3>
      <div className="space-y-2">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className={cn(
              "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              selectedId === review.id && "border-primary"
            )}
            onClick={() => onSelect(review)}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{review.type}</Badge>
                <span className="text-sm font-medium">{review.score}%</span>
              </div>
              <p className="text-sm font-medium line-clamp-2">{review.question}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {review.date}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {review.duration}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}