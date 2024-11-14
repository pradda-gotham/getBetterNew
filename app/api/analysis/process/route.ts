import { NextResponse } from "next/server";
import { analyzeInterviewResponse } from "@/lib/ai-analysis";
import { storage } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { audioUrl, question, context } = await req.json();

    // Download audio from Firebase Storage
    const audioRef = storage.file(audioUrl.split("/").pop());
    const [audioBuffer] = await audioRef.download();
    const audioBlob = new Blob([audioBuffer], { type: "audio/webm" });

    // Process analysis
    const analysis = await analyzeInterviewResponse(
      audioBlob,
      question,
      context
    );

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Analysis processing error:", error);
    return NextResponse.json(
      { error: "Failed to process analysis" },
      { status: 500 }
    );
  }
}