"use client";

import {
  Heart,
  Wind,
  Activity,
  Bone,
  ShieldAlert,
  Stethoscope,
  FileText,
  type LucideProps,
} from "lucide-react";
import type { BodySystem } from "@/services/mockData";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Heart,
  Wind,
  Activity,
  Bone,
  ShieldAlert,
  Stethoscope,
  FileText,
};

interface SystemCardProps {
  system: BodySystem;
  onDraftReferral?: () => void;
  animationDelay?: number;
}

export function SystemCard({
  system,
  onDraftReferral,
  animationDelay,
}: SystemCardProps) {
  const Icon = iconMap[system.icon] || Activity;

  return (
    <div
      className="animate-fade-in-up bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
      style={{ animationDelay: `${animationDelay || 0}ms` }}
    >
      {/* Colored top accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: system.accentColor }}
      />

      {/* Header */}
      <div className="p-5 pb-3 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${system.accentColor}1A` }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: system.accentColor }}
          />
        </div>
        <h3 className="font-bold text-slate-800">{system.name}</h3>
      </div>

      {/* Findings */}
      <div className="px-5 pb-4 space-y-3">
        {system.findings.map((finding, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: system.accentColor }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-slate-800">
                  {finding.label}
                </span>
                {finding.source === "cds_xml" ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-violet-100 text-violet-700">
                    EMR History
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                    Today
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {finding.detail}
              </p>
              {finding.date && (
                <span className="text-[10px] text-slate-400">
                  {finding.date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {system.historicalEvents.length > 0 && (
        <div className="px-5 pb-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Timeline
          </h4>
          <div className="space-y-1.5">
            {system.historicalEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="font-medium text-slate-600 whitespace-nowrap">
                  {event.date}
                </span>
                <span className="text-slate-500">{event.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Medications */}
      {system.medications.length > 0 && (
        <div className="px-5 pb-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Active Medications
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {system.medications.map((med, i) => (
              <span
                key={i}
                className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 text-slate-700"
              >
                {med}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Referral Action */}
      {system.hasReferralAction && (
        <div className="px-5 pb-5">
          <button
            onClick={onDraftReferral}
            className="flex items-center gap-2 text-sm font-semibold bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2.5 hover:bg-red-100 transition-all"
          >
            <FileText className="w-4 h-4" />
            Draft Targeted Referral
          </button>
        </div>
      )}
    </div>
  );
}
