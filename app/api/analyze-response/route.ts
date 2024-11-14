import { NextResponse } from "next/server";
import OpenAI from "openai";
import { AssemblyAI } from "assemblyai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assemblyai = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { audioUrl, question, questionId } = await req.json();

    // 1. Transcribe audio using AssemblyAI
    const transcript = await assemblyai.transcripts.create({
      audio_url: audioUrl,
      language_detection: true,
      sentiment_analysis: true,
      entity_detection: true,
      speech_threshold: 0.2,
      format_text: true,
    });

    // 2. Analyze response using GPT-4
    const analysis = await analyzeResponse(transcript.text, question);

    // 3. Generate improvement suggestions
    const improvements = await generateImprovements(transcript.text, analysis);

    // 4. Combine all analysis results
    const result = {
      transcript: transcript.text,
      sentiment: transcript.sentiment_analysis_results,
      entities: transcript.entities,
      analysis: {
        ...analysis,
        improvements,
        score: calculateScore(transcript, analysis),
      },
      metrics: calculateMetrics(transcript, analysis),
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error analyzing response:", error);
    return NextResponse.json(
      { error: "Failed to analyze response" },
      { status: 500 }
    );
  }
}

async function analyzeResponse(transcript: string, question: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert interview evaluator. Analyze the following interview response based on:
- Relevance to the question
- Clarity and structure
- Technical accuracy (if applicable)
- Use of specific examples
- Communication effectiveness`
      },
      {
        role: "user",
        content: `Question: ${question}\n\nResponse: ${transcript}`
      }
    ],
    temperature: 0.5,
    max_tokens: 1000,
  });

  return {
    content: completion.choices[0].message.content,
    keyPoints: extractKeyPoints(completion.choices[0].message.content),
    strengths: extractStrengths(completion.choices[0].message.content),
    weaknesses: extractWeaknesses(completion.choices[0].message.content),
  };
}

async function generateImprovements(transcript: string, analysis: any) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Generate specific, actionable improvements based on the interview response analysis."
      },
      {
        role: "user",
        content: `Analysis: ${JSON.stringify(analysis)}\n\nTranscript: ${transcript}`
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return extractImprovements(completion.choices[0].message.content);
}

function calculateScore(transcript: any, analysis: any): number {
  let score = 70; // Base score

  // Adjust based on sentiment analysis
  const positiveSentiments = transcript.sentiment_analysis_results.filter(
    (r: any) => r.sentiment === "POSITIVE"
  ).length;
  score += (positiveSentiments / transcript.sentiment_analysis_results.length) * 10;

  // Adjust based on detected entities
  score += Math.min(transcript.entities.length * 2, 10);

  // Adjust based on analysis strengths and weaknesses
  score += analysis.strengths.length * 3;
  score -= analysis.weaknesses.length * 2;

  // Normalize score
  return Math.min(Math.max(score, 0), 100);
}

function calculateMetrics(transcript: any, analysis: any) {
  return {
    clarity: calculateClarityScore(transcript, analysis),
    relevance: calculateRelevanceScore(analysis),
    technicalAccuracy: calculateTechnicalScore(analysis),
    communication: calculateCommunicationScore(transcript),
  };
}

function calculateClarityScore(transcript: any, analysis: any): number {
  // Implementation of clarity scoring algorithm
  let score = 80;
  
  // Analyze sentence structure and coherence
  const sentences = transcript.text.split(/[.!?]+/).filter(Boolean);
  const avgWordsPerSentence = sentences.reduce((acc: number, s: string) => 
    acc + s.split(/\s+/).length, 0) / sentences.length;
  
  // Penalize for very long or very short sentences
  if (avgWordsPerSentence > 25) score -= 10;
  if (avgWordsPerSentence < 5) score -= 10;
  
  // Consider analysis factors
  if (analysis.strengths.some((s: string) => /clear|concise|well-structured/i.test(s))) {
    score += 10;
  }
  if (analysis.weaknesses.some((w: string) => /unclear|confusing|rambling/i.test(w))) {
    score -= 15;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function calculateRelevanceScore(analysis: any): number {
  // Implementation of relevance scoring algorithm
  let score = 75;
  
  // Analyze key points coverage
  score += analysis.keyPoints.length * 5;
  
  // Consider direct relevance from analysis
  if (analysis.content.toLowerCase().includes("directly addressed")) score += 10;
  if (analysis.content.toLowerCase().includes("off-topic")) score -= 15;
  
  return Math.min(Math.max(score, 0), 100);
}

function calculateTechnicalScore(analysis: any): number {
  // Implementation of technical accuracy scoring algorithm
  let score = 70;
  
  // Analyze technical content
  const technicalTerms = analysis.content.match(/technical|algorithm|system|design|code|implementation/gi);
  if (technicalTerms) score += technicalTerms.length * 3;
  
  // Consider accuracy from analysis
  if (analysis.content.toLowerCase().includes("technically accurate")) score += 15;
  if (analysis.content.toLowerCase().includes("technical error")) score -= 20;
  
  return Math.min(Math.max(score, 0), 100);
}

function calculateCommunicationScore(transcript: any): number {
  // Implementation of communication scoring algorithm
  let score = 85;
  
  // Analyze speech patterns
  const fillerWords = (transcript.text.match(/um|uh|like|you know|sort of/gi) || []).length;
  score -= fillerWords * 2;
  
  // Consider sentiment distribution
  const sentiments = transcript.sentiment_analysis_results;
  const positiveRatio = sentiments.filter((s: any) => s.sentiment === "POSITIVE").length / sentiments.length;
  score += positiveRatio * 10;
  
  return Math.min(Math.max(score, 0), 100);
}

function extractKeyPoints(content: string): string[] {
  const points: string[] = [];
  const lines = content.split("\n");
  let collectingPoints = false;

  for (const line of lines) {
    if (line.toLowerCase().includes("key points")) {
      collectingPoints = true;
      continue;
    }
    if (collectingPoints && line.trim().startsWith("-")) {
      points.push(line.trim().substring(1).trim());
    }
  }

  return points;
}

function extractStrengths(content: string): string[] {
  const strengths: string[] = [];
  const lines = content.split("\n");
  let collectingStrengths = false;

  for (const line of lines) {
    if (line.toLowerCase().includes("strengths")) {
      collectingStrengths = true;
      continue;
    }
    if (collectingStrengths && line.trim().startsWith("-")) {
      strengths.push(line.trim().substring(1).trim());
    }
  }

  return strengths;
}

function extractWeaknesses(content: string): string[] {
  const weaknesses: string[] = [];
  const lines = content.split("\n");
  let collectingWeaknesses = false;

  for (const line of lines) {
    if (line.toLowerCase().includes("weaknesses") || line.toLowerCase().includes("areas for improvement")) {
      collectingWeaknesses = true;
      continue;
    }
    if (collectingWeaknesses && line.trim().startsWith("-")) {
      weaknesses.push(line.trim().substring(1).trim());
    }
  }

  return weaknesses;
}

function extractImprovements(content: string): string[] {
  return content
    .split("\n")
    .filter(line => line.trim().startsWith("-"))
    .map(line => line.trim().substring(1).trim());
}