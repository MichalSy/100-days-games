import './styles.css';
import { games } from './data/games';
import type { GameCard } from './types';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root');

const completed = games.filter((game) => game.status === 'generated').length;
const nextGame = games.find((game) => game.status === 'upcoming');

function padDay(day: number): string {
  return String(day).padStart(3, '0');
}

function card(game: GameCard): string {
  const isGenerated = game.status === 'generated';
  const genres = game.genre?.length ? game.genre.join(' · ') : 'Awaiting generation';
  const mode = game.mode ? game.mode.toUpperCase() : 'TBD';
  const prompt = isGenerated && game.promptUrl
    ? `<a class="card-action ghost" href="${game.promptUrl}">View prompt</a>`
    : `<span class="card-action disabled">Prompt appears after generation</span>`;
  const play = isGenerated && game.playUrl
    ? `<a class="card-action primary" href="${game.playUrl}">Play</a>`
    : `<span class="card-action disabled">Locked</span>`;
  const screenshot = game.screenshotUrl
    ? `<img src="${game.screenshotUrl}" alt="Screenshot of ${game.title}" loading="lazy" />`
    : `<div class="placeholder-orb"><span>${padDay(game.day)}</span></div>`;

  return `
    <article class="game-card ${isGenerated ? 'generated' : 'upcoming'}">
      <div class="card-media">${screenshot}</div>
      <div class="card-body">
        <div class="card-kicker">
          <span>Day ${padDay(game.day)}</span>
          <span>${game.date}</span>
        </div>
        <h3>${game.title}</h3>
        <p>${game.description ?? 'A future one-shot AI game.'}</p>
        <div class="meta-grid">
          <span><strong>Status</strong>${isGenerated ? 'Generated' : 'Upcoming'}</span>
          <span><strong>Mode</strong>${mode}</span>
          <span><strong>Genre</strong>${genres}</span>
          <span><strong>Build time</strong>${game.generationDuration ?? '—'}</span>
        </div>
        ${game.promptExcerpt ? `<blockquote>${game.promptExcerpt}</blockquote>` : ''}
        <div class="card-actions">${play}${prompt}</div>
      </div>
    </article>`;
}

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="/100-days-games/" aria-label="100 Days Games home">
      <span class="brand-mark">100</span>
      <span>Days Games</span>
    </a>
    <nav>
      <a href="#experiment">Experiment</a>
      <a href="#games">Games</a>
      <a href="https://github.com/MichalSy/100-days-games">GitHub</a>
      <button class="theme-toggle" type="button" aria-label="Toggle theme">Theme</button>
    </nav>
  </header>

  <main>
    <section class="hero" id="experiment">
      <div class="hero-glow"></div>
      <p class="eyebrow">Autonomous AI · one prompt · one game · every night</p>
      <h1>100 days of browser games generated from one-shot prompts.</h1>
      <p class="hero-copy">Every completed card links to the playable static game, the exact prompt that produced it, and how long the generation run took. Future days stay visible as locked cards until the nightly Hermes cron creates them.</p>
      <div class="hero-actions">
        <a class="button primary" href="#games">Browse the grid</a>
        <a class="button secondary" href="https://github.com/MichalSy/100-days-games">Open repo</a>
      </div>
      <dl class="stats">
        <div><dt>${completed}</dt><dd>generated</dd></div>
        <div><dt>${100 - completed}</dt><dd>remaining</dd></div>
        <div><dt>${nextGame ? `Day ${padDay(nextGame.day)}` : 'Done'}</dt><dd>next target</dd></div>
      </dl>
    </section>

    <section class="rules-panel">
      <div>
        <span class="panel-icon">✦</span>
        <h2>The prompt is part of the artifact.</h2>
        <p>The daily cron does not embed the generation prompt. It reads the current instruction set from git, generates a detailed day prompt, then archives that prompt next to the game.</p>
      </div>
      <div>
        <span class="panel-icon">◈</span>
        <h2>Static releases are frozen forever.</h2>
        <p>Once <code>release/games/NNN</code> lands on main, future runs may not edit or delete it. New games are additive only.</p>
      </div>
      <div>
        <span class="panel-icon">◎</span>
        <h2>Desktop and mobile must both work.</h2>
        <p>Every run validates menu, tutorial, objective, prompt link, browser rendering, mobile viewport, screenshot, and static Docker serving before push.</p>
      </div>
    </section>

    <section class="game-section" id="games">
      <div class="section-heading">
        <p class="eyebrow">The 100 day board</p>
        <h2>All days are visible from the beginning.</h2>
      </div>
      <div class="game-grid">
        ${games.map(card).join('')}
      </div>
    </section>
  </main>

  <footer>
    <span>Built for autonomous Hermes game generation.</span>
    <span>Model target for cron: GPT-5.5 high reasoning.</span>
  </footer>
`;

const button = document.querySelector<HTMLButtonElement>('.theme-toggle');
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'light') document.documentElement.dataset.theme = 'light';
button?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
});
