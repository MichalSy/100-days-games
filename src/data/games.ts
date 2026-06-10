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

export const games: GameCard[] = Array.from({ length: 100 }, (_, index) => {
  const day = index + 1;
  return {
    day,
    date: isoDate(addDays(new Date(`${START_DATE}T00:00:00Z`), index)),
    status: 'upcoming',
    title: `Day ${day.toString().padStart(3, '0')}`,
    description: 'Not generated yet. The nightly agent will create exactly one detailed prompt and one self-contained game for this day.',
    generationDuration: undefined
  };
});

games[0] = {
  day: 1,
  date: START_DATE,
  status: 'generated',
  title: 'Lumen Lanes',
  slug: 'lumen-lanes',
  genre: ['Arcade puzzle', 'Route planning', 'Reflex strategy'],
  mode: '2d',
  description: 'Rotate neon city lane tiles, connect the cyan source to the gold beacon, and launch a courier pulse through five escalating sectors before energy expires.',
  objective: 'Clear five sectors by building continuous light routes from start node to exit beacon.',
  playUrl: '/001/',
  promptUrl: '/games/001/prompt.html',
  promptExcerpt: 'Guide a courier of light through a shifting city grid by rotating lane tiles before energy runs out.',
  screenshotUrl: '/games/001/screenshot.png',
  generationDuration: 'local cron implementation run',
  generatedAt: '2026-06-11'
};
