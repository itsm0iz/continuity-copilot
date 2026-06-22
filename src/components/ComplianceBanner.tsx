import { ShieldCheck } from "lucide-react";

export function ComplianceBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-10 items-center justify-center border-b border-[#d7e6df] bg-[#e8f3ee] px-3 text-center text-[10px] font-semibold leading-3 tracking-wide text-[#3f6558] sm:text-sm sm:leading-normal">
      <ShieldCheck className="mr-2 h-4 w-4 shrink-0" />
      PROTOTYPE WORKSPACE · USE SYNTHETIC OR APPROPRIATELY DE-IDENTIFIED DATA ONLY
    </div>
  );
}
