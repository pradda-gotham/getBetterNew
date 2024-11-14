import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET() {
  try {
    // Check Firebase connection
    await db.collection('health').doc('check').set({
      timestamp: new Date(),
    });

    // Add more health checks here (e.g., AI services, storage)

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok',
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}