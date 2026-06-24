(() => {
  'use strict';

  const DAY = '013';
  const BEST_KEY = 'day013-ame-best-score';
  const TIME_KEY = 'day013-ame-best-time';
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const $ = (id) => document.getElementById(id);

  const el = {
    score: $('score'), best: $('best'), dryness: $('dryness'), joy: $('joy'), storm: $('storm'), combo: $('combo'), time: $('time'),
    chapterTitle: $('chapterTitle'), chapterGoal: $('chapterGoal'), goalChips: $('goalChips'), helper: $('helper'), tray: $('parasolTray'),
    overlay: $('overlay'), overlayTitle: $('overlayTitle'), overlayText: $('overlayText'), resultLine: $('resultLine'),
    startBtn: $('startBtn'), resumeBtn: $('resumeBtn'), overlayRestartBtn: $('overlayRestartBtn'),
    prevLane: $('prevLane'), nextLane: $('nextLane'), tiltLeft: $('tiltLeft'), tiltRight: $('tiltRight'), wide: $('wide'), thunder: $('thunder'),
    pauseBtn: $('pauseBtn'), restartBtn: $('restartBtn')
  };

  const assets = {
    bg: new Image(), guide: new Image(), icons: new Image()
  };
  assets.bg.src = './assets/ame-market.png';
  assets.guide.src = './assets/ame-guide.png';
  assets.icons.src = './assets/ame-icons.png';

  const chapters = [
    { name: 'Market Drizzle', goal: 'Escort 4 guests, open 1 reflection, keep dryness 80%+', guests: 4, parasols: 2, puddles: 1, targetDry: 80, deflects: 6, rainEvery: 6.2, duration: 46,
      chips: ['4 guests', '1 reflection', 'dry 80%+', '6 gutters'] },
    { name: 'Red Bridge Crossing', goal: 'Escort 6 guests through near/mid/far paths and protect joy charms.', guests: 6, parasols: 3, puddles: 2, targetDry: 72, deflects: 13, rainEvery: 4.8, duration: 62,
      chips: ['6 guests', '2 reflections', 'bridge lanes', 'dry 72%+'] },
    { name: 'Lantern Downpour', goal: 'Conduct 8 guests, deflect heavy curtains, and score 2700 for Moonlit Procession.', guests: 8, parasols: 4, puddles: 3, targetDry: 65, deflects: 22, rainEvery: 3.8, duration: 76,
      chips: ['8 guests', '3 puddles', '22 gutters', 'score 2700'] }
  ];

  const colors = ['#ec4656', '#349bff', '#f4bd42', '#a77cff'];
  const lanes = [
    { y: 0.36, label: 'near', dx: -0.08, color: 'rgba(255,111,125,0.24)' },
    { y: 0.52, label: 'mid', dx: 0.00, color: 'rgba(117,228,255,0.22)' },
    { y: 0.68, label: 'far', dx: 0.08, color: 'rgba(255,208,106,0.21)' }
  ];

  const state = {
    mode: 'menu', chapter: 0, score: 0, best: Number(localStorage.getItem(BEST_KEY) || 0), bestTime: Number(localStorage.getItem(TIME_KEY) || 0),
    dryness: 100, joy: 3, storm: 0, combo: 1, time: 0, chapterTime: 0, thunder: 0, moonlit: false,
    guestsEscorted: 0, reflectionsOpened: 0, deflects: 0, dryStreak: 0, selected: 0,
    parasols: [], guests: [], puddles: [], rains: [], stamps: [], particles: [], dragging: false, pointerId: null,
    nextGuest: 0, rainClock: 2.5, thunderActive: 0, messageTimer: 0, lastTs: performance.now()
  };

  function rand(seed) {
    let x = Math.sin(seed * 999.123) * 10000;
    return x - Math.floor(x);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(320, Math.floor(rect.width * dpr));
    canvas.height = Math.max(260, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  function pathPoint(lane, t) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const curve = Math.sin(t * Math.PI);
    const x = w * (0.13 + t * 0.74 + lanes[lane].dx * curve);
    const y = h * (lanes[lane].y - 0.10 * curve + 0.025 * Math.sin(t * Math.PI * 2 + lane));
    return { x, y };
  }

  function legalAnchor(lane, slot) {
    const t = Math.max(0.08, Math.min(0.92, slot));
    return { ...pathPoint(lane, t), lane, slot: t };
  }

  function currentChapter() { return chapters[state.chapter] || chapters[chapters.length - 1]; }

  function resetRun() {
    const ch = currentChapter();
    state.mode = 'playing'; state.score = 0; state.dryness = 100; state.joy = 3; state.storm = 0; state.combo = 1; state.time = 0; state.chapterTime = 0;
    state.thunder = 0; state.moonlit = false; state.guestsEscorted = 0; state.reflectionsOpened = 0; state.deflects = 0; state.dryStreak = 0; state.selected = 0;
    state.guests = []; state.rains = []; state.particles = []; state.stamps = []; state.nextGuest = 0; state.rainClock = 2.1; state.thunderActive = 0; state.messageTimer = 0;
    state.parasols = Array.from({ length: ch.parasols }, (_, i) => {
      const anchor = legalAnchor(i % 3, 0.24 + i * 0.18);
      return { id: i, ...anchor, color: colors[i], tilt: i % 2 ? 1 : -1, wide: i === 0, name: ['Red', 'Blue', 'Gold', 'Violet'][i] };
    });
    state.puddles = Array.from({ length: ch.puddles }, (_, i) => {
      const lane = (i + 1) % 3;
      const anchor = legalAnchor(lane, 0.38 + i * 0.19);
      return { id: i, ...anchor, pulse: i * 1.7, open: 0, radius: 34 };
    });
    spawnStamp();
    updateChapterUI(); updateTray(); hideOverlay();
  }

  function advanceChapter() {
    if (state.chapter < chapters.length - 1) {
      state.chapter += 1;
      const carryScore = state.score;
      const carryBest = state.best;
      resetRun();
      state.score = carryScore + 460;
      state.best = carryBest;
      state.messageTimer = 2.4;
      state.particles.push({ x: canvas.clientWidth / 2, y: canvas.clientHeight * 0.28, text: 'Chapter sealed +460', life: 2.0, color: '#ffd06a' });
    } else if (!state.moonlit && state.score >= 2700) {
      state.moonlit = true;
      state.score += 900;
      state.thunderActive = 3.5;
      state.particles.push({ x: canvas.clientWidth / 2, y: canvas.clientHeight * 0.36, text: 'Ame Moonlit Procession +900', life: 3.2, color: '#ffd06a' });
    } else {
      // endless refresh with denser pressure
      state.guestsEscorted = 0;
      state.reflectionsOpened = 0;
      state.deflects = 0;
      state.nextGuest = 0;
      state.chapterTime = 0;
      state.score += 320;
      state.particles.push({ x: canvas.clientWidth / 2, y: canvas.clientHeight * 0.4, text: 'Endless rainy-night commission', life: 2.4, color: '#75e4ff' });
    }
    updateChapterUI();
  }

  function showOverlay(kind) {
    el.overlay.classList.add('show');
    el.resumeBtn.classList.toggle('hidden', kind !== 'pause');
    el.startBtn.classList.toggle('hidden', kind === 'pause');
    if (kind === 'pause') {
      el.overlayTitle.textContent = 'Rain paused';
      el.overlayText.textContent = 'Resume when you are ready. Your parasols and guests are waiting under the lanterns.';
      el.resultLine.textContent = `Score ${state.score} · Dryness ${Math.round(state.dryness)}% · Thunder ${Math.round(state.thunder)}%`;
    } else if (kind === 'gameover') {
      el.overlayTitle.textContent = state.moonlit ? 'Moonlit Procession Complete' : 'Procession ended';
      el.overlayText.textContent = state.moonlit ? 'The rain softened into lantern glitter. Endless rainy-night commissions are open.' : 'The storm bowl overflowed or the guests lost their joy. Conduct them again.';
      el.resultLine.textContent = `Final score ${state.score} · Best ${state.best} · Dry streak ${state.dryStreak}`;
    } else {
      el.overlayTitle.textContent = 'Ame Parasol Puddle Conductor';
      el.overlayText.textContent = 'Move and tilt paper parasols to keep shrine guests dry through the rainy procession.';
      el.resultLine.textContent = state.best ? `Best score ${state.best}${state.bestTime ? ` · Best Moonlit ${formatTime(state.bestTime)}` : ''}` : '';
    }
  }
  function hideOverlay() { el.overlay.classList.remove('show'); }

  function updateChapterUI() {
    const ch = currentChapter();
    el.chapterTitle.textContent = ch.name;
    el.chapterGoal.textContent = ch.goal;
    el.goalChips.innerHTML = ch.chips.map((chip) => `<span>${chip}</span>`).join('');
  }

  function updateTray() {
    el.tray.innerHTML = '';
    state.parasols.forEach((p) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `parasol-card${p.id === state.selected ? ' active' : ''}`;
      card.setAttribute('aria-label', `Select ${p.name} parasol`);
      card.innerHTML = `<span class="dot" style="background:${p.color}"></span><small>${lanes[p.lane].label}</small>`;
      card.addEventListener('click', () => { state.selected = p.id; updateTray(); updateHelper(); });
      el.tray.appendChild(card);
    });
  }

  function updateHUD() {
    el.score.textContent = Math.round(state.score);
    el.best.textContent = state.best;
    el.dryness.textContent = `${Math.max(0, Math.round(state.dryness))}%`;
    el.joy.textContent = `${Math.max(0, state.joy)}/3`;
    el.storm.textContent = `${Math.min(100, Math.round(state.storm))}%`;
    el.combo.textContent = `x${Math.max(1, Math.floor(state.combo))}`;
    el.time.textContent = formatTime(state.time);
    el.thunder.textContent = state.thunderActive > 0 ? 'Thunder!' : `Thunder ${Math.round(state.thunder)}%`;
    el.thunder.disabled = state.thunder < 100 || state.mode !== 'playing';
  }

  function updateHelper() {
    const p = state.parasols[state.selected];
    if (!p) { el.helper.textContent = 'Select a parasol to conduct the procession.'; return; }
    const covered = state.guests.filter((g) => isSheltered(g, p)).length;
    el.helper.textContent = `${p.name} parasol · ${lanes[p.lane].label} lane · tilt ${p.tilt < 0 ? 'left' : p.tilt > 0 ? 'right' : 'center'} · ${p.wide ? 'wide shelter' : 'focused shelter'} · protecting ${covered} guest${covered === 1 ? '' : 's'}`;
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function spawnGuest() {
    const ch = currentChapter();
    if (state.nextGuest >= ch.guests) return;
    const lane = (state.nextGuest + state.chapter + Math.floor(rand(state.nextGuest + 13) * 3)) % 3;
    state.guests.push({ id: state.nextGuest, lane, t: 0, speed: 0.055 + state.chapter * 0.009 + rand(state.nextGuest + 21) * 0.016, dry: 100, joy: 100, color: colors[state.nextGuest % colors.length], wait: 0 });
    state.nextGuest += 1;
  }

  function spawnRain() {
    const ch = currentChapter();
    const lane = Math.floor(rand(state.time + state.chapter * 7 + state.rains.length) * 3);
    state.rains.push({ lane, t: 0, duration: 2.5 - state.chapter * 0.22, power: 1 + state.chapter * 0.25 });
    for (let i = 0; i < 12; i++) {
      const p = pathPoint(lane, i / 11);
      state.particles.push({ x: p.x + (rand(i + state.time) - 0.5) * 80, y: p.y - 70, vx: -18, vy: 110, life: 0.7 + rand(i) * 0.4, color: '#75e4ff', rain: true });
    }
  }

  function spawnStamp() {
    const lane = Math.floor(rand(state.time + 44) * 3);
    const anchor = legalAnchor(lane, 0.34 + rand(state.time + 9) * 0.44);
    state.stamps.push({ ...anchor, life: 10, taken: false });
  }

  function isSheltered(guest, parasol = state.parasols[state.selected]) {
    if (!parasol || guest.lane !== parasol.lane) return false;
    const pos = pathPoint(guest.lane, guest.t);
    const dx = pos.x - parasol.x;
    const dy = pos.y - parasol.y;
    const rx = parasol.wide ? 112 : 78;
    const ry = parasol.wide ? 58 : 42;
    const skew = parasol.tilt * 30;
    const nx = (dx - skew) / rx;
    const ny = dy / ry;
    return nx * nx + ny * ny <= 1;
  }

  function update(dt) {
    if (state.mode !== 'playing') return;
    const ch = currentChapter();
    const slow = state.thunderActive > 0 ? 0.35 : 1;
    state.time += dt;
    state.chapterTime += dt;
    state.rainClock -= dt * slow;
    state.thunderActive = Math.max(0, state.thunderActive - dt);
    state.messageTimer = Math.max(0, state.messageTimer - dt);

    if (state.nextGuest < ch.guests && state.chapterTime > state.nextGuest * Math.max(1.8, 3.2 - state.chapter * 0.35)) spawnGuest();
    if (state.rainClock <= 0) { spawnRain(); state.rainClock = Math.max(2.3, ch.rainEvery - state.chapterTime * 0.012); }
    if (!state.stamps.length || state.stamps.every((s) => s.taken || s.life <= 0)) spawnStamp();

    state.rains.forEach((r) => { r.t += dt * slow; });
    state.rains = state.rains.filter((r) => r.t < r.duration);

    state.puddles.forEach((p) => {
      p.pulse += dt;
      p.open = Math.max(0, p.open - dt);
    });

    state.guests.forEach((g) => {
      let speed = g.speed * dt * slow;
      const pos = pathPoint(g.lane, g.t);
      const nearClosedPuddle = state.puddles.find((p) => p.lane === g.lane && Math.hypot(pos.x - p.x, pos.y - p.y) < p.radius + 14 && p.open <= 0);
      if (nearClosedPuddle) {
        speed *= 0.18;
        g.wait += dt;
        if (g.wait > 1.4) {
          g.joy -= dt * 10;
          state.storm += dt * 1.4;
        }
      } else {
        g.wait = Math.max(0, g.wait - dt * 2);
      }
      g.t += speed;

      const raining = state.rains.some((r) => r.lane === g.lane && r.t > 0.15 && r.t < r.duration - 0.15);
      const protectedNow = state.parasols.some((p) => isSheltered(g, p));
      if (raining && !protectedNow) {
        g.dry -= dt * 8;
        state.dryness -= dt * 1.4;
        state.storm += dt * 1.25;
        state.combo = 1;
      } else if (raining && protectedNow) {
        state.score += dt * 28 * state.combo;
        state.thunder = Math.min(100, state.thunder + dt * 3.5);
        state.deflects += dt * 0.9;
        state.combo = Math.min(9, state.combo + dt * 0.14);
      }

      state.stamps.forEach((s) => {
        if (!s.taken && s.lane === g.lane && Math.hypot(pos.x - s.x, pos.y - s.y) < 32 && g.dry > 55) {
          s.taken = true;
          state.score += 120 * state.combo;
          state.thunder = Math.min(100, state.thunder + 12);
          state.particles.push({ x: s.x, y: s.y, text: '+ lantern stamp', life: 1.2, color: '#ffd06a' });
        }
      });
    });

    const before = state.guests.length;
    state.guests = state.guests.filter((g) => {
      if (g.t >= 1) {
        state.guestsEscorted += 1;
        state.score += g.dry >= ch.targetDry ? 120 * state.combo : 55;
        if (g.dry >= ch.targetDry) state.dryStreak += 1;
        state.dryness = Math.min(100, state.dryness + 1.5);
        state.particles.push({ x: canvas.clientWidth * 0.82, y: canvas.clientHeight * 0.45, text: g.dry >= ch.targetDry ? 'dry guest +120' : 'guest escorted', life: 1.2, color: g.dry >= ch.targetDry ? '#9af6ad' : '#e6f8ff' });
        return false;
      }
      if (g.dry <= 0 || g.joy <= 0) {
        state.joy -= 1;
        state.storm += 8;
        state.particles.push({ x: pathPoint(g.lane, g.t).x, y: pathPoint(g.lane, g.t).y, text: 'joy charm cracked', life: 1.4, color: '#ff7e73' });
        return false;
      }
      return true;
    });
    if (before !== state.guests.length) updateHelper();

    state.stamps.forEach((s) => { s.life -= dt; });
    state.stamps = state.stamps.filter((s) => !s.taken && s.life > 0);
    state.particles.forEach((p) => { p.life -= dt; p.x += (p.vx || 0) * dt; p.y += (p.vy || -22) * dt; });
    state.particles = state.particles.filter((p) => p.life > 0);

    const guestDone = state.guestsEscorted >= ch.guests && state.nextGuest >= ch.guests && state.guests.length === 0;
    const objectiveDone = guestDone && state.dryness >= ch.targetDry - 8 && state.reflectionsOpened >= Math.min(ch.puddles, Math.max(1, ch.puddles - 1));
    if (objectiveDone) advanceChapter();

    if (state.storm >= 100 || state.dryness <= 0 || state.joy <= 0 || state.chapterTime > ch.duration + 34) {
      endGame();
    }
    updateHUD(); updateHelper();
  }

  function endGame() {
    state.mode = 'gameover';
    if (state.score > state.best) {
      state.best = Math.round(state.score);
      localStorage.setItem(BEST_KEY, String(state.best));
    }
    if (state.moonlit && (!state.bestTime || state.time < state.bestTime)) {
      state.bestTime = Math.round(state.time);
      localStorage.setItem(TIME_KEY, String(state.bestTime));
    }
    showOverlay('gameover');
  }

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    drawBackground(w, h);
    drawPaths(w, h);
    drawPuddles();
    drawRainCurtains(w, h);
    drawStamps();
    drawParasols();
    drawGuests();
    drawParticles();
    if (state.mode === 'menu') drawAttract(w, h);
  }

  function drawBackground(w, h) {
    if (assets.bg.complete && assets.bg.naturalWidth) {
      const scale = Math.max(w / assets.bg.naturalWidth, h / assets.bg.naturalHeight);
      const iw = assets.bg.naturalWidth * scale;
      const ih = assets.bg.naturalHeight * scale;
      ctx.drawImage(assets.bg, (w - iw) / 2, (h - ih) / 2, iw, ih);
    }
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(3, 12, 22, 0.30)');
    grad.addColorStop(0.55, 'rgba(3, 14, 22, 0.48)');
    grad.addColorStop(1, 'rgba(3, 11, 18, 0.72)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // ambient rain streaks
    ctx.save();
    ctx.strokeStyle = 'rgba(165, 226, 244, 0.23)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 50; i++) {
      const x = (i * 67 + state.time * 42) % (w + 90) - 45;
      const y = (i * 97 + state.time * 116) % (h + 120) - 60;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 42); ctx.stroke();
    }
    ctx.restore();
  }

  function drawPaths(w, h) {
    lanes.forEach((lane, li) => {
      ctx.save();
      ctx.lineWidth = li === state.parasols[state.selected]?.lane ? 34 : 26;
      ctx.lineCap = 'round';
      ctx.strokeStyle = lane.color;
      ctx.beginPath();
      for (let i = 0; i <= 28; i++) {
        const p = pathPoint(li, i / 28);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.24)';
      ctx.setLineDash([10, 11]);
      ctx.stroke();
      ctx.restore();
    });
    // gutter rails
    ctx.save();
    ctx.strokeStyle = 'rgba(117,228,255,0.38)';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(w * 0.08, h * 0.22); ctx.lineTo(w * 0.05, h * 0.88); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w * 0.92, h * 0.22); ctx.lineTo(w * 0.95, h * 0.88); ctx.stroke();
    ctx.fillStyle = 'rgba(255,208,106,0.9)';
    ctx.font = '800 13px system-ui';
    ctx.fillText('gutter', w * 0.05, h * 0.19);
    ctx.fillText('gutter', w * 0.87, h * 0.19);
    ctx.restore();
  }

  function drawPuddles() {
    state.puddles.forEach((p) => {
      const pulsing = Math.sin(p.pulse * 2.4) > 0.15;
      const open = p.open > 0;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(1.55, 0.58);
      ctx.fillStyle = open ? 'rgba(142, 241, 255, 0.56)' : pulsing ? 'rgba(142, 241, 255, 0.32)' : 'rgba(54, 134, 164, 0.22)';
      ctx.strokeStyle = open ? '#ffd06a' : 'rgba(173,227,244,0.55)';
      ctx.lineWidth = open ? 4 : 2;
      ctx.beginPath(); ctx.ellipse(0, 0, p.radius, p.radius, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (open) {
        ctx.fillStyle = 'rgba(255,255,255,0.86)';
        for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.ellipse(i * 17, -2, 8, 5, 0, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.restore();
    });
  }

  function drawRainCurtains(w, h) {
    state.rains.forEach((r) => {
      const a = Math.sin((r.t / r.duration) * Math.PI);
      const p1 = pathPoint(r.lane, 0.05);
      const p2 = pathPoint(r.lane, 0.95);
      ctx.save();
      ctx.strokeStyle = `rgba(117,228,255,${0.18 + a * 0.38})`;
      ctx.lineWidth = 22 + r.power * 6;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y - 54); ctx.lineTo(p2.x, p2.y - 54); ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${0.25 + a * 0.33})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 18; i++) {
        const t = i / 17;
        const p = pathPoint(r.lane, t);
        ctx.beginPath(); ctx.moveTo(p.x + (i % 2 ? 8 : -8), p.y - 82); ctx.lineTo(p.x - 8, p.y - 24); ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawStamps() {
    state.stamps.forEach((s) => {
      const pulse = 0.75 + Math.sin(state.time * 5) * 0.15;
      ctx.save();
      ctx.translate(s.x, s.y - 34);
      ctx.fillStyle = '#ffd06a';
      ctx.strokeStyle = 'rgba(40,20,0,0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(-17 * pulse, -22 * pulse, 34 * pulse, 44 * pulse, 9); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#8d2d1f';
      ctx.font = `${18 * pulse}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('灯', 0, 0);
      ctx.restore();
    });
  }

  function drawParasols() {
    state.parasols.forEach((p) => {
      const selected = p.id === state.selected;
      const rx = p.wide ? 112 : 78;
      const ry = p.wide ? 58 : 42;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tilt * 0.12);
      ctx.fillStyle = `${p.color}22`;
      ctx.strokeStyle = selected ? '#ffd06a' : `${p.color}aa`;
      ctx.lineWidth = selected ? 4 : 2.5;
      ctx.beginPath(); ctx.ellipse(p.tilt * 30, 0, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // umbrella canopy
      ctx.fillStyle = p.color;
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-34, -14);
      ctx.quadraticCurveTo(0, -58, 42, -14);
      ctx.quadraticCurveTo(18, 0, -34, -14);
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 1.5;
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(i * 15, -14); ctx.stroke(); }
      ctx.strokeStyle = '#2f1b12'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(4, -13); ctx.lineTo(4 + p.tilt * 15, 38); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = '800 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText(lanes[p.lane].label, 0, 56);
      ctx.restore();
    });
  }

  function drawGuests() {
    const sorted = [...state.guests].sort((a, b) => a.lane - b.lane || a.t - b.t);
    sorted.forEach((g) => {
      const p = pathPoint(g.lane, g.t);
      const sheltered = state.parasols.some((par) => isSheltered(g, par));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath(); ctx.ellipse(0, 18, 22, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = sheltered ? '#f8fbff' : '#dbe5ec';
      ctx.strokeStyle = g.color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -16, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = g.color;
      ctx.beginPath(); ctx.roundRect(-13, -2, 26, 34, 10); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-15, 36); ctx.lineTo(15, 36); ctx.stroke();
      // dryness meter
      ctx.fillStyle = 'rgba(4,17,28,0.75)'; ctx.fillRect(-20, -40, 40, 5);
      ctx.fillStyle = g.dry > 70 ? '#9af6ad' : g.dry > 35 ? '#ffd06a' : '#ff7e73'; ctx.fillRect(-20, -40, 40 * Math.max(0, g.dry) / 100, 5);
      ctx.restore();
    });
  }

  function drawParticles() {
    state.particles.forEach((p) => {
      ctx.save();
      const a = Math.max(0, Math.min(1, p.life));
      if (p.text) {
        ctx.globalAlpha = Math.min(1, p.life);
        ctx.fillStyle = p.color || '#fff';
        ctx.font = '900 18px system-ui';
        ctx.textAlign = 'center';
        ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(2,8,14,0.8)'; ctx.strokeText(p.text, p.x, p.y); ctx.fillText(p.text, p.x, p.y);
      } else if (p.rain) {
        ctx.globalAlpha = a;
        ctx.strokeStyle = p.color || '#75e4ff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 8, p.y + 35); ctx.stroke();
      }
      ctx.restore();
    });
    if (state.thunderActive > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(0.7, state.thunderActive / 3);
      ctx.fillStyle = 'rgba(255,208,106,0.18)';
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.fillStyle = '#ffd06a'; ctx.font = '950 28px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Thunder Drum — reflections open, rain slows', canvas.clientWidth / 2, canvas.clientHeight * 0.16);
      ctx.restore();
    }
  }

  function drawAttract(w, h) {
    ctx.save();
    ctx.fillStyle = 'rgba(3,12,22,0.34)'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f7fbff'; ctx.font = '900 28px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Tap Start to conduct the rain procession', w / 2, h * 0.48);
    ctx.restore();
  }

  function selectedParasol() { return state.parasols[state.selected]; }

  function moveSelected(deltaLane, deltaSlot) {
    const p = selectedParasol(); if (!p || state.mode !== 'playing') return;
    p.lane = Math.max(0, Math.min(2, p.lane + deltaLane));
    p.slot = Math.max(0.08, Math.min(0.92, p.slot + deltaSlot));
    const a = legalAnchor(p.lane, p.slot); p.x = a.x; p.y = a.y;
    updateTray(); updateHelper();
  }
  function tiltSelected(dir) { const p = selectedParasol(); if (!p || state.mode !== 'playing') return; p.tilt = Math.max(-1, Math.min(1, p.tilt + dir)); updateHelper(); }
  function toggleWide() { const p = selectedParasol(); if (!p || state.mode !== 'playing') return; p.wide = !p.wide; el.wide.textContent = p.wide ? 'Narrow' : 'Wide'; updateHelper(); }
  function useThunder() {
    if (state.mode !== 'playing' || state.thunder < 100) return;
    state.thunder = 0; state.thunderActive = 4.0;
    state.puddles.forEach((p) => { p.open = Math.max(p.open, 3.5); });
    state.score += 80;
    state.particles.push({ x: canvas.clientWidth / 2, y: canvas.clientHeight * 0.30, text: 'Thunder Drum!', life: 1.8, color: '#ffd06a' });
  }

  function openPuddleAt(x, y) {
    const p = state.puddles.find((pud) => Math.hypot(pud.x - x, pud.y - y) < pud.radius * 1.7 && Math.sin(pud.pulse * 2.4) > -0.15);
    if (!p) return false;
    p.open = 3.4;
    state.reflectionsOpened += 1;
    state.score += 90 * state.combo;
    state.thunder = Math.min(100, state.thunder + 8);
    state.particles.push({ x: p.x, y: p.y - 12, text: '+ reflection', life: 1.1, color: '#75e4ff' });
    return true;
  }

  function canvasPos(evt) {
    const rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  }
  canvas.addEventListener('pointerdown', (evt) => {
    if (state.mode !== 'playing') return;
    const pos = canvasPos(evt);
    if (openPuddleAt(pos.x, pos.y)) return;
    let hit = -1;
    state.parasols.forEach((p, i) => { if (Math.hypot(pos.x - p.x, pos.y - p.y) < 70) hit = i; });
    if (hit >= 0) {
      state.selected = hit; state.dragging = true; state.pointerId = evt.pointerId; canvas.setPointerCapture(evt.pointerId); updateTray(); updateHelper();
    }
  });
  canvas.addEventListener('pointermove', (evt) => {
    if (!state.dragging || state.pointerId !== evt.pointerId) return;
    const p = selectedParasol(); if (!p) return;
    const pos = canvasPos(evt);
    let best = { lane: p.lane, slot: p.slot, d: Infinity };
    for (let lane = 0; lane < 3; lane++) {
      for (let i = 0; i <= 18; i++) {
        const slot = 0.08 + i * (0.84 / 18);
        const a = legalAnchor(lane, slot);
        const d = Math.hypot(a.x - pos.x, a.y - pos.y);
        if (d < best.d) best = { lane, slot, d };
      }
    }
    p.lane = best.lane; p.slot = best.slot; const a = legalAnchor(p.lane, p.slot); p.x = a.x; p.y = a.y;
    updateTray(); updateHelper();
  });
  canvas.addEventListener('pointerup', (evt) => { if (state.pointerId === evt.pointerId) { state.dragging = false; state.pointerId = null; } });
  canvas.addEventListener('pointercancel', () => { state.dragging = false; state.pointerId = null; });

  el.startBtn.addEventListener('click', () => { state.chapter = 0; resetRun(); });
  el.resumeBtn.addEventListener('click', () => { state.mode = 'playing'; hideOverlay(); });
  el.overlayRestartBtn.addEventListener('click', () => { state.chapter = 0; resetRun(); });
  el.restartBtn.addEventListener('click', () => { state.chapter = 0; resetRun(); });
  el.pauseBtn.addEventListener('click', () => { if (state.mode === 'playing') { state.mode = 'paused'; showOverlay('pause'); } });
  el.prevLane.addEventListener('click', () => moveSelected(-1, 0));
  el.nextLane.addEventListener('click', () => moveSelected(1, 0));
  el.tiltLeft.addEventListener('click', () => tiltSelected(-1));
  el.tiltRight.addEventListener('click', () => tiltSelected(1));
  el.wide.addEventListener('click', toggleWide);
  el.thunder.addEventListener('click', useThunder);

  window.addEventListener('keydown', (evt) => {
    if (evt.target && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(evt.target.tagName)) return;
    const k = evt.key.toLowerCase();
    if (k === 'p') { if (state.mode === 'playing') { state.mode = 'paused'; showOverlay('pause'); } else if (state.mode === 'paused') { state.mode = 'playing'; hideOverlay(); } }
    if (k === 'r') { state.chapter = 0; resetRun(); }
    if (state.mode !== 'playing') { if (k === 'enter' || k === ' ') { state.chapter = 0; resetRun(); } return; }
    if (k === 'arrowleft' || k === 'a') moveSelected(-1, 0);
    if (k === 'arrowright' || k === 'd') moveSelected(1, 0);
    if (k === 'arrowup' || k === 'w') moveSelected(0, -0.07);
    if (k === 'arrowdown' || k === 's') moveSelected(0, 0.07);
    if (k === 'q') tiltSelected(-1);
    if (k === 'e') tiltSelected(1);
    if (k === 'z' || k === 'x') toggleWide();
    if (k === ' ' || k === 'enter') useThunder();
  });

  function loop(ts) {
    const dt = Math.min(0.05, (ts - state.lastTs) / 1000 || 0.016);
    state.lastTs = ts;
    update(dt);
    updateHUD();
    draw();
    requestAnimationFrame(loop);
  }

  updateChapterUI();
  showOverlay('menu');
  updateHUD();
  requestAnimationFrame(loop);
})();
