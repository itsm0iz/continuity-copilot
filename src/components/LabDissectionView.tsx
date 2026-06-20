"use client";

import { useState, useCallback } from "react";
import { Loader2, Printer, AlertTriangle, CheckCircle, ShieldAlert, FlaskConical, FileText } from "lucide-react";
import { MOCK_LAB_INPUT, type LabAnalysisResponse, type LabInsight } from "@/services/mockLabData";

export function LabDissectionView() {
  const [labText, setLabText] = useState(MOCK_LAB_INPUT);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<LabAnalysisResponse | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!consentChecked || isProcessing || !labText.trim()) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/lab-dissect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labText }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze labs");
      }

      const data: LabAnalysisResponse = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error analyzing lab report.");
    } finally {
      setIsProcessing(false);
    }
  }, [consentChecked, isProcessing, labText]);

  const handlePrint = () => {
    window.print();
  };

  const renderBadge = (flag: string) => {
    switch (flag) {
      case "CRITICAL HIGH":
        return <span className="px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-800 border border-red-200">CRITICAL HIGH</span>;
      case "HIGH":
      case "ELEVATED":
        return <span className="px-2 py-1 text-xs font-bold rounded bg-amber-100 text-amber-800 border border-amber-200">{flag}</span>;
      case "LOW":
        return <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 border border-blue-200">LOW</span>;
      default:
        return <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 border border-green-200">NORMAL</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] min-h-[calc(100vh-80px)]">
      {/* ── Left Column: Input ── */}
      <aside className="border-r border-slate-200 bg-slate-50 p-6 flex flex-col gap-6 overflow-y-auto clinical-scroll">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Laboratory Data Ingestion</h2>
          <p className="text-sm text-slate-600 mb-4">
            Paste raw laboratory values, PDF text dumps, or diagnostic reports here for AI dissection.
          </p>
          <textarea
            className="w-full h-64 p-3 border border-slate-300 rounded-lg text-sm font-mono text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            value={labText}
            onChange={(e) => setLabText(e.target.value)}
            placeholder="Paste lab text here..."
          />
        </div>

        {/* Action Area */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-slate-600 leading-tight">
              I confirm I have patient consent to process these laboratory values through the Continuity Copilot translation service.
            </div>
          </label>

          <button
            onClick={handleAnalyze}
            disabled={!consentChecked || isProcessing || !labText.trim()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Labs...
              </>
            ) : (
              "Analyze Lab Results"
            )}
          </button>
        </div>
      </aside>

      {/* ── Right Column: Results ── */}
      <section className="bg-slate-50 p-6 overflow-y-auto clinical-scroll print:p-0 print:bg-white">
        {!result ? (
          <div className="h-full flex items-center justify-center text-slate-400 print:hidden">
            <div className="text-center">
              <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Enter lab data and click analyze to view dissection.</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Clinician Insights Card (Not printed) */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden print:hidden">
              <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-slate-900">Clinician Insights</h3>
              </div>
              <div className="p-5 space-y-6">
                {result.urgentConcerns.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Urgent / Abnormal Flags
                    </h4>
                    <div className="space-y-3">
                      {result.urgentConcerns.map((insight, idx) => (
                        <div key={idx} className="border border-slate-100 rounded-lg p-3 bg-slate-50 flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-slate-900">{insight.marker}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm text-slate-600">{insight.value}</span>
                              {renderBadge(insight.flag)}
                            </div>
                          </div>
                          <p className="text-sm text-slate-700">{insight.clinicianNote}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.stableMetrics.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Stable / Normal Metrics
                    </h4>
                    <div className="space-y-3">
                      {result.stableMetrics.map((insight, idx) => (
                        <div key={idx} className="border border-slate-100 rounded-lg p-3 bg-slate-50 flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-slate-900">{insight.marker}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm text-slate-600">{insight.value}</span>
                              {renderBadge(insight.flag)}
                            </div>
                          </div>
                          <p className="text-sm text-slate-700">{insight.clinicianNote}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Patient-Facing Explainer Card (Printed) */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">
              <div className="bg-blue-50 border-b border-blue-100 px-5 py-4 flex items-center justify-between print:bg-transparent print:border-b-2 print:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-700 print:hidden" />
                  <h3 className="font-bold text-blue-900 text-lg print:text-black">Patient Lab Summary</h3>
                </div>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm print:hidden"
                >
                  <Printer className="w-4 h-4" />
                  Print for Patient
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <p className="text-slate-700 print:text-black">
                  This summary is designed to help you understand your recent laboratory results. If you have any questions, please discuss them with your doctor.
                </p>

                <div className="space-y-5">
                  {[...result.urgentConcerns, ...result.stableMetrics].map((insight, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 py-1 print:border-slate-400">
                      <h4 className="font-bold text-slate-900 text-lg mb-1 print:text-black">
                        {insight.marker}
                        <span className="text-slate-500 text-sm font-normal ml-2">({insight.value})</span>
                      </h4>
                      <p className="text-slate-700 text-base leading-relaxed print:text-black">
                        {insight.patientExplainer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </section>
    </div>
  );
}


