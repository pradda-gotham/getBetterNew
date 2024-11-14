import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { resumeAnalysis, jobTitle, jobDescription } = await req.json();

    // Generate analysis using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert job match analyzer. Compare the candidate's resume with the job requirements and provide detailed analysis including:
          - Overall match percentage
          - Skills match percentage
          - Experience match percentage
          - Education match percentage
          - Matching skills
          - Missing skills
          - Key requirements
          - Strength areas
          - Development areas
          - Specific recommendations for improving match`
        },
        {
          role: "user",
          content: `Resume Analysis: ${JSON.stringify(resumeAnalysis)}
          Job Title: ${jobTitle}
          Job Description: ${jobDescription}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Process and structure the analysis
    const analysis = processAnalysis(completion.choices[0].message.content);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Job match analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze job match" },
      { status: 500 }
    );
  }
}

function processAnalysis(content: string) {
  // Extract structured information from GPT-4's response
  const lines = content.split("\n");
  
  return {
    overallMatch: extractPercentage(content, "overall match"),
    skillsMatch: extractPercentage(content, "skills match"),
    experienceMatch: extractPercentage(content, "experience match"),
    educationMatch: extractPercentage(content, "education match"),
    matchingSkills: extractList(content, "matching skills"),
    missingSkills: extractList(content, "missing skills"),
    keyRequirements: extractList(content, "key requirements"),
    strengthAreas: extractList(content, "strength areas"),
    developmentAreas: extractList(content, "development areas"),
    recommendations: extractList(content, "recommendations"),
  };
}

function extractPercentage(content: string, type: string): number {
  const regex = new RegExp(`${type}.*?(\\d+)%`, "i");
  const match = content.match(regex);
  return match ? parseInt(match[1]) : 0;
}

function extractList(content: string, type: string): string[] {
  const section = content.toLowerCase().split(type.toLowerCase())[1];
  if (!section) return [];
  
  const items = section
    .split("\n")
    .filter(line => line.trim().startsWith("-") || line.trim().startsWith("•"))
    .map(line => line.replace(/^[-•]\s*/, "").trim());
  
  return items.slice(0, type.includes("skill") ? 10 : 5);
}