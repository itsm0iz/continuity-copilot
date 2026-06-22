import { AlertTriangle, ArrowLeft, Trash2, X } from "lucide-react";

interface DataTerminationDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DataTerminationDialog({
  open,
  onCancel,
  onConfirm,
}: DataTerminationDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1e2d28]/35 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="termination-title"
        aria-describedby="termination-description"
        className="animate-slide-up w-full max-w-md overflow-hidden rounded-[26px] border border-[#ead9d2] bg-[#fffdfb] shadow-2xl"
      >
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f8e8df] text-[#a25943]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 id="termination-title" className="text-xl font-semibold tracking-[-0.02em] text-[#3d3a35]">
                End this patient session?
              </h2>
              <p id="termination-description" className="mt-2 text-sm leading-6 text-[#746d65]">
                Returning to intake will terminate the current session and clear
                the imported EMR, encounter note, generated findings, and lab workspace from this browser view.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-2 text-[#9a8e86] transition hover:bg-[#f6efeb] hover:text-[#574f49]"
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-[#eee4df] bg-[#fff9f6] p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#dfd7d2] bg-white px-4 py-2.5 text-sm font-semibold text-[#655e58] transition hover:bg-[#faf6f3]"
          >
            <ArrowLeft className="h-4 w-4" />
            Keep reviewing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#a65343] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8f4336]"
          >
            <Trash2 className="h-4 w-4" />
            Clear data &amp; return
          </button>
        </div>
      </section>
    </div>
  );
}
