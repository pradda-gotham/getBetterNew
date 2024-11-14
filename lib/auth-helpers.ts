import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export async function signUp(email: string, password: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(user);
  
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    createdAt: new Date().toISOString(),
    interviews: [],
    settings: {
      emailNotifications: true,
      practiceReminders: true,
    },
  });

  return user;
}

export async function signIn(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
  
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: user.displayName,
      createdAt: new Date().toISOString(),
      interviews: [],
      settings: {
        emailNotifications: true,
        practiceReminders: true,
      },
    });
  }

  return user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', userId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export interface UserProfile {
  email: string;
  name?: string;
  title?: string;
  experience?: string;
  skills?: string[];
  targetRole?: string;
  settings: {
    emailNotifications: boolean;
    practiceReminders: boolean;
  };
}