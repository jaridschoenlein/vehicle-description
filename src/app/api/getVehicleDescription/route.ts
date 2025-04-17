// app/api/getVehicleDescription/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { year, make, vehiclemodel } = await req.json();

    const prompt = `Write a clear, professional description of a ${year} ${make} ${vehiclemodel}, highlighting its key features and appeal.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return NextResponse.json(
        { description: "No description generated." },
        { status: 500 }
      );
    }

    return NextResponse.json({ description: text });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { description: 'Error generating description.' },
      { status: 500 }
    );
  }
}
