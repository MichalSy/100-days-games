(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const canvas = $('game');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = './assets/kiri-studio.png';
  const bestKey = 'day014-kiri-best';
  const timeKey = 'day014-kiri-best-time';

  const chapters = [
    { title: 'First Crease', text: 'Make one valley path, collect one seal, and reach the gate with stress under 35%.', need: { valley: 1, mountain: 0, seals: 1, stress: 35 }, time: 72 },
    { title: 'Cedar Bridge', text: 'Build one mountain bridge and one valley trough, reveal two seals, and keep stress under 55%.', need: { valley: 1, mountain: 1, seals: 2, stress: 55 }, time: 82 },
    { title: 'Dawn Crane Flight', text: 'Chain two valleys, one mountain bridge, collect three seals, and keep stress under 70%.', need: { valley: 2, mountain: 1, seals: 3, stress: 70 }, time: 96 }
  ];

  const els = {
    score: $('score'), best: $('best'), feathers: $('feathers'), stress: $('stress'), combo: $('combo'), time: $('time'),
    title: $('chapterTitle'), objective: $('objectiveText'), chips: $('goalChips'), helper: $('helper'),
    menu: $('menu'), pause: $('pauseOverlay'), results: $('resultsOverlay'), resultKicker: $('resultKicker'), resultTitle: $('resultTitle'), resultText: $('resultText'), badges: $('badges')
  };

  let W = canvas.width, H = canvas.height, dpr = 1;
  let state;

  function newCreases(chapterIndex) {
    const base = [
      { id: 0, a: [.18, .28], b: [.82, .28], angle: 0, fold: 'flat', stress: 0 },
      { id: 1, a: [.22, .50], b: [.78, .50], angle: 0, fold: 'flat', stress: 0 },
      { id: 2, a: [.18, .72], b: [.82, .72], angle: 0, fold: 'flat', stress: 0 },
      { id: 3, a: [.28, .18], b: [.72, .82], angle: 48, fold: 'flat', stress: 0 },
      { id: 4, a: [.72, .18], b: [.28, .82], angle: -48, fold: 'flat', stress: 0 }
    ];
    if (chapterIndex > 0) base.push({ id: 5, a: [.14, .42], b: [.42, .16], angle: -42, fold: 'flat', stress: 0 });
    if (chapterIndex > 1) base.push({ id: 6, a: [.58, .84], b: [.86, .56], angle: -42, fold: 'flat', stress: 0 });
    return base;
  }

  function reset(all = true) {
    const best = Number(localStorage.getItem(bestKey) || 0);
    state = {
      running: false, paused: false, gameOver: false, blessed: false,
      score: 0, best, feathers: 3, stress: 0, combo: 1, start: performance.now(), elapsed: 0,
      chapter: 0, selected: 1, creases: newCreases(0), launched: false, launchT: 0, route: [], routeIndex: 0,
      collected: new Set(), seals: [], gate: null, crane: { x: 0, y: 0 }, fog: { x: .52, y: .46, r: .09, phase: 0 },
      reinforce: 55, perfect: 0, totalSeals: 0
    };
    setupChapter(0);
    els.results.classList.remove('active');
    els.pause.classList.remove('active');
    if (all) els.menu.classList.add('active');
    updateUI();
  }

  function setupChapter(index) {
    state.chapter = index;
    state.creases = newCreases(index);
    state.selected = Math.min(1 + index, state.creases.length - 1);
    state.collected = new Set();
    const patterns = [
      [[.32,.38],[.67,.52],[.55,.70]],
      [[.26,.30],[.62,.36],[.74,.66],[.38,.70]],
      [[.22,.50],[.44,.28],[.70,.38],[.64,.74],[.35,.68]]
    ];
    state.seals = patterns[index].map((p, i) => ({ id: i, x: p[0], y: p[1], pulse: i * 0.7 }));
    state.gate = [{x:.83,y:.50},{x:.76,y:.25},{x:.77,y:.73}][index];
    state.crane = { x: .16, y: .50 };
    state.launched = false;
    state.route = computeRoute();
    updateCommission();
  }

  function updateCommission() {
    const ch = chapters[state.chapter];
    els.title.textContent = ch.title;
    els.objective.textContent = ch.text;
    els.chips.innerHTML = [
      `${ch.need.valley} valley`, `${ch.need.mountain} mountain`, `${ch.need.seals} seals`, `stress < ${ch.need.stress}%`
    ].map(t => `<span>${t}</span>`).join('');
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(320, Math.round(rect.width));
    H = Math.max(320, Math.round(rect.height));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const px = (p) => ({ x: p.x * W, y: p.y * H });
  const creasePoint = (c, end) => ({ x: c[end][0] * W, y: c[end][1] * H });
  function distToSeg(x, y, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
    const px = ax + t * dx, py = ay + t * dy;
    return Math.hypot(x - px, y - py);
  }
  function nearestCrease(x, y) {
    let best = { d: 9999, i: state.selected };
    state.creases.forEach((c, i) => {
      const a = creasePoint(c, 'a'), b = creasePoint(c, 'b');
      const d = distToSeg(x, y, a.x, a.y, b.x, b.y);
      if (d < best.d) best = { d, i };
    });
    return best.d < 52 ? best.i : state.selected;
  }

  function applyFold(kind) {
    if (!state.running || state.paused || state.launched) return;
    const c = state.creases[state.selected];
    if (kind === 'unfold') {
      if (c.fold !== 'flat') {
        c.fold = 'flat'; c.stress += 5; state.stress += 4; state.score += 18;
      }
    } else {
      const changed = c.fold !== kind;
      c.fold = kind;
      c.stress += changed ? 10 : 6;
      state.stress += changed ? 7 : 4;
      state.score += (kind === 'mountain' ? 65 : 60) * state.combo;
      state.combo = Math.min(9, state.combo + 1);
    }
    if (c.stress > 34) state.stress += 3;
    state.stress = Math.min(100, Math.max(0, state.stress));
    state.route = computeRoute();
    els.helper.textContent = `${label(c)} selected · ${c.fold === 'flat' ? 'flat paper' : c.fold + ' fold'} · route preview updated.`;
    if (state.stress >= 100) endGame(false, 'The washi tore under too much stress.');
    updateUI();
  }

  function reinforce() {
    if (!state.running || state.paused || state.launched || state.reinforce < 30) return;
    const c = state.creases[state.selected];
    c.stress = Math.max(0, c.stress - 24);
    state.stress = Math.max(0, state.stress - 16);
    state.reinforce -= 30;
    state.combo = Math.max(1, state.combo - 1);
    state.score += 35;
    els.helper.textContent = `Rice-paper tab reinforced ${label(c)}. Safer, but combo softened.`;
    updateUI();
  }

  function computeRoute() {
    const pts = [{ x: .16, y: .50 }];
    const active = state.creases.filter(c => c.fold !== 'flat').sort((a,b) => Math.abs(.5 - a.a[0]) - Math.abs(.5 - b.a[0]));
    if (!active.length) { pts.push({ x: .36, y: .57 }, { x: .55, y: .45 }); }
    active.slice(0, 5).forEach((c, i) => {
      const mid = { x: (c.a[0] + c.b[0]) / 2, y: (c.a[1] + c.b[1]) / 2 };
      const lift = c.fold === 'mountain' ? -0.075 : 0.075;
      pts.push({ x: mid.x, y: Math.max(.16, Math.min(.84, mid.y + lift + (i % 2 ? .025 : -.025))) });
    });
    pts.push({ x: state.gate.x, y: state.gate.y });
    return pts;
  }

  function launch() {
    if (!state.running || state.paused || state.launched) return;
    state.route = computeRoute();
    state.launched = true;
    state.launchT = 0;
    state.routeIndex = 0;
    els.helper.textContent = 'Crane launched — follow the dotted fold route to the ceremony gate.';
  }

  function countFolds() {
    return state.creases.reduce((acc, c) => { if (c.fold === 'mountain') acc.mountain++; if (c.fold === 'valley') acc.valley++; return acc; }, { mountain: 0, valley: 0 });
  }

  function checkSealCollection() {
    const cp = state.crane;
    for (const s of state.seals) {
      if (state.collected.has(s.id)) continue;
      const d = Math.hypot(cp.x - s.x, cp.y - s.y);
      if (d < .07) {
        state.collected.add(s.id);
        state.totalSeals++;
        state.score += 120 * state.combo;
        state.combo = Math.min(9, state.combo + 1);
      }
    }
  }

  function completeChapter() {
    const need = chapters[state.chapter].need;
    const folds = countFolds();
    const ok = folds.valley >= need.valley && folds.mountain >= need.mountain && state.collected.size >= need.seals && state.stress <= need.stress;
    if (!ok) {
      state.feathers--;
      state.combo = 1;
      state.stress = Math.min(100, state.stress + 12);
      els.helper.textContent = 'The crane reached the gate, but the commission is incomplete. Adjust folds and launch again.';
      state.launched = false;
      state.crane = { x: .16, y: .50 };
      if (state.feathers <= 0) endGame(false, 'All crane feathers broke before the dawn ceremony.');
      return;
    }
    state.score += 480 + (chapters[state.chapter].time - Math.min(chapters[state.chapter].time, state.elapsed)) * 4;
    state.reinforce = Math.min(100, state.reinforce + 22);
    state.perfect += state.stress <= need.stress * .7 ? 1 : 0;
    if (state.chapter >= 2) {
      state.blessed = true;
      endGame(true, 'Kiri Thousand-Fold Blessing blooms across the studio. Endless folding commissions are unlocked.');
    } else {
      setupChapter(state.chapter + 1);
      els.helper.textContent = 'Vermilion seal stamped. A harder folding commission opens.';
    }
  }

  function update(dt) {
    if (!state.running || state.paused || state.gameOver) return;
    state.elapsed = (performance.now() - state.start) / 1000;
    const chTime = chapters[state.chapter].time;
    if (state.elapsed > chTime + state.chapter * 28) {
      state.stress = Math.min(100, state.stress + dt * 2.2);
    }
    state.fog.phase += dt;
    state.fog.x = .50 + Math.sin(state.fog.phase * .45 + state.chapter) * (.05 + state.chapter * .015);
    if (state.launched) {
      state.launchT += dt * .55;
      const pts = state.route;
      const seg = Math.min(pts.length - 2, Math.floor(state.launchT * (pts.length - 1)));
      const local = (state.launchT * (pts.length - 1)) - seg;
      const a = pts[seg], b = pts[seg + 1];
      if (a && b) {
        state.crane.x = a.x + (b.x - a.x) * local;
        state.crane.y = a.y + (b.y - a.y) * local;
      }
      checkSealCollection();
      if (Math.hypot(state.crane.x - state.fog.x, state.crane.y - state.fog.y) < state.fog.r * .65) {
        state.feathers--; state.stress += 10; state.launched = false; state.crane = { x: .16, y: .50 }; state.combo = 1;
        els.helper.textContent = 'Fog gap swallowed the crane path. Refold around the mist.';
        if (state.feathers <= 0) endGame(false, 'The crane lost its last feather in the fog.');
      }
      if (state.launchT >= 1) completeChapter();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (img.complete) ctx.drawImage(img, 0, -H * .16, W, H * 1.34);
    ctx.fillStyle = 'rgba(6,25,20,.48)'; ctx.fillRect(0, 0, W, H);
    drawMat(); drawPaper(); drawCreases(); drawRoute(); drawSeals(); drawGate(); drawCrane();
  }

  function drawMat() {
    ctx.save();
    ctx.translate(W*.50, H*.54);
    const w = W*.72, h = H*.72;
    roundRect(-w/2, -h/2, w, h, 28, 'rgba(27,77,65,.86)', 'rgba(246,240,222,.24)');
    ctx.strokeStyle = 'rgba(225,236,207,.10)'; ctx.lineWidth = 1;
    for (let x=-w/2; x<=w/2; x+=Math.max(28, w/16)) { ctx.beginPath(); ctx.moveTo(x,-h/2); ctx.lineTo(x,h/2); ctx.stroke(); }
    for (let y=-h/2; y<=h/2; y+=Math.max(28, h/12)) { ctx.beginPath(); ctx.moveTo(-w/2,y); ctx.lineTo(w/2,y); ctx.stroke(); }
    ctx.restore();
  }

  function drawPaper() {
    ctx.save(); ctx.translate(W*.5, H*.54);
    const w = W*.58, h = H*.55;
    ctx.beginPath(); ctx.moveTo(-w/2+34,-h/2); ctx.lineTo(w/2,-h/2+18); ctx.lineTo(w/2-24,h/2); ctx.lineTo(-w/2,h/2-20); ctx.closePath();
    ctx.fillStyle = 'rgba(248,241,223,.88)'; ctx.fill(); ctx.strokeStyle = 'rgba(99,74,45,.32)'; ctx.lineWidth = 2; ctx.stroke();
    for (const c of state.creases) {
      if (c.fold === 'flat') continue;
      const a = { x: (c.a[0]-.5)*W, y: (c.a[1]-.54)*H }, b = { x: (c.b[0]-.5)*W, y: (c.b[1]-.54)*H };
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(b.x + (c.fold==='mountain'? 26:-18), b.y + (c.fold==='mountain'? -28:28)); ctx.lineTo(a.x + (c.fold==='mountain'? 26:-18), a.y + (c.fold==='mountain'? -28:28)); ctx.closePath();
      ctx.fillStyle = c.fold === 'mountain' ? 'rgba(255,255,255,.42)' : 'rgba(118,172,153,.33)'; ctx.fill();
    }
    ctx.restore();
  }

  function drawCreases() {
    state.creases.forEach((c, i) => {
      const a = creasePoint(c,'a'), b = creasePoint(c,'b');
      ctx.save(); ctx.lineCap = 'round';
      ctx.shadowBlur = i === state.selected ? 18 : 5; ctx.shadowColor = i === state.selected ? '#f2c46d' : '#78d4ae';
      ctx.strokeStyle = i === state.selected ? '#f2c46d' : c.fold === 'mountain' ? '#f6f0df' : c.fold === 'valley' ? '#78d4ae' : 'rgba(246,240,222,.58)';
      ctx.setLineDash(c.fold === 'flat' ? [12, 11] : []); ctx.lineWidth = i === state.selected ? 8 : 5;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.setLineDash([]);
      const mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
      ctx.fillStyle = c.fold === 'mountain' ? '#c95d4d' : c.fold === 'valley' ? '#78d4ae' : '#f8f1df';
      ctx.beginPath(); ctx.arc(mx, my, i===state.selected?13:9, 0, Math.PI*2); ctx.fill();
      if (c.stress > 22) { ctx.strokeStyle = '#ff8a73'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx-10,my-12); ctx.lineTo(mx+4,my+4); ctx.lineTo(mx-5,my+18); ctx.stroke(); }
      ctx.restore();
    });
  }

  function drawRoute() {
    const pts = state.route || [];
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.74)'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.setLineDash([6, 12]);
    ctx.beginPath(); pts.forEach((p, i) => { const q = px(p); i ? ctx.lineTo(q.x,q.y) : ctx.moveTo(q.x,q.y); }); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    // fog gap
    const f = px(state.fog); const rg = ctx.createRadialGradient(f.x, f.y, 5, f.x, f.y, state.fog.r*W);
    rg.addColorStop(0, 'rgba(220,237,232,.62)'); rg.addColorStop(1, 'rgba(220,237,232,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(f.x, f.y, state.fog.r*W, 0, Math.PI*2); ctx.fill();
  }
  function drawSeals() {
    state.seals.forEach(s => { const p = px(s); const got = state.collected.has(s.id); ctx.save(); ctx.globalAlpha = got ? .34 : 1; ctx.fillStyle = '#c95d4d'; ctx.beginPath(); ctx.arc(p.x, p.y, 16 + Math.sin(performance.now()/400+s.pulse)*2, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#f8f1df'; ctx.font = '800 16px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('印', p.x, p.y+1); ctx.restore(); });
  }
  function drawGate() { const p = px(state.gate); ctx.save(); ctx.translate(p.x,p.y); ctx.fillStyle = '#c95d4d'; ctx.fillRect(-24,-22,48,9); ctx.fillRect(-18,-12,8,34); ctx.fillRect(10,-12,8,34); ctx.fillStyle = '#f2c46d'; ctx.beginPath(); ctx.arc(0,26,12,0,Math.PI*2); ctx.fill(); ctx.restore(); }
  function drawCrane() { const p = px(state.crane); ctx.save(); ctx.translate(p.x,p.y); const bob = Math.sin(performance.now()/150)*2; ctx.translate(0,bob); ctx.fillStyle='#f8f1df'; ctx.strokeStyle='#304139'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-22,8); ctx.lineTo(0,-8); ctx.lineTo(28,3); ctx.lineTo(8,8); ctx.lineTo(3,23); ctx.lineTo(-5,8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(12,-4); ctx.lineTo(28,-24); ctx.lineTo(23,1); ctx.fill(); ctx.stroke(); ctx.fillStyle='#c95d4d'; ctx.beginPath(); ctx.arc(29,-24,4,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  function roundRect(x,y,w,h,r,fill,stroke) { ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fillStyle=fill; ctx.fill(); if (stroke) { ctx.strokeStyle=stroke; ctx.stroke(); } }
  function label(c) { return `Crease ${c.id + 1}`; }

  function updateUI() {
    els.score.textContent = Math.floor(state.score).toString();
    els.best.textContent = Math.max(state.best, Math.floor(state.score)).toString();
    els.feathers.textContent = `${state.feathers}/3`;
    els.stress.textContent = `${Math.round(state.stress)}%`;
    els.combo.textContent = `x${state.combo}`;
    const t = Math.floor(state.elapsed); els.time.textContent = `${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`;
    $('reinforceBtn').textContent = `Reinforce ${Math.round(state.reinforce)}%`;
    $('mountainBtn').disabled = $('valleyBtn').disabled = $('unfoldBtn').disabled = $('launchBtn').disabled = !state.running || state.paused || state.launched;
    $('reinforceBtn').disabled = !state.running || state.paused || state.launched || state.reinforce < 30;
  }

  function start() { state.running = true; state.paused = false; state.gameOver = false; state.start = performance.now(); els.menu.classList.remove('active'); updateUI(); }
  function togglePause(force) { if (!state.running || state.gameOver) return; state.paused = typeof force === 'boolean' ? force : !state.paused; els.pause.classList.toggle('active', state.paused); updateUI(); }
  function endGame(win, text) {
    state.gameOver = true; state.running = false;
    const final = Math.floor(state.score); const oldBest = Number(localStorage.getItem(bestKey) || 0);
    if (final > oldBest) localStorage.setItem(bestKey, String(final));
    if (win) {
      const prev = Number(localStorage.getItem(timeKey) || 9999); if (state.elapsed < prev) localStorage.setItem(timeKey, String(Math.round(state.elapsed)));
    }
    els.resultKicker.textContent = win ? 'Kiri Thousand-Fold Blessing' : 'Run ended';
    els.resultTitle.textContent = win ? 'The cedar fog clears.' : 'The paper rests.';
    els.resultText.textContent = `${text} Final score ${final}. Seals collected ${state.totalSeals}. Perfect fold streak ${state.perfect}.`;
    const badges = [];
    if (win) badges.push('Blessing'); if (state.perfect) badges.push('Perfect folds'); if (state.totalSeals >= 6) badges.push('Seal chain'); if (state.stress < 45) badges.push('Gentle hands');
    els.badges.innerHTML = badges.map(b => `<span>${b}</span>`).join('') || '<span>Practice fold</span>';
    els.results.classList.add('active'); updateUI();
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (!state.running || state.paused) return;
    const r = canvas.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
    state.selected = nearestCrease(x, y); const c = state.creases[state.selected];
    els.helper.textContent = `${label(c)} selected · ${c.fold}. Mountain raises a bridge; Valley opens a trough.`;
    state.route = computeRoute(); updateUI();
  });
  $('mountainBtn').onclick = () => applyFold('mountain'); $('valleyBtn').onclick = () => applyFold('valley'); $('unfoldBtn').onclick = () => applyFold('unfold'); $('reinforceBtn').onclick = reinforce; $('launchBtn').onclick = launch;
  $('startBtn').onclick = start; $('pauseBtn').onclick = () => togglePause(); $('resumeBtn').onclick = () => togglePause(false); $('restartBtn').onclick = () => { reset(false); start(); }; $('restartPauseBtn').onclick = () => { reset(false); start(); }; $('restartResultsBtn').onclick = () => { reset(false); start(); };
  window.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') applyFold('mountain');
    if (e.key === 'v' || e.key === 'V') applyFold('valley');
    if (e.key === 'u' || e.key === 'U' || e.key === 'Backspace') applyFold('unfold');
    if (e.key === 'f' || e.key === 'F') reinforce();
    if (e.key === ' ' || e.key === 'Enter') { if (!state.running) start(); else launch(); e.preventDefault(); }
    if (e.key === 'p' || e.key === 'P') togglePause();
    if (e.key === 'r' || e.key === 'R') { reset(false); start(); }
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s','A','D','W','S'].includes(e.key)) {
      const delta = (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') ? -1 : 1;
      state.selected = (state.selected + delta + state.creases.length) % state.creases.length; updateUI(); e.preventDefault();
    }
  });
  window.addEventListener('resize', resize);

  let last = performance.now();
  function loop(now) { resize(); const dt = Math.min(.05, (now-last)/1000); last = now; update(dt); draw(); updateUI(); requestAnimationFrame(loop); }
  reset(true); resize(); requestAnimationFrame(loop);
})();
