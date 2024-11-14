// Firestore Schema Types
export interface User {
  id: string;
  email: string;
  name?: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  settings: UserSettings;
  resumeUrl?: string;
  resumeAnalysis?: ResumeAnalysis;
}

export interface UserSettings {
  emailNotifications: boolean;
  practiceReminders: boolean;
  darkMode: boolean;
}

export interface ResumeAnalysis {
  skills: {
    technical: string[];
    soft: string[];
  };
  experience: {
    years: number;
    level: string;
    positions: Position[];
  };
  education: Education[];
  projects: Project[];
}

export interface Position {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  type: "technical" | "behavioral" | "mock";
  status: "in_progress" | "completed";
  startTime: string;
  endTime?: string;
  questions: Question[];
  responses: Response[];
  analysis: SessionAnalysis;
}

export interface Question {
  id: string;
  type: string;
  difficulty: string;
  question: string;
  expectedPoints: string[];
}

export interface Response {
  id: string;
  questionId: string;
  audioUrl: string;
  transcript: string;
  analysis: ResponseAnalysis;
}

export interface ResponseAnalysis {
  score: number;
  sentiment: string;
  keyPoints: string[];
  improvements: string[];
  metrics: {
    clarity: number;
    confidence: number;
    relevance: number;
  };
}

export interface SessionAnalysis {
  overallScore: number;
  duration: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}