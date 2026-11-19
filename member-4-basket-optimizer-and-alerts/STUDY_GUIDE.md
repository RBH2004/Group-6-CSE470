# 📘 Member 4 Study Guide: Basket Optimizer & User Alerts

## 🎯 Your Assigned Features
1. **C9 – Smart Multi-Store Basket Optimizer:** Solves the cart combination problem. Compares buying all items from a single store versus splitting items across multiple stores with separate delivery fees, calculating net BDT savings.
2. **C6 – Watchlist & Price-Drop Alerts:** Allows users to set target price thresholds; monitors observations and transitions alerts from `Armed` to `Triggered`.
3. **C7 & C8 – Customer Concerns & Reviews:** Manages customer dispute threads with brands and calculates value-for-money star rating distributions.

---

## 📂 Your Code Files in this Folder
* `basket.controller.ts` — HTTP endpoint for basket calculations.
* `basket.service.ts` — Core optimization algorithm (Single-Store vs Split-Store plan).
* `basket.service.spec.ts` — Vitest unit test verifying basket savings calculations.
* `watchlist.controller.ts` — Controller for creating, viewing, and deleting price alerts.
* `watchlist.service.ts` — Service evaluating target price triggers.
* `watchlist.service.spec.ts` — Unit test proving alert triggers.
* `concern.controller.ts` & `review.controller.ts` — Customer advocacy and review moderation.

---

## 🧠 Code Walkthrough: How Your Code Works

### 1. Smart Basket Optimizer Algorithm (`basket.service.ts`)
```typescript
optimize(items: BasketItem[]) {
  const singleStorePlan = this.findSingleStorePlan(items);
  const splitAcrossStoresPlan = this.findSplitPlan(items);

  return {
    singleStorePlan,
    splitAcrossStoresPlan,
    savings: Math.max(0, (singleStorePlan.total ?? 0) - (splitAcrossStoresPlan.total ?? 0)),
  };
}
```
* **Single-Store Plan Logic:** Evaluates each store that stocks ALL items in the basket, summing $(\text{item price} \times \text{qty} + \text{delivery fee})$.
* **Split-Store Plan Logic:** Picks the cheapest individual verified offer for each item.
* **Savings Output:** Shows the user whether splitting their order across multiple stores saves money even after paying multiple delivery fees.

### 2. Price Alert Trigger Logic (`watchlist.service.ts`)
```typescript
evaluateAlert(targetPrice: number, currentPrice: number): { triggered: boolean; message: string } {
  if (currentPrice <= targetPrice) {
    return { triggered: true, message: `Alert triggered! Current price ৳${currentPrice} is at or below target ৳${targetPrice}.` };
  }
  return { triggered: false, message: `Alert armed. Current price ৳${currentPrice} is above target ৳${targetPrice}.` };
}
```
* **Explanation:** Checks if market price drops below the user's saved threshold. If yes, status transitions to `Triggered`.

---

## 🎓 Top 5 Viva Questions for Member 4

1. **"What did you build in this project?"**
   * *Answer:* "I built the Smart Basket Optimizer (C9) to find the cheapest shopping plan, the Watchlist Price-Drop Alert system (C6), and customer dispute handling (C7/C8)."
2. **"How does the Basket Optimizer decide between a single store and multiple stores?"**
   * *Answer:* "It compares two plans: Plan A calculates total cost at the cheapest single store stocking everything. Plan B buys each item from its cheapest individual seller plus delivery fees. Savings is $\max(0, \text{Plan A} - \text{Plan B})$."
3. **"Why does delivery fee matter in the basket optimizer?"**
   * *Answer:* "Because buying item 1 from Daraz and item 2 from Chaldal might save ৳200 on product prices, but extra delivery fees might cost ৳240, making split purchasing more expensive. The algorithm guarantees you only split if net savings is positive."
4. **"How do price alerts work?"**
   * *Answer:* "Users set a target price in `WatchlistService`. If the observed price $\le$ target price, the alert status switches from `Armed` to `Triggered`."
5. **"How do you test your basket optimizer?"**
   * *Answer:* "With automated Vitest unit tests in `basket.service.spec.ts`. It runs test fixtures with multi-store pricing to verify that the savings math is correct."
