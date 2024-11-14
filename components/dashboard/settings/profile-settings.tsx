"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { User, Mail } from "lucide-react";

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name,
        title,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            className="bg-muted"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Card>
  );
}