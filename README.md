# ScamShield AI

**Digital Arrest & Real-Time Cyber Fraud Shield**

A transparency-first web application that helps people identify suspicious messages associated with digital arrest scams, impersonation, threats, urgency, and fraudulent demands for money.

Built for the **GTU AI Idea Forge 2026** hackathon.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Detection Engine](#detection-engine)
- [Test Cases](#test-cases)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [Presentation Guide](#presentation-guide)
- [Tech Stack](#tech-stack)
- [Privacy](#privacy)
- [License](#license)

---

## Overview

ScamShield AI is an educational prototype that analyzes suspicious SMS, WhatsApp messages, and call transcripts for known fraud patterns. It uses a transparent, explainable rule-based detection engine — no black-box AI, no paid APIs, no API keys required.

The app highlights suspicious phrases directly in the user's text, explains each warning sign in plain language, assigns a risk score (Low / Medium / High), and provides practical safety advice tailored to the detected patterns.

> **Disclaimer:** ScamShield AI is a prototype for educational purposes only. It cannot guarantee whether a message is fraudulent or legitimate. Always verify independently and report suspicious activity to **1930** (National Cybercrime Helpline) or **cybercrime.gov.in**.

---

## Features

1. **Professional landing page** — project name, tagline, animated hero, feature overview
2. **Live dashboard** — total messages analyzed, risk category breakdown, fraud category charts, detection engine stats
3. **Message analyzer** — paste any suspicious text (SMS, WhatsApp, call transcript)
4. **Functional Analyze button** — runs the detection engine in real time
5. **Risk assessment** — Low, Medium, or High with a visual risk gauge and score (0–100)
6. **Phrase highlighting** — suspicious phrases are highlighted in the text with color-coded severity
7. **Warning sign explanations** — each detected signal shows its category, matched text, and a plain-language explanation
8. **Safety advice** — practical, context-aware guidance (never transfer money under pressure, verify caller identity, etc.)
9. **10 sample messages** — covering obvious scams, legitimate messages, and ambiguous cases
10. **Analysis history** — stored in browser localStorage with clear-history option; only 80-character previews are saved
11. **About page** — explains the problem, solution, architecture, limitations, technology, test cases, and future improvements
12. **Responsive design** — works from mobile to desktop with a blue / white / dark-navy cybersecurity aesthetic

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at the URL shown in your terminal (typically `http://localhost:5173`).

### Build for Production

```bash
npm run build
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

---

## Architecture

```
src/
├── types/
│   └── index.ts              # Shared TypeScript types (AnalysisResult, ScamSignal, etc.)
├── engine/
│   └── detectionEngine.ts    # Isolated detection engine — the brain of the app
├── data/
│   └── sampleMessages.ts     # 10 fictional test messages (scams, legitimate, ambiguous)
├── utils/
│   └── history.ts            # localStorage-based history management
├── components/
│   ├── Logo.tsx              # Brand logo
│   ├── Navbar.tsx            # Navigation bar (responsive, mobile menu)
│   ├── Footer.tsx            # Footer with links and disclaimer
│   └── RiskBadge.tsx         # Risk level badge + circular risk gauge
├── pages/
│   ├── LandingPage.tsx       # Hero, features, problem explanation
│   ├── AnalyzerPage.tsx      # Core analyzer with input, results, highlighting, history
│   ├── DashboardPage.tsx     # Stats, charts, risk distribution, recent analyses
│   └── AboutPage.tsx         # Full documentation page
├── App.tsx                   # Root component with page routing
├── main.tsx                  # React entry point
└── index.css                 # Global styles, Tailwind, custom theme
```

### Design Principles

- **Separation of concerns:** The detection engine is completely isolated from the UI. It exposes a single `analyzeMessage(text: string): AnalysisResult` function. Any UI component or future API integration can consume this interface.
- **Transparency:** Every detection rule has a human-readable explanation. Users see exactly what was matched and why it matters.
- **Privacy first:** All processing happens in the browser. No message content is sent to any server. History stores only short previews.
- **No external dependencies beyond the stack:** No paid APIs, no API keys, no backend required for the basic demo.

---

## Detection Engine

The engine lives in `src/engine/detectionEngine.ts` and uses a set of weighted pattern-matching rules.

### How It Works

1. **Input:** The user's message text is passed to `analyzeMessage()`.
2. **Rule matching:** The text is tested against 16 regex-based rules, each belonging to one of 7 categories.
3. **Scoring:** Each matched rule adds its weight (10–25 points) to the raw score.
4. **False-positive reduction:** Legitimacy indicators (OTP messages, delivery updates, personal notes) reduce the score for benign messages.
5. **Risk mapping:** The final score (0–100) maps to:
   - **Low:** 0–17
   - **Medium:** 18–44
   - **High:** 45–100
6. **Output:** An `AnalysisResult` containing the risk level, score, list of signals (each with category, matched text, explanation, and weight), a summary, and tailored safety advice.

### Rule Categories

| Category | Weight Range | Example Patterns |
|---|---|---|
| Impersonation / Threat | 12–25 | "digital arrest", "CBI", "video call" |
| Threat / Intimidation | 15–18 | "arrest warrant", "drugs", "money laundering" |
| Impersonation | 14–16 | "TRAI", "FedEx parcel", "customs officer" |
| Urgency / Pressure | 12–14 | "immediately", "don't tell anyone" |
| Financial Demand | 10–18 | "transfer money", "UPI", phishing links |
| Information Harvesting | 20 | "share your OTP", "bank details" |
| Account / Service Threat | 12–13 | "KYC expired", "SIM suspended" |
| Reward / Lottery | 14–16 | "won Rs 25 lakh", "guaranteed returns" |

### AI Integration Path

To replace or augment the rule-based engine with an LLM:

1. Modify `src/engine/detectionEngine.ts` to call an LLM API (OpenAI, Gemini, etc.) instead of (or in addition to) the regex rules.
2. Map the LLM response to the existing `AnalysisResult` interface.
3. No UI changes are required — all components consume the same interface.

---

## Test Cases

The app includes 10 sample messages accessible from the "Sample Messages" dropdown in the Analyzer:

### Scam Examples (Expected: High Risk)

| # | Label | Description |
|---|---|---|
| 1 | Digital Arrest Scam | Classic CBI impersonation with video call + money demand |
| 2 | Courier / Package Scam | Fake FedEx parcel with narcotics accusation + link |
| 3 | KYC Expiry Phishing | Fake bank KYC expiry with phishing link |
| 4 | Lottery / Prize Scam | Fake KBC prize win demanding processing fee + OTP |

### Ambiguous Examples (Expected: Medium Risk)

| # | Label | Description |
|---|---|---|
| 5 | SIM Suspension Threat | Fake TRAI SIM deactivation |
| 6 | Investment Tip Scam | Unrealistic guaranteed returns |
| 10 | Ambiguous Bank Call | Could be legitimate fraud alert or scam |

### Legitimate Examples (Expected: Low Risk)

| # | Label | Description |
|---|---|---|
| 7 | Legitimate OTP | Genuine bank OTP transaction message |
| 8 | Legitimate Delivery Update | Real Amazon package notification |
| 9 | Legitimate Personal Message | Normal WhatsApp lunch plan from a friend |

### How to Test

1. Open the Analyzer page.
2. Click "Sample Messages" and select any sample.
3. Click "Analyze" and verify:
   - The risk level matches the expected risk.
   - Suspicious phrases are highlighted in the text.
   - Each signal has an expandable explanation.
   - Safety advice is relevant to the detected patterns.
4. After analyzing multiple messages, check the Dashboard for updated stats.

---

## Limitations

- The baseline engine uses pattern matching — it can miss novel scam formats or cleverly worded messages.
- False positives are possible: legitimate messages containing words like "OTP", "legal", or "urgent" may be flagged.
- It cannot analyze images, voice notes, or links — only text input is supported.
- The detector does not verify sender identity or phone numbers.
- No AI model is integrated yet — all analysis is rule-based and transparent.
- History is stored locally per browser — it will not sync across devices.
- The app does not claim to guarantee whether a message is fraudulent.

---

## Future Improvements

- Integrate an LLM API (OpenAI / Gemini) for deeper contextual analysis beyond pattern matching
- Add voice/call transcript upload with speech-to-text transcription
- Support regional Indian languages (Hindi, Gujarati, Tamil, etc.)
- Build a community-reporting feature to crowdsource new scam patterns
- Add a browser extension for real-time WhatsApp Web and SMS analysis
- Implement server-side analysis with Supabase for aggregate scam trend tracking
- Add user accounts with authentication to sync history across devices

---

## Presentation Guide (3-Minute Pitch)

### Slide 1: Problem (30 seconds)
- "India lost over Rs 1,750 crore to cyber fraud in 2024."
- "Digital arrest scams: fraudsters impersonate police/CBI over video calls, threaten arrest, isolate the victim, and demand money."
- "Most victims don't recognize the scam until after they've paid."

### Slide 2: Solution (45 seconds)
- "ScamShield AI: paste any suspicious message and get an instant risk assessment."
- "16+ explainable detection rules across 7 fraud categories."
- "Every flagged phrase is highlighted and explained in plain language — no black box."
- Show the landing page and navigate to the Analyzer.

### Slide 3: Live Demo (60 seconds)
1. Open the Analyzer.
2. Select "Digital Arrest Scam" from Sample Messages.
3. Click Analyze — show the risk gauge, highlighted phrases, and expanded explanations.
4. Switch to "Legitimate OTP" sample — show it correctly scores as Low Risk.
5. Switch to "Ambiguous Bank Call" — show Medium Risk and the uncertainty explanation.
6. Navigate to Dashboard — show the stats updating.

### Slide 4: Architecture & Future (45 seconds)
- "Detection engine is isolated — one function, one interface. An LLM API can be plugged in without touching the UI."
- "Privacy-first: everything runs in the browser, no data sent to servers."
- "Future: LLM integration, voice transcripts, Indian language support, browser extension."
- "Report fraud to 1930 or cybercrime.gov.in."

### Tips
- Practice the demo flow in advance — know exactly which buttons to click.
- Emphasize transparency: judges love explainable AI over black boxes.
- If asked about accuracy, be honest about limitations — that's a strength, not a weakness.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework with hooks |
| TypeScript | Type-safe development |
| Vite | Fast build tooling and dev server |
| Tailwind CSS | Utility-first styling with custom cybersecurity theme |
| Lucide React | Icon system |
| LocalStorage API | Browser-based analysis history |

---

## Privacy

- All message analysis happens entirely in the browser.
- No message content is sent to any server.
- Analysis history stores only an 80-character preview of each message in localStorage.
- Full message text is never persisted.
- History can be cleared at any time from the Analyzer or Dashboard.
- No account, sign-up, or tracking is required.

---

## License

This project is an educational prototype built for the GTU AI Idea Forge 2026 hackathon. It is provided as-is for educational and demonstration purposes.
