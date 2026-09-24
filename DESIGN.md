---
name: Sri Kshetra Anandavana Staff Console
description: The admin, manager and priest workspace. A neutral zinc operations console with one saffron-orange accent, in light and dark themes.
colors:
  accent: "#c2410c"
  accent-hover: "#9a3412"
  accent-soft: "#fff4ed"
  accent-line: "#fed7bf"
  on-accent: "#ffffff"
  canvas: "#fafafa"
  rail: "#f4f4f5"
  surface: "#ffffff"
  surface-2: "#fafafa"
  hover: "#f4f4f5"
  press: "#e9e9ec"
  border: "#e4e4e7"
  border-strong: "#d4d4d8"
  ink: "#18181b"
  ink-2: "#52525b"
  ink-3: "#6b6b74"
  mark: "#a1a1aa"
  skeleton: "#ececef"
  success: "#15803d"
  success-soft: "#ecfdf3"
  warning: "#a15c07"
  warning-soft: "#fef8e7"
  danger: "#b91c1c"
  danger-soft: "#fef2f2"
  dark-canvas: "#0c0c0e"
  dark-rail: "#111113"
  dark-surface: "#161618"
  dark-hover: "#1f1f23"
  dark-border: "#26262b"
  dark-border-strong: "#3a3a41"
  dark-ink: "#f4f4f5"
  dark-ink-2: "#b4b4bc"
  dark-ink-3: "#8e8e98"
  dark-accent-text: "#fb923c"
  dark-accent-hover: "#d9531a"
typography:
  headline:
    fontFamily: "Inter, Noto Sans Kannada, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.022em"
  metric:
    fontFamily: "Inter, Noto Sans Kannada, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
    fontFeature: "\"tnum\""
  title:
    fontFamily: "Inter, Noto Sans Kannada, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Inter, Noto Sans Kannada, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "\"cv11\", \"ss01\", \"ss03\""
  label:
    fontFamily: "Inter, Noto Sans Kannada, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 600
    lineHeight: 1.5
  caption:
    fontFamily: "Inter, Noto Sans Kannada, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.5
  group-label:
    fontFamily: "Inter, Noto Sans Kannada, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.5
  mono:
    fontFamily: "ui-monospace, SF Mono, Cascadia Mono, Menlo, Consolas, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
rounded:
  bar: "4px"
  sm: "6px"
  nav: "7px"
  md: "8px"
  lg: "10px"
  bar-float: "12px"
  dialog: "14px"
  pill: "999px"
spacing:
  hairline-gap: "2px"
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  panel-inset: "1.1rem"
  section: "1.25rem"
  form-column: "1.5rem"
  rail-width: "248px"
  topbar-height: "56px"
  content-max: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: "0 0.85rem"
    height: "2.125rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 0.85rem"
    height: "2.125rem"
  button-secondary-hover:
    backgroundColor: "{colors.hover}"
  button-ghost:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    padding: "0 0.85rem"
    height: "2.125rem"
  button-small:
    height: "1.875rem"
    padding: "0 0.65rem"
  icon-button:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    size: "2.125rem"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.4rem 0.7rem"
    height: "2.125rem"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.panel-inset}"
  nav-link:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.nav}"
    padding: "0 0.625rem"
    height: "2.125rem"
  nav-link-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  segmented-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "1.75rem"
  badge-neutral:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.sm}"
    height: "1.4rem"
    padding: "0 0.5rem"
  badge-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
  badge-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
  badge-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
  badge-accent:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
  toast:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  command-palette:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.dialog}"
    width: "min(600px, 100%)"
---

# Design System: Sri Kshetra Anandavana Staff Console

> **Scope.** This file governs the **staff console** only: the admin, manager and priest workspaces under `/admin`, `/manager` and `/priest`, rendered by `src/pages/rolePortal/RoleShell.jsx` and styled by `src/pages/rolePortal/Console.module.css`. All tokens in the frontmatter belong to the console. The **public site** (the devotee-facing pages, store and account) is a separate visual world. It is summarised under "Public Site Surface" at the end of this file so the two are never mixed. Nothing from one world may be borrowed into the other.

## Overview

**Creative North Star: "The Temple Office Ledger"**

The console is a quiet, exact instrument for running the day's sevas. It is a standalone app shell with a 248px rail, a 56px top bar and a content column capped at 1320px. It is not a public page with a sidebar attached. Cool zinc neutrals sit on two layers: the rail is a shade darker than the canvas. Hairline 1px borders define structure, and one saffron-orange accent marks the only things that matter at a glance: the primary action, the current selection, today, and focus. It sits in the same class as Linear, Stripe Dashboard and Vercel, and it belongs to this temple only through its accent hue, the logo lockup and its bilingual content.

Density is set for office staff at a desk in daylight and for priests on phones. Body text is 14px, rows are 3.1rem tall, panels use a 1.1rem inset and every numeral is tabular. Expression gives way to scanability. Dates, seva names, devotee details and amounts are the content, and the chrome stays out of their way. The public site's warmth (ivory, Playfair, gold) is deliberately absent here.

Motion is short and purposeful, 160 to 220ms on a single expo-out curve (`cubic-bezier(0.16, 1, 0.3, 1)`). Pages fade and rise into place. The nav indicator slides between links. The calendar month slides in the direction of travel. Toasts rise from the corner. Loading states use skeletons. `prefers-reduced-motion` reduces every animation and transition to near zero.

**Key Characteristics:**
- Two-layer zinc neutrals with 1px hairline borders; flat surfaces with only a 1px ambient shadow at rest.
- One accent, `#c2410c`, reserved for the primary action, selection, today and focus.
- Inter with tabular numerals everywhere; weights run from 400 to 700, and nothing is uppercase.
- Status carried by small dot badges tinted in success, warning, danger or accent.
- Light by default, with a dark theme on the same token names via `data-theme="dark"`.
- Signature: the sliding nav indicator and the ⌘K command palette.

## Colors

A cool zinc greyscale with one warm voice. The saffron-orange accent is the only hue that appears outside status.

### Primary
- **Kumkum Ember** (accent): Primary buttons, the switch's on state, today's date disc in the calendar, and the today legend swatch. In the light theme it also serves as accent text (active nav icon, active choice border, focus outline, input focus border).
- **Ember Deep** (accent-hover): Hover fill for primary buttons in the light theme. In the dark theme, hover lightens instead to **Dark Ember Hover** (dark-accent-hover).
- **Ember Wash** (accent-soft) and **Ember Line** (accent-line): The tinted fill and inset hairline behind accent badges, nav counts, the selected lookup cell, the active choice card, the dropzone hover state, and text selection.
- **On Ember** (on-accent): White text and glyphs on accent fills.
- **Dark Ember Text** (dark-accent-text): In the dark theme, accent text, icons, focus outlines and today's chart bar switch to this lighter orange so they stay legible on near-black. Fills keep `#c2410c`.

### Neutral
- **Paper Canvas** (canvas) / **Graphite Canvas** (dark-canvas): The page background behind the content column. The top bar is this colour at 86% with a saturated 10px backdrop blur.
- **Zinc Rail** (rail) / **Dark Rail** (dark-rail): The sidebar, one step darker than the canvas. This two-layer split is structural and should not be flattened.
- **Sheet White** (surface) / **Dark Sheet** (dark-surface): Panels, inputs, secondary buttons, toasts, the palette, and the sliding nav indicator.
- **Surface Two** (surface-2): Table header rows, panel footers, row hover, switch rows, dropzones and the palette footer. In the dark theme it is `#131315`.
- **Hover / Press** (hover, press): Quiet fills for ghost buttons, icon buttons, neutral badges, list icons and segmented tracks.
- **Hairline** (border) and **Hairline Strong** (border-strong): Every divider, panel edge and input stroke. The strong step appears on hover, on dashed dropzones and on the switch's off track.
- **Ink, Ink 2, Ink 3** (ink, ink-2, ink-3): Three text levels. Ink is for headings, cell mains and values. Ink 2 is body, descriptions and inactive nav. Ink 3 is meta, hints, table headers, placeholders and group labels. The dark theme has matching dark-ink levels.
- **Chart Mark** (mark): The neutral fill for data bars and share bars. Only today's bar takes the accent.
- **Skeleton** (skeleton): The loading shimmer base.

### Status
- **Success, Warning, Danger** each pair a strong tone with a soft wash (success/success-soft, warning/warning-soft, danger/danger-soft). They are used only in badges, toast icons and the KPI warning sub-line. In the dark theme the tones become `#4ade80`, `#fbbf24` and `#f87171` on 10% alpha washes.

### Named Rules
**The One Accent Rule.** Saffron-orange appears only on the primary action, the current selection, today, and focus. Data bars, chips, icons and headings stay neutral until they are selected or represent today.

**The Two-Layer Rule.** The rail is always one step darker than the canvas, and panels are always the lightest layer. Depth comes from these three tones and hairlines, not from colour blocks.

## Typography

**Body Font:** Inter (with Noto Sans Kannada, then system-ui)
**Mono Font:** ui-monospace (SF Mono, Cascadia Mono, Menlo, Consolas) for IDs and references only

**Character:** A single sans family carries everything, as in a working tool. Hierarchy comes from size, weight and ink level, not from a second face. OpenType alternates `cv11`, `ss01` and `ss03` are turned on at the shell. Kannada text gets a 1.65 line height through `:lang(kn)`.

### Hierarchy
- **Headline** (700, 1.5rem, 1.2, -0.022em): The one page title per route. It drops to 1.3rem below 640px.
- **Metric** (700, 1.5rem, tabular, -0.025em): KPI values. When a KPI holds text instead of a number, it steps down to 1.05rem.
- **Title** (600, 0.9rem, -0.005em): Panel titles, form-section headings and empty-state titles. The calendar month heading is 1.05rem at 700.
- **Body** (400, 0.875rem, 1.5): Default console text and input text. Descriptions are capped at 62ch.
- **Label** (600, 0.82rem): Field labels, cell mains, button text (0.84rem), badges (0.74rem) and table headers (0.76rem, in Ink 3).
- **Caption** (400, 0.78rem, Ink 3): Hints, sub-lines, table footers and list secondary lines.
- **Group label** (600, 0.72rem, Ink 3, sentence case): Nav group labels and palette group labels.

### Named Rules
**The Tabular Rule.** Every number in the console (KPIs, table cells, counts, dates, calendar days, chart axes) uses tabular numerals so columns align and values do not shift as they update.

**The Sentence Case Rule.** No uppercase and no tracked-out small caps. Group labels, table headers and badges are sentence case at small sizes in Ink 3. Weight and ink level carry the hierarchy.

## Layout

The shell is a CSS grid: a sticky 248px rail and a fluid main column. The main column has a sticky 56px top bar (breadcrumb, ⌘K search trigger, actions, and a 2px sweeping progress line at its bottom edge while loading) above a content column capped at 1320px. Content padding is `clamp(1.25rem, 3vw, 2rem)` on top, `clamp(1rem, 2.5vw, 2rem)` on the sides and 4rem at the bottom.

Pages stack with a 1.25rem gap: a header (title and description on the left, actions on the right, bottom-aligned), then a segmented KPI strip, then panels. Two-column pages use a 1.55fr / 1fr split with a 1.25rem gap. The right column may hold a sticky preview offset by the top bar. Forms are sectioned rows with a 15rem description column beside a two-column field grid, with a 1.5rem gap between them. Inside panels, the rhythm is a 1.1rem inset, 0.5rem gaps between controls, and hairline dividers between rows.

Responsive behaviour:
- **Below 1100px:** Splits and form sections collapse to one column, and sticky previews become static.
- **Below 900px:** The rail becomes an off-canvas drawer (`min(280px, 86vw)`) with a scrim and a close button, and a menu button appears in the top bar. The search trigger collapses to an icon, and calendar days switch from event pills to count dots.
- **Below 640px:** Base size rises to 0.9rem. KPIs go to two columns, page actions and save-bar buttons go full width, and tables marked for stacking become label/value rows using `data-label`. The breadcrumb shows only the current page, a back link appears, and toasts span the width.

For printing a day sheet, only the content column prints, without shadows or animation.

## Elevation & Depth

Hairlines and tonal layers carry the structure. Shadows are nearly invisible at rest and grow only for layers that float above the page. Every resting surface (panel, KPI strip, input, secondary button, search trigger, nav indicator) carries the 1px ambient shadow and a 1px border. The large shadow belongs only to things that hover over content: toasts, the command palette, the sticky save bar and the mobile drawer. In the dark theme the same three steps use black at higher opacity.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 2px rgba(24, 24, 27, 0.05)`): Panels, KPI strip, inputs, secondary and bordered icon buttons, and the nav indicator (combined with an inset 1px border).
- **Lifted** (`box-shadow: 0 1px 2px rgba(24, 24, 27, 0.04), 0 4px 12px -2px rgba(24, 24, 27, 0.07)`): The empty-state icon tile only.
- **Floating** (`box-shadow: 0 2px 6px rgba(24, 24, 27, 0.06), 0 24px 48px -12px rgba(24, 24, 27, 0.22)`): Toasts, the command palette, the save bar and the mobile drawer.
- **Focus ring** (`box-shadow: 0 0 0 3px rgba(194, 65, 12, 0.18)`): Focused inputs, switches, choice cards and dropzones. In the dark theme it is `rgba(251, 146, 60, 0.25)`.

### Named Rules
**The Floating-Only Lift Rule.** A surface earns the Floating shadow only if it sits above page content (toast, palette, save bar, drawer). Panels never lift, even on hover.

## Shapes

Gently rounded and consistent. Controls (buttons, inputs, icon buttons, choice cards, list icons) use an 8px radius. Panels, KPI strips, toasts and dropzones use 10px. The floating save bar uses 12px and the command palette 14px, so the larger the layer, the softer its corners. Small inner parts step down: 7px for nav links and the nav indicator, 6px for badges, segmented buttons and inline affix buttons, 5px for calendar event pills and kbd keys, and 4px for chart-bar tops. Pills (999px) are used only for nav counts, switch tracks, share bars and mobile calendar dots. Avatars and today's date are circles. Borders are 1px solid everywhere. The exceptions are the dashed dropzone and a 135-degree hairline hatch that marks days outside the month and empty preview images.

## Components

### Buttons
Compact and firm, 2.125rem tall (1.875rem for the small size), with 0.84rem text at weight 600.
- **Shape:** Gently rounded (8px).
- **Primary:** A Kumkum Ember fill with white text, the Rest shadow and a 14% white inset top highlight. Use one per view.
- **Secondary:** Sheet White with a hairline border and the Rest shadow. On hover it takes the Hover fill and the strong hairline.
- **Ghost:** No fill and Ink 2 text. On hover it takes the Hover fill and Ink text.
- **Press / Disabled:** Pressing nudges the button 1px down and scales it to 0.99. Disabled buttons drop to 55% opacity.
- **Icon button:** A 2.125rem square in Ink 2 with a Hover fill on hover. The bordered variant adds a surface fill, hairline and Rest shadow.

### Chips
- **Status badge:** 1.4rem tall with a 6px radius and 0.74rem text at weight 600. It opens with a 6px dot in the current colour, sits on the soft wash of its tone, and has a 1px inset border mixed at 22% of the tone. The plain variant drops the dot.
- **Lookup cells:** Grid cells rather than rounded chips, separated by hairlines. Hovered cells take Surface Two, and the selected cell takes Ember Wash.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** Sheet White. Headers, table heads and footers sit on Surface Two.
- **Shadow Strategy:** Rest only (see Elevation & Depth).
- **Border:** 1px hairline, with overflow clipped so inner dividers meet the edge cleanly.
- **Internal Padding:** A 1.1rem inset. Headers are at least 3.25rem tall, with the title on the left and meta and a link on the right. The meta sits beside the title in Ink 3 tabular text.
- **KPI strip:** One bordered container divided into cells by internal hairlines (minimum 170px per cell), not separate cards. Each cell stacks an icon label, a metric and a caption.

### Inputs / Fields
- **Style:** Sheet White, hairline stroke, 8px radius, 2.125rem minimum height, 0.4rem 0.7rem padding and the Rest shadow. Selects carry a zinc up/down chevron, and textareas start at 6.5rem.
- **Focus:** The border turns to accent text and gains the 3px focus ring. Hover strengthens the hairline.
- **Fields:** Labels at 0.82rem, weight 600, in Ink, with an optional tabular aside on the right. Hints sit below at 0.78rem in Ink 3.
- **Switch:** A 2.25rem pill track that is Hairline Strong when off and Kumkum Ember when on, with a white knob sliding on the expo curve. It sits inside a Surface Two row with a title and description.
- **Choice card:** Bordered option tiles. The selected tile takes Ember Wash with a 1px accent border and ring.

### Navigation
- **Rail:** A logo lockup with the name at weight 700 and the role in Ink 3, then grouped links under sentence-case group labels, with the user row and theme and sign-out buttons at the foot.
- **Links:** 2.125rem tall, Ink 2 at weight 500, with Ink 3 icons. On hover they get a 55% Press wash.
- **Active:** Marked by the **sliding indicator**, a single absolutely positioned Sheet White tile with the Rest shadow and inset hairline. It moves between links on the expo curve in 220ms, and the active icon turns accent.
- **Counts:** Accent-wash pills with tabular numerals.
- **Top bar:** A translucent blurred Paper Canvas bar with a breadcrumb (current page in Ink at weight 600), the ⌘K search trigger (15rem, with a kbd hint) and actions.
- **Mobile:** An off-canvas drawer with a Floating shadow and a scrim.

### Tables
Header row on Surface Two at 2.4rem, with 0.76rem Ink 3 labels. Sortable headers are soft buttons. Body rows are 3.1rem tall with hairline dividers, and hovered rows take Surface Two. Row actions stay hidden until the row is hovered or focused. Numeric columns align right. Below 640px, tables stack into label/value rows.

### Command Palette (signature)
Opened with ⌘K. It sits on a 40% zinc scrim with a 2px blur, 12vh from the top. The dialog is 600px wide with a 14px radius and the Floating shadow. It has a 3.25rem search row, grouped 2.5rem items (the active item takes the Hover fill and its icon turns accent) and a Surface Two footer with kbd hints. It enters in 220ms with a 0.975 scale and an 8px drop.

### Load Chart (signature)
A 14-day column chart: bars in Chart Mark with a 4px top radius, two half-height hairline gridlines, and today's bar in accent. The hovered bar darkens to Ink 2 and shows an inverted Ink tooltip. Bars grow from the baseline on first load, staggered 12ms apart.

### Feedback
Toasts appear bottom-right (380px wide) on Sheet White with a 10px radius, Floating shadow and a status-coloured icon. They rise in over 220ms and slide out to the right. Empty states centre a 2.5rem Lifted icon tile over a title, 40ch text and an optional button. The sticky save bar is a translucent, blurred 12px pill that rises from the bottom while a form has unsaved edits.

## Do's and Don'ts

### Do:
- **Do** build every console screen from the shared console tokens and primitives (Page, PageHeader, Panel, Kpis, Badge, Field, Segmented, Switch, EmptyState, Skeleton). Never restyle a page locally.
- **Do** keep the accent (`#c2410c`) to the primary action, the current selection, today and focus, with one primary button per view.
- **Do** use 1px hairlines and the three tonal layers (rail, canvas, surface) for structure, with the Rest shadow on resting surfaces.
- **Do** set every number in tabular numerals and every label in sentence case.
- **Do** carry status with dot badges on soft washes, and pair colour with a text label.
- **Do** ship both themes: any new colour needs a `data-theme="dark"` value, and accent text in dark uses `#fb923c`.
- **Do** use skeleton rows while loading and honest empty states when there is no data.
- **Do** keep motion between 120 and 300ms on `cubic-bezier(0.16, 1, 0.3, 1)` and respect reduced motion.

### Don't:
- **Don't** bring the public site's ivory, brown ink, gold, Playfair Display or 14px card radii into the console.
- **Don't** build dashboards as stacks of separately shadowed white cards with big numbers. KPIs live in one strip divided by hairlines.
- **Don't** use the Floating shadow on anything that does not float above content.
- **Don't** add uppercase tracked labels or eyebrow text above headings. The console has none.
- **Don't** colour data bars, icons or chips with the accent unless they represent today or the current selection.
- **Don't** place the console under the public site's navbar. It is its own full-height shell.

## Public Site Surface (separate world)

This is recorded only so later agents can tell the worlds apart. It is not a full specification, and its tokens are not in the frontmatter above. The public site (home, lineage, institutions, seva booking, store, checkout, orders and account) is a warm, devotional world:

- **Global tokens** (`src/index.css`): warm ivory background `#F9F6F0`, deep brown text `#3E2723`, body brown `#5a4636`, muted brown `#7a5c3c`, traditional gold `#D4AF37`, terracotta `#8B5A2B`, kumkum saffron `#b85c1e` (actions and focus), temple-wood dark `#2c140c`. Shadows are soft and diffuse (`0 10px 30px rgba(62, 39, 35, 0.08)`). The easing is `cubic-bezier(0.22, 1, 0.36, 1)`, the max width is 1200px and the nav bar is 72px.
- **Type:** Playfair Display (with Noto Serif Kannada) for display and Inter (with Noto Sans Kannada) for body, swapping to Kannada-first stacks under `:lang(kn)`. Body line height is 1.6, or 1.75 in Kannada.
- **Store and account pages** (`src/pages/shop/*.module.css`) use a locally scoped warm-neutral set: ink `#1f1a17`, canvas `#faf8f4`, hairline `#ebe5dc`, brand `#2c140c`, accent `#b85c1e`, gold `#d4af37`. Radii are 14px and 10px, and page titles are in Playfair at weight 700.

The two worlds share only Inter as a body face and a saffron family of hues (`#b85c1e` on the public site, `#c2410c` in the console). They are different values and must not be interchanged.
