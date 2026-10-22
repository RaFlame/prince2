---
name: PRINCE2 Control
description: Coastal control-room governance dashboard for Fiskistofa onboard EM
colors:
  north-atlantic-ink: "#1d4ed8"
  north-atlantic-ink-soft: "#eff6ff"
  operational-seafoam: "#047857"
  operational-seafoam-soft: "#ecfdf5"
  mist-deck: "#f1f5f9"
  panel-white: "#ffffff"
  hairline: "#e2e8f0"
  mute-slate: "#64748b"
  body-slate: "#475569"
  ink: "#020617"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  sm: "4px"
  md: "6px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.north-atlantic-ink}"
    textColor: "{colors.panel-white}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#1e40af"
    textColor: "{colors.panel-white}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.body-slate}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-ghost-icon:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.mute-slate}"
    rounded: "{rounded.sm}"
    padding: "6px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.body-slate}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  nav-item-active:
    backgroundColor: "{colors.north-atlantic-ink-soft}"
    textColor: "{colors.north-atlantic-ink}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  card-surface:
    backgroundColor: "{colors.mist-deck}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "20px"
  status-chip:
    backgroundColor: "{colors.operational-seafoam-soft}"
    textColor: "{colors.operational-seafoam}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
---

# Design System: PRINCE2 Control

## Overview

**Creative North Star: "The Coastal Control Room"**

PRINCE2 Control reads as a dense Icelandic public-sector instrument panel for onboard camera monitoring — not a marketing site and not a playful SaaS kit. The Coastal Control Room metaphor means calm institutional oversight with a faint North-Atlantic edge: cool slate decks, a single harbour signal accent, and surfaces that feel machined rather than decorated.

The system is **technical, compact, and table-first**. Hierarchy favors scan paths for interview walkthroughs and ongoing status reading: page titles, tight section labels, and data-dense tables and cards. Whitespace is earned; density is the default.

Depth uses **neomorphism**: recessed panels and raised controls on a shared mist-deck ground. Soft dual shadows (light + dark) create extrusion and inset; hard drop-shadows and generic card chrome are rejected.

**Key Characteristics:**
- Cool slate deck with one North Atlantic Ink accent
- Compact type, table- and card-forward information density
- Neomorphic recessed panels + raised controls
- Bilingual chrome (IS/EN) treated as first-class UI, not an afterthought
- Public-sector gravity — serious, scannable, never gimmicky

## Colors

A cool coastal-neutral field with one strong signal blue and one operational status green.

### Primary
- **North Atlantic Ink** (#1d4ed8): Primary accent — active nav, primary buttons, thesis highlight, focus borders. Use sparingly so signal stays readable.
- **North Atlantic Ink Soft** (#eff6ff): Active nav wash and soft highlight panels behind accent content.

### Secondary
- **Operational Seafoam** (#047857): Positive / on-track status text and success messaging.
- **Operational Seafoam Soft** (#ecfdf5): Status chip backgrounds and quiet success surfaces.

### Neutral
- **Mist Deck** (#f1f5f9): App canvas / neomorphic ground — the shared surface light and dark shadows push against.
- **Panel White** (#ffffff): Raised controls and inset panel faces when using classic bordered fallback; prefer tonal Mist Deck for full neo treatment.
- **Hairline** (#e2e8f0): Structural borders when neo alone is insufficient (tables, sticky header rules).
- **Mute Slate** (#64748b): Meta labels, timestamps, secondary chrome.
- **Body Slate** (#475569): Default secondary text and inactive nav.
- **Ink** (#020617): Primary text / page titles.

### Named Rules
**The One Signal Rule.** North Atlantic Ink occupies ≤10% of any viewport. If everything is accented, nothing is.

**The Deck Continuity Rule.** Neomorphic light/dark shadows must share the same Mist Deck ground color; never float white cards on white with unrelated gray shadows.

## Typography

**Display Font:** Arial (with Helvetica, sans-serif) — shell UI  
**Body Font:** Arial (with Helvetica, sans-serif) — shell UI  
**Card editable faces:** DM Sans, Literata, Fraunces, JetBrains Mono, Nunito (CSS variables `--font-card-*`) — user-selectable inside EditableCard only  
**Label/Mono Font:** JetBrains Mono for stage IDs and compact data labels when mono is chosen

**Character:** Utilitarian instrument type. The shell stays system-serious and compact; expressive faces are confined to editable card content so governance chrome never turns editorial.

### Hierarchy
- **Display** (600, 1.5rem / text-2xl, ~1.25): Page titles (`h1`) per section.
- **Headline / Title** (600, 0.875rem / text-sm): Card titles, section headings, table emphasis.
- **Body** (400, 0.875rem / text-sm, relaxed leading in cards): Card content and nav labels.
- **Label** (500, 0.625–0.6875rem, tracked): Breadcrumbs, duration chips, “Project Office” eyebrow, table headers.

### Named Rules
**The Shell Discipline Rule.** Shell chrome stays Arial/system. Do not promote Fraunces or display faces into nav, headers, or buttons.

**The Compact Scan Rule.** Prefer `text-sm` / `text-xs` over large marketing sizes. Tables and chips beat hero typography.

## Layout

Fixed left rail **240px** (`w-60`) from `lg` up; content offset `lg:pl-60`. Sticky top header **64px**. Main canvas `max-w-[1500px]` with `p-4` / `sm:p-6`. Vertical rhythm `space-y-6` between major blocks; grids `gap-3`–`gap-4`. Mobile: horizontal section strip under the header; sidebar hidden.

Density is high: four-up tolerance grids, two-column content grids, full-width tables. Prefer tightening padding over adding empty hero bands.

### Named Rules
**The Table-First Rule.** When content is comparative (stages, risks, glossary), prefer tables or compact lists over large marketing cards.

## Elevation & Depth

**Neomorphic control room.** Depth comes from soft dual shadows on Mist Deck — extruded (raised) controls and recessed (inset) panels — not Material drop-shadows.

### Shadow Vocabulary
- **Raised control** (`box-shadow: 5px 5px 10px #c8d0da, -5px -5px 10px #ffffff`): Primary actions, locale toggle, icon buttons at rest.
- **Raised control pressed** (`box-shadow: inset 3px 3px 6px #c8d0da, inset -3px -3px 6px #ffffff`): `:active` / selected toggle segments.
- **Recessed panel** (`box-shadow: inset 6px 6px 12px #c8d0da, inset -6px -6px 12px #ffffff`): Editable cards, stage blocks, wiki panels — content wells.
- **Hairline fallback** (`border: 1px solid #e2e8f0`): Tables, sticky header, sidebar rules where inset neo would blur data grids.

### Named Rules
**The Neo Ground Rule.** Always cast neo shadows against Mist Deck (#f1f5f9). Extruding from pure white breaks the illusion.

**The Grid Exception Rule.** Data tables stay flat + hairline. Do not neomorph every cell.

## Shapes

Gently squared instrument corners: **4px** (`rounded`) for cards, nav items, buttons; **pill** only for status/duration chips. No large “SaaS soft” radii. Borders are 1px Hairline when neo is not used.

## Components

Recessed panels, raised controls — denser control-room kit.

### Buttons
- **Shape:** Slightly squared (4px)
- **Primary:** North Atlantic Ink fill, white text, raised neo; darker blue on hover; inset on press
- **Secondary / Ghost:** Mist Deck or white face, Hairline or neo raise, Body Slate text
- **Icon tools** (edit/save): Compact raised squares (~30px), Save uses soft Ink wash

### Chips
- **Status:** Operational Seafoam Soft + Seafoam text, pill
- **Meta / duration:** Mist Deck fill, Mute Slate text, pill
- **Locale IS/EN:** Segmented raised control; active segment inset + Ink fill/white text

### Cards / Containers
- **Corner Style:** 4px
- **Background:** Mist Deck recessed neo well (implementation may still show white + Hairline until neo pass)
- **Shadow Strategy:** Recessed panel vocabulary
- **Internal Padding:** 20px (`p-5`)
- **Signature:** EditableCard — title row + optional style toolbar; content uses card font variables

### Inputs / Fields
- **Style:** Recessed or Hairline field on Mist Deck, 4px radius
- **Focus:** North Atlantic Ink border / soft ring; never thick glow stacks
- **Toolbar selects:** Compact raised chips inside recessed editor strip

### Navigation
- **Desktop:** Fixed white/Mist sidebar, product mark in Ink tile, active item Ink Soft + Ink text
- **Mobile:** Horizontal scroll chips mirroring active treatment
- **Header:** Sticky, breadcrumb + org, locale control, duration chip

### Signature: EditableCard
Governance content module with inline edit, bilingual fields, and constrained style controls (font/size/color/bold/italic). Visual weight comes from recessed panel + compact toolbar — not from decorative badges.

## Do's and Don'ts

### Do:
- **Do** keep Mist Deck as the neo ground and share one light/dark shadow pair across the shell.
- **Do** reserve North Atlantic Ink for navigation signal, primary actions, and focus.
- **Do** prefer tables and compact grids for stages, risks, and glossary.
- **Do** keep shell typography utilitarian; confine display/serif/mono choices to EditableCard content.
- **Do** treat IS/EN as equal chrome in every durable string.

### Don't:
- **Don't** use purple gradients, glow stacks, or playful SaaS marketing patterns.
- **Don't** neomorph data-table cells or cover the UI in identical raised cards.
- **Don't** promote Fraunces/Literata into nav, page titles, or buttons.
- **Don't** invent Fiskistofa logo marks or official brand colors until assets are supplied.
- **Don't** inflate type or whitespace into a landing-page hero — this is a control room.
