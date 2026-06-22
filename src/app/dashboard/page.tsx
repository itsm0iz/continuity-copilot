"use client";

import { useCallback, useState } from "react";
import { ClinicalIntake } from "@/components/ClinicalIntake";
import { DataTerminationDialog } from "@/components/DataTerminationDialog";
import { DiagnosticPanel } from "@/components/DiagnosticPanel";
import { LabDissectionView } from "@/components/LabDissectionView";
import type { TabValue } from "@/components/TabBar";
import { WorkspaceHeader } from "@/components/WorkspaceHeader";
import {
  MOCK_CDS_XML,
  MOCK_TODAYS_NOTE,
  type SynthesisResponse,
} from "@/services/mockData";

type Stage = "intake" | "workspace";

export default function DashboardPage() {
  const [stage, setStage] = useState<Stage>("intake");
  const [activeTab, setActiveTab] = useState<TabValue>("dashboard");
  const [cdsXml, setCdsXml] = useState(MOCK_CDS_XML);
  const [todaysNote, setTodaysNote] = useState(MOCK_TODAYS_NOTE);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [synthesisResult, setSynthesisResult] =
    useState<SynthesisResponse | null>(null);
  const [showTerminationDialog, setShowTerminationDialog] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const handleParse = useCallback(async () => {
    if (!consentChecked || isProcessing || !cdsXml.trim() || !todaysNote.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cdsXml, todaysNote }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to build the clinical view.");
      }

      setSynthesisResult(payload as SynthesisResponse);
      setActiveTab("dashboard");
      setStage("workspace");
    } catch (error) {
      console.error("Synthesis error:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to build the clinical view.",
      );
    } finally {
      setIsProcessing(false);
    }
  }, [cdsXml, consentChecked, isProcessing, todaysNote]);

  const openClinicalDashboard = useCallback(() => {
    setActiveTab("dashboard");
    setStage(synthesisResult ? "workspace" : "intake");
  }, [synthesisResult]);

  const openLabDissection = useCallback(() => {
    setActiveTab("lab-dissection");
    setStage("workspace");
  }, []);

  const clearSession = useCallback(() => {
    setCdsXml("");
    setTodaysNote("");
    setConsentChecked(false);
    setSynthesisResult(null);
    setIsProcessing(false);
    setActiveTab("dashboard");
    setStage("intake");
    setSessionKey((value) => value + 1);
    setShowTerminationDialog(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fbf9] text-[#243a32]">
      <WorkspaceHeader
        activeTab={activeTab}
        showBack={stage === "workspace"}
        onClinicalDashboard={openClinicalDashboard}
        onLabDissection={openLabDissection}
        onBack={() => setShowTerminationDialog(true)}
      />

      {stage === "intake" ? (
        <ClinicalIntake
          cdsXml={cdsXml}
          setCdsXml={setCdsXml}
          todaysNote={todaysNote}
          setTodaysNote={setTodaysNote}
          consentChecked={consentChecked}
          setConsentChecked={setConsentChecked}
          isProcessing={isProcessing}
          onProceed={handleParse}
        />
      ) : activeTab === "dashboard" ? (
        <main className="workspace-enter min-h-[calc(100vh-7rem)] bg-[#f7faf8] px-4 py-7 sm:px-7">
          <div className="mx-auto max-w-[1500px]">
            <DiagnosticPanel
              synthesisResult={synthesisResult}
              onSignFinalize={() => setShowTerminationDialog(true)}
            />
          </div>
        </main>
      ) : (
        <main className="workspace-enter min-h-[calc(100vh-7rem)] bg-[#faf8fc]">
          <LabDissectionView key={sessionKey} />
        </main>
      )}

      <DataTerminationDialog
        open={showTerminationDialog}
        onCancel={() => setShowTerminationDialog(false)}
        onConfirm={clearSession}
      />
    </div>
  );
}
