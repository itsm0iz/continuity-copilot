import "server-only";

import type {
  LabAnalysisResponse,
  LabInsight,
} from "@/services/mockLabData";

const FLAG_PATTERN = /\b(CRITICAL\s+HIGH|CRITICAL\s+LOW|HIGH|ELEVATED|LOW|NORMAL|ABNORMAL)\b/i;

function normalizeFlag(value: string): LabInsight["flag"] {
  const normalized = value.toUpperCase().replace(/\s+/g, " ");
  if (normalized === "CRITICAL HIGH" || normalized === "CRITICAL LOW") {
    return normalized;
  }
  if (normalized === "HIGH" || normalized === "ABNORMAL") return "HIGH";
  if (normalized === "ELEVATED") return "ELEVATED";
  if (normalized === "LOW") return "LOW";
  if (normalized === "NORMAL") return "NORMAL";
  return "NOT FLAGGED";
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/Egfr/g, "eGFR")
    .replace(/Hdl/g, "HDL")
    .replace(/Ldl/g, "LDL");
}

function insightCopy(marker: string, flag: LabInsight["flag"]) {
  if (flag === "NORMAL") {
    return {
      clinicianNote: `${marker} is marked within range in the supplied report. Confirm against the reporting laboratory’s reference interval and the patient context.`,
      patientExplainer: `${marker} was not flagged as abnormal on this report. Your clinician will interpret it alongside your health history and other results.`,
    };
  }

  if (flag === "NOT FLAGGED") {
    return {
      clinicianNote: `${marker} has no explicit flag in the supplied text. Verify the value, units, and reporting laboratory’s reference interval before interpretation.`,
      patientExplainer: `The supplied report did not attach a high, low, or normal flag to ${marker}. Your clinician will interpret the value using the laboratory’s reference range.`,
    };
  }

  return {
    clinicianNote: `${marker} is flagged ${flag.toLowerCase()} in the supplied report. Verify the value, units, reference interval, prior trend, and clinical context before acting.`,
    patientExplainer: `${marker} was flagged ${flag.toLowerCase()} by the laboratory. A flagged result is not a diagnosis; your clinician will explain what it means for you.`,
  };
}

export function analyzeLabText(labText: string): LabAnalysisResponse {
  const insights: LabInsight[] = labText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && line.includes(":"))
    .flatMap((line) => {
      const separator = line.indexOf(":");
      const rawMarker = line.slice(0, separator).trim();
      const rawValue = line.slice(separator + 1).trim();
      if (
        !rawMarker ||
        !rawValue ||
        /^(comment|note|report|specimen|collected|received)$/i.test(rawMarker)
      ) {
        return [];
      }

      const flagMatch = rawValue.match(FLAG_PATTERN);
      const flag = normalizeFlag(flagMatch?.[1] ?? "NOT FLAGGED");
      const value = rawValue
        .replace(/\((?:CRITICAL\s+HIGH|CRITICAL\s+LOW|HIGH|ELEVATED|LOW|NORMAL|ABNORMAL)\)/gi, "")
        .trim();
      const marker = titleCase(rawMarker.replace(/[_-]+/g, " "));
      const copy = insightCopy(marker, flag);

      return [{ marker, value, flag, ...copy }];
    });

  return {
    urgentConcerns: insights.filter(
      (insight) => insight.flag !== "NORMAL" && insight.flag !== "NOT FLAGGED",
    ),
    stableMetrics: insights.filter(
      (insight) => insight.flag === "NORMAL" || insight.flag === "NOT FLAGGED",
    ),
  };
}
