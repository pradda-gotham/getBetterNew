import { NextResponse } from 'next/server';
import { analyzeAudioResponse } from '@/lib/ai-services';
import { openai } from '@/lib/ai-services';

export async function POST(req: Request) {
  try {
    const { audioUrl, question } = await req.json();
    
    // Get transcript and analysis from AssemblyAI
    const audioAnalysis = await analyzeAudioResponse(audioUrl);
    
    // Get detailed feedback from GPT-4
    const feedback = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert interview evaluator. Provide detailed feedback on the response."
        },
        {
          role: "user",
          content: `Question: ${question}\nResponse: ${audioAnalysis.text}`
        }
      ]
    });

    return NextResponse.json({
      transcript: audioAnalysis.text,
      sentiment: audioAnalysis.sentiment_analysis_results,
      entities: audioAnalysis.entities,
      feedback: feedback.choices[0].message.content
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}