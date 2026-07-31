# Day 049 Game Generation Prompt

## Game identity

- Day: 049
- Title: Yabusame Willow Target Archer
- Slug: yabusame-willow-target-archer
- Public route word: yabusame
- Mode: 2D
- Genre: mobile-first mounted-archery timing arcade / parallax shrine-course precision / score-chase
- Mood/style: a dusk riverside yabusame practice course with willow branches, vermilion shrine banners, lacquered wooden targets, straw archery markers, indigo hakama fabric, a friendly chestnut horse, gold dust motes, paper tally seals, and crisp arrow trails; a kinetic sports/timing game rather than 3D kiriko glass cutting, dragonfly dew skimming, temple roof repair, kendama cup juggling, shaved-ice sculpting, karuta card scanning, cedar climbing, mycelium routing, kintsugi shard repair, tatami layout, griddle cooking, goldfish scooping, gear trains, bridge beams, thread spheres, fan dye sectors, onsen ducts, floral stems, fruit baskets, stealth cones, tea foam, fireworks, pachinko, mochi hopping, calligraphy strokes, kite strings, sand raking, pearl diving, taiko routing, daruma rolling, web weaving, pottery shaping, bamboo canals, origami folds, parasol sheltering, snow blocks, kimono stamping, bento service, windbell tuning, rail running, koi collecting, rain roofing, glass caustics, or insect flight.

## Why this game today

The generated series currently ends with:

- Day 044 `3d`: Kakigori Prism Shavewright, bright 3D dessert sculpting with syrup routes.
- Day 045 `2d`: Kendama Star Cup Juggler, warm dusk toy-stall pendulum/cup timing.
- Day 046 `3d`: Shachi Roofline Rainwright, cool blue-hour 3D temple roof repair and rain routing.
- Day 047 `2d`: Tombo Dewline Glider, airy green-and-gold rice-paddy dragonfly route gliding.
- Day 048 `3d`: Kiriko Lantern Prism Cutter, dark ruby/cobalt 3D glass cutting with caustic light targets.

The latest generated-mode streak is one `3d` (Day 048), so Day 049 deliberately returns to a substantial `2d` game while preserving the alternating cadence. It must not be a flat tap-the-target demo: the core is side-scrolling horse pace management, draw-strength timing, vertical aim, lane/parallax target depth, release-window reading, wind/willow deflection, horse calm, target order, and clean combo planning. The visual contrast should be broad, warm outdoor motion after Day 048's dark static craft bench: peach dusk sky, green willow silhouettes, vermilion-and-cream shrine course markers, chestnut horse movement, straw/wood target discs, and bright arrow trails. Avoid ruby/cobalt glass, caustic beams, cutting wheels, rice-paper caustic cards, dragonflies, dew beads, frogs, rice terraces, roof tiles, rain chains, kendama cups/balls/string, shaved ice, syrup, card spreads, cedar trunks, beetles, mushroom networks, porcelain shards, tatami rectangles, griddles, fish tanks, gears, bridges, thread/web systems, fans, valves, flowers, fruits, stealth cones, tea bowls, fireworks launch tubes, pachinko pegs, mochi pads, calligraphy brushes, kites, rake lines, pearls, drums, daruma mazes, pottery wheels, bamboo canal tiles, origami creases, parasols, snow lanterns, kimono cloth, bento trays, windbells, rails, and koi ponds.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Canvas/SVG/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 044 `3d`, Day 045 `2d`, Day 046 `3d`, Day 047 `2d`, and Day 048 `3d`. The latest generated-mode streak is one `3d`.

Mode decision: Day 049 is a substantial `2d` game after a real 3D day. It must have meaningful mounted-archery timing/trajectory mechanics rather than decorative side-view art:

- Use static-browser HTML/CSS/JS with Canvas/SVG/DOM/WebAudio as appropriate; no backend.
- Render a 2D parallax yabusame course with horse/rider, scrolling willow/shrine markers, target stands at near/mid/far lanes, wind ribbons, arrow trails, pace dust, horse calm cues, and objective seals.
- Gameplay must depend on 2D state: horse position and pace, rider balance/calm, draw strength, aim angle, release timing, arrow flight curve, target depth/lane, wind gust phase, willow branch occlusion, target order, combo rhythm, focus charge, and player route planning.
- Player actions must manipulate the system: Pace Up, Pace Down, Aim Up, Aim Down, Draw Bow, Release Arrow, Feather Drift, Calm Horse, Swap Target, Nock Focus Arrow, Yabusame Focus, pause/restart, mute/audio, and open prompt.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Ride a shrine-side yabusame course, keep the horse calm, draw and release arrows at the correct target order, compensate for wind and willow branches, and complete three archery commissions before the course gates close.
- Win condition: Complete three target runs — First Willow Mark, Shrine Banner Triple, and Moonlit River Finale — while reaching 6300 points to trigger “Yabusame Grand Hitomi Seal”. After the banner, continue into endless target courses.
- Lose condition: Three horse-heart lives are lost, horse calm reaches 0% during a stumble, course gate timer reaches 100%, six required targets pass unhit, the final commission receives two wrong-order target hits, or draw strain reaches 100% while the horse is spooked.
- Core loop:
  1. Start on a title/menu screen with Day 049 badge, mode badge “2D”, public route `/yabusame/`, best score, best Grand Hitomi Seal time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly mounted-archery stage. The horse and rider stay near the lower-left/center lane while the course scrolls right-to-left; targets arrive on near/mid/far marker lanes with readable labels and halos.
  3. A target-run card requests goals such as: “Hit near willow target 1, pace down before the banner gate, hit mid red target 2, calm horse, then release a focus arrow on far target 3.”
  4. Player adjusts Pace Up/Pace Down. Faster pace gives more points and combo pressure but shrinks release windows and lowers horse calm if abused. Slower pace expands aim time but risks gate timer pressure.
  5. Aim Up/Aim Down changes the bow angle with a visible predicted arc. Near/mid/far targets require different aim and release timing; hue alone is never the only cue.
  6. Draw Bow charges draw strength. Releasing too early makes a short arrow; overdraw raises strain and can spook the horse.
  7. Release Arrow launches a visible arrow trail. Hits depend on aim angle, draw strength, target lane, wind, and target order. A wrong-order hit scores small points but resets combo and may fail a commission objective.
  8. Feather Drift nudges the airborne arrow slightly with fletching control when the arrow is already in flight. It costs focus and must visibly bend the trail rather than merely changing status text.
  9. Calm Horse lowers spook and restores balance when timed after willow shadows, drum markers, or high pace. Mistimed calming costs time but prevents panic-spamming.
  10. Swap Target cycles the active target order marker only when the commission allows route choice; otherwise it reveals why the current target remains required.
  11. Nock Focus Arrow spends a focus shard to make the next arrow glow, widen the target ring slightly, and pierce a willow-branch occlusion if the aim is otherwise correct.
  12. Yabusame Focus, charged by clean hits, stable pace, calm horse beats, and correct order, overlays target order, predicted arrow arc, wind drift, release window, horse calm risk, gate timer pressure, and safest next action.
  13. Completing a target run stamps a paper hitomi seal, restores one horse heart if below max, awards points, shifts the course scenery, and unlocks narrower targets, diagonal wind, moving target carts, willow occlusions, stricter order chains, faster gates, and optional bonus fan targets.
  14. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Yabusame Grand Hitomi Seal time, longest perfect-hit chain, highest stable-pace combo, most far-lane hits, most willow-pierce focus arrows, highest endless course number, fewest wrong-order hits, best no-focus run, lowest final strain, and collected hitomi seal badges in localStorage.
  - Include three authored commissions:
    - First Willow Mark: broad near target, slow course speed, gentle wind, guided first Pace Up/Pace Down, Aim Up/Down, Draw Bow, Release Arrow, and Calm Horse. No heart penalty for the first tutorial miss.
    - Shrine Banner Triple: near/mid/far target order, first Swap Target explanation, first Feather Drift correction, first willow-branch shadow, and one calm-horse beat after a banner gate.
    - Moonlit River Finale: five targets across all lanes, diagonal wind, required Yabusame Focus preview, one moving cart target, one Nock Focus Arrow opportunity through willow occlusion, gate below 55%, and no wrong-order hits in the final chain.
  - Deterministic Day 049 seed varies target order, lane depth, wind gust side, target stand speed, willow occlusion timing, horse calm drain, draw strain gain, gate pressure, focus charge, release-window width, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Willow Mark with zero misses, trigger Grand Hitomi Seal under 285 seconds, finish Shrine Banner Triple with every hit perfect, clear Moonlit River Finale with horse calm above 70%, chain eight correct targets, hit three far-lane targets in one run, pierce a willow target with Nock Focus Arrow, and complete a commission without Yabusame Focus.
  - Strategic scoring rewards rhythm and control: settle horse pace before drawing, match aim to lane depth, release near the green draw window, compensate for wind before target center, save Feather Drift for small corrections, calm after spook cues, use focus arrows only when target order and lane are correct, and never chase a passed target at the cost of the next commission objective.
  - Endless mode after Grand Hitomi Seal adds alternating target carts, paired near/far gates, stronger wind pulses, willow branch masks, shorter draw windows, moving bonus fans, stricter horse-calm management, and bonus seals without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: slow target arrival, broad near target, big predicted arc, forgiving release window, horse calm does not drop below 55%, visible route hints.
  - 45-150 seconds: mid/far lanes, first wind ribbon, banner gate, first Feather Drift, first calm-horse timing cue.
  - 150-285 seconds: required Yabusame Focus, moving target, willow occlusion, target-order pressure, gate timer below 55%.
  - 285+ seconds/endless: faster gates, narrower rings, more wind, longer target orders, same readable controls.
  - Keep mobile fair: horse/rider, bow angle, arrow trajectory, target rings, lane markers, wind ribbons, willow shadows, commission card, helper, focus/calm/strain/gate HUD, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical target labels.
- Scoring/rewards:
  - Stable pace through a target zone: +120 points times combo tier.
  - Correct ordered target hit: +290 points and Yabusame Focus charge.
  - Perfect center hit during the release window: +390 points and combo protect.
  - Far-lane hit with visible wind compensation: +330 points.
  - Feather Drift correction that converts a near miss into a hit: +260 points.
  - Calm Horse after a spook cue: +240 points and calm restore.
  - Nock Focus Arrow through willow occlusion: +420 points.
  - Complete target run before gate warning: +1160 points and restore one horse heart if below max.
  - Perfect no-miss commission: +1650 points.
  - Yabusame Grand Hitomi Seal: +3900 points and endless courses unlock.
  - Wrong-order hit, overdraw, missed target, horse stumble, ignored spook cue, or late gate: combo reset and calm/gate penalty.

## Controls and layout

- Desktop:
  - Mouse click/tap on the stage: set aim focus, inspect target/lane/wind/willow/horse-calm chips, or select a target marker.
  - Mouse drag on the stage: aim bow vertically and preview release arc with a cursor offset above the pointer.
  - Arrow keys or WASD: Pace Up/Down and Aim Up/Down.
  - Space or Enter: Draw Bow / Release Arrow depending on draw state.
  - Shift or D: Draw Bow hold shortcut.
  - X: Release Arrow.
  - F: Feather Drift while an arrow is in flight.
  - C: Calm Horse.
  - T: Swap Target.
  - N: Nock Focus Arrow.
  - Y or F when charged and no arrow in flight: Yabusame Focus.
  - P or Escape: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Drag vertically on the stage to aim; the arc cursor stays above the finger so targets, horse, wind ribbons, and arrow trails remain visible.
  - Tap targets, wind ribbons, willow shadows, horse/calm chips, or lane labels to explain them, then use large action buttons.
  - Use large Pace Up, Pace Down, Aim Up, Aim Down, Draw Bow, Release Arrow, Feather Drift, Calm Horse, Swap Target, Nock Focus Arrow, Yabusame Focus, Pause, Restart, Audio, and Prompt buttons.
  - Tapping calm/strain/gate/focus/commission chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct stage aim plus labeled archery/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Yabusame HUD with score, best, horse hearts, calm %, strain %, gate %, combo, active lane, target order, wind, Yabusame Focus charge, and elapsed time. Use horse/arrow/bow/target/wind/willow/gate/calm/seal chips, not glass/dew/roof/rain/toy/dessert/card/beetle/mushroom/shard/tatami/cake/fish/gear/bridge/thread/fan/valve/flower/fruit/lattice/tea/firework/koi icons.
  - Below top: target-run commission card with ordered target lanes, pace target, calm target, wind note, progress ticks, and current archery-master note.
  - Center: large 2D yabusame course stage with horse/rider, bow arc, arrow trail, target stands, lane markers, wind ribbons, willow branch shadows, helper art, and readable hit feedback. It must remain playable without zooming.
  - Bottom: status helper plus large archery/action controls. Controls must not cover horse, arrow trajectory, target rings, wind ribbons, helper, commission card, willow warnings, or Yabusame Focus overlays.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, Pace Up/Down, Aim Up/Down, Draw Bow, Release Arrow, Feather Drift, Calm Horse, Swap Target, Nock Focus Arrow, Yabusame Focus, pause/restart must be visible.
  - Requests must combine text, icons, lane labels, target shapes, arrow-path previews, progress ticks, target halos, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Yabusame Willow Target Archer”.
   - Shows Day 049 badge, mode badge “2D”, public route `/yabusame/`, best score, best Grand Hitomi Seal time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual horse, bow, arrow, target, wind, willow, calm, gate, and focus cues work if muted.”
2. Tutorial text
   - Objective: “Ride the course, manage pace, aim and release arrows into ordered targets, calm the horse, and beat the closing gates.”
   - Movement/timing: adjust Pace Up/Down, Aim Up/Down, Draw Bow to the green window, then Release Arrow.
   - Ballistics: lane depth, wind ribbons, draw strength, and release timing change the arrow arc.
   - Horse care: Calm Horse after spook cues; high pace and overdraw raise strain.
   - Special tools: Feather Drift bends an airborne arrow, Swap Target explains/changes allowed order, Nock Focus Arrow pierces willow shadows, and Yabusame Focus previews target order, arc, wind, release window, calm risk, and gate pressure.
   - Pause/restart: visible buttons on mobile or keyboard shortcuts on desktop.
3. In-game HUD
   - Score, best score, horse hearts, calm %, strain %, gate %, commission name, combo, active lane, next target, wind, Yabusame Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next target/lane, current pace, draw window, aim validity, wind drift, horse calm risk, Yabusame Focus readiness, and expected score effect.
   - Must not cover the course stage or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Grand Hitomi Seal status, calm %, strain peak, wrong-order hits, perfect centers, far hits, badges, restart button.
7. Yabusame Grand Hitomi Seal banner
   - Trigger once per run after all three target runs and 6300 score.
   - Non-blocking celebration: horse pace dust becomes gold, three targets bloom with paper seals, arrow trails write a crescent in the sky, willow leaves scatter, shrine banners glow, a hitomi seal stamps the commission card, and endless courses continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: horse-and-archer player/helper sprite, portrait yabusame course background, target/wind/willow/arrow material sprite sheet, and Yabusame action/focus UI icon sheet. Canvas/SVG code may render the interactive parallax course, hitboxes, target rings, predicted arcs, arrow trails, lane markers, wind ribbons, particles, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/049/assets/source/` and use optimized playable copies under `release/games/049/assets/`. Also copy optimized playable assets into `apps/day-049-yabusame-willow-target-archer/assets/` and the public alias `release/yabusame/assets/`. The public alias should receive optimized playable copies only, not a duplicated `assets/source/` tree.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in readable text, avoid watermarks, avoid fake UI labels, avoid tiny target or arrow details that disappear at final in-game size, and keep horse/rider/bow/arrow/target/wind/willow/gate/seal silhouettes distinct against warm dusk shrine-course backgrounds.

Generate or provide at least these final art assets:

1. Horse-and-archer player/helper sprite
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/049/assets/source/yabusame-rider-source.png`
   - Optimized path: `release/games/049/assets/yabusame-rider.png`
   - Imagegen2 prompt: “A charming readable yabusame horse-and-archer hero for a mobile 2D Japanese mounted archery arcade game, friendly chestnut horse in motion facing to the right as the natural forward direction, small focused archer in indigo hakama and light armor drawing a simple yumi bow, vermilion shrine ribbon accent, warm dusk rim light, centered sprite silhouette, transparent or solid pale rice-paper background, no checkerboard background, no readable text, no watermark, high contrast at 64-128 pixels.”
   - Aspect ratio: square.
2. Dusk yabusame shrine-course background source
   - Target: portrait-friendly background suitable behind an overlaid 2D side-scrolling archery course with open readable center.
   - Archive path: `release/games/049/assets/source/yabusame-course-source.png`
   - Optimized path: `release/games/049/assets/yabusame-course.png`
   - Imagegen2 prompt: “A dusk Japanese yabusame mounted archery practice course for a portrait mobile 2D arcade game, riverside shrine path, willow branches near the edges, vermilion banners and straw markers, lacquered wooden target stands to the sides, warm peach sky, indigo shadows, drifting gold dust motes, open readable central lane for overlaid horse rider, arrow trails, and target rings, crop-safe for phone portrait, no central character, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Target, arrow, willow, wind, and gate sprite sheet source
   - Target: square sheet with separated readable materials usable as sprites/decals/textures.
   - Archive path: `release/games/049/assets/source/yabusame-pieces-source.png`
   - Optimized path: `release/games/049/assets/yabusame-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable Japanese yabusame mounted archery game pieces: lacquered wooden target disc, straw target stand, bamboo lane marker, white arrow with feather fletching, golden arrow trail, green wind ribbon, willow branch shadow, vermilion banner gate, horse heart charm, draw-strain warning spark, paper hitomi seal, perfect-center burst, each element separated with generous margins, transparent or pale rice-paper background, no checkerboard background, no readable text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Yabusame action, horse, target, wind, and focus UI icon sheet source
   - Target: square icon sheet for objectives, hazards, tools, rewards, and UI decals.
   - Archive path: `release/games/049/assets/source/yabusame-icons-source.png`
   - Optimized path: `release/games/049/assets/yabusame-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese yabusame mounted archery arcade game: pace up hoof, pace down hoof, aim up bow, aim down bow, draw bow, release arrow, feather drift, calm horse, swap target, focus arrow, Yabusame Focus archer-eye crest, wind drift, gate timer, horse calm heart, draw strain, hitomi seal, Grand Hitomi Seal crest, transparent or solid pale rice-paper background, no checkerboard background, high contrast, no readable text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas horse/rider/target/wind/willow/icon silhouettes, document the failure in `ai/postmortems/day-049.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the horse-and-archer sprite, verify transparent/cutout quality or clean background handling, readable mounted-archer silhouette, centered pivot/crop margins, no unwanted text/watermarks, natural forward direction facing right, and that runtime movement/arrow release uses this right-facing baseline correctly.
- For the pieces sheet, verify separated target disc, target stand, lane marker, arrow, arrow trail, wind ribbon, willow branch shadow, banner gate, horse heart, strain warning, hitomi seal, and perfect-center burst at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted readable text/watermark, and a documented visual baseline: targets are wooden discs, wind is a green ribbon, willow shadows are translucent leaf bands, gates are vermilion banners, hitomi seals are paper reward stamps.
- Verify control-to-motion alignment in-game: Pace Up/Down must visibly change course scroll speed and calm/gate tradeoff, Aim Up/Down must move the predicted arc, Draw Bow must visibly charge strength/strain, Release Arrow must launch an arrow along the predicted arc, Feather Drift must visibly bend an airborne arrow, Calm Horse must reduce spook/calm warnings, Swap Target must change or explain target order, Nock Focus Arrow must change the next arrow visual and pierce eligible willow occlusion, Yabusame Focus must preview target order/arc/wind/release/calm/gate paths, Pause/Restart must work.
- For the background, verify the central course lane remains readable after portrait mobile crop and does not hide horse/rider, arrow trails, target rings, lane markers, wind ribbons, commission card, helper, willow warnings, or controls.
- For the icon sheet, verify pace, aim, draw, release, feather drift, calm horse, swap target, focus arrow, Yabusame Focus, wind, gate, calm, strain, seal, and Grand Hitomi Seal icons are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale rice paper if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because horse hoofbeats, bow drawing, arrow release, wind drift, target hits, gate drums, horse calm, and shrine seals are central to the theme, include lightweight WebAudio cues initialized only after a user gesture:

- Soft hoofbeat and shrine course chime when Start begins.
- Tight string tension sound while Draw Bow charges.
- Bow twang when Release Arrow fires.
- Feather flutter when Feather Drift bends an arrow.
- Wooden thunk for target hit, brighter chime for perfect center.
- Warm horse-breath cue when Calm Horse succeeds.
- Low gate drum when gate pressure rises.
- Willow rustle warning when occlusion approaches.
- Focus shimmer when Nock Focus Arrow or Yabusame Focus activates.
- Shrine bell/flourish when Yabusame Grand Hitomi Seal triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day049Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/049/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 049 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 2D game under `apps/day-049-yabusame-willow-target-archer/`.
   - Integrate it into immutable release output under `release/games/049/`.
   - Create the public playable route under `release/yabusame/`.
   - Use static HTML/CSS/JS with Canvas/SVG/DOM/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document horse/arrow/target/wind/willow visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, horse/rider stage render, stage drag aiming, Pace Up/Down, Aim Up/Down, Draw Bow, Release Arrow, Feather Drift, Calm Horse, Swap Target, Nock Focus Arrow, Yabusame Focus control presence and visible mechanical effect, calm/strain/gate/target/wind/commission feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-049.md` after validation with what worked, what failed, generated-image inspection notes, horse/arrow/target/wind/willow visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 049 is `2d` after Day 048 `3d`, with meaningful horse pace, draw strength, aim angle, arrow ballistics, target order, wind/willow effects, calm/strain, gate pressure, and focus mechanics rather than decorative side-scrolling art.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card/stage, usable 44px+ archery/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical target labels.
- Prompt is visible from gallery and release folder.
- `prompts/day-049.md` is copied exactly to `release/games/049/prompt.md` and `release/yabusame/prompt.md`.
- `release/games/049/prompt.html` and `release/yabusame/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/yabusame/index.html`, `release/yabusame/prompt.html`, `release/yabusame/screenshot.png`, and `release/yabusame/assets/` exist and work.
- Gallery card for Day 049 shows prompt availability, generation duration, public `/yabusame/` links, mode `2d`, and actual generated date.
- Screenshot exists at `release/games/049/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/049/assets/source/` and optimized assets exist under `release/games/049/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive horse/arrow/target/wind/willow visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual horse/arrow/target/wind/willow/commission cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/048/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/049/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/yabusame/index.html, release/yabusame/prompt.html, release/yabusame/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-049.md release/games/049/prompt.md and cmp prompts/day-049.md release/yabusame/prompt.md.
# Prompt HTML check: verify release/games/049/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /yabusame/ route and verify menu, tutorial, gameplay start, horse/rider render, stage drag aiming, Pace Up/Down, Aim Up/Down, Draw Bow, Release Arrow, Feather Drift, Calm Horse, Swap Target, Nock Focus Arrow, Yabusame Focus, calm/strain/gate/target/wind feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable archery/action controls plus readable HUD/commission card/stage/controls.
# Static screenshot check: inspect release/games/049/screenshot.png and release/yabusame/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-049.md.
# Docker/static smoke: build the Docker image locally, run it, curl /yabusame/ and /yabusame/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 049.
```
