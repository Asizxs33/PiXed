# Four heroes, four companions

Iris (star maker) and Kai (forest keeper) join Luna and Max. Moss, a garden turtle, joins Nova, Byte and Orbit. The original SVG artwork adds a star cap and staff, a leaf headband and pack, inventor goggles, a leafy turtle shell, and independently moving accessories. Original palettes are shown in selection cards; the active party retains the player's chosen outfit palette.

## Useful differences

Every hero has an optional approach tip in all six practice adventures: clue-finding, step planning, trying a small example, or checking conditions.

- Nova: on request, disables one incorrect option. The correct option is never removed.
- Byte: opens a checkpoint-local planning textarea. Notes reset at the next question and are not sent to a server.
- Orbit: shows the reasoning behind the question before answering.
- Moss: opens a quiet pause, gentle breathing motion and a focus checklist. The player chooses when to continue.

Support is optional and does not alter reward rules. These are learning supports, not power or speed advantages. Every hero can pair with every companion. The selected duo appears together in the home stage, practice adventures and bridge lesson.

Workshop now exposes the complete roster directly. Changing a roster selection preserves the page position. Pet-name input synchronizes when switching companions. Existing girl/boy/fox/bot/owl profile IDs remain compatible; iris/kai/turtle are accepted by the existing local profile loader.

## Visual and interaction choices

- Selection cards show a role; a stable adjacent panel explains the selected benefit.
- Help remains next to the question and has a clear expanded state.
- Four-item grids become two columns on mobile.
- Modal headers stay visible when the roster scrolls.
- Motion remains subtle and respects reduced-motion preferences.

These choices use [W3C guidance on consistent visual design](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p03-consistent-design/) and [clear relationships between controls and content](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p06-control-actions/). They are design guidance, not a claim of accessibility certification or learning-outcome validation.

## Verification

- TypeScript and Vite production build.
- Workshop switching among new and existing heroes/pets.
- Reload with Kai and Moss preserved both selections.
- Mobile onboarding selected Iris and retained Moss through completion.
- Nova removed one incorrect answer, kept the correct answer enabled, and reset on the next checkpoint.
- Byte accepted a note and cleared it on the next checkpoint.
- Orbit displayed the correct explanation before answering.
- Moss displayed the pause and three focus prompts; Iris displayed her distinct approach tip.
- Mobile roster visual review and no horizontal overflow on the home screen.
- No browser errors or warnings during the verified flows.
