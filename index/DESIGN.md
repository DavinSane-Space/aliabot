---
name: Slabscan Cyber-Tech
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c3c5d9'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8d90a2'
  outline-variant: '#434656'
  surface-tint: '#b6c4ff'
  primary: '#b6c4ff'
  on-primary: '#00277f'
  primary-container: '#0057ff'
  on-primary-container: '#e5e8ff'
  inverse-primary: '#004ee7'
  secondary: '#82cfff'
  on-secondary: '#00344b'
  secondary-container: '#2d9acf'
  on-secondary-container: '#002d41'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#676969'
  on-tertiary-container: '#e9e9e9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001550'
  on-primary-fixed-variant: '#003ab2'
  secondary-fixed: '#c6e7ff'
  secondary-fixed-dim: '#82cfff'
  on-secondary-fixed: '#001e2d'
  on-secondary-fixed-variant: '#004c6b'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
  surface-void: '#000000'
  surface-ink: '#191919'
  accent-electric: '#0057FF'
  accent-cyan: '#359FD4'
  glow-primary: rgba(0, 87, 255, 0.4)
  glass-border: rgba(255, 255, 255, 0.12)
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 80px
    fontWeight: '800'
    lineHeight: 90px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  data-mono:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style

This design system is engineered for high-performance, data-centric environments. It leverages a **Futuristic Glassmorphism** aesthetic, blending the precision of technical blueprints with the immersive depth of modern sci-fi interfaces. The visual narrative focuses on "clarity through complexity"—using layered transparency, atmospheric glows, and precise grid alignments to evoke a sense of premium power and sophisticated intelligence.

The target audience is tech-forward power users who value speed, data density, and a sleek, non-standard aesthetic. The emotional response should be one of being "ahead of the curve," utilizing a "Void-Space" concept where UI elements float in a deep, expansive dark vacuum, anchored by vibrant energy pulses (neon accents) and structural light-leaks.

## Colors

The palette is anchored in a high-contrast dark mode. **Surface-Void** (#000000) acts as the infinite background, while **Surface-Ink** (#191919) is used for structural containers and subtle depth separation.

**Electric Blue** and **Cyan** are the functional "energy" sources. Use Electric Blue for primary calls to action and critical status indicators. Cyan is used for secondary data visualizations, information clusters, and decorative glows. **White** is reserved strictly for high-priority text and "light-streak" accents.

Gradients should be used sparingly but impactfully, typically as a linear transition from Electric Blue to Cyan at a 135-degree angle to simulate directional light sources.

## Typography

This design system utilizes **Hanken Grotesk** as the primary typeface for its sharp, contemporary geometry and exceptional readability in high-contrast settings. It is used for all major headlines and body copy.

To reinforce the technical, data-driven nature of the platform, **Space Mono** is introduced for labels, metadata, and navigational elements. 

- **Display & Headlines:** Use tight letter spacing and bold weights to create a commanding presence. 
- **Data Points:** All numerical data and technical labels must use the `data-mono` or `label-caps` styles to ensure a structured, "computed" feel.
- **Contrast:** Large headings should often be paired with small, uppercase monospaced labels for a high-low visual hierarchy.

## Layout & Spacing

The layout is built on a **12-column fixed grid** for desktop and a **4-column fluid grid** for mobile. 

The rhythm is governed by a strict 8px base unit. Wide margins (64px+) on desktop are essential to preserve the "Void-Space" aesthetic, preventing the interface from feeling cluttered. Content should be grouped into distinct "modules" with clear vertical separation (typically 80px to 120px) to allow the atmospheric background glows to breathe.

Include a **subtle 32px or 64px background grid pattern** (1px strokes at 5% opacity) to provide a technical blueprint feel to the expansive background.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Backdrop Blurs** rather than traditional drop shadows.

- **Level 1 (Base):** Solid `#000000`.
- **Level 2 (Containers):** Background blur (24px) with a semi-transparent `#191919` fill at 60% opacity. Borders are 1px, solid, using `glass-border`.
- **Level 3 (Interactive):** Elevated glass surfaces with a subtle inner glow on the top edge to simulate a light source from above.
- **Atmospheric Depth:** Large, soft radial gradients of Cyan and Electric Blue are placed *behind* glass containers to create a sense of glowing hardware or floating displays.

## Shapes

The shape language is precise and controlled. We use a **Soft (0.25rem)** roundedness for standard components like input fields and buttons to maintain a "machined" look without being sharp or aggressive.

Large sections or cards may use **rounded-lg (0.5rem)**, but the system should avoid overly rounded or "pill" shapes, as they detract from the serious, technical tone. Geometric "chamfered" corners (45-degree cuts) are encouraged for decorative elements or primary image masks.

## Components

- **Buttons:** Primary buttons use a solid **Electric Blue** fill with a subtle outer glow (0px 0px 12px) of the same color. Secondary buttons use a transparent background with a 1px `glass-border` and white text.
- **Glass Cards:** Must utilize `backdrop-filter: blur(20px)` and a subtle gradient border that transitions from white (top-left) to transparent (bottom-right) at 15% opacity.
- **Input Fields:** Dark `#191919` background with a subtle bottom-border of `glass-border`. On focus, the border glows Cyan.
- **Glow Borders:** Specialized "Data Cards" should feature a thin 1px border that pulses or features a linear gradient of Electric Blue to Cyan.
- **Chips/Status:** Small, monospaced labels with high-contrast backgrounds (e.g., a "Live" tag with a pulsing Cyan dot).
- **Lists:** Rows separated by thin 1px lines (`glass-border`) with hover states that trigger a subtle brightness increase of the background glass layer.