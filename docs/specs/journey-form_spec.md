# Spec: Journey Form Modal (Mystical 4-Step Flow)

## Executive Summary
This feature introduces a highly polished, interactive 4-step modal ("Nghi thức Bắt Đầu Hành Trình") used to collect user inputs for a personalized Tarot reading. It emphasizes a mystical atmosphere and ceremony, closely mimicking the psychological flow and UI of the "Tarotoo" reference.

## Goal and Non-Goals
- **Goal:** Create a 4-step wizard modal (Personal Info -> Theme -> Question -> Spread) with smooth transitions, custom UI pickers (date drum, card layouts), and mystical UI aesthetics. Output structured `FormData` upon completion.
- **Non-Goals:** Complex AI prompt generation right inside the form; actual backend sync (will only hold local React state for now). The "Focus Screen" is the end point of this flow, but the AI integration happens afterward.

## Actors / Roles
- **Guest / Authenticated User**: Engages with the form to start a Tarot session.

## Core Flows
1. **Open Modal**: User clicks "Bắt Đầu Hành Trình".
2. **Step 1 (Năng Lượng)**: User enters Name, selects DOB (via custom drum picker), and Gender.
3. **Step 2 (Lĩnh Vực)**: User selects a core theme (e.g., Love, Career).
4. **Step 3 (Câu Hỏi)**: User picks a preset question or writes a custom text question.
5. **Step 4 (Kiểu Trải Bài)**: User selects spread layout (1, 3, 5, 7, 10 cards) with visual card representations.
6. **Submit**: Form triggers `onSubmit(formData)` which pushes the app into the "Focus Screen" (15-second meditation).

## Edge Cases / Failure States
- User tries to skip Name: Block next step, show glowing red border.
- User accidentally closes modal: Ask for confirmation if form is partially filled.
- Mobile keyboard pushing modal up: Ensure the modal is scrollable and inputs stay accessible.

## UI Components / Screens
1. `JourneyFormModal` (Wrapper & Framer Motion Anim Context).
2. `StepProgressIndicator` (Top dot line).
3. `StepPersonalInfo` (Input, DrumPicker - Date of Birth, Custom Dropdown).
4. `StepTheme` (Grid of glassmorphic cards).
5. `StepQuestion` (Tabs, Textarea, Preset Buttons).
6. `StepSpread` (Radio cards with mini-card graphics).

## Acceptance Criteria
- [ ] Modal opens smoothly with glassmorphism overlay.
- [ ] User can navigate between the 4 steps (Next/Prev) with Framer Motion slide animations.
- [ ] DOB Drum Picker replicates the iOS scroll wheel feel but with mystical styling.
- [ ] Data state is centrally managed and correctly structured.
- [ ] Clicking "Mở Bài" at step 4 properly logs out the consolidated form data object.
