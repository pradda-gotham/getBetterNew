import { NextResponse } from "next/server";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { storage } from "@/lib/firebase-admin";

const client = new TextToSpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // Generate speech
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: "en-US",
        name: "en-US-Neural2-D",
        ssmlGender: "NEUTRAL",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 0.9,
        pitch: 0,
        volumeGainDb: 0,
      },
    });

    if (!response.audioContent) {
      throw new Error("Failed to generate audio");
    }

    // Upload to Firebase Storage
    const fileName = `tts/${Date.now()}.mp3`;
    const file = storage.file(fileName);
    await file.save(response.audioContent as Buffer, {
      metadata: {
        contentType: "audio/mp3",
      },
    });

    // Get public URL
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    return NextResponse.json({ audioUrl: url });
  } catch (error: any) {
    console.error("TTS generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}