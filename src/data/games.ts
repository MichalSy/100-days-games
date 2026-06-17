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
  },
  4: {
    status: 'generated',
    title: 'Hikari Firefly Cartographer',
    slug: 'hikari-firefly-cartographer',
    genre: ['path-drawing arcade puzzle', 'light-routing', 'mobile-first 2D'],
    mode: '2d',
    description: 'Draw glowing routes through a moonlit shrine garden to guide colored fireflies into matching lantern constellations before dawn.',
    objective: 'Complete three lantern constellations and reach 1800 points to trigger Hikari Dawn Map, then continue into endless shadow waves.',
    playUrl: '/hikari/',
    promptUrl: '/hikari/prompt.html',
    promptExcerpt: 'Draw short light paths, route fireflies by color, dodge moving shadows, and finish the Hikari Dawn Map before the garden clock reaches dawn.',
    screenshotUrl: '/hikari/screenshot.png',
    generationDuration: 'manual subagent run ~90 minutes',
    generatedAt: '2026-06-13T17:31:45Z'
  },
  5: {
    status: 'generated',
    title: 'Yume Lantern Railrunner',
    slug: 'yume-lantern-railrunner',
    genre: ['3D lane runner', 'dream-rail navigation', 'mobile-first arcade'],
    mode: '3d',
    description: 'Ride a tiny lantern tram through a dreamlike paper-theater night sky, switch rails in 3D depth, collect tickets, pass moon gates, and arrive before dawn.',
    objective: 'Reach 2600 points and clear Moon Platform, Paper Crane Bridge, and Dawn Bell Loop to trigger Yume Dawn Arrival, then continue into endless night-loop scoring.',
    playUrl: '/yume/',
    promptUrl: '/yume/prompt.html',
    promptExcerpt: 'Switch rails, collect dream tickets, pass glowing moon gates, avoid cracked nightmare tracks, and ring the Lucid Bell when the 3D path blurs.',
    screenshotUrl: '/yume/screenshot.png',
    generationDuration: 'manual subagent run ~100 minutes',
    generatedAt: '2026-06-14T01:43:31Z'
  },
  6: {
    status: 'generated',
    title: 'Sora Tideglass Observatory',
    slug: 'sora-tideglass-observatory',
    genre: ['3D puzzle arcade', 'moonbeam alignment', 'mobile-first hybrid'],
    mode: 'hybrid',
    description: 'Rotate prism towers on a floating sky observatory board to guide moonbeams through depth-aware paths into constellation receivers before the tideglass overflows.',
    objective: 'Complete Crane, Fox, and Dawn Gate constellations and reach 2200 points to trigger Sora Star-Tide Calibration, then continue into endless constellation waves.',
    playUrl: '/sora/',
    promptUrl: '/sora/prompt.html',
    promptExcerpt: 'Select prism towers, rotate moonbeam angles, charge constellation nodes, avoid eclipse shards, and stabilize the sky with Still Sky before the tideglass overflows.',
    screenshotUrl: '/sora/screenshot.png',
    generationDuration: 'manual subagent run ~120 minutes',
    generatedAt: '2026-06-15T01:44:30Z'
  },
  7: {
    status: 'generated',
    title: 'Nami Bento Tide Kitchen',
    slug: 'nami-bento-tide-kitchen',
    genre: ['time-management puzzle', 'conveyor cooking', 'mobile-first 2D'],
    mode: '2d',
    description: 'Run a bright seaside bento stall by catching tide-lane ingredients, filling customer orders in sequence, dodging crabs and wasabi decoys, and chaining clean service combos.',
    objective: 'Complete Morning Ferry, Lunch Bell, and Festival Rush while reaching 2400 points to trigger Nami Grand Bento Service, then continue into endless rush scoring.',
    playUrl: '/nami/',
    promptUrl: '/nami/prompt.html',
    promptExcerpt: 'Catch tide ingredients, drag or tap them into bento tray slots, satisfy customer order cards, calm the conveyor waves, and keep complaint shells away.',
    screenshotUrl: '/nami/screenshot.png',
    generationDuration: 'manual subagent run ~95 minutes',
    generatedAt: '2026-06-16T01:44:33Z'
  },
  8: {
    status: 'generated',
    title: 'Mori Mosslight Seedkeeper',
    slug: 'mori-mosslight-seedkeeper',
    genre: ['3D garden-routing strategy arcade', 'terrarium stewardship', 'mobile-first score chase'],
    mode: '3d',
    description: 'Inspect a miniature moss shrine board, rotate raised root tiles, place a temporary bridge, pulse a lantern, and route rolling dew beads into thirsty seedling basins before drought and soot mites overwhelm the grove.',
    objective: 'Complete Fern Steps, Cedar Gate, and Kodama Bloom while reaching 2600 points to trigger Mori Mosslight Bloom, then continue into endless forest-night scoring.',
    playUrl: '/mori/',
    promptUrl: '/mori/prompt.html',
    promptExcerpt: 'Rotate moss/root tiles in a 3D forest shrine, guide glowing dew through slopes and bridges into requested basins, and keep soot mites away with Mosslight.',
    screenshotUrl: '/mori/screenshot.png',
    generationDuration: 'manual subagent run with timeout recovery ~120 minutes',
    generatedAt: '2026-06-17T01:46:03Z'
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
