# Day 019 Game Generation Prompt

## Game identity

- Day: 019
- Title: Matsuri Taiko Lanternline Maestro
- Slug: matsuri-taiko-lanternline-maestro
- Public route word: matsuri
- Mode: 2D
- Genre: mobile-first rhythm-routing arcade / festival parade timing score chase
- Mood/style: electric summer matsuri at blue-hour dusk, vermilion-and-gold paper lantern rows, indigo festival street, bold taiko drum circles, fox-mask conductor charm, confetti streamers, yatai stall silhouettes, warm crowd glow, crisp rhythm timing feedback; real timing/audio play rather than shrine tilt labyrinths, silver webs, pottery sculpting, bamboo water routing, origami folding, rainy sheltering, snow stacking, kimono stamping, windbell tuning, rail running, or vehicle flight.

## Why this game today

The generated series currently ends with:

- Day 016 `3d`: pottery wheel sculpting with ring selection, vessel profile matching, glaze/carve placement, wobble/crack risk, and kiln heat controls.
- Day 017 `hybrid`: moonlit silverweb tension puzzle with near/mid/far strand layers, dew-star catching, moth fray, pluck/mend, and cool blue canopy visuals.
- Day 018 `3d`: dawn daruma tilt labyrinth with a raised board, inertia, torii gates, ema plaques, bells, ink pools, and offering bowl routing.

The latest generated mode is one `3d`, and the latest 2D streak is zero. Day 019 deliberately returns to a highly tactile `2D` rhythm/timing game after two spatial days in the last three. This is allowed by the cadence and gives the gallery a different posture: sound-first festival timing, big circular drum pads, lantern-lane cue routing, and pattern memory rather than another 3D board/object or layered path puzzle.

Recent screenshot/visual variety notes to avoid repeating:

- Day 013 used rainy teal market lanes, umbrellas, shelter rings, and wet stone reflections.
- Day 014 used a pale origami sheet on dark green studio lighting with dashed fold paths.
- Day 015 used bright bamboo greens, square canal tiles, water beads, and a gardener notebook HUD.
- Day 016 used warm amber pottery studio lighting, a centered clay vessel, ring chips, and kiln heat controls.
- Day 017 used cool midnight blues, circular web depth rings, silver strands, and anchor labels.
- Day 018 used dawn oranges, a tan maze board, torii rails, small daruma, and bottom tilt controls.

Day 019 should shift to blue-hour festival neon: saturated indigo sky, magenta/pink and gold lantern strings, bold taiko drum pads, mask icons, vertical parade lanes, and celebratory confetti. Avoid grid boards, water canals, paper fold sheets, clay vessel silhouettes, web circles, wooden maze ramps, generic Guitar Hero clones with thin note highways, tiny tap targets, or autoplay audio errors.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 016 `3d`, Day 017 `hybrid`, and Day 018 `3d`. The latest generated-mode streak is one `3d`; latest 2D streak is zero.

Mode decision: Day 019 is `2D`. This is allowed because there is no active 2D streak and the previous two days were spatial/hybrid-heavy. It must still be mechanics-rich and audiovisual, not placeholder flat art:

- Use responsive static-browser HTML/CSS/JS with canvas or DOM/canvas hybrid.
- Gameplay must depend on timing windows, beat lanes, lantern cue routing, combo memory, crowd energy, and risk/reward call-and-response patterns.
- WebAudio cues are mandatory because the theme is taiko/rhythm/listening. Audio must initialize only after a user gesture and must not autoplay.
- Visual beat feedback must be readable even if audio is muted: expanding rings, lane pulses, labels, timing text, and haptic-like screen shake.
- Portrait mobile is the default supported layout; no landscape gate.
- The next day is not forced to 3D because Day 019 begins a new 2D streak of one. Future cadence should still avoid more than three consecutive 2D games.

## Design

- Objective: Conduct a moving matsuri parade by striking large taiko pads in time with lantern cues, routing color-coded lantern carriers into matching festival lanes, and keeping crowd energy high through three call-and-response performances.
- Win condition: Complete three festival acts — Opening Don, Fox-Mask Call, and Firework Finale — while reaching 3300 points to trigger “Matsuri Grand Encore”. After the encore, continue into endless festival patterns.
- Lose condition: Crowd energy reaches 0%, three lantern carriers drop out, too many off-beat hits break the rhythm rope, or the act timer expires before required cue chains are completed.
- Core loop:
  1. Start on a title/menu screen with Day 019 badge, mode badge “2D”, public route `/matsuri/`, best score, best Grand Encore time, tutorial, prompt link, and a large Start button.
  2. Show a portrait-friendly festival street with four broad lantern lanes feeding toward a central taiko circle. Cues slide/pulse downward from lantern strings toward oversized drum pads.
  3. A performance card requests goals, for example: “Hit 6 Don beats, route 3 gold lanterns, finish one Call Echo, keep crowd energy above 70%.”
  4. Player taps Don / Ka / Hi / Ya drum pads as cue rings reach the hit band. Each pad has a distinct color, icon, label, and WebAudio tone.
  5. Lantern carriers drift in lanes. Correct beat hits open the matching lane gate; wrong/off-beat hits wobble the gate and reduce combo. Swipe or tap lane arrows can route the active carrier after the matching beat.
  6. Call-and-response moments flash a short pattern such as Don-Ka-Don. Player repeats it from memory within a generous timing window; success boosts crowd energy and unlocks a firework cue.
  7. A “Festival Focus” action slows incoming cues briefly, but charges only through accurate Good/Great hits and clean carrier routing.
  8. Completing an act lights another row of lanterns, awards points, restores one lantern carrier if needed, and unlocks denser cue phrases.
  9. Pause/restart remain available throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Matsuri Grand Encore time, longest Great streak, highest endless act, most perfect call-and-response phrases, fewest off-beat hits, and collected festival badges in localStorage.
  - Include three authored acts:
    - Opening Don: two pads active, slow Don/Ka cues, one gold lantern lane, visible timing band, no energy penalty during first guided beat.
    - Fox-Mask Call: all four pads active, first call-and-response phrase, two lantern colors, first lane routing decision, Festival Focus tutorial.
    - Firework Finale: denser syncopated cue pairs, carriers in multiple lanes, fireworks timing bonus, stricter combo windows, and crowd energy pressure.
  - Deterministic Day 019 seed varies cue patterns, lane-carrier colors, call phrases, firework bonus windows, crowd chants, endless constraints, and safe opening rhythm while keeping the first minute fair.
  - Mastery badges: finish Opening Don with 90%+ accuracy, trigger Grand Encore under 205 seconds, land a 24-hit Great streak, perfect three call phrases, route 18 lantern carriers, complete an endless act with all carriers.
  - Strategic scoring rewards planning: prioritize Great timing over frantic hits, save Festival Focus for double-cue sections, route carriers only after a matching gate opens, memorize call phrases by sound and icon order, and keep combo alive through easier lanes instead of chasing every firework bonus.
  - Endless mode after Grand Encore adds off-beat rests, alternating two-pad phrases, faster carrier lanes, rarer Focus charge, and more call phrases without shrinking touch controls.
- Difficulty scaling:
  - 0-45 seconds: two pads, broad hit window, slow cues, clear visual beat pulse, one lane color, no instant energy loss during first guided call.
  - 45-120 seconds: four pads, basic call-response, two lane colors, first Focus use, first firework bonus.
  - 120-205 seconds: syncopated cue pairs, carrier-route pressure, stricter timing, crowd chant interruptions, all festival goals active.
  - 205+ seconds/endless: denser phrases, shorter Focus windows, more lane carriers, same readable controls.
  - Keep mobile fair: drum pads must be 64px+ and thumb-friendly; cue rings and hit band must be thick and high-contrast; performance text must be short; no survival-critical cue should be tiny.
- Scoring/rewards:
  - Good hit: +45 points.
  - Great hit: +85 points times combo tier.
  - Perfect call-and-response phrase: +360 points and crowd energy boost.
  - Lantern carrier routed after matching beat: +160 points.
  - Firework bonus hit on Great timing: +240 points.
  - Act complete above 70% crowd energy: +520 points and restore one carrier.
  - Perfect no-miss act: +720 points.
  - Matsuri Grand Encore: +1200 points and endless festival patterns unlock.
  - Off-beat hit: combo reset and crowd energy -5%.
  - Missed cue: crowd energy -7%.
  - Wrong lane route: carrier -1 and combo reset.

## Controls and layout

- Desktop:
  - Mouse click/tap: hit drum pads, route lane arrows, action button, start/pause overlay button, or prompt link.
  - Keyboard: D = Don, F = Ka, J = Hi, K = Ya.
  - Arrow Left/Right or A/L: route selected lantern carrier left/right if a gate is open.
  - Space or Enter: repeat highlighted call phrase / start from menu / confirm action when relevant.
  - Shift: Festival Focus when charged.
  - P: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Four large drum pads across the lower play area or in a comfortable 2x2 thumb grid: Don, Ka, Hi, Ya. Each pad must have text, icon, and color.
  - Large Lane Left, Lane Right, Festival Focus, Pause, and Restart buttons.
  - Tapping a lane/carrier chip can select it or show a short explanation.
  - No virtual joystick. Interaction is drum timing, lane route buttons, Focus, pause/restart.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact festival HUD with score, best, carrier tokens, crowd energy, act, combo, accuracy, and time. Use lantern knots and mask chips, not recent pottery/water/web/maze chip layouts.
  - Below top: performance card with required pad hits, lane routes, call phrase status, Focus charge, and progress ticks.
  - Center: festival street / lantern-lane playfield with incoming cue rings, hit band, carrier icons, lane gates, call phrase display, firework previews, and visible no-audio timing pulses.
  - Bottom: 2x2 taiko pad grid plus lane/focus controls. Controls must not cover the hit band or active carriers.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, drum timing, Good/Great hit band, lane routing, call-and-response, Festival Focus, pause/restart, and audio-on-start note must be visible.
  - Requests must combine text, icons, lane labels, pad labels, and shapes so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Matsuri Taiko Lanternline Maestro”.
   - Shows Day 019 badge, mode badge “2D”, public route `/matsuri/`, best score, best Grand Encore time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual beat pulses work if muted.”
2. Tutorial text
   - Objective: “Hit taiko beats in time, route lantern carriers, and raise crowd energy for the Grand Encore.”
   - Timing: tap pads when cue rings overlap the bright hit band. Great hits keep combo alive.
   - Pads: Don, Ka, Hi, Ya each use a label, icon, color, and tone.
   - Lantern routes: correct beats open matching gates; route carriers left/right after a gate opens.
   - Call-and-response: watch/listen to the short phrase, then repeat it before the echo fades.
   - Festival Focus: spend charged Focus to slow cues during dense sections.
   - Pause/restart: P/R on desktop or visible buttons on mobile.
3. In-game HUD
   - Score, best score, carrier tokens, crowd energy, act name, combo, accuracy, elapsed time, current performance goals, selected carrier/lane, Focus charge, and latest timing judgment.
   - Pause/restart controls visible or immediately accessible.
4. Timing helper
   - Non-blocking helper showing next cue label, beat window, latest Good/Great/Miss, active call phrase, and next recommended lane route.
   - Must not cover active cues or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, act reached, Grand Encore status, Great streak, accuracy, lantern carriers routed, call phrases perfected, mastery badges, restart button.
7. Matsuri Grand Encore banner
   - Trigger once per run after all three acts and 3300 score.
   - Non-blocking celebration: lantern strings blaze gold, fox mask winks, fireworks burst above the lanes, crowd chant pulses the HUD, taiko pads glow in sequence, and endless festival patterns continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: fox-mask taiko conductor mascot, blue-hour matsuri street background, drum/lantern/icon sheet, and decorative firework/streamer pieces. Canvas/SVG/DOM code may draw interactive cue rings, hit bands, carrier hitboxes, lane gates, timing overlays, confetti particles, labels, and UI chrome. It should not create final character/background/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/019/assets/source/` and use optimized playable copies under `release/games/019/assets/`. Also copy optimized playable assets into `apps/day-019-matsuri-taiko-lanternline-maestro/assets/` and the public alias `release/matsuri/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid watermarks, avoid fake UI labels, avoid tiny lantern/crowd details that disappear at final in-game size, and keep mascot/drum/lantern/mask silhouettes distinct against indigo dusk backgrounds.

Generate or provide at least these final art assets:

1. Fox-mask taiko conductor mascot/source charm
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/019/assets/source/matsuri-conductor-source.png`
   - Optimized path: `release/games/019/assets/matsuri-conductor.png`
   - Imagegen2 prompt: “A charming friendly Japanese matsuri fox-mask taiko conductor mascot for a mobile 2D browser rhythm arcade game, small festival drummer spirit wearing a white kitsune half-mask, indigo happi coat, red headband, holding two taiko bachi sticks, golden lantern tassel, energetic but cute, centered readable silhouette, transparent or plain pale dusk background, no text, no watermark, sprite-friendly, high contrast at small size.”
   - Aspect ratio: square.
2. Blue-hour matsuri lantern street background source
   - Target: portrait-friendly background suitable behind a vertical rhythm-lane playfield with open readable center.
   - Archive path: `release/games/019/assets/source/matsuri-street-source.png`
   - Optimized path: `release/games/019/assets/matsuri-street.png`
   - Imagegen2 prompt: “A vibrant Japanese summer matsuri festival street at blue-hour dusk for a portrait mobile rhythm arcade game, rows of glowing paper lanterns in magenta, vermilion, and gold, yatai stall silhouettes on the sides, indigo sky, confetti streamers and distant fireworks, open readable center lane area for falling rhythm cues, crop-safe for phone portrait, no characters, no text, no watermark.”
   - Aspect ratio: portrait.
3. Taiko drum, lantern, mask, and rhythm UI icon sheet source
   - Target: square icon sheet for pads, cues, lanes, hazards, rewards, and UI decals.
   - Archive path: `release/games/019/assets/source/matsuri-icons-source.png`
   - Optimized path: `release/games/019/assets/matsuri-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese matsuri taiko rhythm game: big taiko drum pad, Don beat, Ka rim beat, Hi handclap beat, Ya chant beat, gold lantern carrier, pink lantern carrier, lane gate, fox mask, festival fan, firework burst, crowd energy heart, Festival Focus seal, Grand Encore emblem, transparent or plain pale dusk background, high contrast, no text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas festival silhouettes, document the failure in `ai/postmortems/day-019.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the fox-mask mascot, verify transparent/cutout quality or clean background handling, readable friendly silhouette, centered pivot, crop margins, no unwanted text/watermarks, stable upright orientation, and that drumstick pose does not imply wrong pad direction.
- Verify control-to-motion/audio alignment in-game: Don/Ka/Hi/Ya pads must trigger the expected cue labels, tones, and visual pulses; lane route controls must affect the selected carrier; Festival Focus must visibly slow cues; call-and-response replay must match the displayed phrase; mute/audio toggle must not break visual timing.
- For the background, verify the center lane area remains readable after portrait mobile crop and does not hide cue rings, hit band, lantern carriers, performance card, helper, or controls.
- For the icon sheet, verify drum pad, Don, Ka, Hi, Ya, lantern carriers, gate, fox mask, fan, firework, crowd heart, Focus seal, and Grand Encore emblem are distinct at final HUD/button size and cannot be confused.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because this is a taiko/rhythm/listening game, lightweight WebAudio cues are mandatory and must initialize only after a user gesture:

- Don: low warm taiko thump.
- Ka: sharper wooden rim click.
- Hi: bright handclap/tick.
- Ya: short vocal-like synth chirp, not actual speech.
- Good/Great timing: subtle pitch/volume variations, with Great slightly brighter.
- Miss/off-beat: soft muted thud.
- Call-and-response preview: same pad tones played in sequence while visual icons flash.
- Firework bonus: short sparkle sweep.
- Grand Encore: brief taiko-roll arpeggio.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD.

## Prompt page output

The archived `release/games/019/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 019 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D rhythm game under `apps/day-019-matsuri-taiko-lanternline-maestro/`.
   - Integrate it into immutable release output under `release/games/019/`.
   - Create the public playable route under `release/matsuri/`.
   - Use static HTML/CSS/JS with no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
   - Implement rhythm timing using deterministic game-time deltas and WebAudio after user gesture; do not rely on audio playback as the only source of truth.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, cue rendering, Don/Ka/Hi/Ya hit controls, Good/Great/Miss judgments, lane route controls, Festival Focus control presence, call-and-response, WebAudio initialization after user gesture, mute/failsafe behavior, generated screenshot, generated assets, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-019.md` after validation with what worked, what failed, generated-image inspection notes, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 019 is allowed as `2d` after recent 3D/hybrid days, and it must be a polished rhythm-routing game with timing, audio, call-and-response, lane routing, and progression rather than a placeholder lane demo.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/performance card, usable 64px+ drum pads, lane/focus/pause/restart controls, no forced landscape canvas, and no tiny survival-critical notes.
- Prompt is visible from gallery and release folder.
- `prompts/day-019.md` is copied exactly to `release/games/019/prompt.md` and `release/matsuri/prompt.md`.
- `release/games/019/prompt.html` and `release/matsuri/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/matsuri/index.html`, `release/matsuri/prompt.html`, `release/matsuri/screenshot.png`, and `release/matsuri/assets/` exist and work.
- Gallery card for Day 019 shows prompt availability, generation duration, public `/matsuri/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/019/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/019/assets/source/` and optimized assets exist under `release/games/019/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive rhythm/lane visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion/audio alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual timing remains playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/018/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/019/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/matsuri/index.html, release/matsuri/prompt.html, release/matsuri/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-019.md release/games/019/prompt.md and cmp prompts/day-019.md release/matsuri/prompt.md.
# Prompt HTML check: verify release/games/019/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes.
# Browser smoke: open the local/static /matsuri/ route and verify menu, tutorial, gameplay start, cue lanes, Don/Ka/Hi/Ya controls, Good/Great/Miss feedback, lane routing, Festival Focus, call-and-response display/replay, pause, restart, prompt page, WebAudio after user gesture, mute/failsafe, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable tap controls and readable HUD/performance card/lane playfield.
# Static screenshot check: inspect release/games/019/screenshot.png and release/matsuri/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-019.md.
# Docker/static smoke: build the Docker image locally, run it, curl /matsuri/ and /matsuri/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 019.
```
