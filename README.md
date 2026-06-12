# 100 Days Games

Public experiment repo for **100 days of autonomous AI-generated browser games**.

Every day produces exactly one game from exactly one generated prompt. The prompt is part of the artifact: it is stored in git, copied into the immutable static release folder, and linked from the gallery.

## Core rules

- One game per day.
- Day 1 is created manually as the golden template.
- Day 2+ is created by a Hermes cron job at 03:30 Europe/Berlin.
- The cron job itself does **not** contain the full generation prompt. It only points Hermes to `ai/cron-system-prompt.md` in this repo.
- The cron first generates the detailed day prompt, then starts a fresh implementation agent with only that prompt path so the build context is reset.
- The cron uses GPT-5.5 with high reasoning.
- The cron itself performs browser/smartphone validation before push; GitHub CI only verifies repository integrity and image build.
- Each daily game must work on desktop browser and smartphone viewport.
- Every generated game must have a menu, tutorial, objective, prompt link, screenshot, and generation duration.
- Published static folders under `release/games/NNN/**` are immutable forever.
- The AI may improve the generator only after building, testing, and reflecting on the current day.

## Development

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm release:validate
pnpm test:smoke
```

## Repo structure

```txt
ai/                 Prompt system, rubric, idea bank, postmortems
prompts/            One archived generated prompt per completed day
apps/               Source apps for daily games
packages/           Shared contracts, build tools, test harnesses
public/assets/      Shared/reusable source assets
release/            Static published output
scripts/            Daily runner, release validation, guards
```

## Deployment

GitHub Actions builds `ghcr.io/michalsy/100-days-games`. The existing `gitops-config` repo deploys that image to k3s/ArgoCD at `https://100-days.sytko.de/`, with daily games at `/001`, `/002`, …. Internally immutable releases remain under `release/games/NNN/**` and Nginx maps `/NNN` to that folder.
