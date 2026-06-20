"use client";

import { FileText, Database, ClipboardList, Zap } from "lucide-react";

interface IngestionPanelProps {
  cdsXml: string;
  setCdsXml: (value: string) => void;
  todaysNote: string;
  setTodaysNote: (value: string) => void;
  consentChecked: boolean;
  setConsentChecked: (value: boolean) => void;
  onParse: () => void;
  isProcessing: boolean;
}

export function IngestionPanel({
  cdsXml,
  setCdsXml,
  todaysNote,
  setTodaysNote,
  consentChecked,
  setConsentChecked,
  onParse,
  isProcessing,
}: IngestionPanelProps) {
  const isDisabled = !consentChecked || isProcessing;

  return (
    <div className="h-full flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-slate-800">
          EMR Ingestion Engine
        </h2>
      </div>

      {/* CDS XML Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Database className="w-4 h-4 text-violet-500" />
          Paste EMR Core Data Set (XML)
        </label>
        <textarea
          value={cdsXml}
          onChange={(e) => setCdsXml(e.target.value)}
          placeholder="Paste HL7 / CDS XML here…"
          className="w-full h-48 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-700 resize-none clinical-scroll focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Today's Notes Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <ClipboardList className="w-4 h-4 text-emerald-500" />
          Today&apos;s Free-Hand Clinical Notes
        </label>
        <textarea
          value={todaysNote}
          onChange={(e) => setTodaysNote(e.target.value)}
          placeholder="Enter today's clinical observations…"
          className="w-full h-28 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 resize-none clinical-scroll focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          className="consent-checkbox mt-0.5"
          id="consent-check"
        />
        <label htmlFor="consent-check" className="text-sm text-slate-600">
          I confirm this data is synthetic and contains no real Protected Health
          Information (PHI). I consent to AI-assisted clinical analysis.
        </label>
      </div>

      {/* Parse Button */}
      <button
        onClick={onParse}
        disabled={isDisabled}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
          isDisabled
            ? "bg-slate-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
        }`}
      >
        {isProcessing ? (
          <span className="loading-spinner" />
        ) : (
          <Zap className="w-4 h-4" />
        )}
        {isProcessing ? "Synthesizing…" : "Parse Patient History & Synthesize"}
      </button>

      {isDisabled && !isProcessing && (
        <p className="text-xs text-slate-400 italic text-center -mt-2">
          Please check the consent box above to enable parsing.
        </p>
      )}
    </div>
  );
}
