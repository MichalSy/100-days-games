const canvas = document.querySelector('#stage');
const ctx = canvas.getContext('2d');

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const els = {
  menu: $('#menu'),
  game: $('#game'),
  overlay: $('#overlay'),
  title: $('#overlayTitle'),
  body: $('#overlayBody'),
  result: $('#resultStats'),
  resume: $('#resumeBtn'),
  overlayRestart: $('#overlayRestartBtn'),
  overlayAudio: $('#overlayAudioBtn'),
  start: $('#startBtn'),
  menuBest: $('#menuBest'),
  menuBlessing: $('#menuBlessing'),
  score: $('#scoreHud'),
  best: $('#bestHud'),
  hearts: $('#heartsHud'),
  energy: $('#energyHud'),
  sun: $('#sunHud'),
  combo: $('#comboHud'),
  dew: $('#dewHud'),
  perch: $('#perchHud'),
  focus: $('#focusHud'),
  time: $('#timeHud'),
  commissionName: $('#commissionName'),
  commissionObjective: $('#commissionObjective'),
  progressTicks: $('#progressTicks'),
  helper: $('#helper'),
  banner: $('#blessingBanner')
};

const assets = {
  dragonfly: loadImage('./assets/tombo-dragonfly.png'),
  terrace: loadImage('./assets/tombo-terrace.png'),
  pieces: loadImage('./assets/tombo-pieces.png'),
  icons: loadImage('./assets/tombo-icons.png')
};

function loadImage(src) {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  return img;
}

const storage = {
  best: 'day047.bestScore',
  blessing: 'day047.bestBlessingSeconds',
  badges: 'day047.badges'
};

const commissions = [
  {
    name: 'First Dew Skim',
    goal: 'Skim blue-gold dew 1→4, perch on the right reed, and keep sun-dry below 45%.',
    beads: [
      { x: 0.25, y: 0.61, r: 17 },
      { x: 0.39, y: 0.50, r: 16 },
      { x: 0.55, y: 0.47, r: 16 },
      { x: 0.70, y: 0.57, r: 17 }
    ],
    perches: [{ x: 0.82, y: 0.52 }, { x: 0.16, y: 0.76 }],
    frogs: [{ x: 0.18, y: 0.38, phase: 0.8, lane: 0.25 }],
    silks: [],
    gust: 0.12,
    target: 4
  },
  {
    name: 'Reed Gate Spiral',
    goal: 'Curve through the spiral dewline, perch right, clear one silk snag, and ring Field Bell on a blue pulse.',
    beads: [
      { x: 0.72, y: 0.30, r: 15 },
      { x: 0.57, y: 0.39, r: 15 },
      { x: 0.42, y: 0.50, r: 15 },
      { x: 0.56, y: 0.63, r: 15 },
      { x: 0.73, y: 0.69, r: 15 }
    ],
    perches: [{ x: 0.83, y: 0.75 }, { x: 0.19, y: 0.39 }],
    frogs: [{ x: 0.24, y: 0.67, phase: 0.2, lane: -0.15 }],
    silks: [{ x1: 0.33, y1: 0.30, x2: 0.47, y2: 0.42, clear: false }],
    gust: -0.18,
    target: 5
  },
  {
    name: 'Sunrise Terrace Crossing',
    goal: 'Finish two crossed dewlines with Focus, dodge frog arcs, clear silk, and keep sun-dry below 50%.',
    beads: [
      { x: 0.20, y: 0.30, r: 14 },
      { x: 0.35, y: 0.58, r: 14 },
      { x: 0.52, y: 0.34, r: 14 },
      { x: 0.69, y: 0.60, r: 14 },
      { x: 0.82, y: 0.36, r: 14 },
      { x: 0.58, y: 0.78, r: 14 }
    ],
    perches: [{ x: 0.12, y: 0.58 }, { x: 0.88, y: 0.68 }],
    frogs: [{ x: 0.30, y: 0.78, phase: 0.0, lane: 0.38 }, { x: 0.78, y: 0.24, phase: 0.55, lane: -0.28 }],
    silks: [
      { x1: 0.44, y1: 0.25, x2: 0.55, y2: 0.56, clear: false },
      { x1: 0.62, y1: 0.45, x2: 0.77, y2: 0.73, clear: false }
    ],
    gust: 0.25,
    target: 6
  }
];

let state;
let raf = 0;
let lastTime = 0;
let audio = { ctx: null, enabled: false, muted: false, master: null };

function newState() {
  return {
    running: false,
    paused: false,
    over: false,
    blessing: false,
    score: 0,
    best: Number(localStorage.getItem(storage.best) || 0),
    bestBlessing: Number(localStorage.getItem(storage.blessing) || 0),
    hearts: 3,
    energy: 100,
    sun: 0,
    combo: 1,
    focus: 35,
    elapsed: 0,
    commission: 0,
    dewIndex: 0,
    dewSkims: 0,
    perches: 0,
    frogDodges: 0,
    silkClears: 0,
    wrongSkims: 0,
    splashes: 0,
    fieldBellPulse: 0,
    focusActive: 0,
    dodgeActive: 0,
    bellSlow: 0,
    silkFlash: 0,
    perchCooldown: 0,
    frogGrace: 2.2,
    message: 'Drag the paddy stage to steer toward dew bead 1. Skim only when the nose is aligned.',
    dragonfly: {
      x: 210,
      y: 390,
      vx: 54,
      vy: -18,
      heading: -0.12,
      targetX: 300,
      targetY: 330,
      bank: 0
    }
  };
}

function init() {
  state = newState();
  els.menuBest.textContent = state.best.toString();
  els.menuBlessing.textContent = state.bestBlessing ? formatTime(state.bestBlessing) : '—';
  els.best.textContent = state.best.toString();
  updateCommissionUI();
  attachEvents();
  draw(0);
}

function attachEvents() {
  els.start.addEventListener('click', startGame);
  els.resume.addEventListener('click', resumeGame);
  els.overlayRestart.addEventListener('click', restartGame);
  els.overlayAudio.addEventListener('click', toggleAudio);
  $$('.controls [data-action]').forEach((button) => {
    button.addEventListener('click', () => handleAction(button.dataset.action));
  });
  canvas.addEventListener('pointerdown', handlePointer, { passive: false });
  canvas.addEventListener('pointermove', handlePointer, { passive: false });
  window.addEventListener('keydown', handleKey);
}

async function ensureAudio() {
  if (!audio.ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      audio.enabled = false;
      window.__day047Audio = { ctx: null, enabled: false };
      return;
    }
    audio.ctx = new Ctx();
    audio.master = audio.ctx.createGain();
    audio.master.gain.value = audio.muted ? 0 : 0.07;
    audio.master.connect(audio.ctx.destination);
  }
  if (audio.ctx.state !== 'running') await audio.ctx.resume();
  audio.enabled = true;
  window.__day047Audio = { ctx: audio.ctx, enabled: true };
}

function tone(freq, duration = 0.08, type = 'sine', gain = 0.8, delay = 0) {
  if (!audio.enabled || audio.muted || !audio.ctx) return;
  const now = audio.ctx.currentTime + delay;
  const osc = audio.ctx.createOscillator();
  const amp = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp).connect(audio.master);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

function cue(name) {
  const cues = {
    start: () => { tone(330, .08, 'triangle', .5); tone(660, .12, 'sine', .35, .07); },
    burst: () => tone(220, .10, 'sawtooth', .28),
    dew: () => { tone(880, .07, 'sine', .5); tone(1320, .05, 'triangle', .22, .04); },
    perch: () => tone(540, .09, 'triangle', .4),
    frog: () => tone(130, .14, 'sawtooth', .25),
    silk: () => tone(720, .06, 'square', .18),
    bell: () => { tone(392, .22, 'sine', .34); tone(784, .28, 'sine', .22, .03); },
    focus: () => { tone(520, .08, 'triangle', .4); tone(1040, .18, 'sine', .25, .06); },
    blessing: () => { [523, 659, 784, 1046].forEach((f, i) => tone(f, .18, 'sine', .32, i * .08)); },
    miss: () => tone(155, .12, 'sawtooth', .2)
  };
  cues[name]?.();
}

async function startGame() {
  await ensureAudio();
  cue('start');
  state = newState();
  state.running = true;
  els.menu.classList.add('hidden');
  els.game.classList.remove('hidden');
  els.overlay.classList.add('hidden');
  els.banner.classList.add('hidden');
  updateCommissionUI();
  updateHud();
  resizeCanvas();
  lastTime = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(tick);
}

function restartGame() {
  cue('start');
  const wasRunning = state.running;
  state = newState();
  state.running = wasRunning || !els.game.classList.contains('hidden');
  els.overlay.classList.add('hidden');
  els.banner.classList.add('hidden');
  updateCommissionUI();
  updateHud();
  lastTime = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(tick);
}

function pauseGame() {
  if (!state.running || state.over) return;
  state.paused = true;
  els.title.textContent = 'Paused';
  els.body.textContent = 'Smooth banks save wing energy. Skim numbered dew beads in order, perch to recharge, Dodge Frog on amber arcs, Clear Silk near strands, Field Bell on blue pulses, and use Tombo Focus before crossing routes.';
  els.result.innerHTML = '';
  els.resume.classList.remove('hidden');
  els.overlay.classList.remove('hidden');
}

function resumeGame() {
  state.paused = false;
  els.overlay.classList.add('hidden');
  lastTime = performance.now();
  raf = requestAnimationFrame(tick);
}

function endRun(reason) {
  state.over = true;
  state.running = false;
  const best = Math.max(state.best, Math.floor(state.score));
  if (best > state.best) localStorage.setItem(storage.best, String(best));
  state.best = best;
  els.title.textContent = state.blessing ? 'Dawnline Blessing Complete' : 'Flight Complete';
  els.body.textContent = reason;
  els.result.innerHTML = [
    ['Score', Math.floor(state.score)],
    ['Commission', commissions[Math.min(state.commission, commissions.length - 1)].name],
    ['Sun-dry', `${Math.round(state.sun)}%`],
    ['Wrong skims', state.wrongSkims],
    ['Frog dodges', state.frogDodges],
    ['Silk clears', state.silkClears],
    ['Perfect perches', state.perches]
  ].map(([label, value]) => `<span><b>${label}</b><br>${value}</span>`).join('');
  els.resume.classList.add('hidden');
  els.overlay.classList.remove('hidden');
  updateHud();
}

function toggleAudio() {
  audio.muted = !audio.muted;
  if (audio.master) audio.master.gain.value = audio.muted ? 0 : 0.07;
  state.message = audio.muted ? 'Audio muted. Visual dew, frog, silk, bell, and focus cues remain active.' : 'Audio on. WebAudio cues guide dew skims, hazards, and blessing timing.';
  updateHud();
}

function handleKey(event) {
  if (event.repeat && !['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(event.key)) return;
  const key = event.key.toLowerCase();
  const map = {
    arrowleft: 'bankLeft', a: 'bankLeft',
    arrowright: 'bankRight', d: 'bankRight',
    ' ': 'skim', enter: 'skim',
    shift: 'burst', x: 'burst',
    e: 'perch', q: 'quickTurn',
    c: 'clearSilk', b: 'bell', f: 'focus',
    escape: 'pause', r: 'restart'
  };
  if (key === 'p') {
    handleAction(state.paused ? 'resume' : 'pause');
    return;
  }
  const action = map[key];
  if (action) {
    event.preventDefault();
    handleAction(action);
  }
}

function handlePointer(event) {
  if (!state.running || state.paused || state.over) return;
  event.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  state.dragonfly.targetX = (event.clientX - rect.left) * sx;
  state.dragonfly.targetY = (event.clientY - rect.top) * sy - 28;
  state.message = `Steering toward (${Math.round(state.dragonfly.targetX)}, ${Math.round(state.dragonfly.targetY)}). Align nose before Skim Dew.`;
}

function handleAction(action) {
  if (action === 'restart') return restartGame();
  if (action === 'pause') return pauseGame();
  if (action === 'resume') return resumeGame();
  if (action === 'audio') return toggleAudio();
  if (!state.running || state.paused || state.over) return;
  const d = state.dragonfly;
  const comm = currentCommission();
  switch (action) {
    case 'bankLeft':
      d.heading -= 0.24;
      d.bank = -1;
      d.targetX = Math.max(36, d.targetX - 76);
      state.energy = Math.max(0, state.energy - 1.6);
      state.message = 'Bank Left changed heading; smooth arcs preserve combo.';
      break;
    case 'bankRight':
      d.heading += 0.24;
      d.bank = 1;
      d.targetX = Math.min(canvas.width - 36, d.targetX + 76);
      state.energy = Math.max(0, state.energy - 1.6);
      state.message = 'Bank Right changed heading; line up with the next dew bead.';
      break;
    case 'burst':
      d.vx += Math.cos(d.heading) * 150;
      d.vy += Math.sin(d.heading) * 150;
      state.energy = Math.max(0, state.energy - 10);
      addScore(45);
      cue('burst');
      state.message = 'Wing Burst pushed the dragonfly forward and lifted it above row gaps.';
      break;
    case 'skim':
      trySkim();
      break;
    case 'perch':
      tryPerch();
      break;
    case 'quickTurn':
      d.heading += Math.PI * 0.72;
      d.vx *= -0.62;
      d.vy *= -0.62;
      state.energy = Math.max(0, state.energy - 7);
      state.silkFlash = 0.4;
      addScore(80);
      state.message = 'Quick Turn flipped heading through a tight arc; avoid using it near silk.';
      break;
    case 'dodge':
      state.dodgeActive = 0.58;
      state.energy = Math.max(0, state.energy - 6);
      state.frogDodges += 1;
      addScore(isFrogWarning() ? 340 : 90);
      cue('frog');
      state.message = isFrogWarning() ? 'Perfect amber-pulse Dodge Frog protected the combo.' : 'Dodge Frog sidestepped vertically but missed the best amber timing.';
      break;
    case 'clearSilk':
      tryClearSilk();
      break;
    case 'bell':
      state.bellSlow = 3.2;
      state.fieldBellPulse = 1;
      addScore(230);
      cue('bell');
      state.message = 'Field Bell ripple slowed dew evaporation and stunned nearby frogs.';
      break;
    case 'focus':
      if (state.focus >= 30) {
        state.focus = Math.max(0, state.focus - 30);
        state.focusActive = 4.2;
        cue('focus');
        state.message = 'Tombo Focus overlays dew order, skim windows, frog arcs, silk tension, gust drift, and safe perches.';
      } else {
        cue('miss');
        state.message = 'Tombo Focus needs 30% charge. Build it with clean dew skims and perfect perches.';
      }
      break;
  }
  if (state.energy <= 0) damage('Wing energy bottomed out; perch before bursting again.');
  updateHud();
}

function trySkim() {
  const comm = currentCommission();
  const bead = comm.beads[state.dewIndex];
  if (!bead) return completeCommission();
  const bx = bead.x * canvas.width;
  const by = bead.y * canvas.height;
  const d = state.dragonfly;
  const dist = Math.hypot(d.x - bx, d.y - by);
  const desired = Math.atan2(by - d.y, bx - d.x);
  const align = Math.abs(angleDelta(d.heading, desired));
  if (dist < bead.r + 46 && align < 1.15) {
    state.dewIndex += 1;
    state.dewSkims += 1;
    state.focus = Math.min(100, state.focus + 11);
    state.energy = Math.min(100, state.energy + 2);
    addScore(260);
    cue('dew');
    state.message = `Clean Skim Dew collected bead ${state.dewIndex}/${comm.beads.length}; continue the dewline.`;
    if (state.dewIndex >= comm.beads.length) completeCommission();
  } else {
    state.wrongSkims += 1;
    state.splashes += 1;
    state.combo = 1;
    state.sun = Math.min(100, state.sun + 7);
    cue('miss');
    state.message = dist > bead.r + 46 ? 'Splash! Skim Dew missed the next bead; steer closer before lowering wings.' : 'Wrong skim angle. Align the dragonfly nose along the dewline first.';
    if (state.wrongSkims > 5) damage('Too many wrong-order dew skims frayed a wing heart.');
  }
  updateCommissionUI();
}

function tryPerch() {
  const d = state.dragonfly;
  const perch = currentCommission().perches.find((p) => Math.hypot(d.x - p.x * canvas.width, d.y - p.y * canvas.height) < 80);
  if (perch && state.perchCooldown <= 0) {
    d.x = perch.x * canvas.width;
    d.y = perch.y * canvas.height;
    d.vx *= 0.15;
    d.vy *= 0.15;
    state.energy = Math.min(100, state.energy + 28);
    state.focus = Math.min(100, state.focus + 8);
    state.perches += 1;
    state.perchCooldown = 1.3;
    addScore(320);
    cue('perch');
    state.message = 'Perfect Perch Reed restored wing energy and revealed the next dewline segment.';
  } else {
    state.energy = Math.max(0, state.energy - 4);
    state.message = 'No safe reed alignment yet. Slow down near a highlighted reed before Perch Reed.';
    cue('miss');
  }
}

function tryClearSilk() {
  const d = state.dragonfly;
  const silk = currentCommission().silks.find((s) => !s.clear && distToSegment(d.x, d.y, s.x1 * canvas.width, s.y1 * canvas.height, s.x2 * canvas.width, s.y2 * canvas.height) < 44);
  if (silk) {
    silk.clear = true;
    state.silkClears += 1;
    state.focus = Math.min(100, state.focus + 9);
    addScore(300);
    cue('silk');
    state.message = 'Clear Silk snapped the strand with the correct wing angle.';
  } else {
    state.energy = Math.max(0, state.energy - 5);
    state.silkFlash = 0.8;
    cue('miss');
    state.message = 'Clear Silk missed; get close to a visible silk strand before cutting.';
  }
  updateCommissionUI();
}

function completeCommission() {
  const comm = currentCommission();
  const base = 1100 + Math.round((100 - state.sun) * 8);
  addScore(base);
  if (state.sun < 35 && state.wrongSkims === 0) addScore(1500);
  state.hearts = Math.min(3, state.hearts + 1);
  state.commission += 1;
  if (state.commission >= commissions.length && state.score >= 6100 && !state.blessing) {
    triggerBlessing();
    return;
  }
  if (state.commission >= commissions.length) {
    state.commission = commissions.length - 1;
    state.dewIndex = 0;
    resetCommissionHazards();
    state.message = 'Endless terrace flight begins: longer dewlines, faster sun, crossing frog arcs, and bonus talismans.';
  } else {
    state.dewIndex = 0;
    state.message = `${comm.name} stamped a flight talisman. New terrace commission unlocked.`;
  }
  updateCommissionUI();
}

function triggerBlessing() {
  state.blessing = true;
  state.focusActive = 5;
  els.banner.classList.remove('hidden');
  addScore(3700);
  cue('blessing');
  const seconds = Math.max(1, Math.floor(state.elapsed));
  const old = Number(localStorage.getItem(storage.blessing) || 0);
  if (!old || seconds < old) localStorage.setItem(storage.blessing, String(seconds));
  state.message = 'Tombo Dawnline Blessing! Dew becomes sunrise stars; endless terrace flights continue.';
  setTimeout(() => els.banner.classList.add('hidden'), 3600);
  state.commission = commissions.length - 1;
  state.dewIndex = 0;
  resetCommissionHazards();
  updateCommissionUI();
}

function resetCommissionHazards() {
  for (const silk of currentCommission().silks) silk.clear = false;
}

function damage(message) {
  if (state.frogGrace > 0) {
    state.message = `${message} Tutorial grace softened the first hit.`;
    state.frogGrace = 0;
    return;
  }
  state.hearts -= 1;
  state.combo = 1;
  state.energy = Math.max(22, state.energy);
  state.message = message;
  cue('miss');
  if (state.hearts <= 0) endRun('All wing hearts are frayed. Restart and perch earlier to recover energy.');
}

function addScore(value) {
  state.score += value * state.combo;
  state.combo = Math.min(8, Math.round((state.combo + 0.15) * 100) / 100);
  if (state.score > state.best) state.best = Math.floor(state.score);
}

function tick(now) {
  if (!state.running || state.paused || state.over) return;
  const dt = Math.min(0.04, (now - lastTime) / 1000 || 0.016);
  lastTime = now;
  update(dt);
  draw(now / 1000);
  updateHud();
  raf = requestAnimationFrame(tick);
}

function update(dt) {
  state.elapsed += dt;
  state.focusActive = Math.max(0, state.focusActive - dt);
  state.dodgeActive = Math.max(0, state.dodgeActive - dt);
  state.bellSlow = Math.max(0, state.bellSlow - dt);
  state.silkFlash = Math.max(0, state.silkFlash - dt);
  state.perchCooldown = Math.max(0, state.perchCooldown - dt);
  state.fieldBellPulse = (state.fieldBellPulse + dt * 0.8) % 1;

  const d = state.dragonfly;
  const toTarget = Math.atan2(d.targetY - d.y, d.targetX - d.x);
  d.heading += angleDelta(d.heading, toTarget) * Math.min(1, dt * 4.2);
  const speed = Math.hypot(d.vx, d.vy);
  const targetSpeed = 122 + state.combo * 5;
  d.vx += Math.cos(d.heading) * targetSpeed * dt * 1.8;
  d.vy += Math.sin(d.heading) * targetSpeed * dt * 1.8;
  const comm = currentCommission();
  d.vx += comm.gust * 34 * dt;
  d.vx *= 0.982;
  d.vy *= 0.982;
  const maxSpeed = 235;
  const nextSpeed = Math.hypot(d.vx, d.vy);
  if (nextSpeed > maxSpeed) {
    d.vx = (d.vx / nextSpeed) * maxSpeed;
    d.vy = (d.vy / nextSpeed) * maxSpeed;
  }
  d.x += d.vx * dt;
  d.y += d.vy * dt + (state.dodgeActive > 0 ? Math.sin(state.dodgeActive * 20) * 28 * dt : 0);
  bounceStage(d);

  state.energy = Math.max(0, Math.min(100, state.energy + dt * (state.perchCooldown > 0 ? 5 : -1.8 - Math.max(0, speed - 180) * 0.006)));
  const sunRate = state.bellSlow > 0 ? 1.0 : 2.2 + state.commission * 0.7;
  state.sun = Math.min(100, state.sun + dt * sunRate);
  state.focus = Math.min(100, state.focus + dt * 1.1);

  if (state.elapsed > 4 && state.dodgeActive <= 0 && isFrogHit()) damage('A frog tongue caught the flight path. Dodge Frog during amber warning arcs.');
  if (state.sun >= 100) endRun('The morning sun dried every dew bead before the route was complete.');
  if (state.energy <= 0) damage('Wing energy collapsed mid-flight; Perch Reed restores energy.');
}

function bounceStage(d) {
  const margin = 36;
  if (d.x < margin) { d.x = margin; d.vx = Math.abs(d.vx) * 0.75; }
  if (d.x > canvas.width - margin) { d.x = canvas.width - margin; d.vx = -Math.abs(d.vx) * 0.75; }
  if (d.y < margin) { d.y = margin; d.vy = Math.abs(d.vy) * 0.75; }
  if (d.y > canvas.height - margin) { d.y = canvas.height - margin; d.vy = -Math.abs(d.vy) * 0.75; }
}

function draw(t) {
  resizeCanvas();
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  drawBackground(w, h, t);
  drawRiceRows(w, h, t);
  drawHazards(w, h, t);
  drawDew(w, h, t);
  drawPerches(w, h, t);
  drawFocus(w, h, t);
  drawDragonfly(w, h, t);
  drawStageLabels(w, h);
}

function drawBackground(w, h, t) {
  const bg = assets.terrace;
  if (bg.complete && bg.naturalWidth) {
    const scale = Math.max(w / bg.naturalWidth, h / bg.naturalHeight);
    const sw = bg.naturalWidth * scale;
    const sh = bg.naturalHeight * scale;
    ctx.globalAlpha = 0.82;
    ctx.drawImage(bg, (w - sw) / 2, (h - sh) / 2, sw, sh);
    ctx.globalAlpha = 1;
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#fff2a5');
    g.addColorStop(.48, '#9ee8c6');
    g.addColorStop(1, '#327e66');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.fillStyle = 'rgba(235,255,229,.24)';
  for (let i = 0; i < 12; i++) {
    const y = h * (0.18 + i * 0.065);
    ctx.fillRect(0, y, w, 2 + i * 0.2);
  }
  ctx.fillStyle = 'rgba(255,244,168,.16)';
  ctx.beginPath();
  ctx.arc(w * .54, h * .08, Math.min(w, h) * .18 + Math.sin(t) * 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawRiceRows(w, h, t) {
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const y = h * (0.25 + i * 0.08);
    ctx.strokeStyle = i % 2 ? 'rgba(20,122,79,.58)' : 'rgba(239,218,94,.45)';
    ctx.lineWidth = 9 - i * 0.35;
    ctx.beginPath();
    ctx.moveTo(-20, y + Math.sin(t + i) * 7);
    ctx.bezierCurveTo(w * .25, y - 40 + i * 3, w * .68, y + 42 - i * 2, w + 20, y - 8);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.34)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
}

function drawDew(w, h, t) {
  const comm = currentCommission();
  ctx.save();
  for (let i = 0; i < comm.beads.length; i++) {
    const bead = comm.beads[i];
    const x = bead.x * w;
    const y = bead.y * h;
    const active = i === state.dewIndex;
    const done = i < state.dewIndex;
    const pulse = Math.sin(t * 4 + i) * 3;
    ctx.fillStyle = done ? 'rgba(55,202,154,.46)' : active ? 'rgba(255,232,98,.88)' : 'rgba(128,224,255,.72)';
    ctx.strokeStyle = active ? '#fff9b5' : '#2b9eca';
    ctx.lineWidth = active ? 4 : 2;
    ctx.beginPath();
    ctx.arc(x, y, bead.r + (active ? pulse : 0), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#0b4f48';
    ctx.font = `900 ${active ? 18 : 14}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), x, y);
  }
  ctx.restore();
}

function drawPerches(w, h, t) {
  ctx.save();
  currentCommission().perches.forEach((p, i) => {
    const x = p.x * w;
    const y = p.y * h;
    const near = Math.hypot(state.dragonfly.x - x, state.dragonfly.y - y) < 80;
    ctx.strokeStyle = near ? '#ffe56f' : '#2f8d4f';
    ctx.lineWidth = near ? 8 : 5;
    ctx.beginPath();
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x + Math.sin(t + i) * 8, y - 34);
    ctx.stroke();
    ctx.fillStyle = near ? 'rgba(255,239,132,.88)' : 'rgba(255,255,255,.72)';
    ctx.beginPath();
    ctx.ellipse(x, y - 28, 36, 13, Math.sin(t) * .15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a5748';
    ctx.font = '800 12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Perch', x, y - 48);
  });
  ctx.restore();
}

function drawHazards(w, h, t) {
  const comm = currentCommission();
  ctx.save();
  for (const frog of comm.frogs) {
    const x = frog.x * w;
    const y = frog.y * h;
    const phase = (t * .55 + frog.phase) % 1;
    const warn = phase > .62 && phase < .88;
    ctx.fillStyle = warn ? 'rgba(255,138,75,.95)' : 'rgba(73,157,64,.88)';
    ctx.beginPath();
    ctx.ellipse(x, y, 28, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#102b1e';
    ctx.beginPath(); ctx.arc(x - 10, y - 8, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 10, y - 8, 4, 0, Math.PI * 2); ctx.fill();
    if (warn) {
      ctx.strokeStyle = 'rgba(255,116,64,.75)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(w * .5, y - 75, x + frog.lane * w, y - 12);
      ctx.stroke();
    }
  }
  for (const silk of comm.silks) {
    if (silk.clear) continue;
    const flash = state.silkFlash > 0 ? Math.sin(t * 18) * .35 + .65 : .55;
    ctx.strokeStyle = `rgba(235,252,255,${flash})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(silk.x1 * w, silk.y1 * h);
    ctx.lineTo(silk.x2 * w, silk.y2 * h);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.beginPath();
    ctx.arc((silk.x1 + silk.x2) * w / 2, (silk.y1 + silk.y2) * h / 2, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  // gust ribbon
  ctx.strokeStyle = comm.gust > 0 ? 'rgba(74,174,224,.6)' : 'rgba(74,224,190,.6)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  const gy = h * .17;
  if (comm.gust > 0) {
    ctx.moveTo(w * .12, gy); ctx.bezierCurveTo(w * .35, gy - 30, w * .56, gy + 32, w * .83, gy - 2);
  } else {
    ctx.moveTo(w * .88, gy); ctx.bezierCurveTo(w * .65, gy - 30, w * .44, gy + 32, w * .17, gy - 2);
  }
  ctx.stroke();
  ctx.restore();
}

function drawFocus(w, h, t) {
  if (state.focusActive <= 0) return;
  const comm = currentCommission();
  ctx.save();
  ctx.globalAlpha = Math.min(0.8, state.focusActive / 2);
  ctx.strokeStyle = '#ffe879';
  ctx.lineWidth = 5;
  ctx.setLineDash([12, 9]);
  ctx.beginPath();
  comm.beads.forEach((b, i) => {
    const x = b.x * w, y = b.y * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,238,113,.22)';
  for (const p of comm.perches) {
    ctx.beginPath();
    ctx.arc(p.x * w, p.y * h, 60 + Math.sin(t * 5) * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawDragonfly(w, h, t) {
  const d = state.dragonfly;
  ctx.save();
  ctx.translate(d.x, d.y);
  ctx.rotate(d.heading);
  const bob = Math.sin(t * 18) * 2;
  const img = assets.dragonfly;
  if (img.complete && img.naturalWidth) {
    const size = Math.max(76, Math.min(118, w * .12));
    ctx.drawImage(img, -size * .52, -size * .29 + bob, size, size * .58);
  } else {
    ctx.fillStyle = '#0d9488';
    ctx.beginPath(); ctx.ellipse(0, 0, 38, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(251,212,92,.72)';
    ctx.beginPath(); ctx.ellipse(-2, -18, 46, 10, .2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-2, 18, 46, 10, -.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = state.dodgeActive > 0 ? 'rgba(255,230,96,.95)' : 'rgba(255,255,255,.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(d.x, d.y);
  ctx.lineTo(d.x - Math.cos(d.heading) * 56, d.y - Math.sin(d.heading) * 56);
  ctx.stroke();
  ctx.restore();
}

function drawStageLabels(w, h) {
  ctx.save();
  const chips = [
    `Next dew ${state.dewIndex + 1}`,
    state.perchCooldown > 0 ? 'Perched' : 'Reed perch',
    isFrogWarning() ? 'Frog arc!' : 'Frog safe',
    state.focusActive > 0 ? 'Focus route' : 'Tombo Focus'
  ];
  ctx.font = '800 13px system-ui';
  let x = 14;
  let row = 0;
  for (const chip of chips) {
    const width = ctx.measureText(chip).width + 22;
    if (x + width > w - 14) {
      x = 14;
      row += 1;
    }
    const y = h - 36 - row * 28;
    ctx.fillStyle = 'rgba(7,64,54,.76)';
    roundRect(ctx, x, y, width, 24, 12);
    ctx.fill();
    ctx.fillStyle = '#f4fff4';
    ctx.fillText(chip, x + 11, y + 17);
    x += width + 8;
  }
  ctx.restore();
}

function updateHud() {
  els.score.textContent = Math.floor(state.score).toString();
  els.best.textContent = Math.max(state.best, Math.floor(state.score)).toString();
  els.hearts.textContent = '💚'.repeat(Math.max(0, state.hearts));
  els.energy.textContent = `${Math.round(state.energy)}%`;
  els.sun.textContent = `${Math.round(state.sun)}%`;
  els.combo.textContent = state.combo.toFixed(1);
  els.dew.textContent = `${Math.min(state.dewIndex + 1, currentCommission().beads.length)}/${currentCommission().beads.length}`;
  els.perch.textContent = nearbyPerch() ? 'ready' : 'seek';
  els.focus.textContent = `${Math.round(state.focus)}%`;
  els.time.textContent = formatTime(state.elapsed);
  els.helper.textContent = state.message;
}

function updateCommissionUI() {
  const comm = currentCommission();
  els.commissionName.textContent = `${comm.name} ${Math.min(state.dewIndex, comm.beads.length)}/${comm.beads.length}`;
  els.commissionObjective.textContent = comm.goal;
  els.progressTicks.innerHTML = comm.beads.map((_, i) => `<span class="${i < state.dewIndex ? 'done' : ''}">${i + 1}</span>`).join('');
  updateHud();
}

function currentCommission() {
  return commissions[Math.min(state.commission, commissions.length - 1)];
}

function nearbyPerch() {
  const d = state.dragonfly;
  return currentCommission().perches.some((p) => Math.hypot(d.x - p.x * canvas.width, d.y - p.y * canvas.height) < 80);
}

function isFrogWarning() {
  const t = state.elapsed;
  return currentCommission().frogs.some((frog) => {
    const phase = (t * .55 + frog.phase) % 1;
    return phase > .62 && phase < .88;
  });
}

function isFrogHit() {
  if (state.dodgeActive > 0 || state.bellSlow > 0) return false;
  const d = state.dragonfly;
  const t = state.elapsed;
  return currentCommission().frogs.some((frog) => {
    const phase = (t * .55 + frog.phase) % 1;
    if (!(phase > .80 && phase < .94)) return false;
    const x = frog.x * canvas.width;
    const y = frog.y * canvas.height;
    const tx = x + frog.lane * canvas.width;
    return distToSegment(d.x, d.y, x, y, tx, y - 12) < 34;
  });
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.round(rect.width * dpr));
  const height = Math.max(240, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    const oldW = canvas.width || width;
    const oldH = canvas.height || height;
    canvas.width = width;
    canvas.height = height;
    if (state?.dragonfly) {
      state.dragonfly.x = state.dragonfly.x / oldW * width;
      state.dragonfly.y = state.dragonfly.y / oldH * height;
      state.dragonfly.targetX = state.dragonfly.targetX / oldW * width;
      state.dragonfly.targetY = state.dragonfly.targetY / oldH * height;
    }
  }
}

function angleDelta(a, b) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function roundRect(context, x, y, w, h, r) {
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function formatTime(value) {
  const seconds = Math.floor(value || 0);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

window.__day047Debug = {
  getState: () => JSON.parse(JSON.stringify({
    score: state.score,
    hearts: state.hearts,
    energy: state.energy,
    sun: state.sun,
    combo: state.combo,
    focus: state.focus,
    commission: state.commission,
    dewIndex: state.dewIndex,
    blessing: state.blessing,
    paused: state.paused,
    over: state.over,
    message: state.message
  })),
  forceAlignNextDew: () => {
    const bead = currentCommission().beads[state.dewIndex];
    if (!bead) return;
    state.dragonfly.x = bead.x * canvas.width - 26;
    state.dragonfly.y = bead.y * canvas.height;
    state.dragonfly.heading = 0;
    state.dragonfly.targetX = bead.x * canvas.width + 20;
    state.dragonfly.targetY = bead.y * canvas.height;
    state.message = 'Debug aligned dragonfly with next dew bead.';
  },
  forceWin: () => {
    state.score = 6200;
    state.commission = commissions.length - 1;
    state.dewIndex = currentCommission().beads.length;
    triggerBlessing();
  },
  forceGameOver: () => endRun('Debug forced results overlay for QA.'),
  action: handleAction
};

window.addEventListener('resize', () => draw(performance.now() / 1000));
init();
