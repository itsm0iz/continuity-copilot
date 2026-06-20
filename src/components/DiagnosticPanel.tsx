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

  return (
    <div className="p-5 space-y-5">
      {/* Patient Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="font-bold text-slate-800">
              {patientSummary.name}
            </span>
            <span className="text-sm text-slate-500">
              DOB: {patientSummary.dob}
            </span>
            <span className="text-sm text-slate-500">
              OHIP: {patientSummary.ohip}
            </span>
            <span className="text-sm text-slate-500">
              {patientSummary.gender}
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Alert Banner */}
      <div
        className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 animate-alert-pulse shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900 mb-1">
              {clinicalAlert.title}
            </h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              {clinicalAlert.message}
            </p>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          Bodily Systems Knowledge Graph
        </h2>
        <p className="text-sm text-slate-500">
          AI-synthesized findings from EMR history and today&apos;s clinical
          encounter
        </p>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
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
        className="w-full py-3 rounded-xl font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
      >
        <Lock className="w-4 h-4" />
        Sign &amp; Finalize — Clear All Patient Data
      </button>
      <p className="text-xs text-slate-400 text-center">
        Signing will finalize the clinical session and wipe all patient data
        from this interface per zero-retention policy.
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
