# PPS Profit-Share Calculator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone React SPA that replicates the PPS Profit-Share Projection Calculator with mocked data, deployed to Azure Static Web Apps via GitHub Actions.

**Architecture:** Vite + React 18 + TypeScript SPA with 3 routes (form → results → more details). Form state managed via React Context. Mock API generates realistic projection data. Recharts for charts, ShadCN/ui for form components, Tailwind for styling.

**Tech Stack:** Vite, React 18, TypeScript, React Router v6, ShadCN/ui, Tailwind CSS v4, Recharts, canvas-confetti, react-countup

---

### Task 1: Project Scaffolding & GitHub Repo

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`
- Create: `.gitignore`, `.github/workflows/azure-static-web-apps.yml`

**Step 1: Create the GitHub repo**

```bash
cd /Users/nickbester/Documents/Sites.nosync/pps-calculator
gh repo create Alt-Studios/pps-poc --public --clone=false
```

**Step 2: Initialize the Vite + React + TypeScript project**

```bash
cd /Users/nickbester/Documents/Sites.nosync/pps-calculator
npm create vite@latest . -- --template react-ts
```

If prompted about non-empty directory, select "Ignore files and continue" or remove the `docs/` folder temporarily and restore after.

**Step 3: Install core dependencies**

```bash
npm install react-router-dom recharts react-countup canvas-confetti
npm install -D @types/canvas-confetti
```

**Step 4: Install Tailwind CSS v4**

Follow Vite + Tailwind v4 setup:

```bash
npm install tailwindcss @tailwindcss/vite
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

Replace contents of `src/index.css` with:

```css
@import "tailwindcss";
```

**Step 5: Initialize ShadCN/ui**

```bash
npx shadcn@latest init
```

Select these options:
- Style: Default
- Base color: Neutral
- CSS variables: Yes

Then install required components:

```bash
npx shadcn@latest add button input label card dialog
```

**Step 6: Configure brand design tokens**

Edit `src/index.css` to add PPS brand colors after the Tailwind import. Use CSS custom properties that integrate with Tailwind's `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-navy: #091e35;
  --color-gold: #b09455;
  --color-teal: #69c5d1;
  --color-sage: #82967f;
  --color-burgundy: #a8605f;
  --color-purple: #604760;
  --color-cream: #faf9f5;
  --color-dark-text: #151515;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

Add Inter font to `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

**Step 7: Set up basic App with React Router**

Create `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Placeholder({ name }: { name: string }) {
  return <div className="p-8 text-dark-text">{name} page</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Placeholder name="Home" />} />
        <Route path="/results" element={<Placeholder name="Results" />} />
        <Route path="/more-details" element={<Placeholder name="More Details" />} />
      </Routes>
    </BrowserRouter>
  )
}
```

**Step 8: Verify it runs**

```bash
npm run dev
```

Visit `http://localhost:5173/` — should see "Home page" in Inter font on white background.

**Step 9: Set up Git and push**

```bash
git init
git remote add origin git@github.com:Alt-Studios/pps-poc.git
git add .
git commit -m "feat: scaffold Vite + React + TypeScript + ShadCN + Tailwind project"
git branch -M main
git push -u origin main
```

---

### Task 2: Types & Number Formatting Utility

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/format-number.ts`

**Step 1: Create shared types**

Create `src/lib/types.ts`:

```typescript
export interface CalculatorInputs {
  age: number
  lifeOverallPremium: number
  lifePremium: number | null
  disabilityPremium: number | null
  criticalIllnessPremium: number | null
  incomeProtectionPremium: number | null
  shortTermPremium: number
  medicalAidPremium: number
  monthlyInvestmentContribution: number
  lumpSumInvestmentContribution: number
  usedSpecifyModal: boolean
}

export interface Projection {
  anb: number
  life: number
  sti: number
  profmed: number
  investment: number
  chb: number
  chbEffect: number
}

export interface CalculateResponse {
  additionalProfitShare: number
  projections: Projection[]
}
```

**Step 2: Create number formatting utility**

Create `src/lib/format-number.ts`:

```typescript
/**
 * Formats a number into summarised form matching PPS SummarisedNumberPipe.
 * Examples: 2300000 → "R2.3M", 161425 → "R161.4K", 500 → "R500"
 */
export function formatCurrency(value: number, decimals = 1, prefix = 'R'): string {
  const abs = Math.abs(value)

  if (abs >= 1_000_000_000) {
    return `${prefix}${(value / 1_000_000_000).toFixed(decimals)}B`
  }
  if (abs >= 1_000_000) {
    return `${prefix}${(value / 1_000_000).toFixed(decimals)}M`
  }
  if (abs >= 1_000) {
    return `${prefix}${(value / 1_000).toFixed(decimals)}K`
  }

  return `${prefix}${value.toFixed(0)}`
}

/**
 * Formats a number with space as thousands separator for display in inputs.
 * Example: 1500000 → "1 500 000"
 */
export function formatWithSpaces(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
```

**Step 3: Commit**

```bash
git add src/lib/types.ts src/lib/format-number.ts
git commit -m "feat: add shared types and number formatting utilities"
```

---

### Task 3: Mock API

**Files:**
- Create: `src/lib/mock-api.ts`

**Step 1: Build the mock calculation function**

Create `src/lib/mock-api.ts`:

```typescript
import type { CalculatorInputs, CalculateResponse, Projection } from './types'

/**
 * Preprocesses inputs matching PPS 50/50 split logic.
 * If user didn't use Specify modal, split overall life premium evenly
 * between lifePremium and incomeProtectionPremium.
 */
function preprocessInputs(inputs: CalculatorInputs) {
  let lifePremium = inputs.lifePremium ?? 0
  let disabilityPremium = inputs.disabilityPremium ?? 0
  let criticalIllnessPremium = inputs.criticalIllnessPremium ?? 0
  let incomeProtectionPremium = inputs.incomeProtectionPremium ?? 0

  if (!inputs.usedSpecifyModal) {
    lifePremium = inputs.lifeOverallPremium / 2
    incomeProtectionPremium = inputs.lifeOverallPremium / 2
    disabilityPremium = 0
    criticalIllnessPremium = 0
  }

  return {
    age: inputs.age,
    lifePremium,
    disabilityPremium,
    criticalIllnessPremium,
    incomeProtectionPremium,
    shortTermPremium: inputs.shortTermPremium || 0,
    medicalAidPremium: inputs.medicalAidPremium || 0,
    monthlyInvestmentContribution: inputs.monthlyInvestmentContribution || 0,
    lumpSumInvestmentContribution: inputs.lumpSumInvestmentContribution || 0,
  }
}

/**
 * Mock calculation that generates realistic-looking projection data.
 * Uses compound growth to simulate profit-share accumulation.
 */
export function calculateProfitShare(inputs: CalculatorInputs): CalculateResponse {
  const p = preprocessInputs(inputs)
  const yearsToRetirement = 65 - p.age
  const projections: Projection[] = []

  // Growth factors per year (compound growth simulation)
  const lifeMonthly = p.lifePremium + p.disabilityPremium + p.criticalIllnessPremium + p.incomeProtectionPremium
  const growthRate = 0.08 // 8% annual growth assumption

  for (let i = 1; i <= yearsToRetirement; i++) {
    const anb = p.age + i
    const yearFactor = Math.pow(1 + growthRate, i)
    const cumulativeFactor = ((yearFactor - 1) / growthRate)

    // Life allocation based on total life premiums
    const life = Math.round(lifeMonthly * 12 * cumulativeFactor * 0.35)

    // Short-term insurance allocation
    const sti = Math.round(p.shortTermPremium * 12 * cumulativeFactor * 0.08)

    // Medical aid allocation
    const profmed = Math.round(p.medicalAidPremium * 12 * cumulativeFactor * 0.10)

    // Investment allocation
    const investmentMonthly = p.monthlyInvestmentContribution * 12 * cumulativeFactor * 0.15
    const investmentLumpSum = p.lumpSumInvestmentContribution * yearFactor * 0.20
    const investment = Math.round(investmentMonthly + investmentLumpSum)

    // Cross-holdings booster: bonus for having multiple product types
    const productCount = [
      lifeMonthly > 0,
      p.shortTermPremium > 0,
      p.medicalAidPremium > 0,
      p.monthlyInvestmentContribution > 0 || p.lumpSumInvestmentContribution > 0,
    ].filter(Boolean).length

    const boosterMultiplier = productCount > 1 ? 0.12 * (productCount - 1) : 0
    const chb = Math.round((life + sti + profmed + investment) * boosterMultiplier)

    // chbEffect is the additional impact shown in the stacked bar
    const chbEffect = Math.round(chb + sti + profmed + investment)

    projections.push({ anb, life, sti, profmed, investment, chb, chbEffect })
  }

  const lastProjection = projections[projections.length - 1]
  const additionalProfitShare = lastProjection
    ? lastProjection.life + lastProjection.sti + lastProjection.profmed + lastProjection.investment + lastProjection.chb
    : 0

  return { additionalProfitShare, projections }
}
```

**Step 2: Verify with a quick manual test**

```bash
npx tsx -e "
import { calculateProfitShare } from './src/lib/mock-api.ts';
const result = calculateProfitShare({
  age: 35, lifeOverallPremium: 1500,
  lifePremium: null, disabilityPremium: null,
  criticalIllnessPremium: null, incomeProtectionPremium: null,
  shortTermPremium: 3000, medicalAidPremium: 2500,
  monthlyInvestmentContribution: 2000, lumpSumInvestmentContribution: 10000,
  usedSpecifyModal: false
});
console.log('Total:', result.additionalProfitShare);
console.log('Projections:', result.projections.length);
console.log('Last:', JSON.stringify(result.projections[result.projections.length - 1]));
"
```

Expected: 30 projections, positive numbers, additionalProfitShare in millions range.

**Step 3: Commit**

```bash
git add src/lib/mock-api.ts
git commit -m "feat: add mock profit-share calculation API"
```

---

### Task 4: Calculator Context

**Files:**
- Create: `src/context/calculator-context.tsx`

**Step 1: Create the context provider**

Create `src/context/calculator-context.tsx`:

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { CalculatorInputs, CalculateResponse } from '@/lib/types'
import { calculateProfitShare } from '@/lib/mock-api'

interface CalculatorContextType {
  inputs: CalculatorInputs | null
  result: CalculateResponse | null
  calculate: (inputs: CalculatorInputs) => CalculateResponse
  reset: () => void
}

const CalculatorContext = createContext<CalculatorContextType | null>(null)

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null)
  const [result, setResult] = useState<CalculateResponse | null>(null)

  function calculate(newInputs: CalculatorInputs): CalculateResponse {
    setInputs(newInputs)
    const response = calculateProfitShare(newInputs)
    setResult(response)
    return response
  }

  function reset() {
    setInputs(null)
    setResult(null)
  }

  return (
    <CalculatorContext.Provider value={{ inputs, result, calculate, reset }}>
      {children}
    </CalculatorContext.Provider>
  )
}

export function useCalculator() {
  const context = useContext(CalculatorContext)
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}
```

**Step 2: Wrap App with the provider**

Update `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CalculatorProvider } from '@/context/calculator-context'

function Placeholder({ name }: { name: string }) {
  return <div className="p-8 text-dark-text">{name} page</div>
}

export default function App() {
  return (
    <CalculatorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Placeholder name="Home" />} />
          <Route path="/results" element={<Placeholder name="Results" />} />
          <Route path="/more-details" element={<Placeholder name="More Details" />} />
        </Routes>
      </BrowserRouter>
    </CalculatorProvider>
  )
}
```

**Step 3: Verify it compiles**

```bash
npm run dev
```

No errors in terminal or browser console.

**Step 4: Commit**

```bash
git add src/context/calculator-context.tsx src/App.tsx
git commit -m "feat: add calculator context provider with mock API integration"
```

---

### Task 5: Calculator Form Page

**Files:**
- Create: `src/pages/home.tsx`
- Create: `src/components/calculator-form.tsx`
- Create: `src/components/specify-modal.tsx`
- Modify: `src/App.tsx` — replace placeholder with real page

**Step 1: Create the Specify Modal component**

Create `src/components/specify-modal.tsx`:

```tsx
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SpecifyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (values: {
    lifePremium: number
    disabilityPremium: number
    criticalIllnessPremium: number
    incomeProtectionPremium: number
  }) => void
  initialValues?: {
    lifePremium: number
    disabilityPremium: number
    criticalIllnessPremium: number
    incomeProtectionPremium: number
  }
}

export function SpecifyModal({ open, onOpenChange, onDone, initialValues }: SpecifyModalProps) {
  const [lifePremium, setLifePremium] = useState(initialValues?.lifePremium ?? 0)
  const [disabilityPremium, setDisabilityPremium] = useState(initialValues?.disabilityPremium ?? 0)
  const [criticalIllnessPremium, setCriticalIllnessPremium] = useState(initialValues?.criticalIllnessPremium ?? 0)
  const [incomeProtectionPremium, setIncomeProtectionPremium] = useState(initialValues?.incomeProtectionPremium ?? 0)

  const total = lifePremium + disabilityPremium + criticalIllnessPremium + incomeProtectionPremium
  const isValid = total > 0

  function handleDone() {
    if (!isValid) return
    onDone({ lifePremium, disabilityPremium, criticalIllnessPremium, incomeProtectionPremium })
    onOpenChange(false)
  }

  const fields = [
    { label: 'Life Cover Premium', value: lifePremium, onChange: setLifePremium },
    { label: 'Disability Premium', value: disabilityPremium, onChange: setDisabilityPremium },
    { label: 'Critical Illness Premium', value: criticalIllnessPremium, onChange: setCriticalIllnessPremium },
    { label: 'Income Protection Premium', value: incomeProtectionPremium, onChange: setIncomeProtectionPremium },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-navy uppercase tracking-wider text-sm font-bold">
            Specify Life Premium Breakdown
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.label} className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-navy/70">{field.label}</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-navy bg-cream px-2 py-1.5 rounded-l border border-r-0">R</span>
                <Input
                  type="number"
                  min={0}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="rounded-l-none"
                />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t text-sm font-semibold text-navy">
            Total: R{total.toLocaleString()}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleDone}
            disabled={!isValid}
            className="bg-gold hover:bg-gold/90 text-white uppercase tracking-wider text-sm"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Create the Calculator Form component**

Create `src/components/calculator-form.tsx`:

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SpecifyModal } from '@/components/specify-modal'
import { useCalculator } from '@/context/calculator-context'
import type { CalculatorInputs } from '@/lib/types'

export function CalculatorForm() {
  const navigate = useNavigate()
  const { calculate } = useCalculator()
  const [specifyOpen, setSpecifyOpen] = useState(false)

  const [age, setAge] = useState<number | ''>('')
  const [lifeOverallPremium, setLifeOverallPremium] = useState<number | ''>('')
  const [shortTermPremium, setShortTermPremium] = useState<number | ''>('')
  const [medicalAidPremium, setMedicalAidPremium] = useState<number | ''>('')
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | ''>('')
  const [lumpSumInvestment, setLumpSumInvestment] = useState<number | ''>('')

  const [usedSpecifyModal, setUsedSpecifyModal] = useState(false)
  const [lifePremium, setLifePremium] = useState<number | null>(null)
  const [disabilityPremium, setDisabilityPremium] = useState<number | null>(null)
  const [criticalIllnessPremium, setCriticalIllnessPremium] = useState<number | null>(null)
  const [incomeProtectionPremium, setIncomeProtectionPremium] = useState<number | null>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!age || age < 19 || age > 64) {
      newErrors.age = 'Age must be between 19 and 64'
    }
    if (!lifeOverallPremium || lifeOverallPremium <= 0) {
      newErrors.lifeOverallPremium = 'Life insurance premium is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const inputs: CalculatorInputs = {
      age: age as number,
      lifeOverallPremium: lifeOverallPremium as number,
      lifePremium,
      disabilityPremium,
      criticalIllnessPremium,
      incomeProtectionPremium,
      shortTermPremium: (shortTermPremium as number) || 0,
      medicalAidPremium: (medicalAidPremium as number) || 0,
      monthlyInvestmentContribution: (monthlyInvestment as number) || 0,
      lumpSumInvestmentContribution: (lumpSumInvestment as number) || 0,
      usedSpecifyModal,
    }

    calculate(inputs)
    navigate('/results')
  }

  function handleSpecifyDone(values: {
    lifePremium: number
    disabilityPremium: number
    criticalIllnessPremium: number
    incomeProtectionPremium: number
  }) {
    setLifePremium(values.lifePremium)
    setDisabilityPremium(values.disabilityPremium)
    setCriticalIllnessPremium(values.criticalIllnessPremium)
    setIncomeProtectionPremium(values.incomeProtectionPremium)
    setLifeOverallPremium(
      values.lifePremium + values.disabilityPremium +
      values.criticalIllnessPremium + values.incomeProtectionPremium
    )
    setUsedSpecifyModal(true)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Age */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider font-bold text-white/90">
            What is your age?
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 35"
              className="max-w-[140px] bg-white text-navy"
            />
            <span className="text-sm text-white/70">years</span>
          </div>
          {errors.age && <p className="text-red-300 text-xs">{errors.age}</p>}
        </div>

        {/* Life Insurance Premium */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider font-bold text-white/90">
            What are your monthly PPS Life Insurance premiums?
          </Label>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-navy bg-white/80 px-2 py-1.5 rounded-l border border-r-0">R</span>
              <Input
                type="number"
                value={lifeOverallPremium}
                onChange={(e) => {
                  setLifeOverallPremium(e.target.value ? Number(e.target.value) : '')
                  if (usedSpecifyModal) setUsedSpecifyModal(false)
                }}
                placeholder="e.g. 1500"
                className="rounded-l-none bg-white text-navy max-w-[160px]"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSpecifyOpen(true)}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 uppercase text-xs tracking-wider"
            >
              Specify
            </Button>
          </div>
          {errors.lifeOverallPremium && <p className="text-red-300 text-xs">{errors.lifeOverallPremium}</p>}
        </div>

        {/* Car & Home */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider font-bold text-white/90">
            What is your monthly Car & Home premium?
          </Label>
          <div className="flex items-center">
            <span className="text-sm font-semibold text-navy bg-white/80 px-2 py-1.5 rounded-l border border-r-0">R</span>
            <Input
              type="number"
              value={shortTermPremium}
              onChange={(e) => setShortTermPremium(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 3000"
              className="rounded-l-none bg-white text-navy max-w-[160px]"
            />
          </div>
        </div>

        {/* Medical Aid */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider font-bold text-white/90">
            What is your monthly Medical Aid premium?
          </Label>
          <div className="flex items-center">
            <span className="text-sm font-semibold text-navy bg-white/80 px-2 py-1.5 rounded-l border border-r-0">R</span>
            <Input
              type="number"
              value={medicalAidPremium}
              onChange={(e) => setMedicalAidPremium(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 2500"
              className="rounded-l-none bg-white text-navy max-w-[160px]"
            />
          </div>
        </div>

        {/* Investment Contributions */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider font-bold text-white/90">
            What are your investment contributions?
          </Label>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">Monthly Contribution</span>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-navy bg-white/80 px-2 py-1.5 rounded-l border border-r-0">R</span>
                <Input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 2000"
                  className="rounded-l-none bg-white text-navy max-w-[140px]"
                />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">Lump Sum (Once-off)</span>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-navy bg-white/80 px-2 py-1.5 rounded-l border border-r-0">R</span>
                <Input
                  type="number"
                  value={lumpSumInvestment}
                  onChange={(e) => setLumpSumInvestment(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 10 000"
                  className="rounded-l-none bg-white text-navy max-w-[140px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-gold hover:bg-gold/90 text-white uppercase tracking-wider font-bold text-sm py-6 rounded-full"
        >
          Calculate →
        </Button>
      </form>

      <SpecifyModal
        open={specifyOpen}
        onOpenChange={setSpecifyOpen}
        onDone={handleSpecifyDone}
        initialValues={usedSpecifyModal ? {
          lifePremium: lifePremium ?? 0,
          disabilityPremium: disabilityPremium ?? 0,
          criticalIllnessPremium: criticalIllnessPremium ?? 0,
          incomeProtectionPremium: incomeProtectionPremium ?? 0,
        } : undefined}
      />
    </>
  )
}
```

**Step 3: Create the Home page**

Create `src/pages/home.tsx`:

```tsx
import { CalculatorForm } from '@/components/calculator-form'

export function HomePage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="bg-navy text-white text-center py-4 rounded-t-xl">
          <h1 className="text-sm uppercase tracking-[0.25em] font-bold">
            Profit-Share Projection
          </h1>
        </div>

        {/* Form body */}
        <div className="bg-navy/95 backdrop-blur text-white p-8 rounded-b-xl">
          <CalculatorForm />
        </div>
      </div>
    </div>
  )
}
```

**Step 4: Wire up the route in App.tsx**

Update `src/App.tsx` — replace the Home placeholder import:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CalculatorProvider } from '@/context/calculator-context'
import { HomePage } from '@/pages/home'

function Placeholder({ name }: { name: string }) {
  return <div className="p-8 text-dark-text">{name} page</div>
}

export default function App() {
  return (
    <CalculatorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<Placeholder name="Results" />} />
          <Route path="/more-details" element={<Placeholder name="More Details" />} />
        </Routes>
      </BrowserRouter>
    </CalculatorProvider>
  )
}
```

**Step 5: Verify the form renders and validates**

```bash
npm run dev
```

- Visit `http://localhost:5173/`
- Navy form card centered on cream background
- Fill in age=35, life premium=1500, click Calculate
- Should navigate to `/results` (placeholder)
- Try submitting with empty fields — validation errors shown

**Step 6: Commit**

```bash
git add src/components/calculator-form.tsx src/components/specify-modal.tsx src/pages/home.tsx src/App.tsx
git commit -m "feat: add calculator form with validation and specify modal"
```

---

### Task 6: Results Page (Headline + Bar Chart)

**Files:**
- Create: `src/pages/results.tsx`
- Create: `src/components/results-chart.tsx`
- Create: `src/components/confetti.tsx`
- Modify: `src/App.tsx` — wire up results route

**Step 1: Create the confetti trigger component**

Create `src/components/confetti.tsx`:

```tsx
import { useCallback } from 'react'
import confetti from 'canvas-confetti'

export function useConfetti() {
  return useCallback(() => {
    // PPS brand colors: gold and teal
    const colors = ['#b09455', '#69c5d1']

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    })

    // Second burst slightly delayed
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })
    }, 250)
  }, [])
}
```

**Step 2: Create the stacked bar chart component**

Create `src/components/results-chart.tsx`:

```tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Projection } from '@/lib/types'
import { formatCurrency } from '@/lib/format-number'

interface ResultsChartProps {
  projections: Projection[]
}

function formatYAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return value.toString()
}

export function ResultsChart({ projections }: ResultsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={projections} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="anb"
          label={{ value: 'AGE', position: 'insideBottom', offset: -5, style: { fill: '#091e35', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' } }}
          tick={{ fontSize: 11, fill: '#091e35' }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={formatYAxis}
          label={{ value: 'RANDS', angle: -90, position: 'insideLeft', style: { fill: '#091e35', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' } }}
          tick={{ fontSize: 11, fill: '#091e35' }}
        />
        <Tooltip
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
          labelFormatter={(label) => `Age ${label}`}
          contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
        />
        <Bar
          dataKey="life"
          name="Profit-Share (Life Product Only)"
          stackId="a"
          fill="#b09455"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="chbEffect"
          name="Cross-Holdings Booster & Additional Products"
          stackId="a"
          fill="#69c5d1"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

**Step 3: Create the Results page**

Create `src/pages/results.tsx`:

```tsx
import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import CountUp from 'react-countup'
import { Button } from '@/components/ui/button'
import { useCalculator } from '@/context/calculator-context'
import { ResultsChart } from '@/components/results-chart'
import { useConfetti } from '@/components/confetti'
import { formatCurrency } from '@/lib/format-number'

export function ResultsPage() {
  const { result } = useCalculator()
  const fireConfetti = useConfetti()

  // Redirect to home if no result data
  if (!result) return <Navigate to="/" replace />

  const headline = result.additionalProfitShare > 0
    ? result.additionalProfitShare
    : result.projections[result.projections.length - 1]?.life ?? 0

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Headline */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-wider text-navy/60 mb-2 font-medium">
            Your projected additional
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy mb-3">
            +{' '}
            <span className="text-gold">
              R<CountUp
                end={headline}
                duration={2}
                separator=" "
                onEnd={fireConfetti}
              />
            </span>
          </h1>
          <p className="text-lg text-navy/80 font-medium">
            Profit-Share by your 65th birthday!
          </p>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xs uppercase tracking-wider font-bold text-navy/60 mb-6">
            Projected Profit-Share Growth
          </h2>
          <ResultsChart projections={result.projections} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Link to="/more-details">
            <Button className="bg-gold hover:bg-gold/90 text-white uppercase tracking-wider font-bold text-sm px-8 py-6 rounded-full">
              More Details →
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="uppercase tracking-wider text-sm px-8 py-6 rounded-full border-navy/20 text-navy hover:bg-navy/5">
              Recalculate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
```

**Step 4: Wire up in App.tsx**

Update `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CalculatorProvider } from '@/context/calculator-context'
import { HomePage } from '@/pages/home'
import { ResultsPage } from '@/pages/results'

function Placeholder({ name }: { name: string }) {
  return <div className="p-8 text-dark-text">{name} page</div>
}

export default function App() {
  return (
    <CalculatorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/more-details" element={<Placeholder name="More Details" />} />
        </Routes>
      </BrowserRouter>
    </CalculatorProvider>
  )
}
```

**Step 5: Verify**

```bash
npm run dev
```

- Fill form with age=35, life=1500, car&home=3000, medical=2500, investment=2000, lump sum=10000
- Click Calculate → Results page shows animated count-up, confetti fires, stacked bar chart renders
- "More Details" button navigates to placeholder
- "Recalculate" returns to form

**Step 6: Commit**

```bash
git add src/pages/results.tsx src/components/results-chart.tsx src/components/confetti.tsx src/App.tsx
git commit -m "feat: add results page with animated headline, confetti, and stacked bar chart"
```

---

### Task 7: More Details Page (Pie Chart + Tiles)

**Files:**
- Create: `src/pages/more-details.tsx`
- Create: `src/components/pie-chart.tsx`
- Create: `src/components/allocation-tiles.tsx`
- Modify: `src/App.tsx` — wire up final route

**Step 1: Create the pie chart component**

Create `src/components/pie-chart.tsx`:

```tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Projection } from '@/lib/types'
import { formatCurrency } from '@/lib/format-number'

interface AllocationPieChartProps {
  projection: Projection
}

const CATEGORIES = [
  { key: 'life' as const, label: 'Life Allocation', color: '#b09455' },
  { key: 'sti' as const, label: 'Car & Home Allocation', color: '#82967f' },
  { key: 'profmed' as const, label: 'Medical Aid Allocation', color: '#a8605f' },
  { key: 'investment' as const, label: 'Investment Allocation', color: '#604760' },
  { key: 'chb' as const, label: 'Cross-Holdings Booster', color: '#69c5d1' },
]

export function AllocationPieChart({ projection }: AllocationPieChartProps) {
  const data = CATEGORIES
    .filter((cat) => projection[cat.key] > 0)
    .map((cat) => ({
      name: cat.label,
      value: projection[cat.key],
      color: cat.color,
    }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          innerRadius={60}
          dataKey="value"
          paddingAngle={2}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
```

**Step 2: Create the allocation tiles component**

Create `src/components/allocation-tiles.tsx`:

```tsx
import { Card } from '@/components/ui/card'
import type { Projection } from '@/lib/types'
import { formatCurrency } from '@/lib/format-number'

interface AllocationTilesProps {
  projection: Projection
}

const TILES = [
  { key: 'life' as const, label: 'Life', color: '#b09455' },
  { key: 'sti' as const, label: 'Car & Home', color: '#82967f' },
  { key: 'profmed' as const, label: 'Medical Aid', color: '#a8605f' },
  { key: 'investment' as const, label: 'Investment', color: '#604760' },
  { key: 'chb' as const, label: 'Cross-Holdings Booster', color: '#69c5d1' },
]

export function AllocationTiles({ projection }: AllocationTilesProps) {
  const total = projection.life + projection.sti + projection.profmed + projection.investment + projection.chb

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {TILES.map((tile) => {
        const value = projection[tile.key]
        const isDimmed = value <= 0

        return (
          <Card
            key={tile.key}
            className={`p-4 border-t-4 transition-opacity ${isDimmed ? 'opacity-40' : ''}`}
            style={{ borderTopColor: tile.color }}
          >
            <p className="text-xs uppercase tracking-wider text-navy/60 font-medium mb-1">
              {tile.label}
            </p>
            <p className="text-xl font-bold text-navy">
              {formatCurrency(value)}
            </p>
          </Card>
        )
      })}

      {/* Total tile */}
      <Card className="p-4 border-t-4 border-t-navy bg-navy/5">
        <p className="text-xs uppercase tracking-wider text-navy/60 font-medium mb-1">
          Overall Total
        </p>
        <p className="text-xl font-bold text-navy">
          {formatCurrency(total)}
        </p>
      </Card>
    </div>
  )
}
```

**Step 3: Create the More Details page**

Create `src/pages/more-details.tsx`:

```tsx
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useCalculator } from '@/context/calculator-context'
import { AllocationPieChart } from '@/components/pie-chart'
import { AllocationTiles } from '@/components/allocation-tiles'

export function MoreDetailsPage() {
  const { result } = useCalculator()

  if (!result) return <Navigate to="/" replace />

  const age65Projection = result.projections[result.projections.length - 1]

  if (!age65Projection) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-navy mb-8 uppercase tracking-wider">
          Profit-Share Breakdown at Age 65
        </h1>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xs uppercase tracking-wider font-bold text-navy/60 mb-4">
            Allocation Distribution
          </h2>
          <AllocationPieChart projection={age65Projection} />
        </div>

        {/* Tiles */}
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider font-bold text-navy/60 mb-4">
            Allocation Breakdown
          </h2>
          <AllocationTiles projection={age65Projection} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Link to="/results">
            <Button variant="outline" className="uppercase tracking-wider text-sm px-8 py-6 rounded-full border-navy/20 text-navy hover:bg-navy/5">
              ← Back to Results
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="uppercase tracking-wider text-sm px-8 py-6 rounded-full border-navy/20 text-navy hover:bg-navy/5">
              Recalculate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
```

**Step 4: Wire up in App.tsx**

Update `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CalculatorProvider } from '@/context/calculator-context'
import { HomePage } from '@/pages/home'
import { ResultsPage } from '@/pages/results'
import { MoreDetailsPage } from '@/pages/more-details'

export default function App() {
  return (
    <CalculatorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/more-details" element={<MoreDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </CalculatorProvider>
  )
}
```

**Step 5: Verify the full flow**

```bash
npm run dev
```

- Fill form → Calculate → Results (headline + bar chart + confetti) → More Details (pie + tiles)
- Verify pie chart shows correct segments with PPS colors
- Verify tiles show formatted values (R2.3M, R161.4K)
- Verify dimmed tiles for zero-value categories
- Verify navigation between all 3 pages

**Step 6: Commit**

```bash
git add src/pages/more-details.tsx src/components/pie-chart.tsx src/components/allocation-tiles.tsx src/App.tsx
git commit -m "feat: add more details page with pie chart and allocation tiles"
```

---

### Task 8: Polish & Responsive Design

**Files:**
- Modify: `src/pages/home.tsx` — add PPS logo placeholder, responsive tweaks
- Modify: `src/pages/results.tsx` — responsive chart sizing
- Modify: `src/pages/more-details.tsx` — responsive grid
- Modify: `src/index.css` — global styles, scrollbar, transitions

**Step 1: Add global polish to index.css**

Add after the existing content in `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-navy: #091e35;
  --color-gold: #b09455;
  --color-teal: #69c5d1;
  --color-sage: #82967f;
  --color-burgundy: #a8605f;
  --color-purple: #604760;
  --color-cream: #faf9f5;
  --color-dark-text: #151515;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  color: var(--color-dark-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Hide number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
```

**Step 2: Responsive tweaks to pages**

Review each page and ensure:
- Form card is full-width on mobile, max-w-lg on desktop
- Charts have min-height on mobile (300px), full height on desktop (400px)
- Tiles grid is 1 column on mobile, 2 on sm, 3 on md
- Buttons stack vertically on mobile, row on desktop

Make any needed adjustments to the responsive classes.

**Step 3: Add a fallback route**

In `src/App.tsx`, add a catch-all redirect:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// ... inside Routes:
<Route path="*" element={<Navigate to="/" replace />} />
```

**Step 4: Verify on different viewports**

```bash
npm run dev
```

Test at 375px, 768px, 1024px, and 1440px widths.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add responsive polish, global styles, and catch-all route"
```

---

### Task 9: Build Verification & GitHub Push

**Files:**
- Modify: `vite.config.ts` — ensure correct base path if needed

**Step 1: Run production build**

```bash
npm run build
```

Expected: No errors, `dist/` folder created with index.html and assets.

**Step 2: Preview the production build**

```bash
npm run preview
```

Test the full flow at `http://localhost:4173/`.

**Step 3: Push all commits to GitHub**

```bash
git push origin main
```

**Step 4: Verify repo on GitHub**

```bash
gh repo view Alt-Studios/pps-poc --web
```

---

### Task 10: Azure Static Web Apps Deployment

**Files:**
- Create: `.github/workflows/azure-static-web-apps.yml`

**Step 1: Create the GitHub Actions workflow**

Create `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy
    steps:
      - uses: actions/checkout@v4

      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist"

  close_pull_request:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

**Note:** The `AZURE_STATIC_WEB_APPS_API_TOKEN` secret must be added to the GitHub repo settings. This is obtained when creating the Static Web App resource in Azure Portal.

**Step 2: Create SWA routing config**

Create `public/staticwebapp.config.json`:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*"]
  }
}
```

This ensures client-side routing works (all paths serve index.html).

**Step 3: Commit and push**

```bash
git add .github/workflows/azure-static-web-apps.yml public/staticwebapp.config.json
git commit -m "feat: add Azure Static Web Apps deployment workflow"
git push origin main
```

**Step 4: Set up Azure (manual)**

The user needs to:
1. Create an Azure Static Web App resource in Azure Portal
2. Connect it to the `Alt-Studios/pps-poc` GitHub repo
3. Copy the deployment token into the repo's GitHub Secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. Trigger a new push or manually run the workflow

---

## Summary

| Task | Description | Depends On |
|---|---|---|
| 1 | Project scaffolding, deps, ShadCN, Git + GitHub repo | — |
| 2 | Types + number formatting utility | 1 |
| 3 | Mock API | 2 |
| 4 | Calculator context provider | 3 |
| 5 | Calculator form page + specify modal | 4 |
| 6 | Results page (headline + bar chart + confetti) | 4 |
| 7 | More details page (pie chart + tiles) | 6 |
| 8 | Responsive polish + global styles | 7 |
| 9 | Build verification + GitHub push | 8 |
| 10 | Azure SWA deployment workflow | 9 |
