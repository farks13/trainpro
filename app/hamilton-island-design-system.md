# Hamilton Island — Design System

**Source:** Figma file `htOBTHFofNdeBOQ993Is8q`
**Extracted from:** 53 screens across Hotel, Restaurant, Experience, Package booking flows + Logged-in states

---

## 1. Color Palette

### Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | `#77A222` | Success states, stepper completions, check marks, positive indicators |
| `brand-secondary` | `#00423A` | Active stepper steps, dark brand accents |

### Neutral Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-900` | `#0A0A0A` | Primary text color |
| `neutral-800` | `#101828` | Primary buttons (filled), dark UI elements |
| `neutral-700` | `#000000` | Pure black (used sparingly) |
| `neutral-400` | `#999999` | Placeholder backgrounds |
| `neutral-300` | `#B1B8C4` | Checkbox borders |
| `neutral-200` | `#D1D5DC` | Card borders, input borders, dividers |
| `neutral-150` | `#E5E7EB` | Header border |
| `neutral-100` | `#EAEAEA` | Section backgrounds (alternating) |
| `neutral-50` | `#F7F7F7` | Sidebar card backgrounds |
| `neutral-25` | `#F9FAFB` | Page background |
| `white` | `#FFFFFF` | Cards, inputs, header background |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#77A222` | Completed steps, check icons, "Added" state |
| `error` | `#DC2626` (estimated) | Cancel booking button, deposit/discount text |
| `info-light` | `#DBEAFE` | Calendar available dates (light blue) |
| `info` | `#3B82F6` | Calendar selected dates (blue) |
| `info-range` | `#EFF6FF` | Calendar in-range dates |
| `overlay` | `rgba(0,0,0,0.3)` | Hero image overlay |
| `placeholder-text` | `rgba(10,10,10,0.5)` | Input placeholder text |

---

## 2. Typography

### Font Families
| Token | Font | Usage |
|-------|------|-------|
| `font-primary` | `Inter` | All UI text — headings, body, labels, buttons |
| `font-stepper` | `Mulish` | Stepper step numbers only |

### Type Scale
| Token | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| `heading-1` | 48px | Medium (500) | 48px | 0.35px | Hero headline |
| `heading-2` | 30px | Medium (500) | 36px | 0.40px | Section titles, page titles |
| `heading-3` | 24px | Medium (500) | 32px | 0.07px | Card section headers (e.g. "1. Details") |
| `heading-4` | 20px | Medium (500) | 28px | -0.45px | Sidebar card titles, sub-section heads |
| `body-lg` | 18px | Medium (500) | 28px | -0.44px | Navigation items (Menu, Log in) |
| `body` | 16px | Regular (400) | 24px/36px | -0.31px/0.40px | Body text, form labels, button text |
| `body-medium` | 16px | Medium (500) | 24px | -0.31px | Form labels, button text, stepper labels |
| `body-sm` | 14px | Regular (400) | 20px | -0.15px | Secondary text, dates, small details |
| `body-sm-bold` | 14px | Bold (700) | 20px | -0.15px | "Plan your visit" label |
| `stepper-number` | 13-15px | Bold (700) | none | — | Step numbers in stepper |

### Font Weight Map
| Token | Weight | Usage |
|-------|--------|-------|
| `regular` | 400 | Body text, descriptions, input values |
| `medium` | 500 | Headings, labels, buttons, navigation |
| `bold` | 700 | Emphasis labels, stepper numbers |

---

## 3. Spacing

### Section Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `section-padding` | 60px | Vertical padding for major content sections |
| `page-padding-x` | 85.5px | Header horizontal padding |
| `content-padding-x` | 32px | Main content area horizontal padding |
| `content-gap` | 32px | Gap between main content sections |

### Component Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `card-padding` | 25px | Card internal padding |
| `card-gap` | 24px | Gap between card content sections |
| `form-gap` | 24px | Gap between form fields |
| `field-gap` | 8px | Gap between label and input |
| `input-padding-x` | 16px | Horizontal padding inside inputs |
| `input-padding-y` | 8px | Vertical padding inside inputs |
| `list-item-gap` | 12px | Gap between list items (e.g. benefits list) |
| `icon-text-gap` | 8px | Gap between icon and adjacent text |
| `stepper-gap` | 11px | Gap between stepper elements |

### Layout Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `header-height` | 65px | Fixed header height |
| `sidebar-width` | 384px | Right sidebar width (checkout pages) |
| `main-content-width` | 800px | Main content column width (checkout) |
| `container-max-width` | 1280px | Maximum content container width |
| `page-width` | 1387px | Full page width |

---

## 4. Border & Radius

### Border Widths
| Token | Value | Usage |
|-------|-------|-------|
| `border-default` | 1px | Card borders, input borders, dividers |
| `border-emphasis` | 2px | Primary outline buttons, search container border, stepper outlines |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 2px | Checkboxes |
| `radius` | 4px | Buttons, inputs, secondary cards |
| `radius-lg` | 10px | Cards, containers, search bar |
| `radius-full` | 100px | Stepper circles |

---

## 5. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-search` | `0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)` | Search bar container |

---

## 6. Components

### 6.1 Header / Navigation
- **Height:** 65px
- **Background:** White with bottom border (`#E5E7EB`)
- **Padding:** 85.5px horizontal
- **Left:** Hamburger icon + "Menu" text (18px Medium)
- **Right:** "Log in" text (18px Medium) — changes to "Hi [Name]" + "Sign out" in logged-in state
- **Layout:** Flexbox, space-between, center aligned

### 6.2 Buttons

#### Primary (Filled)
- **Background:** `#101828` (dark navy/black)
- **Text:** White, 16px Medium, center aligned
- **Height:** 48px
- **Border radius:** 4px
- **Tracking:** -0.31px
- **Usage:** "Search", "Select Rooms"

#### Secondary (Outline)
- **Border:** 2px solid `#101828`
- **Text:** `#0A0A0A`, 16px Medium
- **Background:** transparent
- **Height:** 44-52px
- **Border radius:** 4px
- **Usage:** "Sign up / log in", "Continue", "Search" (category buttons)

#### Ghost/Text Button
- **No border or background**
- **Text:** `#0A0A0A`, 18px Medium
- **Usage:** "Menu", "Log in" in header

#### Action Button (Small)
- **Border:** 1px solid `#101828`
- **Height:** ~44px
- **Border radius:** 4px
- **Icon + text layout**
- **Usage:** "Edit Booking", "Cancel Booking", "Make a Request"

#### Success/Added State
- **Background:** `#77A222`
- **Text:** White
- **Usage:** "Added" state on extras

### 6.3 Form Inputs

#### Text Input
- **Border:** 1px solid `#D1D5DC`
- **Border radius:** 4px
- **Height:** 42px
- **Padding:** 16px horizontal, 8px vertical
- **Font:** 16px Regular
- **Placeholder:** `rgba(10,10,10,0.5)`
- **Background:** White

#### Text Area
- Same as text input but height: 90px
- Vertical scrollable

#### Dropdown/Select
- Same border treatment as text input
- **Height:** 50px
- **Padding:** 17px horizontal
- **Icon:** 16x16 chevron-down on right
- **Text:** 16px Medium

#### Checkbox
- **Size:** 13x13px
- **Border:** 1px solid `#B1B8C4`
- **Border radius:** 2px
- **Unchecked:** Empty
- **Label:** 16px Medium, 8px gap

### 6.4 Cards

#### Content Card (e.g. Booking Summary)
- **Background:** White
- **Border:** 1px solid `#D1D5DC`
- **Border radius:** 10px
- **Padding:** 25px
- **Internal gap:** 24px between sections
- **Dividers:** 1px solid `#D1D5DC` (border-top)

#### Info Card (e.g. "By booking with us")
- **Background:** `#F7F7F7`
- **Border:** 1px solid `#D1D5DC`
- **Border radius:** 10px
- **Padding:** 25px

#### Section Card (Checkout steps)
- **Background:** White
- **Border:** 1px solid `#D1D5DC`
- **Border radius:** 10px
- **Padding:** 25px top/sides, 1px bottom
- **Collapsed state:** Shows heading only (~106px height)

### 6.5 Stepper / Progress Indicator
- **Layout:** Horizontal, connected by dashed lines
- **Step circle size:** 24-32px
- **Circle radius:** 100px (full circle)
- **Active step:** `#00423A` background, white number text (Mulish Bold)
- **Completed step:** `#77A222` background, white check icon
- **Upcoming step:** 2px border `#00423A`, colored number text
- **Connector:** Dashed line between steps
- **Label:** 16px Medium, 11px gap from circle

### 6.6 Search Bar
- **Background:** White
- **Border:** 2px solid `#D1D5DC`
- **Border radius:** 10px
- **Shadow:** `0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)`
- **Height:** 118px
- **Layout:** Horizontal row — label + dropdown fields + search button
- **Position:** Overlaps hero image (positioned at bottom)

### 6.7 Calendar / Date Picker
- **Grid layout:** 7 columns (S M T W T F S)
- **Cell:** Shows date number + price below
- **Available state:** Light green/blue background (`#DBEAFE` area)
- **Selected state:** Blue background (`#3B82F6`), white text
- **In-range state:** Light blue tint
- **Unavailable:** Greyed out
- **Legend:** Shows Available, Selected, In Range indicators
- **Footer:** Bold total price + note about minimum prices

### 6.8 Modal / Dialog (Hotel Detail)
- **Background:** White
- **Position:** Centered with grey overlay
- **Close button:** X icon, top right
- **Header bar:** Grey background with booking details (Hotel, Dates, Guests, Ages)
- **Image gallery:** Main image + thumbnail strip
- **Content:** Hotel name, price, description, amenities grid, location info
- **CTA:** "Select Rooms" primary button

### 6.9 Booking Confirmation Page
- **Success icon:** Large checkmark
- **Title:** "Booking Confirmed!" (30px Medium)
- **Subtitle:** Muted text below
- **Reference number:** Bold, with Download + Email action buttons
- **Layout:** Two-column — main content left, sidebar cards right
- **Itinerary:** Day-by-day cards with activities, edit links, add activity CTAs
- **Sidebar cards:** Important Info, Packing Tips, Weather Forecast, Cancellation Policy
- **Bottom section:** "What to Do Next" cards + "Need Help?" contact info

### 6.10 Logged-In Dashboard
- **Left sidebar:** User avatar, name, email, navigation menu (Your Bookings, Account Info, Payment Methods, Favourites, Requests, Booking History)
- **Active nav item:** Blue background pill
- **Weather alert banner:** Blue background, icon, text, dismiss
- **Booking summary card:** White card with all booking details
- **Quick Actions:** Icon buttons (Book a Buggy, Book Dining, Special Request)
- **Right sidebar cards:** Add to Calendar, Getting Around, Important Info, Island Tips, Weather Forecast

---

## 7. Layout Patterns

### Homepage
```
[Header]
[Hero Image + Overlay + Search Bar]
[Section: "Plan your next escape" — centered text]
[Section: "Your island escape" — 4-column icon grid with CTAs]
[Section: Split — Image left + Text right]
```

### Checkout Flow (Hotel/Restaurant/Experience)
```
[Header]
[Stepper Progress Bar]
[Page Title]
[Two-Column Layout]
  ├── Left (800px): Form sections (Details → Extras → Payment)
  └── Right (384px): Booking Summary + Benefits card
```

### Confirmation Page
```
[Header]
[Stepper (all complete)]
[Success Message + Reference]
[Two-Column Layout]
  ├── Left: Booking Summary + Quick Actions + Day-by-Day Itinerary
  └── Right: Calendar links + Info cards + Weather + Contact
[What to Do Next cards]
[Need Help section]
```

### Logged-In State
```
[Header (with user greeting)]
[Alert Banner (optional)]
[Three-Column Layout]
  ├── Left Sidebar: User profile + nav menu
  ├── Center: Booking Summary + Quick Actions + Itinerary
  └── Right Sidebar: Calendar + Getting Around + Tips + Weather
```

---

## 8. Responsive Breakpoints

Based on the Figma designs, all screens are designed at **1387px width** (desktop). The design appears to be desktop-first with these implied breakpoints:

| Breakpoint | Width | Notes |
|-----------|-------|-------|
| Desktop | 1387px | All designs are at this width |
| Container | 1280px | Max content width |
| Main + Sidebar | 800px + 384px | Two-column checkout layout |

---

## 9. Icon System

- **Menu (hamburger):** 24x24px, custom SVG
- **Chevron down:** 16x16px, dropdown indicator
- **Check mark:** Used in stepper (completed), benefits list
- **Close (X):** Modal close button
- **Calendar icon:** Date fields
- **Location pin:** Meeting location
- **Download/Email:** Action icons in confirmation
- **Activity icons:** Buggy, dining, request (Quick Actions)

---

## 10. Design Tokens (CSS Custom Properties)

```css
:root {
  /* Brand */
  --color-brand-primary: #77A222;
  --color-brand-secondary: #00423A;

  /* Neutrals */
  --color-neutral-900: #0A0A0A;
  --color-neutral-800: #101828;
  --color-neutral-400: #999999;
  --color-neutral-300: #B1B8C4;
  --color-neutral-200: #D1D5DC;
  --color-neutral-150: #E5E7EB;
  --color-neutral-100: #EAEAEA;
  --color-neutral-50: #F7F7F7;
  --color-neutral-25: #F9FAFB;
  --color-white: #FFFFFF;

  /* Semantic */
  --color-success: #77A222;
  --color-error: #DC2626;
  --color-info: #3B82F6;
  --color-overlay: rgba(0, 0, 0, 0.3);
  --color-placeholder: rgba(10, 10, 10, 0.5);

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-stepper: 'Mulish', sans-serif;

  --text-4xl: 48px;
  --text-3xl: 30px;
  --text-2xl: 24px;
  --text-xl: 20px;
  --text-lg: 18px;
  --text-base: 16px;
  --text-sm: 14px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --space-section: 60px;
  --space-card: 25px;
  --space-lg: 32px;
  --space-md: 24px;
  --space-sm: 16px;
  --space-xs: 12px;
  --space-2xs: 8px;

  /* Borders */
  --border-default: 1px solid #D1D5DC;
  --border-emphasis: 2px solid #101828;
  --border-header: 1px solid #E5E7EB;

  /* Radius */
  --radius-sm: 2px;
  --radius: 4px;
  --radius-lg: 10px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-search: 0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1);

  /* Layout */
  --header-height: 65px;
  --page-width: 1387px;
  --container-width: 1280px;
  --sidebar-width: 384px;
  --main-width: 800px;
}
```

---

## 11. Tailwind CSS Extension

To use these tokens in the existing Tailwind setup, add to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#77A222',
          secondary: '#00423A',
        },
        hamilton: {
          900: '#0A0A0A',
          800: '#101828',
          400: '#999999',
          300: '#B1B8C4',
          200: '#D1D5DC',
          150: '#E5E7EB',
          100: '#EAEAEA',
          50: '#F7F7F7',
          25: '#F9FAFB',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mulish: ['Mulish', 'sans-serif'],
      },
      fontSize: {
        'hero': ['48px', { lineHeight: '48px', letterSpacing: '0.35px', fontWeight: '500' }],
        'section': ['30px', { lineHeight: '36px', letterSpacing: '0.40px', fontWeight: '500' }],
        'card-heading': ['24px', { lineHeight: '32px', letterSpacing: '0.07px', fontWeight: '500' }],
        'subheading': ['20px', { lineHeight: '28px', letterSpacing: '-0.45px', fontWeight: '500' }],
      },
      spacing: {
        'section': '60px',
        'card': '25px',
        'header': '65px',
      },
      borderRadius: {
        'card': '10px',
      },
      boxShadow: {
        'search': '0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)',
      },
      width: {
        'sidebar': '384px',
        'main': '800px',
        'container': '1280px',
        'page': '1387px',
      },
    },
  },
}
```
