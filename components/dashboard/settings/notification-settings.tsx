"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Mail, MessageSquare } from "lucide-react";

export function NotificationSettings() {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [feedbackAlerts, setFeedbackAlerts] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // Save to backend
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about your interview practice sessions
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Practice Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get reminded about scheduled practice sessions
            </p>
          </div>
          <Switch
            checked={practiceReminders}
            onCheckedChange={setPracticeReminders}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Feedback Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Instant notifications when AI feedback is ready
            </p>
          </div>
          <Switch
            checked={feedbackAlerts}
            onCheckedChange={setFeedbackAlerts}
          />
        </div>

        <Button
          onClick={handleSaveNotifications}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </Card>
  );
}