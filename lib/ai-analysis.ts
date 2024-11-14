import OpenAI from 'openai';
import { AssemblyAI } from 'assemblyai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assemblyai = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY,
});

export interface AnalysisResult {
  transcript: string;
  sentiment: SentimentAnalysis;
  behavioral: BehavioralAnalysis;
  technical: TechnicalAnalysis;
  communication: CommunicationAnalysis;
  recommendations: string[];
  score: number;
}

interface SentimentAnalysis {
  overall: string;
  confidence: number;
  segments: {
    text: string;
    sentiment: string;
    confidence: number;
  }[];
}

interface BehavioralAnalysis {
  traits: {
    name: string;
    score: number;
    description: string;
  }[];
  strengths: string[];
  improvements: string[];
}

interface TechnicalAnalysis {
  accuracy: number;
  depth: number;
  relevance: number;
  keyPoints: string[];
  missingPoints: string[];
}

interface CommunicationAnalysis {
  clarity: number;
  confidence: number;
  pace: number;
  structure: number;
  fillerWords: {
    word: string;
    count: number;
  }[];
}

export async function analyzeInterviewResponse(
  audioBlob: Blob,
  question: string,
  context: {
    jobRole: string;
    experienceLevel: string;
    questionType: string;
    expectedPoints: string[];
  }
): Promise<AnalysisResult> {
  try {
    // 1. Transcribe and analyze audio with AssemblyAI
    const transcript = await assemblyai.transcripts.create({
      audio: audioBlob,
      language_detection: true,
      sentiment_analysis: true,
      entity_detection: true,
      speech_threshold: 0.2,
      format_text: true,
      content_safety: true,
      auto_highlights: true,
    });

    // 2. Analyze with GPT-4
    const gptAnalysis = await analyzeWithGPT4(
      transcript.text,
      question,
      context
    );

    // 3. Process sentiment analysis
    const sentimentAnalysis = processSentimentAnalysis(
      transcript.sentiment_analysis_results
    );

    // 4. Analyze behavioral aspects
    const behavioralAnalysis = await analyzeBehavioralAspects(
      transcript.text,
      gptAnalysis
    );

    // 5. Analyze technical content
    const technicalAnalysis = await analyzeTechnicalContent(
      transcript.text,
      context,
      gptAnalysis
    );

    // 6. Analyze communication
    const communicationAnalysis = analyzeCommunication(transcript);

    // 7. Generate recommendations
    const recommendations = await generateRecommendations(
      sentimentAnalysis,
      behavioralAnalysis,
      technicalAnalysis,
      communicationAnalysis
    );

    // 8. Calculate overall score
    const score = calculateOverallScore({
      sentiment: sentimentAnalysis,
      behavioral: behavioralAnalysis,
      technical: technicalAnalysis,
      communication: communicationAnalysis,
    });

    return {
      transcript: transcript.text,
      sentiment: sentimentAnalysis,
      behavioral: behavioralAnalysis,
      technical: technicalAnalysis,
      communication: communicationAnalysis,
      recommendations,
      score,
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

async function analyzeWithGPT4(
  transcript: string,
  question: string,
  context: any
): Promise<any> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert interview analyzer. Analyze the following interview response considering:
          - Relevance to the question
          - Technical accuracy
          - Communication effectiveness
          - Behavioral indicators
          - Professional competency
          
          Context:
          - Job Role: ${context.jobRole}
          - Experience Level: ${context.experienceLevel}
          - Question Type: ${context.questionType}
          - Expected Points: ${context.expectedPoints.join(", ")}`
      },
      {
        role: "user",
        content: `Question: ${question}\n\nResponse: ${transcript}`
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
}

function processSentimentAnalysis(results: any[]): SentimentAnalysis {
  const sentiments = results.map(result => ({
    text: result.text,
    sentiment: result.sentiment,
    confidence: result.confidence,
  }));

  const overallSentiment = calculateOverallSentiment(sentiments);

  return {
    overall: overallSentiment.sentiment,
    confidence: overallSentiment.confidence,
    segments: sentiments,
  };
}

async function analyzeBehavioralAspects(
  transcript: string,
  gptAnalysis: string
): Promise<BehavioralAnalysis> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Analyze the behavioral aspects of this interview response, focusing on key traits like leadership, problem-solving, teamwork, and adaptability."
      },
      {
        role: "user",
        content: `Transcript: ${transcript}\n\nInitial Analysis: ${gptAnalysis}`
      }
    ],
  });

  const analysis = completion.choices[0].message.content;
  return processBehavioralAnalysis(analysis);
}

async function analyzeTechnicalContent(
  transcript: string,
  context: any,
  gptAnalysis: string
): Promise<TechnicalAnalysis> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Analyze the technical accuracy and depth of this response. Expected points: ${context.expectedPoints.join(", ")}`
      },
      {
        role: "user",
        content: `Transcript: ${transcript}\n\nInitial Analysis: ${gptAnalysis}`
      }
    ],
  });

  const analysis = completion.choices[0].message.content;
  return processTechnicalAnalysis(analysis, context.expectedPoints);
}

function analyzeCommunication(transcript: any): CommunicationAnalysis {
  // Analyze speech patterns and communication effectiveness
  const words = transcript.text.split(/\s+/);
  const fillerWords = countFillerWords(words);
  const pace = calculateSpeakingPace(transcript);
  const clarity = calculateClarity(transcript);
  const confidence = calculateConfidence(transcript);
  const structure = analyzeStructure(transcript.text);

  return {
    clarity,
    confidence,
    pace,
    structure,
    fillerWords,
  };
}

async function generateRecommendations(
  sentiment: SentimentAnalysis,
  behavioral: BehavioralAnalysis,
  technical: TechnicalAnalysis,
  communication: CommunicationAnalysis
): Promise<string[]> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Generate specific, actionable recommendations based on the interview analysis."
      },
      {
        role: "user",
        content: JSON.stringify({
          sentiment,
          behavioral,
          technical,
          communication,
        })
      }
    ],
  });

  return extractRecommendations(completion.choices[0].message.content);
}

function calculateOverallScore(analysis: {
  sentiment: SentimentAnalysis;
  behavioral: BehavioralAnalysis;
  technical: TechnicalAnalysis;
  communication: CommunicationAnalysis;
}): number {
  const weights = {
    technical: 0.4,
    behavioral: 0.25,
    communication: 0.25,
    sentiment: 0.1,
  };

  const technicalScore = calculateTechnicalScore(analysis.technical);
  const behavioralScore = calculateBehavioralScore(analysis.behavioral);
  const communicationScore = calculateCommunicationScore(analysis.communication);
  const sentimentScore = calculateSentimentScore(analysis.sentiment);

  return Math.round(
    technicalScore * weights.technical +
    behavioralScore * weights.behavioral +
    communicationScore * weights.communication +
    sentimentScore * weights.sentiment
  );
}

// Helper functions
function calculateOverallSentiment(segments: any[]) {
  const sentimentScores = {
    POSITIVE: 1,
    NEUTRAL: 0,
    NEGATIVE: -1,
  };

  const weightedSum = segments.reduce(
    (acc, segment) => acc + sentimentScores[segment.sentiment] * segment.confidence,
    0
  );

  const averageScore = weightedSum / segments.length;
  const confidence = segments.reduce((acc, segment) => acc + segment.confidence, 0) / segments.length;

  return {
    sentiment: averageScore > 0.3 ? "POSITIVE" : averageScore < -0.3 ? "NEGATIVE" : "NEUTRAL",
    confidence,
  };
}

function processBehavioralAnalysis(analysis: string): BehavioralAnalysis {
  // Extract behavioral traits and scores from GPT-4 analysis
  const traits = extractBehavioralTraits(analysis);
  const strengths = extractStrengths(analysis);
  const improvements = extractImprovements(analysis);

  return {
    traits,
    strengths,
    improvements,
  };
}

function processTechnicalAnalysis(
  analysis: string,
  expectedPoints: string[]
): TechnicalAnalysis {
  // Process technical analysis results
  const keyPoints = extractKeyPoints(analysis);
  const missingPoints = findMissingPoints(keyPoints, expectedPoints);
  const scores = calculateTechnicalScores(analysis, keyPoints, expectedPoints);

  return {
    ...scores,
    keyPoints,
    missingPoints,
  };
}

function countFillerWords(words: string[]): { word: string; count: number }[] {
  const fillerWords = ["um", "uh", "like", "you know", "sort of", "kind of"];
  return fillerWords
    .map(word => ({
      word,
      count: words.filter(w => w.toLowerCase() === word).length,
    }))
    .filter(result => result.count > 0);
}

function calculateSpeakingPace(transcript: any): number {
  const words = transcript.text.split(/\s+/).length;
  const duration = transcript.audio_duration;
  return (words / duration) * 60; // Words per minute
}

function calculateClarity(transcript: any): number {
  // Implement clarity calculation based on confidence scores
  return transcript.confidence * 100;
}

function calculateConfidence(transcript: any): number {
  // Analyze voice patterns and language for confidence indicators
  return transcript.confidence * 100;
}

function analyzeStructure(text: string): number {
  // Analyze response structure (intro, main points, conclusion)
  const hasIntro = /^(first|to begin|initially|in response)/i.test(text);
  const hasConclusion = /(in conclusion|to summarize|therefore|thus|finally)/i.test(text);
  const hasTransitions = /(additionally|moreover|furthermore|however|consequently)/i.test(text);

  let score = 70; // Base score
  if (hasIntro) score += 10;
  if (hasConclusion) score += 10;
  if (hasTransitions) score += 10;

  return Math.min(score, 100);
}

function extractBehavioralTraits(analysis: string): any[] {
  // Extract and score behavioral traits
  const traits = [];
  const traitPatterns = {
    leadership: /leadership|leading|guide|direct/i,
    problemSolving: /problem.?solving|resolution|solution/i,
    teamwork: /team|collaboration|cooperat/i,
    adaptability: /adapt|flexible|change/i,
    communication: /communicate|express|articulate/i,
  };

  for (const [trait, pattern] of Object.entries(traitPatterns)) {
    const matches = analysis.match(pattern);
    if (matches) {
      traits.push({
        name: trait,
        score: calculateTraitScore(analysis, pattern),
        description: extractTraitDescription(analysis, trait),
      });
    }
  }

  return traits;
}

function calculateTraitScore(analysis: string, pattern: RegExp): number {
  const matches = analysis.match(pattern)?.length || 0;
  return Math.min(matches * 20, 100);
}

function extractTraitDescription(analysis: string, trait: string): string {
  const sentences = analysis.split(/[.!?]+/);
  return sentences.find(s => s.toLowerCase().includes(trait)) || "";
}

function extractKeyPoints(analysis: string): string[] {
  return analysis
    .split("\n")
    .filter(line => line.trim().startsWith("-") || line.trim().startsWith("•"))
    .map(point => point.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function findMissingPoints(covered: string[], expected: string[]): string[] {
  return expected.filter(point =>
    !covered.some(cp => cp.toLowerCase().includes(point.toLowerCase()))
  );
}

function calculateTechnicalScores(
  analysis: string,
  keyPoints: string[],
  expectedPoints: string[]
): { accuracy: number; depth: number; relevance: number } {
  const accuracy = (keyPoints.length / expectedPoints.length) * 100;
  const depth = calculateResponseDepth(analysis);
  const relevance = calculateRelevance(keyPoints, expectedPoints);

  return {
    accuracy: Math.round(accuracy),
    depth: Math.round(depth),
    relevance: Math.round(relevance),
  };
}

function calculateResponseDepth(analysis: string): number {
  const technicalTerms = analysis.match(/\b(?:algorithm|system|framework|architecture|implementation|design|pattern|methodology)\b/gi)?.length || 0;
  const examples = analysis.match(/(?:for example|such as|like|instance)/gi)?.length || 0;
  const explanations = analysis.match(/(?:because|therefore|thus|hence|due to)/gi)?.length || 0;

  return Math.min((technicalTerms * 20 + examples * 15 + explanations * 15), 100);
}

function calculateRelevance(keyPoints: string[], expectedPoints: string[]): number {
  const relevantPoints = keyPoints.filter(point =>
    expectedPoints.some(ep => 
      point.toLowerCase().includes(ep.toLowerCase())
    )
  ).length;

  return (relevantPoints / expectedPoints.length) * 100;
}

function extractStrengths(analysis: string): string[] {
  const strengthSection = analysis.split(/strengths?:/i)[1]?.split(/weaknesses?:|improvements?:/i)[0] || "";
  return extractBulletPoints(strengthSection);
}

function extractImprovements(analysis: string): string[] {
  const improvementSection = analysis.split(/improvements?:|weaknesses?:/i)[1] || "";
  return extractBulletPoints(improvementSection);
}

function extractBulletPoints(text: string): string[] {
  return text
    .split("\n")
    .filter(line => line.trim().startsWith("-") || line.trim().startsWith("•"))
    .map(point => point.replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

function extractRecommendations(analysis: string): string[] {
  return analysis
    .split("\n")
    .filter(line => line.trim().startsWith("-"))
    .map(rec => rec.replace(/^-\s*/, ""))
    .filter(Boolean);
}

function calculateTechnicalScore(technical: TechnicalAnalysis): number {
  return (technical.accuracy + technical.depth + technical.relevance) / 3;
}

function calculateBehavioralScore(behavioral: BehavioralAnalysis): number {
  return behavioral.traits.reduce((acc, trait) => acc + trait.score, 0) / behavioral.traits.length;
}

function calculateCommunicationScore(communication: CommunicationAnalysis): number {
  return (
    communication.clarity +
    communication.confidence +
    Math.min(100, 100 - communication.fillerWords.reduce((acc, fw) => acc + fw.count * 5, 0)) +
    communication.structure
  ) / 4;
}

function calculateSentimentScore(sentiment: SentimentAnalysis): number {
  const sentimentScores = {
    POSITIVE: 100,
    NEUTRAL: 70,
    NEGATIVE: 40,
  };

  return sentimentScores[sentiment.overall] * sentiment.confidence;
}