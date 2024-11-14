import { NextResponse } from "next/server";
import { backupUserData } from "@/lib/firebase/backup";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const success = await backupUserData(userId);

    if (!success) {
      return NextResponse.json(
        { error: "Backup failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Backup error:", error);
    return NextResponse.json(
      { error: "Failed to create backup" },
      { status: 500 }
    );
  }
}