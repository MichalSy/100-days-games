import { describe, expect, it } from 'vitest';
import { games } from '../src/data/games';

describe('100 day gallery data', () => {
  it('contains exactly 100 day cards', () => {
    expect(games).toHaveLength(100);
  });

  it('starts with day 1 and ends with day 100', () => {
    expect(games[0].day).toBe(1);
    expect(games[99].day).toBe(100);
  });

  it('keeps future games visible before generation', () => {
    expect(games.every((game) => game.status === 'upcoming' || game.status === 'generated')).toBe(true);
  });

  it('uses the real generation date for generated cards and schedules upcoming days after the latest generated day', () => {
    expect(games[0].date).toBe('2026-06-11');
    expect(games[1].date).toBe('2026-06-11');
    expect(games[2].date).toBe('2026-06-12');
  });
});
