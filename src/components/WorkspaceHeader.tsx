import {
  ArrowLeft,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
} from "lucide-react";
import type { TabValue } from "@/components/TabBar";

interface WorkspaceHeaderProps {
  activeTab: TabValue;
  showBack: boolean;
  onClinicalDashboard: () => void;
  onLabDissection: () => void;
  onBack: () => void;
}

export function WorkspaceHeader({
  activeTab,
  showBack,
  onClinicalDashboard,
  onLabDissection,
  onBack,
}: WorkspaceHeaderProps) {
  return (
    <header className="sticky top-10 z-40 border-b border-[#dce7e1] bg-[#fbfdfb]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-7">
        <div className="flex w-full items-center gap-3 sm:w-auto">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#d8e5df] bg-white text-[#526760] shadow-sm transition hover:-translate-x-0.5 hover:border-[#b8cec4] hover:text-[#28483d]"
              aria-label="Return to patient intake"
              title="Return to patient intake"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dcefe6] text-[#315f50]">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold tracking-[-0.02em] text-[#223b33]">
              ClinWeave
            </p>
            <p className="hidden text-xs text-[#75877f] sm:block">
              Longitudinal context for the point of care
            </p>
          </div>
        </div>

        <nav
          className="flex w-full rounded-2xl border border-[#dbe6e0] bg-white/80 p-1 shadow-sm sm:w-auto"
          aria-label="Clinical workspace"
        >
          <button
            type="button"
            onClick={onClinicalDashboard}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition sm:flex-none sm:px-4 ${
              activeTab === "dashboard"
                ? "bg-[#e4f1eb] text-[#315f50] shadow-sm"
                : "text-[#71827b] hover:bg-[#f3f7f5] hover:text-[#3e554d]"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Clinical Dashboard</span>
            <span className="sm:hidden">Clinical</span>
          </button>
          <button
            type="button"
            onClick={onLabDissection}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition sm:flex-none sm:px-4 ${
              activeTab === "lab-dissection"
                ? "bg-[#ece8f6] text-[#655982] shadow-sm"
                : "text-[#71827b] hover:bg-[#f5f3f9] hover:text-[#554b6d]"
            }`}
          >
            <FlaskConical className="h-4 w-4" />
            <span className="hidden sm:inline">Lab Report Dissection</span>
            <span className="sm:hidden">Labs</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
