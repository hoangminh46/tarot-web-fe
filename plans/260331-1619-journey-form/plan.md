# Plan: Journey Form Modal (Mystical 4-Step Flow)
Created: 2026-03-31 16:19
Status: 🟡 In Progress

## Overview
A 4-step wizard modal (Personal Info -> Theme -> Question -> Spread) designed as a "mystical ceremony" for the user to start their Tarot journey. This creates a deeply personal context for AI analysis later.

## Goal
- Build the complete `JourneyFormModal` flow with glassmorphism, specialized mystical pickers (drum dates, gender, spread types), and Framer Motion transitions, maintaining a central `FormData` object.

## Scope
### In Scope
- Overlay and multi-step UI wrapper (`AnimatePresence` slide transitions).
- Step 1: Personal Info (Name, Custom Date Drum Selector, Gender Select).
- Step 2: Theme Selector (Grid of Tarot Themes).
- Step 3: Question Input (Textarea + Preset Options).
- Step 4: Spread Selection (1, 3, 5, 7, 10 card visuals).
- Central State tracking and final "Focus Screen" hook trigger context.

### Out of Scope
- Actually generating the AI response inside the modal.
- Backend synchronization of User history.
- Real Focus Screen implementation (that comes *after* the modal successfully closes).

## Actors
- Guest / Authenticated User

## Core Entities
- `TarotSessionFormState`: `{ name, dob, gender, theme, sub_theme, question, spread }`

## Assumptions
- We will use Framer Motion for slide tracking (direction of slides for next/prev).
- We have the mystical tailwind base preset established.

## Risks
- The Drum Date Picker is complex to recreate flawlessly on web without native feeling clunky. We need a robust custom implementation or library. But for V1, we will implement a styled dropdown or a simplified custom CSS snapshot.
- Actually, the reference CSS uses `dob-drum`, `dob-drum__track`, which indicates a custom wheel. We might need specific drag logic.

## Acceptance Criteria
- [ ] User can walk through all 4 steps seamlessly.
- [ ] Modal retains state if they go back and forward.
- [ ] Form strictly verifies `Name` at step 1 before proceeding.
- [ ] Final object logged accurately on "Mở Bài" click.

## Phases

| Phase | Name | Status | Progress | Depends On |
|-------|------|--------|----------|------------|
| 01 | Skeleton & Navigation UI | ✅ Complete | 100% | - |
| 02 | Custom Pickers & Step Inputs | ✅ Complete | 100% | 01 |
| 03 | Validation, State & Focus Screen | ✅ Complete | 100% | 02 |

## Quick Commands
- Start current phase: `/code plans/260331-1619-journey-form/phase-01-skeleton-ui.md`
- Check progress: `/next`
- Visualize UI: `/visualize`
- Save context: `/save-brain`
