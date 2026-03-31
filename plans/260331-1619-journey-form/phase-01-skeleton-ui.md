# Phase 01: Skeleton & Navigation UI
Status: ✅ Complete
Dependencies: None

## Objective
Build the overarching React modal structural layer (`JourneyFormModal.tsx`) containing the backdrop, glassmorphic panel, progress dots, and Next/Prev logic wrapped in `framer-motion` `AnimatePresence`.

## Why This Phase Exists
Without a solid wrapping structure and smooth sliding animations, the "ceremony" vibe is lost. Establishing the multi-step `useState` and Framer animations up front ensures we can drop components in freely later.

## Scope
### In Scope
- `JourneyFormModal` parent structure.
- `framer-motion` setup (`variants` for left/right slide entry).
- Progress Header (current step out of 4).
- Container for rendering dynamic steps.
- Export to use in `page.tsx` or `BackgroundLayers`.

## Requirements
### Functional
- [x] User can click Next/Prev and trigger correct animation direction (X axis translation).
- [x] Progress UI updates accordingly.
- [x] Responsive modal (max-w-xxl, full height on mobile if necessary).

## Implementation Steps
1. [x] Create `/src/app/components/landing/JourneyFormModal.tsx`.
2. [x] Define state: `step` (1-4), `direction` (1 or -1).
3. [x] Set up `<AnimatePresence initial={false} custom={direction}>` wrapping a `motion.div`.
4. [x] Build the Glassmorphic Panel UI (`bg-black/60 backdrop-blur-md border border-[rgba(201,168,76,0.3)]`).

## Files to Create/Modify
- `src/app/components/landing/JourneyFormModal.tsx` - Core container.

## Acceptance Criteria
- [x] Modal correctly appears with blur background.
- [x] Hardcoded mock steps properly slide in/out when clicking Next/Prev.
