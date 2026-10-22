/**
 * ScamShield AI — Detection Engine Regression Tests
 *
 * Run with:  npx tsx src/engine/detectionEngine.test.ts
 *
 * These tests verify the transparent rule-based detection engine.
 * No AI/ML model is involved — the engine uses explainable regex rules.
 */

import { analyzeMessage } from "./detectionEngine";

type RiskLevel = "low" | "medium" | "high";

interface TestCase {
  name: string;
  input: string;
  /** Minimum expected risk level ("low" <= "medium" <= "high") */
  minRisk: RiskLevel;
  /** Category substrings that must each appear in at least one signal */
  mustContainCategories?: string[];
  /** Exact phrases that must appear as a matchedText in at least one signal */
  mustContainPhrases?: string[];
  /** Phrases that must NOT appear as a matchedText in any signal */
  mustNotContainPhrases?: string[];
  /** If true, no signal may match inside these substrings of the input */
  mustNotMatchSubstrings?: string[];
}

const levelOrder: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2 };

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function runTest(tc: TestCase): { passed: boolean; failures: string[] } {
  const failures: string[] = [];
  const result = analyzeMessage(tc.input);

  // Risk level check
  if (levelOrder[result.riskLevel] < levelOrder[tc.minRisk]) {
    failures.push(
      `Expected risk >= "${tc.minRisk}" but got "${result.riskLevel}" (score ${result.score})`,
    );
  }

  // Required categories
  if (tc.mustContainCategories) {
    for (const cat of tc.mustContainCategories) {
      const found = result.signals.some((s) =>
        s.category.toLowerCase().includes(cat.toLowerCase()),
      );
      if (!found) {
        failures.push(`Expected a signal in category containing "${cat}" but none found. ` +
          `Categories present: [${result.signals.map((s) => s.category).join(", ")}]`);
      }
    }
  }

  // Required matched phrases (case-insensitive)
  if (tc.mustContainPhrases) {
    for (const phrase of tc.mustContainPhrases) {
      const found = result.signals.some((s) =>
        s.matchedText.toLowerCase().includes(phrase.toLowerCase()),
      );
      if (!found) {
        failures.push(`Expected a signal matching "${phrase}" but none found. ` +
          `Matched phrases: [${result.signals.map((s) => `"${s.matchedText}"`).join(", ")}]`);
      }
    }
  }

  // Forbidden matched phrases
  if (tc.mustNotContainPhrases) {
    for (const phrase of tc.mustNotContainPhrases) {
      const found = result.signals.some((s) =>
        s.matchedText.toLowerCase() === phrase.toLowerCase(),
      );
      if (found) {
        failures.push(`Did NOT expect a signal matching "${phrase}" but one was found.`);
      }
    }
  }

  // Forbidden substring matches (e.g. "fir" should not match inside "confirm")
  if (tc.mustNotMatchSubstrings) {
    for (const sub of tc.mustNotMatchSubstrings) {
      const lowerInput = tc.input.toLowerCase();
      const subLower = sub.toLowerCase();
      const subIdx = lowerInput.indexOf(subLower);
      if (subIdx >= 0) {
        // Check if any signal's matchedText falls entirely within that substring
        for (const sig of result.signals) {
          const matchLower = sig.matchedText.toLowerCase();
          const matchIdx = lowerInput.indexOf(matchLower);
          if (matchIdx >= 0 && matchIdx >= subIdx && matchIdx + matchLower.length <= subIdx + subLower.length) {
            failures.push(
              `Signal "${sig.matchedText}" (rule: ${sig.id}) matched inside the word "${sub}" — false positive.`,
            );
          }
        }
      }
    }
  }

  // Score bounds
  if (result.score < 0 || result.score > 100) {
    failures.push(`Score ${result.score} is out of bounds [0, 100]`);
  }

  return { passed: failures.length === 0, failures };
}

const TEST_CASES: TestCase[] = [
  // --- 1. "confirm your identity" should NOT trigger FIR false positive ---
  {
    name: '"confirm your identity" does not trigger FIR false positive',
    input: "Please confirm your identity at the bank branch.",
    minRisk: "low",
    mustNotMatchSubstrings: ["confirm"],
    mustNotContainPhrases: ["FIR"],
  },

  // --- 2. "an FIR has been registered" SHOULD trigger threat-legal-action ---
  {
    name: '"an FIR has been registered" triggers FIR detection',
    input: "An FIR has been registered against you at the Cyber Crime police station.",
    minRisk: "medium",
    mustContainPhrases: ["FIR"],
    mustContainCategories: ["Threat"],
  },

  // --- 3. "share your OTP" triggers information harvesting ---
  {
    name: '"share your OTP" triggers OTP harvesting detection',
    input: "Please share your OTP to verify your identity and process the refund.",
    minRisk: "medium",
    mustContainCategories: ["Information Harvesting"],
    mustContainPhrases: ["OTP"],
  },

  // --- 4. "pay a processing fee immediately" triggers financial demand + urgency ---
  {
    name: '"pay a processing fee immediately" triggers financial demand and urgency',
    input: "You must pay a processing fee immediately to avoid account suspension.",
    minRisk: "medium",
    mustContainCategories: ["Financial Demand", "Urgency"],
  },

  // --- 5. Legitimate banking OTP message should be Low risk ---
  {
    name: "Legitimate bank OTP is Low risk",
    input:
      "123456 is your OTP for your transaction of Rs 2,500 at Flipkart. Do not share this OTP with anyone. Valid for 10 minutes.",
    minRisk: "low",
    mustNotContainPhrases: ["OTP"],
  },

  // --- 6. Legitimate delivery update should be Low risk ---
  {
    name: "Legitimate delivery update is Low risk",
    input:
      "Your Amazon order #112-4567890 has been shipped and will be delivered tomorrow. Track your package in the Amazon app.",
    minRisk: "low",
  },

  // --- 7. Legitimate personal message should be Low risk ---
  {
    name: "Legitimate personal message is Low risk",
    input:
      "Hey, are we still meeting for lunch tomorrow at the new cafe near campus? Let me know if 1 PM works for you.",
    minRisk: "low",
  },

  // --- 8. Full digital-arrest scam triggers all 6 categories ---
  {
    name: "Digital arrest scam triggers all 6 required categories",
    input:
      "This is Cyber Crime Branch. A non-bailable warrant has been issued and an FIR has been registered against you. " +
      "You will be arrested within 2 hours if you do not comply. Transfer Rs 18,500 immediately as a processing fee. " +
      "Do not tell anyone about this and do not disconnect the call. Share your OTP 8432 to verify your identity.",
    minRisk: "high",
    mustContainCategories: [
      "Threat",
      "Impersonation",
      "Urgency",
      "Financial Demand",
      "Information Harvesting",
    ],
  },

  // --- 9. Duplicate "immediately" does not inflate score ---
  {
    name: "Duplicate urgency words do not inflate score",
    input:
      "Call immediately. Respond immediately. Contact us immediately. Do not delay.",
    minRisk: "low",
    mustContainCategories: ["Urgency"],
  },

  // --- 10. "Courier" does not match inside "courier" in a legit sentence ---
  {
    name: '"Courier" word-boundary detection works',
    input: "Your courier delivery is scheduled for today between 10 AM and 6 PM.",
    minRisk: "low",
  },

  // --- 11. "drugs" does not match inside "drugs" in a medical context ---
  {
    name: '"drugs" word-boundary prevents pharmacy false positive',
    input: "Your prescription drugs are ready for pickup at the pharmacy counter.",
    minRisk: "low",
    mustNotMatchSubstrings: ["drugs"],
  },

  // --- 12. KYC scam triggers account/service threat ---
  {
    name: "KYC expiry phishing triggers account threat",
    input:
      "ALERT: Your bank account KYC has expired. Your account will be blocked today. Update your KYC immediately. Click here: http://bank-secure-update.com/kyc",
    minRisk: "high",
    mustContainCategories: ["Account / Service Threat", "Financial Demand", "Urgency"],
  },

  // --- 13. Prize/lottery scam triggers reward category ---
  {
    name: "Lottery scam triggers reward detection",
    input:
      "Congratulations! You have won Rs 25,00,000 in the KBC Lucky Draw 2026. Pay a processing fee of Rs 4,999 via UPI to claim your prize.",
    minRisk: "high",
    mustContainCategories: ["Reward", "Financial Demand"],
  },

  // --- 14. Score is clamped to 100 ---
  {
    name: "Score never exceeds 100 even with many signals",
    input:
      "Digital arrest. You will be arrested. Non-bailable warrant. FIR registered. CBI Cyber Crime. " +
      "Transfer Rs 50,000 immediately. Share your OTP. Do not tell anyone. Drugs parcel. " +
      "Video call on Skype. Pay the penalty now. Your SIM will be blocked. KYC expired. " +
      "Click here: bit.ly/verify. You won Rs 10 lakh. Guaranteed returns. Courier seized.",
    minRisk: "high",
  },

  // --- 15. Empty/whitespace input produces Low risk with no signals ---
  {
    name: "Empty input produces Low risk with zero signals",
    input: "   ",
    minRisk: "low",
  },
];

// --- Test runner ---
let passed = 0;
let failed = 0;
const failures: { name: string; details: string[] }[] = [];

for (const tc of TEST_CASES) {
  const res = runTest(tc);
  if (res.passed) {
    passed++;
    console.log(`  PASS  ${tc.name}`);
  } else {
    failed++;
    failures.push({ name: tc.name, details: res.failures });
    console.log(`  FAIL  ${tc.name}`);
    for (const f of res.failures) {
      console.log(`        → ${f}`);
    }
  }
}

console.log(`\n${"=".repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${TEST_CASES.length} total`);
console.log(`${"=".repeat(60)}`);

if (failed > 0) {
  process.exit(1);
}
