import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { resumeAnalysis, jobAnalysis } = await req.json();

    // Generate match analysis using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert job match analyzer. Compare the candidate's profile with job requirements and provide:
            - Overall match percentage
            - Skills match analysis
            - Experience match analysis
            - Education match analysis
            - Strengths and gaps
            - Specific recommendations for improving match
            Provide detailed, actionable insights.`,
        },
        {
          role: "user",
          content: `Resume Analysis: ${JSON.stringify(resumeAnalysis)}
          Job Analysis: ${JSON.stringify(jobAnalysis)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Process and structure the match analysis
    const analysis = processMatchAnalysis(
      completion.choices[0].message.content,
      resumeAnalysis,
      jobAnalysis
    );

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Job match analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze job match" },
      { status: 500 }
    );
  }
}

function processMatchAnalysis(content: string, resumeAnalysis: any, jobAnalysis: any) {
  const sections = content.split("\n\n");
  
  return {
    overallMatch: calculateOverallMatch(resumeAnalysis, jobAnalysis),
    skillsMatch: {
      percentage: calculateSkillsMatch(resumeAnalysis.skills, jobAnalysis.skills),
      matching: findMatchingSkills(resumeAnalysis.skills, jobAnalysis.skills),
      missing: findMissingSkills(resumeAnalysis.skills, jobAnalysis.skills),
    },
    experienceMatch: {
      percentage: calculateExperienceMatch(resumeAnalysis.experience, jobAnalysis.requirements.experience),
      analysis: analyzeExperience(resumeAnalysis.experience, jobAnalysis.requirements.experience),
    },
    educationMatch: {
      percentage: calculateEducationMatch(resumeAnalysis.education, jobAnalysis.requirements.education),
      analysis: analyzeEducation(resumeAnalysis.education, jobAnalysis.requirements.education),
    },
    strengths: extractStrengths(sections),
    gaps: extractGaps(sections),
    recommendations: extractRecommendations(sections),
  };
}

function calculateOverallMatch(resume: any, job: any): number {
  const weights = {
    skills: 0.4,
    experience: 0.3,
    education: 0.2,
    other: 0.1,
  };

  const skillsScore = calculateSkillsMatch(resume.skills, job.skills);
  const experienceScore = calculateExperienceMatch(resume.experience, job.requirements.experience);
  const educationScore = calculateEducationMatch(resume.education, job.requirements.education);
  const otherScore = calculateOtherFactors(resume, job);

  const weightedScore =
    skillsScore * weights.skills +
    experienceScore * weights.experience +
    educationScore * weights.education +
    otherScore * weights.other;

  return Math.round(weightedScore);
}

function calculateSkillsMatch(resumeSkills: any, jobSkills: any): number {
  const allJobSkills = [...jobSkills.technical, ...jobSkills.soft];
  const allResumeSkills = [...resumeSkills.technical, ...resumeSkills.soft];

  const matchingSkills = allJobSkills.filter(skill =>
    allResumeSkills.some(resumeSkill =>
      resumeSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );

  return Math.round((matchingSkills.length / allJobSkills.length) * 100);
}

function findMatchingSkills(resumeSkills: any, jobSkills: any): string[] {
  const allJobSkills = [...jobSkills.technical, ...jobSkills.soft];
  const allResumeSkills = [...resumeSkills.technical, ...resumeSkills.soft];

  return allJobSkills.filter(skill =>
    allResumeSkills.some(resumeSkill =>
      resumeSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
}

function findMissingSkills(resumeSkills: any, jobSkills: any): string[] {
  const allJobSkills = [...jobSkills.technical, ...jobSkills.soft];
  const allResumeSkills = [...resumeSkills.technical, ...resumeSkills.soft];

  return allJobSkills.filter(skill =>
    !allResumeSkills.some(resumeSkill =>
      resumeSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
}

function calculateExperienceMatch(resumeExp: any, jobExp: any): number {
  let score = 70; // Base score

  // Years of experience
  if (resumeExp.years >= jobExp.years) {
    score += 20;
  } else if (resumeExp.years >= jobExp.years * 0.7) {
    score += 10;
  }

  // Level match
  if (resumeExp.level === jobExp.level) {
    score += 10;
  }

  return Math.min(score, 100);
}

function analyzeExperience(resumeExp: any, jobExp: any): string {
  if (resumeExp.years >= jobExp.years) {
    return "Meets or exceeds required experience";
  } else if (resumeExp.years >= jobExp.years * 0.7) {
    return "Close to required experience";
  }
  return "Below required experience";
}

function calculateEducationMatch(resumeEdu: any, jobEdu: any): number {
  let score = 70; // Base score

  const educationLevels = {
    "Bachelor": 1,
    "Master": 2,
    "Ph.D.": 3,
    "Doctorate": 3,
  };

  const requiredLevel = Math.max(
    ...jobEdu.map((edu: any) => educationLevels[edu.degree] || 0)
  );
  const candidateLevel = Math.max(
    ...resumeEdu.map((edu: any) => educationLevels[edu.degree] || 0)
  );

  if (candidateLevel >= requiredLevel) {
    score += 30;
  } else if (candidateLevel === requiredLevel - 1) {
    score += 15;
  }

  return Math.min(score, 100);
}

function analyzeEducation(resumeEdu: any, jobEdu: any): string {
  const educationLevels = {
    "Bachelor": 1,
    "Master": 2,
    "Ph.D.": 3,
    "Doctorate": 3,
  };

  const requiredLevel = Math.max(
    ...jobEdu.map((edu: any) => educationLevels[edu.degree] || 0)
  );
  const candidateLevel = Math.max(
    ...resumeEdu.map((edu: any) => educationLevels[edu.degree] || 0)
  );

  if (candidateLevel > requiredLevel) {
    return "Exceeds educational requirements";
  } else if (candidateLevel === requiredLevel) {
    return "Meets educational requirements";
  }
  return "Below educational requirements";
}

function calculateOtherFactors(resume: any, job: any): number {
  let score = 70;

  // Consider certifications
  if (resume.certifications?.length && job.requirements.certifications?.length) {
    const matchingCerts = job.requirements.certifications.filter((cert: string) =>
      resume.certifications.some((resumeCert: string) =>
        resumeCert.toLowerCase().includes(cert.toLowerCase())
      )
    );
    score += (matchingCerts.length / job.requirements.certifications.length) * 30;
  }

  return Math.min(score, 100);
}

function extractStrengths(sections: string[]): string[] {
  const strengthsSection = sections.find(s => 
    s.toLowerCase().includes("strength") || 
    s.toLowerCase().includes("match")
  ) || "";
  
  return strengthsSection
    .split("\n")
    .filter(line => line.trim().startsWith("-"))
    .map(strength => strength.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function extractGaps(sections: string[]): string[] {
  const gapsSection = sections.find(s => 
    s.toLowerCase().includes("gap") || 
    s.toLowerCase().includes("missing")
  ) || "";
  
  return gapsSection
    .split("\n")
    .filter(line => line.trim().startsWith("-"))
    .map(gap => gap.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function extractRecommendations(sections: string[]): string[] {
  const recommendationsSection = sections.find(s => 
    s.toLowerCase().includes("recommend") || 
    s.toLowerCase().includes("suggest")
  ) || "";
  
  return recommendationsSection
    .split("\n")
    .filter(line => line.trim().startsWith("-"))
    .map(rec => rec.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}