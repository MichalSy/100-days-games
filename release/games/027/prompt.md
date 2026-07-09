# Day 027 Game Generation Prompt

## Game identity

- Day: 027
- Title: Haru Matcha Whisk Atelier
- Slug: haru-matcha-whisk-atelier
- Public route word: haru
- Mode: 2D
- Genre: mobile-first circular motion / foam-pattern precision arcade / tea ceremony score chase
- Mood/style: fresh spring Japanese tea room and garden veranda, vivid matcha greens, pale hinoki wood, white ceramic chawan bowls, bamboo chasen whisk, sakura petals drifting outside, soft morning light, pearly foam bubbles, calm but tactile tea-preparation feedback; direct circular whisking and temperature/foam pattern management rather than 3D fireworks, lucky-cat pachinko, moon-mochi hopping, sumi brush tracing, kite-thread navigation, dry-garden raking, underwater cartography, taiko rhythm lanes, daruma tilt mazes, silver webs, pottery shaping, bamboo canal routing, origami folding, rain sheltering, snow stacking, kimono stamping, bento cooking, windbell tuning, rail running, or koi collection.

## Why this game today

The generated series currently ends with:

- Day 024 `3d`: lavender moon-rooftop mochi platform hopping with charged jump arcs, pads, rice sparks, tray gates, and a rabbit mascot.
- Day 025 `2d`: red-and-gold maneki-neko koban pachinko with coin drops, rotatable paw bumpers, charm gates, bells, trays, and a cat helper.
- Day 026 `3d`: indigo summer fireworks sky painting with 3D launch tubes, shell arcs, altitude/depth rings, fuse timing, smoke clearing, and a tanuki pyrotechnician.

The latest generated-mode streak is one `3d`. Day 027 deliberately chooses `2D` because it follows a 3D day and the series benefits from a more intimate portrait-first tactile touch game. The new verb set is circular tea craft: guide a bamboo whisk around a ceramic bowl, build micro-foam, steer bubbles into requested crest patterns, keep temperature and bitterness in range, skim stray clumps, serve three spring tea commissions, and chase perfect ceremony flow.

Recent screenshot/visual variety notes to avoid repeating:

- Day 026 used a dark open night sky, lantern towers at the sides, firework rings/bursts, smoky teal/gold/magenta controls, and a tanuki helper.
- Day 025 used a dense vermilion lucky-cat cabinet, pegged pachinko board, coin trays, paw bumpers, cat art, and red/gold/brown UI.
- Day 024 used lavender rooftop depth, floating mochi pads, white rabbit piece, jump arcs, rice sparks, and blue/purple action controls.

Day 027 should shift to close, bright, tactile spring craft: creamy matcha-green bowls, pale hinoki wood, bamboo whisk bristles, frothy white foam pearls, sakura petals, ceramic tea scoops, golden steam wisps, and a calm tea veranda. Avoid fireworks/night sky/launch tubes/rings/smoke, red-gold pachinko cabinets/coins/cats/trays, moon/mochi/rabbit/platforms, black ink/washi/seals/brush-stroke commission visuals, kite/thread/star-map navigation, sand/stone garden boards, underwater oxygen/pearls, rhythm drum pads, tilt-maze boards, web anchors, clay pottery profiles, bamboo pipe canals, origami creases, parasols/rain, snow blocks, kimono cloth panels, or generic restaurant cooking timers.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/canvas/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 024 `3d`, Day 025 `2d`, and Day 026 `3d`. The latest generated-mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 027 is `2D`. This is allowed and intentional because it follows a 3D day and does not extend a 2D streak. The implementation must still be mechanically rich and visually polished:

- Use static-browser HTML/CSS/JS with a canvas-based top-down tea bowl, whisk position/orbit, foam particles, clump hazards, temperature state, bitterness state, crest targets, and semantic UI; no backend.
- Render a portrait-first chawan bowl stage with a clearly visible circular whisk orbit, froth field, requested crest guides, sakura petal bonuses, tea powder clumps, steam wisps, and serve zone.
- Gameplay must depend on 2D state: circular direction, whisk speed, orbit radius, foam density, bubble positions, clump breakup, temperature drift, bitterness from overwhisking, crest alignment, tea scoop timing, and ceremony flow.
- Player actions must manipulate the system: clockwise/counterclockwise whisk strokes, tighten/widen orbit, sprinkle matcha powder, skim clumps, lift whisk to rest foam, fan steam to cool, serve the bowl, use Tea Focus to slow/preview crest alignment, pause/restart, and inspect tutorial hints.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Whisk spring matcha into requested foam crests by controlling circular motion, temperature, and bitterness while keeping the tea smooth enough to serve.
- Win condition: Complete three tea commissions — First Spring Froth, Sakura Guest Bowl, and Garden Ceremony Crest — while reaching 4100 points to trigger “Haru Perfect Usucha”. After the ceremony banner, continue into endless spring tea commissions.
- Lose condition: Three ceremony hearts crack, the commission timer expires, bitterness reaches 100%, temperature leaves the safe range for too long, too many powder clumps remain when serving, or the requested crest collapses after repeated overwhisking.
- Core loop:
  1. Start on a title/menu screen with Day 027 badge, mode badge “2D”, public route `/haru/`, best score, best Perfect Usucha time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly tea atelier. A white ceramic chawan fills the center, with matcha liquid, bamboo whisk bristles, foam pearls, crest guide arcs, clumps, sakura petals, steam wisps, and a calm garden-veranda background.
  3. A commission card requests goals, for example: “Build 70% fine foam, trace a three-leaf crest, skim 2 clumps, serve between 62-70°C, keep bitterness under 35%.”
  4. Player uses large Whisk Clockwise / Whisk Counter buttons or drag-circles in the bowl. Speed and radius shape foam pearls; fast tight circles build dense foam but raise bitterness, wide gentle circles align crest arcs but can cool too much.
  5. Matcha Powder adds scoring opportunities and foam volume but also creates clumps. Skim Clump removes nearby clumps if the whisk passes close enough.
  6. Rest Whisk lets bubbles settle into the crest guide and lowers bitterness growth. Steam Fan cools the bowl but can scatter foam pearls if overused.
  7. Tea Focus, charged by smooth circular strokes and clean clump skims, slows foam drift and overlays a predicted crest alignment path for a short window.
  8. Serve Bowl checks foam density, crest alignment, temperature, bitterness, and clump count. Clean serves light a tea seal and unlock the next commission.
  9. Completing a commission restores one ceremony heart if needed, awards points, and adds more complex crest shapes and temperature pressure.
  10. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Haru Perfect Usucha time, longest smooth-whisk chain, highest endless commission, most perfect serves, fewest clumps, lowest bitterness finish, best crest alignment, and collected tea-seal badges in localStorage.
  - Include three authored commissions:
    - First Spring Froth: broad circle crest, low clump count, wide safe temperature range, guided whisk orbit, no penalty during first guided sprinkle.
    - Sakura Guest Bowl: adds three-petal crest, drifting sakura bonuses, first Steam Fan cooling challenge, more powder clumps, and Rest Whisk tutorial.
    - Garden Ceremony Crest: adds five-point garden crest, narrower temperature window, bitterness pressure, split foam rings, required Tea Focus alignment, and serve timing mastery.
  - Deterministic Day 027 seed varies crest guide shapes, clump spawn arcs, petal drift, temperature decay, powder timing, foam bubble turbulence, and endless constraints while keeping the opening fair.
  - Mastery badges: finish First Spring Froth with zero clumps, trigger Perfect Usucha under 245 seconds, sustain 27 smooth whisk strokes, serve one bowl at 95%+ crest alignment, complete a commission under 10% bitterness, complete an endless bowl with all ceremony hearts.
  - Strategic scoring rewards planning: use powder only when foam is low, skim clumps before tight whisking, rest just before crest lock, cool early rather than panic-fanning at serve time, use Tea Focus before five-point crests, and serve once the crest is stable instead of chasing tiny score bubbles.
  - Endless mode after Haru Perfect Usucha adds split crest guides, faster temperature drift, more clump/petal overlap, stricter bitterness, and mixed clockwise/counterclockwise commissions without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: one broad crest, slow temperature drift, gentle foam physics, visible orbit guide, guided first powder sprinkle.
  - 45-130 seconds: sakura-petal bonuses, clumps, Rest Whisk and Steam Fan introduced, three-petal crest, mild bitterness pressure.
  - 130-245 seconds: five-point crest, narrower temperature band, split foam rings, required Tea Focus timing, faster foam collapse.
  - 245+ seconds/endless: denser foam field, stronger temperature/bitterness tradeoffs, more clumps, same readable controls.
  - Keep mobile fair: bowl, whisk, foam pearls, crest guides, clumps, petals, temperature band, serve warning, and action buttons must be large/readable at 390x844; primary touch buttons must be 52px+; no tiny survival-critical bubbles.
- Scoring/rewards:
  - Smooth circular stroke inside target radius: +45 points times combo tier.
  - Fine foam pearl created within crest guide: +85 points and Tea Focus charge.
  - Clump skimmed cleanly: +120 points and bitterness relief.
  - Sakura petal folded into foam without scattering crest: +140 bonus.
  - Temperature held in requested serving band for 5 seconds: +180 bonus.
  - Serve above 80% crest alignment: +500 points.
  - Commission complete below bitterness target: +720 points and restore one ceremony heart if below max.
  - Perfect no-clump serve: +900 points.
  - Haru Perfect Usucha: +1700 points and endless commissions unlock.
  - Overwhisking: bitterness +6%, crest wobble, combo soft-reset.
  - Bad serve: ceremony-heart damage if threshold crossed, bitterness +12%, combo reset.
  - Over-fanning: temperature improves but foam pearls scatter and crest alignment drops.

## Controls and layout

- Desktop:
  - Mouse click/tap: press action buttons, start/pause overlay button, prompt link, or explainable HUD chips.
  - Mouse drag in circles inside the bowl: direct whisk orbit; direction and speed affect foam. Drag must remain optional because visible buttons are mandatory.
  - Arrow keys or WASD: move whisk around the bowl in a circular rhythm / nudge orbit position.
  - Q/E: Whisk Counterclockwise / Whisk Clockwise.
  - Space or Enter: Serve Bowl / confirm start when safe.
  - 1: Matcha Powder.
  - 2: Skim Clump.
  - 3: Rest Whisk.
  - 4 or F: Steam Fan.
  - Shift or B: Tea Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Use large Whisk CW, Whisk CCW, Tighten Orbit, Widen Orbit, Matcha Powder, Skim Clump, Rest Whisk, Steam Fan, Tea Focus, Serve, Pause, and Restart buttons.
  - Dragging circularly on the bowl should also whisk, but the visible buttons must fully support play for accessibility.
  - Tapping foam/clump/petal/temperature chips may show short explanations.
  - No tiny virtual joystick. Interaction is circular whisking, orbit shaping, powder/clump/rest/fan/focus/serve, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact tea HUD with score, best, ceremony hearts, temperature, bitterness, combo, active orbit, and elapsed time. Use tea/bowl/foam/steam/clump chips, not fireworks/shells/cats/coins/mochi/rabbits/brushes/kites/garden-depth chips.
  - Below top: commission card with foam target, crest alignment, temperature band, clump limit, bitterness limit, and progress ticks.
  - Center: large circular chawan bowl canvas with matcha liquid, whisk orbit, foam pearls, crest guide, clumps, petals, steam, serve-zone glow, and tea helper art. It must remain playable without zooming.
  - Bottom: status helper plus large controls. Controls must not cover the bowl rim, serve warning, or selected action feedback.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, circular whisking, orbit radius, powder/clumps, temperature, bitterness, Tea Focus, serve, pause/restart must be visible.
  - Requests must combine text, icon shapes, ring labels, progress ticks, and line styles so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Haru Matcha Whisk Atelier”.
   - Shows Day 027 badge, mode badge “2D”, public route `/haru/`, best score, best Perfect Usucha time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual foam and crest guides work if muted.”
2. Tutorial text
   - Objective: “Whisk matcha foam into the requested crest, manage temperature and bitterness, then serve the bowl cleanly.”
   - Whisking: use big CW/CCW buttons or drag circles in the bowl; smooth speed builds fine foam.
   - Orbit: tighten for dense foam, widen to align crest arcs, rest before serving to stabilize bubbles.
   - Powder/clumps: sprinkle powder for foam, then skim clumps before they ruin the serve.
   - Temperature/bitterness: fan steam to cool, avoid overwhisking, serve inside the safe band.
   - Tea Focus: slows foam drift and previews crest alignment when charged.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, ceremony hearts, temperature, bitterness %, commission name, combo, orbit radius, elapsed time, foam target, crest alignment, clump count, Steam Fan charge/cooldown, Tea Focus charge, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next suggested action, current foam quality, temperature advice, clump warning, serve readiness, Tea Focus readiness, and expected score effect.
   - Must not cover the bowl or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Perfect Usucha status, smooth-whisk chain, crest alignment, clumps skimmed, bitterness finish, mastery badges, restart button.
7. Haru Perfect Usucha banner
   - Trigger once per run after all three commissions and 4100 score.
   - Non-blocking celebration: the foam crest blossoms into sakura petals, the garden brightens, tea seals glow, the helper bows with a bamboo whisk, and endless tea commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: tea helper mascot, portrait tea-room/veranda background, matcha/foam/whisk/icon sheet, and decorative tea seal pieces. Canvas code may render interactive foam particles, whisk orbit, crest guides, clump hitboxes, steam, bubbles, score sparks, and UI chrome. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/027/assets/source/` and use optimized playable copies under `release/games/027/assets/`. Also copy optimized playable assets into `apps/day-027-haru-matcha-whisk-atelier/assets/` and the public alias `release/haru/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny foam details that disappear at final in-game size, and keep helper/whisk/bowl/foam/clump/steam silhouettes distinct against pale tea-room backgrounds.

Generate or provide at least these final art assets:

1. Tea ceremony helper mascot
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/027/assets/source/haru-helper-source.png`
   - Optimized path: `release/games/027/assets/haru-helper.png`
   - Imagegen2 prompt: “A charming friendly Japanese tea ceremony helper mascot for a mobile 2D matcha whisking browser arcade game, small cheerful tanuki or fox apprentice wearing a pale green spring haori, holding a bamboo chasen whisk and a white ceramic matcha bowl with pearly foam, gentle bowing pose, warm morning rim light, centered readable silhouette, transparent or solid pale hinoki background, no checkerboard background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Spring tea-room veranda background source
   - Target: portrait-friendly background suitable behind a large circular tea bowl playfield with open readable center.
   - Archive path: `release/games/027/assets/source/haru-tearoom-source.png`
   - Optimized path: `release/games/027/assets/haru-tearoom.png`
   - Imagegen2 prompt: “A serene Japanese spring tea room and garden veranda for a portrait mobile matcha whisking arcade game, pale hinoki wood table, open shoji doors, soft morning light, sakura blossoms outside, ceramic tea tools at the edges, bamboo chasen whisk, tea scoop, fresh matcha green accents, open readable central tabletop area for a circular chawan bowl game stage, crop-safe for phone portrait, no characters in the center, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Matcha bowl, foam, whisk, clump, steam, and tea UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/027/assets/source/haru-icons-source.png`
   - Optimized path: `release/games/027/assets/haru-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese spring matcha whisking arcade game: white chawan matcha bowl, bamboo chasen whisk, fine foam pearl, three-leaf foam crest, sakura petal bonus, matcha powder scoop, green powder clump hazard, steam fan tool, Rest Whisk icon, Tea Focus emblem, temperature band gauge, bitterness droplet, ceremony heart, serve tray, Haru Perfect Usucha tea seal, transparent or solid pale green background, no checkerboard background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas tea helper/bowl/whisk silhouettes, document the failure in `ai/postmortems/day-027.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the helper mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot/crop margins, no unwanted text/watermarks, stable upright/bowing orientation, and that the whisk/bowl pose does not imply incompatible movement or rotation.
- Verify control-to-motion alignment in-game: Whisk CW/CCW must rotate foam/whisk in the expected direction, Tighten/Widen Orbit must visibly change orbit radius and crest placement, Matcha Powder must add foam/clumps, Skim Clump must remove intended clumps, Rest Whisk must stabilize foam, Steam Fan must cool and visibly disturb steam/foam as described, Tea Focus must slow/preview crest alignment, and Serve must evaluate the visible bowl state.
- For the background, verify the central bowl area remains readable after portrait mobile crop and does not hide the bowl, whisk, foam pearls, crest guide, clumps, petals, commission card, helper, or controls.
- For the icon sheet, verify bowl, whisk, foam, crest, petal, powder, clump, steam fan, rest, Tea Focus, temperature band, bitterness droplet, ceremony heart, serve tray, and Perfect Usucha seal are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale green if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because whisking, foam buildup, temperature, clump skimming, and serve timing are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft bamboo whisk swish while circular whisking, with speed-dependent brightness.
- Tiny foam sparkle/chime when fine foam enters the crest guide.
- Dry powder tap when sprinkling matcha powder.
- Gentle pluck when a clump is skimmed cleanly.
- Warm steam sigh for Steam Fan and a quieter settle sound for Rest Whisk.
- Low bitter wobble when overwhisking or serving badly.
- Sparkly slowed-tea shimmer when Tea Focus activates.
- Rising koto/tea-bell arpeggio when Haru Perfect Usucha triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/027/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 027 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-027-haru-matcha-whisk-atelier/`.
   - Integrate it into immutable release output under `release/games/027/`.
   - Create the public playable route under `release/haru/`.
   - Use static HTML/CSS/JS with Canvas/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, canvas bowl render, Whisk CW/CCW, Tighten/Widen Orbit, Matcha Powder, Skim Clump, Rest Whisk, Steam Fan, Tea Focus, Serve control presence, foam/crest/clump/temperature/bitterness feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-027.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 027 is `2d` after Day 026 `3d` with zero latest 2D streak, and the mechanic is rich direct circular-precision gameplay rather than a low-effort flat demo.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card, large bowl stage, usable 52px+ whisk/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical foam/clumps.
- Prompt is visible from gallery and release folder.
- `prompts/day-027.md` is copied exactly to `release/games/027/prompt.md` and `release/haru/prompt.md`.
- `release/games/027/prompt.html` and `release/haru/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/haru/index.html`, `release/haru/prompt.html`, `release/haru/screenshot.png`, and `release/haru/assets/` exist and work.
- Gallery card for Day 027 shows prompt availability, generation duration, public `/haru/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/027/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/027/assets/source/` and optimized assets exist under `release/games/027/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive bowl/whisk/foam visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual foam/crest cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/026/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/027/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/haru/index.html, release/haru/prompt.html, release/haru/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-027.md release/games/027/prompt.md and cmp prompts/day-027.md release/haru/prompt.md.
# Prompt HTML check: verify release/games/027/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /haru/ route and verify menu, tutorial, gameplay start, canvas bowl render, Whisk CW/CCW, Tighten/Widen Orbit, Matcha Powder, Skim Clump, Rest Whisk, Steam Fan, Tea Focus, Serve, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls plus readable HUD/commission card/bowl/controls.
# Static screenshot check: inspect release/games/027/screenshot.png and release/haru/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-027.md.
# Docker/static smoke: build the Docker image locally, run it, curl /haru/ and /haru/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 027.
```
