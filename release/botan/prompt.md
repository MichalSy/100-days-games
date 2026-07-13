# Day 031 Game Generation Prompt

## Game identity

- Day: 031
- Title: Botan Ikebana Balance Atelier
- Slug: botan-ikebana-balance-atelier
- Public route word: botan
- Mode: 2D
- Genre: mobile-first floral balance puzzle / ikebana composition arcade / precision craft score chase
- Mood/style: quiet early-spring Japanese ikebana studio, peony-pink botan blossoms, ceramic suiban vase, brass kenzan pin frog, pale tatami, black ink composition cards, water shimmer, bamboo measuring stick, tiny helpful tanuki florist apprentice, elegant asymmetry, calm but tense balance feedback; direct 2D stem angle/anchor/water-balance play rather than mikan orchard harvesting, kumiko woodworking, foxfire shrine stealth, matcha whisking, fireworks, pachinko, mochi hopping, sumi tracing, kite cartography, dry-garden raking, underwater navigation, taiko rhythm lanes, daruma rolling, web weaving, pottery shaping, bamboo canals, origami folding, parasol rain procession, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 028 `3d`: Akane foxfire shrine stealth/escort with torii paths, lantern pools, patrol cones, and crimson-violet shrine depth.
- Day 029 `2d`: Hinoki kumiko woodworking with rectangular lattice strips, notches, clamps, grain stress, and warm cypress workshop visuals.
- Day 030 `3d`: Mikan Sunwheel Orchard with bright 3D citrus canopy, basket orbit/height, ripeness rings, crates, hornets, and sunny green/orange orchard visuals.

The latest generated-mode streak is one `3d` (Day 030), so Day 031 may safely choose `2D` without extending a 2D streak. It deliberately shifts away from 3D harvest navigation and previous rectangular woodworking into a portrait-first floral composition puzzle. The new verb set is ikebana balance: choose stems, trim length, rotate angle, anchor stems into a kenzan, manage left/right vase balance, mist thirsty blossoms, tie a support loop, satisfy asymmetry/composition cards, and use Ma Focus to preview balance arcs and negative-space targets.

Recent screenshot/visual variety notes to avoid repeating:

- Day 030 used sunny orchard background, green 3D canopy, orange fruit, bamboo baskets/crates, hornets, sunwheel beams, and broad yellow-green UI.
- Day 029 used warm cypress workbench, shoji panel grid, geometric blueprint strips, clamps/chisels, and tan/gold workshop UI.
- Day 028 used dark akane shrine corridors, torii gates, blue foxfire wisps, lantern pools, shadow cones, and violet/crimson HUD chips.

Day 031 should use a calm ceramic-and-flower studio: a shallow suiban bowl/vase, visible kenzan pins, angled flower stems, peony/botan blooms, slender grass lines, water rings, negative-space guide silhouettes, soft tatami shadows, peony-pink and moss-green accents, ink-brush composition cards, and a tanuki florist helper. Avoid fruit trees/crates/hornets/sunwheels, wooden lattice panels/tools/clamps, shrine patrol cones/foxfire/torii, tea bowls/foam/whisks, fireworks/night sky, pachinko coins/cats, rabbits/mochi, calligraphy scroll strokes, kite threads/star maps, sand/stone gardens, underwater oxygen/pearls, drum pads, tilt boards, silk webs, pottery wheel rings, bamboo pipe irrigation, origami crease lines, rain parasols, snow blocks, kimono cloth panels, restaurant timers, or generic match-three flowers.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 028 `3d`, Day 029 `2d`, and Day 030 `3d`. The latest generated-mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 031 is `2D`. This is allowed because it follows a 3D day and does not extend a 2D streak. The implementation must still be mechanically rich and visually polished:

- Use static-browser HTML/CSS/JS with a canvas-based or DOM/canvas hybrid ikebana board, no backend.
- Render a portrait-first suiban/vase scene with kenzan pins, stem anchors, current stem preview, existing stems/blooms/leaves, water rings, balance meter, negative-space silhouettes, composition card targets, mist/tie tools, and helper art.
- Gameplay must depend on 2D spatial state: stem anchor point, angle, length, bloom weight, bend, water reach, support ties, left/right torque, silhouette coverage, negative-space gaps, color harmony, freshness timers, and commission goals.
- Player actions must manipulate the system: select stem type, move anchor, rotate angle, trim length, place/commit stem, mist thirsty blooms, tie support on drooping stems, remove or re-cut one mistake, use Ma Focus to slow freshness timers and preview balance/negative-space arcs, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Create balanced ikebana arrangements by anchoring stems into a kenzan, matching composition-card silhouettes, preserving deliberate negative space, and keeping blossoms fresh before the studio bell rings.
- Win condition: Complete three commissions — First Peony Line, Moon Bowl Triangle, and Festival Botan Masterwork — while reaching 4500 points to trigger “Botan Grand Arrangement”. After the banner, continue into endless custom arrangements.
- Lose condition: Three studio hearts wilt, vase balance reaches 100% tilt, the commission timer expires, too many stems are placed outside the composition intent, or freshness drops below the safe threshold twice in one commission.
- Core loop:
  1. Start on a title/menu screen with Day 031 badge, mode badge “2D”, public route `/botan/`, best score, best Grand Arrangement time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly ikebana workbench. A ceramic suiban bowl with a brass kenzan fills the lower center; a composition card sits above; stem rack and tool buttons stay below/side in large touch targets.
  3. A commission card requests goals such as: “Place 3 tall line stems, 2 botan blooms, preserve left moon-space, keep balance under 40%, mist twice, finish with one Ma Focus unused.”
  4. Player chooses a stem from the rack: line grass, curved willow, botan bloom, maple accent, moss branch, or seed pod. Each has weight, water need, bend, color, and silhouette role.
  5. Player moves the anchor over large kenzan zones, rotates angle, and trims length. A ghost preview shows expected stem line, bloom weight, water reach, balance torque, and target silhouette contribution.
  6. Commit Stem pins it into the kenzan. Correct lines glow ink-gold, intentional empty spaces shimmer, and the score chain rises. Bad placements overcrowd the negative-space target or tilt the vase.
  7. Mist Brush refreshes thirsty flowers and briefly reveals water-reach circles. Mist too early wastes charge; mist too late causes wilt.
  8. Support Tie stabilizes a drooping heavy bloom or curved branch, lowering tilt risk but adding visual clutter if overused.
  9. Recut can remove or shorten one recent stem per commission, but costs combo and time.
  10. Ma Focus, charged by clean asymmetry and fresh blooms, slows timers and overlays balance lines, negative-space gaps, and target silhouettes for a short window.
  11. Completing a commission stamps a small washi seal, restores one studio heart if needed, awards points, and unlocks heavier blooms, stricter empty-space goals, and faster freshness drain.
  12. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Botan Grand Arrangement time, longest clean-placement chain, highest endless commission, lowest tilt finish, freshest final arrangement, fewest support ties, best negative-space score, and collected ikebana seal badges in localStorage.
  - Include three authored commissions:
    - First Peony Line: broad kenzan zones, one tall line stem, two light botan blooms, slow freshness drain, guided first placement, no studio-heart penalty during the first tutorial mistake.
    - Moon Bowl Triangle: adds triangle composition, water-reach constraints, curved willow, one drooping heavy bloom, first Support Tie, and negative-space scoring.
    - Festival Botan Masterwork: adds asymmetric left/right tension, heavier peonies, stricter empty-space silhouette, required Ma Focus preview, limited Recut, and freshness pressure.
  - Deterministic Day 031 seed varies stem rack order, blossom weights, silhouette guides, kenzan safe zones, freshness timers, water reach, tie recharge, mist timing, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Peony Line with zero tilt warnings, trigger Grand Arrangement under 260 seconds, complete Moon Bowl Triangle with 85%+ negative-space score, finish a commission without Recut, finish below 12% tilt, complete an endless arrangement with all studio hearts.
  - Strategic scoring rewards planning: place tall line stems first, counterweight heavy botan blooms, trim before committing, preserve the empty-space silhouette instead of filling every gap, mist only when freshness crosses the sweet spot, use Support Tie for one decisive heavy bloom, save Ma Focus for dense asymmetric cards, and accept lower-score light accents instead of overcrowding.
  - Endless mode after Grand Arrangement adds tighter negative-space cards, heavier blooms, faster freshness drain, trickier water reach, rarer ties, and mixed color-harmony goals without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: simple line-and-bloom card, broad anchor zones, light stems, forgiving tilt, guided first commit.
  - 45-140 seconds: curved stems, water reach, first heavy bloom, negative-space target, Support Tie tutorial.
  - 140-260 seconds: asymmetric masterwork, stricter balance, limited Recut, required Ma Focus preview, faster freshness.
  - 260+ seconds/endless: denser goals, heavier blooms, shorter freshness windows, same readable controls.
  - Keep mobile fair: stems, anchor zones, bloom heads, silhouette targets, balance/freshness meters, commission card, helper, and action buttons must be large/readable at 390x844; primary touch buttons must be 52px+ where possible and never below 44px; no tiny survival-critical kenzan pins.
- Scoring/rewards:
  - Preview matches composition silhouette: +70 points times combo tier.
  - Clean committed stem within target role: +125 points and Ma Focus charge.
  - Balanced counterweight placement: +145 points.
  - Negative-space gap preserved: +170 points.
  - Mist restores a flower in the sweet window: +130 points and freshness relief.
  - Support Tie stabilizes a drooping bloom before tilt warning: +150 points.
  - Commission complete below tilt target: +820 points and restore one studio heart if below max.
  - Perfect no-wilt arrangement: +1050 points.
  - Botan Grand Arrangement: +2100 points and endless commissions unlock.
  - Crowded/invalid commit: combo soft-reset, tilt +8%, negative-space score drops.
  - Wilted bloom: studio-heart damage if threshold crossed, freshness penalty, combo reset.
  - Over-tied arrangement: clutter penalty and lower finish score.

## Controls and layout

- Desktop:
  - Mouse click/tap: press action buttons, select stem rack pieces, choose kenzan zones, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag on the arrangement stage: position anchor and angle preview; release should preview/dry-fit, not commit, unless a clearly labeled Commit Stem action is pressed.
  - Arrow keys or WASD: move anchor over kenzan zones.
  - Q/E: rotate current stem counterclockwise/clockwise.
  - W/S or Up/Down while holding Trim mode: lengthen/shorten preview.
  - Space or Enter: Preview/Commit current stem depending on state.
  - 1/2/3/4: choose stem rack slot or tool group.
  - M: Mist Brush.
  - T: Support Tie.
  - X: Recut recent stem.
  - Shift or F: Ma Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Anchor Up, Anchor Left, Anchor Right, Anchor Down controls plus optional drag-to-position on the suiban stage.
  - Use large Rotate −, Rotate +, Trim −, Trim +, Preview, Commit Stem, Stem Rack, Mist Brush, Support Tie, Recut, Ma Focus, Pause, Restart, and Prompt buttons.
  - Tapping stem/balance/freshness/space chips may show short explanations.
  - No tiny virtual joystick. Interaction is anchor stepping/dragging, rotating, trimming, previewing, committing, misting, tying, recutting, focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact studio HUD with score, best, studio hearts, tilt %, freshness %, combo, active stem, Ma Focus charge, and elapsed time. Use flower/stem/vase/water/tie/ma chips, not fruit/wood/shrine/tea/firework/cat/rabbit/brush/kite icons.
  - Below top: commission card with composition target, required stem roles, negative-space score, tilt limit, freshness target, tool requirements, and progress ticks.
  - Center: large suiban/kenzan arrangement stage with existing stems, active ghost preview, bloom weights, target silhouette, empty-space shimmer, water rings, helper art, and readable canvas feedback. It must remain playable without zooming.
  - Bottom: status helper plus large movement/action controls. Controls must not cover active anchor, bloom heads, balance warning, target silhouette, or commission progress.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, anchor movement, rotate/trim, preview/commit, balance, freshness/mist, support tie, Recut, Ma Focus, pause/restart must be visible.
  - Requests must combine text, icons, line styles, shapes, and progress ticks so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Botan Ikebana Balance Atelier”.
   - Shows Day 031 badge, mode badge “2D”, public route `/botan/`, best score, best Grand Arrangement time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual balance, freshness, and negative-space cues work if muted.”
2. Tutorial text
   - Objective: “Anchor stems into the kenzan, balance peony weight, preserve empty space, and finish the composition before flowers wilt.”
   - Placement: move the anchor, rotate and trim the preview, then Commit Stem when the guide glows.
   - Balance: heavy botan blooms tilt the suiban; counterweight with line stems and support ties.
   - Freshness: mist when flowers are thirsty; water rings show which stems are safely reached.
   - Negative space: do not fill every gap; shimmering empty silhouettes are part of the score.
   - Ma Focus: slows the studio and previews balance/space lines when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, studio hearts, tilt %, freshness %, commission name, combo, active stem role/length/angle, negative-space score, Ma Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing suggested stem role, balance advice, water/freshness warning, negative-space guidance, tool readiness, Ma Focus readiness, and expected score effect.
   - Must not cover the arrangement stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Arrangement status, clean-placement chain, negative-space score, tilt/freshness finish, ties/recuts used, mastery badges, restart button.
7. Botan Grand Arrangement banner
   - Trigger once per run after all three commissions and 4500 score.
   - Non-blocking celebration: peony petals drift across the suiban, water rings glow gold, the tanuki helper stamps a tiny washi seal, and endless commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: tanuki florist helper mascot, portrait ikebana studio background, stem/tool/composition icon sheet, and decorative Grand Arrangement seal pieces. Canvas/SVG/DOM code may render interactive stems, blooms, kenzan pins, target silhouettes, water rings, balance lines, particles, and UI chrome. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/031/assets/source/` and use optimized playable copies under `release/games/031/assets/`. Also copy optimized playable assets into `apps/day-031-botan-ikebana-balance-atelier/assets/` and the public alias `release/botan/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny flower/tool details that disappear at final in-game size, and keep helper/stem/bloom/vase/mist/tie/focus silhouettes distinct against pale studio backgrounds.

Generate or provide at least these final art assets:

1. Tanuki florist helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/031/assets/source/botan-helper-source.png`
   - Optimized path: `release/games/031/assets/botan-helper.png`
   - Imagegen2 prompt: “A charming friendly tanuki florist apprentice mascot for a mobile 2D ikebana balance browser puzzle game, small tanuki wearing a moss-green studio apron, holding a peony blossom and bamboo measuring stick, kind focused expression, soft tatami and studio rim light, centered readable silhouette, transparent or solid pale peony background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Ikebana studio background source
   - Target: portrait-friendly background suitable behind a large suiban/kenzan arrangement stage with open readable center.
   - Archive path: `release/games/031/assets/source/botan-studio-source.png`
   - Optimized path: `release/games/031/assets/botan-studio.png`
   - Imagegen2 prompt: “A serene Japanese ikebana studio for a portrait mobile floral balance puzzle game, pale tatami, low wooden work table, ceramic suiban vase, brass kenzan pin frog, peony blossoms and slender grasses arranged around the edges, bamboo measuring stick, small mist sprayer, black ink composition cards at the side, soft morning light, open readable central table area for interactive stems and blooms, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Ikebana stems, vase, mist, tie, freshness, and composition icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/031/assets/source/botan-icons-source.png`
   - Optimized path: `release/games/031/assets/botan-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese ikebana balance arcade puzzle game: peony botan bloom, tall line grass stem, curved willow branch, ceramic suiban vase, brass kenzan pin frog, water ring, mist brush, support tie loop, trimming shears, freshness droplet, tilt warning triangle, negative-space moon shape, Ma Focus emblem, studio heart, Grand Arrangement washi seal, transparent or solid pale peony background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas tanuki/flower/vase/tool silhouettes, document the failure in `ai/postmortems/day-031.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the tanuki helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright helper orientation, and that flower/measuring-stick pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Anchor Up/Left/Right/Down must move the preview in expected directions, Rotate/Trim must visibly change stem angle/length, Preview must show valid/invalid composition feedback, Commit Stem must lock a visible stem, Mist Brush must restore freshness/show water rings, Support Tie must visibly stabilize a drooping stem/lower tilt, Recut must remove/shorten the intended stem, and Ma Focus must slow/preview balance/space lines.
- For the background, verify the central table/suiban remains readable after portrait mobile crop and does not hide stems, kenzan pins, preview lines, target silhouettes, commission card, helper, or controls.
- For the icon sheet, verify peony bloom, line grass, willow, suiban, kenzan, water ring, mist, support tie, shears, freshness droplet, tilt warning, negative-space moon, Ma Focus, studio heart, and Grand Arrangement seal are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale peony if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because flower placement, trimming, misting, support ties, balance warnings, and a quiet studio atmosphere are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft bamboo tap when moving anchor or previewing a stem.
- Gentle pin click when a stem is committed into the kenzan.
- Clean snip when trimming length.
- Water mist shimmer when Mist Brush refreshes blooms.
- Silk thread pluck when Support Tie stabilizes a stem.
- Low ceramic wobble warning when tilt rises.
- Soft petal sigh when a bloom wilts.
- Quiet bell/ink shimmer when Ma Focus activates.
- Rising koto/shakuhachi/floral bell arpeggio when Botan Grand Arrangement triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/031/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 031 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-031-botan-ikebana-balance-atelier/`.
   - Integrate it into immutable release output under `release/games/031/`.
   - Create the public playable route under `release/botan/`.
   - Use static HTML/CSS/JS with Canvas/SVG/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, arrangement render, Anchor controls, Rotate/Trim, Preview, Commit Stem, Mist Brush, Support Tie, Recut, Ma Focus control presence, balance/freshness/negative-space feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-031.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 031 is `2d` after Day 030 `3d` with zero latest 2D streak, and the mechanic is rich spatial/composition puzzle play rather than a low-effort flat demo.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, usable 44px+ movement/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical stems or anchor targets.
- Prompt is visible from gallery and release folder.
- `prompts/day-031.md` is copied exactly to `release/games/031/prompt.md` and `release/botan/prompt.md`.
- `release/games/031/prompt.html` and `release/botan/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/botan/index.html`, `release/botan/prompt.html`, `release/botan/screenshot.png`, and `release/botan/assets/` exist and work.
- Gallery card for Day 031 shows prompt availability, generation duration, public `/botan/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/031/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/031/assets/source/` and optimized assets exist under `release/games/031/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive stem/bloom/vase/tool visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual balance/freshness/composition cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/030/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/031/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/botan/index.html, release/botan/prompt.html, release/botan/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-031.md release/games/031/prompt.md and cmp prompts/day-031.md release/botan/prompt.md.
# Prompt HTML check: verify release/games/031/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /botan/ route and verify menu, tutorial, gameplay start, arrangement render, Anchor controls, Rotate/Trim, Preview, Commit Stem, Mist Brush, Support Tie, Recut, Ma Focus, balance/freshness/space feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable anchor/action controls plus readable HUD/commission card/stage/controls.
# Static screenshot check: inspect release/games/031/screenshot.png and release/botan/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-031.md.
# Docker/static smoke: build the Docker image locally, run it, curl /botan/ and /botan/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 031.
```
