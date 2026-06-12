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

function generatedDate(game: Partial<GameCard> | undefined): string | undefined {
  return game?.generatedAt ? isoDate(new Date(game.generatedAt)) : undefined;
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
    playUrl: '/akari/',
    promptUrl: '/akari/prompt.html',
    promptExcerpt: 'Keep the festival lantern lit by collecting gold sparks while avoiding dark ripples and reeds.',
    screenshotUrl: '/akari/screenshot.png',
    generationDuration: 'manual subagent run',
    generatedAt: '2026-06-11T00:55:00Z'
  },
  2: {
    status: 'generated',
    title: 'Clockwork Cloud Courier',
    slug: 'clockwork-cloud-courier',
    genre: ['route-planning arcade', 'timed delivery', '2D'],
    mode: '2d',
    description: 'Pilot a brass bird-mail glider between floating post towers, using wind lanes and boost rings while avoiding turbulence and gear-storms.',
    objective: 'Deliver all glowing letters before time expires, earn 3 stars, and chase the Golden Dispatch score banner.',
    playUrl: '/tsubasa/',
    promptUrl: '/tsubasa/prompt.html',
    promptExcerpt: 'Deliver every glowing letter before the clock runs out by following tower numbers, wind lanes, and shortcut boost rings.',
    screenshotUrl: '/tsubasa/screenshot.png',
    generationDuration: 'manual subagent run ~50 minutes',
    generatedAt: '2026-06-11T03:52:00Z'
  },
  3: {
    status: 'generated',
    title: 'Neon Bonsai Skyforge',
    slug: 'neon-bonsai-skyforge',
    genre: ['spatial arcade crafting', 'ring-navigation', '3D'],
    mode: '3d',
    description: 'Pilot a luminous forge-drone through depth-separated bonsai rings, collect colored sap motes, avoid cracked lanterns, and bank upgrades at floating bonsai cores.',
    objective: 'Reach 2400 points and complete Root, Branch, and Blossom upgrades to trigger Skyforge Bloom, then continue the endless score chase.',
    playUrl: '/komorebi/',
    promptUrl: '/komorebi/prompt.html',
    promptExcerpt: 'Fly through 3D bonsai rings, collect sap, and forge all three upgrades before heat or hazards end the run.',
    screenshotUrl: '/komorebi/screenshot.png',
    generationDuration: 'manual subagent run ~75 minutes',
    generatedAt: '2026-06-12T04:10:00Z'
  }
};

const generatedEntries = Object.entries(generatedGames)
  .map(([day, game]) => ({ day: Number(day), date: generatedDate(game) }))
  .filter((entry): entry is { day: number; date: string } => Boolean(entry.date))
  .sort((a, b) => a.day - b.day);

const latestGeneratedEntry = generatedEntries.at(-1);
const nextUpcomingBase = latestGeneratedEntry
  ? new Date(`${latestGeneratedEntry.date}T00:00:00Z`)
  : new Date(`${START_DATE}T00:00:00Z`);
const nextUpcomingDay = latestGeneratedEntry ? latestGeneratedEntry.day : 1;

function scheduledDate(day: number, generated: Partial<GameCard> | undefined): string {
  const actualGeneratedDate = generatedDate(generated);
  if (actualGeneratedDate) return actualGeneratedDate;
  return isoDate(addDays(nextUpcomingBase, day - nextUpcomingDay));
}

export const games: GameCard[] = Array.from({ length: 100 }, (_, index) => {
  const day = index + 1;
  const generated = generatedGames[day];
  return {
    day,
    date: scheduledDate(day, generated),
    status: generated?.status ?? 'upcoming',
    title: generated?.title ?? `Day ${day.toString().padStart(3, '0')}`,
    description: generated?.description ?? 'Not generated yet. The nightly agent will create exactly one detailed prompt and one self-contained game for this day.',
    generationDuration: generated?.generationDuration,
    ...generated
  };
});
