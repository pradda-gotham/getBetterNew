import { db, storage } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

export async function backupUserData(userId: string) {
  try {
    // Get all user data
    const userData = await getUserData(userId);
    const sessions = await getUserSessions(userId);
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      user: userData,
      sessions,
    };

    // Upload to Firebase Storage
    const backupRef = ref(
      storage,
      `backups/${userId}/${formatDate(new Date())}.json`
    );
    
    await uploadBytes(
      backupRef,
      new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      })
    );

    return true;
  } catch (error) {
    console.error("Backup failed:", error);
    return false;
  }
}

async function getUserData(userId: string) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.data();
}

async function getUserSessions(userId: string) {
  const sessionsRef = collection(db, "interviews");
  const q = query(sessionsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}