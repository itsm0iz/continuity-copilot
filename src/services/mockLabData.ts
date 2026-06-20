export const MOCK_LAB_INPUT = `FASTING LIPID PANEL:
CHOLESTEROL: 6.2 mmol/L (HIGH)
TRIGLYCERIDES: 2.1 mmol/L (ELEVATED)
HDL CHOLESTEROL: 0.9 mmol/L (LOW)
LDL CHOLESTEROL: 4.3 mmol/L (CRITICAL HIGH)
eGFR: 82 mL/min/1.73m2 (NORMAL)`;

export interface LabInsight {
  marker: string;
  value: string;
  flag: "CRITICAL HIGH" | "HIGH" | "ELEVATED" | "LOW" | "NORMAL";
  clinicianNote: string;
  patientExplainer: string;
}

export interface LabAnalysisResponse {
  urgentConcerns: LabInsight[];
  stableMetrics: LabInsight[];
}

export const MOCK_LAB_RESPONSE: LabAnalysisResponse = {
  urgentConcerns: [
    {
      marker: "LDL Cholesterol",
      value: "4.3 mmol/L",
      flag: "CRITICAL HIGH",
      clinicianNote:
        "Significant elevation. High risk factor for cardiovascular events, especially given the patient's history of coronary artery disease and previous stent placement. Indicates need for aggressive statin therapy optimization.",
      patientExplainer:
        "Your 'bad' cholesterol is quite high. Because of your heart history, we need to work on bringing this number down to protect your blood vessels and prevent future blockages. We may need to adjust your medication.",
    },
    {
      marker: "HDL Cholesterol",
      value: "0.9 mmol/L",
      flag: "LOW",
      clinicianNote:
        "Suboptimal levels of high-density lipoprotein, reducing cardioprotective effects.",
      patientExplainer:
        "Your 'good' cholesterol is lower than we'd like. This type of cholesterol helps clear fat from your blood. Regular exercise can help raise this number.",
    },
    {
      marker: "Total Cholesterol",
      value: "6.2 mmol/L",
      flag: "HIGH",
      clinicianNote: "Elevated total cholesterol driven largely by LDL fraction.",
      patientExplainer:
        "Your overall cholesterol level is higher than the recommended target.",
    },
    {
      marker: "Triglycerides",
      value: "2.1 mmol/L",
      flag: "ELEVATED",
      clinicianNote: "Mild to moderate elevation, commonly associated with metabolic syndrome or dietary factors.",
      patientExplainer: "This is another type of fat in your blood. It's slightly high, which can be linked to diet, blood sugar levels, or weight.",
    }
  ],
  stableMetrics: [
    {
      marker: "eGFR",
      value: "82 mL/min/1.73m2",
      flag: "NORMAL",
      clinicianNote: "Renal function is preserved. Safe to continue ACE inhibitors (Enalapril).",
      patientExplainer: "Your kidneys are filtering waste from your blood normally. This is great news.",
    },
  ],
};
