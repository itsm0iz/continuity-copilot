import { FileText, FlaskConical } from "lucide-react";

export type TabValue = "dashboard" | "lab-dissection";

interface TabBarProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4">
      <button
        onClick={() => onTabChange("dashboard")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
          activeTab === "dashboard"
            ? "bg-slate-100 text-slate-900 border border-slate-200 shadow-sm"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
        }`}
      >
        <FileText className="w-4 h-4" />
        Clinical Dashboard
      </button>
      <button
        onClick={() => onTabChange("lab-dissection")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
          activeTab === "lab-dissection"
            ? "bg-slate-100 text-slate-900 border border-slate-200 shadow-sm"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
        }`}
      >
        <FlaskConical className="w-4 h-4" />
        Lab Report Dissection
      </button>
    </div>
  );
}
