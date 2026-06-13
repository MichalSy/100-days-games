# Day 004 Game Generation Prompt

## Game identity

- Day: 004
- Title: Hikari Firefly Cartographer
- Slug: hikari-firefly-cartographer
- Public route word: hikari
- Mode: 2D
- Genre: mobile-first path-drawing arcade puzzle / light-routing score chase
- Mood/style: quiet summer shrine garden at blue hour, glowing fireflies, ink-map overlays, warm paper lanterns, soft magical realism, readable portrait-phone game UI

## Why this game today

Day 001 and Day 002 were both 2D arcade games, while Day 003 deliberately broke that streak with a real 3D Three.js spatial ring-flight game. The latest generated-mode streak in `src/data/games.ts` is therefore one `3d` game, so Day 004 may return to 2D without violating the 3D cadence rule.

Day 004 should still avoid feeling like another simple top-down collection game. It uses a different interaction vocabulary: the player draws short glowing route strokes on a moonlit map to guide wandering fireflies into lantern constellations. The core challenge is spatial planning and timing: route strokes fade, shadows erase light, and lanterns ask for fireflies in color/order patterns. This makes the game mobile-native and tactile rather than keyboard-first.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 001 mode `2d`, Day 002 mode `2d`, and Day 003 mode `3d`.

Mode decision: Day 004 is allowed to be `2d` because the current 2D streak is zero after Day 003. To preserve variety, it must differ strongly from Days 001-003 by focusing on drawn light paths, pattern routing, and portrait touch control rather than vehicle steering, delivery, or 3D ring flight.

Day 005 should consider 3D or hybrid again if Day 004 causes a new 2D streak, but Day 004 itself is valid as a mobile-first 2D entry.

## Design

- Objective: Draw temporary glowing trails that guide colored fireflies from drifting groves into matching shrine lanterns before the garden clock reaches dawn.
- Win condition: Complete three lantern constellations and reach 1800 points to trigger “Hikari Dawn Map”. After winning, continue into endless score chase with faster shadows and rarer rainbow fireflies.
- Lose condition: The dawn timer expires before the current constellation is completed, or the garden shadow meter fills because too many fireflies are lost to shadows.
- Core loop:
  1. Start on a title/menu screen with the Day 004 badge, objective, best score, and concise tutorial.
  2. Fireflies of different colors drift from groves around the garden.
  3. The player draws short luminous route strokes with mouse/touch; nearby fireflies follow the stroke direction like a flowing path.
  4. Lanterns around the map request specific colors or simple sequences, shown as large readable icons.
  5. Shadow cats, wind swirls, and dark puddles move through the garden and erase route strokes or scare fireflies unless avoided.
  6. Complete lantern requests to unlock the next constellation pattern and earn route ink refills.
  7. Use a limited “Moon Pulse” button to briefly freeze shadows and attract fireflies toward active strokes.
  8. Pause/restart are always available.
- 15+ minute play-value strategy:
  - Save best score, fastest Dawn Map time, highest constellation streak, and best endless wave in localStorage.
  - Include three handmade constellation phases: Lantern Triangle, River Bridge, and Dawn Spiral.
  - Randomize firefly spawn timing, shadow-cat patrols, and bonus rainbow firefly appearances from a deterministic Day 004 seed.
  - Add mastery badges: complete a constellation without losing fireflies, maintain a 10-delivery streak, finish Dawn Map under 150 seconds, score 3000 in endless.
  - Add combo scoring for consecutive correct deliveries without drawing wasteful extra strokes.
  - Add strategic tension: route ink is limited but refills on clean lantern deliveries; drawing sloppy paths reduces end-of-phase bonus.
- Difficulty scaling:
  - 0-45 seconds: two firefly colors, one slow shadow, generous lantern requests.
  - 45-110 seconds: three colors, moving wind swirls, lanterns ask for two-step sequences.
  - 110-180 seconds: four colors, faster shadows, puddles erase route segments, tighter timer pressure.
  - Endless mode: shadow speed and lantern pattern length increase every wave; rainbow fireflies can satisfy any color but are rare.
  - Keep mobile fair: large collision/attraction radii, clear paths, strong color+shape labeling for colorblind readability, no tiny text.
- Scoring/rewards:
  - Correct firefly delivered: +80 points.
  - Correct sequence completion: +220 points plus ink refill.
  - Wrong lantern bounce: -35 points and brief firefly confusion, not instant failure.
  - Firefly lost to shadow: shadow meter +12% and combo reset.
  - Efficient route bonus: +150 if a constellation is completed under the ink budget.
  - Hikari Dawn Map: +700 points and endless mode unlock.

## Controls and layout

- Desktop:
  - Mouse drag: draw a glowing route stroke. Strokes are short-lived and consume ink.
  - Space: Moon Pulse if charged.
  - P: pause/resume.
  - R: restart current run.
  - Enter/click: start from menu or confirm restart.
- Mobile/touch:
  - Drag on the garden to draw paths directly under the thumb/finger.
  - Large Moon Pulse button at the lower right, minimum 56px target.
  - Pause and Restart buttons with 44px+ targets.
  - Avoid virtual joysticks; the game is path-drawing first.
- Mobile layout/orientation:
  - Default target is portrait phone play at about 390x844; do not require landscape.
  - Canvas/garden should fill the central viewport with HUD at top and touch controls at bottom/edges.
  - Tutorial must fit on first portrait screen without critical controls below the fold.
  - HUD labels must be legible: score, timer, ink, shadow, combo, current request, and phase.
  - Request icons must be large enough to read on phone; combine color with simple shapes/labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Hikari Firefly Cartographer”.
   - Shows Day 004 badge, mode badge “2D”, public route `/hikari/`, best score, and fastest Dawn Map if available.
   - Shows primary Start button and a visible prompt link.
   - Shows “How to play” tutorial panel by default.
2. Tutorial text
   - Objective: “Draw glowing paths to guide fireflies into matching lantern constellations.”
   - Movement: mouse/touch drag draws short route strokes; fireflies follow nearby glowing strokes.
   - Lanterns: deliver requested colors/sequences to complete constellations.
   - Ink: strokes consume ink; clean deliveries refill it.
   - Shadows: cats, wind, and puddles erase paths or scare fireflies.
   - Moon Pulse: freezes shadows briefly and attracts fireflies to active strokes.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, dawn timer, ink meter, shadow meter, combo, current phase, current lantern request, Moon Pulse charge.
   - Pause and restart controls visible or accessible.
4. Pause overlay
   - Resume, restart, tutorial reminder, and controls summary.
5. Game-over/results overlay
   - Final score, best score, completed constellations, Dawn Map status, mastery badges, restart button.
6. Hikari Dawn Map banner
   - Trigger once per run after three constellations and 1800 score.
   - Non-blocking glow burst and map-completion animation, then endless play continues.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: character/background/sprites/icons/decorative pieces. Canvas code may animate, crop, alpha-clean, resize, composite, optimize, draw particles/strokes/UI chrome, and create debug/collision shapes; it should not create final character/background/icon art from scratch unless Imagegen2 is truly unavailable after a real attempt.

Archive source generated art under `release/games/004/assets/source/` and use optimized playable copies under `release/games/004/assets/`. Also copy optimized playable assets into `apps/day-004-hikari-firefly-cartographer/assets/` and the public alias `release/hikari/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid tiny details that disappear at final in-game size, and keep high-contrast silhouettes.

Generate or provide at least these final art assets:

1. Firefly keeper / map charm sprite source
   - Target: transparent PNG, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/004/assets/source/firefly-keeper-source.png`
   - Optimized path: `release/games/004/assets/firefly-keeper.png`
   - Imagegen2 prompt: “A small cute firefly cartographer charm for a mobile browser arcade game, Japanese summer shrine mood, tiny cloak shaped like a folded map, glowing lantern staff, warm golden firefly aura, centered readable silhouette, transparent or plain dark background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Moonlit shrine garden background source
   - Target: portrait-friendly or center-crop-safe background suitable for a phone game canvas.
   - Archive path: `release/games/004/assets/source/moon-garden-source.png`
   - Optimized path: `release/games/004/assets/moon-garden.png`
   - Imagegen2 prompt: “A moonlit Japanese shrine garden at blue hour for a portrait mobile game, stone paths, pond edge, paper lantern posts, soft hydrangea and bamboo silhouettes, open readable center play area, warm firefly glow, painterly but clean, no characters, no text, no watermark, crop-safe with important details away from edges.”
   - Aspect ratio: portrait.
3. Lantern/firefly/icon sheet source
   - Target: square icon sheet for UI and sprite decals.
   - Archive path: `release/games/004/assets/source/hikari-icons-source.png`
   - Optimized path: `release/games/004/assets/hikari-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a firefly light-routing arcade game: red firefly, blue firefly, gold firefly, violet firefly, rainbow firefly, paper lantern, moon pulse, shadow cat, wind swirl, dark puddle, ink droplet, dawn map burst, transparent or plain dark background, high contrast, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas assets, document the failure in `ai/postmortems/day-004.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the firefly keeper sprite, verify transparent/cutout quality or clean background removal, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, and a clear upright/facing direction.
- Verify control-to-motion alignment in-game: the keeper/charm and firefly sprites should not appear sideways while following paths or pulsing toward strokes.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide strokes/fireflies/lantern requests.
- For icon sheets, verify icons are distinct at final HUD/request size and hazards cannot be confused with collectibles.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Prompt page output

The archived `release/games/004/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 004 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-004-hikari-firefly-cartographer/`.
   - Integrate it into immutable release output under `release/games/004/`.
   - Create the public playable route under `release/hikari/`.
   - Use static HTML/CSS/JS and no backend.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, path drawing gameplay, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-004.md` after validation with what worked, what failed, generated-image inspection notes, and whether generator/template improvements are justified.

## Acceptance criteria

- Static build passes.
- Mode choice follows the cadence rule: after Day 003's `3d`, Day 004 may be `2d`; it must be clearly different through path-drawing/light-routing gameplay.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial, usable direct touch path drawing, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-004.md` is copied exactly to `release/games/004/prompt.md`.
- `release/games/004/prompt.html` renders the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/hikari/index.html`, `release/hikari/prompt.html`, `release/hikari/screenshot.png`, and `release/hikari/assets/` exist and work.
- Gallery card for Day 004 shows prompt availability, generation duration, public `/hikari/` links, and actual generated date.
- Screenshot exists at `release/games/004/screenshot.png` and is non-empty/readable.
- Image/source assets exist under `release/games/004/assets/source/` and optimized assets exist under `release/games/004/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; moving sprites/icons have verified cutout/background removal, direction/pivot/crop, readability, and control-to-motion alignment.
- No console errors during desktop or mobile smoke.
- Existing `release/games/001/**`, `release/games/002/**`, and `release/games/003/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/004/screenshot.png, prompt.md, prompt.html, index.html, release/hikari/index.html, release/hikari/prompt.html, release/hikari/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-004.md release/games/004/prompt.md
# Prompt HTML check: verify release/games/004/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>.
# Browser smoke: open the local/static /hikari/ route and verify menu, tutorial, gameplay start, path drawing, Moon Pulse, pause, restart, prompt link, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable touch drawing and readable HUD.
# Static screenshot check: inspect release/games/004/screenshot.png for non-empty readable game content.
# Docker/static smoke: build the Docker image locally, run it, curl /hikari/ and /hikari/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 004.
```
