import "server-only";

import type {
  BodySystem,
  ClinicalAlert,
  Finding,
  HistoricalEvent,
  ReferralDraft,
  SynthesisResponse,
} from "@/services/mockData";

type SystemDefinition = {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
  keywords: RegExp;
};

const SYSTEMS: SystemDefinition[] = [
  {
    id: "cardiovascular",
    name: "Cardiovascular System",
    icon: "Heart",
    accentColor: "#C66A73",
    keywords:
      /cardiac|cardio|coronary|heart|chest|angina|stent|\bpci\b|blood pressure|\bbp\b|hypertension|artery|palpitation|atorvastatin|aspirin|acetylsalicylic|enalapril/i,
  },
  {
    id: "respiratory",
    name: "Respiratory System",
    icon: "Wind",
    accentColor: "#6B8FB3",
    keywords:
      /respirat|shortness of breath|\bsob\b|cough|lung|rhonchi|wheez|congestion|oxygen|spo2|asthma|dyspnea/i,
  },
  {
    id: "endocrine",
    name: "Endocrine & Metabolic",
    icon: "Activity",
    accentColor: "#8875AD",
    keywords:
      /diabet|a1c|glucose|glyc|metformin|thyroid|endocrine|insulin|metabolic/i,
  },
  {
    id: "musculoskeletal",
    name: "Musculoskeletal System",
    icon: "Bone",
    accentColor: "#B38752",
    keywords:
      /musculoskeletal|joint|muscle|bone|arthritis|back pain|neck pain|acetaminophen|fracture|mobility/i,
  },
  {
    id: "immunological",
    name: "Immunological & Allergy Profile",
    icon: "ShieldAlert",
    accentColor: "#B4698C",
    keywords:
      /allerg|amoxicillin|penicillin|immune|infection|viral|flu|fever|hives|swelling/i,
  },
  {
    id: "gastrointestinal",
    name: "Gastrointestinal System",
    icon: "Stethoscope",
    accentColor: "#5E927B",
    keywords:
      /gastro|abdominal|abdomen|nausea|vomit|bowel|diarrhea|constipation|append|liver|stomach/i,
  },
  {
    id: "general",
    name: "General Clinical Summary",
    icon: "FileText",
    accentColor: "#71877E",
    keywords: /(?!)/,
  },
];

type MutableSystem = BodySystem & { definition: SystemDefinition };

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cleanText(value: string) {
  return decodeXml(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatch(value: string, pattern: RegExp) {
  const match = value.match(pattern);
  return match?.[1] ? cleanText(match[1]) : "";
}

function formatDate(raw: string) {
  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  }
  if (/^\d{6}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}`;
  }
  return raw || "Date not supplied";
}

function sentenceLabel(sentence: string) {
  const normalized = sentence
    .replace(/^(patient\s+)?(presents today with|reports|states|notes)\s+/i, "")
    .replace(/^vitals?:\s*/i, "Vital signs: ")
    .trim();
  const firstClause = normalized.split(/[,;:]/)[0]?.trim() || normalized;
  return firstClause.length > 72
    ? `${firstClause.slice(0, 69).trim()}…`
    : firstClause;
}

function severityFor(text: string): Finding["severity"] {
  if (/^(denies|no\s|without\s)/i.test(text.trim())) return "low";
  if (/throat swelling|anaphyla|critical|85%|occlusion/i.test(text)) return "critical";
  if (/chest pain|shortness of breath|\bsob\b|severe|urgent/i.test(text)) return "high";
  if (/hypertension|diabet|elevated|rhonchi|abnormal/i.test(text)) return "moderate";
  return "low";
}

function makeSystems(): MutableSystem[] {
  return SYSTEMS.map((definition) => ({
    definition,
    id: definition.id,
    name: definition.name,
    icon: definition.icon,
    accentColor: definition.accentColor,
    findings: [],
    historicalEvents: [],
    medications: [],
  }));
}

function matchingSystems(systems: MutableSystem[], value: string) {
  return systems.filter(({ definition }) => definition.keywords.test(value));
}

function addUniqueFinding(system: MutableSystem, finding: Finding) {
  const duplicate = system.findings.some(
    (item) =>
      item.source === finding.source &&
      item.label.toLowerCase() === finding.label.toLowerCase(),
  );
  if (!duplicate) system.findings.push(finding);
}

function addUniqueEvent(system: MutableSystem, event: HistoricalEvent) {
  const duplicate = system.historicalEvents.some(
    (item) => item.date === event.date && item.description === event.description,
  );
  if (!duplicate) system.historicalEvents.push(event);
}

function parsePatient(cdsXml: string): SynthesisResponse["patientSummary"] {
  const given = firstMatch(cdsXml, /<given[^>]*>([\s\S]*?)<\/given>/i);
  const family = firstMatch(cdsXml, /<family[^>]*>([\s\S]*?)<\/family>/i);
  const birth = firstMatch(cdsXml, /<birthTime[^>]*value="([^"]+)"/i);
  const genderCode = firstMatch(
    cdsXml,
    /<administrativeGenderCode[^>]*code="([^"]+)"/i,
  ).toUpperCase();
  const identifier = firstMatch(
    cdsXml,
    /<id[^>]*extension="(?:ON-OHIP-)?([^"]+)"[^>]*root="2\.16\.840\.1\.113883\.4\.595"/i,
  );

  return {
    name: [given, family].filter(Boolean).join(" ") || "Patient name unavailable",
    dob: formatDate(birth) || "Not supplied",
    ohip: identifier || "Not supplied",
    gender:
      genderCode === "M" ? "Male" : genderCode === "F" ? "Female" : "Not supplied",
  };
}

function parseCurrentNote(systems: MutableSystem[], todaysNote: string) {
  const sentences = todaysNote
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  for (const sentence of sentences) {
    const matches = matchingSystems(systems, sentence);
    const targets = matches.length
      ? matches
      : systems.filter((system) => system.id === "general");
    for (const system of targets) {
      addUniqueFinding(system, {
        label: sentenceLabel(sentence),
        detail: sentence,
        source: "todays_note",
        severity: severityFor(sentence),
      });
    }
  }
}

function parseEmrSections(systems: MutableSystem[], cdsXml: string) {
  const sections = cdsXml.match(/<section\b[\s\S]*?<\/section>/gi) ?? [];

  for (const section of sections) {
    const sectionName = firstMatch(
      section,
      /<code[^>]*displayName="([^"]+)"/i,
    ).toLowerCase();
    const entries = section.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? [];

    for (const entry of entries) {
      const text = firstMatch(entry, /<text[^>]*>([\s\S]*?)<\/text>/i);
      const displayNames = [...entry.matchAll(/displayName="([^"]+)"/gi)]
        .map((match) => cleanText(match[1]))
        .filter(
          (name) =>
            name &&
            !/^(problem|disease|procedure|drug allergy|medications)$/i.test(name),
        );
      const dateValue = firstMatch(entry, /<effectiveTime[^>]*value="([^"]+)"/i);
      const date = dateValue ? formatDate(dateValue) : undefined;
      const combined = [...displayNames, text].filter(Boolean).join(" — ");
      if (!combined) continue;

      const targets = matchingSystems(systems, combined);
      if (sectionName.includes("medication")) {
        const medicationName = displayNames.at(-1) || sentenceLabel(text);
        const medication = text
          ? `${medicationName} — ${text}`
          : medicationName;
        for (const system of targets) {
          if (!system.medications.includes(medication)) {
            system.medications.push(medication);
          }
        }
        continue;
      }

      const fallbackTargets = targets.length
        ? targets
        : sectionName.includes("allerg")
          ? systems.filter((system) => system.id === "immunological")
          : systems.filter((system) => system.id === "general");

      for (const system of fallbackTargets) {
        const isAllergy = sectionName.includes("allerg");
        const label = isAllergy
          ? `Drug allergy — ${displayNames.at(-1) || "substance not supplied"}`
          : displayNames.at(-1) || sentenceLabel(text);

        addUniqueFinding(system, {
          label,
          detail: text || combined,
          source: "cds_xml",
          date,
          severity: severityFor(combined),
        });

        if (date && (sectionName.includes("past") || sectionName.includes("clinical"))) {
          addUniqueEvent(system, {
            date,
            description: (text || combined).slice(0, 180),
          });
        }
      }
    }
  }
}

function createAlert(
  systems: BodySystem[],
  cdsXml: string,
  todaysNote: string,
): ClinicalAlert {
  const note = todaysNote.toLowerCase();
  const history = cdsXml.toLowerCase();
  const affirmativeNote = note
    .split(/(?<=[.!?])\s+|\n+/)
    .filter((sentence) => !/^\s*(denies|no\s|without\s)/.test(sentence))
    .join(" ");

  if (/chest pain|chest pressure|chest discomfort/.test(affirmativeNote) && /coronary|stent|\bpci\b|cardiac/.test(history)) {
    return {
      severity: "critical",
      title: "Cardiac history connected to today’s presentation",
      message:
        "Today’s note contains chest symptoms while the imported record contains prior coronary disease or intervention. This cross-record match warrants prompt clinician review; it is not a diagnosis.",
      relatedSystems: ["cardiovascular", "respiratory"],
    };
  }

  if (/shortness of breath|\bsob\b|dyspnea/.test(affirmativeNote) && /coronary|cardiac|heart/.test(history)) {
    return {
      severity: "high",
      title: "Breathing symptoms overlap with cardiac history",
      message:
        "The current breathing complaint overlaps with cardiovascular history in the imported record. Review both systems together and verify the source details.",
      relatedSystems: ["respiratory", "cardiovascular"],
    };
  }

  const todayCount = systems.reduce(
    (count, system) =>
      count + system.findings.filter((finding) => finding.source === "todays_note").length,
    0,
  );

  return {
    severity: "info",
    title: "Clinical history organized for review",
    message: `${todayCount} current-note finding${todayCount === 1 ? "" : "s"} were connected to the imported record. No predefined high-priority cross-record pattern was detected; clinician review is still required.`,
    relatedSystems: [],
  };
}

function createReferral(
  patient: SynthesisResponse["patientSummary"],
  systems: BodySystem[],
  todaysNote: string,
): ReferralDraft {
  const cardiovascular = systems.find((system) => system.id === "cardiovascular");
  const hasCardiacContext = Boolean(
    cardiovascular &&
      (cardiovascular.findings.length || cardiovascular.historicalEvents.length),
  );
  const specialty = hasCardiacContext ? "Cardiology" : "Internal Medicine";
  const history = cardiovascular?.historicalEvents
    .map((event) => `• ${event.date}: ${event.description}`)
    .join("\n");
  const medications = cardiovascular?.medications
    .map((medication) => `• ${medication}`)
    .join("\n");

  return {
    specialty,
    recipientTitle: `${specialty} intake team`,
    patientName: patient.name,
    body: `DATE: ${new Date().toISOString().slice(0, 10)}
TO: ${specialty} intake team
RE: ${patient.name} (DOB: ${patient.dob})

Dear Colleague,

Please assess this patient in the context of the following current presentation and imported longitudinal record.

CURRENT ENCOUNTER:
${todaysNote}

RELEVANT TIMELINE:
${history || "• No dated events were extracted from the imported record."}

RELEVANT MEDICATIONS:
${medications || "• No related medications were extracted."}

This draft was assembled from the supplied record and requires clinician verification, editing, and appropriate triage before use.

Sincerely,
[Attending clinician]`,
    auditLine:
      "Draft generated from the current session inputs. No electronic signature or transmission has occurred.",
  };
}

function createProgressNote(
  patient: SynthesisResponse["patientSummary"],
  systems: BodySystem[],
  todaysNote: string,
) {
  const historySummary = systems
    .flatMap((system) =>
      system.findings
        .filter((finding) => finding.source === "cds_xml")
        .slice(0, 2)
        .map((finding) => `${system.name}: ${finding.label}`),
    )
    .slice(0, 8);

  return `PATIENT:
${patient.name} | DOB: ${patient.dob} | Identifier: ${patient.ohip}

CURRENT ENCOUNTER:
${todaysNote}

RELEVANT IMPORTED HISTORY:
${historySummary.length ? historySummary.map((item) => `• ${item}`).join("\n") : "• No categorized history extracted."}

CLINICIAN REVIEW:
Verify every extracted item against the source record before signing or copying into an EMR.`;
}

export function synthesizeClinicalData(
  cdsXml: string,
  todaysNote: string,
): SynthesisResponse {
  const mutableSystems = makeSystems();
  const patientSummary = parsePatient(cdsXml);

  parseEmrSections(mutableSystems, cdsXml);
  parseCurrentNote(mutableSystems, todaysNote);

  const bodilySystems: BodySystem[] = mutableSystems
    .filter(
      (system) =>
        system.findings.length ||
        system.historicalEvents.length ||
        system.medications.length,
    )
    .map((system) => ({
      id: system.id,
      name: system.name,
      icon: system.icon,
      accentColor: system.accentColor,
      findings: system.findings,
      historicalEvents: system.historicalEvents,
      medications: system.medications,
      hasReferralAction:
        system.id === "cardiovascular" &&
        system.findings.some((finding) => finding.source === "todays_note"),
    }));

  return {
    patientSummary,
    clinicalAlert: createAlert(bodilySystems, cdsXml, todaysNote),
    bodilySystems,
    referralDraft: createReferral(patientSummary, bodilySystems, todaysNote),
    emrProgressNote: createProgressNote(
      patientSummary,
      bodilySystems,
      todaysNote,
    ),
  };
}
