import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { analysis, previousFeedback } = await req.json();

    // Generate personalized feedback using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert interview coach. Generate personalized feedback and improvement suggestions based on the interview analysis. Consider:
            - Previous feedback given
            - Progress patterns
            - Specific areas of improvement
            - Actionable next steps
            Provide constructive, encouraging feedback that helps the candidate improve.`
        },
        {
          role: "user",
          content: `Current Analysis: ${JSON.stringify(analysis)}
          Previous Feedback: ${JSON.stringify(previousFeedback)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const feedback = {
      suggestions: extractSuggestions(completion.choices[0].message.content),
      nextSteps: extractNextSteps(completion.choices[0].message.content),
      resources: generateResources(analysis),
      practiceExercises: generateExercises(analysis),
    };

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error("Feedback generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}

function extractSuggestions(content: string): string[] {
  return content
    .split("\n")
    .filter(line => line.trim().startsWith("-"))
    .map(suggestion => suggestion.replace(/^-\s*/, ""))
    .filter(Boolean);
}

function extractNextSteps(content: string): string[] {
  const nextStepsSection = content.split("next steps:")[1] || "";
  return nextStepsSection
    .split("\n")
    .filter(line => line.trim().startsWith("-"))
    .map(step => step.replace(/^-\s*/, ""))
    .filter(Boolean);
}

function generateResources(analysis: any): {
  title: string;
  url: string;
  type: string;
}[] {
  // Generate relevant learning resources based on analysis
  const resources = [];

  if (analysis.technical.missingPoints.length > 0) {
    resources.push({
      title: "Technical Concepts Deep Dive",
      url: "https://example.com/technical-concepts",
      type: "documentation",
    });
  }

  if (analysis.communication.clarity < 80) {
    resources.push({
      title: "Effective Communication Techniques",
      url: "https://example.com/communication",
      type: "video",
    });
  }

  if (analysis.behavioral.improvements.length > 0) {
    resources.push({
      title: "Behavioral Interview Mastery",
      url: "https://example.com/behavioral",
      type: "course",
    });
  }

  return resources;
}

function generateExercises(analysis: any): {
  title: string;
  description: string;
  duration: string;
}[] {
  // Generate practice exercises based on analysis
  const exercises = [];

  if (analysis.communication.fillerWords.length > 0) {
    exercises.push({
      title: "Filler Word Reduction",
      description: "Practice speaking for 2 minutes without using filler words",
      duration: "10 minutes",
    });
  }

  if (analysis.technical.depth < 80) {
    exercises.push({
      title: "Technical Deep Dive",
      description: "Explain a complex technical concept in simple terms",
      duration: "15 minutes",
    });
  }

  if (analysis.communication.structure < 80) {
    exercises.push({
      title: "STAR Method Practice",
      description: "Structure a response using the STAR method",
      duration: "20 minutes",
    });
  }

  return exercises;
}