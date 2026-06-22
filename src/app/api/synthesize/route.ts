import { NextResponse } from "next/server";
import { synthesizeClinicalData } from "@/services/clinicalSynthesis";

const MAX_INPUT_LENGTH = 500_000;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { cdsXml, todaysNote } = (body ?? {}) as Record<string, unknown>;

    if (
      typeof cdsXml !== "string" ||
      typeof todaysNote !== "string" ||
      !cdsXml.trim() ||
      !todaysNote.trim()
    ) {
      return NextResponse.json(
        { error: "Both cdsXml and todaysNote are required." },
        { status: 400 },
      );
    }

    if (cdsXml.length > MAX_INPUT_LENGTH || todaysNote.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: "Each input must be smaller than 500,000 characters." },
        { status: 413 },
      );
    }

    return NextResponse.json(synthesizeClinicalData(cdsXml, todaysNote));
  } catch (error) {
    console.error("Synthesis route error:", error);
    return NextResponse.json(
      { error: "Internal server error during synthesis." },
      { status: 500 },
    );
  }
}
