import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { errors } = await req.json();

    // Batch write errors to Firestore
    const batch = db.batch();
    const errorsCollection = db.collection('errors');

    errors.forEach((error: any) => {
      const docRef = errorsCollection.doc();
      batch.set(docRef, {
        ...error,
        createdAt: new Date(),
      });
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error logging:', error);
    return NextResponse.json(
      { error: 'Failed to log errors' },
      { status: 500 }
    );
  }
}