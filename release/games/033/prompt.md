# Day 033 Game Generation Prompt

## Game identity

- Day: 033
- Title: Uchiwa Fan Dye Maestro
- Slug: uchiwa-fan-dye-maestro
- Public route word: uchiwa
- Mode: 2D
- Genre: mobile-first radial pattern puzzle / paper-fan dye routing / craft-timing score chase
- Mood/style: bright summer festival fan workshop, washi paper ribs, indigo and coral pigment pools, gold lacquer rim, breezy paper shadows, dye capillary blooms, tiny cheerful kappa fanmaker helper, tactile brush/fold/dry feedback; direct 2D radial sector play and pigment-flow timing rather than 3D onsen steam routing, ikebana floral balance, mikan orchard harvesting, kumiko woodworking, foxfire stealth, matcha whisking, fireworks arcs, pachinko, mochi hopping, sumi calligraphy tracing, kite cartography, dry-garden raking, underwater oxygen, taiko rhythm lanes, daruma rolling, silk-web weaving, pottery shaping, bamboo canal irrigation, origami folding, rain parasols, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 030 `3d`: Mikan Sunwheel Orchard with sunny 3D citrus canopy, basket orbit/height, crate sorting, hornets, sunwheel beams, and yellow-green/orange UI.
- Day 031 `2d`: Botan Ikebana Balance Atelier with pale floral studio, suiban/kenzan, stems, peony blooms, negative-space silhouettes, freshness, and balance meters.
- Day 032 `3d`: Onsen Steamline Bathkeeper with blue-gold bathhouse, 3D pools, copper valves/ducts, steam ribbons, pressure, pool temperature, and macaque comfort.

The latest generated-mode streak is one `3d` (Day 032), so Day 033 may safely choose `2D` without extending a 2D streak. Day 033 deliberately switches from thermal 3D systems and soft floral balance to a flat-but-rich radial craft puzzle: stain sectors of an uchiwa paper fan, align stencil masks, route pigment along ribs, blot bleed before it crosses forbidden dry zones, fold the fan edge to redirect capillary flow, and use Kaze-Dry Focus to preview drying/bleed paths. It should feel like designing a handheld summer-festival fan under time pressure, not like another garden, bathhouse, orchard, or generic paint-by-number.

Recent screenshot/visual variety notes to avoid repeating:

- Day 032 used dark teal/copper onsen scenery, large 3D rectangular stage, circular pools, pipe/valve network, steam bubbles, pressure/temperature chips, and bottom tool controls.
- Day 031 used cream/pink ikebana studio, pale suiban canvas, stems/flowers/negative-space moon, soft rounded cream HUD cards, and floral helper art.
- Day 030 used sunny orchard, green 3D canopy, orange fruit, crates, hornets, sunwheel shafts, and warm yellow-green controls.

Day 033 should use a crisp paper-craft palette: off-white washi fan shape, radial bamboo ribs, indigo/coral/saffron pigment blooms, gold rim accents, translucent stencil sheets, breeze threads, drying gradients, tiny festival charms, and a cute kappa fanmaker helper. Avoid pools/steam/valves/macaques, flowers/vases/stems, citrus trees/crates/hornets, wood lattice/clamps, torii/foxfire/stealth cones, matcha bowls/foam, fireworks/night sky, pachinko coins/cats, rabbits/mochi pads, sumi brush-scroll tracing, kite threads/star maps, raked sand/stone gardens, underwater pearl diving, taiko pads, tilt labyrinths, silk web anchors, pottery wheel profiles, bamboo irrigation grids, origami crease routes, parasol rain shelters, snow block stacking, kimono panel stamping, restaurant timers, or windbell note tuning.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 030 `3d`, Day 031 `2d`, and Day 032 `3d`. The latest generated-mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 033 is `2D`. This is allowed because it follows a 3D day and does not extend a 2D streak. The implementation must still be mechanically rich and visually polished:

- Use static-browser HTML/CSS/JS with a canvas-based or DOM/canvas hybrid fan workbench; no backend.
- Render a portrait-first radial uchiwa fan board with bamboo ribs, wedge sectors, pigment reservoirs, stencil masks, drying timers, bleed edges, blot cloth markers, fold hinges, breeze arrows, helper art, score particles, and clear mobile controls.
- Gameplay must depend on 2D spatial state: selected rib/sector, pigment color and saturation, capillary direction, wetness timer, stencil alignment, dry-zone protection, edge fold angle, blot cooldown, breeze strength, pattern symmetry, and commission goals.
- Player actions must manipulate the system: select sector/rib, rotate stencil, brush pigment, fold/unfold edge flaps, blot bleed, fan-dry a sector, swap pigment, use Kaze-Dry Focus to slow/preview drying and bleed paths, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Complete festival fan commissions by dyeing the correct radial sectors, preserving clean dry zones, aligning stencil silhouettes, and drying the paper before pigment bleeds across the bamboo ribs.
- Win condition: Complete three commissions — First Indigo Breeze, Goldfish Festival Arc, and Night-Market Firefly Fan — while reaching 4700 points to trigger “Uchiwa Grand Breeze”. After the banner, continue into endless fan commissions.
- Lose condition: Three paper hearts tear, bleed meter reaches 100%, the commission timer expires, too many protected dry zones are stained, or three fans warp from over-wetting in one run.
- Core loop:
  1. Start on a title/menu screen with Day 033 badge, mode badge “2D”, public route `/uchiwa/`, best score, best Grand Breeze time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly fan workbench. A large open uchiwa fan fills the center with 10-14 radial sectors, bamboo ribs, a gold rim, and visible paper-grain texture. A commission card sits above; pigment and tool controls sit below.
  3. A commission card requests goals such as: “Dye 3 indigo wave sectors, preserve 4 white breeze gaps, stamp 2 coral lantern stencils, keep bleed under 35%, finish with one Kaze-Dry Focus unused.”
  4. Player selects a fan sector/rib using large controls or direct taps. The active wedge glows and displays wetness, color, stencil match, and dry-zone risk.
  5. Brush Pigment applies the selected color to the active sector. Pigment spreads along the paper grain and bamboo rib edges; correct sectors score, wrong sectors raise bleed/tear risk.
  6. Rotate Stencil shifts the current mask motif (wave, lantern, goldfish, firefly, moon stripe) around the fan. Stencil alignment controls which sectors accept pigment cleanly and which are protected.
  7. Fold Edge bends a fan edge flap, redirecting capillary flow and protecting one adjacent dry zone, but over-folding can crease/warp the paper.
  8. Blot Cloth removes wet bleed before it crosses a rib or protected dry zone. Blotting too early reduces color saturation; blotting too late causes paper tears.
  9. Fan Dry accelerates drying for one sector and locks clean edges, but it can push pigment downwind if used against wet neighboring sectors.
  10. Kaze-Dry Focus, charged by clean stencil matches and preserved dry gaps, slows wetness timers and overlays predicted bleed arrows, drying rings, stencil-safe zones, and symmetry hints for a short window.
  11. Completing a commission stamps a washi seal, restores one paper heart if needed, awards points, and unlocks narrower sectors, multi-color motifs, faster summer breeze, and stricter dry-gap goals.
  12. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Uchiwa Grand Breeze time, longest clean-sector chain, highest endless commission, lowest bleed finish, most preserved dry gaps, best symmetry score, most perfect blot windows, and collected festival fan seal badges in localStorage.
  - Include three authored commissions:
    - First Indigo Breeze: broad sectors, one indigo pigment, simple wave stencil, slow bleed, guided first brush, no paper-heart penalty during the first tutorial mistake.
    - Goldfish Festival Arc: adds coral and saffron pigments, goldfish stencil alignment, protected white gaps, Fold Edge, first Blot Cloth timing, and fan-dry caution.
    - Night-Market Firefly Fan: adds indigo night gradients, firefly dot motif, alternating ribs, faster breeze drift, required Kaze-Dry Focus preview, limited blot charges, and stricter symmetry.
  - Deterministic Day 033 seed varies sector count, stencil order, protected gaps, paper-grain direction, pigment spread speed, breeze gust timing, blot cooldown, fold effectiveness, dry windows, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Indigo Breeze with zero bleed warnings, trigger Grand Breeze under 270 seconds, complete Goldfish Festival Arc with 90%+ clean dry gaps, finish a commission without Blot Cloth, finish below 10% bleed, complete an endless fan with all paper hearts.
  - Strategic scoring rewards planning: align stencil before brushing, dye low-bleed sectors first, preserve white gaps deliberately, fold before brushing near protected edges, blot only when pigment approaches a rib, fan-dry after adjacent sectors are stable, save Kaze-Dry Focus for multi-color motifs, and accept a lower-saturation sector instead of risking a tear.
  - Endless mode after Grand Breeze adds narrower ribs, mixed pigments, variable breeze lanes, faster capillary spread, fewer blot charges, and asymmetric stencil requests without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: broad sectors, one pigment, slow bleed, visible tutorial arrow, forgiving dry gaps.
  - 45-145 seconds: two/three pigments, rotating stencils, protected gaps, Fold Edge and Blot Cloth timing.
  - 145-270 seconds: alternating ribs, faster breeze drift, limited blot charges, required Kaze-Dry Focus preview, stricter symmetry and dry-zone goals.
  - 270+ seconds/endless: faster wetness, narrower sectors, mixed motifs, shifting breeze lanes, same readable controls.
  - Keep mobile fair: fan sectors, ribs, pigment blooms, stencil masks, bleed arrows, dry gaps, commission card, helper, and action buttons must be large/readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical wedge taps.
- Scoring/rewards:
  - Correct sector brushed inside stencil: +125 points times combo tier.
  - Protected dry gap preserved for a scoring tick: +95 points.
  - Perfect stencil alignment before brush: +150 points and Kaze-Dry Focus charge.
  - Blot Cloth stops bleed in the sweet window: +145 points and bleed relief.
  - Fold Edge redirects flow without warp: +160 points.
  - Fan Dry locks a clean edge near target saturation: +135 points.
  - Symmetric motif pair completed: +260 bonus.
  - Commission complete below bleed target: +860 points and restore one paper heart if below max.
  - Perfect no-tear fan: +1120 points.
  - Uchiwa Grand Breeze: +2300 points and endless commissions unlock.
  - Wrong pigment/protected stain: combo soft-reset, bleed +8%, dry-gap score drops.
  - Paper tear/warp: paper-heart damage if threshold crossed, bleed +14%, combo reset.
  - Over-blotting: reduces saturation and lowers finish score.

## Controls and layout

- Desktop:
  - Mouse click/tap: press action buttons, select fan sectors/ribs, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the fan stage: optional radial sector selection preview; brushing must still require a clearly labeled Brush Pigment action unless the tutorial explicitly says tap-to-brush mode is active.
  - Arrow keys or A/D: select previous/next sector around the fan.
  - W/S or Up/Down: select inner/outer band or cycle active rib group.
  - Q/E: rotate stencil counterclockwise/clockwise.
  - 1/2/3: choose indigo, coral, or saffron pigment.
  - Space or Enter: Brush Pigment / confirm start depending on state.
  - F: Fold Edge.
  - B: Blot Cloth.
  - D: Fan Dry.
  - Shift or K: Kaze-Dry Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Sector −, Sector +, Band −, Band + controls plus optional direct tap on large fan wedges.
  - Use large Pigment, Stencil −, Stencil +, Brush Pigment, Fold Edge, Blot Cloth, Fan Dry, Kaze-Dry Focus, Pause, Restart, and Prompt buttons.
  - Tapping pigment/bleed/dry-gap/saturation/stencil chips may show short explanations.
  - No tiny virtual joystick. Interaction is sector stepping/direct tap, stencil rotation, pigment selection, brushing, folding, blotting, drying, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact fan HUD with score, best, paper hearts, bleed %, combo, active sector, pigment, stencil, Kaze-Dry Focus charge, and elapsed time. Use fan/pigment/rib/breeze/blot/fold chips, not pool/steam/flower/fruit/wood/shrine/tea/firework/cat/rabbit/brush-scroll/kite icons.
  - Below top: commission card with stencil target, pigment count, protected dry gaps, bleed limit, fold/blot/dry requirements, symmetry score, and progress ticks.
  - Center: large radial uchiwa fan stage with fan ribs, sectors, pigment blooms, active stencil, protected gaps, bleed arrows, drying rings, breeze lines, helper art, and readable canvas feedback. It must remain playable without zooming.
  - Bottom: status helper plus large sector/action controls. Controls must not cover active fan sectors, bleed warnings, stencil alignment, or dry-gap indicators.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, sector selection, pigment brushing, stencil rotation, dry gaps, Fold Edge, Blot Cloth, Fan Dry, Kaze-Dry Focus, pause/restart must be visible.
  - Requests must combine text, symbols, line styles, icons, saturation bars, and progress ticks so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Uchiwa Fan Dye Maestro”.
   - Shows Day 033 badge, mode badge “2D”, public route `/uchiwa/`, best score, best Grand Breeze time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual stencil, bleed, and dry-gap cues work if muted.”
2. Tutorial text
   - Objective: “Dye the requested fan sectors, protect white breeze gaps, and dry the washi before pigment bleeds.”
   - Selection: step around the fan with Sector −/+ or tap large wedge sectors.
   - Pigment: choose indigo, coral, or saffron; Brush Pigment only when the stencil aligns.
   - Stencil: rotate the mask so waves, goldfish, lanterns, and fireflies land on requested sectors.
   - Paper safety: Fold Edge redirects wet flow, Blot Cloth rescues bleed, and Fan Dry locks clean edges.
   - Kaze-Dry Focus: slows the workshop and previews bleed arrows/dry rings when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, paper hearts, bleed %, commission name, combo, active sector/band, selected pigment, stencil motif, dry-gap score, saturation, Kaze-Dry Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next target sector, pigment advice, stencil alignment, bleed warning, dry-gap guidance, tool readiness, Kaze-Dry Focus readiness, and expected score effect.
   - Must not cover the fan stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Breeze status, clean-sector chain, dry-gap score, bleed finish, tears/warps, badges, restart button.
7. Uchiwa Grand Breeze banner
   - Trigger once per run after all three commissions and 4700 score.
   - Non-blocking celebration: the fan opens fully, indigo/coral/saffron pigments settle into crisp motifs, gold rim glints, breeze threads sweep across the paper, the kappa helper stamps a tiny festival seal, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: kappa fanmaker helper mascot, portrait uchiwa fan workshop background, fan/pigment/tool/stencil icon sheet, and decorative Grand Breeze seal pieces. Canvas/SVG/DOM code may render interactive fan sectors, ribs, pigment blooms, stencil masks, bleed/dry overlays, particles, and UI chrome. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/033/assets/source/` and use optimized playable copies under `release/games/033/assets/`. Also copy optimized playable assets into `apps/day-033-uchiwa-fan-dye-maestro/assets/` and the public alias `release/uchiwa/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny fan/tool details that disappear at final in-game size, and keep helper/fan/rib/pigment/blot/fold/dry/focus silhouettes distinct against bright washi workshop backgrounds.

Generate or provide at least these final art assets:

1. Kappa fanmaker helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/033/assets/source/uchiwa-helper-source.png`
   - Optimized path: `release/games/033/assets/uchiwa-helper.png`
   - Imagegen2 prompt: “A charming friendly kappa fanmaker helper mascot for a mobile 2D Japanese uchiwa fan dye puzzle game, small cute green kappa wearing a summer festival happi coat, holding a blank paper fan and a tiny pigment brush, kind focused expression, warm washi workshop rim light, centered readable silhouette, transparent or solid pale washi background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Uchiwa fan workshop background source
   - Target: portrait-friendly background suitable behind a large radial fan board with open readable center.
   - Archive path: `release/games/033/assets/source/uchiwa-workshop-source.png`
   - Optimized path: `release/games/033/assets/uchiwa-workshop.png`
   - Imagegen2 prompt: “A bright Japanese summer festival uchiwa fan workshop for a portrait mobile craft puzzle game, washi paper sheets, bamboo fan ribs, pigment bowls in indigo coral and saffron, gold trim strips, translucent stencil sheets, small festival charms at the edges, soft morning light, breezy paper shadows, open readable central table area for an interactive radial paper fan, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Uchiwa fan, pigment, stencil, blot, fold, dry, and festival UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/033/assets/source/uchiwa-icons-source.png`
   - Optimized path: `release/games/033/assets/uchiwa-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese uchiwa fan dye arcade puzzle game: blank paper fan, bamboo rib, indigo pigment drop, coral pigment drop, saffron pigment drop, wave stencil, goldfish stencil, lantern stencil, firefly stencil, blot cloth, folded fan edge, drying breeze swirl, bleed warning droplet, paper heart, Kaze-Dry Focus fan emblem, Grand Breeze festival seal, transparent or solid pale washi background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas kappa/fan/pigment/tool silhouettes, document the failure in `ai/postmortems/day-033.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the kappa helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that fan/brush pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Sector −/+ must visibly move selection around the fan in expected directions, Band −/+ must switch inner/outer/rib group when present, Stencil −/+ must visibly rotate/shift the stencil mask, Pigment must change selected color and brush result, Brush Pigment must stain the intended sector, Fold Edge must redirect or protect visible bleed, Blot Cloth must visibly remove intended wet bleed/lower bleed meter, Fan Dry must visibly lock/brighten drying rings, and Kaze-Dry Focus must slow/preview bleed/dry/stencil paths.
- For the background, verify the central fan board remains readable after portrait mobile crop and does not hide fan ribs, sectors, pigment blooms, stencil masks, commission card, helper, or controls.
- For the icon sheet, verify blank fan, bamboo rib, indigo/coral/saffron pigment, wave/goldfish/lantern/firefly stencil, blot cloth, folded edge, drying breeze, bleed warning, paper heart, Kaze-Dry Focus, and Grand Breeze seal are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale washi if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because paper brushing, pigment bleed, folding, blotting, fan-drying, and summer-festival workshop atmosphere are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft paper tick when selecting a sector or band.
- Wet brush swish when Brush Pigment applies color.
- Gentle stencil click when rotating masks.
- Crisp paper fold when Fold Edge protects a dry gap.
- Cloth dab when Blot Cloth rescues bleed.
- Breezy flutter when Fan Dry locks a clean edge.
- Low paper-warp rustle when bleed/tear danger rises.
- Sparkly fan-chime shimmer when Kaze-Dry Focus activates.
- Rising koto/taiko/festival-bell arpeggio when Uchiwa Grand Breeze triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/033/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 033 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-033-uchiwa-fan-dye-maestro/`.
   - Integrate it into immutable release output under `release/games/033/`.
   - Create the public playable route under `release/uchiwa/`.
   - Use static HTML/CSS/JS with Canvas/SVG/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, fan board render, Sector −/+, Band −/+, Pigment, Stencil −/+, Brush Pigment, Fold Edge, Blot Cloth, Fan Dry, Kaze-Dry Focus control presence, stencil/bleed/dry-gap/saturation feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-033.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 033 is `2d` after Day 032 `3d` with zero latest 2D streak, and the mechanic is rich radial paper-craft/dye-flow puzzle play rather than a low-effort flat coloring demo.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 44px+ sector/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical fan sectors.
- Prompt is visible from gallery and release folder.
- `prompts/day-033.md` is copied exactly to `release/games/033/prompt.md` and `release/uchiwa/prompt.md`.
- `release/games/033/prompt.html` and `release/uchiwa/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/uchiwa/index.html`, `release/uchiwa/prompt.html`, `release/uchiwa/screenshot.png`, and `release/uchiwa/assets/` exist and work.
- Gallery card for Day 033 shows prompt availability, generation duration, public `/uchiwa/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/033/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/033/assets/source/` and optimized assets exist under `release/games/033/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive fan/pigment/stencil/tool visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual stencil/bleed/dry-gap cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/032/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/033/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/uchiwa/index.html, release/uchiwa/prompt.html, release/uchiwa/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-033.md release/games/033/prompt.md and cmp prompts/day-033.md release/uchiwa/prompt.md.
# Prompt HTML check: verify release/games/033/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /uchiwa/ route and verify menu, tutorial, gameplay start, fan board render, Sector −/+, Band −/+, Pigment, Stencil −/+, Brush Pigment, Fold Edge, Blot Cloth, Fan Dry, Kaze-Dry Focus, stencil/bleed/dry-gap/saturation feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable fan/action controls plus readable HUD/commission card/stage/controls.
# Static screenshot check: inspect release/games/033/screenshot.png and release/uchiwa/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-033.md.
# Docker/static smoke: build the Docker image locally, run it, curl /uchiwa/ and /uchiwa/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 033.
```
