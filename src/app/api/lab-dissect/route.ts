import { NextResponse } from "next/server";
import { MOCK_LAB_RESPONSE } from "@/services/mockLabData";

// Set to true when Gemini API key is available
const USE_LIVE_AI = false;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { labText } = body;

    if (!labText) {
      return NextResponse.json(
        { error: "Missing required labText" },
        { status: 400 }
      );
    }

    if (!USE_LIVE_AI) {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return NextResponse.json(MOCK_LAB_RESPONSE);
    }

    // TODO: Live Gemini Integration (Similar to synthesize route)
    // For now, if USE_LIVE_AI is true but no key is present, fallback to mock
    console.warn("Live AI not yet implemented for lab dissection, falling back to mock");
    return NextResponse.json(MOCK_LAB_RESPONSE);

  } catch (error) {
    console.error("API Error (lab-dissect):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
