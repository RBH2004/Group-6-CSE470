export const businessRules = {
  verificationThreshold: 3.0,
  staleDays: { online: 14, inStore: 30 },
  duplicateWindowHours: 24,
  inflationWindowDays: 30,
  escalationDays: 5,
  alertCheckMinutes: 15,
  maxPercentDeltaForFlag: 0.6,
  minTrust: 0.2,
  maxTrust: 3.0,
  baselineTrust: 1.0,
} as const;
