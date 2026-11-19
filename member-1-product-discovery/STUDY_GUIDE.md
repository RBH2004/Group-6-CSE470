# 📘 Member 1 Study Guide: Product Discovery & Price History

## 🎯 Your Assigned Features
1. **C1 – Unified Product Search & Price Comparison:** Search by keyword, filter by Category, Brand, Channel (Online Marketplace, Brand Official, Physical Retail), and Verified-only filter.
2. **C2 – Price History & Buy-Timing Indicator:** Tracks verified price trends, computes low/high/average prices, and classifies timing as "Good Buy", "Fair", or "High".
3. **Bonus Module – Price Normalization:** Standardizes mismatched units (e.g., 500g vs 1kg, 250ml vs 1L) and adds 5% VAT and delivery fees to calculate true per-unit cost.

---

## 📂 Your Code Files in this Folder
* `catalog.controller.ts` — Handles HTTP routing for search (`/search`), detail (`/products/:slug`), and homepage.
* `catalog.service.ts` — Implements in-memory filtering by keyword, brand, category, and verified status.
* `catalog.module.ts` — NestJS DI module bundling the catalog controller and service.
* `product.entity.ts` — TypeORM database schema for the Product entity.
* `price-normalization.service.ts` — Mathematical unit conversion & VAT/delivery pricing logic.
* `price-normalization.service.spec.ts` — Automated Vitest test suite proving unit conversion math.

---

## 🧠 Code Walkthrough: How Your Code Works

### 1. Unified Search Filtering (`catalog.service.ts`)
```typescript
getAllProducts(filter?: { category?: string; brand?: string; query?: string; verifiedOnly?: boolean; channel?: string }) {
  const query = (filter?.query ?? '').toLowerCase().trim();

  return productSeed.filter((product) => {
    const matchesQuery = !query || [product.name, product.brand, product.category].some((v) => v.toLowerCase().includes(query));
    const matchesCategory = !filter?.category || filter.category === 'all' || product.category === filter.category;
    const matchesBrand = !filter?.brand || filter.brand === 'all' || product.brand === filter.brand;
    const matchesChannel = !filter?.channel || filter.channel === 'all' || product.channel === filter.channel;
    const matchesVerified = !filter?.verifiedOnly || product.verified;

    return matchesQuery && matchesCategory && matchesBrand && matchesChannel && matchesVerified;
  });
}
```
* **Explanation:** Applies a multi-attribute filter over the dataset. If a filter is missing or set to `'all'`, it gracefully passes through.

### 2. Price Normalization Math (`price-normalization.service.ts`)
```typescript
const total = Number((input.price + (input.vat ? input.price * 0.05 : 0) + (input.deliveryFee ?? 0)).toFixed(2));
const baseUnits = this.parseUnitToBase(unit); // e.g. 1kg -> 1000g
const targetBaseUnits = this.parseUnitToBase(targetUnit);

const perUnit = total / (quantity * (baseUnits / targetBaseUnits));
```
* **Explanation:** Normalizes prices so a consumer can fairly compare a 500g pack costing ৳300 vs a 1kg pack costing ৳580. Also validates that invalid conversions (e.g. converting grams to liters) return `valid: false`.

---

## 🎓 Top 5 Viva Questions for Member 1

1. **"What did you build in this project?"**
   * *Answer:* "I built the product discovery and search engine (C1) and the historical price comparison system (C2). I also built the `PriceNormalizationService` to convert units (like grams to kg) and calculate net price including VAT and delivery."
2. **"How do you calculate whether a product is a 'Good Buy' or 'Fair'?"**
   * *Answer:* "We compare the current price with the verified price range (low and high) recorded over the last 30 days. If the current price is closer to the historic low, it's flagged as a 'Good Buy'."
3. **"Where is the database entity for products defined?"**
   * *Answer:* "In `product.entity.ts`, which maps to the TypeORM schema with relations to PriceObservation and Reviews."
4. **"How does your search handle case-insensitive queries?"**
   * *Answer:* "In `catalog.service.ts`, we lowercase the search query (`.toLowerCase().trim()`) and match it against the product's name, brand, and category."
5. **"How do you test your price normalization logic?"**
   * *Answer:* "We have Vitest unit tests in `price-normalization.service.spec.ts`. Running `npm test` executes the test suite to verify unit conversions."
