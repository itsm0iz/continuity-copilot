import {
  ArrowRight,
  Check,
  ClipboardPenLine,
  Database,
  FileCheck2,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface ClinicalIntakeProps {
  cdsXml: string;
  setCdsXml: (value: string) => void;
  todaysNote: string;
  setTodaysNote: (value: string) => void;
  consentChecked: boolean;
  setConsentChecked: (value: boolean) => void;
  isProcessing: boolean;
  onProceed: () => void;
}

export function ClinicalIntake({
  cdsXml,
  setCdsXml,
  todaysNote,
  setTodaysNote,
  consentChecked,
  setConsentChecked,
  isProcessing,
  onProceed,
}: ClinicalIntakeProps) {
  const hasInputs = Boolean(cdsXml.trim() && todaysNote.trim());
  const canProceed = hasInputs && consentChecked && !isProcessing;

  return (
    <main className="intake-canvas min-h-[calc(100vh-7rem)] overflow-hidden px-4 py-9 sm:px-7 lg:py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="pastel-orb pastel-orb-one" />
        <div className="pastel-orb pastel-orb-two" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <section className="intake-reveal intake-delay-1 mx-auto mb-9 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d8e7df] bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#577269] shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Start with the whole story
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-[#20372f] sm:text-5xl lg:text-6xl">
            One visit. The context behind it.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-[#667a72] sm:text-lg">
            Import the longitudinal EMR record and add today&apos;s encounter note.
            ClinWeave will organize their shared context for clinician review.
          </p>
        </section>

        <ol className="intake-reveal intake-delay-2 mx-auto mb-7 flex max-w-2xl items-center justify-center" aria-label="Workflow steps">
          {[
            ["1", "Import"],
            ["2", "Confirm"],
            ["3", "Review"],
          ].map(([number, label], index) => (
            <li key={label} className="flex items-center">
              <div className="flex items-center gap-2 text-sm font-medium text-[#526860]">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${index === 0 ? "bg-[#cfe7dc] text-[#315f50]" : "bg-white text-[#778a82]"}`}>
                  {number}
                </span>
                <span>{label}</span>
              </div>
              {index < 2 && <span className="mx-3 h-px w-8 bg-[#cfddd6] sm:mx-5 sm:w-16" />}
            </li>
          ))}
        </ol>

        <section className="intake-reveal intake-delay-3 grid gap-5 lg:grid-cols-2">
          <article className="intake-card group flex min-h-[430px] flex-col overflow-hidden rounded-[28px] border border-[#d7e5df] bg-white/80 shadow-[0_24px_70px_-35px_rgba(56,87,75,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_75px_-32px_rgba(56,87,75,0.42)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#e1ebe6] bg-[#eaf5f0]/75 p-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#4c7969] shadow-sm">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#719084]">Longitudinal source</p>
                  <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#29463c]">EMR import</h2>
                  <p className="mt-1.5 text-sm leading-6 text-[#667a72]">
                    Paste an OntarioMD-style CDS XML export containing history,
                    medications, allergies, problems, and prior notes.
                  </p>
                </div>
              </div>
              <FileCheck2 className="mt-1 h-5 w-5 shrink-0 text-[#8cad9f]" />
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <label htmlFor="emr-xml" className="mb-2 flex items-center justify-between text-sm font-semibold text-[#3b554c]">
                Core Data Set XML
                <span className="text-xs font-normal text-[#8a9b94]">Required</span>
              </label>
              <textarea
                id="emr-xml"
                value={cdsXml}
                onChange={(event) => setCdsXml(event.target.value)}
                placeholder="Paste the patient’s CDS XML export here…"
                spellCheck={false}
                className="clinical-scroll min-h-64 flex-1 resize-none rounded-2xl border border-[#dce7e2] bg-[#fbfdfc] p-4 font-mono text-xs leading-5 text-[#425a51] outline-none transition placeholder:text-[#a2b0aa] focus:border-[#8cb4a4] focus:ring-4 focus:ring-[#dcefe7]"
              />
            </div>
          </article>

          <article className="intake-card group flex min-h-[430px] flex-col overflow-hidden rounded-[28px] border border-[#e2dcec] bg-white/80 shadow-[0_24px_70px_-35px_rgba(89,72,119,0.3)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_75px_-32px_rgba(89,72,119,0.38)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#ebe5f1] bg-[#f1edf8]/80 p-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#71638d] shadow-sm">
                  <ClipboardPenLine className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8b7ca8]">Current encounter</p>
                  <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#493f5f]">Today&apos;s clinical note</h2>
                  <p className="mt-1.5 text-sm leading-6 text-[#716a7d]">
                    Add symptoms, observations, vital signs, assessment details,
                    or questions from the current visit.
                  </p>
                </div>
              </div>
              <Info className="mt-1 h-5 w-5 shrink-0 text-[#aa9dbd]" />
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <label htmlFor="clinical-note" className="mb-2 flex items-center justify-between text-sm font-semibold text-[#514961]">
                Encounter narrative
                <span className="text-xs font-normal text-[#9991a3]">Required</span>
              </label>
              <textarea
                id="clinical-note"
                value={todaysNote}
                onChange={(event) => setTodaysNote(event.target.value)}
                placeholder="Document today’s encounter here…"
                className="clinical-scroll min-h-64 flex-1 resize-none rounded-2xl border border-[#e4deeb] bg-[#fdfcfe] p-4 text-sm leading-6 text-[#514961] outline-none transition placeholder:text-[#aaa3b1] focus:border-[#aa9bc0] focus:ring-4 focus:ring-[#eee9f5]"
              />
            </div>
          </article>
        </section>

        <section className="intake-reveal intake-delay-4 mt-6 rounded-[26px] border border-[#eadfda] bg-[#fffaf7]/90 p-5 shadow-[0_20px_50px_-35px_rgba(114,80,65,0.35)] backdrop-blur sm:p-6">
          <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
            <label htmlFor="clinical-consent" className="flex max-w-3xl cursor-pointer items-start gap-4">
              <span className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <input
                  id="clinical-consent"
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(event) => setConsentChecked(event.target.checked)}
                  className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-[#cbbab0] bg-white transition checked:border-[#6f9485] checked:bg-[#6f9485] focus:outline-none focus:ring-4 focus:ring-[#deebe5]"
                />
                <Check className="pointer-events-none absolute h-4 w-4 scale-75 text-white opacity-0 transition peer-checked:scale-100 peer-checked:opacity-100" />
              </span>
              <span>
                <span className="flex items-center gap-2 font-semibold text-[#4b4944]">
                  <ShieldCheck className="h-4 w-4 text-[#6f9485]" />
                  Confirm before processing
                </span>
                <span className="mt-1 block text-sm leading-6 text-[#756f68]">
                  I confirm this prototype session uses synthetic or properly
                  de-identified data, and I understand all extracted findings
                  require verification against the source record.
                </span>
              </span>
            </label>

            <button
              type="button"
              onClick={onProceed}
              disabled={!canProceed}
              className="group flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#355f51] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_-14px_rgba(53,95,81,0.8)] transition hover:-translate-y-0.5 hover:bg-[#294f43] hover:shadow-[0_16px_34px_-14px_rgba(53,95,81,0.9)] disabled:cursor-not-allowed disabled:bg-[#bdc9c4] disabled:shadow-none lg:w-auto"
            >
              {isProcessing ? (
                <>
                  <span className="loading-spinner" />
                  Building clinical view…
                </>
              ) : (
                <>
                  Continue to clinical review
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
          {!hasInputs && (
            <p className="mt-3 text-xs text-[#a06e5c]">
              Both the EMR export and today&apos;s note are required.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
