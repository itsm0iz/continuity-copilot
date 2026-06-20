"use client";

import { useState, useCallback } from "react";
import {
  MOCK_CDS_XML,
  MOCK_TODAYS_NOTE,
  type SynthesisResponse,
} from "@/services/mockData";
import { IngestionPanel } from "@/components/IngestionPanel";
import { DiagnosticPanel } from "@/components/DiagnosticPanel";

export default function DashboardPage() {
  // ── Input state ──
  const [cdsXml, setCdsXml] = useState(MOCK_CDS_XML);
  const [todaysNote, setTodaysNote] = useState(MOCK_TODAYS_NOTE);
  const [consentChecked, setConsentChecked] = useState(false);

  // ── Processing state ──
  const [isProcessing, setIsProcessing] = useState(false);
  const [synthesisResult, setSynthesisResult] =
    useState<SynthesisResponse | null>(null);

  // ── Parse handler — calls server-side API route ──
  const handleParse = useCallback(async () => {
    if (!consentChecked || isProcessing) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cdsXml, todaysNote }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Synthesis error:", err);
        alert(`Synthesis failed: ${err.error || res.statusText}`);
        return;
      }

      const data: SynthesisResponse = await res.json();
      setSynthesisResult(data);
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error — unable to reach the synthesis API.");
    } finally {
      setIsProcessing(false);
    }
  }, [cdsXml, todaysNote, consentChecked, isProcessing]);

  // ── State wipe on Sign & Finalize ──
  const handleSignFinalize = useCallback(() => {
    setCdsXml("");
    setTodaysNote("");
    setConsentChecked(false);
    setSynthesisResult(null);
    setIsProcessing(false);
  }, []);

  return (
    <div className="min-h-[calc(100vh-3rem)] grid grid-cols-1 lg:grid-cols-[30%_70%]">
      {/* ── Left Column: EMR Ingestion Engine ── */}
      <aside className="border-r border-slate-200 bg-slate-50 overflow-y-auto clinical-scroll">
        <IngestionPanel
          cdsXml={cdsXml}
          setCdsXml={setCdsXml}
          todaysNote={todaysNote}
          setTodaysNote={setTodaysNote}
          consentChecked={consentChecked}
          setConsentChecked={setConsentChecked}
          onParse={handleParse}
          isProcessing={isProcessing}
        />
      </aside>

      {/* ── Right Column: Diagnostic Knowledge Graph ── */}
      <section className="bg-slate-50 overflow-y-auto clinical-scroll">
        <DiagnosticPanel
          synthesisResult={synthesisResult}
          onSignFinalize={handleSignFinalize}
        />
      </section>
    </div>
  );
}
