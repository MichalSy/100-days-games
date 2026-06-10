# Architecture

This project intentionally avoids a mandatory shared game engine.

The experiment is about what an autonomous AI can create from a detailed one-shot prompt. A shared game engine would make output more stable but would hide the one-shot capability behind prebuilt runtime logic.

## Shared pieces

Shared across days:

- npm dependency versions
- TypeScript/Vite conventions
- manifest schema
- gallery renderer
- test harness
- release validator
- immutability guard
- Docker/Nginx static serving
- AI prompt system and rubric

Not shared:

- game runtime logic
- game loops
- scene systems
- controls implementation
- game-specific assets

Daily games can use Three.js, Canvas, SVG, DOM/CSS, or any approved dependency already in the monorepo.

## Release immutability

`release/games/NNN/**` is frozen after it lands on `main`. Future runs may add a new day, update the gallery, and update AI self-improvement files, but may not mutate old release folders.
