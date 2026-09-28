# Connected player world

This update supersedes the three-card catalogue described in PIXEL_DESIGN_UPDATE.md.

The original six game themes are restored in a compact three-column desktop catalogue and two-column mobile catalogue. Previews crop a proportional square source rather than stretch it. Each currently implements a short solo learning exercise, not the original proposed multiplayer mechanic.

## Working paths

- Entrance → Create your player → four personal-detail steps → three preference questions → hero → companion → world.
- Existing profile → Continue → Home, Games, Quests, Rooms, Progress, Workshop or Profile.
- Profile editing supports previous steps and revisiting questions. Editing preserves the outfit and a custom companion name if the same pet is retained.
- Every practice mode has three questions, locked answers after selection, explanations, and a final score.
- Saved best scores determine XP and coins. Lower-scoring replays cannot reduce progress or farm rewards. The bridge reward is boolean and counted once.
- Workshop changes the outfit palette and pet name. All renderings use the selected palette.
- Rooms and profile explicitly explain the lack of online rooms and server accounts. No fake players or global rankings are displayed.

## Verification

- Production TypeScript/Vite build passes.
- Browser-tested all six adventures with 3/3 results; each explanation and completion path works.
- Replayed Capture the Flag with 0/3: previous 3/3 and 180 XP remained unchanged.
- Completed the coding bridge: total increased to 220 XP and 66 coins after all six perfect runs.
- Reload verified progress, ocean outfit, companion name and completed achievements persisted.
- Edited profile through all details and three questions; learner type updated, custom name and outfit retained.
- Back navigation on details retained the nickname.
- Math filter returned exactly two cards.
- Mobile 390 × 844: Home, Games, Quests, Rooms, Profile and Workshop examined; no horizontal overflow.
- Desktop catalogue and navigation visually reviewed.
- No browser errors or warnings in the tested flow.

No cloud authentication or online multiplayer is implemented in this update. Browser-local storage can be cleared by the user or browser.
