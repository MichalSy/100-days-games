# Day 007 Game Generation Prompt

## Game identity

- Day: 007
- Title: Nami Bento Tide Kitchen
- Slug: nami-bento-tide-kitchen
- Public route word: nami
- Mode: 2D
- Genre: mobile-first time-management puzzle arcade / conveyor-lane cooking score chase
- Mood/style: bright seaside Japanese bento stall at late morning, teal waves, lacquer trays, warm rice steam, cute kitchen charm, tactile drag-and-tap play, cheerful but skillful portrait-phone UI

## Why this game today

The current generated series in `src/data/games.ts` is:

- Day 001 `2d`: calm koi pond collection and drift survival.
- Day 002 `2d`: 2D timed delivery route planning.
- Day 003 `3d`: neon bonsai ring-flight crafting.
- Day 004 `2d`: firefly path drawing / light routing.
- Day 005 `3d`: dream-rail lane runner.
- Day 006 `hybrid`: 3D moonbeam/prism alignment puzzle.

The latest generated mode is Day 006 `hybrid`, so there is no active 2D streak. Day 007 may be 2D without violating cadence, but it must feel unlike the existing 2D entries. This game uses a new interaction vocabulary: fast order reading, ingredient lane management, drag/tap sorting, short-term memory, and combo routing inside a compact cooking station. It is not a vehicle game, not path drawing, not light routing, not 3D ring/rail movement, and not top-down survival.

Recent screenshot variety notes:

- Day 004 was a dark moonlit garden with fireflies and direct path drawing.
- Day 005 was a deep-blue 3D rail corridor with bottom lane buttons.
- Day 006 was a cool cyan/gold 3D observatory board with prism rotation controls.

Day 007 should shift the series into a warmer, brighter, food-craft palette: seafoam teal, lacquer red, rice cream, pickled yellow, nori green, and coral accents. The screen should read like a cozy seaside kitchen counter, with moving tide/conveyor lanes, customer/order cards, and large thumb-friendly ingredient trays.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general web/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 004 `2d`, Day 005 `3d`, and Day 006 `hybrid`. The latest generated 2D streak is zero.

Mode decision: Day 007 is `2D`, intentionally chosen after two non-flat entries to provide a tactile mobile-first arcade puzzle. The design must still be rich and game-like, not a static clicker or simple matching demo:

- Use a responsive 2D canvas or DOM/canvas hybrid with animated ingredient lanes, tray slots, customer order cards, hazards, feedback bursts, and score/state transitions.
- Gameplay must depend on timing and spatial placement: ingredients drift on tide belts; players drag or tap them into tray slots in the requested sequence before customers leave.
- Portrait mobile is the default supported layout; no landscape gate.
- The next day is free to choose 2D/3D/hybrid based on the future cadence, but after Day 007 the latest 2D streak will be one.

## Design

- Objective: Assemble accurate bento orders by catching ingredients from tide conveyors and placing them into lacquer tray slots before the customer patience timer empties.
- Win condition: Complete three service waves — Morning Ferry, Lunch Bell, and Festival Rush — and reach 2400 points to trigger “Nami Grand Bento Service”. After that, continue in endless rush mode for score chasing.
- Lose condition: The stall receives three complaint shells from wrong ingredients, missed orders, or letting the tide spoil too many ingredients.
- Core loop:
  1. Start on a title/menu screen with Day 007 badge, mode badge “2D”, public route `/nami/`, best score, best Grand Service time, tutorial, prompt link, and large Start button.
  2. Customer order cards appear at the top with large ingredient icons and color/shape labels.
  3. Ingredients float in from left/right on two or three animated tide conveyor lanes in the center.
  4. Player taps an ingredient then taps a tray slot, or drags the ingredient directly into the slot. Correct ingredients snap in with a satisfying steam/chime burst.
  5. Finished trays are served automatically when all requested slots are filled in order, awarding combo and patience bonuses.
  6. Hazards and modifiers appear: greedy crabs steal exposed ingredients, rogue wave splashes shuffle one lane, and wasabi decoys look tempting but cause complaints if placed incorrectly.
  7. Use the “Calm Tide” special when charged to slow conveyor movement, reveal order hints, and push crabs away briefly.
  8. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Grand Service time, highest clean-order streak, and endless wave in localStorage.
  - Include three authored service waves:
    - Morning Ferry: two-slot orders, slow tide, rice/tamago/nori basics, no decoys for the first few orders.
    - Lunch Bell: three-slot orders, two simultaneous customers, first crabs, wasabi decoys, quicker patience drain.
    - Festival Rush: four-slot orders, lane shuffle waves, bonus golden shrimp, tighter combo windows, customer priority decisions.
  - Deterministic Day 007 seed varies order sequences, crab timing, bonus ingredient appearances, and lane speeds while keeping early orders fair.
  - Mastery badges: complete Morning Ferry without a complaint, serve 12 clean orders in a row, trigger Grand Service under 170 seconds, reach 4200 in endless.
  - Strategic scoring rewards clean and fast service: sequence accuracy, patience remaining, combo chains, unused Calm Tide, and bonus ingredients matter.
  - Endless mode after Grand Service adds more simultaneous customers and faster tide belts but keeps ingredients large and readable on mobile.
- Difficulty scaling:
  - 0-45 seconds: one customer, two-slot orders, slow lanes, large tray slots.
  - 45-105 seconds: two customers, three-slot orders, crabs begin crossing, decoys appear rarely.
  - 105-170 seconds: faster lanes, wave-shuffle events, four-slot festival orders, customer priority choices.
  - 170+ seconds/endless: denser order queue, more crabs/decoys, shorter patience timers, but no tiny objects required for survival.
  - Keep mobile fair: ingredients at least 42px visual size, tray slots at least 50px, touch targets 56px+, forgiving drop radii, strong icon silhouettes, and short labels for colorblind readability.
- Scoring/rewards:
  - Correct ingredient placed: +35 points times combo tier.
  - Complete order: +170 points plus patience bonus up to +120.
  - Perfect sequence order: +90 bonus and +12% Calm Tide charge.
  - Golden shrimp bonus ingredient: +160 if placed in a wildcard garnish slot.
  - Complete service wave: +360 and remove one complaint shell if below max complaints.
  - Nami Grand Bento Service: +800 and endless mode unlock.
  - Wrong ingredient: complaint meter +1 shell fragment, combo reset, ingredient returns to tide if possible.
  - Spoiled/missed ingredient: small patience penalty, not instant failure.

## Controls and layout

- Desktop:
  - Mouse click/tap: select ingredient or tray slot.
  - Mouse drag: drag ingredient into tray slot.
  - Arrow keys / A-D: move selection focus between visible ingredients/tray slots for keyboard accessibility.
  - Space or Shift: activate Calm Tide when charged.
  - P: pause/resume.
  - R: restart current run.
  - Enter/click: start from menu or confirm restart.
- Mobile/touch:
  - Tap ingredient then tap target tray slot, or drag ingredient directly; both must work.
  - Large Calm Tide button near lower right, at least 56px target.
  - Pause and Restart controls with 44px+ targets.
  - No virtual joystick. The interaction is direct tap/drag sorting.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact HUD with score, best, complaints, wave, combo, Calm Tide meter.
  - Below HUD: customer order cards with large icons and patience bars.
  - Center: tide conveyor lanes with readable ingredients and crab hazards.
  - Bottom: active bento tray slots plus large Calm Tide / Pause / Restart controls.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, ingredient placement, hazards, and special power must be visible.
  - Ingredient icons must combine art, color, silhouette, and short labels such as RICE, NORI, EGG, FISH, SHRIMP, PICKLE so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Nami Bento Tide Kitchen”.
   - Shows Day 007 badge, mode badge “2D”, public route `/nami/`, best score, best Grand Service if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Catch tide ingredients, fill each bento order in sequence, and keep customers happy.”
   - Placement: tap/drag ingredients into matching tray slots.
   - Orders: customer cards show the needed ingredient sequence and patience bar.
   - Hazards: crabs steal ingredients, rogue waves shuffle lanes, wasabi decoys cause complaints if served incorrectly.
   - Calm Tide: slows lanes and pushes crabs away when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, complaints shells, current wave, orders served, combo, Calm Tide charge, elapsed time.
   - Pause/restart controls visible or immediately accessible.
4. Customer/order overlay
   - Order cards remain readable on mobile and never hide the active tray.
   - The currently recommended next ingredient should pulse subtly after two seconds of inactivity.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, wave reached, Grand Service status, clean-order streak, mastery badges, restart button.
7. Nami Grand Bento Service banner
   - Trigger once per run after all three service waves and 2400 score.
   - Non-blocking sunny wave sparkle, tray seals stamp into place, customers cheer; endless play continues after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: mascot/chef charm, seaside kitchen background, ingredient/icon sheet, customer/order decorative pieces. Canvas/SVG/DOM code may animate, crop, alpha-clean, resize, composite, optimize, draw particles, collision rings, UI chrome, tray slot outlines, tide lane masks, and debug shapes. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/007/assets/source/` and use optimized playable copies under `release/games/007/assets/`. Also copy optimized playable assets into `apps/day-007-nami-bento-tide-kitchen/assets/` and the public alias `release/nami/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid tiny details that disappear at final in-game size, and keep high-contrast silhouettes.

Generate or provide at least these final art assets:

1. Bento chef / tide kitchen mascot source
   - Target: transparent PNG, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/007/assets/source/nami-chef-source.png`
   - Optimized path: `release/games/007/assets/nami-chef.png`
   - Imagegen2 prompt: “A small cute seaside Japanese bento chef mascot for a mobile browser arcade cooking game, wave-pattern apron, tiny lacquer tray, warm rice steam, seafoam teal and coral accents, centered readable silhouette, transparent or plain light background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Seaside bento stall background source
   - Target: portrait-friendly background suitable for a phone game cooking counter.
   - Archive path: `release/games/007/assets/source/nami-kitchen-source.png`
   - Optimized path: `release/games/007/assets/nami-kitchen.png`
   - Imagegen2 prompt: “A bright seaside Japanese bento stall counter for a portrait mobile arcade game, ocean waves beyond the stall, lacquer trays, bamboo baskets, rice steam, warm late-morning sunlight, open readable center area for conveyor lanes and tray UI, seafoam teal, rice cream, lacquer red, coral accents, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Bento ingredient icon sheet source
   - Target: square icon sheet for ingredients, hazards, and UI decals.
   - Archive path: `release/games/007/assets/source/nami-ingredients-source.png`
   - Optimized path: `release/games/007/assets/nami-ingredients.png`
   - Imagegen2 prompt: “Small readable icon sheet for a cute bento tide kitchen arcade game: rice ball, nori strip, tamago egg, salmon fish, shrimp, pickle, wasabi decoy, golden shrimp bonus, crab hazard, rogue wave, calm tide shell, complaint shell, lacquer bento tray, customer ticket, transparent or plain light background, high contrast, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas assets, document the failure in `ai/postmortems/day-007.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the chef mascot, verify transparent/cutout quality or clean background removal, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, and a clear upright orientation.
- Verify control-to-motion alignment in-game: ingredients should move along tide lanes without appearing sideways or visually ambiguous, drag ghost offsets must align with the finger/cursor, and tray snap feedback must land on the correct slot.
- For the background, verify the center lane/tray area remains readable after portrait mobile crop and does not hide ingredients, order cards, crabs, or tray slots.
- For the icon sheet, verify ingredients are distinct at final 42-56px size and hazards/decoys cannot be confused with valid order ingredients or golden bonuses.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/007/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 007 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-007-nami-bento-tide-kitchen/`.
   - Integrate it into immutable release output under `release/games/007/`.
   - Create the public playable route under `release/nami/`.
   - Use static HTML/CSS/JS with no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, customer orders, ingredient drag/tap placement, Calm Tide, crabs/waves/decoys, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-007.md` after validation with what worked, what failed, generated-image inspection notes, code-isolation confirmation, and whether generator/template improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 007 is allowed as 2D because the latest 2D streak is zero after Day 006 hybrid, and it strongly differs through cooking/order-management gameplay.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/order cards, usable tap/drag controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-007.md` is copied exactly to `release/games/007/prompt.md`.
- `release/games/007/prompt.html` renders the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/nami/index.html`, `release/nami/prompt.html`, `release/nami/screenshot.png`, and `release/nami/assets/` exist and work.
- Gallery card for Day 007 shows prompt availability, generation duration, public `/nami/` links, and actual generated date.
- Screenshot exists at `release/games/007/screenshot.png` and is non-empty/readable.
- Image/source assets exist under `release/games/007/assets/source/` and optimized assets exist under `release/games/007/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; moving/interactive ingredient visuals have verified cutout/background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- No console errors during desktop or mobile smoke.
- Existing `release/games/001/**`, `release/games/002/**`, `release/games/003/**`, `release/games/004/**`, `release/games/005/**`, and `release/games/006/**` from origin/main remain unchanged.
- No existing release folder is modified unless listed in `release/regeneration-allowlist.json`.
- Do not delete `scripts/launch-nightly-hermes.sh`.
- Do not edit or delete files under `/home/aiko/.hermes/profiles/ryu/cron/100-days-games`.

## Exact validation commands

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm release:validate
pnpm test:smoke
pnpm test:immutable -- --base origin/main
```

Additional required local checks before push:

```bash
# Screenshot/static checks: verify release/games/007/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/nami/index.html, release/nami/prompt.html, release/nami/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-007.md release/games/007/prompt.md
# Prompt HTML check: verify release/games/007/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>.
# Browser smoke: open the local/static /nami/ route and verify menu, tutorial, gameplay start, ingredient tap/drag placement, customer order completion, Calm Tide, pause, restart, prompt link, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap/drag controls and readable HUD/order cards.
# Static screenshot check: inspect release/games/007/screenshot.png for non-empty readable game content.
# Docker/static smoke: build the Docker image locally, run it, curl /nami/ and /nami/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 007.
```
