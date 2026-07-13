---
name: AA-hub
description: Minimalized enterprise accounting web app for FTU student practice.
---

<!-- SEED: re-run $impeccable document once there's code to capture the actual tokens and components. -->

# Design System: AA-hub

## 1. Overview

**Creative North Star: "The Academic Accounting Hub"**

The system is designed to provide a highly professional, focused, and clean environment for FTU accounting students. It prioritizes clarity and precise data entry, utilizing a restrained color palette anchored by FTU's signature red and white. Motion is responsive but never distracting, aimed solely at confirming user actions without slowing down the workflow. We draw structural inspiration from best-in-class financial and productivity tools like Quickbooks, Xero, and Linear, completely avoiding the flashy, overwhelming visuals of marketing websites or the cluttered chaos of legacy ERPs like MISA SME.

**Key Characteristics:**
- Uncluttered, data-first layout.
- Clear visual hierarchy prioritizing numbers, tables, and input forms.
- Crisp, single sans-serif typography.
- FTU red used intentionally for primary actions and brand presence.

## 2. Colors

**The Restrained FTU Rule.** The interface relies on a clean, professional white background with FTU Red serving as the deliberate primary accent. Color must never compete with the financial data.

### Primary
- **FTU Red**: [to be resolved during implementation] - Used for primary CTAs, critical highlights, and brand identity.

### Neutral
- **Professional Whites & Grays**: [to be resolved during implementation] - Used for backgrounds, surfaces, text, dividers, and borders to create a low-noise canvas.

## 3. Typography

**Direction:** A single, clean sans-serif family optimized for data density and application UI.
**Fonts:** [font pairing to be chosen at implementation]

**Character:** Modern, highly legible, and objective. It must render numerical data perfectly with clear tabular alignment in reports.

## 4. Elevation

The interface is fundamentally flat by default. Depth and shadows are used sparingly and only as a response to state (hover, focus) or to elevate critical overlay elements like modals, dropdowns, and dialogs.

## 5. Components

[To be populated after implementation. Run `$impeccable document` once codebase exists to extract actual component tokens.]

## 6. Do's and Don'ts

### Do:
- **Do** maintain a strict, data-focused layout inspired by Quickbooks, Xero, and Linear.
- **Do** use the FTU Red accent sparingly (≤10% of the surface) to guide the user's eye to primary CTAs.
- **Do** ensure interactive elements provide smooth, responsive feedback without choreographic delays.

### Don't:
- **Don't** use flashy, vibrant colors or gradients that belong on a marketing website; they cause severe distraction during data entry.
- **Don't** clutter the interface with irrelevant modules or complex navigation trees like traditional MISA SME.
- **Don't** use decorative animations that slow down the user workflow or hide data behind transitions.
