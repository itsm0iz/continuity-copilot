// ──────────────────────────────────────────────────────────────
// Mock Data Service — Continuity Copilot
// Provides deterministic test fixtures so the UI works without
// a live Gemini API key.
// ──────────────────────────────────────────────────────────────

export const MOCK_CDS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:cda="urn:hl7-org:v3"
  xmlns:sdtc="urn:hl7-org:sdtc">
  <realmCode code="CA-ON"/>
  <typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>
  <templateId root="2.16.840.1.113883.3.1818.10.1.1"/>
  <id root="2.16.840.1.113883.3.1818.10.2" extension="ON-CDS-20210415-XRR9281"/>
  <code code="60591-5" codeSystem="2.16.840.1.113883.6.1" displayName="Patient Summary"/>
  <effectiveTime value="20210415"/>
  <recordTarget>
    <patientRole>
      <id extension="ON-OHIP-9281-442-817" root="2.16.840.1.113883.4.595"/>
      <patient>
        <name><given>James</given><family>McAllister</family></name>
        <administrativeGenderCode code="M" codeSystem="2.16.840.1.113883.5.1"/>
        <birthTime value="19580312"/>
      </patient>
    </patientRole>
  </recordTarget>

  <!-- ═══ MEDICATIONS ═══ -->
  <component>
    <section>
      <templateId root="2.16.840.1.113883.3.1818.10.2.19.1"/>
      <code code="10160-0" displayName="Medications"/>
      <entry>
        <substanceAdministration classCode="SBADM" moodCode="EVN">
          <consumable><manufacturedProduct><manufacturedMaterial>
            <code code="N02BE01" displayName="Acetaminophen 500mg"/>
          </manufacturedMaterial></manufacturedProduct></consumable>
          <effectiveTime value="20210401"/>
          <text>Take 1 tablet q6h PRN for pain</text>
        </substanceAdministration>
      </entry>
      <entry>
        <substanceAdministration classCode="SBADM" moodCode="EVN">
          <consumable><manufacturedProduct><manufacturedMaterial>
            <code code="C10AA05" displayName="Atorvastatin 40mg"/>
          </manufacturedMaterial></manufacturedProduct></consumable>
          <effectiveTime value="20190718"/>
          <text>Take 1 tablet daily at bedtime - initiated post cardiac event</text>
        </substanceAdministration>
      </entry>
      <entry>
        <substanceAdministration classCode="SBADM" moodCode="EVN">
          <consumable><manufacturedProduct><manufacturedMaterial>
            <code code="B01AC06" displayName="Acetylsalicylic Acid 81mg"/>
          </manufacturedMaterial></manufacturedProduct></consumable>
          <effectiveTime value="20190718"/>
          <text>Take 1 tablet daily - antiplatelet therapy post-stent</text>
        </substanceAdministration>
      </entry>
      <entry>
        <substanceAdministration classCode="SBADM" moodCode="EVN">
          <consumable><manufacturedProduct><manufacturedMaterial>
            <code code="C09AA02" displayName="Enalapril 10mg"/>
          </manufacturedMaterial></manufacturedProduct></consumable>
          <effectiveTime value="20200105"/>
          <text>Take 1 tablet daily for blood pressure management</text>
        </substanceAdministration>
      </entry>
    </section>
  </component>

  <!-- ═══ ALLERGIES ═══ -->
  <component>
    <section>
      <templateId root="2.16.840.1.113883.3.1818.10.2.4.1"/>
      <code code="48765-2" displayName="Allergies"/>
      <entry>
        <act classCode="ACT" moodCode="EVN">
          <code code="DALG" displayName="Drug Allergy"/>
          <participant typeCode="CSM">
            <participantRole>
              <playingEntity>
                <code code="J01CA04" displayName="Amoxicillin"/>
              </playingEntity>
            </participantRole>
          </participant>
          <entryRelationship>
            <observation><value displayName="Hives, throat swelling"/></observation>
          </entryRelationship>
        </act>
      </entry>
    </section>
  </component>

  <!-- ═══ PROBLEM LIST ═══ -->
  <component>
    <section>
      <templateId root="2.16.840.1.113883.3.1818.10.2.23.1"/>
      <code code="11450-4" displayName="ProblemList"/>
      <entry>
        <act classCode="ACT" moodCode="EVN">
          <code code="55607006" codeSystem="2.16.840.1.113883.6.96"
                displayName="Problem"/>
          <entryRelationship>
            <observation>
              <code code="64572001" displayName="Disease"/>
              <value code="44054006" displayName="Type 2 Diabetes Mellitus"/>
              <effectiveTime value="20170803"/>
              <text>Diagnosed Aug 2017 — managed with diet, metformin added 2019</text>
            </observation>
          </entryRelationship>
        </act>
      </entry>
      <entry>
        <act classCode="ACT" moodCode="EVN">
          <code code="55607006" codeSystem="2.16.840.1.113883.6.96"
                displayName="Problem"/>
          <entryRelationship>
            <observation>
              <code code="64572001" displayName="Disease"/>
              <value code="38341003" displayName="Essential Hypertension"/>
              <effectiveTime value="20180214"/>
              <text>Stage 1 hypertension — controlled on Enalapril 10mg</text>
            </observation>
          </entryRelationship>
        </act>
      </entry>
    </section>
  </component>

  <!-- ═══ PAST HEALTH / SURGICAL HISTORY ═══ -->
  <component>
    <section>
      <templateId root="2.16.840.1.113883.3.1818.10.2.22.1"/>
      <code code="11348-0" displayName="PastHealth"/>
      <entry>
        <act classCode="ACT" moodCode="EVN">
          <code code="71388002" codeSystem="2.16.840.1.113883.6.96"
                displayName="Procedure"/>
          <effectiveTime value="20190715"/>
          <text>CABG consult deferred — patient underwent percutaneous coronary
          intervention (PCI) with drug-eluting stent placement to the LAD
          (left anterior descending) artery on 2019-07-15 at Sunnybrook HSC.
          Indication: 85% coronary artery blockage identified on diagnostic
          angiography. Post-procedure: uneventful recovery, dual antiplatelet
          therapy initiated (ASA 81mg + Clopidogrel 75mg x 12 months).
          Cardiac rehab completed Dec 2019. Last stress echo (2020-06)
          within normal limits.</text>
        </act>
      </entry>
      <entry>
        <act classCode="ACT" moodCode="EVN">
          <code code="80146002" codeSystem="2.16.840.1.113883.6.96"
                displayName="Procedure"/>
          <effectiveTime value="20150922"/>
          <text>Appendectomy — uncomplicated, laparoscopic approach, 2015-09-22</text>
        </act>
      </entry>
    </section>
  </component>

  <!-- ═══ CLINICAL NOTES ═══ -->
  <component>
    <section>
      <templateId root="2.16.840.1.113883.3.1818.10.2.7.1"/>
      <code code="34109-9" displayName="ClinicalNotes"/>
      <entry>
        <act classCode="ACT" moodCode="EVN">
          <effectiveTime value="20210415"/>
          <text>Routine follow-up: A1C stable at 7.1%. BP 128/82.
          Patient reports adherence to medication. Discussed smoking
          cessation — patient using nicotine patch. Weight 91kg.
          BMI 29.4. Continue current management plan.</text>
        </act>
      </entry>
      <entry>
        <act classCode="ACT" moodCode="EVN">
          <effectiveTime value="20200601"/>
          <text>Cardiac follow-up — stress echo results normal. EF 58%.
          No anginal symptoms reported. Continue statin and antiplatelet.
          Next cardiology review in 12 months.</text>
        </act>
      </entry>
    </section>
  </component>
</ClinicalDocument>`;

export const MOCK_TODAYS_NOTE = `Patient presents today with acute, mild chest pain, shortness of breath for 12 hours, and mild flu-like symptoms. Reports a dry cough and nasal congestion since yesterday. Denies fever, nausea, or diaphoresis. Pain is substernal, non-radiating, rated 3/10, worsens with deep inspiration. Vitals: BP 134/86, HR 88, SpO2 96%, Temp 37.1°C. Lungs: scattered rhonchi bilaterally. Heart: regular rate and rhythm, no murmurs. Patient appears mildly anxious.`;

export interface Finding {
  label: string;
  detail: string;
  source: "cds_xml" | "todays_note";
  date?: string;
  severity?: "low" | "moderate" | "high" | "critical";
}

export interface HistoricalEvent {
  date: string;
  description: string;
  facility?: string;
}

export interface BodySystem {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
  findings: Finding[];
  historicalEvents: HistoricalEvent[];
  medications: string[];
  hasReferralAction?: boolean;
}

export interface ClinicalAlert {
  severity: "high" | "critical";
  title: string;
  message: string;
  relatedSystems: string[];
}

export interface ReferralDraft {
  specialty: string;
  recipientTitle: string;
  patientName: string;
  body: string;
  auditLine: string;
}

export interface SynthesisResponse {
  patientSummary: {
    name: string;
    dob: string;
    ohip: string;
    gender: string;
  };
  clinicalAlert: ClinicalAlert;
  bodilySystems: BodySystem[];
  referralDraft: ReferralDraft;
}

export const MOCK_SYNTHESIS_RESPONSE: SynthesisResponse = {
  patientSummary: {
    name: "James McAllister",
    dob: "1958-03-12",
    ohip: "9281-442-817",
    gender: "Male",
  },
  clinicalAlert: {
    severity: "critical",
    title: "Cardiac Risk Cross-Reference Detected",
    message:
      "Alert: Patient presenting with acute chest pain has an underlying historical risk of Cardiovascular disease (Coronary artery blockage with stent placement, 5 years ago). Check for cardiac etiology over standard respiratory/flu symptoms. Recommend ECG, troponin panel, and comparison with last stress echo (2020-06, EF 58%).",
    relatedSystems: ["cardiovascular", "respiratory"],
  },
  bodilySystems: [
    {
      id: "cardiovascular",
      name: "Cardiovascular System",
      icon: "Heart",
      accentColor: "#DC2626",
      findings: [
        {
          label: "Substernal chest pain",
          detail: "Non-radiating, 3/10, worsens with deep inspiration",
          source: "todays_note",
          severity: "high",
        },
        {
          label: "Coronary artery blockage — 85% LAD occlusion",
          detail:
            "PCI with drug-eluting stent, Sunnybrook HSC, post-op cardiac rehab completed",
          source: "cds_xml",
          date: "2019-07-15",
          severity: "critical",
        },
        {
          label: "Hypertension — Stage 1",
          detail: "Controlled on Enalapril 10mg daily",
          source: "cds_xml",
          date: "2018-02-14",
          severity: "moderate",
        },
        {
          label: "Today's BP elevated",
          detail: "134/86 mmHg (baseline typically 128/82)",
          source: "todays_note",
          severity: "moderate",
        },
      ],
      historicalEvents: [
        {
          date: "2019-07-15",
          description:
            "PCI with drug-eluting stent to LAD artery — 85% blockage",
          facility: "Sunnybrook Health Sciences Centre",
        },
        {
          date: "2019-12",
          description: "Cardiac rehabilitation program completed",
        },
        {
          date: "2020-06",
          description: "Stress echo — normal, EF 58%, no anginal symptoms",
        },
      ],
      medications: [
        "Atorvastatin 40mg daily (statin therapy)",
        "ASA 81mg daily (antiplatelet post-stent)",
        "Enalapril 10mg daily (antihypertensive)",
      ],
      hasReferralAction: true,
    },
    {
      id: "respiratory",
      name: "Respiratory System",
      icon: "Wind",
      accentColor: "#2563EB",
      findings: [
        {
          label: "Shortness of breath",
          detail: "Ongoing for 12 hours, worsening with exertion",
          source: "todays_note",
          severity: "moderate",
        },
        {
          label: "Dry cough and nasal congestion",
          detail: "Since yesterday, consistent with upper respiratory symptoms",
          source: "todays_note",
          severity: "low",
        },
        {
          label: "Scattered rhonchi bilaterally",
          detail: "Auscultation finding — suggests airway secretions",
          source: "todays_note",
          severity: "moderate",
        },
        {
          label: "SpO2 96%",
          detail: "Mildly reduced, monitor for decline",
          source: "todays_note",
          severity: "low",
        },
      ],
      historicalEvents: [],
      medications: [],
    },
    {
      id: "endocrine",
      name: "Endocrine System",
      icon: "Activity",
      accentColor: "#7C3AED",
      findings: [
        {
          label: "Type 2 Diabetes Mellitus",
          detail: "Diagnosed Aug 2017, managed with diet + metformin since 2019",
          source: "cds_xml",
          date: "2017-08-03",
          severity: "moderate",
        },
        {
          label: "A1C stable at 7.1%",
          detail: "Last checked 2021-04-15, within acceptable target",
          source: "cds_xml",
          severity: "low",
        },
      ],
      historicalEvents: [
        {
          date: "2017-08",
          description: "Initial T2DM diagnosis — dietary management started",
        },
        {
          date: "2019",
          description: "Metformin added to regimen",
        },
      ],
      medications: ["Metformin (dose not specified in CDS)"],
    },
    {
      id: "musculoskeletal",
      name: "Musculoskeletal System",
      icon: "Bone",
      accentColor: "#D97706",
      findings: [
        {
          label: "No acute musculoskeletal complaints",
          detail: "No joint pain, swelling, or trauma reported in today's encounter",
          source: "todays_note",
          severity: "low",
        },
      ],
      historicalEvents: [],
      medications: [
        "Acetaminophen 500mg PRN (pain management)",
      ],
    },
    {
      id: "immunological",
      name: "Immunological / Allergy Profile",
      icon: "ShieldAlert",
      accentColor: "#E11D48",
      findings: [
        {
          label: "Drug allergy — Amoxicillin",
          detail: "Reaction: Hives, throat swelling — AVOID all penicillin derivatives",
          source: "cds_xml",
          severity: "critical",
        },
        {
          label: "Mild flu-like symptoms",
          detail:
            "Low-grade temp 37.1°C, cough, congestion — possible viral URI",
          source: "todays_note",
          severity: "low",
        },
      ],
      historicalEvents: [],
      medications: [],
    },
    {
      id: "gastrointestinal",
      name: "Gastrointestinal System",
      icon: "Stethoscope",
      accentColor: "#059669",
      findings: [
        {
          label: "Appendectomy (historical)",
          detail: "Laparoscopic, uncomplicated, 2015",
          source: "cds_xml",
          date: "2015-09-22",
          severity: "low",
        },
        {
          label: "No acute GI complaints today",
          detail: "Denies nausea — no abdominal pain reported",
          source: "todays_note",
          severity: "low",
        },
      ],
      historicalEvents: [
        {
          date: "2015-09-22",
          description: "Laparoscopic appendectomy — uncomplicated recovery",
        },
      ],
      medications: [],
    },
  ],
  referralDraft: {
    specialty: "Cardiology",
    recipientTitle: "Attending Cardiologist",
    patientName: "James McAllister",
    body: `Dear Colleague,

I am writing to refer Mr. James McAllister (DOB: 1958-03-12, OHIP: 9281-442-817) for urgent cardiology consultation regarding recurrent chest pain in the context of known coronary artery disease.

CLINICAL HISTORY:
Mr. McAllister underwent percutaneous coronary intervention (PCI) with drug-eluting stent placement to the left anterior descending (LAD) artery on July 15, 2019, at Sunnybrook Health Sciences Centre. The indication was an 85% coronary artery blockage identified on diagnostic angiography. Post-procedure recovery was uneventful, and he completed cardiac rehabilitation in December 2019. His most recent stress echocardiogram (June 2020) demonstrated normal findings with an ejection fraction of 58% and no anginal symptoms.

CURRENT PRESENTATION:
Mr. McAllister presents today (${new Date().toISOString().split("T")[0]}) with acute substernal chest pain rated 3/10, non-radiating, worsening with deep inspiration, accompanied by shortness of breath for 12 hours. Vitals: BP 134/86, HR 88, SpO2 96%.

CURRENT MEDICATIONS:
• Atorvastatin 40mg daily
• Acetylsalicylic Acid 81mg daily
• Enalapril 10mg daily

RELEVANT COMORBIDITIES:
• Type 2 Diabetes Mellitus (A1C 7.1%)
• Essential Hypertension (Stage 1, controlled)

ALLERGY: Amoxicillin (hives, throat swelling)

CLINICAL CONCERN:
Given his significant cardiac history, I am concerned about potential in-stent restenosis, new coronary lesion, or acute coronary syndrome. I would appreciate your expert assessment including ECG review, troponin panel, and consideration for repeat coronary angiography if clinically indicated.

Thank you for your timely attention to this referral.

Sincerely,
[Attending Family Physician]
[Clinic Name & Address]
[CPSO #]`,
    auditLine: `Audit Trail: Electronic signature verified by Attending MD at ${new Date().toISOString()}. CNO-Compliant record. Document generated with AI-assisted clinical decision support — reviewed and approved by physician prior to transmission.`,
  },
};
