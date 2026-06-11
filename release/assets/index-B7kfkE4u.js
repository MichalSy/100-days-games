(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`2026-06-11`;function t(e,t){let n=new Date(e);return n.setUTCDate(n.getUTCDate()+t),n}function n(e){return e.toISOString().slice(0,10)}var r={1:{status:`generated`,title:`Koi Lantern Drift`,slug:`koi-lantern-drift`,genre:[`calm arcade`,`path-planning`,`collection`],mode:`2d`,description:`Guide a luminous koi through a moonlit Japanese garden pond, collect lantern sparks, and keep the central festival lantern lit through shifting currents.`,objective:`Reach 1200 points for Festival Bloom, build spark combos, and survive as long as possible.`,playUrl:`/001/`,promptUrl:`/games/001/prompt.html`,promptExcerpt:`Keep the festival lantern lit by collecting gold sparks while avoiding dark ripples and reeds.`,screenshotUrl:`/games/001/screenshot.png`,generationDuration:`manual subagent run`,generatedAt:`2026-06-11T00:55:00Z`},2:{status:`generated`,title:`Clockwork Cloud Courier`,slug:`clockwork-cloud-courier`,genre:[`route-planning arcade`,`timed delivery`,`2D`],mode:`2d`,description:`Pilot a brass bird-mail glider between floating post towers, using wind lanes and boost rings while avoiding turbulence and gear-storms.`,objective:`Deliver all glowing letters before time expires, earn 3 stars, and chase the Golden Dispatch score banner.`,playUrl:`/002/`,promptUrl:`/games/002/prompt.html`,promptExcerpt:`Deliver every glowing letter before the clock runs out by following tower numbers, wind lanes, and shortcut boost rings.`,screenshotUrl:`/games/002/screenshot.png`,generationDuration:`manual subagent run ~50 minutes`,generatedAt:`2026-06-11T03:52:00Z`}},i=Array.from({length:100},(i,a)=>{let o=a+1,s=r[o];return{day:o,date:n(t(new Date(`${e}T00:00:00Z`),a)),status:s?.status??`upcoming`,title:s?.title??`Day ${o.toString().padStart(3,`0`)}`,description:s?.description??`Not generated yet. The nightly agent will create exactly one detailed prompt and one self-contained game for this day.`,generationDuration:s?.generationDuration,...s}}),a=document.querySelector(`#app`);if(!a)throw Error(`Missing #app root`);var o=i.filter(e=>e.status===`generated`).length,s=i.find(e=>e.status===`upcoming`);function c(e){return String(e).padStart(3,`0`)}function l(e){let t=e.status===`generated`,n=e.genre?.length?e.genre.join(` · `):`Awaiting generation`,r=e.mode?e.mode.toUpperCase():`TBD`,i=t&&e.promptUrl?`<a class="card-action ghost" href="${e.promptUrl}">View prompt</a>`:`<span class="card-action disabled">Prompt appears after generation</span>`,a=t&&e.playUrl?`<a class="card-action primary" href="${e.playUrl}">Play</a>`:`<span class="card-action disabled">Locked</span>`,o=e.screenshotUrl?`<img src="${e.screenshotUrl}" alt="Screenshot of ${e.title}" loading="lazy" />`:`<div class="placeholder-orb"><span>${c(e.day)}</span></div>`;return`
    <article class="game-card ${t?`generated`:`upcoming`}">
      <div class="card-media">${o}</div>
      <div class="card-body">
        <div class="card-kicker">
          <span>Day ${c(e.day)}</span>
          <span>${e.date}</span>
        </div>
        <h3>${e.title}</h3>
        <p>${e.description??`A future one-shot AI game.`}</p>
        <div class="meta-grid">
          <span><strong>Status</strong>${t?`Generated`:`Upcoming`}</span>
          <span><strong>Mode</strong>${r}</span>
          <span><strong>Genre</strong>${n}</span>
          <span><strong>Build time</strong>${e.generationDuration??`—`}</span>
        </div>
        ${e.promptExcerpt?`<blockquote>${e.promptExcerpt}</blockquote>`:``}
        <div class="card-actions">${a}${i}</div>
      </div>
    </article>`}a.innerHTML=`
  <header class="site-header">
    <a class="brand" href="/" aria-label="100 Days Games home">
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
        <div><dt>${o}</dt><dd>generated</dd></div>
        <div><dt>${100-o}</dt><dd>remaining</dd></div>
        <div><dt>${s?`Day ${c(s.day)}`:`Done`}</dt><dd>next target</dd></div>
      </dl>
    </section>

    <section class="rules-panel">
      <div>
        <span class="panel-icon">✦</span>
        <h2>The prompt is part of the artifact.</h2>
        <p>The daily cron does not embed the generation prompt. It only points to the git-tracked source prompt, generates a detailed day prompt, then archives that prompt next to the game.</p>
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
        ${i.map(l).join(``)}
      </div>
    </section>
  </main>

  <footer>
    <span>Built for autonomous Hermes game generation.</span>
    <span>Model target for cron: GPT-5.5 high reasoning.</span>
  </footer>
`;var u=document.querySelector(`.theme-toggle`);localStorage.getItem(`theme`)===`light`&&(document.documentElement.dataset.theme=`light`),u?.addEventListener(`click`,()=>{let e=document.documentElement.dataset.theme===`light`?`dark`:`light`;document.documentElement.dataset.theme=e,localStorage.setItem(`theme`,e)});