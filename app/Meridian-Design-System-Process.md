# Meridian Travel — Design System Build Process

**Project:** Travel website homepage & design system
**Tools:** Claude Code + Paper (design tool) + Figma MCP
**Date:** March 2026
**Duration:** Single session

---

## Step 1: Design the Homepage in Paper

We started with a blank canvas in Paper and designed a full travel homepage from scratch.

### Design Brief
Before writing any HTML, we established a design direction:
- **Palette:** Warm off-white (#F7F5F0), near-black (#1A1714), bronze (#8B7355), gold (#C4A97D), terracotta (#D4652E)
- **Typography:** DM Serif Display for editorial display headlines, DM Sans for body/UI
- **Spacing:** 80px section gaps, 32px group gaps, 16px element gaps
- **Direction:** Warm editorial luxury — serif headlines, generous whitespace, magazine feel

### Sections Built (incrementally, one visual group at a time)
1. **Navigation bar** — Globe logo, page links (Destinations, Experiences, Journal, About), Sign in, "Book a trip" CTA
2. **Hero section** — Large serif headline, subtitle, tri-field search bar (Where/When/Guests) with terracotta search button
3. **Featured Destinations** — Section header + 3 destination cards (Santorini, Kyoto, Amalfi Coast) with gradient image placeholders, rating badges, pricing
4. **Experience Banner** — Dark full-width banner with headline, body copy, two CTAs, and stats (50+ Countries, 12k+ Travelers, 4.9 Rating)
5. **Testimonials** — Two review cards with star ratings, serif pull quotes, author avatars
6. **Footer** — Brand mark, tagline, three link columns (Explore, Company, Support), copyright bar

### Review Checkpoints
After every 2-3 modifications, we took screenshots and reviewed:
- Spacing rhythm and visual hierarchy
- Typography contrast and readability
- Card alignment and color variation
- No clipping or overflow issues

---

## Step 2: Push the Design to Figma

Using the Figma MCP server, we recreated the entire homepage in a Figma file using the Plugin API.

### Process
1. **Connected to Figma** — Authenticated via Figma MCP, verified file access
2. **Loaded fonts** — DM Sans (Regular, Medium, Bold) and DM Serif Display (Regular) loaded before any text operations
3. **Built incrementally** — Each section was a separate `use_figma` call:
   - Created the main frame (1440×2695, vertical auto-layout)
   - Nav bar with logo, links, and CTA button
   - Hero section with headline, subtitle, search bar
   - Destinations section with 3 cards (built one, duplicated for efficiency)
   - Dark experience banner with stats
   - Testimonials with 2 review cards
   - Footer with brand, link columns, copyright
4. **Verified with screenshots** — Used `get_screenshot` to confirm visual accuracy after each major section

---

## Step 3: Build the Design System in Figma

Following the `figma-generate-library` skill workflow, we built a complete design system in phases.

### Phase 0: Discovery & Planning
- Inspected the Figma file — confirmed it was empty (no existing variables, styles, or components)
- Audited the homepage design to extract all tokens
- Presented a full plan to the user for approval:
  - 4 variable collections (Primitives, Color, Spacing, Radius)
  - 16 text styles
  - 1 effect style
  - 7 components

### Phase 1: Foundations (Tokens)

**Variable Collections Created:**

| Collection | Mode(s) | Variables | Purpose |
|---|---|---|---|
| Primitives | Value | 9 colors | Raw color values, hidden from pickers |
| Color | Light | 11 semantic tokens | Purpose-driven aliases (bg, text, border, accent) |
| Spacing | Value | 11 tokens (4–80px) | Consistent spacing scale |
| Radius | Value | 5 tokens (0–100px) | Corner radius options |

**Key decisions:**
- Primitives have `scopes = []` (hidden from property pickers)
- Semantic tokens alias primitives and have specific scopes (e.g., `TEXT_FILL`, `FRAME_FILL`, `STROKE_COLOR`)
- Spacing scoped to `GAP` and `WIDTH_HEIGHT`
- Radius scoped to `CORNER_RADIUS`

**Text Styles (16 total):**
- Display: XL (72px), LG (48px), MD (40px), SM (38px), XS (22px), Quote (20px)
- Body: LG (18px), MD (16px), SM (15px), XS (14px), XXS (13px)
- Label: LG (15px Medium), MD (14px Medium), SM (13px Medium), Bold (18px Bold)
- Overline: 13px Medium, 15% letter-spacing

**Effect Style:** Shadow/Card — `0px 4px 24px rgba(0,0,0,0.06)`

### Phase 2: File Structure

Created the page skeleton:
```
Cover
Foundations
---
Button
Badge
Card
Search Bar
Nav Bar
Testimonial Card
Footer
```

- **Cover page** — Dark background with "Meridian" in DM Serif Display 80px, "Design System" subtitle, version tag
- **Foundations page** — Color swatches, typography specimens, spacing scale with visual bars

### Phase 3: Components (7 total)

Each component was built on its own page with a title, description, and the component itself.

| # | Component | Type | Variants | Key Features |
|---|---|---|---|---|
| 1 | **Button** | Component Set | 6 (Primary/Secondary/Ghost × Medium/Small) | Pill-shaped, auto-layout, terracotta/dark/outline styles |
| 2 | **Badge** | Component | 1 | Rating badge with star + score, frosted glass background |
| 3 | **Destination Card** | Component | 1 | Image area + badge + info section with name, country, details, price |
| 4 | **Search Bar** | Component | 1 | Pill-shaped with Where/When/Guests fields + terracotta search button |
| 5 | **Nav Bar** | Component | 1 | Full-width (1440px), logo + links + sign in + CTA |
| 6 | **Testimonial Card** | Component | 1 | Stars + serif quote + author row with avatar |
| 7 | **Footer** | Component | 1 | Dark bg, brand + 3 link columns + copyright bar |

**Validation:** Screenshots taken after each component to verify visual accuracy.

---

## Step 4: Extend the Color System

Added full shade scales (50–900) for brand colors and a secondary palette.

### Primary Scales (30 new variables)
| Scale | Base (500) | Range |
|---|---|---|
| Terracotta | #D4652E | 50 (#FDF2EC) → 900 (#4C240F) |
| Bronze | #8B7355 | 50 (#F7F3EE) → 900 (#332A1F) |
| Gold | #C4A97D (400) | 50 (#FAF6EF) → 900 (#433824) |

### Secondary Scales (30 new variables)
| Scale | Source | Range |
|---|---|---|
| Ocean (teal) | Santorini card imagery | 50 (#EAF4F6) → 900 (#12313E) |
| Sage (green) | Kyoto card imagery | 50 (#F0F4EC) → 900 (#2A391C) |
| Slate (cool neutral) | New complementary neutral | 50 (#F2F3F5) → 900 (#222731) |

### New Semantic Tokens (8)
- `color/secondary/ocean`, `sage`, `slate` — fill colors
- `color/text/ocean`, `color/text/sage` — text colors
- `color/bg/ocean-subtle`, `sage-subtle`, `slate-subtle` — light background tints

---

## Step 5: Master Reference Page

Created a comprehensive documentation page with all variables displayed in table format:

1. **Primitives** — 9 rows with swatch, token name, hex, RGB, usage
2. **Semantic Tokens** — 11 rows with swatch, token name, alias reference, scope, usage
3. **Spacing** — 11 tokens with visual bars showing relative size
4. **Radius** — 5 tokens with shape previews showing corner rounding
5. **Effect Styles** — Shadow/Card with live demo card and CSS value
6. **Primary Color Scales** — Terracotta, Bronze, Gold gradient strips (50–900)
7. **Secondary Color Scales** — Ocean, Sage, Slate gradient strips (50–900)

---

## Step 6: Updated Foundations Page

Rebuilt the color section on the Foundations page to include:
- Core color swatches (7 key colors with hex values)
- Primary shade scales (Terracotta, Bronze, Gold — 50 to 900)
- Secondary shade scales (Ocean, Sage, Slate — 50 to 900)

---

## Step 7: Component-Based Homepage

Created a duplicate of the homepage that uses component instances instead of raw frames:

| Section | Component Instances Used |
|---|---|
| Navigation | `Nav Bar` ×1 |
| Hero | `Search Bar` ×1 |
| Destinations | `Destination Card` ×3 (with text/color overrides) |
| Experience Banner | `Button/Primary` ×1, `Button/Ghost` ×1 |
| Testimonials | `Testimonial Card` ×2 (with text overrides) |
| Footer | `Footer` ×1 |

**Benefit:** Any updates to master components now propagate automatically to the homepage layout.

---

## Final File Structure

```
Figma File: "Figma-test"
├── Travel Homepage          ← Original (raw frames)
├── Homepage — Components    ← Rebuilt with component instances
├── Cover                    ← Design system cover page
├── Foundations              ← Colors, typography, spacing docs
├── Master Reference         ← Complete variable documentation
├── ---                      ← Separator
├── Button                   ← 6 variants (3 styles × 2 sizes)
├── Badge                    ← Rating badge component
├── Card                     ← Destination card component
├── Search Bar               ← Hero search bar component
├── Nav Bar                  ← Navigation bar component
├── Testimonial Card         ← Review card component
└── Footer                   ← Site footer component
```

## Token Inventory

| Category | Count |
|---|---|
| Primitive color variables | 69 (9 core + 60 shade scale) |
| Semantic color variables | 19 (11 original + 8 secondary) |
| Spacing variables | 11 |
| Radius variables | 5 |
| Text styles | 16 |
| Effect styles | 1 |
| Components | 7 (with 6 button variants) |
| **Total tokens** | **121** |

---

## Tools & Workflow

| Tool | Role |
|---|---|
| **Claude Code** | Orchestration, design decisions, code generation |
| **Paper MCP** | Initial homepage design (write_html, get_screenshot) |
| **Figma MCP** | Design system creation (use_figma Plugin API) |
| **figma-use skill** | Plugin API syntax rules and patterns |
| **figma-generate-library skill** | Design system workflow and phase management |

### Key Principles Followed
- **Incremental building** — One visual group per tool call, never batch entire sections
- **Review checkpoints** — Screenshots after every 2-3 modifications
- **Variables before components** — All tokens created before any component work
- **Semantic aliasing** — Semantic tokens alias primitives, never duplicate raw values
- **Proper scoping** — Every variable scoped to relevant property pickers
- **Component instances** — Final homepage uses instances for automatic propagation
