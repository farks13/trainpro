# Design System Playbook — Repeatable Workflow

Use these exact prompts with Claude Code to go from blank canvas to a full design system. Copy-paste each prompt in sequence.

---

## Prerequisites

- Claude Code with Paper MCP and Figma MCP connected
- A blank or existing Figma file URL
- (Optional) An HTML component library file listing all components

---

## Phase 1: Design the Homepage

### Prompt 1 — Create the initial design in Paper

```
Create a homepage for a [type] website
```

> Claude will ask for context or start designing. It will:
> - Generate a design brief (palette, typography, spacing, direction)
> - Build the page incrementally in Paper (nav, hero, content sections, footer)
> - Take review screenshots after every 2-3 sections

### Prompt 2 — Push to Figma

```
Send this page to my Figma file using the Figma MCP server:
[paste your Figma file URL here]
```

> Claude will recreate the entire design in Figma using the Plugin API.

---

## Phase 2: Build the Design System

### Prompt 3 — Create the design system

```
Can you now create the design system for this page design in Figma
```

> Claude will:
> 1. Audit the design for all tokens (colors, type, spacing, radius, effects)
> 2. Present a full plan with variable collections, text styles, and component list
> 3. Wait for your approval before building

### Prompt 4 — Approve the plan

```
This is what I want
```

> Claude builds in phases:
> - Phase 1: Variables (Primitives → Semantic Colors → Spacing → Radius)
> - Phase 1: Text styles (Display, Body, Label, Overline)
> - Phase 1: Effect styles (shadows)
> - Phase 2: File structure (Cover, Foundations, separator, component pages)
> - Phase 3: Components (one per page with title + description)

---

## Phase 3: Extend the Color System

### Prompt 5 — Add shade scales and secondary palette

```
Can you extend my colours so that I've got shades and a secondary colour palette — do all of this in Figma
```

> Claude will:
> - Create 50-900 shade scales for each primary brand color
> - Add secondary complementary color scales
> - Create new semantic tokens for the secondary palette
> - Update the Master Reference and Foundations pages

---

## Phase 4: Document Everything

### Prompt 6 — Create master reference page

```
Can you create a master reference page that documents all of the variables
```

> Claude builds a comprehensive page with:
> - Primitives table (swatch, token name, hex, RGB, usage)
> - Semantic tokens table (swatch, token, alias, scope, usage)
> - Spacing scale with visual bars
> - Radius tokens with shape previews
> - Effect styles with live demos
> - All color scales as gradient strips

### Prompt 7 — Update foundations

```
When you're done update the foundations page with the new information
```

---

## Phase 5: Component-Based Layout

### Prompt 8 — Rebuild homepage with instances

```
Also create a duplicate of the homepage that now uses the components in the layout
```

> Claude creates a new page using component instances instead of raw frames.
> Any future updates to master components propagate automatically.

---

## Phase 6: Scale the Component Library

### Prompt 9 — Build all components from a spec

```
@[path/to/component_library.html] I now need you to continue building out the design system. I need components for every single item listed in the HTML file
```

> Attach an HTML file listing all components by category. Claude will:
> - Create a page for each category
> - Build every component with proper auto-layout, tokens, and realistic content
> - Track progress with a todo list

### Prompt 10 — Add extended components

```
Make sure we cover all of this off too before we finish

[paste your full component list — numbered, grouped by category]
```

> Claude will create additional pages and components for extended categories.

---

## Phase 7: Documentation

### Prompt 11 — Document the process

```
Can you quickly document this entire process step by step so I can show my team how we did this
```

### Prompt 12 — Save repeatable instructions

```
Can you also save a repeatable set of instructions so that when I need to perform this design system task again we follow the same steps with the same prompts
```

---

## Tips for Best Results

1. **Always approve plans before building** — Claude will present token/component lists. Review them.
2. **One Figma file per project** — Keep the design system and homepage in the same file.
3. **Provide a component spec file** — An HTML or markdown file listing all components by category dramatically speeds up the process.
4. **Review screenshots** — Claude takes verification screenshots. Flag issues immediately.
5. **Extend, don't restart** — If you need more components later, add to the existing system rather than rebuilding.

---

## Quick Start (Minimal Prompts)

If you want the fastest path, these 5 prompts will get you a complete design system:

```
1. "Create a homepage for a [type] website"
2. "Send this page to my Figma file: [URL]"
3. "Create the design system for this page design in Figma"
4. "This is what I want"
5. "Extend my colours with shades and a secondary palette, create a master reference page, rebuild the homepage with component instances, and document everything"
```

---

## Component Library Template

Use this HTML structure to specify components. Each card becomes a Figma component:

```html
<div class="section">
  <div class="section-header">
    <span class="section-badge">[Category Name]</span>
    <span class="count-label">[N] components</span>
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-name">[Component Name]</div>
      <div class="card-desc">[Brief description of variants, states, and content]</div>
      <div class="card-pages">
        <span class="page-pill">[Page where used]</span>
      </div>
    </div>
    <!-- More cards... -->
  </div>
</div>
```

---

## Output Checklist

After completing the full workflow, verify you have:

- [ ] Homepage design in Paper
- [ ] Homepage recreated in Figma (raw frames)
- [ ] Homepage rebuilt with component instances
- [ ] Cover page
- [ ] Foundations page (colors, typography, spacing)
- [ ] Master Reference page (all variables documented)
- [ ] Variable collections: Primitives, Color, Spacing, Radius
- [ ] Text styles: Display, Body, Label, Overline
- [ ] Effect styles: Shadows
- [ ] Extended color scales (primary + secondary, 50-900)
- [ ] All components on dedicated pages with descriptions
- [ ] Process documentation markdown file
- [ ] This playbook saved for next time
