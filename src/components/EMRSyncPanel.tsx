"use client";

import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";

interface EMRSyncPanelProps {
  progressNote?: string;
}

export function EMRSyncPanel({ progressNote }: EMRSyncPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!progressNote) return;
    try {
      await navigator.clipboard.writeText(progressNote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!progressNote) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-[24px] border border-[#dfe8e4] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#dde9e3] bg-[#edf6f2] px-5 py-3">
        <div className="flex items-center gap-2">
          <ClipboardCopy className="w-5 h-5 text-slate-700" />
          <h3 className="font-bold text-slate-900">EMR Sync Assistant</h3>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border shadow-sm transition-colors ${
            copied
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied to Clipboard
            </>
          ) : (
            <>
              <ClipboardCopy className="w-4 h-4" />
              Copy Progress Note to EMR
            </>
          )}
        </button>
      </div>
      <div className="p-5">
        <p className="text-xs text-slate-500 mb-3">
          Review and edit this extracted summary before copying it into any record.
        </p>
        <textarea
          readOnly
          className="w-full h-48 p-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-700 bg-slate-50 focus:outline-none resize-y"
          value={progressNote}
        />
      </div>
    </div>
  );
}
