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
