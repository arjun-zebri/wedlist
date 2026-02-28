## Product Modules

- See [DESIGN.md](./DESIGN.md) for the **complete design system** — colors, typography, spacing, shadows, components, and all visual tokens. **Read this before building any UI.**
- See [SUPER_ADMIN.md](./SUPER_ADMIN.md) for the super admin interface (`/super-admin/*`) — blog, inquiries, MC business lead CRM.
- See [CRM.md](./CRM.md) for the MC couple leads CRM (`/admin/leads/*`) — where MCs manage couple enquiries.
- See [DROPDOWNS_AND_PICKERS.md](./DROPDOWNS_AND_PICKERS.md) for custom form component specs (CustomSelect, CustomDatePicker).

---

## Core Directive

The design must visually and experientially match **Dribbble.com**.

This means: - Image-first interface - Card-dominant layout - Soft depth
and floating surfaces - Clean, confident typography - Generous
whitespace - Subtle but polished motion - Creative-tech aesthetic (not
corporate, not SaaS-template)

Do NOT interpret loosely. Match the visual density, spacing rhythm, and
interaction feel of Dribbble.com.

---

## Always Do First

- Invoke the `frontend-design` skill before writing any frontend code.
  No exceptions.
- Review `brand_assets/` before designing anything.
- Extract logo, typography, color palette, spacing, and imagery rules
  from assets if available.

If brand assets exist: - Use exact colors (HEX only). - Use exact
typography. - Use provided logo (never placeholder). - Do not invent
alternative brand styling.

If no brand system exists: - Define one intentionally before building
UI. - Establish primary, secondary, background, surface, and accent
tokens. - Create a tonal scale from the primary color.

---

## Always Load Skills

Before generating any copy:

- Load and apply the `conversion-copy` skill.

---

## Visual Architecture (Dribbble-Specific)

### Layout

- Masonry or grid-based card layout
- Tight horizontal rhythm
- Consistent vertical spacing
- Max-width container centered
- Strong use of whitespace between card groups
- Minimal top navigation with clean spacing

No clutter. No heavy borders.

---

## Card System (Critical)

Cards are the core visual object.

Each card must: - Have rounded corners (2xl or larger) - Use layered
shadows (not flat Tailwind) - Lift slightly on hover (translateY only) -
Increase shadow intensity on hover - Contain image-first layout -
Maintain consistent aspect ratio

Hover behavior: - Slight scale (1.01--1.03 max) - Subtle upward
translate (-2px to -4px) - Shadow deepens - Only animate transform +
opacity - Never use `transition-all`

---

## Color Rules

- Never use Tailwind default blue, indigo, or generic palette.
- Never use flat gray backgrounds.

Instead: - Use tinted backgrounds derived from brand primary. - Layer
soft radial gradients in background. - Use subtle color temperature
shifts across sections. - Maintain visual calm --- avoid high contrast
unless intentional.

---

## Shadows & Depth

Never use: - shadow-sm - shadow-md - Generic single-layer shadows

Instead: Use layered shadows: - Ambient layer (large blur, low
opacity) - Directional layer (smaller blur, higher opacity) - Optional
brand tint in shadow color

Depth hierarchy: 1. Base background 2. Elevated surfaces (cards) 3.
Floating UI (dropdowns, modals)

Everything must not sit on same z-plane.

---

## Typography

Never use same font for headings and body.

Use: - Display or expressive font for headings - Clean modern sans-serif
for body

Headings: - Tight tracking (-0.03em) - Bold or semi-bold - Strong
hierarchy difference

Body: - Line-height 1.7 - Slightly muted text color - No pure black
(#000000)

Typography must feel editorial, not default.

---

## Imagery

Images are dominant.

Every image must: - Have gradient overlay (bg-gradient-to-t
from-black/60) - Include subtle brand color blend layer
(mix-blend-multiply) - Slight hover zoom (transform only) - Maintain
consistent aspect ratio - Use soft rounded corners

Never use unstyled raw images.

---

## Motion Rules

Allowed animations: - transform - opacity

Not allowed: - transition-all - Animating width/height/margin/padding -
Overly dramatic easing

Use: - Spring-style easing - Fast-in, natural-out timing -
Micro-interactions only

Motion must feel polished but restrained.

---

## Interactive States

Every clickable element must include: - Hover - Focus-visible - Active

Buttons: - Slight lift on hover - Slight press-in on active - Clear but
subtle focus ring using brand color

Cards: - Elevation increase - Shadow enhancement - Slight translate
upward

No dead interactions.

---

## Spacing System

Define spacing scale before building: Example: 4 / 8 / 12 / 20 / 32 / 48
/ 72 / 96

Use consistent vertical rhythm. Avoid random Tailwind spacing values.
Whitespace must feel intentional.

---

## Hard Constraints

- Do not add sections not in the reference.
- Do not redesign structure.
- Do not simplify layout.
- Do not flatten depth.
- Do not make it look like a generic SaaS template.
- Do not stop after first visual pass.
- Do not use Tailwind default primary colors.

---

## Final Verification Checklist

Before delivering:

- Does it feel image-first?
- Does it feel curated?
- Is depth layered?
- Are cards the dominant visual system?
- Is whitespace intentional?
- Does it resemble Dribbble.com at a glance?

If not, refine until it does.
