import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type {
  User,
  InterviewSession,
  Response,
} from "./schema";

// User Queries
export function useUser(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      return docSnap.data() as User;
    },
    enabled: !!userId,
  });
}

// Interview Session Queries
export function useInterviewSessions(userId: string, limit = 10) {
  return useQuery({
    queryKey: ["sessions", userId],
    queryFn: async () => {
      const sessionsRef = collection(db, "interviews");
      const q = query(
        sessionsRef,
        where("userId", "==", userId),
        orderBy("startTime", "desc"),
        limit(limit)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as InterviewSession[];
    },
    enabled: !!userId,
  });
}

// Mutations
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: Omit<InterviewSession, "id">) => {
      const sessionsRef = collection(db, "interviews");
      const docRef = doc(sessionsRef);
      await updateDoc(docRef, {
        ...session,
        id: docRef.id,
      });
      return docRef.id;
    },
    onSuccess: (_, session) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", session.userId] });
    },
  });
}

// Data Export
export async function exportUserData(userId: string) {
  // Get user data
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  // Get all sessions
  const sessionsRef = collection(db, "interviews");
  const q = query(sessionsRef, where("userId", "==", userId));
  const sessionsSnap = await getDocs(q);
  const sessions = sessionsSnap.docs.map(doc => doc.data());

  // Combine data
  const exportData = {
    user: userData,
    sessions,
    exportDate: new Date().toISOString(),
  };

  // Convert to JSON
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  return blob;
}