# Form Fixes, Light/Dark Mode & Results Enhancements — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix form input styling inconsistencies, add PPS-branded light/dark mode, show input summary on results page, and add restart functionality.

**Architecture:** Theme context with localStorage persistence toggles a `.dark` class on the root element. Tailwind's `@custom-variant dark` is already configured. All pages reference theme-aware utility classes. Calculator context already has `reset()` and exposes `inputs`.

**Tech Stack:** React 19, Tailwind CSS v4, ShadCN/ui, React Router v6

---

### Task 1: Fix Input Height & Border Radius Consistency

**Files:**
- Modify: `src/components/calculator-form.tsx`
- Modify: `src/components/ui/input.tsx`

**Step 1: Update the Input component height**

In `src/components/ui/input.tsx`, change `h-8` to `h-10` in the base class string:

```tsx
// Change this:
"h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base ...
// To this:
"h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base ...
```

**Step 2: Fix all input row elements in calculator-form.tsx**

For each input row, ensure consistent height and border radius. Update the R prefix spans (lines ~139, ~172, ~193, ~217, ~234):

```tsx
// R prefix span — all instances:
<span className="bg-white/80 text-navy font-semibold px-3 h-10 rounded-l-lg border border-r-0 border-white/20 text-sm flex items-center">
  R
</span>
```

Update the Input className for fields with R prefix (lines ~142-152, ~175-182, ~196-202, ~220-227, ~237-244):

```tsx
// Input after R prefix — all instances:
className="rounded-l-none rounded-r-lg bg-white/10 text-white border-white/20 placeholder:text-white/40"
```

Update the Age input (line ~114-124) — no R prefix, but has years badge:

```tsx
<Input
  ...
  className="bg-white/10 text-white border-white/20 placeholder:text-white/40 rounded-l-lg rounded-r-none"
/>
```

Update the years badge (line ~126-128):

```tsx
<span className="bg-white/80 text-navy font-semibold px-3 h-10 rounded-r-lg border border-l-0 border-white/20 text-sm flex items-center">
  years
</span>
```

Update the Specify button (line ~154-161) — needs matching height:

```tsx
<Button
  type="button"
  onClick={() => setSpecifyOpen(true)}
  variant="outline"
  size="lg"
  className="ml-2 text-gold border-gold/40 hover:bg-gold/10 hover:text-gold uppercase tracking-wider text-xs shrink-0"
>
  Specify
</Button>
```

**Step 3: Verify visually**

Run: `npm run dev`
Open: `http://localhost:5173`
Expected: All input rows have uniform 40px height, R badges and years badge are same height as inputs, border radii connect seamlessly.

**Step 4: Commit**

```bash
git add src/components/calculator-form.tsx src/components/ui/input.tsx
git commit -m "fix: consistent input height and border radius across form fields"
```

---

### Task 2: Create Theme Context

**Files:**
- Create: `src/context/theme-context.tsx`
- Modify: `src/App.tsx`

**Step 1: Create theme context with localStorage persistence**

Create `src/context/theme-context.tsx`:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('pps-theme')
    return (stored === 'light' || stored === 'dark') ? stored : 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('pps-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

**Step 2: Wrap App with ThemeProvider**

In `src/App.tsx`, wrap the existing tree:

```tsx
import { ThemeProvider } from '@/context/theme-context'

export default function App() {
  return (
    <ThemeProvider>
      <CalculatorProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/more-details" element={<MoreDetailsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CalculatorProvider>
    </ThemeProvider>
  )
}
```

**Step 3: Verify**

Run: `npm run dev`
Expected: App loads with dark mode by default (`.dark` class on `<html>`).

**Step 4: Commit**

```bash
git add src/context/theme-context.tsx src/App.tsx
git commit -m "feat: add theme context with localStorage persistence"
```

---

### Task 3: Theme the Home Page (Calculator Form)

**Files:**
- Modify: `src/pages/home.tsx`
- Modify: `src/components/calculator-form.tsx`

**Step 1: Update home.tsx with theme-aware classes**

```tsx
import { CalculatorForm } from '@/components/calculator-form'
import { useTheme } from '@/context/theme-context'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-cream-light dark:bg-navy-dark flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="rounded-xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="bg-navy px-6 py-5 flex items-center justify-between">
            <div />
            <h1 className="text-white text-center text-xs font-normal uppercase tracking-[0.12em]">
              Profit-Share Projection
            </h1>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
          {/* Body */}
          <div className="bg-navy/95 dark:bg-navy/95 light:bg-white px-6 py-6">
            <CalculatorForm />
          </div>
        </div>
      </div>
    </div>
  )
}
```

Wait — the light mode body needs different styling. The body background should be white in light mode, navy/95 in dark. Let me correct:

```tsx
<div className="bg-white dark:bg-navy/95 px-6 py-6">
  <CalculatorForm />
</div>
```

**Step 2: Update calculator-form.tsx with theme-aware classes**

Replace all hardcoded dark styling with theme-aware classes. Key changes:

Labels:
```tsx
// From:
className="text-white uppercase tracking-[0.12em] font-normal text-xs mb-1.5"
// To:
className="text-navy dark:text-white uppercase tracking-[0.12em] font-normal text-xs mb-1.5"
```

R prefix spans:
```tsx
// From:
className="bg-white/80 text-navy font-semibold px-3 h-10 rounded-l-lg border border-r-0 border-white/20 text-sm flex items-center"
// To:
className="bg-navy dark:bg-white/80 text-white dark:text-navy font-semibold px-3 h-10 rounded-l-lg border border-r-0 border-border-light dark:border-white/20 text-sm flex items-center"
```

Years badge:
```tsx
// From:
className="bg-white/80 text-navy font-semibold px-3 h-10 rounded-r-lg border border-l-0 border-white/20 text-sm flex items-center"
// To:
className="bg-navy dark:bg-white/80 text-white dark:text-navy font-semibold px-3 h-10 rounded-r-lg border border-l-0 border-border-light dark:border-white/20 text-sm flex items-center"
```

Input fields:
```tsx
// From:
className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
// To:
className="bg-cream dark:bg-white/10 text-navy dark:text-white border-border-light dark:border-white/20 placeholder:text-muted-text dark:placeholder:text-white/40"
```

Submit button (no change needed — gold in both modes):
```tsx
className="w-full bg-gold text-white uppercase tracking-wider hover:bg-gold/90 rounded-full py-6 font-bold text-sm"
```

Specify button:
```tsx
className="ml-2 text-gold border-gold/40 hover:bg-gold/10 hover:text-gold uppercase tracking-wider text-xs shrink-0"
```
(No change — gold works in both modes)

Sub-labels (Monthly, Lump Sum Once-off):
```tsx
// From:
className="text-white/60 text-xs mb-1 block"
// To:
className="text-muted-text dark:text-white/60 text-xs mb-1 block"
```

Error messages stay red in both modes — no change.

**Step 3: Verify both modes**

Open `http://localhost:5173`, click the sun/moon toggle.
- Dark: navy card, white text, light badges — current look
- Light: white card, navy text, navy badges, cream inputs

**Step 4: Commit**

```bash
git add src/pages/home.tsx src/components/calculator-form.tsx
git commit -m "feat: light/dark mode theming for calculator form"
```

---

### Task 4: Theme Results & More Details Pages

**Files:**
- Modify: `src/pages/results.tsx`
- Modify: `src/pages/more-details.tsx`
- Modify: `src/components/allocation-tiles.tsx`

**Step 1: Update results.tsx**

Key class changes:

```tsx
// Page background
<div className="min-h-screen bg-cream-light dark:bg-navy-dark">

// Headline text
<p className="text-xs uppercase tracking-[0.12em] text-gold">
<p className="my-2 text-5xl font-normal tracking-[0.02em] text-navy dark:text-white">
<p className="text-base tracking-[0.04em] text-muted-text dark:text-white/60">

// Chart card
<Card className="mb-8 bg-white dark:bg-navy shadow-md dark:border-white/10">
```

**Step 2: Update more-details.tsx**

```tsx
// Page background
<div className="min-h-screen bg-cream-light dark:bg-navy-dark">

// Title
<h1 className="mb-8 text-center text-2xl font-normal uppercase tracking-[0.04em] text-navy dark:text-white">

// Chart card
<Card className="mb-8 bg-white dark:bg-navy shadow-md dark:border-white/10">

// Buttons
<Button variant="outline" className="rounded-full px-6 dark:text-white dark:border-white/20">
```

**Step 3: Update allocation-tiles.tsx**

```tsx
// Card backgrounds
<Card
  key={cat.key}
  className={`border-t-4 ${projection[cat.key] <= 0 ? 'opacity-40' : ''} bg-white dark:bg-navy`}
  style={{ borderTopColor: cat.color }}
>

// Label text
<p className="text-xs font-medium uppercase tracking-wider text-navy/60 dark:text-white/60">

// Value text
<p className="mt-1 text-xl font-bold text-navy dark:text-white">

// Total card
<Card className="border-t-4 border-t-navy dark:border-t-white bg-navy/5 dark:bg-white/5">
```

**Step 4: Verify**

Toggle theme on home page, calculate, check results and more-details pages adapt.

**Step 5: Commit**

```bash
git add src/pages/results.tsx src/pages/more-details.tsx src/components/allocation-tiles.tsx
git commit -m "feat: light/dark mode theming for results and details pages"
```

---

### Task 5: Add Input Summary Bar to Results Page

**Files:**
- Create: `src/components/input-summary.tsx`
- Modify: `src/pages/results.tsx`

**Step 1: Create InputSummary component**

Create `src/components/input-summary.tsx`:

```tsx
import { Link } from 'react-router-dom'
import type { CalculatorInputs } from '@/lib/types'
import { formatWithSpaces } from '@/lib/format-number'

interface InputSummaryProps {
  inputs: CalculatorInputs
}

export function InputSummary({ inputs }: InputSummaryProps) {
  const items: { label: string; value: string }[] = [
    { label: 'Age', value: `${inputs.age}` },
    { label: 'Life', value: `R${formatWithSpaces(inputs.lifeOverallPremium)}` },
  ]

  if (inputs.shortTermPremium > 0) {
    items.push({ label: 'Car & Home', value: `R${formatWithSpaces(inputs.shortTermPremium)}` })
  }
  if (inputs.medicalAidPremium > 0) {
    items.push({ label: 'Medical', value: `R${formatWithSpaces(inputs.medicalAidPremium)}` })
  }
  if (inputs.monthlyInvestmentContribution > 0) {
    items.push({ label: 'Monthly Inv.', value: `R${formatWithSpaces(inputs.monthlyInvestmentContribution)}` })
  }
  if (inputs.lumpSumInvestmentContribution > 0) {
    items.push({ label: 'Lump Sum', value: `R${formatWithSpaces(inputs.lumpSumInvestmentContribution)}` })
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 rounded-full border border-border-light dark:border-white/20 bg-cream dark:bg-navy px-6 py-2.5 text-sm">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && <span className="mx-2 text-muted-text dark:text-white/30">|</span>}
          <span className="text-muted-text dark:text-white/50">{item.label}:</span>
          <span className="font-medium text-navy dark:text-white">{item.value}</span>
        </span>
      ))}
      <span className="mx-2 text-muted-text dark:text-white/30">|</span>
      <Link to="/" className="font-medium text-gold hover:text-gold/80 transition-colors">
        Edit Inputs
      </Link>
    </div>
  )
}
```

**Step 2: Add InputSummary to results.tsx**

Import and render between headline and chart card:

```tsx
import { InputSummary } from '@/components/input-summary'

// Inside the component, after the headline div and before the Card:
const { result, inputs } = useCalculator()

// ... after the headline closing </div>:
{inputs && <InputSummary inputs={inputs} />}
```

**Step 3: Verify**

Fill form, submit, see summary bar with input values and "Edit Inputs" link.

**Step 4: Commit**

```bash
git add src/components/input-summary.tsx src/pages/results.tsx
git commit -m "feat: add input summary bar to results page"
```

---

### Task 6: Add Restart Actions (Edit Inputs + Start Over)

**Files:**
- Modify: `src/pages/results.tsx`
- Modify: `src/pages/more-details.tsx`

**Step 1: Update results.tsx button row**

```tsx
import { useNavigate, Link } from 'react-router-dom'

// Inside component:
const navigate = useNavigate()
const { result, inputs, reset } = useCalculator()

function handleStartOver() {
  reset()
  navigate('/')
}

// Replace the button row:
<div className="flex justify-center gap-4">
  <Link to="/more-details">
    <Button className="rounded-full bg-gold px-6 text-white hover:bg-gold/80">
      More Details &rarr;
    </Button>
  </Link>
  <Link to="/">
    <Button variant="outline" className="rounded-full px-6 dark:text-white dark:border-white/20">
      Edit Inputs
    </Button>
  </Link>
  <Button
    variant="outline"
    className="rounded-full px-6 dark:text-white dark:border-white/20"
    onClick={handleStartOver}
  >
    Start Over
  </Button>
</div>
```

**Step 2: Update more-details.tsx button row**

```tsx
import { useNavigate, Link } from 'react-router-dom'

// Inside component:
const navigate = useNavigate()
const { result, reset } = useCalculator()

function handleStartOver() {
  reset()
  navigate('/')
}

// Replace the button row:
<div className="flex justify-center gap-4">
  <Link to="/results">
    <Button variant="outline" className="rounded-full px-6 dark:text-white dark:border-white/20">
      &larr; Back to Results
    </Button>
  </Link>
  <Link to="/">
    <Button variant="outline" className="rounded-full px-6 dark:text-white dark:border-white/20">
      Edit Inputs
    </Button>
  </Link>
  <Button
    variant="outline"
    className="rounded-full px-6 dark:text-white dark:border-white/20"
    onClick={handleStartOver}
  >
    Start Over
  </Button>
</div>
```

**Step 3: Verify**

- "Edit Inputs" navigates to `/` with form pre-filled (context preserves inputs)
- "Start Over" clears form, navigates to `/` with blank form
- "More Details" still works on results page
- "Back to Results" still works on more-details page

**Step 4: Commit**

```bash
git add src/pages/results.tsx src/pages/more-details.tsx
git commit -m "feat: add Edit Inputs and Start Over actions to results pages"
```

---

### Task 7: Persist Theme Across Pages

**Files:**
- Modify: `src/pages/results.tsx`
- Modify: `src/pages/more-details.tsx`

**Step 1: Add theme toggle to results and more-details pages**

Add a small theme toggle in the top-right corner of both pages. Create a small reusable component:

Create `src/components/theme-toggle.tsx`:

```tsx
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/theme-context'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      className="text-navy/60 dark:text-white/60 hover:text-navy dark:hover:text-white hover:bg-navy/10 dark:hover:bg-white/10 fixed top-4 right-4 z-10"
    >
      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
```

**Step 2: Add ThemeToggle to results.tsx and more-details.tsx**

In both pages, add right after the opening page div:

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

// Inside the return, first child of the page wrapper:
<ThemeToggle />
```

**Step 3: Refactor home.tsx to use ThemeToggle**

Replace the inline toggle in home.tsx header with the shared component positioned inside the header:

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

// In the header, replace the inline Button with:
<ThemeToggle />
```

Note: For home.tsx, the ThemeToggle is inside the header so it needs positioning adjusted — or just keep it fixed top-right which works everywhere.

**Step 4: Verify**

Toggle works on all three pages. Theme persists across navigation.

**Step 5: Commit**

```bash
git add src/components/theme-toggle.tsx src/pages/results.tsx src/pages/more-details.tsx src/pages/home.tsx
git commit -m "feat: add theme toggle to all pages"
```

---

### Task 8: Final Polish & Verify

**Step 1: Check the chart adapts to dark mode**

In `src/components/results-chart.tsx`, the axis labels and text may need dark mode colors:

```tsx
<XAxis
  dataKey="anb"
  label={{ value: 'AGE', position: 'insideBottom', offset: -5 }}
  tick={{ fill: 'currentColor' }}
  className="text-navy dark:text-white"
/>
<YAxis
  tickFormatter={formatAxis}
  label={{ value: 'RANDS', angle: -90, position: 'insideLeft' }}
  tick={{ fill: 'currentColor' }}
  className="text-navy dark:text-white"
/>
```

Note: Recharts may not support Tailwind classes directly. If needed, use the `useTheme` hook to conditionally pass fill colors:

```tsx
const { theme } = useTheme()
const axisColor = theme === 'dark' ? '#ffffff' : '#091e35'

<XAxis tick={{ fill: axisColor }} ... />
<YAxis tick={{ fill: axisColor }} ... />
```

**Step 2: Check pie chart in more-details adapts**

Same approach for `src/components/pie-chart.tsx` — axis labels and percentage text need theme-aware colors.

**Step 3: Full walkthrough**

1. Load `/` — dark mode form, toggle to light, verify all fields
2. Fill form, submit — results page with summary bar, chart, buttons
3. Toggle theme on results — verify everything adapts
4. Click "More Details" — verify page, tiles, chart adapt
5. Click "Edit Inputs" — form pre-filled
6. Click "Start Over" — form blank
7. Refresh page — theme persists from localStorage

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: dark mode chart axis colors and final polish"
```
