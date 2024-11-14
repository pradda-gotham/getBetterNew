import OpenAI from 'openai';
import { AssemblyAI } from 'assemblyai';
import { GoogleVertexAI } from '@google-cloud/vertexai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const assemblyai = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY,
});

export const vertexai = new GoogleVertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: 'us-central1',
});

export async function generateInterviewQuestion(context: {
  userProfile: any;
  previousQuestions: any[];
  previousResponses: any[];
}) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert technical interviewer. Generate challenging but appropriate interview questions."
      },
      {
        role: "user",
        content: JSON.stringify(context)
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

export async function analyzeAudioResponse(audioUrl: string) {
  const transcript = await assemblyai.transcripts.create({
    audio_url: audioUrl,
    language_detection: true,
    sentiment_analysis: true,
    entity_detection: true,
  });

  return transcript;
}

export async function analyzeResume(pdfUrl: string) {
  const model = vertexai.preview.getModel('text-bison@001');
  
  const response = await model.predict(`
    Analyze this resume and extract:
    - Key skills
    - Experience level
    - Project highlights
    - Areas for improvement
    Resume URL: ${pdfUrl}
  `);

  return response.predictions[0];
}