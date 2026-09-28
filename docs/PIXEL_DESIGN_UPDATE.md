# Pixel world refinement

The entrance keeps most of the archipelago visible. A small lower-left title replaces the large central text. The same muted teal, cream and sage palette connects setup, characters and the game library.

## Artwork and motion

- Two original SVG heroes on a 64-pixel grid: Luna and Max, with complete bodies, boots, cloaks and satchels.
- Three original companions: Nova the fox, Byte the robot and Orbit the owl.
- Separate idle tracks for breathing, blinking, head movement, cape movement, tail movement, wings and floating.
- Original 20-pixel navigation and action icons; English font subsets are bundled locally.
- An archway containing the existing landscape replaces the rotating neon rings and white flash.
- Game illustrations preserve their original square tile proportions. One featured card and two secondary cards provide larger artwork without stretching.

## Flow and behavior

Name, age, optional gender and subject appear on separate screens, with Back controls retaining values. Each of the three preference questions requires a choice and an explicit Next action. The result describes choices made today rather than a permanent psychological assessment. Heroes and companions are not restricted by gender.

Profiles remain local to the browser; this is not server account registration. Code Quest opens an introductory four-step loop activity, with short/long feedback and a success explanation. Math Run and Logic Arena remain marked as upcoming. The introductory activity does not award persistent XP or coins.

## Verification

- TypeScript and production bundle: `pnpm build`.
- First-time setup completed through all four details, three choices, hero, companion and game hub.
- Returning local profile opens the hub after entry; character editing retains profile data.
- Mobile 390 × 844: three companions visible, no horizontal overflow, fixed bottom navigation.
- Desktop 960px and 1440px layouts inspected; square artwork measured.
- Code activity: one move produces corrective feedback; four moves reach the goal.
- Browser console: no errors or warnings during the verified flow.
- Reduced-motion CSS and Framer Motion configuration included; keyboard entry and dialog tab containment included.

## References consulted

- [W3C: Multi-page forms](https://www.w3.org/WAI/tutorials/forms/multi-page/): logical steps, progress and preserving previous entries.
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion): respect the user's motion preference.
