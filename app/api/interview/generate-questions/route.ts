import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { resumeData, jobData } = await req.json();

    // Generate contextual prompt
    const prompt = generatePrompt(resumeData, jobData);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert technical interviewer specializing in generating personalized interview questions. Consider:
          - Candidate's experience level and skills
          - Job requirements and responsibilities
          - Industry best practices
          - Behavioral and technical aspects`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const questions = processQuestions(completion.choices[0].message.content);
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}

function generatePrompt(resumeData: any, jobData: any): string {
  return `Generate 5 interview questions based on this context:

Resume Skills: ${resumeData.skills.join(", ")}
Experience Level: ${resumeData.experience}
Job Title: ${jobData.title}
Job Requirements: ${jobData.requirements}

Generate a mix of:
1. Technical questions specific to the candidate's skills
2. System design questions appropriate for their level
3. Behavioral questions relevant to the role
4. Problem-solving scenarios
5. Role-specific questions

For each question, provide:
- Question text
- Type (technical/behavioral/system-design/problem-solving)
- Difficulty (junior/intermediate/senior)
- Expected key points in the answer
- Follow-up questions
- Evaluation criteria
- Red flags to watch for

Ensure questions are:
- Calibrated to the candidate's experience level
- Relevant to the job requirements
- Progressive in difficulty
- Clear and unambiguous
- Designed to reveal deep understanding`;
}

function processQuestions(content: string): any[] {
  const sections = content.split(/Question \d+:/g).filter(Boolean);
  
  return sections.map((section) => {
    const lines = section.trim().split("\n").filter(Boolean);
    const questionText = lines[0].trim();
    
    const typeMatch = section.match(/Type:\s*(.+)/i);
    const difficultyMatch = section.match(/Difficulty:\s*(.+)/i);
    const keyPointsStart = section.indexOf("Key Points:");
    const followUpStart = section.indexOf("Follow-up Questions:");
    const criteriaStart = section.indexOf("Evaluation Criteria:");
    const redFlagsStart = section.indexOf("Red Flags:");

    const keyPoints = extractSection(section, keyPointsStart, followUpStart);
    const followUpQuestions = extractSection(section, followUpStart, criteriaStart);
    const evaluationCriteria = extractSection(section, criteriaStart, redFlagsStart);
    const redFlags = extractSection(section, redFlagsStart);

    return {
      id: generateQuestionId(),
      question: questionText,
      type: typeMatch ? normalizeType(typeMatch[1].trim()) : "technical",
      difficulty: difficultyMatch ? normalizeDifficulty(difficultyMatch[1].trim()) : "intermediate",
      keyPoints,
      followUpQuestions,
      evaluationCriteria,
      redFlags,
      score: calculateQuestionScore(questionText, keyPoints.length),
    };
  });
}

function extractSection(content: string, startIndex: number, endIndex?: number): string[] {
  if (startIndex === -1) return [];
  
  const sectionContent = endIndex 
    ? content.slice(startIndex, endIndex)
    : content.slice(startIndex);

  return sectionContent
    .split("\n")
    .filter(line => line.trim().startsWith("-"))
    .map(line => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function normalizeType(type: string): string {
  const types = {
    "technical": ["technical", "coding", "programming"],
    "behavioral": ["behavioral", "soft skills", "communication"],
    "system-design": ["system design", "architecture", "design"],
    "problem-solving": ["problem solving", "algorithmic", "logic"],
  };

  for (const [normalizedType, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => type.toLowerCase().includes(keyword))) {
      return normalizedType;
    }
  }
  return "technical";
}

function normalizeDifficulty(difficulty: string): string {
  const levels = {
    "junior": ["junior", "entry", "basic", "easy"],
    "intermediate": ["intermediate", "mid", "moderate"],
    "senior": ["senior", "advanced", "expert", "hard"],
  };

  for (const [level, keywords] of Object.entries(levels)) {
    if (keywords.some(keyword => difficulty.toLowerCase().includes(keyword))) {
      return level;
    }
  }
  return "intermediate";
}

function generateQuestionId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateQuestionScore(question: string, keyPointsCount: number): number {
  let score = 70; // Base score

  // Adjust based on question complexity
  score += Math.min(question.length / 50, 10);
  score += Math.min(keyPointsCount * 2, 10);
  
  // Adjust based on question quality indicators
  if (question.includes("explain") || question.includes("describe")) score += 5;
  if (question.includes("compare") || question.includes("contrast")) score += 5;
  if (question.includes("why") || question.includes("how")) score += 5;

  return Math.min(Math.max(score, 0), 100);
}