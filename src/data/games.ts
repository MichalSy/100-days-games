import type { GameCard } from '../types';

const START_DATE = '2026-06-11';

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const generatedGames: Record<number, Partial<GameCard>> = {
  1: {
    status: 'generated',
    title: 'Koi Lantern Drift',
    slug: 'koi-lantern-drift',
    genre: ['calm arcade', 'path-planning', 'collection'],
    mode: '2d',
    description: 'Guide a luminous koi through a moonlit Japanese garden pond, collect lantern sparks, and keep the central festival lantern lit through shifting currents.',
    objective: 'Reach 1200 points for Festival Bloom, build spark combos, and survive as long as possible.',
    playUrl: '/001/',
    promptUrl: '/games/001/prompt.html',
    promptExcerpt: 'Keep the festival lantern lit by collecting gold sparks while avoiding dark ripples and reeds.',
    screenshotUrl: '/games/001/screenshot.png',
    generationDuration: 'manual subagent run',
    generatedAt: '2026-06-11T00:55:00Z'
  }
};

export const games: GameCard[] = Array.from({ length: 100 }, (_, index) => {
  const day = index + 1;
  const generated = generatedGames[day];
  return {
    day,
    date: isoDate(addDays(new Date(`${START_DATE}T00:00:00Z`), index)),
    status: generated?.status ?? 'upcoming',
    title: generated?.title ?? `Day ${day.toString().padStart(3, '0')}`,
    description: generated?.description ?? 'Not generated yet. The nightly agent will create exactly one detailed prompt and one self-contained game for this day.',
    generationDuration: generated?.generationDuration,
    ...generated
  };
});
