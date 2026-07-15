const canvas = document.querySelector('#fanCanvas');
const ctx = canvas.getContext('2d');

const $ = (id) => document.getElementById(id);
const els = {
  score: $('score'), bestScore: $('bestScore'), hearts: $('hearts'), bleed: $('bleed'), combo: $('combo'), elapsed: $('elapsed'),
  commissionName: $('commissionName'), commissionText: $('commissionText'), goalTicks: $('goalTicks'), statusHelper: $('statusHelper'),
  activeReadout: $('activeReadout'), pigmentReadout: $('pigmentReadout'), stencilReadout: $('stencilReadout'), dryGapReadout: $('dryGapReadout'), satReadout: $('satReadout'), focusReadout: $('focusReadout'),
  menuOverlay: $('menuOverlay'), pauseOverlay: $('pauseOverlay'), resultOverlay: $('resultOverlay'), resultText: $('resultText'), grandBanner: $('grandBanner'), focusRibbon: $('focusRibbon'),
  audioToggle: $('audioToggle'), menuMute: $('menuMute'), pauseMute: $('pauseMute'), menuBest: $('menuBest'), menuGrand: $('menuGrand')
};

const STORAGE = 'day033-uchiwa-fan-dye-maestro';
const best = JSON.parse(localStorage.getItem(STORAGE) || '{"score":0,"grand":"—","badges":[]}');

const pigments = {
  indigo: { name: 'indigo', color: '#173f78', light: '#6f91c7', key: 'I' },
  coral: { name: 'coral', color: '#e86b5d', light: '#f5aaa0', key: 'C' },
  saffron: { name: 'saffron', color: '#e6a82a', light: '#f5d37d', key: 'S' }
};
const pigmentOrder = ['indigo', 'coral', 'saffron'];
const stencils = ['wave', 'goldfish', 'lantern', 'firefly'];
const commissions = [
  {
    name: 'First Indigo Breeze',
    text: 'Dye 3 indigo wave sectors, preserve 4 white breeze gaps, and keep bleed under 35%.',
    targets: { indigo: 3, coral: 0, saffron: 0, preserved: 4, blot: 1, dry: 2, fold: 1 },
    protected: [2, 5, 8, 11],
    motifs: ['wave'],
    limit: 35,
    sectors: 12
  },
  {
    name: 'Goldfish Festival Arc',
    text: 'Align goldfish and lantern stencils, use coral/saffron arcs, preserve white gaps, and blot cleanly.',
    targets: { indigo: 2, coral: 3, saffron: 2, preserved: 5, blot: 2, dry: 3, fold: 2 },
    protected: [1, 4, 7, 10, 12],
    motifs: ['goldfish', 'lantern'],
    limit: 42,
    sectors: 14
  },
  {
    name: 'Night-Market Firefly Fan',
    text: 'Layer indigo night, firefly saffron dots, coral lanterns, and trigger Kaze-Dry Focus for clean symmetry.',
    targets: { indigo: 4, coral: 3, saffron: 3, preserved: 6, blot: 2, dry: 4, fold: 2, focus: 1 },
    protected: [0, 3, 6, 9, 12, 14],
    motifs: ['firefly', 'wave', 'lantern'],
    limit: 48,
    sectors: 16
  }
];

let audio = { ctx: null, enabled: true };
window.__day033Audio = { ctx: null, enabled: false };
function initAudio() {
  if (!audio.enabled) return;
  try {
    audio.ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.ctx.state === 'suspended') audio.ctx.resume();
    window.__day033Audio = { ctx: audio.ctx, enabled: true };
  } catch {
    audio.enabled = false;
    window.__day033Audio = { ctx: null, enabled: false };
  }
}
function tone(type = 'tap') {
  if (!audio.enabled || !audio.ctx) return;
  const t = audio.ctx.currentTime;
  const gain = audio.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(type === 'danger' ? 0.09 : 0.055, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + (type === 'grand' ? 0.75 : 0.22));
  gain.connect(audio.ctx.destination);
  const freqs = {
    tap: [520], brush: [245, 368], stencil: [620, 760], fold: [190, 390], blot: [150, 230], dry: [720, 980], focus: [440, 660, 880], danger: [120, 90], grand: [392, 523, 659, 784]
  }[type] || [440];
  freqs.forEach((f, i) => {
    const osc = audio.ctx.createOscillator();
    osc.type = type === 'dry' || type === 'focus' || type === 'grand' ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(f, t + i * 0.055);
    if (type === 'brush') osc.frequency.exponentialRampToValueAtTime(f * 0.72, t + 0.18);
    osc.connect(gain);
    osc.start(t + i * 0.045);
    osc.stop(t + (type === 'grand' ? 0.7 : 0.24) + i * 0.045);
  });
}
function setMuted(muted) {
  audio.enabled = !muted;
  if (!audio.enabled && audio.ctx) audio.ctx.suspend();
  if (audio.enabled && audio.ctx?.state === 'suspended') audio.ctx.resume();
  [els.audioToggle, els.menuMute, els.pauseMute].forEach((el) => { if (el) { el.textContent = `Audio: ${audio.enabled ? 'On' : 'Muted'}`; el.setAttribute('aria-pressed', String(!audio.enabled)); } });
}

const state = {
  running: false,
  paused: false,
  over: false,
  score: 0,
  hearts: 3,
  bleed: 0,
  combo: 1,
  elapsed: 0,
  chapter: 0,
  selected: 0,
  band: 1,
  pigment: 'indigo',
  stencil: 0,
  stencilOffset: 0,
  focus: 0,
  focusTime: 0,
  grand: false,
  longestClean: 0,
  cleanChain: 0,
  counts: { indigo: 0, coral: 0, saffron: 0, preserved: 0, blot: 0, dry: 0, fold: 0, focus: 0 },
  sectors: [],
  particles: [],
  last: performance.now(),
  warningCooldown: 0
};

function makeSectors(count) {
  return Array.from({ length: count }, (_, i) => ({
    color: null,
    saturation: 0,
    wet: 0,
    bleed: 0,
    dried: false,
    folded: false,
    stainedProtected: false,
    motif: stencils[(i * 3 + 1) % stencils.length],
    protected: false,
    scoredColors: new Set()
  }));
}
function setupCommission(index = state.chapter) {
  const c = commissions[Math.min(index, commissions.length - 1)];
  state.sectors = makeSectors(c.sectors);
  c.protected.forEach((p) => { state.sectors[p % c.sectors].protected = true; });
  state.selected = 0;
  state.band = 1;
  state.pigment = index === 0 ? 'indigo' : pigmentOrder[index % 3];
  state.stencil = stencils.indexOf(c.motifs[0] || 'wave');
  state.stencilOffset = 0;
  state.counts = { indigo: 0, coral: 0, saffron: 0, preserved: 0, blot: 0, dry: 0, fold: 0, focus: 0 };
  renderTicks();
}
function newRun() {
  initAudio();
  state.running = true;
  state.paused = false;
  state.over = false;
  state.score = 0;
  state.hearts = 3;
  state.bleed = 0;
  state.combo = 1;
  state.elapsed = 0;
  state.chapter = 0;
  state.focus = 0;
  state.focusTime = 0;
  state.grand = false;
  state.longestClean = 0;
  state.cleanChain = 0;
  state.particles = [];
  setupCommission(0);
  els.menuOverlay.classList.remove('show');
  els.pauseOverlay.classList.remove('show');
  els.resultOverlay.classList.remove('show');
  els.statusHelper.textContent = 'First move: rotate the wave stencil onto a safe sector, then Brush Pigment with indigo.';
  tone('tap');
  state.last = performance.now();
  updateUI();
  requestAnimationFrame(loop);
}

function currentCommission() { return commissions[Math.min(state.chapter, commissions.length - 1)]; }
function selectedSector() { return state.sectors[state.selected]; }
function stencilMotif() { return stencils[state.stencil]; }
function aligned(i = state.selected) {
  const c = currentCommission();
  const motifOk = c.motifs.includes(stencilMotif());
  const pattern = (i + state.stencilOffset + state.stencil) % 4;
  return motifOk && (pattern === 0 || pattern === 1);
}
function addScore(base, reason = '') {
  state.score += Math.round(base * state.combo);
  state.combo = Math.min(5, +(state.combo + 0.1).toFixed(1));
  state.cleanChain += 1;
  state.longestClean = Math.max(state.longestClean, state.cleanChain);
  state.focus = Math.min(100, state.focus + 8);
  if (reason) els.statusHelper.textContent = reason;
}
function penalty(amount, reason) {
  state.bleed = Math.min(100, state.bleed + amount);
  state.combo = 1;
  state.cleanChain = 0;
  els.statusHelper.textContent = reason;
  tone('danger');
  if (state.bleed >= 100 || amount >= 14) {
    state.hearts -= 1;
    state.bleed = Math.max(18, state.bleed - 34);
    if (state.hearts <= 0) finish(false, 'The washi tore from too much bleed and warp.');
  }
}
function burst(x, y, color, n = 12) {
  for (let i = 0; i < n; i++) state.particles.push({ x, y, vx: (Math.random() - 0.5) * 2.4, vy: (Math.random() - 0.5) * 2.4, life: 1, color });
}

function action(kind) {
  if (kind !== 'pause' && kind !== 'restart') initAudio();
  if (!state.running && kind !== 'restart') return;
  if (state.over && kind !== 'restart') return;
  const c = currentCommission();
  const s = selectedSector();
  switch (kind) {
    case 'sectorPrev': state.selected = (state.selected - 1 + state.sectors.length) % state.sectors.length; els.statusHelper.textContent = `Sector ${state.selected + 1}: ${s?.protected ? 'protected breeze gap nearby.' : 'ready for stencil check.'}`; tone('tap'); break;
    case 'sectorNext': state.selected = (state.selected + 1) % state.sectors.length; els.statusHelper.textContent = `Sector ${state.selected + 1}: align stencil before brushing.`; tone('tap'); break;
    case 'bandPrev': state.band = Math.max(0, state.band - 1); els.statusHelper.textContent = `Band ${state.band + 1}: inner bands bleed slower but score less saturation.`; tone('tap'); break;
    case 'bandNext': state.band = Math.min(2, state.band + 1); els.statusHelper.textContent = `Band ${state.band + 1}: outer bands score high but bleed faster.`; tone('tap'); break;
    case 'stencilPrev': state.stencil = (state.stencil - 1 + stencils.length) % stencils.length; state.stencilOffset = (state.stencilOffset + 1) % state.sectors.length; els.statusHelper.textContent = `Stencil ${stencilMotif()} rotated. ${aligned() ? 'This sector is safe to brush.' : 'Find a brighter aligned wedge.'}`; tone('stencil'); break;
    case 'stencilNext': state.stencil = (state.stencil + 1) % stencils.length; state.stencilOffset = (state.stencilOffset + 1) % state.sectors.length; els.statusHelper.textContent = `Stencil ${stencilMotif()} rotated. ${aligned() ? 'This sector is safe to brush.' : 'Mask does not fit here yet.'}`; tone('stencil'); break;
    case 'brush': brush(); break;
    case 'fold': fold(); break;
    case 'blot': blot(); break;
    case 'dry': dry(); break;
    case 'focus': focus(); break;
    case 'pause': togglePause(); break;
    case 'restart': newRun(); break;
  }
  updateUI();
}
function setPigment(p) {
  initAudio();
  state.pigment = p;
  document.querySelectorAll('.pigment').forEach((b) => b.classList.toggle('active', b.dataset.pigment === p));
  els.statusHelper.textContent = `${p[0].toUpperCase() + p.slice(1)} pigment selected. Brush only where the stencil glows.`;
  tone('tap');
  updateUI();
}
function brush() {
  const s = selectedSector();
  const safe = aligned();
  const protectedRisk = s.protected && !s.folded;
  s.color = state.pigment;
  s.saturation = Math.min(100, s.saturation + (state.band === 2 ? 42 : state.band === 1 ? 35 : 28));
  s.wet = Math.min(100, s.wet + (state.band === 2 ? 56 : 44));
  s.dried = false;
  const pos = sectorPoint(state.selected, 0.63);
  burst(pos.x, pos.y, pigments[state.pigment].color, 18);
  if (safe && !protectedRisk) {
    if (!s.scoredColors.has(state.pigment)) {
      state.counts[state.pigment] += 1;
      s.scoredColors.add(state.pigment);
    }
    addScore(125, `Clean ${state.pigment} brush in sector ${state.selected + 1}. Preserve dry gaps before pigment spreads.`);
    tone('brush');
  } else {
    s.bleed += protectedRisk ? 22 : 12;
    if (protectedRisk) s.stainedProtected = true;
    penalty(protectedRisk ? 14 : 8, protectedRisk ? 'Protected white gap stained — fold or rotate before brushing.' : 'Stencil mismatch raised bleed. Rotate the mask before brushing.');
  }
  checkCommission();
}
function fold() {
  const s = selectedSector();
  if (s.folded) { els.statusHelper.textContent = 'This edge is already folded; move to a wet neighbor.'; return; }
  s.folded = true;
  s.bleed = Math.max(0, s.bleed - 12);
  state.counts.fold += 1;
  addScore(160, `Fold Edge redirected capillary flow around sector ${state.selected + 1}.`);
  burst(...Object.values(sectorPoint(state.selected, 0.82)), '#c99b2e', 10);
  tone('fold');
  checkCommission();
}
function blot() {
  const s = selectedSector();
  if (s.wet < 18 && s.bleed < 8) {
    s.saturation = Math.max(0, s.saturation - 10);
    penalty(4, 'Over-blotting lifted pigment before it needed rescue.');
    return;
  }
  s.wet = Math.max(0, s.wet - 32);
  s.bleed = Math.max(0, s.bleed - 22);
  state.bleed = Math.max(0, state.bleed - 7);
  state.counts.blot += 1;
  addScore(145, 'Blot Cloth caught the bleed in the sweet window.');
  tone('blot');
  checkCommission();
}
function dry() {
  const s = selectedSector();
  if (s.wet > 65 && !s.folded) {
    s.bleed += 12;
    penalty(8, 'Fan Dry pushed wet pigment downwind. Blot or fold before drying soaked paper.');
    return;
  }
  s.wet = Math.max(0, s.wet - 48);
  s.dried = true;
  state.counts.dry += 1;
  addScore(135, 'Fan Dry locked a crisp edge and brightened the washi grain.');
  tone('dry');
  checkCommission();
}
function focus() {
  if (state.focus < 35 && state.focusTime <= 0) {
    els.statusHelper.textContent = 'Practice preview: hold clean sectors to charge full Kaze-Dry Focus.';
    state.focusTime = 2.2;
  } else {
    state.focus = Math.max(0, state.focus - 55);
    state.focusTime = 6.5;
    state.counts.focus += 1;
    addScore(95, 'Kaze-Dry Focus previews bleed arrows and stencil-safe zones.');
  }
  els.focusRibbon.classList.add('show');
  setTimeout(() => els.focusRibbon.classList.remove('show'), 1200);
  tone('focus');
  checkCommission();
}
function togglePause() {
  if (state.over) return;
  state.paused = !state.paused;
  els.pauseOverlay.classList.toggle('show', state.paused);
  if (!state.paused) { state.last = performance.now(); requestAnimationFrame(loop); }
  tone('tap');
}

function checkCommission() {
  const c = currentCommission();
  state.counts.preserved = state.sectors.filter((s) => s.protected && !s.stainedProtected).length;
  const colorDone = ['indigo', 'coral', 'saffron'].every((p) => state.counts[p] >= (c.targets[p] || 0));
  const toolsDone = ['preserved', 'blot', 'dry', 'fold', 'focus'].every((p) => state.counts[p] >= (c.targets[p] || 0));
  if (colorDone && toolsDone && state.bleed <= c.limit) advanceCommission();
}
function advanceCommission() {
  const finalChapter = state.chapter >= commissions.length - 1;
  addScore(860 + state.chapter * 140, `${currentCommission().name} sealed cleanly. A washi festival stamp glows.`);
  if (!finalChapter) {
    state.chapter += 1;
    state.hearts = Math.min(3, state.hearts + 1);
    setupCommission(state.chapter);
    tone('grand');
  } else if (!state.grand && state.score >= 4700) {
    state.grand = true;
    state.score += 2300;
    best.grand = fmtTime(state.elapsed);
    els.grandBanner.classList.add('show');
    setTimeout(() => els.grandBanner.classList.remove('show'), 2600);
    els.statusHelper.textContent = 'Uchiwa Grand Breeze! Endless fan commissions continue with faster breeze lanes.';
    tone('grand');
    state.chapter += 1;
    const endless = commissions[2];
    commissions[3] = { ...endless, name: 'Endless Festival Fan', text: 'Endless mixed motifs: preserve gaps, keep bleed low, and chain perfect stencil windows.', limit: Math.max(28, 48 - Math.min(16, Math.floor(state.elapsed / 60))), sectors: 16 };
    setupCommission(3);
  } else if (state.score < 4700) {
    els.statusHelper.textContent = 'Final fan is sealed. Build score with clean dry gaps to trigger Grand Breeze.';
    setupCommission(state.chapter);
  }
}
function finish(won, message) {
  state.over = true;
  state.running = false;
  best.score = Math.max(best.score || 0, state.score);
  best.badges = [...new Set([...(best.badges || []), ...(state.grand ? ['Grand Breeze'] : []), ...(state.bleed < 10 ? ['Low Bleed'] : []), ...(state.longestClean >= 12 ? ['Clean Chain'] : [])])];
  localStorage.setItem(STORAGE, JSON.stringify(best));
  els.resultText.innerHTML = [
    `<div><strong>${message}</strong></div>`,
    `<div>Final score: ${state.score} · Best: ${best.score}</div>`,
    `<div>Commission: ${currentCommission().name} · Clean chain: ${state.longestClean} · Bleed finish: ${Math.round(state.bleed)}%</div>`,
    `<div>Grand Breeze: ${state.grand ? 'triggered' : 'not yet'} · Badges: ${(best.badges || []).join(', ') || '—'}</div>`
  ].join('');
  els.resultOverlay.classList.add('show');
  updateUI();
}

function update(dt) {
  if (!state.running || state.paused || state.over) return;
  const slow = state.focusTime > 0 ? 0.42 : 1;
  state.elapsed += dt;
  state.focusTime = Math.max(0, state.focusTime - dt);
  const c = currentCommission();
  state.sectors.forEach((s, i) => {
    if (s.wet > 0) {
      const breeze = 0.9 + (i % 3) * 0.2 + state.chapter * 0.1;
      s.wet = Math.max(0, s.wet - dt * (5.5 + state.band) * slow);
      if (!s.dried && s.wet > 34) s.bleed += dt * breeze * (s.folded ? 0.24 : 0.72) * slow;
      if (s.bleed > 34 && state.warningCooldown <= 0) {
        state.warningCooldown = 2.2;
        state.bleed = Math.min(100, state.bleed + 3.5);
        els.statusHelper.textContent = `Bleed creeping near sector ${i + 1}; use Blot Cloth or Fan Dry.`;
      }
    }
  });
  state.warningCooldown = Math.max(0, state.warningCooldown - dt);
  state.bleed += dt * (0.12 + state.chapter * 0.04) * slow;
  if (state.elapsed > 300 + state.chapter * 20 && !state.grand) finish(false, 'The commission bell rang before the fan was complete.');
  if (state.bleed >= 100) penalty(16, 'Bleed overwhelmed the paper grain.');
  state.particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life -= dt * 1.5; });
  state.particles = state.particles.filter((p) => p.life > 0);
}
function updateUI() {
  const c = currentCommission();
  els.score.textContent = String(state.score);
  els.bestScore.textContent = String(best.score || 0);
  els.hearts.textContent = '♥'.repeat(Math.max(0, state.hearts)) + '♡'.repeat(Math.max(0, 3 - state.hearts));
  els.bleed.textContent = `${Math.round(state.bleed)}%`;
  els.combo.textContent = `x${state.combo.toFixed(1)}`;
  els.elapsed.textContent = fmtTime(state.elapsed);
  els.commissionName.textContent = c.name;
  els.commissionText.textContent = c.text;
  els.activeReadout.textContent = `Sector ${state.selected + 1} · ${['inner','middle','outer'][state.band]}`;
  els.pigmentReadout.textContent = state.pigment;
  els.stencilReadout.textContent = stencilMotif();
  els.dryGapReadout.textContent = `${state.counts.preserved}/${c.targets.preserved}`;
  els.satReadout.textContent = `${Math.round(selectedSector()?.saturation || 0)}%`;
  els.focusReadout.textContent = `${Math.round(state.focus)}%`;
  els.menuBest.textContent = String(best.score || 0);
  els.menuGrand.textContent = best.grand || '—';
  document.querySelectorAll('.pigment').forEach((b) => b.classList.toggle('active', b.dataset.pigment === state.pigment));
  renderTicks();
}
function renderTicks() {
  const c = currentCommission();
  if (!els.goalTicks) return;
  const goals = [
    state.counts.indigo >= (c.targets.indigo || 0) && state.counts.coral >= (c.targets.coral || 0) && state.counts.saffron >= (c.targets.saffron || 0),
    state.counts.preserved >= (c.targets.preserved || 0),
    state.counts.blot >= (c.targets.blot || 0),
    state.counts.dry >= (c.targets.dry || 0),
    state.counts.fold >= (c.targets.fold || 0),
    state.bleed <= c.limit
  ];
  els.goalTicks.innerHTML = goals.map((ok) => `<span class="tick ${ok ? 'done' : ''}"></span>`).join('');
}
function fmtTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function sectorGeometry() {
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h * 0.63;
  const rOuter = Math.min(w, h) * 0.44;
  const rInner = rOuter * 0.18;
  const start = Math.PI * 1.05;
  const end = Math.PI * 1.95;
  const span = end - start;
  return { cx, cy, rOuter, rInner, start, end, span };
}
function sectorPoint(i, ratio = 0.62) {
  const g = sectorGeometry();
  const n = state.sectors.length || 12;
  const a = g.start + (i + 0.5) / n * g.span;
  const r = g.rInner + (g.rOuter - g.rInner) * ratio;
  return { x: g.cx + Math.cos(a) * r, y: g.cy + Math.sin(a) * r };
}
function drawFan() {
  const g = sectorGeometry();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, '#fff9e7'); bg.addColorStop(1, '#f0d999');
  ctx.fillStyle = bg;
  roundRect(ctx, 16, 16, canvas.width - 32, canvas.height - 32, 34); ctx.fill();
  ctx.save();
  ctx.globalAlpha = 0.2;
  for (let i = 0; i < 60; i++) {
    ctx.strokeStyle = i % 2 ? '#ffffff' : '#d0a74c';
    ctx.beginPath(); ctx.moveTo(20 + i * 13, 24); ctx.lineTo(-60 + i * 13, canvas.height - 28); ctx.stroke();
  }
  ctx.restore();

  const n = state.sectors.length || 12;
  for (let i = 0; i < n; i++) {
    const s = state.sectors[i];
    const a0 = g.start + i / n * g.span;
    const a1 = g.start + (i + 1) / n * g.span;
    ctx.beginPath();
    ctx.moveTo(g.cx + Math.cos(a0) * g.rInner, g.cy + Math.sin(a0) * g.rInner);
    ctx.arc(g.cx, g.cy, g.rOuter, a0, a1);
    ctx.lineTo(g.cx + Math.cos(a1) * g.rInner, g.cy + Math.sin(a1) * g.rInner);
    ctx.arc(g.cx, g.cy, g.rInner, a1, a0, true);
    ctx.closePath();
    const base = s.protected ? '#fffdf1' : '#fff4d4';
    ctx.fillStyle = base;
    ctx.fill();
    if (s.color) {
      ctx.save(); ctx.clip();
      const p = pigments[s.color];
      const grd = ctx.createRadialGradient(g.cx, g.cy, g.rInner, g.cx, g.cy, g.rOuter);
      grd.addColorStop(0, `${p.light}${Math.round(s.saturation * 2.1).toString(16).padStart(2,'0')}`);
      grd.addColorStop(0.58, p.color);
      grd.addColorStop(1, s.dried ? p.light : p.color);
      ctx.globalAlpha = Math.min(0.86, 0.18 + s.saturation / 120);
      ctx.fillStyle = grd; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    if (s.protected) {
      ctx.save(); ctx.globalAlpha = s.stainedProtected ? 0.8 : 0.38; ctx.strokeStyle = s.stainedProtected ? '#c94343' : '#ffffff'; ctx.lineWidth = 5; ctx.setLineDash([10, 8]); ctx.stroke(); ctx.restore();
    }
    if (i === state.selected) { ctx.save(); ctx.strokeStyle = '#173f78'; ctx.lineWidth = 5; ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 8; ctx.stroke(); ctx.restore(); }
    if (aligned(i)) { ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#75e3d0'; ctx.fill(); ctx.restore(); }
    if (s.bleed > 8) {
      ctx.save(); ctx.strokeStyle = `rgba(201,67,67,${Math.min(0.75, s.bleed / 60)})`; ctx.lineWidth = 2 + s.bleed / 12; ctx.beginPath(); ctx.arc(g.cx, g.cy, g.rOuter * (0.38 + (i % 3) * 0.14), a0 + 0.03, a1 - 0.03); ctx.stroke(); ctx.restore();
    }
    if (s.folded) {
      const p = sectorPoint(i, 0.88); ctx.save(); ctx.fillStyle = '#f7dc84'; ctx.strokeStyle = '#aa7921'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    }
  }
  // ribs
  ctx.save();
  ctx.strokeStyle = '#b88641'; ctx.lineWidth = 3;
  for (let i = 0; i <= n; i++) {
    const a = g.start + i / n * g.span;
    ctx.beginPath(); ctx.moveTo(g.cx + Math.cos(a) * g.rInner, g.cy + Math.sin(a) * g.rInner); ctx.lineTo(g.cx + Math.cos(a) * g.rOuter, g.cy + Math.sin(a) * g.rOuter); ctx.stroke();
  }
  ctx.strokeStyle = '#c99b2e'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.arc(g.cx, g.cy, g.rOuter, g.start, g.end); ctx.stroke();
  ctx.fillStyle = '#b88641'; ctx.beginPath(); ctx.arc(g.cx, g.cy, g.rInner, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(g.cx - 10, g.cy, 20, g.rOuter * 0.45);
  ctx.restore();

  drawStencil(g);
  drawFocus(g);
  state.particles.forEach((p) => { ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 3 + p.life * 3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
}
function drawStencil(g) {
  const p = sectorPoint((state.selected + state.stencilOffset) % (state.sectors.length || 12), 0.56);
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.strokeStyle = aligned() ? '#12356e' : '#8b6a26';
  ctx.fillStyle = aligned() ? 'rgba(18,53,110,0.18)' : 'rgba(139,106,38,0.12)';
  ctx.lineWidth = 4;
  const motif = stencilMotif();
  if (motif === 'wave') {
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-28 + i * 22, 8, 20, Math.PI * 1.08, Math.PI * 1.9); ctx.stroke(); }
  } else if (motif === 'goldfish') {
    ctx.beginPath(); ctx.ellipse(0, 0, 22, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(43, -14); ctx.lineTo(38, 12); ctx.closePath(); ctx.stroke();
  } else if (motif === 'lantern') {
    roundRect(ctx, -18, -24, 36, 48, 14); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, 34); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(Math.cos(a)*14, Math.sin(a)*14); ctx.lineTo(Math.cos(a)*28, Math.sin(a)*28); ctx.stroke(); }
  }
  ctx.restore();
}
function drawFocus(g) {
  if (state.focusTime <= 0) return;
  ctx.save(); ctx.globalAlpha = 0.72; ctx.strokeStyle = '#45b9d6'; ctx.lineWidth = 3; ctx.setLineDash([12, 10]);
  for (let i = 0; i < state.sectors.length; i += 2) { const p = sectorPoint(i, 0.74); ctx.beginPath(); ctx.moveTo(p.x - 18, p.y - 18); ctx.lineTo(p.x + 18, p.y + 18); ctx.stroke(); }
  ctx.setLineDash([]); ctx.fillStyle = 'rgba(23,63,120,0.82)'; roundRect(ctx, 24, 24, 230, 70, 18); ctx.fill(); ctx.fillStyle = '#fff8d8'; ctx.font = '700 22px sans-serif'; ctx.fillText('Focus preview', 42, 54); ctx.font = '600 15px sans-serif'; ctx.fillText('cyan arrows = bleed path', 42, 78); ctx.restore();
}
function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function loop(now) {
  const dt = Math.min(0.05, (now - state.last) / 1000 || 0.016);
  state.last = now;
  update(dt);
  drawFan();
  updateUI();
  if (state.running && !state.paused && !state.over) requestAnimationFrame(loop);
}

function sectorFromPointer(event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width * canvas.width;
  const y = (event.clientY - rect.top) / rect.height * canvas.height;
  const g = sectorGeometry();
  const dx = x - g.cx, dy = y - g.cy;
  const r = Math.hypot(dx, dy);
  let a = Math.atan2(dy, dx);
  if (a < 0) a += Math.PI * 2;
  let start = g.start, end = g.end;
  if (a < start) a += Math.PI * 2;
  if (r < g.rInner || r > g.rOuter || a < start || a > end) return null;
  const idx = Math.floor((a - start) / g.span * state.sectors.length);
  return Math.max(0, Math.min(state.sectors.length - 1, idx));
}
canvas.addEventListener('pointerdown', (event) => {
  initAudio();
  const idx = sectorFromPointer(event);
  if (idx !== null) { state.selected = idx; els.statusHelper.textContent = `Selected sector ${idx + 1}. ${aligned() ? 'Stencil glows safe.' : 'Rotate stencil before brushing.'}`; tone('tap'); updateUI(); drawFan(); }
});

document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => action(button.dataset.action)));
document.querySelectorAll('[data-pigment]').forEach((button) => button.addEventListener('click', () => setPigment(button.dataset.pigment)));
$('startButton').addEventListener('click', newRun);
$('resumeButton').addEventListener('click', togglePause);
$('pauseRestart').addEventListener('click', newRun);
$('resultRestart').addEventListener('click', newRun);
[els.audioToggle, els.menuMute, els.pauseMute].forEach((el) => el?.addEventListener('click', () => setMuted(audio.enabled)));
window.addEventListener('keydown', (event) => {
  if (event.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
  const key = event.key.toLowerCase();
  const map = { arrowleft: 'sectorPrev', a: 'sectorPrev', arrowright: 'sectorNext', d: 'sectorNext', arrowup: 'bandNext', w: 'bandNext', arrowdown: 'bandPrev', s: 'bandPrev', q: 'stencilPrev', e: 'stencilNext', ' ': 'brush', enter: 'brush', f: 'fold', b: 'blot', k: 'focus', shift: 'focus', p: 'pause', r: 'restart' };
  if (['1','2','3'].includes(key)) { setPigment(pigmentOrder[Number(key) - 1]); event.preventDefault(); return; }
  if (key === 'd') { action(event.shiftKey ? 'dry' : 'sectorNext'); event.preventDefault(); return; }
  if (map[key]) { action(map[key]); event.preventDefault(); }
});

setupCommission(0);
updateUI();
drawFan();
