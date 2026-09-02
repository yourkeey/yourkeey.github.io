---
name: taste-skill
description: Curated aesthetic taste, refined editorial typography, bespoke color harmonies, and elimination of cookie-cutter frontend styling.
---

# Taste Skill: High-Aesthetic Design Guidelines

This skill guides the aesthetic direction, palette selection, visual depth, and distinct personality of the interface.

## 1. Palette & Color Harmonies
- **Dark Elegance (OLED Obsidian Palette):**
  - Base Ground: `#080B10` (deep ink black)
  - Subtle Surface: `#0E131B`
  - Elevated Card: `#141C27`
  - Floating Popover: `#1A2433`
  - Precision Border: `rgba(255, 255, 255, 0.07)` with high-light top edges `rgba(255, 255, 255, 0.12)`
- **Accents with Purpose:**
  - Emerald Tea: `#10B981` (primary action / success)
  - Golden Honey: `#F59E0B` (metrics / warmth)
  - Electric Cyan: `#06B6D4` (system telemetry / badges)
  - Soft Slate: `#94A3B8` / `#64748B` for secondary text

## 2. Typography with Personality
- Avoid boring single-font monotony. Use a 3-tier font system:
  1. **Display:** Space Grotesk / Outfit for commanding section headings.
  2. **Body:** Plus Jakarta Sans / Inter for razor-sharp readability.
  3. **Code & Metrics:** JetBrains Mono for telemetry, prices, and IDs.

## 3. Visual Texture & Polish
- Subtle noise overlays or micro-dot background grids (`radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px) 0 0/24px 24px`).
- Ambient backdrop glows behind hero sections and major interactive modules (`filter: blur(80px)`).
- Crisp glassmorphic reflections with `backdrop-filter: blur(12px)`.

## 4. Anti-Patterns to Avoid
- ❌ No radioactive multi-color neon text on low-contrast backgrounds.
- ❌ No flat 1px solid gray borders without lighting hierarchy.
- ❌ No empty lifeless hero sections without clear proof of engineering depth.
