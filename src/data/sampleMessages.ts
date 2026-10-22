export interface SampleMessage {
  id: string;
  label: string;
  description: string;
  text: string;
  expectedRisk: "high" | "medium" | "low";
}

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: "scam-digital-arrest",
    label: "Digital Arrest Scam",
    description: "Classic impersonation scam via video call",
    expectedRisk: "high",
    text:
      "This is CBI Cyber Crime Unit. A parcel booked in your name containing drugs and 3 passports has been intercepted at the airport. There is a non-bailable warrant in your name. You are under digital arrest. Join a video call immediately on Skype for verification. Do not disconnect the call and do not tell anyone. Transfer Rs 50,000 as a legal processing fee to avoid immediate arrest. https://cbi-verify.in/secure",
  },
  {
    id: "scam-fedex-package",
    label: "Courier / Package Scam",
    description: "Fake FedEx parcel with narcotics accusation",
    expectedRisk: "high",
    text:
      "Dear customer, your FedEx package containing prohibited items has been intercepted by Customs. A legal notice has been issued. To avoid criminal case, verify your identity immediately. Click the link before it expires: bit.ly/fedex-verify-customs",
  },
  {
    id: "scam-kyc-expiry",
    label: "KYC Expiry Phishing",
    description: "Fake bank KYC expiry with link",
    expectedRisk: "high",
    text:
      "ALERT: Your bank account KYC has expired. Your account will be blocked today. Update your KYC immediately to avoid suspension. Click here: http://bank-secure-update.com/kyc",
  },
  {
    id: "scam-lottery",
    label: "Lottery / Prize Scam",
    description: "Fake prize win demanding processing fee",
    expectedRisk: "high",
    text:
      "Congratulations! You have won Rs 25,00,000 in the KBC Lucky Draw 2026. To claim your prize, pay a processing fee of Rs 4,999 via UPI to claimdesk@upi. Send the payment immediately and share your OTP to verify your account.",
  },
  {
    id: "scam-sim-suspend",
    label: "SIM Suspension Threat",
    description: "Fake TRAI SIM deactivation message",
    expectedRisk: "medium",
    text:
      "TRAI: Your mobile number documents are incomplete. Your SIM will be disconnected within 24 hours. Please verify your Aadhaar details by calling 98765XXXXX immediately to continue services.",
  },
  {
    id: "scam-investment",
    label: "Investment Tip Scam",
    description: "Unrealistic guaranteed returns",
    expectedRisk: "medium",
    text:
      "Join our premium trading group! Guaranteed returns of 300% in 7 days. Risk-free investment tips from expert traders. Limited spots available, act now! Send payment via GPay to reserve your slot.",
  },
  {
    id: "legit-otp",
    label: "Legitimate OTP",
    description: "Genuine bank OTP message",
    expectedRisk: "low",
    text:
      "123456 is your OTP for your transaction of Rs 2,500 at Flipkart. Do not share this OTP with anyone. Valid for 10 minutes.",
  },
  {
    id: "legit-delivery",
    label: "Legitimate Delivery Update",
    description: "Real package delivery notification",
    expectedRisk: "low",
    text:
      "Your Amazon order #112-4567890 has been shipped and will be delivered tomorrow. Track your package in the Amazon app.",
  },
  {
    id: "legit-personal",
    label: "Legitimate Personal Message",
    description: "Normal WhatsApp message from a friend",
    expectedRisk: "low",
    text:
      "Hey, are we still meeting for lunch tomorrow at the new cafe near campus? Let me know if 1 PM works for you.",
  },
  {
    id: "ambiguous-bank-call",
    label: "Ambiguous Bank Call",
    description: "Could be legitimate fraud alert or scam",
    expectedRisk: "medium",
    text:
      "Dear customer, there was an unusual transaction of Rs 15,000 on your card. If this was not you, please call our helpline immediately. Do not share your card number or PIN with anyone.",
  },
];
