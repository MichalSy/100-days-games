'use strict';

const DAY = '049';
const STORAGE = 'day049-yabusame';
const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');

const $ = (id) => document.getElementById(id);
const titleScreen = $('titleScreen');
const gameScreen = $('gameScreen');
const pauseOverlay = $('pauseOverlay');
const resultsOverlay = $('resultsOverlay');
const focusOverlay = $('focusOverlay');
const sealBanner = $('sealBanner');
const statusHelper = $('statusHelper');

const hud = {
  score: $('scoreHud'), best: $('bestHud'), hearts: $('heartHud'), calm: $('calmHud'), strain: $('strainHud'), gate: $('gateHud'),
  combo: $('comboHud'), lane: $('laneHud'), next: $('nextHud'), wind: $('windHud'), focus: $('focusHud'), time: $('timeHud'),
  menuBest: $('menuBest'), menuSealTime: $('menuSealTime'), commissionName: $('commissionName'), commissionText: $('commissionText'),
  masterNote: $('masterNote'), progress: $('progressPips'), resultsTitle: $('resultsTitle'), resultsSummary: $('resultsSummary')
};

const assets = {
  rider: loadImage('./assets/yabusame-rider.png'),
  course: loadImage('./assets/yabusame-course.png'),
  pieces: loadImage('./assets/yabusame-pieces.png'),
  icons: loadImage('./assets/yabusame-icons.png')
};

function loadImage(src) {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  return image;
}

const commissions = [
  {
    name: 'First Willow Mark 0/3',
    short: 'First Willow Mark',
    text: 'Hit near willow target 1, pace down before the banner gate, then calm the horse.',
    targets: [
      { lane: 'near', x: 620, y: 335, r: 42, order: 1, speed: 0.80 },
      { lane: 'near', x: 820, y: 330, r: 40, order: 2, speed: 0.82 },
      { lane: 'mid', x: 1040, y: 280, r: 38, order: 3, speed: 0.85 }
    ],
    calmTarget: 55,
    gateLimit: 70
  },
  {
    name: 'Shrine Banner Triple 0/4',
    short: 'Shrine Banner Triple',
    text: 'Hit near, mid, and far targets in order, feather one arrow through wind, and calm after the banner drum.',
    targets: [
      { lane: 'near', x: 680, y: 338, r: 36, order: 1, speed: 1.00 },
      { lane: 'mid', x: 890, y: 278, r: 34, order: 2, speed: 1.02 },
      { lane: 'far', x: 1110, y: 218, r: 33, order: 3, speed: 1.06 },
      { lane: 'mid', x: 1290, y: 270, r: 32, order: 4, speed: 1.09 }
    ],
    calmTarget: 60,
    gateLimit: 62
  },
  {
    name: 'Moonlit River Finale 0/5',
    short: 'Moonlit River Finale',
    text: 'Clear five ordered targets, use Yabusame Focus, pierce a willow target, and keep gate pressure below 55%.',
    targets: [
      { lane: 'mid', x: 690, y: 282, r: 32, order: 1, speed: 1.10 },
      { lane: 'far', x: 870, y: 218, r: 30, order: 2, speed: 1.13, willow: true },
      { lane: 'near', x: 1040, y: 340, r: 31, order: 3, speed: 1.17 },
      { lane: 'far', x: 1240, y: 214, r: 29, order: 4, speed: 1.20 },
      { lane: 'mid', x: 1410, y: 276, r: 30, order: 5, speed: 1.25 }
    ],
    calmTarget: 70,
    gateLimit: 55
  }
];

const best = loadBest();
let audio = { ctx: null, enabled: true };
let lastFrame = 0;
let raf = 0;
let pointerDown = false;
let gameStartedAt = 0;
let pausedAt = 0;

const state = {
  running: false,
  paused: false,
  over: false,
  score: 0,
  hearts: 3,
  calm: 92,
  strain: 0,
  gate: 0,
  combo: 1,
  focus: 35,
  focusActive: false,
  focusArrow: false,
  focusUsed: false,
  elapsed: 0,
  pace: 1,
  aim: -8,
  draw: 0,
  drawing: false,
  wind: -0.18,
  targetIndex: 0,
  commissionIndex: 0,
  targets: [],
  arrows: [],
  hits: 0,
  wrongHits: 0,
  perfects: 0,
  farHits: 0,
  featherUses: 0,
  calmBeats: 0,
  seal: false,
  message: 'Ready: set pace, aim near lane, draw into the green window, then Release Arrow.',
  sparks: []
};

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE) || '{}');
  } catch {
    return {};
  }
}
function saveBest() {
  best.score = Math.max(best.score || 0, state.score);
  if (state.seal) {
    const current = best.sealSeconds || Infinity;
    best.sealSeconds = Math.min(current, Math.round(state.elapsed));
  }
  localStorage.setItem(STORAGE, JSON.stringify(best));
}

function initAudio() {
  if (!audio.enabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!audio.ctx) audio.ctx = new AudioContext();
  if (audio.ctx.state === 'suspended') audio.ctx.resume().catch(() => {});
  window.__day049Audio = { ctx: audio.ctx, enabled: audio.enabled };
}
function tone(freq, dur = 0.08, type = 'sine', gain = 0.05, slide = 1) {
  if (!audio.enabled || !audio.ctx || audio.ctx.state !== 'running') return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const g = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * slide), now + dur);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g).connect(audio.ctx.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}
function audioCue(name) {
  const cues = {
    start: () => { tone(220, .08, 'triangle', .04, 1.2); setTimeout(() => tone(440, .12, 'sine', .035, 1.5), 50); },
    draw: () => tone(180 + state.draw * 4, .07, 'sawtooth', .018, 1.08),
    release: () => tone(520, .09, 'triangle', .035, .45),
    drift: () => tone(720, .07, 'sine', .026, 1.25),
    hit: () => { tone(240, .08, 'square', .035, .8); tone(700, .12, 'triangle', .035, 1.2); },
    perfect: () => { tone(640, .08, 'sine', .04, 1.2); setTimeout(() => tone(980, .09, 'sine', .035, 1.25), 55); },
    calm: () => tone(180, .12, 'triangle', .035, .75),
    focus: () => { tone(540, .08, 'sine', .035, 1.2); setTimeout(() => tone(820, .13, 'sine', .028, 1.15), 60); },
    gate: () => tone(90, .12, 'square', .025, .85),
    seal: () => { [420, 630, 840, 1050].forEach((f, i) => setTimeout(() => tone(f, .14, 'triangle', .04, 1.1), i * 65)); }
  };
  cues[name]?.();
}

function startGame() {
  initAudio();
  audioCue('start');
  Object.assign(state, {
    running: true, paused: false, over: false, score: 0, hearts: 3, calm: 92, strain: 0, gate: 0,
    combo: 1, focus: 35, focusActive: false, focusArrow: false, focusUsed: false, elapsed: 0,
    pace: 1, aim: -8, draw: 0, drawing: false, wind: -0.18, targetIndex: 0, commissionIndex: 0,
    arrows: [], hits: 0, wrongHits: 0, perfects: 0, farHits: 0, featherUses: 0, calmBeats: 0,
    seal: false, sparks: [], message: 'Opening grace: aim at target 1, draw to the green band, then release.'
  });
  titleScreen.classList.add('is-hidden');
  resultsOverlay.classList.add('is-hidden');
  pauseOverlay.classList.add('is-hidden');
  gameScreen.classList.remove('is-hidden');
  gameStartedAt = performance.now();
  loadCommission(0);
  updateHud();
  resizeCanvas();
  lastFrame = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
}

function loadCommission(index) {
  const c = commissions[index];
  state.commissionIndex = index;
  state.targetIndex = 0;
  state.targets = c.targets.map(t => ({ ...t, hit: false, passed: false }));
  state.hits = 0;
  hud.progress.innerHTML = '';
  c.targets.forEach(t => {
    const pip = document.createElement('span');
    pip.textContent = t.order;
    hud.progress.append(pip);
  });
  hud.commissionName.textContent = c.name;
  hud.commissionText.textContent = c.text;
  hud.masterNote.textContent = index === 0
    ? 'Archery-master note: draw to the green band and release as the target halo crosses the marker rope.'
    : index === 1
      ? 'Archery-master note: use Feather Drift for one wind correction, then Calm Horse after the banner drum.'
      : 'Archery-master note: activate Yabusame Focus, nock one glowing arrow, and keep gate below 55%.';
}

function loop(now) {
  const dt = Math.min(0.034, (now - lastFrame) / 1000 || 0.016);
  lastFrame = now;
  if (state.running && !state.paused && !state.over) update(dt);
  draw();
  raf = requestAnimationFrame(loop);
}

function update(dt) {
  state.elapsed = (performance.now() - gameStartedAt) / 1000;
  state.gate = Math.min(100, state.gate + dt * (4.8 + state.commissionIndex * 0.9 + state.pace * 0.8));
  state.strain = Math.max(0, state.strain - dt * 3.5);
  state.calm = Math.max(0, Math.min(100, state.calm - dt * Math.max(0, state.pace - 1) * 2.2 - dt * (state.strain > 78 ? 2.8 : 0)));
  state.wind = Math.sin(state.elapsed * 0.85 + state.commissionIndex) * (0.18 + state.commissionIndex * 0.08);

  if (state.drawing) {
    state.draw = Math.min(100, state.draw + dt * 42);
    state.strain = Math.min(100, state.strain + dt * (state.draw > 72 ? 11 : 5));
    if (Math.floor(state.elapsed * 8) % 5 === 0) audioCue('draw');
  }

  for (const target of state.targets) {
    if (!target.hit && !target.passed) {
      target.x -= dt * (100 + state.pace * 70) * target.speed;
      if (target.x < -80) {
        target.passed = true;
        if (target.order === state.targetIndex + 1) penalty('Target passed the marker rope. Gate pressure rises.');
      }
    }
  }
  for (const arrow of state.arrows) {
    arrow.life += dt;
    arrow.vy += dt * 190;
    arrow.vx += state.wind * dt * 80;
    arrow.x += arrow.vx * dt;
    arrow.y += arrow.vy * dt;
    arrow.trail.push({ x: arrow.x, y: arrow.y, life: 1 });
    arrow.trail = arrow.trail.slice(-18);
    arrow.trail.forEach(p => p.life -= dt * 2.4);
    if (!arrow.done) testArrowHit(arrow);
  }
  state.arrows = state.arrows.filter(a => a.life < 2.2 && a.x < canvas.width + 140 && a.y < canvas.height + 140);
  state.sparks = state.sparks.filter(s => (s.life -= dt) > 0);

  if (state.gate > 88 && Math.floor(state.elapsed * 2) % 2 === 0) audioCue('gate');
  if (state.calm <= 0 || state.strain >= 100 || state.gate >= 100 || state.hearts <= 0) endRun(false, state.calm <= 0 ? 'Horse calm broke at the gate.' : state.gate >= 100 ? 'Course gates closed.' : 'The run ended.');
  updateHud();
}

function testArrowHit(arrow) {
  for (const target of state.targets) {
    if (target.hit || target.passed) continue;
    const sx = laneX(target.x);
    const sy = target.y;
    const dx = arrow.x - sx;
    const dy = arrow.y - sy;
    const dist = Math.hypot(dx, dy);
    const ring = target.r + (arrow.focus ? 18 : 5);
    const willowBlocked = target.willow && !arrow.focus;
    if (dist < ring && !willowBlocked) {
      arrow.done = true;
      target.hit = true;
      const expected = target.order === state.targetIndex + 1;
      const perfect = dist < target.r * 0.36 && arrow.draw >= 48 && arrow.draw <= 76;
      if (expected) {
        state.targetIndex += 1;
        state.hits += 1;
        state.combo = Math.min(9.9, +(state.combo + (perfect ? 0.45 : 0.25)).toFixed(2));
        const laneBonus = target.lane === 'far' ? 330 : 0;
        const gain = Math.round((perfect ? 390 : 290) * state.combo + laneBonus + (arrow.feathered ? 260 : 0) + (arrow.focus ? 420 : 0));
        state.score += gain;
        state.focus = Math.min(100, state.focus + (perfect ? 22 : 16));
        if (perfect) state.perfects += 1;
        if (target.lane === 'far') state.farHits += 1;
        state.message = `${perfect ? 'Perfect center!' : 'Correct ordered hit!'} Target ${target.order} scored +${gain}.`;
        audioCue(perfect ? 'perfect' : 'hit');
        spawnSparks(sx, sy, perfect ? '#fff2a0' : '#ffd36a', perfect ? 28 : 16);
        updatePips();
        if (state.targetIndex >= state.targets.length) completeCommission();
      } else {
        state.wrongHits += 1;
        penalty('Wrong-order target hit. Combo reset — recover the next lane.');
      }
      return;
    }
  }
}

function completeCommission() {
  const c = commissions[state.commissionIndex];
  state.score += Math.round(1160 + state.combo * 140 + (state.gate < c.gateLimit ? 300 : 0) + (state.calm > c.calmTarget ? 250 : 0));
  state.hearts = Math.min(3, state.hearts + 1);
  state.focus = Math.min(100, state.focus + 24);
  if (state.commissionIndex < commissions.length - 1) {
    state.message = `${c.short} sealed. New target run begins; watch lane depth and wind.`;
    loadCommission(state.commissionIndex + 1);
    state.gate = Math.max(8, state.gate - 28);
    state.calm = Math.min(100, state.calm + 12);
  } else {
    state.seal = true;
    state.score += 3900;
    sealBanner.classList.remove('is-hidden');
    audioCue('seal');
    state.message = 'Yabusame Grand Hitomi Seal! Endless target course unlocked.';
    setTimeout(() => sealBanner.classList.add('is-hidden'), 2600);
    loadEndlessTargets();
  }
  updateHud();
}

function loadEndlessTargets() {
  const base = 690 + Math.random() * 80;
  state.commissionIndex = commissions.length - 1;
  hud.commissionName.textContent = 'Endless Willow Course';
  hud.commissionText.textContent = 'Keep chaining ordered targets, calm the horse, and chase perfect center seals.';
  state.targetIndex = 0;
  state.targets = Array.from({ length: 5 }, (_, i) => {
    const lane = ['near', 'mid', 'far', 'mid', 'near'][(i + Math.floor(state.elapsed)) % 5];
    return { lane, x: base + i * 190, y: lane === 'near' ? 338 : lane === 'mid' ? 276 : 216, r: 30, order: i + 1, speed: 1.18 + i * .04, hit: false, passed: false, willow: i === 2 };
  });
  hud.progress.innerHTML = '';
  state.targets.forEach(t => { const pip = document.createElement('span'); pip.textContent = t.order; hud.progress.append(pip); });
}

function penalty(message) {
  state.combo = 1;
  state.hearts = Math.max(0, state.hearts - 1);
  state.calm = Math.max(0, state.calm - 11);
  state.gate = Math.min(100, state.gate + 8);
  state.message = message;
  tone(110, .1, 'square', .025, .65);
}

function laneX(x) { return x; }
function laneName() {
  if (state.aim < -22) return 'far';
  if (state.aim < -7) return 'mid';
  return 'near';
}

function drawBow() {
  if (!state.running || state.paused) return;
  state.drawing = true;
  state.draw = Math.max(state.draw, 8);
  state.message = 'Drawing bow — release in the green band around 50–76%. Overdraw raises strain.';
}
function releaseArrow() {
  if (!state.running || state.paused || !state.drawing) return;
  state.drawing = false;
  const draw = state.draw;
  const radians = (state.aim - 3) * Math.PI / 180;
  const power = 420 + draw * 4.6;
  const x = canvas.width * 0.26;
  const y = canvas.height * 0.62;
  state.arrows.push({
    x, y, vx: Math.cos(radians) * power, vy: Math.sin(radians) * power, life: 0, trail: [], draw,
    focus: state.focusArrow, feathered: false, done: false
  });
  state.message = `Released ${state.focusArrow ? 'focus ' : ''}arrow at ${Math.round(draw)}% draw toward ${laneName()} lane.`;
  if (draw < 35 || draw > 88) penalty(draw < 35 ? 'Short draw: arrow falls early and target order pressure rises.' : 'Overdraw spooked the horse. Calm Horse soon.');
  state.focusArrow = false;
  state.draw = 0;
  audioCue('release');
}

function control(name) {
  if (!state.running && name !== 'audio') return;
  const flash = document.querySelector(`[data-control="${name}"]`);
  if (flash) { flash.classList.add('flash'); setTimeout(() => flash.classList.remove('flash'), 160); }
  switch (name) {
    case 'pace-up': state.pace = Math.min(2.2, +(state.pace + 0.18).toFixed(2)); state.score += 120; state.message = `Pace Up: course scroll speed increases to ${state.pace.toFixed(1)}x; release windows shrink.`; break;
    case 'pace-down': state.pace = Math.max(0.55, +(state.pace - 0.18).toFixed(2)); state.calm = Math.min(100, state.calm + 4); state.message = `Pace Down: calmer horse at ${Math.round(state.calm)}%, but gate pressure keeps moving.`; break;
    case 'aim-up': state.aim = Math.max(-38, state.aim - 4); state.message = `Aim Up: predicted arc now favors ${laneName()} lane.`; break;
    case 'aim-down': state.aim = Math.min(12, state.aim + 4); state.message = `Aim Down: predicted arc now favors ${laneName()} lane.`; break;
    case 'draw': drawBow(); break;
    case 'release': releaseArrow(); break;
    case 'feather': featherDrift(); break;
    case 'calm': state.calm = Math.min(100, state.calm + 18); state.strain = Math.max(0, state.strain - 12); state.calmBeats += 1; state.score += 240; state.message = 'Calm Horse: breath cue settles the chestnut horse and protects the next draw.'; audioCue('calm'); break;
    case 'swap': swapTarget(); break;
    case 'nock': if (state.focus >= 20) { state.focus -= 20; state.focusArrow = true; state.message = 'Nock Focus Arrow: next arrow glows and can pierce one willow-shadow occlusion.'; audioCue('focus'); } else state.message = 'Need 20% focus to nock a Focus Arrow.'; break;
    case 'focus': activateFocus(); break;
    case 'pause': togglePause(true); break;
    case 'restart': startGame(); break;
    case 'audio': toggleAudio(); break;
  }
  updateHud();
}

function featherDrift() {
  const arrow = state.arrows.find(a => !a.done && a.life > 0.05 && a.life < 1.45);
  if (!arrow) { state.message = 'Feather Drift needs an airborne arrow.'; return; }
  if (state.focus < 8) { state.message = 'Need at least 8% focus for Feather Drift.'; return; }
  state.focus -= 8;
  state.featherUses += 1;
  arrow.vy -= 45;
  arrow.vx += state.wind < 0 ? -38 : 38;
  arrow.feathered = true;
  state.message = 'Feather Drift bent the arrow trail against wind.';
  audioCue('drift');
}

function swapTarget() {
  const current = state.targets.find(t => !t.hit && !t.passed && t.order === state.targetIndex + 1);
  if (!current) { state.message = 'No active target to swap — continue the current ordered run.'; return; }
  const laneCycle = { near: 'mid', mid: 'far', far: 'near' };
  current.lane = laneCycle[current.lane];
  current.y = current.lane === 'near' ? 338 : current.lane === 'mid' ? 276 : 216;
  state.score += 90;
  state.message = `Swap Target: commission allows route choice; target ${current.order} moved to ${current.lane} lane.`;
}

function activateFocus() {
  if (state.focus < 35) { state.message = 'Need 35% focus for Yabusame Focus.'; return; }
  state.focus -= 35;
  state.focusActive = true;
  state.focusUsed = true;
  focusOverlay.classList.add('active');
  state.message = 'Yabusame Focus previews target order, arrow arc, wind drift, release window, calm risk, and gate pressure.';
  audioCue('focus');
  setTimeout(() => { state.focusActive = false; focusOverlay.classList.remove('active'); }, 3200);
}

function togglePause(show) {
  if (!state.running || state.over) return;
  state.paused = show ?? !state.paused;
  pauseOverlay.classList.toggle('is-hidden', !state.paused);
  if (state.paused) pausedAt = performance.now();
  else gameStartedAt += performance.now() - pausedAt;
}
function endRun(won, reason) {
  if (state.over) return;
  state.over = true;
  state.running = false;
  saveBest();
  hud.resultsTitle.textContent = won || state.seal ? 'Grand Hitomi Seal Run' : 'Run Complete';
  hud.resultsSummary.innerHTML = [
    ['Score', state.score], ['Best', best.score || state.score], ['Commission', commissions[Math.min(state.commissionIndex, 2)].short],
    ['Grand Seal', state.seal ? 'yes' : 'not yet'], ['Calm', `${Math.round(state.calm)}%`], ['Strain peak', `${Math.round(state.strain)}%`],
    ['Wrong-order hits', state.wrongHits], ['Perfect centers', state.perfects], ['Far hits', state.farHits], ['Feather Drifts', state.featherUses]
  ].map(([k, v]) => `<span><strong>${k}</strong><br>${v}</span>`).join('') + `<p>${reason}</p>`;
  resultsOverlay.classList.remove('is-hidden');
}
function toggleAudio() {
  audio.enabled = !audio.enabled;
  if (audio.ctx && !audio.enabled) audio.ctx.suspend().catch(() => {});
  if (audio.ctx && audio.enabled) audio.ctx.resume().catch(() => {});
  window.__day049Audio = { ctx: audio.ctx, enabled: audio.enabled };
  $('audioBtn').textContent = `Audio: ${audio.enabled ? 'On' : 'Off'}`;
  $('pauseAudioBtn').textContent = `Audio: ${audio.enabled ? 'On' : 'Off'}`;
}

function updatePips() {
  [...hud.progress.children].forEach((pip, i) => pip.classList.toggle('done', i < state.targetIndex));
}
function updateHud() {
  hud.score.textContent = state.score;
  hud.best.textContent = Math.max(best.score || 0, state.score);
  hud.hearts.textContent = '♥'.repeat(state.hearts) + '♡'.repeat(Math.max(0, 3 - state.hearts));
  hud.calm.textContent = `${Math.round(state.calm)}%`;
  hud.strain.textContent = `${Math.round(state.strain)}%`;
  hud.gate.textContent = `${Math.round(state.gate)}%`;
  hud.combo.textContent = `x${state.combo.toFixed(1)}`;
  hud.lane.textContent = laneName();
  hud.next.textContent = `target ${state.targetIndex + 1}`;
  hud.wind.textContent = `${state.wind < 0 ? '←' : '→'} ${Math.abs(state.wind).toFixed(1)}`;
  hud.focus.textContent = `${Math.round(state.focus)}%`;
  hud.time.textContent = `${Math.round(state.elapsed)}s`;
  hud.menuBest.textContent = best.score || 0;
  hud.menuSealTime.textContent = best.sealSeconds ? `${best.sealSeconds}s` : '—';
  statusHelper.textContent = state.message;
  updatePips();
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(320, Math.floor(rect.width * dpr));
  const h = Math.max(240, Math.floor(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w; canvas.height = h;
  }
}

function draw() {
  resizeCanvas();
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  drawBackground(w, h);
  drawCourse(w, h);
  drawTargets(w, h);
  drawArrows();
  drawRider(w, h);
  drawAimArc(w, h);
  drawStageChips(w, h);
}

function drawBackground(w, h) {
  if (assets.course.complete && assets.course.naturalWidth) {
    const img = assets.course;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const iw = img.naturalWidth * scale, ih = img.naturalHeight * scale;
    ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    ctx.fillStyle = 'rgba(25, 12, 20, 0.28)'; ctx.fillRect(0, 0, w, h);
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#462158'); g.addColorStop(.45, '#f19156'); g.addColorStop(1, '#25151c');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
}
function drawCourse(w, h) {
  const baseY = h * 0.72;
  ctx.fillStyle = 'rgba(255, 222, 148, .18)';
  for (let i = 0; i < 4; i++) {
    const y = baseY - i * h * 0.11;
    ctx.fillRect(0, y, w, 3);
    ctx.fillStyle = i === 0 ? 'rgba(122, 190, 105, .22)' : 'rgba(255, 222, 148, .15)';
  }
  // marker rope and willow foreground
  ctx.strokeStyle = 'rgba(255, 245, 214, .38)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(w * .19, h * .18); ctx.lineTo(w * .19, h * .82); ctx.stroke();
  for (let i = 0; i < 7; i++) {
    const x = ((i * 173 - state.elapsed * state.pace * 28) % (w + 120)) - 50;
    ctx.strokeStyle = 'rgba(55, 95, 48, .38)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + 34, h * .16, x + 14, h * .32); ctx.stroke();
  }
  // wind ribbon
  ctx.strokeStyle = state.wind < 0 ? 'rgba(96, 213, 132, .7)' : 'rgba(255, 211, 106, .75)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 18) {
    const y = h * .28 + Math.sin(x * .018 + state.elapsed * 2) * 12;
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}
function drawTargets(w, h) {
  for (const target of state.targets) {
    if (target.hit || target.passed) continue;
    const x = target.x, y = target.y;
    const laneColor = target.lane === 'near' ? '#ffd36a' : target.lane === 'mid' ? '#fff3bf' : '#a4d4ff';
    ctx.save();
    ctx.globalAlpha = target.willow && !state.focusArrow ? .78 : 1;
    ctx.fillStyle = 'rgba(40, 20, 18, .55)';
    ctx.beginPath(); ctx.ellipse(x, y + target.r + 24, target.r * .7, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3a2316'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y + target.r + 4); ctx.lineTo(x, y + target.r + 70); ctx.stroke();
    ctx.fillStyle = '#b93729'; ctx.strokeStyle = '#fff2ca'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(x, y, target.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1d1a1b'; ctx.beginPath(); ctx.arc(x, y, target.r * .6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff1d1'; ctx.beginPath(); ctx.arc(x, y, target.r * .39, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d9412b'; ctx.beginPath(); ctx.arc(x, y, target.r * .18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = laneColor; ctx.lineWidth = state.focusActive || target.order === state.targetIndex + 1 ? 5 : 2;
    ctx.beginPath(); ctx.arc(x, y, target.r + 12 + Math.sin(state.elapsed * 5) * 3, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#241216'; ctx.strokeStyle = '#fff2c8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x - target.r - 12, y - target.r - 10, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff6dd'; ctx.font = 'bold 16px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(target.order, x - target.r - 12, y - target.r - 10);
    if (target.willow) {
      ctx.strokeStyle = 'rgba(34, 65, 39, .55)'; ctx.lineWidth = 9;
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x - 48 + i * 19, y - 62); ctx.quadraticCurveTo(x + i * 8, y - 15, x + 28 + i * 14, y + 42); ctx.stroke(); }
    }
    ctx.restore();
  }
}
function drawArrows() {
  for (const arrow of state.arrows) {
    ctx.strokeStyle = arrow.focus ? '#eaffff' : '#ffd36a'; ctx.lineWidth = arrow.focus ? 5 : 3;
    ctx.beginPath();
    arrow.trail.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.stroke();
    ctx.save(); ctx.translate(arrow.x, arrow.y); ctx.rotate(Math.atan2(arrow.vy, arrow.vx));
    ctx.strokeStyle = '#fff4d5'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(18, 0); ctx.stroke();
    ctx.fillStyle = arrow.focus ? '#a9ffff' : '#ffd36a'; ctx.beginPath(); ctx.moveTo(24, 0); ctx.lineTo(12, -6); ctx.lineTo(12, 6); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
}
function drawRider(w, h) {
  const x = w * .18, y = h * .63;
  const size = Math.min(w * .24, h * .26, 180);
  if (assets.rider.complete && assets.rider.naturalWidth) ctx.drawImage(assets.rider, x - size * .52, y - size * .56, size * 1.45, size * 1.1);
  else {
    ctx.fillStyle = '#8d4c24'; ctx.fillRect(x - 28, y - 20, 80, 35); ctx.fillStyle = '#241216'; ctx.fillRect(x, y - 65, 24, 45);
  }
  ctx.fillStyle = 'rgba(255, 211, 106, .9)';
  ctx.fillRect(x - 50, y - size * .62, Math.max(0, state.draw) * 1.1, 6);
  ctx.strokeStyle = '#e6fff0'; ctx.lineWidth = 2; ctx.strokeRect(x - 50, y - size * .62, 110, 6);
  ctx.fillStyle = state.draw >= 45 && state.draw <= 78 ? '#4fd26e' : 'rgba(210,60,40,.9)';
  ctx.fillRect(x - 1, y - size * .62 - 3, 36, 12);
}
function drawAimArc(w, h) {
  const startX = w * .26, startY = h * .62;
  const radians = (state.aim - 3) * Math.PI / 180;
  const power = 420 + Math.max(55, state.draw || 55) * 4.6;
  ctx.strokeStyle = state.focusActive ? 'rgba(255, 255, 190, .95)' : 'rgba(255, 245, 214, .58)'; ctx.setLineDash([8, 8]); ctx.lineWidth = 3;
  ctx.beginPath();
  for (let t = 0; t < 1.25; t += .05) {
    const x = startX + Math.cos(radians) * power * t;
    const y = startY + Math.sin(radians) * power * t + 95 * t * t + state.wind * t * 80;
    if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke(); ctx.setLineDash([]);
}
function drawStageChips(w, h) {
  const chips = [
    `Pace ${state.pace.toFixed(1)}x`, `Aim ${laneName()}`, `Draw ${Math.round(state.draw)}%`, `Wind ${state.wind < 0 ? 'left' : 'right'}`, state.focusArrow ? 'Focus arrow nocked' : 'Normal arrow'
  ];
  let x = 16, y = h - 40;
  ctx.font = 'bold 14px system-ui'; ctx.textBaseline = 'middle';
  for (const chip of chips) {
    const width = ctx.measureText(chip).width + 24;
    if (x + width > w - 16) { x = 16; y -= 34; }
    ctx.fillStyle = 'rgba(25, 15, 18, .75)'; ctx.strokeStyle = 'rgba(255, 211, 106, .42)'; ctx.lineWidth = 1;
    roundRect(x, y - 14, width, 28, 14); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff7db'; ctx.fillText(chip, x + 12, y);
    x += width + 8;
  }
  for (const s of state.sparks) {
    ctx.globalAlpha = Math.max(0, s.life);
    ctx.fillStyle = s.color;
    ctx.beginPath(); ctx.arc(s.x + s.vx * (1 - s.life), s.y + s.vy * (1 - s.life), s.r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
}
function roundRect(x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function spawnSparks(x, y, color, count) {
  for (let i = 0; i < count; i++) state.sparks.push({ x, y, color, r: 2 + Math.random() * 3, vx: (Math.random() - .5) * 110, vy: (Math.random() - .5) * 80, life: .7 + Math.random() * .4 });
}

function bind() {
  $('startBtn').addEventListener('click', startGame);
  $('resumeBtn').addEventListener('click', () => togglePause(false));
  $('pauseRestartBtn').addEventListener('click', startGame);
  $('resultsRestartBtn').addEventListener('click', startGame);
  $('pauseAudioBtn').addEventListener('click', toggleAudio);
  document.querySelectorAll('[data-control]').forEach(el => {
    if (el.tagName === 'A') return;
    el.addEventListener('click', () => control(el.dataset.control));
  });
  canvas.addEventListener('pointerdown', e => { pointerDown = true; aimFromPointer(e); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (pointerDown) aimFromPointer(e); });
  canvas.addEventListener('pointerup', e => { pointerDown = false; try { canvas.releasePointerCapture(e.pointerId); } catch {} });
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('keydown', e => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    const key = e.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') control('aim-up');
    else if (key === 'arrowdown' || key === 's') control('aim-down');
    else if (key === 'arrowright' || key === 'd') control('pace-up');
    else if (key === 'arrowleft' || key === 'a') control('pace-down');
    else if (key === ' ' || key === 'enter') { e.preventDefault(); state.drawing ? control('release') : control('draw'); }
    else if (key === 'x') control('release');
    else if (key === 'f') state.arrows.length ? control('feather') : control('focus');
    else if (key === 'c') control('calm');
    else if (key === 't') control('swap');
    else if (key === 'n') control('nock');
    else if (key === 'p' || key === 'escape') control('pause');
    else if (key === 'r') control('restart');
  });
}
function aimFromPointer(e) {
  const rect = canvas.getBoundingClientRect();
  const y = (e.clientY - rect.top) / rect.height;
  state.aim = Math.max(-38, Math.min(12, -34 + y * 58));
  state.message = `Stage drag aiming: predicted arc targets ${laneName()} lane.`;
  updateHud();
}

window.__day049 = {
  state,
  controls: control,
  forceSeal() {
    state.score = Math.max(state.score, 6600); state.seal = true; sealBanner.classList.remove('is-hidden'); audioCue('seal'); updateHud(); return { score: state.score, seal: state.seal };
  },
  forceEnd() { endRun(false, 'Debug forced results overlay.'); return { over: state.over, score: state.score }; },
  metrics() {
    return { score: state.score, hits: state.targetIndex, calm: state.calm, strain: state.strain, gate: state.gate, focus: state.focus, seal: state.seal };
  }
};

bind();
updateHud();
resizeCanvas();
draw();
