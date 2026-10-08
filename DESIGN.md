---
name: Luminous Sanctuary
colors:
  surface: '#fcf8ff'
  surface-dim: '#dad6ff'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2ff'
  surface-container: '#efebff'
  surface-container-high: '#e9e5ff'
  surface-container-highest: '#e3dfff'
  on-surface: '#181445'
  on-surface-variant: '#464555'
  inverse-surface: '#2d2a5b'
  inverse-on-surface: '#f3eeff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#434853'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b606b'
  on-tertiary-container: '#d7dbe8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#dee2ef'
  tertiary-fixed-dim: '#c2c6d3'
  on-tertiary-fixed: '#171c25'
  on-tertiary-fixed-variant: '#424751'
  background: '#fcf8ff'
  on-background: '#181445'
  surface-variant: '#e3dfff'
typography:
  display-lg:
    fontFamily: Roboto Flex
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Roboto Flex
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: 0px
  headline-lg-mobile:
    fontFamily: Roboto Flex
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0px
  headline-md:
    fontFamily: Roboto Flex
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Roboto Flex
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.15px
  title-lg:
    fontFamily: Roboto Flex
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0px
  title-md:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.15px
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.25px
  body-md:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.25px
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Roboto Flex
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an empathetic, luminous, and emotionally intelligent digital sanctuary. Designed for an AI-powered emotional journaling experience, the interface balances Google Material Design 3 (M3) architectural rigor with organic softness, warmth, and intimate clarity.

The emotional tone balances mindful safety with optimistic introspection. Users arrive to reflect, process, and decompress; therefore, visual tension is minimized through harmonious chromatic layering, generous negative space, gentle fluid transitions, and tactile feedback. The design avoids cold clinical diagnostics, framing AI sentiment analysis instead as a compassionate, validating mirror. The aesthetic combines M3's dynamic tonal surface containers with luminous elevation, soft pill contours, and emotive chromatic accents.

## Colors

The core system relies on deep indigo (`#4F46E5`) for primary actions, vivid violet (`#6366F1`) for interactive focus states and expressive iconography, and calming soft lavender (`#EEF2FF`) as a structural tonal container. The neutral ground is tinted with a deep night-indigo (`#1E1B4B`) for high-contrast, non-jarring readability.

### Emotional Mood Semantic Palette
These tokens represent sentiment states, paired with tinted surface containers to preserve accessible text contrast (WCAG AAA for body text, AA for graphical indicators):
- **Joy / Gratitude:** `#F59E0B` (Warm Gold) | Surface container: `#FEF3C7` | Text: `#78350F`
- **Peace / Serenity:** `#10B981` (Mint / Emerald) | Surface container: `#D1FAE5` | Text: `#064E3B`
- **Melancholy / Contemplative:** `#3B82F6` (Sky Blue) | Surface container: `#DBEAFE` | Text: `#1E3A8A`
- **Tension / Release:** `#F43F5E` (Soft Coral) | Surface container: `#FFE4E6` | Text: `#881337`
- **Vitality / Flutter:** `#EC4899` (Lovely Rose) | Surface container: `#FCE7F3` | Text: `#831843`

### Surface Architecture
Surfaces follow M3 tonal elevation over stark white canvases:
- **Surface (Base Canvas):** `#F8FAFC`
- **Surface Container Low:** `#F1F5F9`
- **Surface Container:** `#FFFFFF`
- **Surface Container High:** `#EEF2FF`
- **Outline Variant:** `#E0E7FF`

## Typography

The typographic hierarchy relies on `Roboto Flex` for its adaptive legibility, variable weight precision, and clinical-yet-friendly personality suited for introspection.

Line height across body text is intentionally relaxed to `26px` on `16px` bases to reduce cognitive fatigue during prolonged writing sessions. Headings utilize medium and semi-bold weights rather than heavy black styles to preserve an approachable, quiet ambiance.

For internationalization and multi-lingual pairing (particularly East Asian typography), fallbacks map cleanly to `Pretendard`, ensuring uniform line-height boxes and vertical centering metrics across mixed script journal entries.

## Layout & Spacing

The layout structure leverages a fluid responsive 12-column grid on desktop, scaling to an 8-column layout on tablet, and a 4-column stack on mobile viewports.

- **Desktop (≥ 1200px):** 12 columns, max-width container of `1280px`, `gutter: 1.5rem`, `margin: 2rem`. AI feedback panes and diary entry flows can sit comfortably side-by-side (7:5 split).
- **Tablet (600px - 1199px):** 8 columns, `gutter: 1rem`, `margin: 1.5rem`. Lateral panels collapse into modal bottom sheets or sequential step drawers.
- **Mobile (< 600px):** 4 columns, `gutter-sm: 1rem`, `margin-sm: 1rem`. Bottom navigation replaces top-level sidebars, anchoring primary journaling triggers to thumb-friendly reach zones.

Component gaps and inner card paddings adhere strictly to an 8pt spatial rhythm (represented by the `space-*` scale), ensuring consistent vertical cadence across stream feeds and writing canvases.

## Elevation & Depth

Visual depth follows the Material Design 3 elevation system, enhanced with soft, chromatic ambient shadows tinted with subtle indigo tones (`rgba(79, 70, 229, 0.06)`) rather than dead neutral grays.

- **Elevation 0 (Flat):** Canvas background (`#F8FAFC`), structural separators, or disabled states. No shadow; defined by subtle borders (`1px solid #E0E7FF`).
- **Elevation 1 (Cards, Low Priority Panels):** `0px 2px 8px -1px rgba(79, 70, 229, 0.05), 0px 1px 3px 0px rgba(0, 0, 0, 0.02)`. Accompanied by a `1px` outline tinted with `#EEF2FF`.
- **Elevation 2 (Interactive Cards, Filter Menus, Hover States):** `0px 8px 16px -2px rgba(79, 70, 229, 0.08), 0px 3px 6px -1px rgba(0, 0, 0, 0.03)`.
- **Elevation 3 (AI Insight Drawers, Floating Action Buttons, Dialogs):** `0px 16px 32px -4px rgba(79, 70, 229, 0.12), 0px 6px 12px -2px rgba(0, 0, 0, 0.04)`.
- **Elevation 4 (Modal Backdrops & Scrim Overlays):** Ambient blur `backdrop-filter: blur(12px)` paired with a soft scrim overlay (`rgba(30, 27, 75, 0.25)`).

## Shapes

The interface employs a rounded shape language (`roundedness: 2`), reflecting approachable warmth without becoming overly juvenile.

- Standard buttons, text fields, and list tiles adopt `0.5rem` (`8px`) corner radiuses.
- Content cards, sentiment grouping tiles, and diary entry modules adopt `rounded-lg` (`1rem` / `16px`).
- AI Analysis containers, full-screen sheets, and floating modal containers use `rounded-xl` (`1.5rem` / `24px`).
- Filter chips, mood selectors, tag toggles, and Floating Action Buttons (FABs) utilize continuous pill geometry (`rounded-full` / `9999px`) to maintain tactile delight.

## Components

### Buttons
- **Filled Primary:** Rounded pill (`9999px`) or `0.5rem`, `#4F46E5` background, `#FFFFFF` label text. Elevation 1 rising to Elevation 2 on hover. Active press triggers a subtle inner scale down (`scale(0.98)`).
- **Tonal (Secondary):** Tinted `#EEF2FF` background with `#4F46E5` label text. Borderless.
- **Outlined:** `1px` solid border (`#E0E7FF`), transparent background, `#4F46E5` text.

### Sentiment & Emoji Chips
- Compact pill-shaped tokens (`rounded-full`) with a height of `36px`.
- Unselected: Tinted white surface, `1px` border of `#E0E7FF`, displaying emoji and mood title.
- Selected: Smooth background shift into the corresponding emotion pastel container (e.g., `#FEF3C7` for Joy), border transitions to mood primary (`#F59E0B`), text darkens to container contrast spec. Subtle `scale(1.05)` micro-spring animation on tap.

### AI Feedback & Analysis Cards
- Dual-tier structural cards with `rounded-xl` radiuses.
- Background uses a soft gradient wash transitioning from `#FFFFFF` down to `#EEF2FF` at a 135-degree angle.
- Top banner houses a micro-badge with an animated subtle shimmer for AI processing states.
- Accompanied by low-saturation pastel accent strokes on the left border (4px width) matching the dominant sentiment detected.

### Cards (Diary Log)
- Elevation 1 resting state, transitioning to Elevation 2 on desktop hover with a `-2px` vertical translation.
- Top header includes semantic mood badge, timestamp in `label-sm` (`#64748B`), and a context menu.
- Bottom actions provide quick-reaction tags and private lock indicators.

### Input Fields
- Filled variant with an M3 style bottom-stroke or full border container with `0.5rem` radius.
- Background: `#FFFFFF`. Resting border: `1px solid #E0E7FF`.
- Focus state: `2px solid #4F46E5` with an ambient glow (`box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15)`).
- Journal body text area supports distraction-free edge-to-edge layout without visible borders until hovered or focused.

### Checkboxes & Radio Buttons
- Rounded `4px` corner for checkboxes, fully circular for radio buttons.
- Inactive: `#CBD5E1` border stroke.
- Checked: `#4F46E5` solid fill with crisp `#FFFFFF` checkmark or center pip. Micro-bounce transition curve on selection toggle.
