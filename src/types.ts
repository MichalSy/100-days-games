export type GameStatus = 'generated' | 'upcoming';

export interface GameCard {
  day: number;
  date: string;
  status: GameStatus;
  title: string;
  slug?: string;
  genre?: string[];
  mode?: '2d' | '3d' | 'hybrid';
  description?: string;
  objective?: string;
  playUrl?: string;
  promptUrl?: string;
  promptExcerpt?: string;
  screenshotUrl?: string;
  generationDuration?: string;
  generatedAt?: string;
}
