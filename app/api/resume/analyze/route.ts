import { NextResponse } from "next/server";
import OpenAI from "openai";
import { storage } from "@/lib/firebase-admin";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { resumeUrl } = await req.json();

    // Download resume content
    const response = await fetch(resumeUrl);
    const buffer = await response.arrayBuffer();

    // Convert to base64 for GPT-4 Vision
    const base64Content = Buffer.from(buffer).toString("base64");
    
    // Analyze resume using GPT-4 Vision
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert resume analyzer. Extract and analyze the following information:
            - Skills (technical and soft skills)
            - Experience level and years
            - Education details
            - Key achievements
            - Project highlights
            - Areas for improvement
            Categorize skills by type and provide detailed analysis.`,
        },
        {
          role: "user",
          content: [
            {
              type: "image",
              image_url: {
                url: `data:application/pdf;base64,${base64Content}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4096,
    });

    // Process and structure the analysis
    const analysis = processAnalysis(completion.choices[0].message.content);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}

function processAnalysis(content: string) {
  const sections = content.split("\n\n");
  
  return {
    skills: {
      technical: extractSkills(sections, "technical"),
      soft: extractSkills(sections, "soft"),
      domain: extractSkills(sections, "domain"),
    },
    experience: extractExperience(sections),
    education: extractEducation(sections),
    achievements: extractAchievements(sections),
    projects: extractProjects(sections),
    improvements: extractImprovements(sections),
    summary: generateSummary(sections),
    score: calculateScore(sections),
  };
}

function extractSkills(sections: string[], type: string): string[] {
  const skillsSection = sections.find(s => 
    s.toLowerCase().includes("skills") && s.toLowerCase().includes(type)
  ) || "";
  
  return skillsSection
    .split("\n")
    .slice(1)
    .map(skill => skill.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function extractExperience(sections: string[]): any {
  const experienceSection = sections.find(s => s.toLowerCase().includes("experience")) || "";
  const lines = experienceSection.split("\n").filter(Boolean);
  
  let totalYears = 0;
  const positions = [];
  let currentPosition: any = {};

  for (const line of lines) {
    if (line.match(/\d{4}/)) {
      if (currentPosition.title) {
        positions.push(currentPosition);
      }
      currentPosition = { title: line };
    } else if (currentPosition.title) {
      if (!currentPosition.details) {
        currentPosition.details = [];
      }
      currentPosition.details.push(line.replace(/^[-•]\s*/, ""));
    }
  }

  if (currentPosition.title) {
    positions.push(currentPosition);
  }

  // Calculate total years
  const years = lines.join(" ").match(/\d+\s*(?:year|yr)s?/gi);
  if (years) {
    totalYears = years.reduce((acc, year) => {
      const num = parseInt(year);
      return isNaN(num) ? acc : acc + num;
    }, 0);
  }

  return {
    totalYears,
    positions,
    level: determineExperienceLevel(totalYears),
  };
}

function determineExperienceLevel(years: number): string {
  if (years < 2) return "Entry Level";
  if (years < 5) return "Mid Level";
  if (years < 8) return "Senior Level";
  return "Expert Level";
}

function extractEducation(sections: string[]): any[] {
  const educationSection = sections.find(s => s.toLowerCase().includes("education")) || "";
  return educationSection
    .split("\n")
    .slice(1)
    .filter(Boolean)
    .map(edu => {
      const [degree, ...rest] = edu.split("@").map(s => s.trim());
      const institution = rest.join("@");
      return { degree, institution };
    });
}

function extractAchievements(sections: string[]): string[] {
  const achievementsSection = sections.find(s => 
    s.toLowerCase().includes("achievement") || 
    s.toLowerCase().includes("accomplishment")
  ) || "";
  
  return achievementsSection
    .split("\n")
    .slice(1)
    .map(achievement => achievement.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function extractProjects(sections: string[]): any[] {
  const projectsSection = sections.find(s => s.toLowerCase().includes("project")) || "";
  const projects = [];
  let currentProject: any = {};

  for (const line of projectsSection.split("\n").filter(Boolean)) {
    if (line.includes(":")) {
      if (currentProject.name) {
        projects.push(currentProject);
      }
      const [name, ...description] = line.split(":");
      currentProject = {
        name: name.trim(),
        description: description.join(":").trim(),
        technologies: [],
      };
    } else if (line.toLowerCase().includes("technolog") || line.toLowerCase().includes("stack")) {
      currentProject.technologies = line
        .replace(/^[-•]\s*technologies?:?\s*/i, "")
        .split(/[,;]/)
        .map((t: string) => t.trim())
        .filter(Boolean);
    }
  }

  if (currentProject.name) {
    projects.push(currentProject);
  }

  return projects;
}

function extractImprovements(sections: string[]): string[] {
  const improvementsSection = sections.find(s => 
    s.toLowerCase().includes("improvement") || 
    s.toLowerCase().includes("recommendation")
  ) || "";
  
  return improvementsSection
    .split("\n")
    .slice(1)
    .map(improvement => improvement.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function generateSummary(sections: string[]): string {
  const relevantSections = sections.filter(s => 
    !s.toLowerCase().includes("improvement") &&
    !s.toLowerCase().includes("recommendation")
  );
  
  return relevantSections
    .join(" ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateScore(sections: string[]): number {
  let score = 70; // Base score
  
  // Analyze completeness
  const requiredSections = ["experience", "education", "skills", "projects"];
  score += requiredSections.filter(section => 
    sections.some(s => s.toLowerCase().includes(section))
  ).length * 5;

  // Analyze detail level
  const details = sections.join(" ").match(/\d+|%|\$|[A-Z]{2,}|[a-z]{7,}/g) || [];
  score += Math.min(details.length, 20);

  // Normalize score
  return Math.min(Math.max(score, 0), 100);
}