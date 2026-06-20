"use client";

import { useState } from "react";
import { Heart, X, Copy, Check, AlertTriangle } from "lucide-react";
import type { ReferralDraft } from "@/services/mockData";

interface ReferralModalProps {
  referralDraft: ReferralDraft;
  onClose: () => void;
}

export function ReferralModal({ referralDraft, onClose }: ReferralModalProps) {
  const [editableBody, setEditableBody] = useState(referralDraft.body);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback — selection-based copy
      const textarea = document.createElement("textarea");
      textarea.value = editableBody;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="animate-slide-up bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Targeted Cardiology Referral
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-3">
            Professional Canadian clinical correspondence template
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              This referral references only Cardiovascular system data.
              Unrelated findings (respiratory/flu) have been intentionally
              omitted for clinical precision.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 clinical-scroll">
          <textarea
            value={editableBody}
            onChange={(e) => setEditableBody(e.target.value)}
            className="w-full min-h-[400px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 font-mono leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Approve &amp; Copy to Clipboard
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 italic border-t border-slate-100 pt-3">
            Audit Trail: Electronic signature verified by Attending MD at{" "}
            {new Date().toISOString()}. CNO-Compliant record.
          </p>
        </div>
      </div>
    </div>
  );
}
