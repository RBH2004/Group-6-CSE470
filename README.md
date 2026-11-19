# BrandTruth

BrandTruth is a Bangladesh-focused price-transparency platform built for the CSE470 MVC course project. The app demonstrates a professional NestJS MVC setup with server-rendered Handlebars pages, Bootstrap 5 styling, and a compact but feature-complete customer experience for product discovery, verification, alerts, concerns, reviews, and basket optimization.

## Short plan

1. Build the shared foundation: shell layout, auth flow, pricing utilities, trust rules, and seed data.
2. Implement C1 search and comparison, then C3 fake discount detection and C8 reviews.
3. Add C2, C4, and C5 around the verification flow.
4. Complete C6 alerts, C7 concern handling, and the final C9 basket optimizer.
5. Validate each phase with focused tests and keep the code readable for a viva.

## Entity diagram

```text
User ──< PriceSubmission ──> PriceObservation
   │          │                          │
   │          ├──< VerificationVote       │
   │          └──< Flag                   │
   │
   ├──< Watchlist
   ├──< Concern ──< ConcernMessage
   ├──< Review
   └──< Basket ──< BasketItem

Product ──< Listing
       ├──< PriceObservation
       └──< Review

Store ──< Listing
Region ──< Store
Channel ──< Listing
Category ──< Product
```

## Tech stack

- **Frontend:** React 18 + Vite (SPA in `frontend/`) with live reactive dashboards, Chart/pricing visualizers, and instant hot-reloading.
- **Backend API:** NestJS (TypeScript) with Modular REST endpoints (`/api/*`), Dependency Injection, and Validation Pipes.
- **Database:** MySQL 8 + TypeORM configuration (with seamless SQLite fallback for local demo portability).
- **Python Intelligence Service:** Python 3 microservice (`python-service/app.py`) for live e-commerce scraping and statistical Z-score fake discount anomaly detection.
- **Testing:** Vitest for service and mathematical logic validation.

## Architecture Mapping

- **Client Layer:** `frontend/src/` (React + Vite)
- **API & Controller Layer:** `src/api/*.ts` and `src/**/**/*.controller.ts`
- **Domain & Model Layer:** `src/common/*.ts` and `src/**/entities/*.ts`
- **Data Intelligence Layer:** `python-service/app.py`
- **Database Layer:** TypeORM configured for MySQL (`brandtruth`)
- Service: `src/**/**/*.service.ts`

## Setup & Running the Services

### 1. Start the NestJS Backend (Port 3000)
```bash
npm run start:server
```
API Health: `http://localhost:3000/api/health`

### 2. Start the React + Vite Frontend (Port 5173)
```bash
npm run start:client
```
Frontend App: `http://localhost:5173`

### 3. Start the Python Scraper & ML Service (Port 5001)
```bash
npm run start:python
```
Python Health: `http://127.0.0.1:5001/health`

### 4. Build Frontend for Production / Embedded NestJS Serving
```bash
npm run build:client
```
When built, the React app is also served directly by NestJS at: `http://localhost:3000/app`

## Feature list

- C1: Unified product search and price comparison
- C2: Price history and buy-timing indicator
- C3: Fake Discount Checker
- C4: Price submission with evidence and duplicate prevention
- C5: Community price verification
- C6: Watchlist and price-drop alerts
- C7: Customer-brand concern resolution
- C8: Reviews and value-for-money ratings
- C9: Smart basket optimizer

## Testing

```bash
npm test
npm run test:e2e
```

## Demo commands

```bash
npm run start:dev
npm run migration:run
npm run seed
```

## Notes

- The app uses in-memory demo data so the course project can run without a live MySQL instance during demonstration.
- Central business thresholds live in `src/common/rules.config.ts` to keep the rules explicit and reviewable.
- The UI focuses on the BrandTruth experience requested in the course spec: clean fintech styling, card-based layout, and a premium dashboard feel.
