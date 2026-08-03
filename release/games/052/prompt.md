# Day 052 Game Generation Prompt

## Game identity

- Day: 052
- Title: Kamome Tide Signalkeeper
- Slug: kamome-tide-signalkeeper
- Public route word: kamome
- Mode: 3D
- Genre: mobile-first 3D harbor-signal routing arcade / fog-navigation puzzle / lighthouse score chase
- Mood/style: a crisp dawn fishing harbor seen as a small 3D diorama: pale aqua tide channels, lacquer-red breakwater rails, weathered wooden piers, white signal flags, brass lighthouse lenses, ceramic buoy bells, paper lantern boat bows, gull feathers, violet fog banks, and gold sunrise streaks. It should feel like calm but urgent maritime signaling and depth-aware boat routing, not fire-brigade emergency action, shrine-stage dancing, mounted archery, glass cutting, dragonfly flight, roof repair, kendama juggling, dessert sculpting, card scanning, beetle climbing, mycelium routing, kintsugi repair, tatami layout, griddle cooking, fish scooping, gear trains, bridges, thread/web systems, fan dyeing, valves/onsen ducts, ikebana, fruit picking, stealth escorting, tea foam, fireworks, pachinko, mochi hopping, calligraphy, kite mapping, dry-garden raking, pearl diving, taiko rhythm routing, rolling daruma mazes, pottery wheels, bamboo canals, origami folds, parasol shields, snow blocks, kimono stamping, bento service, windbells, train rails, koi ponds, or alley firefighting.

## Why this game today

The generated series currently ends with:

- Day 047 `2d`: Tombo Dewline Glider, green-gold rice-paddy dragonfly dewline flight.
- Day 048 `3d`: Kiriko Lantern Prism Cutter, dark ruby/cobalt glass cutting with caustic targets.
- Day 049 `2d`: Yabusame Willow Target Archer, warm dusk mounted archery with targets, horse pace, bow draw, and wind.
- Day 050 `3d`: Kagura Mask Star Dancer, dark indigo shrine-stage rhythm/pose matching with masks and beat rings.
- Day 051 `hybrid`: Matoi Ember Alley Brigade, blue-black Edo alley firefighting with hoses, water pulses, smoke, rescues, and firebreaks.

The latest generated-mode streak is one `hybrid` (Day 051), so Day 052 deliberately returns to real `3D` with a very different mood: bright dawn harbor navigation rather than dark smoke/fire crisis. The game should use real spatial depth: near/mid/far tide lanes, channel elevation/tide height, lighthouse beam angle, buoy depth, fog-bank opacity, boat heading, signal-flag state, breakwater gate timing, tug route, gull distraction, and camera-relative channel selection all matter mechanically. It must not be a flat traffic-control grid with perspective decoration.

Visual contrast notes from recent screenshots:

- Day 051 uses a dark isometric alley, orange ember clusters, blue water arcs, smoky overlays, and right-side action buttons.
- Day 050 uses a centered dark 3D stage with cedar tiles, warm spotlights, dancer billboard, star marks, and ritual controls.
- Day 049 uses a wide warm riverside archery course with large circular targets, horse/rider, and arrow arcs.

Day 052 should switch to airy maritime clarity: open blue-green channels, dawn fog sheets, white signal flags, brass/gold lighthouse beams, red breakwater gates, tiny lantern boats, floating buoys, gull silhouettes, and wake trails. Avoid flames, hoses, bucket chains, matoi standards, smoke-rescue cats, stage grids, dancers, masks, gohei, beat rings, targets, horses, arrows, glass facets/caustics, dragonflies/dewlines, roof tiles/rain chains, kendama balls/cups, shaved ice/syrup, karuta cards, tree trunks/beetles, mushrooms, ceramic shards, tatami rectangles, griddles/cakes, fish tanks, gears, bridge-building materials, embroidery/web threads, fan dye sectors, onsen valves, flowers, fruit baskets, stealth cones, tea bowls, launch tubes, pachinko pegs, mochi pads, brush strokes, kite strings, sand rake paths, pearls, drums, daruma balls, pottery profiles, bamboo water tiles, origami creases, parasols, snow blocks, kimono cloth, bento trays, windbells, rail tracks, and koi.

## Code isolation / no previous game source

The implementation must be written from scratch for this day. Do not open, inspect, copy, diff, grep, or adapt code from previous games, including old `apps/day-*` folders, old `release/games/NNN/` HTML/CSS/JS files, or old public alias folders. You may inspect previous metadata, prompts, postmortems, and screenshots only to avoid repeating concepts and visual identity. The new game's HTML/CSS/JS must come from this prompt and general browser/Three.js/WebGL/WebAudio game knowledge, not from earlier game implementations.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently ends with Day 047 `2d`, Day 048 `3d`, Day 049 `2d`, Day 050 `3d`, and Day 051 `hybrid`. The latest generated-mode streak is one `hybrid`.

Mode decision: Day 052 is real `3D`:

- Use Three.js/WebGL or equivalent static-browser 3D rendering; no backend.
- Render a compact harbor diorama with near/mid/far water lanes, tide-height bands, breakwater walls, lighthouse tower, rotating beam cones, buoy-bell markers, paper-lantern boats, fog banks as translucent 3D sheets, wake trails, gull shadows, gate arms, and a readable signalkeeper post.
- Gameplay must depend on 3D state: boat lane/depth, heading, tide height, beam angle, signal flag color/height, buoy sequence, fog density, tide-gate timing, tug path, pier clearance, gull distraction, wake turbulence, channel draft, focus charge, and camera-relative controls.
- Player actions must manipulate the 3D system: Shift Lane Near/Mid/Far, Rotate Lighthouse, Raise Flag, Lower Flag, Ring Buoy Bell, Open Tide Gate, Send Tug, Drop Buoy, Fan Fog, Kamome Focus, pause/restart, audio toggle, and prompt link.
- Portrait mobile is the default supported layout; no landscape gate.

## Design

- Objective: Guide lantern boats safely through three dawn harbor commissions by selecting their depth lane, aiming lighthouse beams, raising the correct signal flag, ringing buoy bells in sequence, opening tide gates, sending tug assists, dropping temporary guide buoys, clearing fog fans, and keeping channel risk low until all vessels reach the sunrise pier.
- Win condition: Complete three authored commissions — First Harbor Signal, Fog Bell Narrows, and Sunrise Breakwater Convoy — while reaching 6600 points to trigger “Kamome Dawn Harbor Clear”. After the banner, continue into endless tide-shift commissions.
- Lose condition: Three harbor-heart lives are lost, channel risk reaches 100%, fog reaches 100%, tide-gate damage reaches 100%, five boats miss their buoy sequence, two lantern boats collide with a pier/gate, or the final convoy reaches the breakwater with fewer than two safe boats.
- Core loop:
  1. Start on a title/menu screen with Day 052 badge, mode badge “3D”, public route `/kamome/`, best score, best Dawn Harbor Clear time, tutorial, prompt link, audio note, and a large Start button.
  2. Show a portrait-friendly 3D harbor diorama. The camera sits slightly above the signalkeeper hut, looking down through near/mid/far tide channels toward a sunrise pier and a rotating lighthouse beam.
  3. A harbor commission card requests goals such as: “Guide boat 1 through mid buoy, raise white flag high, rotate lighthouse east, ring blue buoy bell, open red gate, then send tug before fog tick.”
  4. Shift Lane Near/Mid/Far changes the active boat or selected route lane. Boat wake, lane highlight, and helper text must visibly update, not only the status line.
  5. Rotate Lighthouse turns the beam cone. Boats inside the beam gain heading confidence, fog becomes visible, and hidden buoy order glows. Wrong angle can dazzle gulls or miss a gate.
  6. Raise Flag / Lower Flag changes signal height and color state. High flag commands open-water speed; low flag commands slow docking approach. Holding the wrong height through a tide tick increases channel risk.
  7. Ring Buoy Bell activates the selected buoy in the sequence. Correct bell order pulls boats into safe arcs; wrong bell order breaks combo and creates a confusing echo marker for a few seconds.
  8. Open Tide Gate toggles red breakwater gate arms. Opening too early lets wake turbulence through; opening too late risks collision. The gate arm must visibly rotate in 3D.
  9. Send Tug creates a small helper tug route that can nudge one boat around a pier, rescue a wrong lane, or stabilize a convoy turn. It has a cooldown and should be used strategically.
  10. Drop Buoy places a temporary ceramic buoy marker in the active lane. It bends the boat route, scores if used before fog, and expires after a few tide ticks.
  11. Fan Fog clears a short cone of violet fog and reveals hidden gull/wake/tide hazards. It spends focus or wind reserve, so timing matters.
  12. Kamome Focus, charged by clean beam guidance, correct flags, buoy sequences, gate timing, tug saves, and fog clears, overlays predicted boat path, fog spread, tide height, gate timing, buoy order, collision risk, best tug lane, and safest next action.
  13. Completing a commission stamps a shell-route seal, restores one harbor heart if below max, awards points, shifts scenery from inner pier to fog narrows to sunrise breakwater, and unlocks taller tide swells, crosswinds, hidden buoys, gull distractions, split convoys, stricter gate timing, and bonus shell-lane chains.
  14. Pause/restart remain visible throughout.
- 15+ minute play-value strategy:
  - Save best score, fastest Kamome Dawn Harbor Clear time, longest no-collision convoy, highest perfect-buoy chain, most tug saves, cleanest fog clear, best no-focus harbor clear, lowest final channel risk, highest endless tide commission, highest wake-efficiency combo, and collected shell-route seal badges in localStorage.
  - Include three authored commissions:
    - First Harbor Signal: one boat, broad mid lane, slow tide, obvious lighthouse arc, guided Shift Lane, Rotate Lighthouse, Raise/Lower Flag, Ring Buoy Bell, and Open Tide Gate. No heart penalty for the first tutorial miss.
    - Fog Bell Narrows: two depth lanes, first violet fog bank, first hidden buoy order, first tug assist around a pier, first Drop Buoy route bend, and one low-flag docking approach.
    - Sunrise Breakwater Convoy: three lantern boats, required Kamome Focus preview, two gate arms, one gull distraction, two buoy sequences, tide-gate damage below 55%, and at least two safe boats reaching the sunrise pier.
  - Deterministic Day 052 seed varies boat order, lane depth, tide height, lighthouse beam width, signal-flag response, buoy sequence, fog opacity, gate timing, tug cooldown, gull path, wake turbulence, focus charge, commission length, and endless constraints while keeping opening seconds fair.
  - Mastery badges: complete First Harbor Signal with zero risk gain, trigger Dawn Harbor Clear under 285 seconds, clear Fog Bell Narrows with every buoy correct, finish Sunrise Breakwater Convoy with all boats safe, chain eight perfect lighthouse/flag actions, use exactly one tug save, clear one commission without Kamome Focus, and finish with fog below 40%.
  - Strategic scoring rewards: rotate the beam before flagging, lower flag before tight docks, ring bells in order, open gates during the green tide window, send tugs for wrong-lane recovery rather than routine turns, drop buoys before fog hides the lane, fan fog ahead of hidden buoy chains, and save Kamome Focus for convoy/gate hazards.
  - Endless mode after Dawn Harbor Clear adds cross-current lanes, paired gate arms, faster fog sheets, gull flock shadows, longer boat trains, hidden buoy pairs, shallower draft warnings, bonus shell routes, and higher combo multipliers without shrinking touch targets.
- Difficulty scaling:
  - 0-45 seconds: one boat, slow tide, broad beam, obvious mid lane, one gate, visible buoy, forgiving channel risk.
  - 45-150 seconds: two depth lanes, first fog bank, first tug save, first low/high flag distinction, first Drop Buoy route bend.
  - 150-285 seconds: required Kamome Focus, three-boat convoy, two gate arms, hidden buoy, gull distraction, tide damage below 55%.
  - 285+ seconds/endless: faster tide ticks, tighter gates, denser fog, longer convoys, hidden buoy pairs, same readable controls.
  - Keep mobile fair: boats, lane highlights, lighthouse beam, flags, buoy bells, tide gates, tug route, fog cone, dropped buoys, gull warnings, commission card, helper, focus/fog/channel/tide/gate HUD, and action buttons must be readable at 390x844; primary touch buttons should be 52px+ where possible and never below 44px; no tiny survival-critical buoy labels.
- Scoring/rewards:
  - Clean lighthouse guidance through an active fog patch: +320 points and Kamome Focus charge.
  - Correct high/low signal flag before tide tick: +250 points.
  - Ring correct buoy in sequence: +340 points and combo protect.
  - Open Tide Gate in the green window: +410 points.
  - Send Tug to prevent wrong-lane collision: +430 points.
  - Drop Buoy that bends a boat into the target lane: +360 points.
  - Fan Fog revealing hidden buoy/gull hazard: +280 points.
  - Complete commission before channel warning: +1250 points and restore one harbor heart if below max.
  - Perfect no-collision convoy: +1800 points.
  - Kamome Dawn Harbor Clear: +4200 points and endless tide commissions unlock.
  - Wrong flag height, wrong buoy bell, beam pointed away, early/late gate, wasted tug, fog-hidden collision, gull panic, or missed buoy sequence: combo reset and channel/fog/gate penalty.

## Controls and layout

- Desktop:
  - Mouse click/tap on the harbor: select/explain boat, lane, lighthouse beam, buoy, fog bank, tide gate, tug, pier, gull, dropped buoy, or commission target.
  - Mouse drag on the harbor: rotate the lighthouse beam with an offset preview so the beam path stays visible.
  - Arrow keys or WASD: Shift Lane Near/Mid/Far and steer selected boat route (W/S for far/near, A/D for left/right lane nudge).
  - Q/E: Rotate Lighthouse left/right.
  - W/S while action controls are focused: Raise Flag / Lower Flag.
  - Space or Enter: Ring Buoy Bell.
  - G: Open Tide Gate.
  - T: Send Tug.
  - D: Drop Buoy.
  - F: Fan Fog.
  - K: Kamome Focus when charged.
  - P or Escape: pause/resume.
  - R: restart current run.
- Mobile/touch:
  - Tap boats/lanes/buoys/gates/fog to inspect, but primary play uses large labeled controls so thumbs do not hide boat paths.
  - Drag on the harbor to aim lighthouse beam; visible beam preview stays above the finger.
  - Use large Shift Lane, Rotate Lighthouse, Raise Flag, Lower Flag, Ring Buoy Bell, Open Tide Gate, Send Tug, Drop Buoy, Fan Fog, Kamome Focus, Pause, Restart, Audio, and Prompt buttons. If Shift Lane is a cycling button, also provide compact Near/Mid/Far lane buttons or lane chips with visible confirmation.
  - Tapping fog/channel/tide/gate/focus/commission chips may show short explanations.
  - No tiny virtual joystick. Interaction is direct harbor inspection plus labeled signal/action controls.
- Mobile layout/orientation:
  - Default target is portrait phone play around 390x844; do not require landscape.
  - Top: compact Kamome HUD with score, best, harbor hearts, channel risk %, fog %, tide height, gate damage %, combo, active boat/lane, flag height/color, beam direction, Kamome Focus charge, and elapsed time. Use boat/flag/lighthouse/buoy/tug/gate/fog/gull/wake/shell/tide chips, not fire/hose/matoi/stage/mask/gohei/target/horse/glass/dew/roof/kendama/dessert/card/beetle/mushroom/shard/tatami/fish/gear/bridge/thread/fan/flower/fruit/tea/firework/koi icons.
  - Below top: harbor commission card with ordered boat/buoy/gate/flag requirements, tide note, fog warning, tug/drop buoy requirement, progress ticks, and current harbor-master note.
  - Center: large 3D harbor diorama with boats, channels, lighthouse beam, buoys, gates, fog banks, tug route, dropped buoy markers, gull shadows, wake trails, helper art, and readable hit feedback. It must remain playable without zooming.
  - Bottom: status helper plus large signal/action controls. Controls must not cover boats, beam cone, buoy bells, gate arms, fog warnings, commission card, helper, or Kamome Focus overlays.
  - Tutorial must fit on the first portrait screen; optional details may be collapsible but objective, Shift Lane, Rotate Lighthouse, Raise/Lower Flag, Ring Buoy Bell, Open Tide Gate, Send Tug, Drop Buoy, Fan Fog, Kamome Focus, pause/restart must be visible.
  - Requests must combine text, icons, lane coordinates, arrows, beam cones, buoy numbers, progress ticks, flag-height chips, and labels so hue alone is not required.

## Menu and tutorial

Implement these states:

1. Title screen
   - Shows title “Kamome Tide Signalkeeper”.
   - Shows Day 052 badge, mode badge “3D”, public route `/kamome/`, best score, best Dawn Harbor Clear time if available, and a prompt link.
   - Shows a large Start button and visible tutorial panel by default.
   - Notes: “Audio starts after you press Start; visual boat, lighthouse, flag, buoy, gate, tug, fog, tide, gull, and focus cues work if muted.”
2. Tutorial text
   - Objective: “Guide lantern boats through near/mid/far tide lanes, signal with flags and lighthouse beams, ring buoy bells, and clear fog until the sunrise pier is safe.”
   - 3D navigation: depth lanes and tide height matter; shift lanes before boats reach gates.
   - Signals: Raise Flag for speed, Lower Flag for docking, Rotate Lighthouse to reveal fog and confirm heading.
   - Harbor tools: Ring Buoy Bell in order, Open Tide Gate during the green window, Send Tug for rescues, Drop Buoy to bend a route.
   - Kamome Focus: previews boat paths, fog spread, gate timing, buoy order, tug lane, tide height, and collision risk.
   - Pause/restart: visible buttons on mobile or keyboard shortcuts on desktop.
3. In-game HUD
   - Score, best score, harbor hearts, channel risk %, fog %, tide height, gate damage %, commission name, combo, active boat/lane, flag state, beam direction, Kamome Focus charge, elapsed time, latest warning.
   - Pause/restart controls visible or immediately accessible.
4. Status helper
   - Non-blocking helper showing next buoy, lane validity, flag recommendation, gate timing, fog risk, tug readiness, focus readiness, and expected score effect.
   - Must not cover the 3D harbor or bottom controls on mobile.
5. Pause overlay
   - Resume, restart, tutorial reminder, controls summary, audio/mute toggle, prompt link.
6. Game-over/results overlay
   - Final score, best score, commission reached, Dawn Harbor Clear status, boats saved, perfect buoy chain, tug saves, fog peak, gate damage, channel risk, badges, restart button.
7. Kamome Dawn Harbor Clear banner
   - Trigger once per run after all three commissions and 6600 score.
   - Non-blocking celebration: sunrise gold fills the harbor, gulls arc over the lighthouse, shell-route seals stamp the commission card, buoys chime in sequence, lantern boats gather at the pier, fog peels away, and endless tide commissions continue after the banner fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: signalkeeper/helper sprite, portrait harbor background, boats/buoys/gates/material sprite sheet, and Kamome action/focus UI icon sheet. Three.js primitives may render the interactive harbor lanes, boats as billboards/planes, lighthouse beam cones, buoy halos, fog sheets, gate arms, tug path, wakes, particles, and UI chrome. It should not create final character/background/texture/icon art from scratch unless Imagegen2 is unavailable after a real attempt.

Archive source generated art under `release/games/052/assets/source/` and use optimized playable copies under `release/games/052/assets/`. Also copy optimized playable assets into `apps/day-052-kamome-tide-signalkeeper/assets/` and the public alias `release/kamome/assets/`. The public alias should receive optimized playable copies only, not a duplicated `assets/source/` tree.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in readable text, avoid watermarks, avoid fake UI labels, avoid tiny boat/buoy/flag details that disappear at final in-game size, and keep boat/lighthouse/flag/buoy/tug/fog/gull/wake/shell silhouettes distinct against aqua dawn harbor backgrounds and violet fog.

Generate or provide at least these final art assets:

1. Kamome signalkeeper/helper sprite
   - Target: transparent PNG if possible, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/052/assets/source/kamome-signalkeeper-source.png`
   - Optimized path: `release/games/052/assets/kamome-signalkeeper.png`
   - Imagegen2 prompt: “A charming readable Japanese dawn harbor signalkeeper hero for a mobile 3D lighthouse navigation arcade game, short navy haori coat with white gull-feather pattern, red scarf, small signal flags in one hand, brass lantern in the other, friendly focused expression, natural forward direction facing slightly to the right, warm sunrise rim light and cool aqua fog edge light, centered full-body sprite silhouette, transparent or solid pale sea-mist background, no checkerboard background, no readable text, no watermark, high contrast at 64-128 pixels.”
   - Aspect ratio: square.
2. Dawn Japanese harbor background source
   - Target: portrait-friendly background suitable behind an overlaid 3D harbor board with open readable central water lanes.
   - Archive path: `release/games/052/assets/source/kamome-harbor-source.png`
   - Optimized path: `release/games/052/assets/kamome-harbor.png`
   - Imagegen2 prompt: “A bright dawn Japanese fishing harbor for a portrait mobile 3D arcade game, pale aqua tide channels, weathered wooden piers at the sides, small red breakwater rails, brass lighthouse tower near an edge, violet fog sheets near the top and sides, paper lantern boats in the distance, gull silhouettes in the sunrise sky, ceramic buoys, open readable central water space for overlaid 3D lanes, beams, boats, gates, and fog, crop-safe for phone portrait, no central character, no readable text, no watermark.”
   - Aspect ratio: portrait.
3. Boats, buoy bells, gates, fog, and harbor material sprite sheet source
   - Target: square sheet with separated readable materials usable as sprites/decals/textures.
   - Archive path: `release/games/052/assets/source/kamome-pieces-source.png`
   - Optimized path: `release/games/052/assets/kamome-pieces.png`
   - Imagegen2 prompt: “Sprite sheet of small readable Japanese dawn harbor game pieces: paper lantern fishing boat, tiny tugboat, ceramic buoy bell, red tide gate arm, brass lighthouse lens, white signal flag, violet fog puff, aqua wake trail, gull warning silhouette, shell-route seal, tide height wave, pier hazard marker, dropped guide buoy, safe sunrise pier crest, each element separated with generous margins, transparent or pale sea-mist background, no checkerboard background, no readable text, no watermark, readable at 40-96 pixels.”
   - Aspect ratio: square.
4. Kamome action, signal, tide, and focus UI icon sheet source
   - Target: square icon sheet for controls, hazards, rewards, and UI decals.
   - Archive path: `release/games/052/assets/source/kamome-icons-source.png`
   - Optimized path: `release/games/052/assets/kamome-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a Japanese harbor lighthouse navigation arcade game: shift lane, rotate lighthouse, raise flag, lower flag, ring buoy bell, open tide gate, send tug, drop buoy, fan fog, Kamome Focus gull-eye crest, channel risk, fog meter, tide height, gate damage, boat saved, gull warning, shell-route seal, Dawn Harbor Clear crest, transparent or solid pale sea-mist background, high contrast, no checkerboard background, no readable text, no watermark, generous margins so no icons are cut off.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/Three.js signalkeeper/boat/lighthouse/flag/buoy/tug/fog/icon silhouettes, document the failure in `ai/postmortems/day-052.md`, and still keep source/fallback files under the same asset paths.

### Mandatory generated-image QA

For every generated image, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the signalkeeper sprite, verify transparent/cutout quality or clean background handling, readable silhouette, centered pivot/crop margins, no unwanted text/watermarks, natural forward direction facing slightly right, signal flags/lantern visible but not fragile at small size, and that runtime movement/turning uses this right-facing baseline correctly.
- For the pieces sheet, verify separated boat, tug, buoy bell, tide gate, lighthouse lens, signal flag, fog puff, wake trail, gull warning, shell-route seal, tide wave, pier hazard, dropped buoy, and sunrise pier crest at final 40-96px size, usable crop margins, no baked checkerboard, no unwanted text/watermark, and a documented visual baseline: boats are vessels, white/gold beams are guidance, buoys are ordered signals, red gate arms are timed barriers, violet fog hides hazards, gull silhouettes mean distraction/wind, shells are rewards.
- Verify control-to-motion alignment in-game: Shift Lane must visibly change active boat/lane, Rotate Lighthouse must rotate the beam cone, Raise/Lower Flag must visibly change signal height/state, Ring Buoy Bell must pulse the chosen buoy and advance only correct sequences, Open Tide Gate must visibly rotate gate arms, Send Tug must draw a helper route/nudge, Drop Buoy must place a temporary lane marker and bend route, Fan Fog must clear fog, Kamome Focus must preview boat path/fog/gate/buoy/tug/tide/collision cues, Pause/Restart must work.
- For the background, verify the central harbor lanes remain readable after portrait mobile crop and do not hide boats, beam cones, buoys, gates, fog warnings, commission card, helper, or controls.
- For the icon sheet, verify lane, lighthouse, flag, buoy, gate, tug, dropped buoy, fog, focus, risk, tide, gate damage, boat saved, gull, shell, and dawn-clear icons are distinct at final HUD/button size and cannot be confused. Watch specifically for fake checkerboard transparency; alpha-clean or composite onto pale sea mist if needed and inspect again.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship broken visual assets just because tests pass.

## Audio and game feel

Because lighthouse rotation, flag signaling, buoy bells, gate timing, tug assists, fog clearing, gull warnings, and dawn harbor clear are central to the mechanic, include lightweight WebAudio cues initialized only after a user gesture:

- Soft harbor ambience with gulls and pier creaks when Start begins.
- Brass lens click when Rotate Lighthouse changes direction.
- Fabric flap when Raise/Lower Flag changes signal height.
- Ceramic bell chime when Ring Buoy Bell succeeds; dull echo when wrong.
- Wooden gate clack when Open Tide Gate rotates arms.
- Tug whistle and small engine burble when Send Tug starts.
- Ceramic plunk when Drop Buoy places a marker.
- Soft fan sweep and fog hiss when Fan Fog clears a cone.
- Focus shimmer with distant gull cry when Kamome Focus activates.
- Sunrise bell/flourish when Kamome Dawn Harbor Clear triggers.

Audio must not block play if WebAudio is unavailable. Verify no autoplay errors: audio context should be created/resumed only after Start or another user interaction. Include a visible mute toggle in pause/results or HUD. Expose a narrow debug handle such as `window.__day052Audio = { ctx, enabled }` after user-gesture initialization so Playwright can assert audio state.

## Prompt page output

The archived `release/games/052/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 052 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-052-kamome-tide-signalkeeper/`.
   - Integrate it into immutable release output under `release/games/052/`.
   - Create the public playable route under `release/kamome/`.
   - Use static HTML/CSS/JS with Three.js/WebGL/DOM/WebAudio and no backend.
   - The public alias must be self-contained or asset paths must be alias-safe.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, remove fake checkerboards if present, document signalkeeper/boat/lighthouse/flag/buoy/tug/fog/gull visual baselines, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D harbor render, lane selection/drag, Shift Lane, Rotate Lighthouse, Raise Flag, Lower Flag, Ring Buoy Bell, Open Tide Gate, Send Tug, Drop Buoy, Fan Fog, Kamome Focus control presence and visible mechanical effect, channel/fog/tide/gate/flag/beam/commission feedback, generated screenshot, generated assets, WebAudio initialization after user gesture, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-052.md` after validation with what worked, what failed, generated-image inspection notes, signalkeeper/boat/lighthouse/flag/buoy/tug/fog/gull visual baseline, audio verification, code-isolation confirmation, and whether generator/template/rubric improvements are justified.

## Acceptance criteria

- Static build passes.
- Code isolation is documented in QA/postmortem: no previous game implementation code was opened, inspected, copied, diffed, grepped, or adapted.
- Mode choice follows the cadence rule: Day 052 is `3d` after Day 051 `hybrid`, with meaningful tide lane, depth, beam angle, flag state, buoy order, gate timing, fog, tug route, dropped buoy, tide height, and focus mechanics rather than decorative harbor art.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial/commission card/harbor, usable 44px+ signal/action/pause/restart controls, no forced landscape canvas, and no tiny survival-critical buoy labels.
- Prompt is visible from gallery and release folder.
- `prompts/day-052.md` is copied exactly to `release/games/052/prompt.md` and `release/kamome/prompt.md`.
- `release/games/052/prompt.html` and `release/kamome/prompt.html` render the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Public alias `release/kamome/index.html`, `release/kamome/prompt.html`, `release/kamome/screenshot.png`, and `release/kamome/assets/` exist and work.
- Gallery card for Day 052 shows prompt availability, generation duration, public `/kamome/` links, mode `3d`, and actual generated date.
- Screenshot exists at `release/games/052/screenshot.png` and is non-empty/readable. Prefer a readable desktop gameplay screenshot for gallery cards; mobile screenshots are QA evidence unless the design is intentionally portrait-card friendly.
- Image/source assets exist under `release/games/052/assets/source/` and optimized assets exist under `release/games/052/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; interactive signalkeeper/boat/lighthouse/flag/buoy/tug/fog/gull visuals have verified background handling, orientation/pivot/crop, readability, and control-to-motion alignment.
- WebAudio initializes after user gesture and creates no autoplay console errors; audio is failsafe if unsupported and visual boat/lighthouse/flag/buoy/gate/tug/fog/commission cues remain playable muted.
- No console errors during desktop or mobile smoke. Add data-URI favicons to game and prompt pages if needed to avoid favicon request noise.
- Existing `release/games/001/**` through `release/games/051/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/052/screenshot.png, prompt.md, prompt.html, index.html, game.js, styles.css, release/kamome/index.html, release/kamome/prompt.html, release/kamome/screenshot.png, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-052.md release/games/052/prompt.md and cmp prompts/day-052.md release/kamome/prompt.md.
# Prompt HTML check: verify release/games/052/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>, and no malformed ul > p or ol > p nodes, no direct nested lists, and no strong/b tags inside code.
# Browser smoke: open the local/static /kamome/ route and verify menu, tutorial, gameplay start, 3D harbor/signalkeeper/boats render, lane selection/drag, Shift Lane, Rotate Lighthouse, Raise Flag, Lower Flag, Ring Buoy Bell, Open Tide Gate, Send Tug, Drop Buoy, Fan Fog, Kamome Focus, channel/fog/tide/gate/flag/beam feedback, pause, restart, prompt page, WebAudio after user gesture, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable signal/action controls plus readable HUD/commission card/harbor/controls.
# Static screenshot check: inspect release/games/052/screenshot.png and release/kamome/screenshot.png for non-empty readable game content; use vision to judge actual visual quality.
# Image QA: inspect every Imagegen2 source/optimized asset and document the actual inspection result in ai/postmortems/day-052.md.
# Docker/static smoke: build the Docker image locally, run it, curl /kamome/ and /kamome/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 052.
```
