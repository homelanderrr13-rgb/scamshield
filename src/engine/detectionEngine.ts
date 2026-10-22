import type { AnalysisResult, RiskLevel, ScamSignal } from "@/types";

interface Rule {
  id: string;
  category: string;
  /** Regex matched (case-insensitive) against the message */
  pattern: RegExp;
  /** Explanation displayed to the user when this rule fires */
  explanation: string;
  /** Weight added to the risk score when this rule matches */
  weight: number;
}

const RULES: Rule[] = [
  {
    id: "digital-arrest",
    category: "Impersonation / Threat",
    pattern: /digital arrest|online arrest|virtual arrest|digital custody|police arrest you online|cyber arrest/i,
    explanation:
      "Indian police do not conduct 'digital arrest' over a video call. There is no legal procedure called a digital arrest — this is the hallmark of the ongoing impersonation scam.",
    weight: 25,
  },
  {
    id: "threat-legal-action",
    category: "Threat / Intimidation",
    pattern: /legal action|legal notice|court order|arrest warrant|non[- ]bailable warrant|\bFIR\b|police case|criminal case|summons/i,
    explanation:
      "The message threatens formal legal consequences. Genuine legal notices are delivered physically or through verified official channels, not via WhatsApp or SMS.",
    weight: 15,
  },
  {
    id: "threat-arrest-immediate",
    category: "Threat / Intimidation",
    pattern: /arrest you|you will be arrested|coming to arrest|pick you up|take you into custody|jail time|prison/i,
    explanation:
      "Direct threat of arrest through a text or call. No real law-enforcement officer arrests someone over a phone or video call without due process.",
    weight: 18,
  },
  {
    id: "impersonation-authority",
    category: "Impersonation",
    pattern: /\b(TRAI|Narcotics|CBI|ED|Enforcement Directorate|RAW|IB|Cyber Crime|Cyber Cell|Narcotics Bureau|customs officer|income tax officer|reserve bank)\b/i,
    explanation:
      "The sender claims to represent a government agency or law-enforcement body. Scammers frequently impersonate these names to create fear and authority.",
    weight: 16,
  },
  {
    id: "impersonation-package",
    category: "Impersonation",
    pattern: /\bparcel\b|package (was|is|has been) (booked|shipped|intercepted|seized)|\bcourier\b|\bFedEx\b|\bDHL\b|shipment in your name/i,
    explanation:
      "A package or parcel allegedly linked to you is a common scam pretext used to create urgency and fear, especially when combined with drug or money-laundering accusations.",
    weight: 14,
  },
  {
    id: "urgency-deadline",
    category: "Urgency / Pressure",
    pattern: /immediately|right now|within \d+ (hour|minute|day)|last warning|final warning|today only|before it expires|act now|don'?t (waste|delay)|time[- ]sensitive|deadline/i,
    explanation:
      "The message creates an artificial deadline. Scammers use urgency so you act before you can think or verify. Real institutions give you reasonable time to respond.",
    weight: 12,
  },
  {
    id: "urgency-isolation",
    category: "Urgency / Pressure",
    pattern: /don'?t tell anyone|keep this confidential|do not disconnect|stay on the line|don'?t talk to (your )?(family|husband|wife|parents|friends)|don'?t contact anyone|isolate/i,
    explanation:
      "You are told to keep this secret or stay isolated. This prevents you from seeking a second opinion — a classic manipulation tactic.",
    weight: 14,
  },
  {
    id: "money-demand",
    category: "Financial Demand",
    pattern: /\btransfer\b (the )?(money|funds|₹|Rs\.?|rupees|amount|payment)|\bsend\b (money|payment|amount)|\bpay\b (now|immediately)|\bpay\b .{0,25}(fee|fine|penalty|charge)|\bdeposit\b|\bwire\b|\bUPI\b|GPay|PhonePe|Paytm|Google ?Pay|\bbitcoin\b|\bcrypto\b|gift card|refund (will be )?credited|refund (amount|process)/i,
    explanation:
      "The message asks for money or sets up a payment flow. Legitimate agencies never demand instant payments over a call or message to avoid arrest.",
    weight: 18,
  },
  {
    id: "money-link",
    category: "Financial Demand",
    pattern: /https?:\/\/\S+|bit\.ly\/\S+|tinyurl\.com\/\S+|click (here|the link)|tap (here|the link)|visit (the )?link|open (the )?link/i,
    explanation:
      "The message contains or directs you to a link. Phishing links impersonate banks, courier services, or government portals to steal credentials or install malware.",
    weight: 10,
  },
  {
    id: "sensitive-info-request",
    category: "Information Harvesting",
    pattern: /(share|send|provide|verify) (your )?(OTP code|OTP|password|PIN|CVV|card number|Aadhaar|PAN|bank (details|account)|UPI PIN|credentials|verification code)\b/i,
    explanation:
      "The message asks for sensitive information like OTPs, passwords, or banking details. No legitimate organisation ever asks for these over a call or message.",
    weight: 20,
  },
  {
    id: "suspended-account",
    category: "Account / Service Threat",
    pattern: /(your )?(account|SIM|card|number|ATM) (is|has been|will be) (suspended|blocked|deactivated|expired|about to expire|disconnected)/i,
    explanation:
      "Your account, SIM, or card is supposedly suspended or expiring. This pretext is used to panic you into clicking a link or sharing details.",
    weight: 13,
  },
  {
    id: "kyc-lure",
    category: "Account / Service Threat",
    pattern: /\bKYC\b (is )?(expired|pending|update|verification)|update (your )?KYC|complete (your )?KYC|eKYC/i,
    explanation:
      "KYC expiry is a frequent phishing lure. Banks and RBI never ask you to complete KYC through a link sent over SMS or WhatsApp.",
    weight: 12,
  },
  {
    id: "prize-lure",
    category: "Reward / Lottery",
    pattern: /(won|winner|congratulations|prize|lottery|lucky draw|gift|reward).{0,40}(rupees|₹|Rs\.?|lakh|crore|dollars|\$)/i,
    explanation:
      "You are told you won a prize or money. If you did not enter a contest, this is almost certainly a scam designed to collect 'processing fees' or your details.",
    weight: 16,
  },
  {
    id: "advance-fee",
    category: "Financial Demand",
    pattern: /processing fee|registration fee|clearing fee|customs (fee|charge|duty)|tax (payment|fee)|release fee|verification fee/i,
    explanation:
      "The message demands an upfront fee — 'processing', 'registration', 'clearing', or 'customs' — before you can receive a refund, prize, or parcel. This is the advance-fee fraud pattern: the fee is the real target, the promised reward does not exist.",
    weight: 15,
  },
  {
    id: "investment-lure",
    category: "Reward / Lottery",
    pattern: /guaranteed return|double your (money|investment)|risk[- ]free|sure[- ]shot|trading tips|invest (and )?(earn|get) \d+|high returns? (in|within) \d+ days/i,
    explanation:
      "Unrealistic investment returns are promised. Guaranteed or risk-free high returns do not exist — this is a common investment-fraud pattern.",
    weight: 14,
  },
  {
    id: "video-call-pressure",
    category: "Impersonation / Threat",
    pattern: /video call|video verification|video KYC|Skype|Zoom (call|meeting)|face (verification|scan)/i,
    explanation:
      "You are pressured into a video call for 'verification'. In the digital-arrest scam, fraudsters use video calls to appear legitimate and keep you isolated.",
    weight: 12,
  },
  {
    id: "drug-accusation",
    category: "Threat / Intimidation",
    pattern: /drug (parcel|shipment|racket|trafficking|cartel)|narcotics|contraband|illicit|smuggling|money laundering|black money/i,
    explanation:
      "The message accuses you of involvement in serious crimes like drug trafficking or money laundering. This is designed to terrify you into compliance.",
    weight: 16,
  },
];

/**
 * Messages that strongly indicate a legitimate context, used to
 * reduce false positives on benign messages.
 */
const LEGITIMACY_INDICATORS: RegExp[] = [
  /\b(OTP|verification code|one time password)\b.+\b(is|for your|for your transaction)\b/i,
  /\b(order (confirmed|delivered|shipped)|delivery (scheduled|today))\b/i,
  /\b(reminder|appointment|class|meeting|lecture|assignment|exam)\b/i,
  /\b(happy birthday|congratulations on|well done|good luck)\b/i,
  /\b(see you (at|tomorrow|on)|let'?s (meet|catch up)|coffee\??|lunch\??)\b/i,
];

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clampScore(raw: number): number {
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/** Ensure a regex has the global flag so matchAll() works */
function withGlobalFlag(re: RegExp): RegExp {
  return re.flags.includes("g") ? re : new RegExp(re.source, re.flags + "g");
}

function buildSummary(level: RiskLevel, signalCount: number): string {
  if (signalCount === 0) {
    return "No known scam patterns were detected in this message. However, the absence of detected signals does not guarantee the message is safe — always apply critical judgement.";
  }
  if (level === "high") {
    return `This message shows ${signalCount} warning sign${signalCount > 1 ? "s" : ""} strongly associated with fraud. Treat it with high caution and do not take any action it requests.`;
  }
  if (level === "medium") {
    return `This message shows ${signalCount} warning sign${signalCount > 1 ? "s" : ""}. Verify the sender independently before acting on anything it says.`;
  }
  return `This message shows ${signalCount} minor warning sign${signalCount > 1 ? "s" : ""}. Stay cautious but no major red flag was detected.`;
}

function buildSafetyAdvice(signals: ScamSignal[]): string[] {
  const advice: string[] = [
    "Never transfer money or share banking details under pressure or fear.",
    "Independently verify the caller's identity by calling the official helpline — never the number the caller gave you.",
  ];

  const categories = new Set(signals.map((s) => s.category));
  if (categories.has("Financial Demand")) {
    advice.push("Do not make any payment or click any link in the message.");
  }
  if (categories.has("Information Harvesting")) {
    advice.push("Never share OTPs, passwords, PINs, or CVV — no genuine organisation asks for these.");
  }
  if (categories.has("Urgency / Pressure")) {
    advice.push("Slow down. Scammers manufacture urgency — take time to think and talk to someone you trust.");
  }
  if (categories.has("Impersonation / Threat") || categories.has("Impersonation")) {
    advice.push("If threatened with arrest, disconnect and visit your nearest police station. Indian police do not arrest people over video calls.");
  }
  if (categories.has("Reward / Lottery")) {
    advice.push("If you did not enter a contest, you did not win. Do not pay any 'processing fee' or 'tax' to claim a prize.");
  }
  if (categories.has("Account / Service Threat")) {
    advice.push("Log in to your account directly through the official app or website — not through a link in a message.");
  }

  advice.push("Report suspicious messages to 1930 (National Cybercrime Helpline) or cybercrime.gov.in.");
  return advice;
}

/**
 * The core detection function. It scans the input text against a set of
 * explainable, transparent rules and returns a structured result.
 *
 * Each rule can match multiple times in the text — every unique matched
 * phrase produces a separate signal so the user sees exactly what was
 * flagged. However, each rule's weight is only added once to the score,
 * so duplicate matches do not inflate the risk score.
 *
 * This function is intentionally isolated from any AI API so that an
 * LLM-based engine can replace or augment it later without touching the UI.
 */
export function analyzeMessage(input: string): AnalysisResult {
  const text = input.trim();

  const signals: ScamSignal[] = [];
  let rawScore = 0;

  for (const rule of RULES) {
    const globalPattern = withGlobalFlag(rule.pattern);
    const matches = [...text.matchAll(globalPattern)];
    if (matches.length === 0) continue;

    // Add the rule's weight only once, regardless of how many times it matches
    rawScore += rule.weight;

    // Create one signal per unique matched phrase (case-insensitive dedup)
    const seen = new Set<string>();
    let dedupIndex = 0;
    for (const m of matches) {
      const lower = m[0].toLowerCase();
      if (seen.has(lower)) continue;
      seen.add(lower);

      signals.push({
        id: seen.size === 1 && matches.length === 1 ? rule.id : `${rule.id}#${dedupIndex}`,
        category: rule.category,
        matchedText: m[0],
        explanation: rule.explanation,
        weight: rule.weight,
      });
      dedupIndex++;
    }
  }

  // Detect legitimacy indicators — reduce score for messages that
  // clearly look like OTPs, delivery updates, or personal messages.
  const legitHits = LEGITIMACY_INDICATORS.filter((re) => re.test(text)).length;
  if (signals.length <= 1 && legitHits > 0) {
    rawScore = Math.max(0, rawScore - legitHits * 8);
  }

  // Short, benign personal messages with no signals
  if (signals.length === 0) {
    rawScore = 0;
  }

  const score = clampScore(rawScore);

  let riskLevel: RiskLevel;
  if (score >= 45) {
    riskLevel = "high";
  } else if (score >= 18) {
    riskLevel = "medium";
  } else {
    riskLevel = "low";
  }

  return {
    id: generateId(),
    riskLevel,
    score,
    signals,
    summary: buildSummary(riskLevel, signals.length),
    safetyAdvice: buildSafetyAdvice(signals),
    timestamp: Date.now(),
    inputText: text,
  };
}

/** Export the raw rule count and categories for the dashboard / about page. */
export function getEngineInfo() {
  return {
    ruleCount: RULES.length,
    categories: [...new Set(RULES.map((r) => r.category))],
    rules: RULES.map((r) => ({
      id: r.id,
      category: r.category,
      explanation: r.explanation,
      weight: r.weight,
    })),
  };
}
