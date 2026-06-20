import { ShieldCheck } from "lucide-react";

export function ComplianceBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center justify-center bg-amber-400 text-amber-950 font-semibold text-sm">
      <ShieldCheck className="w-4 h-4 mr-2" />
      DEMO MODE: Synthetic Data Only. Zero PHI Retention Compliant (PHIPA /
      Bill 88 compliant).
    </div>
  );
}
