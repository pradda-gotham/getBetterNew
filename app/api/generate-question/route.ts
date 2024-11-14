import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userProfile, previousQuestions, previousResponses } = await req.json();

    // Generate a contextual prompt based on user profile and interview history
    const prompt = generatePrompt(userProfile, previousQuestions, previousResponses);

    // Generate question using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Generate challenging but appropriate interview questions based on the candidate's profile and previous responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Process and structure the generated question
    const questionData = processQuestionResponse(completion.choices[0].message.content);

    return NextResponse.json(questionData);
  } catch (error: any) {
    console.error("Error generating question:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}

function generatePrompt(
  userProfile: any,
  previousQuestions: any[],
  previousResponses: any[]
): string {
  let prompt = `Generate a relevant interview question for a candidate with the following profile:\n`;
  
  // Add profile information
  if (userProfile) {
    prompt += `- Experience Level: ${userProfile.experience}\n`;
    prompt += `- Skills: ${userProfile.skills.join(", ")}\n`;
    prompt += `- Target Role: ${userProfile.targetRole}\n`;
  }

  // Add context from previous questions and responses
  if (previousQuestions?.length) {
    prompt += "\nPrevious questions asked:\n";
    previousQuestions.forEach((q, i) => {
      prompt += `${i + 1}. ${q.question}\n`;
    });
  }

  // Add requirements
  prompt += `\nRequirements:
- Question should be specific and relevant to the candidate's experience level
- Include a mix of technical and behavioral aspects where appropriate
- Question should build upon previous responses
- Include follow-up points to evaluate the response
- Provide expected key points for a good answer`;

  return prompt;
}

function processQuestionResponse(response: string): any {
  // Parse and structure the AI response
  const lines = response.split("\n").filter(line => line.trim());
  
  return {
    id: Date.now().toString(),
    question: lines[0].replace(/^Q:\s*/, ""),
    type: determineQuestionType(lines[0]),
    expectedPoints: extractExpectedPoints(lines),
    followUp: extractFollowUpPoints(lines),
    difficulty: calculateDifficulty(lines[0]),
  };
}

function determineQuestionType(question: string): string {
  const technicalPatterns = /code|algorithm|design|architecture|implement|debug/i;
  const behavioralPatterns = /tell me about|describe|how did you|what would you|situation/i;
  
  if (technicalPatterns.test(question)) return "technical";
  if (behavioralPatterns.test(question)) return "behavioral";
  return "general";
}

function extractExpectedPoints(lines: string[]): string[] {
  const points: string[] = [];
  let collectingPoints = false;

  for (const line of lines) {
    if (line.toLowerCase().includes("key points") || line.toLowerCase().includes("expected")) {
      collectingPoints = true;
      continue;
    }
    if (collectingPoints && line.trim().startsWith("-")) {
      points.push(line.trim().substring(1).trim());
    }
  }

  return points;
}

function extractFollowUpPoints(lines: string[]): string[] {
  const points: string[] = [];
  let collectingPoints = false;

  for (const line of lines) {
    if (line.toLowerCase().includes("follow-up")) {
      collectingPoints = true;
      continue;
    }
    if (collectingPoints && line.trim().startsWith("-")) {
      points.push(line.trim().substring(1).trim());
    }
  }

  return points;
}

function calculateDifficulty(question: string): string {
  const complexityIndicators = [
    "complex", "advanced", "expert", "difficult", "challenging",
    "optimize", "scale", "architecture", "design", "improve"
  ];
  
  const count = complexityIndicators.filter(indicator => 
    question.toLowerCase().includes(indicator)
  ).length;

  if (count >= 3) return "advanced";
  if (count >= 1) return "intermediate";
  return "beginner";
}