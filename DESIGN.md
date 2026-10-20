---
name: Lumotive
description: Precision optics rendered as a bright laser inside a dark technical lab.
colors:
  brand-blue: "#0078d0"
  brand-blue-dark: "#0063ad"
  brand-green: "#00a651"
  brand-amber: "#ffb114"
  brand-red: "#ee0000"
  brand-green-text: "#008742"
  brand-amber-text: "#9f6a00"
  ink: "#0d1526"
  panel: "#0a1226"
  background: "#f3f4f7"
  surface: "#ffffff"
  text: "#4b5565"
  muted: "#7c8698"
  border: "#e2e5ec"
typography:
  display:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6.2vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 1.03
    letterSpacing: "0.005em"
  statement:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.8vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.08
  heading:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 3vw, 2.4rem)"
    fontWeight: 600
    lineHeight: 1.15
  subheading:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.7vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.15
  lead:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  eyebrow:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.14em"
  spec:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  button: "0.5rem"
  card: "1rem"
  panel: "1.5rem"
  pill: "9999px"
spacing:
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
  section-md: "5rem"
  section-lg: "7rem"
  section-xl: "9rem"
components:
  button-primary:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "0.9rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.brand-blue-dark}"
    textColor: "{colors.surface}"
    rounded: "{rounded.button}"
  header-cta:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  hero-primary-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.75rem"
  card-standard:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "2rem"
  panel-dark:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "clamp(2rem, 5vw, 4rem)"
  eyebrow:
    textColor: "{colors.brand-blue}"
    typography: "{typography.eyebrow}"
  spec-label:
    textColor: "{colors.muted}"
    typography: "{typography.spec}"
  input-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.button}"
    padding: "0.8rem 0.9rem"
---

# Design System: Lumotive

## Overview

**Creative North Star: "The Light Lab"**

Lumotive's visual system should feel like precision engineering observed inside an optical laboratory. Dark navy panels are the lab: controlled, technical spaces that frame mechanisms, media, specifications, and decisive calls to action. Bright blue is the laser: a focused signal for action, active information, and the path through dense technical content.

The system is spacious but not soft. Oswald supplies a compressed, industrial display voice; Poppins keeps explanations, labels, and navigation calm and highly legible. White cards and cool-gray page fields create the clean bench around the dark apparatus. Green, amber, and red are measured spectral accents rather than competing brand voices.

**Key Characteristics:**
- High-contrast dark technical stages set into a cool, quiet page field.
- Focused blue actions and data cues, supported by sparse spectral accents.
- Condensed display type paired with a neutral geometric body face.
- Firm rounded geometry, thin borders, and short, exact hover lifts.
- Generous section rhythm with compact labels and specification typography.

## Colors

The palette moves between cool laboratory neutrals and saturated optical signals.

### Primary
- **Laser Blue** (`colors.brand-blue`): Primary actions, links, active data, card accents, and the focused beam within dark laboratory scenes.
- **Deep Laser Blue** (`colors.brand-blue-dark`): Hover state for blue actions and links.

### Secondary
- **Signal Green** (`colors.brand-green`): Secondary data series and rotating card or statistic accents.
- **Optical Amber** (`colors.brand-amber`): Eyebrows on dark media, focus outlines, and the warm point in the spectral accent cycle.
- **Emitter Red** (`colors.brand-red`): Sparse, high-energy bento accents; never a default action color.

### Neutral
- **Optical Ink** (`colors.ink`): Strong headings and foreground text on light surfaces.
- **Lab Navy** (`colors.panel`): Heroes, technical panels, CTAs, and the footer.
- **Cool Field** (`colors.background`): Default page background and quiet nested surfaces.
- **Instrument White** (`colors.surface`): Cards, menus, form fields, and elevated reading surfaces.
- **Slate Text** (`colors.text`): Default body copy.
- **Muted Slate** (`colors.muted`): Supporting copy, captions, and secondary labels.
- **Calibration Line** (`colors.border`): Dividers, quiet outlines, and structural separators.

**The Laser Is Rare Rule.** Blue marks the route, action, or measurement; do not turn it into ambient decoration across an entire screen.

**The Spectral Accent Rule.** Green, amber, and red may distinguish adjacent data or cards, but they never compete with blue for the primary action. When an accent colours **text**, use its text-safe variant — **Signal Green Text** (`colors.brand-green-text`, 4.62:1 on white) or **Optical Amber Text** (`colors.brand-amber-text`, 4.63:1); the bright accents (3.19:1 and 1.82:1) are for bars, fills, and icons only.

## Typography

**Display Font:** Oswald (system UI and sans-serif fallback)
**Body Font:** Poppins (system UI and sans-serif fallback)

**Character:** Oswald makes headings compact, technical, and decisive. Poppins keeps navigation, explanatory copy, labels, and specs neutral enough for engineering detail.

### Hierarchy
- **Display** (`typography.display`): Hero statements and the rare, largest section introductions. Full-height heroes tighten this role to a 0.9 line-height and -0.055em tracking, often in uppercase.
- **Statement** (`typography.statement`): Major section propositions and centered CTA headlines.
- **Heading** (`typography.heading`): Standard section headings and dark-panel titles.
- **Subheading** (`typography.subheading`): Card titles and compact content groups.
- **Lead** (`typography.lead`): Introductory paragraphs and primary explanatory copy; keep blocks near 38rem to 48rem where layouts allow.
- **Body** (`typography.body`): Default reading and component copy.
- **Eyebrow** (`typography.eyebrow`): Uppercase context labels with deliberate tracking; blue on light surfaces, amber or translucent white over dark media.
- **Spec** (`typography.spec`): Compact values, technical metadata, captions, and badges.

**The Two-Voice Rule.** Oswald states; Poppins explains. Do not introduce a third typographic voice or use Poppins to imitate display type.

## Layout

Content sits within a 93.75rem shell, with narrow reading content capped at 47.5rem. Standard containers retain 1.5rem side gutters, tightening to 1rem below 640px. CMS sections use 5rem vertical padding by default, with established 2.5rem, 7rem, and 9rem variants; keep that large-scale rhythm instead of stacking local margins.

Layouts collapse deliberately rather than merely shrinking. Two-column sections become one column below 768px; card grids progress from one column to two and then three or four; the desktop navigation becomes the full-height mobile panel below 1100px. The declared desktop reference is 1200px. Media and copy may alternate, but reading order returns to media then copy on small screens.

## Elevation & Depth

Depth is mostly tonal: white instruments sit on the cool page field, while Lab Navy creates recessed technical stages. A single diffuse card shadow (`0 18px 40px -24px rgb(13 21 38 / 40%)`) appears on menus, stacked surfaces, dialogs, and card hover. Resting cards are usually shadowless. Gradients on heroes and CTA backdrops control legibility and direct light; they do not simulate glossy material.

### Shadow Vocabulary
- **Card lift** (`0 18px 40px -24px rgb(13 21 38 / 40%)`): Menus, dialogs, stacked cards, and interactive-card hover.
- **Mobile action scrim** (`0 -1rem 1.5rem var(--color-surface)`): Separates the sticky mobile CTA from scrolling navigation.

**The Exact Lift Rule.** A responsive control may rise 2px and a card 4px; add the one card shadow, never a stack of ornamental shadows.

## Shapes

The form language is precise with controlled softness. Buttons and inputs use the compact button radius; cards use the larger card radius; immersive technical containers use the panel radius. Pills are reserved for global CTAs, tags, and short spec chips. Thin one-pixel borders define tables, menus, and comparison surfaces. Media clips to the same radius as its container, except inside dark split panels where square media edges intentionally reinforce the instrument-panel feel.

**The Radius Has Rank Rule.** Radius increases with structural scale: control, card, then panel. Do not apply panel rounding to small controls or turn every container into a pill.

## Components

### Buttons
- **Primary:** Laser Blue fill, Instrument White text, firm 0.5rem corners, medium-to-semibold Poppins, and compact vertical padding.
- **Header CTA:** A 3rem-high blue pill used once as the persistent contact action.
- **Hero / inverse primary:** Instrument White pill on a dark field with Optical Ink text; supporting links remain unfilled with an arrow cue.
- **Hover / focus:** Shift blue to Deep Laser Blue or lift the control 2px. Keyboard focus uses a 3px Optical Amber outline with a 4px offset. Reduced motion removes translation and transition.

### Cards / Containers
- **Standard card:** Instrument White, 1rem corners, 2rem internal padding, no border by default. Interactive cards rise 4px and gain the card-lift shadow.
- **Spec panel:** 1.5rem outer corners, Calibration Line border, Cool Field media stage, and an Instrument White specification row.
- **Dark technical panel:** Lab Navy, 1.5rem corners, responsive 2rem-to-4rem padding, white headings, and supporting copy at reduced white opacity.

### Inputs / Fields
- **Style:** Instrument White fill, 0.5rem corners, one-pixel cool border, and 0.8rem by 0.9rem internal padding.
- **Focus:** Three-pixel translucent focus halo plus the primary border color; validation copy sits directly beneath the field.

### Navigation
- Desktop labels are compact Poppins at medium weight with generous hit areas and blue hover text. The sticky header uses a translucent white surface, subtle bottom border, and 16px backdrop blur. Popovers use card geometry and the card-lift shadow. Below 1100px, navigation becomes a full-height white drawer with staggered entry and a sticky contact CTA.

### Labels & Specifications
- Eyebrows are uppercase, tracked context labels. Use blue on light surfaces and amber or translucent white on dark media.
- Specs use the compact spec role for values and metadata. Short standalone specifications may become bordered or filled pills; dense product information belongs in aligned definition lists or tables.

## Do's and Don'ts

### Do:
- **Do** use Lab Navy as a purposeful technical stage for heroes, mechanism panels, CTAs, and the footer.
- **Do** keep Laser Blue concentrated on actions, links, active data, and small accent bars.
- **Do** preserve the established control-card-panel radius hierarchy and the 5rem default section rhythm.
- **Do** respect reduced-motion preferences by removing reveals, hover translation, smooth scrolling, and autoplaying decorative motion.

### Don't:
- **Don't** spread every spectral accent through the same component; one blue, green, amber, or red signal is enough.
- **Don't** put permanent shadows on every card; tonal separation is the resting state and elevation signals interaction.
- **Don't** soften the system with oversized pill cards, diffuse gradients, or floaty spring motion.
- **Don't** replace compact technical labels with oversized marketing type or mix Oswald into body copy.
