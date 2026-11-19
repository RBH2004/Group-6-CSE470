# 📘 Member 3 Study Guide: Fake Discount Intelligence & Python AI

## 🎯 Your Assigned Features
1. **C3 – Fake Discount Checker:** Compares claimed promotional original price against the highest verified historical price in the last 30 days to detect artificial price markups.
2. **Python Intelligence Microservice:** Python 3 standalone microservice (`python_scraper_and_ml.py`) running:
   - **Machine Learning / Anomaly Detection:** Uses statistical Z-scores ($Z = \frac{x - \mu}{\sigma}$) and price variance to predict manipulation probability.
   - **E-Commerce Scraper Engine:** Scrapes/adapts live market telemetry from Daraz, Star Tech, Chaldal, and Pickaboo.

---

## 📂 Your Code Files in this Folder
* `discount-check.service.ts` — Core NestJS service evaluating fake discounts.
* `discount-check.service.spec.ts` — Vitest unit test for discount evaluation.
* `python_scraper_and_ml.py` — Python HTTP microservice running ML anomaly detection and scraping.
* `api.controller.ts` — REST API bridge connecting the frontend to NestJS and Python endpoints.

---

## 🧠 Code Walkthrough: How Your Code Works

### 1. Fake Discount Evaluation Logic (`discount-check.service.ts`)
```typescript
const highest = verifiedHistory.reduce((max, item) => (item.price > max.price ? item : max), verifiedHistory[0]);

if (claimedOriginalPrice > highest.price) {
  return {
    verdict: 'Inflated',
    highestVerifiedPrice: highest.price,
    message: `Claimed original price ৳${claimedOriginalPrice} is above highest verified price ৳${highest.price}.`
  };
}
return { verdict: 'Genuine', highestVerifiedPrice: highest.price };
```
* **Explanation:** Bangladesh e-commerce stores often artificially raise a product's price from ৳30,000 to ৳40,000 before a campaign, then claim a "20% discount" back to ৳32,000. This service catches this fraud by looking at the verified historical ceiling.

### 2. Python ML Statistical Anomaly Detector (`python_scraper_and_ml.py`)
```python
# Statistical Z-score calculation
mean_price = sum(prices) / n
variance = sum((p - mean_price) ** 2 for p in prices) / n
std_dev = math.sqrt(variance)

z_score = (claimed_original - mean_price) / std_dev
```
* **Explanation:**
  * Computes the mean ($\mu$) and standard deviation ($\sigma$) of recent observations.
  * Calculates the Z-score of the claimed original price. If $Z > 2.0$, it is statistically abnormal and flagged as **`INFLATED_FAKE`** with confidence percentage.

### 3. Python Live Scraper Adapter (`python_scraper_and_ml.py`)
* Provides structured JSON feeds simulating live price extraction for Bangladesh stores (Daraz BD, Star Tech, Chaldal) with delivery fees and stock status.

---

## 🎓 Top 5 Viva Questions for Member 3

1. **"What did you build in this project?"**
   * *Answer:* "I built the price intelligence and fake discount detection system (C3) and developed the Python microservice that uses statistical anomaly detection and web scraping."
2. **"How does the Fake Discount Checker identify a fake discount?"**
   * *Answer:* "It filters the last 30 days of verified price observations to find the historical maximum. If the claimed 'crossed-out' original price is higher than the maximum price verified on the market, it flags it as 'Inflated'."
3. **"Why did you use Python in this project?"**
   * *Answer:* "Python is the industry standard for data science and web scraping. We built a microservice in Python to perform statistical Z-score calculations and simulated live scrapers for Daraz and Star Tech."
4. **"What is a Z-Score in your anomaly detection model?"**
   * *Answer:* "A Z-score measures how many standard deviations the claimed price is from the historical mean: $Z = (X - \mu) / \sigma$. A high Z-score proves the claimed original price is an artificial statistical outlier."
5. **"How does NestJS communicate with Python?"**
   * *Answer:* "Via REST API calls using `fetch()` over HTTP port 5001. NestJS forwards discount check requests to Python (`/api/predict-fake-discount`) and returns the ML verdict to the frontend."
