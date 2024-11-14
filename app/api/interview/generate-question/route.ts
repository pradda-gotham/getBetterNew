import { NextResponse } from 'next/server';
import { generateInterviewQuestion } from '@/lib/ai-services';

export async function POST(req: Request) {
  try {
    const context = await req.json();
    const question = await generateInterviewQuestion(context);
    
    return NextResponse.json({ question });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}