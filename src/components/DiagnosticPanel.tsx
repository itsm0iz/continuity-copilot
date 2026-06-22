"use client";

import { useState } from "react";
import { Activity, User, AlertTriangle, Lock } from "lucide-react";
import type { SynthesisResponse } from "@/services/mockData";
import { SystemCard } from "./SystemCard";
import { EMRSyncPanel } from "./EMRSyncPanel";
import { ReferralModal } from "./ReferralModal";

interface DiagnosticPanelProps {
  synthesisResult: SynthesisResponse | null;
  onSignFinalize: () => void;
}

export function DiagnosticPanel({
  synthesisResult,
  onSignFinalize,
}: DiagnosticPanelProps) {
  const [showReferralModal, setShowReferralModal] = useState(false);

  /* ── Empty state ── */
  if (!synthesisResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10">
        <Activity className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-400 mb-2">
          Awaiting EMR Ingestion
        </h2>
        <p className="text-sm text-slate-400 max-w-md">
          Paste patient EMR data and today&apos;s notes, then click Parse to
          begin analysis
        </p>
      </div>
    );
  }

  const { patientSummary, clinicalAlert, bodilySystems, referralDraft } =
    synthesisResult;
  const alertStyle =
    clinicalAlert.severity === "critical"
      ? "border-[#efc9c8] bg-[#fff1ef] text-[#7d3f3d]"
      : clinicalAlert.severity === "high"
        ? "border-[#ecd8b7] bg-[#fff8e8] text-[#76592f]"
        : "border-[#cfe1dc] bg-[#edf7f3] text-[#3f6558]";

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="animate-fade-in-up rounded-[24px] border border-[#dce7e2] bg-white/90 p-5 shadow-[0_18px_50px_-38px_rgba(52,79,68,0.55)]">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e1efe9]">
            <User className="h-5 w-5 text-[#4d7567]" />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="font-semibold text-[#263f36]">
              {patientSummary.name}
            </span>
            <span className="text-sm text-[#71837c]">
              DOB: {patientSummary.dob}
            </span>
            <span className="text-sm text-[#71837c]">
              OHIP: {patientSummary.ohip}
            </span>
            <span className="text-sm text-[#71837c]">
              {patientSummary.gender}
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Alert Banner */}
      <div
        className={`animate-fade-in-up rounded-[24px] border p-5 shadow-[0_18px_45px_-36px_currentColor] ${alertStyle}`}
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0" />
          <div>
            <h3 className="mb-1 font-semibold">
              {clinicalAlert.title}
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              {clinicalAlert.message}
            </p>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#29443a]">
          Clinical systems view
        </h2>
        <p className="mt-1 text-sm text-[#71837c]">
          Extracted findings from the imported record and today&apos;s note. Verify each item against its source.
        </p>
      </div>

      {/* Systems Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {bodilySystems.map((system, index) => (
          <SystemCard
            key={system.id}
            system={system}
            animationDelay={index * 150 + 300}
            onDraftReferral={
              system.id === "cardiovascular"
                ? () => setShowReferralModal(true)
                : undefined
            }
          />
        ))}
      </div>

      {/* ── EMR Sync Assistant ── */}
      <EMRSyncPanel progressNote={synthesisResult.emrProgressNote} />

      {/* Sign & Finalize */}
      <button
        onClick={onSignFinalize}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#355f51] py-3.5 font-semibold text-white shadow-[0_14px_30px_-18px_rgba(53,95,81,0.8)] transition hover:-translate-y-0.5 hover:bg-[#294f43]"
      >
        <Lock className="w-4 h-4" />
        End session &amp; clear patient data
      </button>
      <p className="text-center text-xs text-[#87968f]">
        You will be asked to confirm before the current browser session is cleared.
      </p>

      {/* Referral Modal */}
      {showReferralModal && (
        <ReferralModal
          referralDraft={referralDraft}
          onClose={() => setShowReferralModal(false)}
        />
      )}
    </div>
  );
}
