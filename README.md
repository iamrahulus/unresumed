Absolutely—here’s a clean, up-to-date **README.md** you can drop into the repo. It captures the exact fixes we walked through (WSL, aliases, Tailwind v4 vs v3, Vite quirks, and common runtime errors).

---

````markdown
# Unresumed — Prototype

Minimal UI to demonstrate core flows for a resume-free hiring platform:

**discovery → ranked shortlist → evidence → schedule → export**,  
with explainability, consent controls, and employer weight tuning.

---

## Table of Contents
- [Stack](#stack)
- [Quick Start (WSL on Windows 11)](#quick-start-wsl-on-windows-11)
- [Install & Run](#install--run)
- [Tailwind CSS (v4 default)](#tailwind-css-v4-default)
- [Project Structure](#project-structure)
- [Auth Demo (Employer vs Candidate)](#auth-demo-employer-vs-candidate)
- [Features in this Prototype](#features-in-this-prototype)
- [Troubleshooting](#troubleshooting)
- [Common Errors & Fixes](#common-errors--fixes)
- [Scripts](#scripts)
- [Roadmap Notes](#roadmap-notes)
- [License](#license)

---

## Stack
- **Vite + React + TypeScript**
- **Tailwind CSS v4** (can use v3—see below)
- Lightweight UI components in `src/components/ui/*` (Tailwind-styled)
- No backend required for the prototype

---

## Quick Start (WSL on Windows 11)

1) **Install WSL + Ubuntu (one-time)**
```powershell
wsl --install -d Ubuntu
````

Reboot if prompted. Open **Ubuntu** and run:

```bash
sudo apt update && sudo apt upgrade -y
```

2. **Install Node via nvm**

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts
```

3. **Clone**

```bash
git clone https://github.com/iamrahulus/unresumed.git
cd unresumed
```

---

## Install & Run

```bash
# install deps
npm i

# start dev server (WSL-friendly)
npm run dev -- --host=0.0.0.0
# open http://localhost:5173
```

> If you see a blank/black browser page at first launch, open DevTools → Console.
> See **Common Errors & Fixes** below for the quick one-liners.

---

## Tailwind CSS (v4 default)

We use Tailwind **v4**. If you prefer **v3**, see the alternate setup below.

### Already set up (v4)

* **postcss.config.js**

  ```js
  export default {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  }
  ```
* **src/index.css**

  ```css
  @import "tailwindcss";

  html, body, #root { height: 100%; }
  body { background-color: rgb(248 250 252); color: rgb(15 23 42); }
  ```
* **src/main.tsx**

  ```ts
  import './index.css';
  ```

### Optional: Tailwind v3 (if you prefer)

```bash
npm i -D tailwindcss@3 postcss autoprefixer
```

`postcss.config.js`:

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
```

`src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body { @apply bg-slate-50 text-slate-900; }
```

---

## Project Structure

```
src/
  App.tsx                # main prototype app (employer + candidate)
  main.tsx               # React entry, imports index.css
  index.css              # Tailwind styles
  components/
    ui/
      badge.tsx
      button.tsx
      card.tsx
      checkbox.tsx
      input.tsx
      label.tsx
      separator.tsx
      slider.tsx
      switch.tsx
      tabs.tsx
```

> We use **relative imports** like `./components/ui/card`.
> If you want `@/` aliases, add this to `vite.config.ts` and `tsconfig.json`:
>
> ```ts
> // vite.config.ts
> import { defineConfig } from 'vite'
> import react from '@vitejs/plugin-react'
> import { resolve } from 'path'
> export default defineConfig({
>   plugins: [react()],
>   resolve: { alias: { '@': resolve(__dirname, 'src') } },
> })
> ```
>
> ```json
> // tsconfig.json
> {
>   "compilerOptions": {
>     "baseUrl": ".",
>     "paths": { "@/*": ["src/*"] },
>     "jsx": "react-jsx",
>     "module": "ESNext",
>     "target": "ES2020"
>   },
>   "include": ["src"]
> }
> ```

---

## Auth Demo (Employer vs Candidate)

This prototype uses a **mock role gate**:

* **Header** shows: *Signed in as: employer/candidate*.
* Buttons: **“Sign in as Employer”** / **“Sign in as Candidate”** switch role locally.
* In production, replace with Cognito/SSO and route guards; the UI is already separated:

  * `role === 'employer'` → employer tabs
  * `role === 'candidate'` → candidate console

---

## Features in this Prototype

### Employer View

* **Discover**: paste JD → tokens → **Feature Weights** (sliders) → **Hard Filters** (claimed only, must-have skills)
* **Shortlist**: ranked list with **evidence cards** and explainability
* **Fairness**: visible count snapshot, simulated feature attributions, guardrails
* **Settings**: integration stubs (connectors, stores, ATS/calendar)
* **Export**: **CSV** button for shortlist

### Candidate View

* **My Profile**: name, location, availability, links
* **Consent Center**: public profile, repo metadata, package stats
* **My Artifacts**: add/edit artifacts, toggle visibility
* **Preview**: how employers see your evidence cards

---

## Troubleshooting

### Vite loads but UI is plain HTML (unstyled)

* Ensure Tailwind is wired:

  * `src/index.css` exists and contains Tailwind directives (v4 `@import "tailwindcss"`)
  * `import './index.css'` is at the top of `src/main.tsx`
  * Restart dev server after changes

### “Module not found: ../components/ui/card”

* Use **`./components/ui/card`** from files in `src/`.
* Verify files exist under `src/components/ui/`.

### “If you see this text…” never disappears

* In `index.html` the script must be:

  ```html
  <script type="module" src="src/main.tsx"></script>
  ```

### “Toaster is not defined” (if you add sonner)

* Add `import { Toaster, toast } from 'sonner'` and render `<Toaster />` once near the root.

---

## Common Errors & Fixes

**1) `SyntaxError: Expecting Unicode escape sequence \uXXXX`**
Cause: escaped quotes inside JSX like `className=\"w-full\"`.
Fix: use normal quotes:

```jsx
<Tabs defaultValue="discover" className="w-full">
```

**2) `SyntaxError: JSX value should be either an expression or a quoted JSX text`**
Cause: raw placeholders (e.g., `[DISCOVER_CONTENT]`) inside JSX.
Fix: remove placeholders; use real JSX or `{/* comments */}`.

**3) Vite import-analysis: “Failed to resolve import …”**
Cause: wrong path or missing file.
Fix: use `./components/ui/...` (or add the `@` alias). Create missing files as shown above.

**4) `npx tailwindcss init -p` fails (“could not determine executable”)**
Workarounds:

```bash
npx --yes tailwindcss@latest init -p
# or
npx --package=tailwindcss tailwindcss init -p
# or directly:
node node_modules/tailwindcss/lib/cli.js init -p
```

**5) PostCSS plugin moved error (Tailwind v4)**
Error:

```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin...
```

Fix:

```bash
npm i -D @tailwindcss/postcss
```

`postcss.config.js`:

```js
export default { plugins: { '@tailwindcss/postcss': {} } }
```

---

## Scripts

```bash
npm run dev        # start Vite dev server
npm run build      # production build
npm run preview    # preview dist
```

---

## Roadmap Notes

* Swap mock role switch with real auth (Cognito, OIDC) + `/employer` & `/candidate` routes.
* Wire real connectors (GitHub, npm/PyPI), persistence, and scheduling (Google/Microsoft).
* Add ATS export (Greenhouse webhook/CSV) and proper audit logs.
* Introduce basic tests (unit + e2e) and CI on PR.

---

## License

Proprietary — © Unresumed. All rights reserved.

```

---

::contentReference[oaicite:0]{index=0}
```

