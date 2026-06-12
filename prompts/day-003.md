# Day 003 Game Generation Prompt

## Game identity

- Day: 003
- Title: Neon Bonsai Skyforge
- Slug: neon-bonsai-skyforge
- Mode: 3D
- Genre: spatial arcade crafting / ring-navigation score chase
- Mood/style: luminous cyber-Japanese bonsai floating above a night city, glassy koi-orb drone, neon sap trails, cozy high-tech shrine, readable mobile-first 3D

## Why this game today

Day 001 and Day 002 were both 2D arcade games: Day 001 used calm top-down collection and hazard avoidance in a pond, while Day 002 used 2D route planning and timed delivery in the sky. The current generated-mode streak is therefore two consecutive 2D games. This day should strongly prefer 3D now, and it deliberately selects real spatial gameplay instead of another flat canvas game.

Day 003 is a real 3D WebGL game: the player pilots a small luminous forge-drone through depth-separated bonsai branch rings, steers around floating lantern hazards, collects colored sap motes in 3D lanes, and returns energy to a central bonsai core. The camera follows from behind/above with visible parallax, depth, ring alignment, and z-axis movement. The game should still be simple enough for a static browser/mobile release and readable at a portrait phone viewport around 390x844.

The concept differs from the first two days by emphasizing spatial depth, camera alignment, lane/ring timing, and short crafting choices: collected motes can be banked into root, branch, or blossom upgrades that change scoring and survival for a run.

## Mode variety / 3D cadence

Inspection target: `src/data/games.ts` currently has Day 001 mode `2d` and Day 002 mode `2d`, so the latest generated streak is two 2D games.

Mode decision: Day 003 must be `3d`. Implement real Three.js/WebGL spatial gameplay with:

- A perspective camera following the player through a floating 3D route.
- Player movement on x/y with forward z motion through depth-separated rings and hazards.
- 3D objects for rings, motes, lantern hazards, and bonsai core, not just 2D sprites pasted on a flat canvas.
- Clear depth cues: fog, scale, parallax, shadows/glow, ring distance markers, and lane guide lines.
- Mobile-friendly portrait framing so the central route is readable without forcing landscape.

## Design

- Objective: Pilot the neon forge-drone through bonsai branch rings, collect colored sap motes, avoid cracked lantern hazards, and bank energy into the floating bonsai core before the forge meter overheats.
- Win condition: Reach a score of 2400 and complete all three forge upgrades in one run to trigger the “Skyforge Bloom” banner. After that, continue in endless score-chase mode.
- Lose condition: The drone loses all hull petals from hazard collisions or the forge heat meter reaches 100% because the player misses too many cooling rings.
- Core loop:
  1. Start from the title/menu screen.
  2. Read a compact tutorial explaining 3D steering, rings, sap motes, hazards, forge heat, banking upgrades, pause, and restart.
  3. Fly forward automatically through a floating 3D bonsai route.
  4. Steer left/right/up/down to pass through green cooling rings and gold score rings.
  5. Collect red/root, blue/branch, and pink/blossom sap motes.
  6. Avoid cracked lantern hazards, thorn clusters, and unstable gate fragments.
  7. When near a bonsai core checkpoint, tap/click one of three large upgrade buttons to bank collected sap into Root Shield, Branch Magnet, or Blossom Multiplier.
  8. Survive escalating ring patterns and chase a better score/bloom time.
- 15+ minute play-value strategy:
  - Save best score, best bloom time, and best upgrade completion in localStorage.
  - Include three route phases with distinct spatial patterns: Root Spiral, Branch Weave, Blossom Gate.
  - Rotate ring layouts and sap colors from a deterministic day seed so runs vary but stay fair.
  - Add upgrade strategy: Root Shield absorbs one crash, Branch Magnet gently attracts nearby sap, Blossom Multiplier boosts points for perfect ring streaks.
  - Add combo rewards for consecutive clean rings and sap collections without collision.
  - Add visible mastery checklist: trigger Skyforge Bloom, reach 12x clean-ring streak, complete a no-crash phase, score 3600.
  - Endless mode after bloom increases forward speed and hazard density every 30 seconds.
- Difficulty scaling:
  - 0-30 seconds: slow forward speed, large rings, sparse hazards, generous sap placement.
  - 30-75 seconds: rings shift vertically, hazards appear near off-center routes, heat rises faster when missing cooling rings.
  - 75-140 seconds: spiral ring paths, moving lantern hazards, fewer safe gaps, faster forward motion.
  - 140+ seconds: overlapping ring choices, more thorn clusters, stronger heat pressure.
  - Keep difficulty fair on mobile: rings are large and high-contrast, hazards have warning glow, lane markers show target depth, collisions have forgiving radii.
- Scoring/rewards:
  - Gold ring: +120 points times clean-ring combo.
  - Green cooling ring: -12% heat and +80 points.
  - Sap mote: +35 points and adds one colored sap to the matching upgrade pool.
  - Perfect ring streak: combo increases every 3 clean rings up to 5x.
  - Upgrade banked: +250 points and activates the upgrade effect.
  - No-crash phase bonus: +400 points.
  - Skyforge Bloom: +800 points, bloom animation, and endless-mode unlock for the current run.

## Controls and layout

- Desktop:
  - WASD or arrow keys: steer the drone left/right/up/down in the 3D lane.
  - Space or Shift: brief focus glide that slows steering and reduces heat gain for precision; limited by a recharge meter.
  - 1 / 2 / 3 or click upgrade buttons at checkpoints: bank sap into Root Shield, Branch Magnet, or Blossom Multiplier.
  - P: pause/resume.
  - R: restart current run.
  - Enter or click: start from menu / confirm restart.
- Mobile/touch:
  - Drag anywhere on the 3D playfield to steer the drone toward the finger target.
  - Large on-screen Focus button, minimum 56px target.
  - Three large checkpoint upgrade buttons when banking is available; stack them vertically or as thumb-friendly cards below the HUD.
  - On-screen Pause and Restart controls with 44px+ targets.
  - Avoid tiny virtual joysticks; use forgiving drag-to-target steering.
- Mobile layout/orientation:
  - Default target is portrait phone play at about 390x844; the game must be readable and playable without requiring landscape.
  - The 3D canvas should fill the central viewport with a top HUD and bottom touch controls that do not obscure the player or next ring.
  - Use large high-contrast labels and compact HUD rows: score, best, heat, hull, combo, phase.
  - Tutorial text must not sit below the fold on 390x844; use concise bullets and scroll only for optional details.
  - No landscape-only gate; portrait is the supported default.

## Menu and tutorial

Define and implement these states:

1. Title screen
   - Shows title “Neon Bonsai Skyforge”.
   - Shows Day 003 badge, best score, best bloom time, and mode badge “3D”.
   - Shows primary Start button.
   - Shows “How to play” tutorial panel by default.
   - Clearly tells the player this is a 3D depth/ring flight game.
2. Tutorial text
   - Objective: “Fly through 3D bonsai rings, collect sap, and forge all three upgrades.”
   - Movement: desktop keys or mobile drag steer the drone through depth-separated rings.
   - Rings: green rings cool the forge, gold rings build score and combo.
   - Sap/upgrades: collect colored sap, then bank it at bonsai checkpoints.
   - Hazards: cracked lanterns and thorns damage hull and break combo.
   - Pause/restart: P/R on desktop or buttons on mobile.
3. In-game HUD
   - Score, best score, heat meter, hull petals, combo, current phase, sap counts, upgrade status, focus energy.
   - Pause and restart controls visible or accessible.
4. Checkpoint upgrade overlay
   - Appears only near a bonsai core checkpoint.
   - Lets player bank collected sap into Root Shield, Branch Magnet, or Blossom Multiplier.
   - Each choice has a one-line readable effect description.
5. Pause overlay
   - Resume, restart, tutorial reminder, and control summary.
6. Game-over/results overlay
   - Final score, best score, bloom status, upgrades completed, mastery objectives achieved, restart button.
7. Skyforge Bloom overlay/banner
   - Trigger once per run when score reaches 2400 and all three upgrades are completed.
   - Non-blocking 3D blossom burst/glow animation, then fades while endless play continues.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art: characters, backgrounds, textures, sprite sheets, icons, and key decorative pieces. The 3D game may use Three.js primitives for geometry, particles, collision markers, ring meshes, and generated glow materials, but final decorative texture/artwork should come from generated images when available. Archive the source generated art under `release/games/003/assets/source/` and use optimized/cropped/resized copies under `release/games/003/assets/`.

For mobile-first crop safety: keep important content centered, leave 12-16% safe margins, avoid baked-in text, avoid tiny details that disappear at final in-game size, and use high-contrast silhouettes.

Generate or provide at least these final art assets:

1. Forge-drone sprite/texture source
   - Target: transparent PNG, square source, final optimized texture around 512x512 or 256x256.
   - Archive path: `release/games/003/assets/source/forge-drone-source.png`
   - Optimized path: `release/games/003/assets/forge-drone.png`
   - Imagegen2 prompt: “A small luminous koi-orb forge drone for a 3D browser arcade game, cyber Japanese design, glass orb body, tiny brass fins, neon pink and cyan glow, clean centered silhouette, transparent or plain dark background, no text, no watermark, readable at small size.”
   - Aspect ratio: square.
2. Floating neon bonsai / sky city background source
   - Target: portrait-friendly or crop-safe wide background texture suitable for a 3D skybox/backdrop.
   - Archive path: `release/games/003/assets/source/neon-bonsai-sky-source.png`
   - Optimized path: `release/games/003/assets/neon-bonsai-sky.png`
   - Imagegen2 prompt: “A luminous cyber Japanese bonsai tree floating above a soft night city skyline, neon sap trails, shrine lanterns, deep blue violet sky, cozy futuristic atmosphere, open readable center area, crop-safe for portrait mobile game background, no text, no characters, no watermark.”
   - Aspect ratio: portrait or landscape only if center-crop safe for phone portrait.
3. Sap/ring/icon sheet source
   - Target: square icon sheet for UI and texture decals.
   - Archive path: `release/games/003/assets/source/skyforge-icons-source.png`
   - Optimized path: `release/games/003/assets/skyforge-icons.png`
   - Imagegen2 prompt: “Small readable icon sheet for a neon bonsai 3D arcade game: gold rings, green cooling rings, red root sap, blue branch sap, pink blossom sap, cracked lantern hazard, thorn cluster, blossom burst, transparent or plain dark background, high contrast, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using simple SVG/canvas/CSS/Three.js materials, document the failure in `ai/postmortems/day-003.md`, and still keep source/fallback files under the same asset paths. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create the final drone/background/icon artwork from scratch unless using that emergency fallback.

### Mandatory generated-image QA

For every generated image, and especially sprites/textures that move, rotate, or animate, include a real inspection step after generation and before integration:

- Analyze the actual generated file visually, not just the prompt text.
- For the forge-drone, verify transparent/cutout quality or clean background removal, readable silhouette, centered pivot, crop margins, no unwanted text/watermarks, and a clear forward/up visual axis.
- Verify control-to-motion alignment in-game: when steering left/right/up/down, the drone tilt and visual heading should match movement rather than appearing sideways or upside-down.
- For the background, verify important bonsai/city shapes remain visible after portrait mobile crop and do not hide rings or hazards.
- For icon sheets, verify icons are distinct at final HUD size and hazards cannot be confused with collectibles.
- If inspection finds a problem, regenerate or post-process the image and inspect again. Do not ship a broken sprite/texture just because tests pass.

## Prompt page output

The archived `release/games/003/prompt.html` must be a consistent rendered HTML page, not raw Markdown pasted into a `<pre>` block. It should include:

- A clear `<title>` and `<h1>` using `Day 003 Game Generation Prompt`.
- A back-to-game link near the top.
- Semantic rendered sections (`h2`, `h3`, `ul/ol/li`, `p`, `pre/code` only for actual code/commands).
- The same readable prompt-page style pattern across days so prompt pages feel like one system.

## Subagents to dispatch

1. Implementation subagent
   - Build the static 3D game under `apps/day-003-neon-bonsai-skyforge/`.
   - Integrate it into the release output under `release/games/003/`.
   - Also create the public playable route under `release/003/`.
   - Use static HTML/CSS/JS with Three.js/WebGL and no backend.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, inspect generated images, and tune mobile readability/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify menu/tutorial/objective/controls/restart/pause, prompt links, 3D depth gameplay, and 390x844 portrait layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-003.md` after validation with what worked, what failed, generated-image inspection notes, and whether generator/template improvements are justified.

## Acceptance criteria

- Static build passes.
- Mode choice follows the 3D cadence rule: Day 003 is real 3D spatial gameplay, not decorative perspective on a flat 2D canvas.
- Desktop smoke passes.
- Mobile portrait smoke passes at about 390x844 with readable HUD/tutorial, usable touch controls, no forced landscape canvas, and visible 3D ring depth.
- Prompt is visible from gallery and release folder.
- `prompts/day-003.md` is copied to `release/games/003/prompt.md`.
- `release/games/003/prompt.html` renders the prompt in browser-readable semantic HTML with the standard prompt-page styling, not a raw Markdown `<pre>` dump.
- Gallery card for Day 003 shows prompt availability and generation duration.
- Screenshot exists at `release/games/003/screenshot.png` and is non-empty.
- Image/source assets exist under `release/games/003/assets/source/` and optimized assets exist under `release/games/003/assets/`, or a documented emergency fallback exists.
- Every generated image has an inspection note in the postmortem or QA notes; moving/animated drone texture has verified cutout/background removal, forward axis, pivot/crop, readability, and control-to-motion alignment.
- No console errors during desktop or mobile smoke.
- Existing `release/games/001/**` and `release/games/002/**` from origin/main remain unchanged.
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
# Screenshot/static checks: verify release/games/003/screenshot.png, prompt.md, prompt.html, index.html, /003/index.html, optimized assets, and source assets exist and are non-empty.
# Prompt copy check: cmp prompts/day-003.md release/games/003/prompt.md
# Prompt HTML check: verify release/games/003/prompt.html has semantic h1/h2/list markup and a back-to-game link, not a raw Markdown dump inside <pre>.
# Browser smoke: open the local/static Day 003 route and verify menu, tutorial, 3D gameplay, upgrade checkpoint or gameplay progression, pause, restart, no console errors.
# Mobile smoke: repeat at a portrait phone viewport such as 390x844 and verify playable touch steering and readable HUD.
# Static screenshot check: inspect release/games/003/screenshot.png for non-empty readable game content.
# Docker/static smoke: build the Docker image locally, run it, curl /003/ and /games/003/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 003.
```
