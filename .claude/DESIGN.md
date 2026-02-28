# WedList Design System

> The single source of truth for all visual design decisions across the WedList platform.
> Every new feature, page, or component MUST reference this file before implementation.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Border Radius](#border-radius)
6. [Shadows & Depth](#shadows--depth)
7. [Borders](#borders)
8. [Z-Index Scale](#z-index-scale)
9. [Transitions & Motion](#transitions--motion)
10. [Buttons](#buttons)
11. [Cards](#cards)
12. [Form Elements](#form-elements)
13. [Badges & Status Pills](#badges--status-pills)
14. [Tables](#tables)
15. [Modals & Overlays](#modals--overlays)
16. [Navigation & Headers](#navigation--headers)
17. [Pagination](#pagination)
18. [Images & Media](#images--media)
19. [Icons](#icons)
20. [Responsive Breakpoints](#responsive-breakpoints)
21. [Accessibility](#accessibility)
22. [CSS Component Classes](#css-component-classes)
23. [Animation Keyframes](#animation-keyframes)
24. [Page-Specific Patterns](#page-specific-patterns)
25. [Anti-Patterns](#anti-patterns)

---

## Design Philosophy

**Aesthetic**: Minimalistic-but-magical. Dribbble-inspired with strategic rose accent.

**Core principles**:
- **Image-first** — photos and visuals are the primary content, never an afterthought
- **Card-dominant** — cards are the core visual object across all surfaces
- **Soft depth** — layered rose-tinted shadows create floating surfaces, never flat
- **Clean typography** — Playfair Display for headings, Inter for body; editorial feel
- **Generous whitespace** — intentional breathing room, never cramped
- **Restrained motion** — micro-interactions only; polished but not theatrical
- **Creative-tech aesthetic** — not corporate, not SaaS-template, not generic

**Do NOT**:
- Use Tailwind default blue, indigo, or generic palette colors
- Use flat gray backgrounds without tinting
- Use `transition-all` anywhere
- Use `shadow-sm`, `shadow-md`, or generic single-layer Tailwind shadows
- Add heavy borders to cards (use shadow-based elevation instead)
- Animate width, height, margin, or padding
- Make it look like a generic SaaS template

---

## Color System

All colors are defined as CSS custom properties in `app/globals.css` using HSL format.

### Brand Colors

| Token | HSL | HEX | Usage |
|-------|-----|-----|-------|
| `--color-accent` | `347 77% 50%` | `#E31C5F` | Primary CTAs, highlights, active states, stars, focus rings |
| `--color-accent-hover` | `347 77% 45%` | `#C4184F` | Hover state for accent elements |
| `--color-accent-light` | `347 77% 97%` | ~`#FEF1F5` | Very light backgrounds, subtle tints |

### Primary (Dark/Neutral)

| Token | HSL | HEX | Usage |
|-------|-----|-----|-------|
| `--color-primary` | `0 0% 9%` | `#171717` | Near-black for text, dark buttons |
| `--color-primary-hover` | `0 0% 0%` | `#000000` | Hover state for primary |
| `--color-primary-light` | `0 0% 20%` | `#333333` | Secondary dark usage |

### Neutral Gray Scale

| Token | HSL | HEX | Usage |
|-------|-----|-----|-------|
| `--color-gray-50` | `0 0% 98%` | `#FAFAFA` | Lightest background |
| `--color-gray-100` | `0 0% 96%` | `#F5F5F5` | Card backgrounds, hover states |
| `--color-gray-200` | `0 0% 90%` | `#E5E5E5` | Borders, dividers |
| `--color-gray-300` | `0 0% 83%` | `#D4D4D4` | Disabled states, input borders |
| `--color-gray-400` | `0 0% 64%` | `#A3A3A3` | Placeholder text |
| `--color-gray-500` | `0 0% 45%` | `#737373` | Secondary text, muted labels |
| `--color-gray-600` | `0 0% 32%` | `#525252` | Body text |
| `--color-gray-700` | `0 0% 25%` | `#404040` | Headings, primary text |
| `--color-gray-800` | `0 0% 15%` | `#262626` | Dark text |
| `--color-gray-900` | `0 0% 9%` | `#171717` | Darkest text |

### Semantic Colors

| Token | HSL | HEX | Usage |
|-------|-----|-----|-------|
| `--color-success` | `142 71% 45%` | `#22C55E` | Completed, verified, active |
| `--color-success-light` | `142 71% 96%` | — | Light green backgrounds |
| `--color-error` | `0 84% 60%` | `#EF4444` | Errors, destructive actions |
| `--color-error-light` | `0 84% 97%` | — | Light red backgrounds |
| `--color-warning` | `38 92% 50%` | `#F59E0B` | In-progress, warnings |
| `--color-warning-light` | `38 92% 96%` | — | Light orange backgrounds |
| `--color-info` | `217 91% 60%` | `#3B82F6` | Informational |
| `--color-info-light` | `217 91% 97%` | — | Light blue backgrounds |

### Hardcoded Color Values Used in Components

These are commonly used inline across the codebase and should be treated as canonical:

```
Rose accent:      #E31C5F  (brand primary)
Rose hover:       #C4184F  (darker shade)
Rose shadow:      rgba(227,28,95, ...)  (shadow tinting)
Required marker:  text-[#E31C5F]  (asterisk on form labels)
```

### Status-Specific Color Combinations

**MC Pipeline Stages:**
| Stage | Background | Text |
|-------|-----------|------|
| Prospect | `bg-gray-100` | `text-gray-700` |
| Trial | `bg-blue-100` | `text-blue-700` |
| Listed | `bg-amber-100` | `text-amber-700` |
| Active | `bg-green-100` | `text-green-700` |
| Churned | `bg-red-100` | `text-red-700` |

**Listing Status:**
| Status | Background | Text |
|--------|-----------|------|
| Free | `bg-gray-50` | `text-gray-600` |
| Trial | `bg-blue-50` | `text-blue-600` |
| Paid | `bg-green-50` | `text-green-600` |
| Expired | `bg-red-50` | `text-red-600` |

**Inquiry Status:**
| Status | Background | Text |
|--------|-----------|------|
| New | `bg-gray-100` | `text-gray-700` |
| Contacted | `bg-blue-100` | `text-blue-700` |
| Qualified | `bg-green-100` | `text-green-700` |
| Lost | `bg-red-100` | `text-red-700` |
| Closed | `bg-gray-200` | `text-gray-700` |

### Gradient Patterns

```css
/* Page-level background */
bg-gradient-to-br from-white via-white to-rose-50/30

/* Floating background orbs (decorative) */
bg-gradient-to-br from-[#E31C5F]/15 to-pink-200/10   /* Rose orb */
bg-gradient-to-tr from-purple-100/12 to-blue-100/8    /* Purple orb */
bg-gradient-to-br from-cyan-100/8 to-blue-100/5       /* Cyan orb */

/* Detail page hero */
bg-gradient-to-br from-white via-white to-rose-50/30 border border-rose-100/50
```

---

## Typography

### Font Families

Loaded in `app/layout.tsx` via `next/font/google`:

| Family | CSS Variable | Tailwind Class | Usage |
|--------|-------------|----------------|-------|
| **Playfair Display** (400-700) | `--font-display` | `font-display` | All h1, h2, h3 headings |
| **Inter** (variable) | `--font-inter` | `font-sans` | Body text, UI labels, forms |
| System monospace | `--font-mono` | `font-mono` | Code blocks, markdown editors |

### Type Scale

| Token | Size | Px | Usage |
|-------|------|-----|-------|
| `text-xs` | 0.75rem | 12px | Metadata, timestamps, tiny labels |
| `text-sm` | 0.875rem | 14px | Secondary labels, table cells, form inputs |
| `text-base` | 1rem | 16px | Body text (default) |
| `text-lg` | 1.125rem | 18px | Subheadings, card titles |
| `text-xl` | 1.25rem | 20px | Section subheadings |
| `text-2xl` | 1.5rem | 24px | Section headers |
| `text-3xl` | 1.875rem | 30px | Large headings |
| `text-4xl` | 2.25rem | 36px | Page titles, super-admin headings |
| `text-5xl` | 3rem | 48px | Hero titles |
| `text-6xl` | 3.75rem | 60px | Display text (landing page hero) |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `font-normal` | 400 | Body text, descriptions |
| `font-medium` | 500 | Labels, nav items, button text |
| `font-semibold` | 600 | Section headers, card titles, headings |
| `font-bold` | 700 | Page titles, hero headings, strong emphasis |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `leading-tight` | 1.25 | Headings, compact titles |
| `leading-snug` | 1.375 | Subheadings |
| `leading-normal` | 1.5 | Body text (default) |
| `leading-relaxed` | 1.625 | Long-form reading, descriptions |
| `leading-loose` | 2.0 | Spacious paragraphs (rare) |

### Heading Conventions

| Element | Size | Weight | Font | Color | Extra |
|---------|------|--------|------|-------|-------|
| h1 (page title) | `text-4xl` | `font-bold` | `font-display` | `text-gray-900` | `tracking-tight` |
| h2 (section) | `text-3xl` | `font-bold` | `font-display` | `text-gray-900` | — |
| h3 (subsection) | `text-2xl` | `font-semibold` | `font-display` | `text-gray-900` | — |
| h4 (card title) | `text-lg` | `font-semibold` | — | `text-gray-900` | — |
| Body | `text-sm`/`text-base` | `font-normal` | — | `text-gray-600`/`text-gray-700` | `leading-relaxed` |
| Label | `text-sm` | `font-medium` | — | `text-gray-700` | `mb-1.5` below |
| Caption | `text-xs` | `font-medium` | — | `text-gray-500` | — |

---

## Spacing & Layout

### Spacing Scale (4px/8px grid)

| Token | Value | Px |
|-------|-------|----|
| `--spacing-1` | 0.25rem | 4px |
| `--spacing-2` | 0.5rem | 8px |
| `--spacing-3` | 0.75rem | 12px |
| `--spacing-4` | 1rem | 16px |
| `--spacing-5` | 1.25rem | 20px |
| `--spacing-6` | 1.5rem | 24px |
| `--spacing-8` | 2rem | 32px |
| `--spacing-10` | 2.5rem | 40px |
| `--spacing-12` | 3rem | 48px |
| `--spacing-16` | 4rem | 64px |
| `--spacing-20` | 5rem | 80px |
| `--spacing-24` | 6rem | 96px |
| `--spacing-32` | 8rem | 128px |

### Section Padding

| Size | Value | Usage |
|------|-------|-------|
| Small | `py-12` (48px) | Compact sections |
| Medium | `py-16`–`py-20` (64–80px) | Standard sections |
| Large | `py-24` (96px) | Major landing page sections |
| XL | `py-32` (128px) | Hero sections |

### Container Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--container-xl` | 1120px | Standard content (Airbnb-style narrower) |
| `max-w-7xl` | 1280px | Wide layouts |
| `max-w-[1400px]` | 1400px | Full-width directory page |
| `max-w-[1760px]` | 1760px | MC directory grid |
| `max-w-4xl` | 896px | Forms, detail pages |
| `max-w-3xl` | 768px | Narrow content, testimonials |

### Horizontal Padding (Responsive)

```
px-4 sm:px-6 lg:px-8
```

### Common Layout Patterns

**Page container (super-admin):**
```
space-y-6
p-4 sm:p-6 lg:p-8 pb-8 sm:pb-12 lg:pb-16
```

**Two-column layout:**
```
grid grid-cols-1 lg:grid-cols-2 gap-6    /* or gap-8 */
```

**Three-column grid:**
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
```

**Four-column grid (directory):**
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 2xl:gap-8
```

**Sidebar layout (super-admin):**
```
Sidebar: lg:w-64 fixed left, bg-white border-r border-gray-200
Content: lg:pl-64 (offset)
```

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px / `rounded-md` | Small elements, tooltips |
| `--radius-md` | 8px / `rounded-lg` | Buttons, small cards, nav items, badges |
| `--radius-lg` | 12px / `rounded-xl` | Inputs, form fields, icon containers, MC cards |
| `--radius-xl` | 16px / `rounded-2xl` | Feature cards, modals, hero cards, super-admin cards |
| `--radius-full` | 9999px / `rounded-full` | Pills, badges, search bar, avatar, circular buttons |

### Convention by Component

| Component | Radius |
|-----------|--------|
| Cards (standard) | `rounded-2xl` |
| Cards (compact/MC) | `rounded-xl` |
| Inputs & selects | `rounded-xl` |
| Buttons (standard) | `rounded-xl` |
| Buttons (pill-style) | `rounded-full` |
| Badges/status pills | `rounded-full` |
| Modals/dialogs | `rounded-2xl` |
| Nav items | `rounded-xl` |
| Icons in containers | `rounded-lg` or `rounded-xl` |
| Avatars | `rounded-full` |
| Image thumbnails | `rounded-xl` or `rounded-2xl` |

---

## Shadows & Depth

**All card/component shadows use rose-tinted `rgba(227,28,95,...)` for brand consistency.**
Never use generic Tailwind `shadow-sm`, `shadow-md`, etc. on cards.

### Shadow Scale

| Name | Value | Usage |
|------|-------|-------|
| **Subtle** | `0 1px 2px rgba(227,28,95,0.06)` | MC cards default, compact KPI cards |
| **Default** | `0 2px 8px rgba(227,28,95,0.08)` | Standard card rest state, form sections |
| **Elevated** | `0 4px 12px rgba(227,28,95,0.12)` | Hover state (lighter variant) |
| **Hover** | `0 6px 16px rgba(227,28,95,0.12)` | Card hover, primary hover state |
| **Strong** | `0 6px 16px rgba(227,28,95,0.15)` | Active hover, enhanced state |
| **Dropdown** | `0 4px 20px rgba(227,28,95,0.15)` | Dropdowns, popovers, calendar popups |
| **Prominent** | `0 8px 24px rgba(227,28,95,0.12)` | Review cards hover, featured items |
| **Drag** | `0 6px 20px rgba(227,28,95,0.25)` | Drag overlay (DnD) |
| **Button** | `0 2px 8px rgba(227,28,95,0.25)` | Primary CTA buttons |
| **Hero** | `0 2px 12px rgba(227,28,95,0.12)` | Detail page header cards |
| **Login** | `0 8px 32px rgba(227,28,95,0.08)` | Login form container |

### Depth Hierarchy

1. **Base background** — page level (`bg-white` or `bg-gray-50`)
2. **Elevated surfaces** — cards, panels (rose-tinted shadow)
3. **Floating UI** — dropdowns, modals, popovers (stronger shadow + higher z-index)

### CSS Variable Shadows (for non-card use)

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-lg: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

---

## Borders

| Usage | Style |
|-------|-------|
| Standard card border | `border border-gray-100` |
| Input border | `border border-gray-300` |
| Divider | `border-t border-gray-200` or `border-b border-gray-200` |
| Table row | `border-b border-gray-100` |
| Dropdown border | `border border-gray-200` |
| Detail hero card | `border border-rose-100/50` |
| Strong/emphasized | `border-2` |
| Dashed (empty state) | `border-2 border-dashed border-gray-200` |
| Sidebar separator | `border-r border-gray-200` |

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default content |
| `z-10` | 10 | Button/interactive overlays |
| `z-40` | 40 | Sticky headers (mobile top bar) |
| `--z-dropdown` | 1000 | Basic dropdowns |
| `--z-sticky` | 1100 | Sticky filter bar, dropdowns in context |
| `--z-fixed` | 1200 | Fixed position elements |
| `--z-modal-backdrop` | 1300 | Modal backdrops |
| `--z-modal` | 1400 | Modal content |
| `--z-popover` | 1500 | Popovers |
| `--z-tooltip` | 1600 | Tooltips |

---

## Transitions & Motion

### Timing

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--transition-fast` | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Button feedback, option hover |
| `--transition-base` | 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions, color shifts |
| `--transition-slow` | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Card hover, entrance animations |

### Allowed Properties

Only animate these CSS properties:
- `transform` (translateY, scale, rotate)
- `opacity`
- `color` / `background-color` (via `transition-colors`)
- `box-shadow` (via `transition-shadow` or combined)

### Forbidden

- `transition-all` — never use
- Animating `width`, `height`, `margin`, `padding` — causes layout thrashing
- Overly dramatic easing or long durations

### Hover Patterns

**Card hover:**
```
hover:-translate-y-1
hover:shadow-[0_6px_16px_rgba(227,28,95,0.12)]
transition-[transform,box-shadow] duration-300
```

**Text color hover:**
```
text-gray-900 hover:text-[#E31C5F] transition-colors duration-200
```

**Background hover:**
```
hover:bg-gray-50 transition-colors duration-200
```

**Button icon shift:**
```
group-hover:translate-x-0.5 transition-transform duration-200
```

**Image zoom (inside card):**
```
group-hover:scale-105 transition-transform duration-500
```

**Chevron rotation (dropdowns):**
```
transition-transform duration-200
style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
```

---

## Buttons

### Primary CTA (Rose)

```html
<button class="
  bg-[#E31C5F] text-white font-semibold rounded-xl
  px-6 py-3
  hover:bg-[#C4184F]
  shadow-[0_2px_8px_rgba(227,28,95,0.25)]
  transition-colors duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
">
```

### Primary (Dark)

```html
<button class="btn btn-primary">
<!-- bg-gray-900 text-white hover:bg-black -->
```

### Secondary (Outlined)

```html
<button class="
  border border-gray-300 text-gray-700 font-semibold rounded-xl
  px-6 py-3
  hover:bg-gray-50
  transition-colors duration-200
">
```

### Ghost (Minimal)

```html
<button class="
  p-2 text-gray-600
  hover:bg-gray-100 rounded-lg
  transition-colors duration-200
">
```

### Pill Filter

```html
<!-- Inactive -->
<button class="
  px-4 py-2.5 rounded-full border border-gray-300
  bg-white text-gray-700 text-sm font-medium
  hover:border-gray-900
  transition-all duration-200
">

<!-- Active -->
<button class="
  px-4 py-2.5 rounded-full border border-gray-900
  bg-gray-900 text-white text-sm font-medium
">
```

### Destructive

```html
<button class="
  p-3 text-red-600
  hover:bg-red-50 rounded-lg
  transition-colors duration-200
">
```

### Icon-Only (Revealed on hover)

```html
<button class="
  p-1 rounded-lg
  hover:bg-gray-100
  opacity-0 group-hover:opacity-100
  transition-opacity duration-200
">
```

### Size Scale

| Size | Padding | Text | Height |
|------|---------|------|--------|
| Small | `px-3 py-1.5` | `text-xs` | ~28px |
| Default | `px-4 py-2.5` | `text-sm` | ~36px |
| Large | `px-6 py-3` | `text-base` | ~44px |
| XL | `px-8 py-3` | `text-base` | ~44px (wider) |

---

## Cards

### Standard Card (Super-Admin)

```html
<div class="
  rounded-2xl bg-white p-6
  shadow-[0_2px_8px_rgba(227,28,95,0.08)]
  border border-gray-100
">
```

### Interactive Card (with hover lift)

```html
<div class="
  rounded-2xl bg-white p-6
  shadow-[0_2px_8px_rgba(227,28,95,0.08)]
  hover:shadow-[0_6px_16px_rgba(227,28,95,0.15)]
  hover:-translate-y-1
  transition-[transform,box-shadow] duration-300
  border border-gray-100
  group cursor-pointer
">
```

### MC Card (Directory)

```html
<div class="
  rounded-xl bg-white
  border border-gray-300
  shadow-[0_1px_2px_rgba(227,28,95,0.06)]
  hover:shadow-[0_6px_16px_rgba(227,28,95,0.12)]
  hover:-translate-y-1
  transition-[transform,box-shadow] duration-300
  group cursor-pointer
">
  <!-- Image: aspect-[4/3] rounded-t-xl -->
  <!-- Content: p-5 -->
```

### Compact KPI Card

```html
<div class="
  rounded-lg bg-white p-3
  shadow-[0_1px_2px_rgba(227,28,95,0.08)]
  border border-gray-100
  flex items-center justify-between
">
```

### Hero/Gradient Card

```html
<div class="
  bg-gradient-to-br from-white via-white to-rose-50/30
  rounded-2xl p-8
  shadow-[0_2px_12px_rgba(227,28,95,0.12)]
  border border-rose-100/50
">
```

### Review Card

```html
<div class="
  rounded-xl border border-gray-200 bg-white p-7
  hover:-translate-y-1
  hover:shadow-[0_8px_24px_rgba(227,28,95,0.12)]
  transition-[transform,box-shadow] duration-300
">
```

### Pricing Card (Pro/Featured)

```html
<div class="
  rounded-2xl bg-white p-6 sm:p-8
  border-2 border-[#E31C5F]
  shadow-[0_4px_16px_rgba(227,28,95,0.12)]
  relative
">
  <!-- Badge: absolute -top-3.5 left-1/2 -translate-x-1/2 -->
```

---

## Form Elements

### Text Input

```html
<input class="
  w-full rounded-xl border border-gray-300
  bg-white px-4 py-2.5 text-sm
  shadow-sm
  transition-colors duration-200
  hover:shadow-[0_2px_12px_rgba(227,28,95,0.1)]
  focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20
  disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
" />
```

### Textarea

Same as input, plus:
```
resize-none font-mono  (for content editors)
rows={4}  (default)
```

### Label

```html
<label class="block text-sm font-medium text-gray-700 mb-1.5">
  Field Name
  <span class="text-[#E31C5F]">*</span>  <!-- if required -->
</label>
```

### Search Input

```html
<div class="relative">
  <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  <input class="
    w-full pl-10 pr-4 py-2.5 rounded-xl
    border border-gray-200
    focus:border-gray-900 focus:ring-1 focus:ring-gray-900
    text-sm
  " />
</div>
```

### Custom Select (Dropdown)

- Trigger: `rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm`
- Focus: `focus:border-[#E31C5F] focus:ring-2 focus:ring-[#E31C5F]/20`
- Dropdown panel: `rounded-xl border border-gray-200 shadow-[0_4px_20px_rgba(227,28,95,0.15)] z-[1100]`
- Selected item: `bg-[#E31C5F]/8 text-[#E31C5F] font-medium`
- Hover item: `text-gray-700 hover:bg-gray-50`
- Animation: `animate-in fade-in slide-in-from-top-1`

### Custom Date Picker

- Input: same as text input with `pl-10` for calendar icon
- Calendar popup: `rounded-xl border border-gray-200 shadow-[0_4px_20px_rgba(227,28,95,0.15)] z-[1100] p-4`
- Selected day: `bg-[#E31C5F] text-white shadow-[0_2px_8px_rgba(227,28,95,0.3)]`
- Today: `bg-gray-100 text-gray-900 border border-gray-300`
- Day cells: `aspect-square rounded-lg text-sm font-medium`

---

## Badges & Status Pills

### Standard Badge

```html
<span class="
  inline-flex items-center
  rounded-full px-2.5 py-0.5
  text-xs font-medium
  bg-{color}-100 text-{color}-700
">
```

### Badge with Dot Indicator

```html
<span class="
  inline-flex items-center gap-2
  rounded-full border border-gray-200 bg-gray-50/80
  px-4 py-2
  text-xs font-semibold text-gray-700
">
  <span class="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></span>
  Label
</span>
```

### New Indicator Badge

```html
<span class="
  inline-flex items-center gap-1.5 px-3 py-1
  rounded-full text-xs font-semibold
  bg-[#E31C5F]/10 text-[#E31C5F]
  ring-1 ring-[#E31C5F]/20
">
```

### Featured Badge

```html
<span class="rounded-full bg-[#E31C5F] px-3 py-1 text-xs font-medium text-white">
```

---

## Tables

### Header Row

```html
<thead>
  <tr class="border-b border-gray-200 bg-gray-50/50">
    <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
```

### Body Row

```html
<tr class="
  border-b border-gray-100
  hover:bg-rose-50/30
  cursor-pointer transition-colors
  group
">
  <td class="py-3.5 px-4">
```

### Cell Styling

| Type | Classes |
|------|---------|
| Primary text | `font-medium text-gray-900 group-hover:text-[#E31C5F] transition-colors` |
| Secondary text | `text-sm text-gray-600` |
| Right-aligned number | `text-right text-sm font-semibold` |
| Metadata | `text-xs text-gray-500` |

---

## Modals & Overlays

### Modal Backdrop

```html
<div class="fixed inset-0 z-[1300] overflow-y-auto">
  <div class="fixed inset-0 bg-black/50 transition-opacity" />
```

### Modal Content

```html
<div class="
  relative bg-white rounded-2xl
  shadow-2xl max-w-md w-full
  p-6 space-y-6
">
```

### Modal Header

```html
<div class="flex items-center justify-between border-b pb-4">
  <h3 class="text-lg font-semibold text-gray-900">{title}</h3>
  <button class="text-gray-400 hover:text-gray-600">
    <X class="h-5 w-5" />
  </button>
</div>
```

### Modal Footer

```html
<div class="flex gap-3 pt-4 border-t">
  <button class="flex-1 ... border border-gray-300 ... text-gray-700 hover:bg-gray-50">Cancel</button>
  <button class="flex-1 ... bg-gray-900 ... text-white hover:bg-gray-800">Apply</button>
</div>
```

### Login Form Container

```html
<div class="
  rounded-2xl bg-white p-8 sm:p-10
  shadow-[0_8px_32px_rgba(227,28,95,0.08)]
  border border-gray-200
  max-w-md w-full
">
```

---

## Navigation & Headers

### Main Header (Public Pages)

```html
<header class="border-b border-gray-200 bg-white">
  <div class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 h-16 flex items-center">
```

### Filter Bar (Sticky)

```html
<div class="
  sticky top-0 z-[1100]
  bg-white/95 backdrop-blur-md
  border-b border-gray-200
  shadow-[0_1px_3px_rgba(0,0,0,0.05)]
">
```

### Super-Admin Sidebar

```html
<aside class="
  lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0
  bg-white border-r border-gray-200
  shadow-[1px_0_8px_rgba(0,0,0,0.03)]
">
```

**Sidebar Logo:**
```html
<div class="w-8 h-8 rounded-lg bg-[#E31C5F] flex items-center justify-center">
  <!-- W icon -->
</div>
```

**Sidebar Nav Item:**
```html
<!-- Inactive -->
<a class="
  flex items-center gap-3 px-3.5 py-2.5 rounded-xl
  text-sm font-medium text-gray-600
  hover:bg-gray-50 hover:text-gray-900
  transition-colors
">
  <Icon class="h-[18px] w-[18px] text-gray-400" />

<!-- Active -->
<a class="... bg-gray-50 text-gray-900 font-medium">
```

### Mobile Top Bar

```html
<div class="
  sticky top-0 z-40
  flex items-center h-16 px-4
  border-b border-gray-100
  bg-white/95 backdrop-blur-md
  lg:hidden
">
```

### Breadcrumbs

```html
<nav class="flex items-center gap-1.5 text-sm">
  <a class="text-gray-500 hover:text-gray-900 transition-colors">Parent</a>
  <ChevronRight class="w-4 h-4 text-gray-400" />
  <span class="text-gray-900 font-medium">Current</span>
</nav>
```

---

## Pagination

### Container

```html
<div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-12">
```

### Results Count

```html
<p class="text-sm text-gray-600">Showing 1 – 20 of 85 results</p>
```

### Page Button (Current)

```html
<button class="px-4 py-2 rounded-lg border border-gray-900 bg-gray-900 text-white text-sm font-medium">
```

### Page Button (Other)

```html
<button class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-900">
```

### Prev/Next Button

```html
<button class="p-2 rounded-lg border border-gray-300 text-gray-700 hover:border-gray-900 transition-all">
  <ChevronLeft class="h-5 w-5" />
</button>
<!-- Disabled: border-gray-200 text-gray-300 cursor-not-allowed -->
```

---

## Images & Media

### Cover/Hero Images

- Aspect ratio: `aspect-[16/9]` or `aspect-[4/3]`
- Object fit: `object-cover`
- Corners: `rounded-2xl` or `rounded-xl`
- Fallback gradient: `bg-gradient-to-br from-rose-50 via-gray-50 to-gray-100`

### MC Profile Images

- Aspect: `aspect-[4/3]`
- Corners: `rounded-t-xl` (top of card)
- Hover zoom: `group-hover:scale-105 transition-transform duration-500`

### Avatars

- Size: `w-9 h-9` or `w-10 h-10`
- Shape: `rounded-full`
- Background: `bg-rose-50 text-[#E31C5F]` (initials fallback)

### Video Embeds

```html
<div class="
  aspect-video bg-gray-900 rounded-2xl
  border border-gray-200
  shadow-[0_2px_8px_rgba(227,28,95,0.04)]
  hover:shadow-[0_8px_24px_rgba(227,28,95,0.08)]
  overflow-hidden
">
```

### Image Treatment Rules

- Always use `next/image` for optimization and lazy loading
- Always define explicit aspect ratios to prevent CLS
- Always round corners — never use raw/unstyled images
- Use gradient overlays when text appears over images:
  ```
  bg-gradient-to-t from-black/60 via-transparent to-transparent
  ```

---

## Icons

### Library

**lucide-react** — used exclusively across the entire application.

### Common Icons by Context

**Navigation:**
`LayoutDashboard`, `BarChart3`, `MessageSquare`, `FileText`, `LogOut`, `Menu`, `X`

**Actions:**
`Plus`, `Trash2`, `Pencil`, `ArrowLeft`, `ArrowRight`, `ExternalLink`, `Save`, `Download`, `Upload`

**Status:**
`CheckCircle2`, `AlertCircle`, `Clock`, `Calendar`, `Check`, `Lock`

**Content:**
`Users`, `MapPin`, `DollarSign`, `Sparkles`, `Heart`, `Star`, `Search`, `Mail`, `Phone`, `Building2`, `Link2`

**UI Controls:**
`ChevronDown`, `ChevronLeft`, `ChevronRight`, `MoreHorizontal`, `GripVertical`, `LayoutGrid`, `List`

### Size Scale

| Size | Classes | Usage |
|------|---------|-------|
| Tiny | `w-3.5 h-3.5` | Inline with small text |
| Small | `w-4 h-4` | Input icons, label icons, inline actions |
| Default | `w-5 h-5` | Buttons, nav items, standalone actions |
| Medium | `w-6 h-6` | Section icons, card icons |
| Large | `w-8 h-8` | Empty state icons |
| XL | `w-12 h-12` | Feature icons, hero elements |

### Icon Colors

| Context | Color |
|---------|-------|
| Brand accent | `text-[#E31C5F]` |
| Navigation (inactive) | `text-gray-400` |
| Secondary | `text-gray-600` |
| Default | `text-gray-700` |
| Success | `text-green-600` |
| Warning | `text-amber-600` |
| Danger | `text-red-600` |
| Stars/ratings | `fill-[#E31C5F] text-[#E31C5F]` |

---

## Responsive Breakpoints

| Prefix | Width | Usage |
|--------|-------|-------|
| (none) | 0+ | Mobile-first base |
| `sm:` | 640px | Mobile landscape |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop (sidebar visible) |
| `xl:` | 1280px | Wide desktop |
| `2xl:` | 1536px | Ultra-wide |

### Common Responsive Patterns

```
/* Grid columns */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Layout direction */
flex-col lg:flex-row

/* Sidebar visibility */
hidden lg:flex  (sidebar)
lg:hidden       (hamburger menu)

/* Padding */
p-4 sm:p-6 lg:p-8

/* Typography scaling */
text-3xl sm:text-4xl lg:text-5xl

/* Visibility toggles */
hidden md:block
md:hidden
```

---

## Accessibility

### Focus States

All interactive elements must have visible focus:

```
focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20 focus:border-[#E31C5F]
```

For non-form elements:
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E31C5F] focus-visible:ring-offset-2
```

### Disabled States

```
disabled:opacity-50 disabled:cursor-not-allowed
disabled:bg-gray-50 disabled:text-gray-400  (inputs)
```

### Keyboard Navigation

- All dropdowns: Arrow Up/Down to navigate, Enter to select, Escape to close
- Modals: Escape to close, focus trapped inside
- Accordions: Enter/Space to toggle
- Lightbox: Arrow keys to navigate, Escape to close

### Semantic HTML

- `<header>`, `<nav>`, `<main>`, `<footer>` for landmarks
- Proper heading hierarchy (h1 > h2 > h3)
- `<button>` for actions, `<a>` for navigation
- `<label>` with `htmlFor` for all form inputs
- `aria-label` on icon-only buttons

### Color Contrast

- Text on white: minimum gray-600 (#525252) for body, gray-700 (#404040) for headings — WCAG AA compliant
- Text on rose (#E31C5F): white only
- Never use pure black (#000000) for body text

---

## CSS Component Classes

These utility classes are defined in `app/globals.css` and available globally:

### Buttons
- `.btn` — base button (inline-flex, font-medium, rounded-lg, focus ring)
- `.btn-primary` — dark primary (gray-900 bg)
- `.btn-accent` — rose accent (#E31C5F bg)
- `.btn-secondary` — white bg, gray border
- `.btn-ghost` — transparent, gray text
- `.btn-sm` — small size
- `.btn-lg` — large size

### Forms
- `.input` — standard text input
- `.textarea` — textarea (extends `.input`)
- `.select` — native select (extends `.input` + custom arrow)
- `.label` — form label
- `.checkbox` — styled checkbox

### Cards
- `.card` — base card (white bg, border, rounded-xl)
- `.card-hover` — with hover border change
- `.card-interactive` — with hover lift + border change

### Badges
- `.badge` — base badge (rounded-full, px-2.5 py-0.5, text-xs)
- `.badge-success` / `.badge-error` / `.badge-warning` / `.badge-info` / `.badge-neutral`

### Ratings
- `.rating` — container
- `.rating-number` / `.rating-star` / `.rating-count`

### Layout
- `.section` / `.section-sm` / `.section-md` / `.section-lg`
- `.container` — centered max-width
- `.divider` — horizontal line
- `.header` — sticky nav bar

### Links
- `.link` — gray text with hover
- `.link-accent` — rose text with hover

### Utilities
- `.text-balance` — balanced text wrapping
- `.scroll-smooth` — smooth scroll behavior
- `.focus-visible-ring` — standard focus ring
- `.hide-scrollbar` — hidden scrollbars with scroll functionality
- `.animate-fade-in` / `.animate-fade-in-up` / `.animate-fadeInUp`
- `.animate-float` / `.animate-drift-slow` / `.animate-gradient-shift`
- `.animation-delay-100` / `.animation-delay-200` / `.animation-delay-300`

---

## Animation Keyframes

Defined in `app/globals.css`:

| Animation | Effect | Duration | Usage |
|-----------|--------|----------|-------|
| `fadeIn` | Opacity 0→1 | 0.6s ease-out | General fade |
| `fadeInUp` | Opacity + translateY(20px→0) | 0.7–0.8s | Section reveals |
| `float` | translateY(0→-20px→0) | 6s infinite | Background orbs |
| `drift` | translate(0→30px,-30px→-20px,20px) | 20s infinite | Background orbs |
| `gradientShift` | background-position shift | 8s infinite | Gradient backgrounds |

### Stagger Reveals

For lists/grids, use IntersectionObserver with staggered delays:
```
animation-delay: ${index * 150}ms
```

---

## Page-Specific Patterns

### Landing Page (`app/page.tsx`)

- Hero: white bg, gradient orbs, `font-display` heading, trust badges
- Sections alternate between white and subtle rose-50 tinted backgrounds
- Before/After comparison component with dark/light panels
- Review masonry grid (3 columns desktop, middle column offset -2.5rem)
- Pricing cards with featured/pro variant
- FAQ accordion with smooth expand/collapse

### MC Directory (`app/wedding-mc-sydney/page.tsx`)

- Sticky glassmorphic filter bar
- 4-column card grid (responsive down to 1)
- Pill-based category filters
- Heart/favorite icons on cards (localStorage persistence)
- Pagination at bottom
- Max-width: 1760px

### MC Profile (`app/mc/[slug]/page.tsx`)

- Two-column layout: content left, sticky contact card right
- Image gallery with lightbox
- Video embeds (YouTube/Vimeo)
- Package cards with modal details
- Review list with modal expansion
- Contact form integration

### Super-Admin Dashboard

- KPI cards grid (up to 5 columns)
- Quick action links with rose hover
- Recent activity list
- Pipeline overview

### Super-Admin CRM

- Kanban board with draggable columns (5 stages, 340px min-width each)
- Table view alternative
- Step indicator workflow (circles with connecting lines)

### Super-Admin Blog

- Blog post list with status badges
- Rich text editor form
- Tag management (pill-based)
- SEO fields section

### Super-Admin Inquiries

- Split view: couple inquiries + vendor inquiries
- Detail pages with timeline
- Status progression

---

## Anti-Patterns

These should **never** be used in the codebase:

| Anti-Pattern | Use Instead |
|-------------|-------------|
| `transition-all` | `transition-colors`, `transition-[transform,box-shadow]`, etc. |
| `shadow-sm`, `shadow-md` on cards | Rose-tinted custom shadows |
| Tailwind default blue/indigo | `#E31C5F` rose or gray scale |
| Flat gray backgrounds (`bg-gray-100` full-page) | White with subtle gradient accents |
| Same font for headings and body | Playfair Display (headings) + Inter (body) |
| Pure black `#000000` for text | `#171717` (gray-900) maximum |
| Animating width/height/margin/padding | Only transform + opacity |
| Heavy borders on cards | Shadow-based elevation |
| Raw/unstyled images | Always rounded, aspect-ratio defined, gradient overlay when needed |
| Generic SaaS styling | Dribbble-inspired creative-tech aesthetic |
| `z-50`, random z-index values | Use the defined z-index scale |
| Inline styles for colors | Use CSS variables or established hex values |
