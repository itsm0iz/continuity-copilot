# ClinWeave

ClinWeave is a clinical decision-support prototype for Ontario family physicians. It connects a patient’s longitudinal EMR history with today’s encounter notes, helping clinicians identify relevant patterns, potential risks, and important context that might otherwise be missed during a time-constrained visit.

The prototype accepts OntarioMD-style Core Data Set (CDS) XML and a current clinical note, then presents:

- a high-priority clinical alert based on current and historical findings;
- findings organized by body system, with their source clearly identified;
- historical timelines and relevant medications; and
- an editable, targeted referral that can be copied for review; and
- a separate lab-report workspace with clinician and patient-facing explanations.

The included scenario connects a patient's new chest pain and shortness of breath with a history of coronary artery disease and LAD stent placement.

## Clinical workflow

1. Import or edit the synthetic CDS XML and today&apos;s encounter note on the intake screen.
2. Confirm that the session uses synthetic or properly de-identified data.
3. Select **Continue to clinical review**.
4. Review the source-labelled clinical alert and body-system findings.
5. Open, edit, and copy the targeted referral draft if appropriate.
6. Use the back button or **End session** action to clear the current browser view and return to intake.

The header also opens **Lab Report Dissection**, where reports in `Marker: value (flag)` format are separated into source-flagged and unflagged results.

## Run locally

Requirements:

- Node.js 20.9 or later
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/dashboard`.

Useful commands:

```bash
npm run dev    # start the development server
npm run lint   # run ESLint
npm run build  # create a production build
npm run start  # serve the production build
```

## Input processing

The application no longer returns a fixed result. `POST /api/synthesize` parses patient demographics and categorized entries from the supplied XML, then classifies sentences from the current note into relevant clinical systems. Changing the note changes the returned findings. A small set of explicit cross-record rules can raise review alerts, such as connecting current chest symptoms with prior coronary history.

`POST /api/lab-dissect` parses the supplied report one line at a time and preserves explicit laboratory flags. It does not infer reference ranges when the source report does not provide a flag.

Processing is deterministic and server-side; it does not require an API key or send inputs to a model provider. The included sample data remains available as an editable starting point.

This extraction layer is designed for prototype evaluation. It is not a complete CDA/CDS parser, terminology service, or clinically validated decision engine.

## Project structure

```text
src/
├── app/
│   ├── api/synthesize/route.ts  # dynamic clinical synthesis endpoint
│   ├── api/lab-dissect/route.ts # dynamic lab-report endpoint
│   ├── dashboard/page.tsx       # dashboard state and workflow
│   ├── layout.tsx               # application shell and metadata
│   └── page.tsx                 # redirect to the dashboard
├── components/                  # intake, results, labs, navigation, and safety UI
└── services/
    ├── clinicalSynthesis.ts     # server-only XML and note extraction
    ├── labAnalysis.ts           # server-only lab text parsing
    ├── mockData.ts              # synthetic clinical input and shared types
    └── mockLabData.ts           # synthetic lab input and shared types
```

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Lucide React icons

## Safety and scope

This repository is a hackathon/prototype system, not a medical device or production clinical system. It must not be used to diagnose or treat patients, and all extracted or generated content requires clinician review.

The interface is intentionally labelled for synthetic or properly de-identified data. The current application has no authentication, database, durable audit store, EMR integration, or production security controls. Clearing a session removes React state from the current browser view; it is not a verified infrastructure-wide retention guarantee.

Do not enter real personal health information.
