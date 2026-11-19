# 📘 Member 2 Study Guide: Trust, Submission & Verification

## 🎯 Your Assigned Features
1. **C4 – Price Submission with Evidence & Duplicate Prevention:** Users submit price observations with store details and date; a 24-hour guard blocks spam.
2. **C5 – Community Verification & Dynamic Trust Scoring:** Community peers verify observations. Votes are weighted by the user's `trustWeight`. Once a submission reaches 3.0 points with 0 disputes, it becomes "Verified". If 2+ dispute, it becomes "Disputed".

---

## 📂 Your Code Files in this Folder
* `submission.controller.ts` — Receives `POST /submit-price`, checks for duplicates, and sets flash feedback.
* `submission.service.ts` — Enforces the 24-hour duplicate observation detection window.
* `submission.service.spec.ts` — Unit test proving duplicate submission detection.
* `trust.service.ts` — Formula for dynamic user trust adjustment and clamping.
* `trust.service.spec.ts` — Tests verifying trust points (+0.2 on approval, -0.3 on rejection).
* `verification.service.ts` — Calculates weighted score: confirms, disputes, and threshold logic.
* `verification.controller.ts` — Feeds pending observations and records votes.
* `rules.config.ts` — Central configuration declaring business constants.

---

## 🧠 Code Walkthrough: How Your Code Works

### 1. 24-Hour Duplicate Guard (`submission.service.ts`)
```typescript
detectDuplicate(productId: number, store: string, price: number, date: string): boolean {
  return submissions.some((sub) => {
    const isSameProduct = sub.productId === productId;
    const isSameStore = sub.store.toLowerCase().trim() === store.toLowerCase().trim();
    const isSamePrice = sub.price === price;
    return isSameProduct && isSameStore && isSamePrice;
  });
}
```
* **Explanation:** Checks if an identical price observation for the same product, store, and price already exists in the system to prevent spamming.

### 2. Trust Score Clamping Formula (`trust.service.ts`)
```typescript
// Formula: newTrust = clamp(previousTrust + (accepted ? 0.2 : -0.3), 0.2, 3.0)
updateTrust(currentTrust: number, accepted: boolean): number {
  const nextTrust = currentTrust + (accepted ? 0.2 : -0.3);
  return Math.min(Math.max(nextTrust, businessRules.minTrust), businessRules.maxTrust);
}
```
* **Explanation:**
  * Baseline trust for new users = **1.0**
  * When a user's submitted price is verified by community: **+0.2**
  * When a user submits fake/rejected data: **-0.3**
  * Clamped between **0.2** (minimum trust) and **3.0** (maximum trust).

### 3. Verification Threshold (`verification.service.ts`)
```typescript
const confirmScore = votes.filter((v) => v.decision === 'confirm').reduce((sum, v) => sum + v.trustWeight, 0);
const disputeCount = votes.filter((v) => v.decision === 'dispute').length;
const status = confirmScore >= 3.0 && disputeCount === 0 ? 'Verified' : disputeCount >= 2 ? 'Disputed' : 'Pending';
```
* **Explanation:** If a user with high trust (e.g. 1.5) votes confirm, their vote counts for 1.5 points. When total confirms $\ge 3.0$, it transitions from `Pending` to `Verified`.

---

## 🎓 Top 5 Viva Questions for Member 2

1. **"What did you build in this project?"**
   * *Answer:* "I built the price crowdsourcing pipeline: price submissions with anti-duplicate guard (C4) and the community verification engine with dynamic trust scoring (C5)."
2. **"How do you prevent malicious users from spamming fake prices?"**
   * *Answer:* "Two layers: 1) The 24-hour duplicate window prevents flooding. 2) Votes are weighted by trust score, so low-trust users cannot verify prices alone."
3. **"What is the mathematical formula for trust adjustment?"**
   * *Answer:* "`newTrust = clamp(previousTrust + (accepted ? 0.2 : -0.3), 0.2, 3.0)`. Accepted adds 0.2, rejected subtracts 0.3, with bounds of 0.2 to 3.0."
4. **"Where are the business threshold constants stored?"**
   * *Answer:* "In `rules.config.ts`. We centralized constants like `verificationThreshold = 3.0` and `duplicateWindowHours = 24` to follow clean coding standards."
5. **"What happens if two people dispute a price observation?"**
   * *Answer:* "If dispute count reaches 2, the submission status immediately changes to `Disputed` and is escalated to the moderator queue."
