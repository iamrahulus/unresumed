# Unresumed Delivery – Local Prototype

This is a **self-contained React + Vite + TypeScript** prototype showcasing:
- Employer flow: job description, weighting controls, shortlist with **explainability**.
- Candidate flow: presence configuration and **ranking improvement** guidance.

No backend required; all data is mocked.

## Prereqs
- Node.js 18+ and npm.

## Run (local)
```bash
npm install
npm run dev
```
Then open the printed local URL (e.g., http://localhost:5173).

## Build (optional)
```bash
npm run build
npm run preview
```

## Notes
- Role-based views are toggled in the header (Employer View / Candidate View).
- Weight sliders update scores and explanations in real time.
- To customize data, edit `src/data/sample.ts`.
