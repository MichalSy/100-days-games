# Day 017 Game Generation Prompt

## Game identity

- Day: 017
- Title: Kumo Silverweb Starcatcher
- Slug: kumo-silverweb-starcatcher
- Public route word: kumo
- Mode: hybrid
- Genre: mobile-first spatial silk-web tension puzzle arcade / star-catching score chase
- Mood/style: moonlit cedar canopy above a quiet shrine, silver spider-silk arcs, violet-blue night mist, pearl dew stars, tiny friendly kumo webkeeper, lacquer-red anchor posts, soft lantern glow, delicate plucked-string feedback; spatial web-tension play rather than pottery sculpting, bamboo water routing, origami folding, rainy sheltering, snow stacking, textile stamping, cooking, windbell tuning, rail running, or vehicle flight.

## Why this game today

The generated series currently ends with:

- Day 014 `hybrid`: origami paper-layer route planning with mountain/valley folds, crane route preview, seals, stress, and reinforcement.
- Day 015 `2d`: bamboo canal water-routing with tile rotations, basin requests, drought, overflow, and moss patching.
- Day 016 `3d`: pottery wheel sculpting with ring selection, vessel profile matching, glaze/carve placement, wobble/crack risk, and kiln heat controls.

The latest generated mode is one `3d`; the latest 2D streak is zero. Day 017 chooses a meaningful `hybrid`: a readable portrait-first canvas/DOM game with real depth-layer gameplay where silk strands can be anchored on near/mid/far layers, tension changes bounce arcs, and falling dew-stars interact with the web differently depending on strand depth and tightness. This is not a flat route grid or decorative perspective; decisions must depend on strand endpoints, z-layer, sag/tension, catch timing, rebound direction, and moth hazards crossing layers.

Recent visual variety notes to avoid repeating:

- Day 014 used a pale washi sheet, dashed fold lines, origami crane, green cutting mat, and paper stress.
- Day 015 used bright bamboo-grove greens, square canal tiles, water beads, moss basins, drought/overflow HUD, and tanuki helper.
- Day 016 used warm amber pottery studio lighting, a centered spinning clay vessel, ring chips, ash-blue glaze, and kiln heat controls.

Day 017 should shift to cool moonlit vertical space: suspended silver silk strands between lacquer-red cedar posts, depth shadows, dew-star droplets falling through layers, moon-moth hazards, lantern cups, and a friendly kumo webkeeper. Avoid gridded boards, water channels, paper folds, clay vessels, ring sculpt controls, umbrellas/rain streaks, snow blocks, kimono cloth panels, cooking counters, wind ribbons, rail vehicles, and generic match-3 or runner layouts.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 014 `hybrid`, Day 015 `2d`, and Day 016 `3d`. The latest generated-mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 017 is `hybrid`. It must be meaningful spatial hybrid gameplay, not a flat 2D reskin:

- Use responsive static-browser HTML/CSS/JS with a canvas or DOM/canvas hybrid. Three.js is optional but not required if depth layers and spatial interactions are clear.
- Maintain at least three web depth layers: near, mid, and far. Strands and falling dew-stars have layer values and must only collide strongly with matching or adjacent layers.
- Web tension must affect gameplay: tight strands rebound dew-stars sharply, loose strands catch/hold them briefly, overloaded strands fray, and diagonal strands redirect droplets differently from horizontal strands.
- Player actions must manipulate spatial web state: choose two anchor knots, weave a strand, switch layer, tighten/slacken, pluck to release held dew, and mend frayed silk.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Weave and tune silver silk strands between shrine-canopy anchor posts so falling dew-stars bounce, settle, or glide into matching lantern cups before moon-moths fray the web.
- Win condition: Complete three webkeeper chapters — First Dew Net, Cedar Moon Bridge, and Starfall Festival — while reaching 3100 points to trigger “Kumo Moonweb Constellation”. After the constellation, continue into endless night commissions.
- Lose condition: Web integrity reaches 0%, three lantern patience tokens go dark, too many dew-stars fall below the canopy, or the night timer expires during a commission.
- Core loop:
  1. Start on a title/menu screen with Day 017 badge, mode badge “hybrid”, public route `/kumo/`, best score, best Moonweb time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly moonlit canopy stage with near/mid/far anchor posts, a few existing silk guide strands, falling dew-stars, lantern cups, moon-moth paths, and a tiny kumo webkeeper charm.
  3. A commission card requests web goals, for example: “Catch 4 pearl stars, fill 1 blue lantern, weave 2 mid-layer strands, keep integrity above 62%.”
  4. Player taps an anchor knot, then a second anchor knot, then chooses Weave to create a strand on the selected layer. The preview arc shows sag and expected bounce direction.
  5. Tighten raises rebound strength and reduces catch time; Slacken increases sag/catch time but risks overload. Layer Up/Layer Down changes selected strand depth. Pluck releases held dew-stars with a tiny WebAudio chime after user gesture.
  6. Dew-stars fall from moon gates. They sparkle by type: pearl, blue, gold. They collide with matching/adjacent layer strands, bounce toward lantern cups, or get held on slack silk until plucked.
  7. Moon-moths drift across near/mid/far lanes and fray strands they touch. Mend repairs selected silk but costs moon-thread charge gained from clean lantern fills.
  8. Completing a commission lights a shrine lantern, awards points, restores one patience token if needed, and unlocks the next web pattern.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kumo Moonweb Constellation time, longest clean-catch streak, highest endless commission, most dew-stars in one pluck, strongest integrity finish, and collected webkeeper badges in localStorage.
  - Include three authored chapters:
    - First Dew Net: two layers, three anchor pairs, slow pearl dew, one lantern cup, teaches anchor selection / Weave / Tighten / Slacken / Pluck.
    - Cedar Moon Bridge: adds far layer, blue lantern cup, first moon-moth lane, first Mend requirement, and diagonal strand redirection.
    - Starfall Festival: all three layers active, pearl/blue/gold dew-stars, two lantern cups, moth crossing warnings, overloaded slack strands, and tighter integrity target.
  - Deterministic Day 017 seed varies anchor post positions, dew-star spawn rhythm, lantern cup requests, moth lane timing, strand weak points, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Dew Net with no missed stars, trigger Moonweb Constellation under 200 seconds, pluck 6 held stars in one clean release, fill 20 lantern cups, complete a commission without Mend, finish an endless commission above 85% integrity.
  - Strategic scoring rewards planning: weave diagonal ramps before starfall, use slack strands to collect slow clusters, tighten launch strands for gold stars, switch layers to dodge moths, pluck held dew only when cups align, and mend only after high-value catches.
  - Endless mode after Moonweb Constellation adds denser dew rhythms, alternating lantern colors, extra moth lanes, fragile anchor knots, stricter integrity targets, and more layer-switch decisions without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: slow pearl dew, broad anchor knots, forgiving collision, one lantern, no integrity penalty during first guided weave.
  - 45-120 seconds: blue/gold dew types, first moth warning, layer selection, tight/slack tradeoffs.
  - 120-200 seconds: all layers active, overloaded strands, multi-cup requests, faster moths, stricter integrity.
  - 200+ seconds/endless: more simultaneous dew-stars, weaker silk zones, fewer free mends, same readable controls.
  - Keep mobile fair: anchor knots and strands must be thick, dew-stars and moths readable at 390x844, commission text short, 56px+ primary controls, no tiny hazard required for survival.
- Scoring/rewards:
  - Dew-star caught on correct layer strand: +55 points times combo tier.
  - Dew-star delivered to requested lantern cup: +145 points.
  - Clean pluck releases 3+ held stars into useful paths: +220 points.
  - Moth avoided by layer switch or timely mend: +90 points.
  - Commission complete above integrity target: +460 points and restore one lantern patience token.
  - Perfect no-fray commission: +540 points.
  - Kumo Moonweb Constellation: +1000 points and endless commissions unlock.
  - Dew-star missed below canopy: integrity -6%, combo reset.
  - Moth frays a strand: integrity -8%, strand tension drops.
  - Overloaded slack strand snaps: integrity -14%, selected strand removed, combo reset.

## Controls and layout

- Desktop:
  - Mouse click/tap: select anchor knot, select strand, action button, start/pause overlay button, or prompt link.
  - Drag from one anchor to another: preview a new strand if practical, but click-select plus Weave button is mandatory.
  - Arrow keys or WASD: move focus among anchors/strands.
  - 1/2/3 or Z/X/C: select far/mid/near layer.
  - W: Weave selected anchor pair.
  - T / Y: Tighten / Slacken selected strand.
  - Space or Enter: Pluck selected strand / start from menu.
  - M: Mend selected strand when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap large anchor knots to choose start/end. Tap existing strand to select it.
  - Use large Layer -, Layer +, Weave, Tighten, Slacken, Pluck, Mend, Pause, and Restart buttons.
  - Optional drag can preview strand arcs, but tap-select plus visible buttons is mandatory for reliability.
  - Tap commission/dew/moth chips for short explanations.
  - No virtual joystick. Interaction is anchor/strand selection, layer switching, weave, tune, pluck, mend, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact moon-thread HUD with score, best, lantern patience tokens, web integrity, current layer, combo, and time. Use crescent tabs and silk knots, not the recent pottery/water/paper chip layouts.
  - Below top: commission card with dew-star requests, lantern cup labels, layer requirement, integrity target, and progress ticks.
  - Center: moonlit canopy playfield with anchor posts, depth-layer shading, silk strands, dew-star paths, lantern cups, moth warnings, pluck pulses, and webkeeper mascot/charm.
  - Bottom: selected anchor/strand helper plus large web action controls. Controls must not cover anchor knots or dew-star paths.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, select two anchors, layer choice, weave/tighten/slacken, pluck, moth/mend, pause/restart must be visible.
  - Requests must combine text, icons, line style, layer labels, and cup labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kumo Silverweb Starcatcher”.
   - Shows Day 017 badge, mode badge “hybrid”, public route `/kumo/`, best score, best Moonweb time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
2. Tutorial text
   - Objective: “Weave silver strands, tune their tension, and guide falling dew-stars into shrine lantern cups.”
   - Anchors: tap two glowing anchor knots to preview a silk strand.
   - Layers: near, mid, and far strands catch different star paths; switch layer before weaving or tuning.
   - Tension: tight strands bounce; slack strands catch and hold; overloaded slack strands may snap.
   - Pluck/Mend: pluck held dew-stars toward cups; mend moth-frayed silk when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, lantern patience, web integrity, current layer, chapter name, combo, elapsed time, current commission, selected anchor/strand, moon-thread mend charge, Pluck readiness.
   - Pause/restart controls visible or immediately accessible.
4. Selected helper
   - Non-blocking helper showing selected anchor pair or strand, layer, tension level, sag, overload risk, moth threat, and expected bounce/catch effect.
   - Must not cover active anchors or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, prompt link.
6. Game-over/results overlay
   - Final score, best score, chapter reached, Moonweb Constellation status, clean-catch streak, dew-stars delivered, integrity finish, mastery badges, restart button.
7. Kumo Moonweb Constellation banner
   - Trigger once per run after all three chapters and 3100 score.
   - Non-blocking constellation animation: silk strands shimmer into a star map, shrine lanterns glow violet-blue, friendly kumo bows, moths drift away, pearl dew arcs upward; endless night commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: kumo webkeeper mascot, moonlit shrine canopy background, silverweb/dew/moth/icon sheet, and decorative lantern/anchor pieces. Canvas/SVG/DOM code may draw interactive anchor hitboxes, silk strands, collision paths, particles, tension overlays, depth labels, moth warnings, UI chrome, and simple WebAudio cues. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/017/assets/source/` and use optimized playable copies under `release/games/017/assets/`. Also copy optimized playable assets into `apps/day-017-kumo-silverweb-starcatcher/assets/` and the public alias `release/kumo/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny strand details that disappear at final in-game size, and keep webkeeper/dew/moth/lantern silhouettes distinct against cool moonlit backgrounds.

Generate or provide at least these final art assets:

1. Kumo webkeeper mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/017/assets/source/kumo-webkeeper-source.png`
   - Optimized path: `release/games/017/assets/kumo-webkeeper.png`
   - Imagegen2 prompt: “A charming friendly Japanese kumo spider-silk webkeeper mascot for a mobile hybrid browser puzzle arcade game, tiny cute shrine spider spirit with indigo haori, pearl dew charm, holding a silver silk spool and lacquer-red anchor hook, warm lantern smile, centered readable silhouette, transparent or plain pale moon background, no text, no watermark, sprite-friendly, high contrast at small size, not scary.”
   - Aspect ratio: square.
2. Moonlit shrine canopy / silverweb background source
   - Target: portrait-friendly background suitable behind a depth-layer silk web playfield with open readable center.
   - Archive path: `release/games/017/assets/source/kumo-canopy-source.png`
   - Optimized path: `release/games/017/assets/kumo-canopy.png`
   - Imagegen2 prompt: “A moonlit Japanese shrine cedar canopy for a portrait mobile silk-web starcatching puzzle game, lacquer-red anchor posts, soft violet-blue night mist, shrine lantern cups on branches, silver spider silk glints at the edges, pearl dew stars, open readable center area for interactive silk strands and falling droplets, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Silverweb, dew-star, moth, and UI icon sheet source
   - Target: square icon sheet for web actions, hazards, rewards, and UI decals.
   - Archive path: `release/games/017/assets/source/kumo-icons-source.png`
   - Optimized path: `release/games/017/assets/kumo-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese moonlit silk-web puzzle game: anchor knot, silver silk strand, tight tension icon, slack tension icon, pluck pulse, mend needle, pearl dew-star, blue dew-star, gold dew-star, moon-moth hazard, lantern cup, web integrity heart, Kumo Moonweb Constellation seal, transparent or plain pale moon background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas silk silhouettes, document the failure in `ai/postmortems/day-017.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the kumo webkeeper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot, crop margins, no unwanted text/watermarks, stable upright orientation, and that the silk-spool pose does not imply wrong gameplay direction.
- Verify control-to-motion alignment in-game: selecting anchor A/B must preview the intended strand; Layer +/- must visibly change depth styling; Tighten/Slacken must visibly change sag and bounce/catch behavior in opposite/readable ways; Pluck must release held dew toward the previewed arc; Mend must affect the intended frayed strand.
- For the background, verify the center play area remains readable after portrait mobile crop and does not hide anchor knots, silk strands, dew-stars, moths, lantern cups, commission card, helper, or controls.
- For the icon sheet, verify anchor, strand, tight/slack, pluck, mend, dew-star types, moon-moth, lantern cup, web integrity, and constellation seal are distinct at final HUD/button size and cannot be confused.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because the mechanic includes plucked silk and tension feedback, include lightweight WebAudio cues initialized only after a user gesture:

- A soft pluck tone when Pluck is used, with pitch based on strand tension.
- A glassy dew chime when a star lands in the correct lantern cup.
- A dull fray tick when a moth damages silk.
- A short constellation arpeggio when Kumo Moonweb Constellation triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction.

## Prompt page output

The archived `release/games/017/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 017 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static hybrid game under `apps/day-017-kumo-silverweb-starcatcher/`.
   - Integrate it into immutable release output under `release/games/017/`.
   - Create the public playable route under `release/kumo/`.
   - Use static HTML/CSS/JS with no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, anchor selection, layer switching, Weave, Tighten, Slacken, Pluck, Mend control presence, dew-star collisions, moth/fray feedback, WebAudio initialization after user gesture, generated screenshot, generated assets, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-017.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 017 is meaningful `hybrid` after Day 016 `3d`, with real depth-layer/tension gameplay where strand layer, tension, sag, dew-star type, moth layer, and collision/bounce/catch behavior matter.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable anchor/layer/weave/tension/pluck/mend controls, no forced landscape canvas, and 44px+ controls.
- Prompt is visible from gallery and release folder.
- `prompts/day-017.md` is copied exactly to `release/games/017/prompt.md` and `release/kumo/prompt.md`.
- `release/games/017/prompt.html` and `release/kumo/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kumo/index.html`, `release/kumo/prompt.html`, `release/kumo/screenshot.png`, and `release/kumo/assets/` exist and work.
- Gallery card for Day 017 shows prompt availability, generation duration, public `/kumo/` links, mode `hybrid`, and actual generated date.
- Screenshot exists at `release/games/017/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/017/assets/source/` and optimized assets exist under `release/games/017/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive web/dew/moth visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is optional/failsafe if unsupported.
- No console errors during desktop or mobile smoke. Add data-URI favicon links to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/016/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/017/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kumo/index.html, release/kumo/prompt.html, release/kumo/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-017.md release/games/017/prompt.md and cmp prompts/day-017.md release/kumo/prompt.md.
# Prompt HTML check: verify release/games/017/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /kumo/ route and verify menu, tutorial, gameplay start, canopy/web rendering, anchor selection, layer switching, Weave, Tighten, Slacken, Pluck, Mend control presence, dew-star collision/lantern feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls and readable HUD/commission/canopy playfield.
# Static screenshot check: inspect release/games/017/screenshot.png and release/kumo/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-017.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kumo/ and /kumo/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 017.
```
