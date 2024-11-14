import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { jobDescription } = await req.json();

    // Analyze job description using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert job analyzer. Extract and analyze the following information from job descriptions:
            - Required skills (technical and soft skills)
            - Experience requirements
            - Education requirements
            - Key responsibilities
            - Company culture indicators
            - Benefits and perks
            - Job level
            - Required certifications
            - Tech stack/tools
            Provide structured analysis with clear categorization.`,
        },
        {
          role: "user",
          content: jobDescription,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Process and structure the analysis
    const analysis = processJobAnalysis(completion.choices[0].message.content);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Job analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze job description" },
      { status: 500 }
    );
  }
}

function processJobAnalysis(content: string) {
  const sections = content.split("\n\n");
  
  return {
    skills: {
      technical: extractSkills(sections, "technical"),
      soft: extractSkills(sections, "soft"),
    },
    requirements: {
      experience: extractExperience(sections),
      education: extractEducation(sections),
      certifications: extractCertifications(sections),
    },
    responsibilities: extractResponsibilities(sections),
    techStack: extractTechStack(sections),
    culture: extractCulture(sections),
    benefits: extractBenefits(sections),
    level: determineJobLevel(sections),
    score: calculateJobScore(sections),
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
  
  const requirements = {
    years: 0,
    level: "",
    domains: [],
  };

  // Extract years of experience
  const yearsMatch = experienceSection.match(/(\d+)(?:\+)?\s*(?:years?|yrs?)/i);
  if (yearsMatch) {
    requirements.years = parseInt(yearsMatch[1]);
  }

  // Extract domains
  requirements.domains = lines
    .filter(line => line.includes("experience in") || line.includes("experience with"))
    .map(line => {
      const match = line.match(/experience (?:in|with)\s+([^.]+)/i);
      return match ? match[1].trim() : null;
    })
    .filter(Boolean);

  // Determine level
  requirements.level = determineExperienceLevel(requirements.years);

  return requirements;
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
    .filter(line => line.includes("degree") || line.includes("Bachelor") || line.includes("Master"))
    .map(edu => {
      const degree = edu.match(/(?:Bachelor'?s?|Master'?s?|Ph\.?D\.?|Doctorate)/i)?.[0] || "";
      const field = edu.match(/(?:in|of)\s+([^,\.]+)/i)?.[1] || "";
      return { degree, field };
    });
}

function extractCertifications(sections: string[]): string[] {
  const certSection = sections.find(s => 
    s.toLowerCase().includes("certification") || 
    s.toLowerCase().includes("certificate")
  ) || "";
  
  return certSection
    .split("\n")
    .slice(1)
    .map(cert => cert.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function extractResponsibilities(sections: string[]): string[] {
  const respSection = sections.find(s => 
    s.toLowerCase().includes("responsibilities") || 
    s.toLowerCase().includes("duties")
  ) || "";
  
  return respSection
    .split("\n")
    .slice(1)
    .map(resp => resp.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function extractTechStack(sections: string[]): string[] {
  const techSection = sections.find(s => 
    s.toLowerCase().includes("tech stack") || 
    s.toLowerCase().includes("technologies") ||
    s.toLowerCase().includes("tools")
  ) || "";
  
  return techSection
    .split("\n")
    .slice(1)
    .map(tech => tech.replace(/^[-•]\s*/, ""))
    .filter(Boolean)
    .reduce((acc: string[], tech) => {
      // Split by common separators and clean up
      return [...acc, ...tech.split(/[,/&]/).map(t => t.trim())];
    }, [])
    .filter(Boolean);
}

function extractCulture(sections: string[]): string[] {
  const cultureSection = sections.find(s => 
    s.toLowerCase().includes("culture") || 
    s.toLowerCase().includes("environment") ||
    s.toLowerCase().includes("values")
  ) || "";
  
  return cultureSection
    .split("\n")
    .slice(1)
    .map(culture => culture.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function extractBenefits(sections: string[]): string[] {
  const benefitsSection = sections.find(s => 
    s.toLowerCase().includes("benefits") || 
    s.toLowerCase().includes("perks") ||
    s.toLowerCase().includes("offer")
  ) || "";
  
  return benefitsSection
    .split("\n")
    .slice(1)
    .map(benefit => benefit.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function determineJobLevel(sections: string[]): string {
  const content = sections.join(" ").toLowerCase();
  
  if (content.includes("principal") || content.includes("architect")) {
    return "Principal/Architect";
  }
  if (content.includes("lead") || content.includes("senior")) {
    return "Senior/Lead";
  }
  if (content.includes("mid") || content.includes("intermediate")) {
    return "Mid-Level";
  }
  if (content.includes("junior") || content.includes("entry")) {
    return "Junior/Entry-Level";
  }
  
  return "Not Specified";
}

function calculateJobScore(sections: string[]): number {
  let score = 70; // Base score
  
  // Analyze completeness
  const requiredSections = [
    "skills",
    "experience",
    "education",
    "responsibilities",
    "tech stack"
  ];
  score += requiredSections.filter(section => 
    sections.some(s => s.toLowerCase().includes(section))
  ).length * 5;

  // Analyze detail level
  const details = sections.join(" ").match(/\d+|%|\$|[A-Z]{2,}|[a-z]{7,}/g) || [];
  score += Math.min(details.length, 20);

  // Normalize score
  return Math.min(Math.max(score, 0), 100);
}