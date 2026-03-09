# PPS Profit-Share Projection Calculator — Design Document

## Overview

Rebuild the PPS Profit-Share Projection Calculator as a modern React SPA for pitch/demo purposes. The app is a standalone tool that lets users input their age and premium details, then displays projected profit-share allocations via animated charts and summary tiles.

## Decisions

- **Standalone SPA** for pitch — not embedded, no PPS nav/footer
- **Mock API** — hardcoded realistic data, no dependency on PPS infrastructure
- **Standard member flow only** — no adviser URL params (`?member=`, `?subs=`)
- **Three screens** — form → results (headline + bar chart) → more details (pie + tiles)
- **No contact/lead capture form** — skip HubSpot integration entirely

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Build | Vite | Fast, static output for Azure SWA |
| UI | React 18 + TypeScript | Modern, type-safe |
| Routing | React Router v6 | 3 simple routes |
| Components | ShadCN/ui | Polished, accessible, customizable |
| Styling | Tailwind CSS | Utility-first, matches ShadCN |
| Charts | Recharts | React-native, easy brand color customization |
| Animations | canvas-confetti | Lightweight confetti on result reveal |
| Count-up | react-countup | Animated number display |

## Deployment

- **Repo:** `Alt-Studios/pps-poc` on GitHub
- **Hosting:** Azure Static Web Apps
- **CI/CD:** GitHub Actions (Azure SWA auto-generates the workflow)
- **Build output:** `dist/` folder from `vite build`

## Routes

| Route | Component | Purpose |
|---|---|---|
| `/` | `HomePage` | Input form |
| `/results` | `ResultsPage` | Headline + stacked bar chart |
| `/more-details` | `MoreDetailsPage` | Pie chart + allocation tiles |

## Brand Design Tokens

```
--navy:       #091e35   (primary bg, headers)
--gold:       #b09455   (accents, CTAs, life allocation)
--teal:       #69c5d1   (chart series 2, cross-holdings booster)
--sage:       #82967f   (car & home allocation)
--burgundy:   #a8605f   (medical aid allocation)
--purple:     #604760   (investment allocation)
--cream:      #faf9f5   (page background)
--dark-text:  #151515   (body copy)
--white:      #ffffff   (cards, inputs)
```

**Font:** Inter (open-source geometric sans-serif, similar to Gotham). Uppercase headings with letter-spacing to match PPS style.

## Data Flow

1. User fills form on `/`
2. On submit, `CalculatorContext` calls `calculateProfitShare(inputs)`
3. Mock API returns `{ additionalProfitShare, projections[] }`
4. Navigate to `/results`
5. Results page reads from context, displays headline + bar chart
6. "More Details" navigates to `/more-details`
7. More Details reads age-65 projection from context, displays pie + tiles
8. "Recalculate" returns to `/`

## Input Fields

| Field | Type | Validation | Required |
|---|---|---|---|
| Age | integer | 19-64 inclusive | Yes |
| PPS Life Insurance Premium (overall) | currency (Rands) | > 0 | Yes |
| Car & Home Premium | currency (Rands) | >= 0 | No |
| Medical Aid Premium | currency (Rands) | >= 0 | No |
| Monthly Investment Contribution | currency (Rands) | >= 0 | No |
| Lump Sum Investment (once-off) | currency (Rands) | >= 0 | No |

### Specify Modal

Optional breakdown of life premium into 4 sub-components:
- Life Cover Premium
- Disability Premium
- Critical Illness Premium
- Income Protection Premium

Validation: at least one > 0. On close, overall premium = sum of four.

### Pre-processing (before API call)

If user did NOT use Specify modal (all sub-premiums null):
- `lifePremium` = overall / 2
- `incomeProtectionPremium` = overall / 2
- `disabilityPremium` = 0
- `criticalIllnessPremium` = 0

## Mock API Response Contract

```typescript
interface Projection {
  anb: number;           // age next birthday
  life: number;          // cumulative life allocation
  sti: number;           // cumulative short-term insurance
  profmed: number;       // cumulative medical aid
  investment: number;    // cumulative investment
  chb: number;           // cross-holdings booster
  chbEffect: number;     // additional impact of CHB + non-life products
}

interface CalculateResponse {
  additionalProfitShare: number;  // total at age 65
  projections: Projection[];     // one per year, age+1 to 65
}
```

`additionalProfitShare` = `life + sti + profmed + investment + chb` at age 65.

## Results Display

### Headline (Results page)
- "**+ R{additionalProfitShare} Profit-Share by your 65th birthday!**"
- Fallback: if `additionalProfitShare <= 0`, show `life` at age 65
- Animated count-up (react-countup), 2 second duration
- Confetti on animation complete (gold + teal particles)

### Stacked Bar Chart (Results page)
- Recharts `BarChart`, stacked
- X-axis: `anb` values, label "AGE"
- Y-axis: Rands, label "RANDS" (abbreviated K/M)
- Series 1 (Gold #b09455): `life` — "Life Product Only"
- Series 2 (Teal #69c5d1): `chbEffect` — "Cross-Holdings Booster"

### Pie Chart (More Details page)
- Recharts `PieChart` using age-65 data
- Segments (only if value > 0):
  - Life (#b09455 Gold)
  - Car & Home (#82967f Sage)
  - Medical Aid (#a8605f Burgundy)
  - Investment (#604760 Purple)
  - Cross-Holdings Booster (#69c5d1 Teal)

### Allocation Tiles (More Details page)
- 6 ShadCN Cards: Life, Car & Home, Medical Aid, Investment, Booster, Total
- Values formatted with SummarisedNumber: R2.3M, R161.4K, etc.
- Tiles with value <= 0 visually dimmed (opacity)

## Number Formatting (SummarisedNumber)

```
>= 1,000,000,000 → /1B + "B"
>= 1,000,000     → /1M + "M"
>= 1,000         → /1K + "K"
< 1,000          → raw
```

1 decimal place, uppercase suffix. Prefix with "R".

## Project Structure

```
pps-calculator/
  src/
    components/
      ui/                    # ShadCN components
      calculator-form.tsx
      specify-modal.tsx
      results-chart.tsx
      pie-chart.tsx
      allocation-tiles.tsx
      confetti.tsx
    context/
      calculator-context.tsx
    lib/
      mock-api.ts
      format-number.ts
    pages/
      home.tsx
      results.tsx
      more-details.tsx
    App.tsx
    main.tsx
  public/
    pps-logo.svg
  docs/
    plans/
  .github/
    workflows/
      azure-static-web-apps.yml
  index.html
  tailwind.config.ts
  vite.config.ts
  tsconfig.json
  package.json
```
