# Day 001 Game Generation Prompt

## Game identity

- Day: 001
- Title: Koi Lantern Drift
- Slug: koi-lantern-drift
- Mode: 2D
- Genre: calm arcade path-planning / collection game
- Mood/style: moonlit Japanese garden pond, paper lantern glow, elegant koi movement, cozy-but-skillful, high readability on mobile

## Why this game today

Day 001 is being regenerated because the previous Day 001 release was explicitly allowlisted for replacement with Imagegen2-based visual art. This new first game should feel like a polished opener for the 100-days gallery: immediately understandable, attractive in screenshots, and replayable in short sessions.

The design differs from typical maze/runner games by making the player manage a drifting koi and the lantern current around it rather than only steering directly. It should be quiet and beautiful, but still have clear risk, scoring, and mastery: collect floating lantern sparks, avoid ripples and reeds, chain perfect glides, and survive escalating current shifts.

## Design

- Objective: Guide a glowing koi through a night pond, collect lantern sparks, and keep the central festival lantern lit for as long as possible.
- Win condition: There is no hard campaign ending; a successful run reaches at least score 1200 and unlocks the “Festival Bloom” win banner. The game continues in endless score-chase mode afterward.
- Lose condition: The lantern flame meter reaches 0 because the koi hit too many hazards or missed too many spark cycles.
- Core loop:
  1. Start from the title/menu screen.
  2. Read a compact tutorial explaining movement, sparks, hazards, combos, pause, and restart.
  3. Steer the koi around the pond.
  4. Collect gold sparks to refill the flame meter and score points.
  5. Avoid dark ripple hazards and reed clusters that drain flame and break combo.
  6. Chain consecutive spark pickups without collisions for a combo multiplier.
  7. Survive as currents become stronger and hazards spawn more frequently.
  8. Restart quickly after game over and chase a higher best score.
- 15+ minute play-value strategy:
  - Use a best-score saved in localStorage.
  - Add combo tiers at 3x, 6x, 10x, and 15x pickups.
  - Add changing pond current every 20 seconds so routes feel different.
  - Add spark waves with different patterns: ring, diagonal stream, spiral, and scattered bloom.
  - Add optional “focus drift” by holding/touching a slow-drift button that improves precision but reduces score gain while active.
  - Add a visible mastery objective list: reach 1200, reach 10x combo, survive 90 seconds.
- Difficulty scaling:
  - First 20 seconds: slow hazards, generous spark spawn.
  - 20-60 seconds: hazards drift faster; current visibly pushes the koi.
  - 60-120 seconds: more reeds and ripple hazards; spark waves expire faster.
  - 120+ seconds: frequent current shifts and smaller safe gaps.
  - Keep difficulty fair on mobile: minimum touch target 44px, hazards visually distinct, no tiny required movements.
- Scoring/rewards:
  - Gold spark: 50 points times combo multiplier.
  - Perfect wave bonus: +250 for clearing all sparks in a wave.
  - Survival bonus: +10 per second.
  - Festival Bloom: show celebratory petals when score first reaches 1200.
  - Best score: persist locally and show on title/game-over screens.

## Controls

- Desktop:
  - WASD or arrow keys: steer koi.
  - Space: hold focus drift / slow precise movement.
  - P: pause/resume.
  - R: restart current run.
  - Enter or click: start from menu.
- Mobile/touch:
  - Drag anywhere on the pond to steer toward the finger.
  - On-screen Focus button: hold for slow precise movement.
  - On-screen Pause button: pause/resume.
  - On-screen Restart button on pause/game-over screens.
  - UI must fit and remain readable at 390x844 and 360x740 viewports.

## Menu and tutorial

Define and implement these states:

1. Title screen
   - Shows title “Koi Lantern Drift”.
   - Shows Day 001 badge and best score.
   - Shows primary Start button.
   - Shows “How to play” tutorial panel by default.
2. Tutorial text
   - Objective: “Keep the festival lantern lit by collecting gold sparks.”
   - Controls: desktop keys and mobile drag.
   - Hazards: “Dark ripples and reeds drain the flame.”
   - Combo: “Collect sparks without collisions to grow your multiplier.”
   - Pause/restart: P/R on desktop or buttons on mobile.
3. In-game HUD
   - Score, best score, flame meter, combo, time survived, current difficulty phase.
   - Pause and restart controls visible or accessible.
4. Pause overlay
   - Resume, restart, and tutorial reminder.
5. Game-over overlay
   - Final score, best score, mastery objectives achieved, restart button.
6. Festival Bloom overlay/banner
   - Trigger once per run when score reaches 1200.
   - Non-blocking celebration with petals/glow, then fades.

## Assets

Prefer Imagegen2 (`openai/gpt-image-2`) for final visual art. The final game should archive the source generated art under `release/games/001/assets/source/` and use optimized/cropped/resized copies under `release/games/001/assets/`.

Generate or provide at least these final art assets:

1. Koi sprite/source illustration
   - Target: transparent PNG, square or portrait source, final optimized sprite around 256x256.
   - Archive path: `release/games/001/assets/source/koi-source.png`
   - Optimized path: `release/games/001/assets/koi.png`
   - Imagegen2 prompt: “A graceful luminous koi fish seen from above, white and orange scales, subtle golden glow, elegant fins, clean silhouette for a 2D browser game sprite, transparent or plain dark background, high contrast, cozy moonlit Japanese garden aesthetic, no text, no watermark.”
   - Aspect ratio: square.
2. Pond background
   - Target: 16:9 or wide source, final optimized background suitable for cover/crop.
   - Archive path: `release/games/001/assets/source/pond-source.png`
   - Optimized path: `release/games/001/assets/pond.png`
   - Imagegen2 prompt: “Top-down moonlit Japanese garden pond for a cozy arcade game, deep blue water, soft paper lantern reflections, lily pads, subtle stone edge, readable open play area in the center, painterly but crisp, no text, no characters, no watermark.”
   - Aspect ratio: landscape.
3. Lantern spark / icon sheet
   - Target: small glowing decorative elements or sprite sheet.
   - Archive path: `release/games/001/assets/source/lantern-sparks-source.png`
   - Optimized path: `release/games/001/assets/lantern-sparks.png`
   - Imagegen2 prompt: “Small golden paper lantern sparks and petal-like glowing motes for a 2D game collectible icon sheet, multiple variants, transparent or plain dark background, warm amber glow, no text, no watermark.”
   - Aspect ratio: square.

If Imagegen2 is unavailable or fails after a real attempt, create a clearly labeled emergency fallback using CSS/canvas/simple SVG shapes, document the failure in `ai/postmortems/day-001.md`, and still keep source/fallback files under the same asset paths. Procedural code may crop, resize, alpha-clean, atlas-pack, optimize, animate, or place generated assets; it should not create the final koi/background/spark artwork from scratch unless using that emergency fallback.

## Subagents to dispatch

1. Implementation subagent
   - Build the static game under `apps/day-001-koi-lantern-drift/`.
   - Integrate it into the release output under `release/games/001/`.
   - Ensure all game logic is static HTML/CSS/JS with no backend.
2. Asset/polish subagent
   - Generate/prepare Imagegen2 assets, archive source files, optimize playable copies, and tune UI/game feel.
3. QA/browser/mobile subagent
   - Run desktop and mobile smoke checks, verify no console errors, verify tutorial/menu/objective/controls/restart/pause, and verify prompt links.
4. Reflection/self-improvement subagent
   - Write `ai/postmortems/day-001.md` after validation with what worked, what failed, and whether generator/template improvements are justified.

## Acceptance criteria

- Static build passes.
- Desktop smoke passes.
- Mobile smoke passes.
- Prompt is visible from gallery and release folder.
- `prompts/day-001.md` is copied to `release/games/001/prompt.md`.
- `release/games/001/prompt.html` renders the prompt in browser-readable HTML.
- Gallery card for Day 001 shows prompt availability and generation duration.
- Screenshot exists at `release/games/001/screenshot.png` and is non-empty.
- Image/source assets exist under `release/games/001/assets/source/` and optimized assets exist under `release/games/001/assets/`, or a documented emergency fallback exists.
- No console errors during desktop or mobile smoke.
- Old release folders unchanged except Day 001, which is currently listed in `release/regeneration-allowlist.json`.
- If Day 001 validates successfully, remove `001` from `release/regeneration-allowlist.json` in the same final commit.
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
# Screenshot/static checks: verify release/games/001/screenshot.png, prompt.md, prompt.html, index.html, and assets exist and are non-empty.
# Browser smoke: open the local/static Day 001 route and verify menu, tutorial, gameplay, pause, restart, no console errors.
# Mobile smoke: repeat at a phone viewport such as 390x844.
# Docker/static smoke: build the Docker image locally, run it, curl /001/ and /games/001/prompt.html, then stop the container.
# Immutable guard: confirm no release/games folders from origin/main changed except allowlisted Day 001.
```
