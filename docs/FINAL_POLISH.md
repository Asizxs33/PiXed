# Final responsive polish — 2026-09-29

Fixed mobile navigation crowding with five primary actions and a More menu for Rooms, Progress and Workshop. Corrected the entrance logo alignment, narrow-screen header wrapping, long-name wrapping and bottom spacing. Setup transitions and adventure checkpoints now reset their scroll position; returning to the entrance and switching world pages use an immediate top reset. Companion name confirmation persists after saving. Returning from the edit-party shortcut to questions restarts the three-question sequence when necessary.

Validation: production build and git diff --check passed. Browser checked at 320x640, 390x844, 768x1024 and 1280x900; no document horizontal overflow. Verified hero-to-pet scroll reset, mobile More navigation, Workshop save confirmation, checkpoint reset, desktop/mobile catalog and return to entrance. Browser error/warning log was empty. Profiles remain local to the browser and online rooms remain unavailable.
