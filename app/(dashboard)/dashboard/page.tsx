import { Card } from "@/components/ui/card";
import {
  Brain,
  Clock,
  Trophy,
  TrendingUp,
  Video,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your interview preparation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Video className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Practice Sessions
              </p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Practice Time
              </p>
              <h3 className="text-2xl font-bold">4.5 hrs</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Score
              </p>
              <h3 className="text-2xl font-bold">85%</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h4 className="text-xl font-semibold mb-4">Recent Activity</h4>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Brain className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Technical Interview Practice</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-xl font-semibold mb-4">Upcoming Sessions</h4>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Calendar className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Behavioral Interview</p>
                  <p className="text-sm text-muted-foreground">Tomorrow at 2 PM</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}