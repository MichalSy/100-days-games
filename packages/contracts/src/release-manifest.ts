import type { GameManifest } from './game-manifest';

export interface ReleaseManifest {
  generatedAt: string;
  totalDays: 100;
  completedDays: number;
  games: GameManifest[];
}
