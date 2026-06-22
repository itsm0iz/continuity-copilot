"use client";

import { useCallback, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle,
  FileText,
  FlaskConical,
  Loader2,
  Printer,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  MOCK_LAB_INPUT,
  type LabAnalysisResponse,
  type LabInsight,
} from "@/services/mockLabData";

export function LabDissectionView() {
  const [labText, setLabText] = useState(MOCK_LAB_INPUT);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<LabAnalysisResponse | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!consentChecked || isProcessing || !labText.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/lab-dissect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labText }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to analyze this report.");
      }
      setResult(payload as LabAnalysisResponse);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Unable to analyze this report.",
      );
    } finally {
      setIsProcessing(false);
    }
  }, [consentChecked, isProcessing, labText]);

  const renderBadge = (flag: LabInsight["flag"]) => {
    if (flag.startsWith("CRITICAL")) {
      return <span className="rounded-full border border-[#efc5c1] bg-[#fff0ee] px-2.5 py-1 text-[11px] font-bold text-[#91483f]">{flag}</span>;
    }
    if (flag === "HIGH" || flag === "ELEVATED") {
      return <span className="rounded-full border border-[#ead7ae] bg-[#fff8e8] px-2.5 py-1 text-[11px] font-bold text-[#80612e]">{flag}</span>;
    }
    if (flag === "LOW") {
      return <span className="rounded-full border border-[#cbdce9] bg-[#eff6fb] px-2.5 py-1 text-[11px] font-bold text-[#4f708a]">LOW</span>;
    }
    return <span className="rounded-full border border-[#cfe2d9] bg-[#edf7f2] px-2.5 py-1 text-[11px] font-bold text-[#4b735f]">{flag}</span>;
  };

  const insightCard = (insight: LabInsight, index: number) => (
    <div key={`${insight.marker}-${index}`} className="rounded-2xl border border-[#e2e8e5] bg-[#fbfdfc] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="font-semibold text-[#30473f]">{insight.marker}</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-[#657870]">{insight.value}</span>
          {renderBadge(insight.flag)}
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#687a73]">{insight.clinicianNote}</p>
    </div>
  );

  return (
    <div className="grid min-h-[calc(100vh-7rem)] grid-cols-1 lg:grid-cols-[38%_62%]">
      <aside className="clinical-scroll overflow-y-auto border-b border-[#e2ddec] bg-[#f7f3fa] p-5 sm:p-7 lg:border-b-0 lg:border-r">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ddd4e9] bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#77678f]">
            <Sparkles className="h-3.5 w-3.5" />
            Report translator
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#443b55]">
            Lab report dissection
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#746d7e]">
            Paste one result per line. The analyzer preserves the laboratory&apos;s
            supplied flags and creates clinician and patient-facing explanations.
          </p>

          <div className="mt-7 rounded-[24px] border border-[#e1daea] bg-white/90 p-5 shadow-[0_20px_55px_-40px_rgba(78,62,105,0.55)]">
            <label htmlFor="lab-report" className="mb-2 flex items-center justify-between text-sm font-semibold text-[#51475f]">
              Laboratory report text
              <span className="text-xs font-normal text-[#948a9e]">Required</span>
            </label>
            <p className="mb-3 text-xs leading-5 text-[#877e90]">
              Recommended format: <code>Marker: value (HIGH)</code>
            </p>
            <textarea
              id="lab-report"
              className="clinical-scroll h-72 w-full resize-none rounded-2xl border border-[#e1dbe7] bg-[#fdfcfe] p-4 font-mono text-sm leading-6 text-[#514961] outline-none transition focus:border-[#aa9bc0] focus:ring-4 focus:ring-[#eee9f5]"
              value={labText}
              onChange={(event) => {
                setLabText(event.target.value);
                setResult(null);
              }}
              placeholder="LDL CHOLESTEROL: 4.3 mmol/L (HIGH)"
            />
          </div>

          <div className="mt-5 rounded-[24px] border border-[#e8ddd5] bg-[#fffaf7] p-5">
            <label htmlFor="lab-consent" className="flex cursor-pointer items-start gap-3">
              <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                <input
                  id="lab-consent"
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(event) => setConsentChecked(event.target.checked)}
                  className="peer h-5 w-5 appearance-none rounded-md border-2 border-[#c9bcb3] bg-white checked:border-[#78698e] checked:bg-[#78698e] focus:outline-none focus:ring-4 focus:ring-[#eee9f5]"
                />
                <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" />
              </span>
              <span className="text-sm leading-6 text-[#736b65]">
                I confirm this prototype session uses synthetic or properly
                de-identified laboratory data and requires clinician review.
              </span>
            </label>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!consentChecked || isProcessing || !labText.trim()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6e6086] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-16px_rgba(78,62,105,0.8)] transition hover:-translate-y-0.5 hover:bg-[#5e5273] disabled:cursor-not-allowed disabled:bg-[#c7c0cf] disabled:shadow-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reading report…
                </>
              ) : (
                <>
                  <FlaskConical className="h-4 w-4" />
                  Analyze lab results
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      <section className="clinical-scroll overflow-y-auto bg-[#fbfafc] p-5 print:bg-white print:p-0 sm:p-7">
        {!result ? (
          <div className="flex min-h-[520px] items-center justify-center text-center print:hidden">
            <div className="max-w-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#eee9f5] text-[#89799e]">
                <FlaskConical className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-[#554b63]">Ready when the report is</h2>
              <p className="mt-2 text-sm leading-6 text-[#8a8191]">
                Results will appear here with their original flags, a clinical review note, and a plain-language explanation.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="overflow-hidden rounded-[24px] border border-[#e0e7e3] bg-white shadow-[0_22px_60px_-44px_rgba(52,74,65,0.6)] print:hidden">
              <div className="flex items-center gap-2 border-b border-[#e0e8e4] bg-[#eff6f3] px-5 py-4">
                <ShieldAlert className="h-5 w-5 text-[#547466]" />
                <h2 className="font-semibold text-[#30473f]">Clinician review</h2>
              </div>
              <div className="space-y-7 p-5">
                {result.urgentConcerns.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#985247]">
                      <AlertTriangle className="h-4 w-4" />
                      Flagged by source report
                    </h3>
                    <div className="space-y-3">{result.urgentConcerns.map(insightCard)}</div>
                  </div>
                )}
                {result.stableMetrics.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#547563]">
                      <CheckCircle className="h-4 w-4" />
                      Not flagged by source report
                    </h3>
                    <div className="space-y-3">{result.stableMetrics.map(insightCard)}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#ded8e8] bg-white shadow-[0_22px_60px_-44px_rgba(76,61,100,0.55)] print:border-none print:shadow-none">
              <div className="flex items-center justify-between border-b border-[#e5deec] bg-[#f3eff8] px-5 py-4 print:border-b-2 print:border-slate-800 print:bg-transparent">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#74658b] print:hidden" />
                  <h2 className="text-lg font-semibold text-[#4d435d] print:text-black">Patient lab summary</h2>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl border border-[#d9d0e4] bg-white px-3 py-2 text-sm font-medium text-[#675979] shadow-sm transition hover:bg-[#faf8fc] print:hidden"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
              </div>
              <div className="space-y-6 p-6">
                <p className="leading-7 text-[#665f6e] print:text-black">
                  This summary explains the flags supplied with your laboratory report. It does not replace a conversation with your clinician.
                </p>
                {[...result.urgentConcerns, ...result.stableMetrics].map((insight, index) => (
                  <article key={`${insight.marker}-patient-${index}`} className="border-l-4 border-[#a799ba] py-1 pl-4 print:border-slate-400">
                    <h3 className="text-lg font-semibold text-[#4c4556] print:text-black">
                      {insight.marker}
                      <span className="ml-2 text-sm font-normal text-[#8b8392]">({insight.value})</span>
                    </h3>
                    <p className="mt-1 leading-7 text-[#6d6675] print:text-black">{insight.patientExplainer}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
