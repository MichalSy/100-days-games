export interface GameManifest {
  day: number;
  slug: string;
  title: string;
  date: string;
  mode: '2d' | '3d' | 'hybrid';
  genre: string[];
  description: string;
  objective: string;
  winCondition: string;
  loseCondition: string;
  estimatedPlayMinutes: number;
  desktopControls: string[];
  mobileControls: string[];
  tutorial: string[];
  promptPath: string;
  screenshotPath?: string;
  generationDuration?: string;
  generatedAt?: string;
  assetCredits: string[];
}
