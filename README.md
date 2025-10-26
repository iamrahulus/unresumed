# Unresumed — Prototype (Vite + React + TS)

A minimal, offline-friendly demo of the zero-resume hiring concept. It shows:
- Role input → retrieval + interpretable rerank
- Evidence cards per candidate
- Consent-aware controls
- Mock scheduling + CSV export
- Fairness snapshot

## Quick start

```bash
# 1) Extract the zip
cd unresumed-prototype

# 2) Install deps
npm install

# 3) Run
npm run dev
```

Then open http://localhost:5173

### Tech notes
- Local UI stubs live in `src/components/ui/*`, mimicking shadcn imports.
- Prototype is in `src/prototype/App.tsx` and mounted from `src/main.tsx`.
- No external network calls are made; all data is mocked.
