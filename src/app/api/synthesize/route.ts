import { NextResponse } from 'next/server';
import { MOCK_SYNTHESIS_RESPONSE } from '@/services/mockData';
import type { SynthesisResponse } from '@/services/mockData';

const USE_LIVE_AI = false;

export async function POST(request: Request) {
  try {
    const { cdsXml, todaysNote } = await request.json();

    if (!cdsXml || !todaysNote) {
      return NextResponse.json(
        { error: 'Both cdsXml and todaysNote are required.' },
        { status: 400 }
      );
    }

    if (!USE_LIVE_AI) {
      // Simulate network latency for realistic UX during development
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json(MOCK_SYNTHESIS_RESPONSE);
    }

    // ── Live Gemini API path ──────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a clinical decision-support assistant for Ontario Family Physicians.
You will receive two inputs:
1. A CDS XML export from OntarioMD containing the patient's cumulative health record.
2. Today's free-hand clinical note written by the physician.

Your task is to synthesize these inputs and return a JSON object matching the SynthesisResponse schema with the following fields:
- patientSummary: A concise clinical summary of the patient.
- activeConditions: Array of active conditions with name, status, and relevance.
- medications: Array of current medications with name, dose, frequency, and any flags.
- alerts: Array of clinical alerts with severity ("critical" | "warning" | "info"), title, and description.
- diagnosticLinks: Array of diagnostic connections the physician may not have considered, each with a title, explanation, confidence score (0-1), and supporting evidence.
- recommendations: Array of recommended next steps with priority ("high" | "medium" | "low"), action, and rationale.

Return ONLY valid JSON matching this schema. No markdown, no explanations outside the JSON.`;

    const userPrompt = `CDS XML Export:\n${cdsXml}\n\nToday's Clinical Note:\n${todaysNote}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errBody);
      return NextResponse.json(
        { error: `Gemini API returned ${geminiRes.status}` },
        { status: 502 }
      );
    }

    const geminiJson = await geminiRes.json();
    const rawText =
      geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const synthesisResponse: SynthesisResponse = JSON.parse(rawText);

    return NextResponse.json(synthesisResponse);
  } catch (error) {
    console.error('Synthesis route error:', error);
    return NextResponse.json(
      { error: 'Internal server error during synthesis.' },
      { status: 500 }
    );
  }
}
