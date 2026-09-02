---
name: impeccable
description: Standards for frontend craftsmanship, visual polish, precision layout rhythm, and micro-interactions. Eliminates generic AI slop.
---

# Impeccable Frontend Craftsmanship Guide

This skill enforces high-end design engineering, eliminating generic "AI template slop", flat borders, awkward spacing, and lack of tactile feedback.

## 1. Visual Hierarchy & Spacing Rhythm
- **Consistent Spacing Scale:** Use a strict 4px/8px modular grid (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`).
- **Optical Balance:** Compensate for visual weight. Icons with text should be aligned to cap-height, not bounding box.
- **Card Depth & Elevation:** Multi-layered shadows with soft ambient falloff:
  ```css
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 
              0 8px 24px -4px rgba(0, 0, 0, 0.6), 
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
  ```

## 2. Micro-interactions & Tactility
- **Spring Physics:** Avoid linear transitions. Use cubic-bezier easing:
  `cubic-bezier(0.16, 1, 0.3, 1)` for snappy, natural motion.
- **Active States:** Subtle scale down on click (`transform: scale(0.98)` or `active:translate-y-0.5`), instant feedback (<16ms).
- **Surface Hover Glow:** Interactive cards should react to mouse movement with subtle radial sheen highlights.

## 3. Typography Rules
- **Proportional Contrast:** Distinct scale ratios (1.25x - 1.33x) between headers and body text.
- **Line Length & Tracking:** Body text constrained to 55–75 characters per line (`max-w-prose`), tighter tracking (`-0.02em` to `-0.03em`) on large display headers, open tracking (`+0.05em`) on small uppercase labels.
- **No Orphan Words:** Use `text-wrap: balance` on headings and `text-wrap: pretty` on body paragraphs.

## 4. Craft Checklist
- [x] No raw Tailwind CDN in production layouts without custom refinement
- [x] Every button has `:hover`, `:active`, `:focus-visible`, and `:disabled` states
- [x] Smooth scrollbar styling matching surface background
- [x] High-contrast accessible text (WCAG AAA for body, AA for secondary)
- [x] Tactile interactive states with instant visual validation
