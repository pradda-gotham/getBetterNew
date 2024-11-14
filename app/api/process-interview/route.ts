import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { audioUrl, questionId, sessionId } = await req.json();

    // 1. Transcribe audio using AssemblyAI
    const transcriptionResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        "Authorization": process.env.ASSEMBLY_AI_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        sentiment_analysis: true,
        entity_detection: true,
        auto_highlights: true
      })
    });

    const transcriptionData = await transcriptionResponse.json();

    // 2. Analyze response using OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert interviewer analyzing interview responses. Provide detailed feedback on content, delivery, and areas for improvement."
          },
          {
            role: "user",
            content: `Analyze this interview response: ${transcriptionData.text}`
          }
        ]
      })
    });

    const openaiData = await openaiResponse.json();

    // 3. Combine and structure the feedback
    const analysis = {
      transcript: transcriptionData.text,
      sentiment: transcriptionData.sentiment_analysis_results,
      entities: transcriptionData.entities,
      highlights: transcriptionData.auto_highlights_result,
      feedback: {
        content: openaiData.choices[0].message.content,
        score: calculateScore(transcriptionData, openaiData),
        keyPoints: extractKeyPoints(openaiData),
        improvements: extractImprovements(openaiData)
      }
    };

    // 4. Update the session document with results
    await updateDoc(doc(db, "interview_sessions", sessionId), {
      status: "completed",
      analysis
    });

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Error processing interview:", error);
    return NextResponse.json(
      { error: "Failed to process interview" },
      { status: 500 }
    );
  }
}

function calculateScore(transcriptionData: any, openaiData: any): number {
  // Implement scoring algorithm based on various factors
  let score = 70; // Base score

  // Adjust based on sentiment
  const positiveSentiments = transcriptionData.sentiment_analysis_results.filter(
    (r: any) => r.sentiment === "POSITIVE"
  ).length;
  score += (positiveSentiments / transcriptionData.sentiment_analysis_results.length) * 15;

  // Adjust based on detected entities and key points
  score += Math.min(transcriptionData.entities.length * 2, 10);

  // Normalize score
  return Math.min(Math.max(score, 0), 100);
}

function extractKeyPoints(openaiData: any): string[] {
  // Extract key points from OpenAI analysis
  const content = openaiData.choices[0].message.content;
  const points = content
    .split("\n")
    .filter((line: string) => line.trim().startsWith("-") || line.trim().startsWith("•"))
    .map((line: string) => line.trim().replace(/^[-•]\s*/, ""));
  
  return points.slice(0, 5); // Return top 5 key points
}

function extractImprovements(openaiData: any): string[] {
  // Extract improvement suggestions from OpenAI analysis
  const content = openaiData.choices[0].message.content.toLowerCase();
  const improvementSection = content.split("improvements").pop() || "";
  
  return improvementSection
    .split("\n")
    .filter((line: string) => line.trim().startsWith("-") || line.trim().startsWith("•"))
    .map((line: string) => line.trim().replace(/^[-•]\s*/, ""))
    .slice(0, 3); // Return top 3 improvements
}