# Phase 02: Custom Pickers & Step Inputs
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Implement each individual `Step` component with all esoteric, customized inputs.

## Why This Phase Exists
"Normal" selects and date pickers break the mystical mood. We need custom components for DOB (Wheel/Drum if possible, or nicely styled grid), Gender, Theme grids, Preset questions, and Spread radio cards with mini card visuals.

## Scope
### In Scope
- Step 1: Input name (floating label). Gender Dropdown (with icons). DOB Drum-style selector (simplified scrolling columns or grid if scroll is too complex for web, but maintain the ritual feel).
- Step 2: Theme Select (Love, Career, Finance, etc.). Highlight chosen card.
- Step 3: Question text area (with char counter) and Preset tabs.
- Step 4: 1/3/5/7/10 Spreads UI cards + Description updating for selected spread.

### Out of Scope
- Passing state upward completely integrated (will mock callbacks for now). Focus is on visual rendering and internal interaction of the steps.

## Implementation Steps
1. [x] Build `InputFloatLabel` and `GenderDropdown`.
2. [x] Build `DobDrumPicker` (React functional component simulating the triple scroll list logic and overlay effect).
3. [x] Build `ThemeCardGrid` for step 2.
4. [x] Build `QuestionTabs` (Suggestions vs Custom) in step 3.
5. [x] Build `SpreadCardRadio` for step 4, visually laying out the tiny rectangles representing the spread arrangement.

## Acceptance Criteria
- [x] Name input glows and moves its label when text entered.
- [x] DOB allows selecting Day, Month, Year effectively on mobile and desktop.
- [x] The "Spread" UI renders correctly with 5 different mini-card visual configurations matching the reference design.
