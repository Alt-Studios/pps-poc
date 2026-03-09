# Form Fixes, Light/Dark Mode & Results Enhancements

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix subtle form styling inconsistencies, add light/dark mode theming using PPS brand colors, show user inputs on results page, and add restart functionality.

**Architecture:** CSS custom properties for theme switching, React context for theme state with localStorage persistence, calculator context extended with reset capability.

**Tech Stack:** Tailwind CSS v4 `@custom-variant dark`, React Context, localStorage

---

## 1. Form Styling Fixes

**Problem:** Input height (`h-8` = 32px) doesn't match R prefix/years badge heights. Border radius values are inconsistent between adjacent elements.

**Solution:**
- All input row elements use consistent `h-10` (40px)
- R prefix: `rounded-l-lg` (8px left, 0 right)
- Input after R prefix: `rounded-r-lg rounded-l-none`
- Years badge: `rounded-r-lg rounded-l-none`
- Age input before years badge: `rounded-l-lg rounded-r-none`
- Consistent `border-white/20` (dark) / `border-border-light` (light) borders
- Adjacent elements remove shared borders (`border-l-0`, `border-r-0`)

## 2. Light/Dark Mode

### Dark Mode (default)
- Page background: `navy-dark` (#081a2e)
- Card background: `navy` (#091e35)
- Header: slightly darker navy
- Inputs: `white/10` bg, `white/20` borders
- Text: white; placeholders: `white/40`
- R prefix / years badges: `white/80` bg, navy text
- Submit button: gold fill, white text

### Light Mode
- Page background: `cream-light` (#faf9f5)
- Card background: white (#ffffff)
- Header: `navy` (#091e35) — stays dark for brand presence
- Inputs: `cream` (#efeeee) bg, `border-light` (#cacaca) borders
- Text: `dark-text` (#091e35); placeholders: `muted-text` (#7d7d7d)
- R prefix / years badges: `navy` bg, white text
- Submit button: gold fill, white text (same)

### Toggle
- Sun/moon icon button in top-right of card header
- Persisted to localStorage
- Uses Tailwind `dark` variant via `.dark` class on root

### Results & More Details Pages
- Light: cream-light background, white cards (current look)
- Dark: navy-dark background, navy cards, white text, same chart colors

## 3. Input Summary Bar (Results Page)

Compact horizontal bar between headline and chart:
- Shows non-zero input values as "Label: R value" pairs with dividers
- "Edit Inputs" link on the right — navigates back pre-filled
- Light mode: cream bg, border-light border
- Dark mode: navy bg, white/20 border
- Rounded pill shape

## 4. Restart Actions

Button row on results/more-details updated:
- **"Edit Inputs"** — navigates to `/` with previous values preserved
- **"Start Over"** — clears calculator context, navigates to blank form
- **"More Details"** — unchanged on results page

Implementation: Add `reset()` to calculator context that clears `inputs` and `result`.
