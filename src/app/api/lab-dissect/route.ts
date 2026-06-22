import { NextResponse } from "next/server";
import { analyzeLabText } from "@/services/labAnalysis";

const MAX_INPUT_LENGTH = 200_000;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { labText } = (body ?? {}) as Record<string, unknown>;

    if (typeof labText !== "string" || !labText.trim()) {
      return NextResponse.json(
        { error: "Missing required labText" },
        { status: 400 },
      );
    }

    if (labText.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: "Lab input must be smaller than 200,000 characters." },
        { status: 413 },
      );
    }

    const result = analyzeLabText(labText);
    if (!result.urgentConcerns.length && !result.stableMetrics.length) {
      return NextResponse.json(
        {
          error:
            "No lab rows were recognized. Use one result per line in “Marker: value (flag)” format.",
        },
        { status: 422 },
      );
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error (lab-dissect):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
