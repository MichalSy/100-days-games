# Day 002 Game Generation Prompt

## Game identity

- Day: 002
- Title: Clockwork Cloud Courier
- Slug: clockwork-cloud-courier
- Mode: 2D
- Genre: route-planning arcade / timed delivery game
- Mood/style: whimsical sky-islands above sunrise clouds, brass clockwork, cozy courier fantasy, readable silhouettes, polished mobile-first arcade feel

## Why this game today

Day 001 was a calm pond collection game about graceful drifting, combo pickups, and hazard avoidance in a dark Japanese garden. Day 002 should deliberately feel different: brighter, more vertical, more tactical, and built around delivery routing under time pressure rather than endless collection survival.

The selected idea is a compact courier game where the player pilots a clockwork bird-mail glider between floating post towers. It still works as a self-contained static browser/mobile game, but adds a new kind of mastery: reading wind lanes, planning efficient delivery order, timing boost cooldowns, and deciding whether to take risky shortcut rings. It should screenshot well for the gallery, be easy to understand in under 20 seconds, and provide at least 15 minutes of replay value through score chasing, delivery ranks, randomized route sets, and escalating wind/turbulence patterns.

## Design

- Objective: Deliver glowing letters from the central cloud depot to numbered floating mail towers before the clockwork day ends.
- Win condition: Complete all required deliveries in a route set before the timer reaches 0. A strong run earns at least 3 stars and unlocks the “Golden Dispatch” banner when score reaches 1800.
- Lose condition: The timer reaches 0 before all required towers receive their letters, or the courier crashes after too many turbulence hits.
- Core loop:
  1. Start from the title/menu screen.
  2. Read a compact tutorial explaining route planning, steering, wind lanes, boost, turbulence, pause, and restart.
  3. Begin at the central cloud depot with 3-5 letters assigned to specific towers.
  4. Steer the courier through the sky to a destination tower.
  5. Use wind lanes and boost rings for speed, but avoid dark turbulence pockets and gear-storm hazards.
  6. Deliver letters by touching the correct tower; wrong towers show a helpful hint but do not complete delivery.
  7. Pick the next destination and continue until the route set is complete.
  8. Finish before time expires to receive stars, score, delivery rank, and a quick restart option.
- 15+ minute play-value strategy:
  - Save best score and best star rank in localStorage.
  - Generate each run from a deterministic daily seed plus random route order so attempts feel varied while staying fair.
  - Include 3 route difficulties: Easy Dispatch (3 towers), Busy Skies (4 towers), Clockrush (5 towers). Let players select difficulty from the menu.
  - Add scoring incentives: fast delivery bonus, no-crash bonus, wind-lane combo, correct-order streak bonus, remaining-time bonus.
  - Add optional shortcut rings that cut time but spawn near hazards.
  - Add a visible mastery checklist: win a route, earn 3 stars, score 1800, complete a no-crash route.
  - After a win, allow endless “overtime route” chaining where a new route starts with less time and stronger winds.
- Difficulty scaling:
  - Easy Dispatch: 75 seconds, 3 delivery towers, gentle wind, sparse turbulence.
  - Busy Skies: 90 seconds, 4 delivery towers, more crossing wind lanes, more hazards.
  - Clockrush: 105 seconds, 5 delivery towers, faster hazards, boost rings closer to turbulence.
  - Endless overtime: each chained route reduces available time by 8%, increases hazard drift speed, and adds one extra moving gear-storm.
  - Keep difficulty fair on mobile: large destination markers, high contrast hazards, forgiving collision radius, visible arrow to the current destination.
- Scoring/rewards:
  - Correct delivery: +250 points.
  - Fast delivery bonus: up to +180 based on seconds since previous delivery.
  - Wind-lane combo: +25 per second inside golden wind lanes, combo resets on turbulence hit.
  - Boost ring: +50 and refreshes boost cooldown.
  - No-crash route bonus: +300.
  - Remaining-time bonus on route completion: +8 per second remaining.
  - Stars: 1 star for completion, 2 stars for completion with 25% time remaining, 3 stars for completion with 40% time remaining and no more than one turbulence hit.
  - Golden Dispatch: show celebratory brass confetti and sunrise rays when score reaches 1800 for the first time in a run.

## Controls

- Desktop:
  - WASD or arrow keys: steer the courier.
  - Space or Shift: boost while boost energy is available.
  - Number keys 1/2/3 or menu buttons: choose route difficulty before starting.
  - P: pause/resume.
  - R: restart current route.
  - Enter or click: start from menu / confirm restart.
- Mobile/touch:
  - Drag anywhere on the playfield to steer toward the finger.
  - On-screen Boost button: activates boost while energy is available.
  - Tap route difficulty cards on the title screen.
  - On-screen Pause button: pause/resume.
  - On-screen Restart button on pause/game-over/results screens.
  - UI must fit and remain readable at 390x844 and 360x740 viewports without requiring pinch zoom.

## Menu and tutorial

Define and implement these states:

1. Title screen
   - Shows title “Clockwork Cloud Courier”.
   - Shows Day 002 badge, best score, and best star rank.
   - Shows three difficulty cards: Easy Dispatch, Busy Skies, Clockrush.
   - Shows primary Start button.
   - Shows “How to play” tutorial panel by default.
2. Tutorial text
   - Objective: “Deliver every glowing letter before the clock runs out.”
   - Route: “Follow the arrow and tower numbers; only the highlighted tower accepts the current letter.”
   - Movement: desktop keys or mobile drag.
   - Boost: “Use boost rings and the boost button for shortcut routes.”
   - Hazards: “Dark turbulence and spinning gear-storms cost time and hull.”
   - Pause/restart: P/R on desktop or buttons on mobile.
3. In-game HUD
   - Score, best score, timer, hull meter, boost energy, current delivery progress, current destination, wind combo, difficulty, and star projection.
   - Pause and restart controls visible or accessible.
4. Pause overlay
   - Resume, restart, difficulty reminder, and tutorial summary.
5. Results/game-over overlay
   - Final score, deliveries completed, stars earned, best score, mastery objectives achieved, restart button, and difficulty-select button.
6. Golden Dispatch overlay/banner
   - Trigger once per run when score reaches 1800.
   - Non-blocking celebration with brass confetti/sun rays, then fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art. The final game should archive the source generated art under `release/games/002/assets/source/` and use optimized/cropped/resized copies under `release/games/002/assets/`.

Generate or provide at least these final art assets:

1. Clockwork courier sprite/source illustration
   - Target: transparent PNG, square source, final optimized sprite around 256x256.
   - Archive path: `release/games/002/assets/source/courier-source.png`
   - Optimized path: `release/games/002/assets/courier.png`
   - Imagegen2 prompt: “A whimsical clockwork bird mail courier glider seen from above, brass wings, tiny red satchel, glowing envelope trail, clean silhouette for a 2D browser game sprite, transparent or plain sky-blue background, cozy fantasy sunrise sky aesthetic, high contrast, no text, no watermark.”
   - Aspect ratio: square.
2. Floating sky-islands background
   - Target: 16:9 or wide source, final optimized background suitable for cover/crop.
   - Archive path: `release/games/002/assets/source/sky-islands-source.png`
   - Optimized path: `release/games/002/assets/sky-islands.png`
   - Imagegen2 prompt: “Top-down whimsical sunrise sky with soft clouds and floating brass clockwork post islands for a cozy arcade game, open readable center play area, warm gold and blue palette, painterly but crisp, no text, no characters, no watermark.”
   - Aspect ratio: landscape.
3. Mail towers / boost rings / delivery icon sheet
   - Target: small decorative sprite sheet with tower markers, glowing envelopes, boost rings, brass confetti, and hazard accents.
   - Archive path: `release/games/002/assets/source/courier-icons-source.png`
   - Optimized path: `release/games/002/assets/courier-icons.png`
   - Imagegen2 prompt: “Small 2D game icon sheet for a clockwork sky courier game: floating mail towers, glowing envelopes, golden boost rings, brass confetti, dark turbulence swirls, clean readable silhouettes, transparent or plain sky-blue background, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using CSS/canvas/simple SVG shapes, document the failure in `ai/postmortems/day-002.md`, and still keep source/fallback files under the same asset paths. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create the final courier/background/icon artwork from scratch unless using that emergency fallback.

## Subagents to dispatch

1. Implementation subagent
   - Build the static game under `apps/day-002-clockwork-cloud-courier/`.
   - Integrate it into the release output under `release/games/002/`.
   - Also create the public playable route under `release/002/`.
   - Ensure all game logic is static HTML/CSS/JS with no backend.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, and tune UI/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify tutorial/menu/objective/controls/restart/pause, prompt links, and 390x844 mobile layout.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-002.md` after validation with what worked, what failed, and whether generator/template improvements are justified.

## Acceptance criteria

- Static build passes.
- Desktop smoke passes.
- Mobile smoke passes.
- Prompt is visible from gallery and release folder.
- `prompts/day-002.md` is copied to `release/games/002/prompt.md`.
- `release/games/002/prompt.html` renders the prompt in browser-readable HTML.
- Gallery card for Day 002 shows prompt availability and generation duration.
- Screenshot exists at `release/games/002/screenshot.png` and is non-empty.
- Image/source assets exist under `release/games/002/assets/source/` and optimized assets exist under `release/games/002/assets/`, or a documented emergency fallback exists.
- No console errors during desktop or mobile smoke.
- Existing `release/games/001/**` from origin/main remains unchanged.
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
# Screenshot/static checks: verify release/games/002/screenshot.png, prompt.md, prompt.html, index.html, /002/index.html, and assets exist and are non-empty.
# Browser smoke: open the local/static Day 002 route and verify menu, tutorial, gameplay, pause, restart, no console errors.
# Mobile smoke: repeat at a phone viewport such as 390x844.
# Docker/static smoke: build the Docker image locally, run it, curl /002/ and /games/002/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except new Day 002.
```
