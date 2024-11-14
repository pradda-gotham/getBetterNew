"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { auth, db } from "@/lib/firebase";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { Trash2 } from "lucide-react";

export function DeleteAccount() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(user);
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
        });
      }
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
    <Card className="p-6 border-destructive">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Trash2 className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-semibold">Delete Account</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={loading}>
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}