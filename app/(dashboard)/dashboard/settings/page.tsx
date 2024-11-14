"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/auth";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updatePassword, updateEmail } from "firebase/auth";
import {
  Settings,
  Bell,
  User,
  Shield,
  Trash2,
  Mail,
  Lock,
} from "lucide-react";
import { ProfileSettings } from "@/components/dashboard/settings/profile-settings";
import { NotificationSettings } from "@/components/dashboard/settings/notification-settings";
import { SecuritySettings } from "@/components/dashboard/settings/security-settings";
import { DeleteAccount } from "@/components/dashboard/settings/delete-account";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
          <div className="mt-6">
            <DeleteAccount />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}