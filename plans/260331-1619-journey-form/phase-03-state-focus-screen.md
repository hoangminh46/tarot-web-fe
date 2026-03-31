# Phase 03: Validation, State & Focus Screen
Status: ✅ Complete
Dependencies: Phase 02

## Objective
Wire up all 4 steps to single parent `useState` (the unified `FormData`). Implement block validation on Step 1 (Name is required). Link the final "Mở Bài" (Submit) button to hide the overlay and show the "Focus Screen".

## Why This Phase Exists
A form is useless without consolidated data and correct submission handling. The final piece of the "ceremony" is the 15-second Focus Screen overlay with text pulsating before the game loads.

## Scope
### In Scope
- Connect all child components to `onChange={updateFormData}` in `JourneyFormModal.tsx`.
- Basic input validation (e.g., Name must not be empty).
- `FocusScreen` component (Full-screen black overlay, gold text pulsating, 15-second timeout, Skip button).
- Final `onSubmit` callback logging out complete Payload.

## Implementation Steps
1. [x] Wrap sub-components with props passing `formData` and `updateField`.
2. [x] Add a `disabled` state to the Step 1 Next button if Name is missing.
3. [x] Create `FocusScreen.tsx` with identical CSS animations to reference.
4. [x] Build the "Focus Sequence": Hide journey modal -> Show Focus Screen -> Wait/Skip -> Invoke placeholder `read_cards()` action.

## Acceptance Criteria
- [x] Attempting to Next past Step 1 without Name will focus the input or shake the button.
- [x] Changing fields updates parent React state properly.
- [x] Clicking Mở Bài hides form, shows Focus Screen with the deeply personal Question rendered in gold italics.
- [x] 15s passes (or clicking Skip) logs the complete User Object.
