(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(t){if(t.ep)return;t.ep=!0;const s=n(t);fetch(t.href,s)}})();const u="2026-06-11";function g(e,a){const n=new Date(e);return n.setUTCDate(n.getUTCDate()+a),n}function f(e){return e.toISOString().slice(0,10)}const c=Array.from({length:100},(e,a)=>{const n=a+1;return{day:n,date:f(g(new Date(`${u}T00:00:00Z`),a)),status:"upcoming",title:`Day ${n.toString().padStart(3,"0")}`,description:"Not generated yet. The nightly agent will create exactly one detailed prompt and one self-contained game for this day.",generationDuration:void 0}}),m=document.querySelector("#app");if(!m)throw new Error("Missing #app root");const p=c.filter(e=>e.status==="generated").length,h=c.find(e=>e.status==="upcoming");function d(e){return String(e).padStart(3,"0")}function y(e){var l;const a=e.status==="generated",n=(l=e.genre)!=null&&l.length?e.genre.join(" · "):"Awaiting generation",o=e.mode?e.mode.toUpperCase():"TBD",t=a&&e.promptUrl?`<a class="card-action ghost" href="${e.promptUrl}">View prompt</a>`:'<span class="card-action disabled">Prompt appears after generation</span>',s=a&&e.playUrl?`<a class="card-action primary" href="${e.playUrl}">Play</a>`:'<span class="card-action disabled">Locked</span>',r=e.screenshotUrl?`<img src="${e.screenshotUrl}" alt="Screenshot of ${e.title}" loading="lazy" />`:`<div class="placeholder-orb"><span>${d(e.day)}</span></div>`;return`
    <article class="game-card ${a?"generated":"upcoming"}">
      <div class="card-media">${r}</div>
      <div class="card-body">
        <div class="card-kicker">
          <span>Day ${d(e.day)}</span>
          <span>${e.date}</span>
        </div>
        <h3>${e.title}</h3>
        <p>${e.description??"A future one-shot AI game."}</p>
        <div class="meta-grid">
          <span><strong>Status</strong>${a?"Generated":"Upcoming"}</span>
          <span><strong>Mode</strong>${o}</span>
          <span><strong>Genre</strong>${n}</span>
          <span><strong>Build time</strong>${e.generationDuration??"—"}</span>
        </div>
        ${e.promptExcerpt?`<blockquote>${e.promptExcerpt}</blockquote>`:""}
        <div class="card-actions">${s}${t}</div>
      </div>
    </article>`}m.innerHTML=`
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
        <div><dt>${p}</dt><dd>generated</dd></div>
        <div><dt>${100-p}</dt><dd>remaining</dd></div>
        <div><dt>${h?`Day ${d(h.day)}`:"Done"}</dt><dd>next target</dd></div>
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
        ${c.map(y).join("")}
      </div>
    </section>
  </main>

  <footer>
    <span>Built for autonomous Hermes game generation.</span>
    <span>Model target for cron: GPT-5.5 high reasoning.</span>
  </footer>
`;const i=document.querySelector(".theme-toggle"),v=localStorage.getItem("theme");v==="light"&&(document.documentElement.dataset.theme="light");i==null||i.addEventListener("click",()=>{const e=document.documentElement.dataset.theme==="light"?"dark":"light";document.documentElement.dataset.theme=e,localStorage.setItem("theme",e)});
