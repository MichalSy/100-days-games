const DAY = '037';
const STORAGE = 'day037-kingyo';
const ASSET = (name) => new URL(`./assets/${name}`, import.meta.url).href;

const $ = (id) => document.getElementById(id);
const el = {
  menu: $('menu'), play: $('play'), start: $('startButton'), pause: $('pauseButton'), restart: $('restartButton'),
  canvas: $('gameCanvas'), score: $('scoreChip'), best: $('bestChip'), hearts: $('heartChip'), wet: $('wetChip'), turb: $('turbChip'), combo: $('comboChip'),
  tilt: $('tiltChip'), focus: $('focusChip'), time: $('timeChip'), orderName: $('orderName'), requestList: $('requestList'), patience: $('patienceMeter'),
  turbTarget: $('turbTarget'), swapLimit: $('swapLimit'), bonus: $('bonusObjective'), status: $('statusHelper'),
  tiltButton: $('tiltButton'), liftButton: $('liftButton'), nudgeButton: $('nudgeButton'), swapButton: $('swapButton'), focusButton: $('focusButton'),
  pauseOverlay: $('pauseOverlay'), resume: $('resumeButton'), pauseRestart: $('pauseRestartButton'), mute: $('muteButton'),
  resultsOverlay: $('resultsOverlay'), resultsSummary: $('resultsSummary'), resultsRestart: $('resultsRestartButton'), badgeList: $('badgeList'),
  bestScoreMenu: $('bestScoreMenu'), bestTimeMenu: $('bestTimeMenu'), bestChainMenu: $('bestChainMenu'),
};
const ctx = el.canvas.getContext('2d');
const images = { fish: new Image(), stall: new Image(), helper: new Image(), icons: new Image() };
images.fish.src = ASSET('kingyo-fish.png');
images.stall.src = ASSET('kingyo-stall.png');
images.helper.src = ASSET('kingyo-helper.png');
images.icons.src = ASSET('kingyo-icons.png');

const tiltModes = ['Flat', 'Left Edge', 'Right Edge', 'Nose Down'];
const fishTypes = {
  red: { label: 'Red kingyo', color: '#ff6a2a', sx: 0 },
  comet: { label: 'White-red comet', color: '#fff1e1', sx: 1 },
  calico: { label: 'Calico', color: '#f6ae5f', sx: 2 },
  black: { label: 'Black telescope', color: '#1e293b', sx: 3 },
  rare: { label: 'Spark rare', color: '#ffd45a', sx: 4 },
};
const orders = [
  { name: 'First Lantern Scoop', requests: { red: 1 }, patience: 100, turbTarget: 55, swaps: 2, bonus: 'Bonus: first failed lift is free; keep wetness under 35%.' },
  { name: 'Pattern Bowl Rush', requests: { red: 1, calico: 1, black: 1 }, patience: 92, turbTarget: 62, swaps: 2, bonus: 'Bonus: avoid maple leaves and finish under 45% turbulence.' },
  { name: 'Grand Ennichi Kingyo', requests: { comet: 1, black: 1, rare: 1 }, patience: 82, turbTarget: 60, swaps: 1, bonus: 'Bonus: use Festival Focus before scooping the rare sparkling fish.' },
];

let best = JSON.parse(localStorage.getItem(STORAGE) || '{}');
let state = null;
let raf = 0;
let audio = { ctx: null, enabled: false, muted: false, master: null };
window.__day037Audio = { ctx: null, enabled: false };

function freshState() {
  return {
    running: false, paused: false, gameOver: false, grand: false,
    startTime: performance.now(), elapsed: 0, score: 0, combo: 1, hearts: 3, tears: 0, escaped: 0,
    wet: 6, turb: 8, focus: 0, focusActive: 0, tiltIndex: 0, orderIndex: 0, swapsLeft: orders[0].swaps,
    caught: {}, badges: [], noTearChain: 0, perfectLifts: 0, rareScooped: 0, liftRing: 1,
    net: { x: 450, y: 760, tx: 450, ty: 760, r: 64, angle: -Math.PI / 2, speed: 0, lastX: 450, lastY: 760 },
    bowl: { x: 735, y: 925, nudge: 0 }, pointer: null, ripples: [], splashes: [], fish: [], leaves: [], message: 'Drag the poi net slowly toward the highlighted red fish.',
  };
}

function rand(seed) {
  let x = Math.sin(seed) * 10000;
  return () => { x = Math.sin(x) * 10000; return x - Math.floor(x); };
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function dist(a, b, c, d) { return Math.hypot(a - c, b - d); }
function fmtTime(ms) { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
function saveBest() { localStorage.setItem(STORAGE, JSON.stringify(best)); }
function loadBest() {
  el.bestScoreMenu.textContent = best.score || 0;
  el.bestTimeMenu.textContent = best.time ? fmtTime(best.time) : '—';
  el.bestChainMenu.textContent = best.chain || 0;
  el.best.textContent = best.score || 0;
}

function setupFish() {
  const r = rand(37037 + state.orderIndex * 17);
  const types = state.orderIndex === 0 ? ['red','red','red','calico','comet'] : state.orderIndex === 1 ? ['red','calico','black','red','comet','calico'] : ['comet','black','rare','red','calico','black'];
  state.fish = types.flatMap((type, i) => {
    const count = type === 'rare' ? 1 : (i % 2 ? 1 : 2);
    return Array.from({ length: count }, (_, j) => ({
      id: `${type}-${i}-${j}-${performance.now()}`,
      type, caught: false, startled: 0,
      x: 150 + r() * 610, y: 270 + r() * 540,
      vx: (r() - 0.5) * (0.9 + state.orderIndex * 0.25), vy: (r() - 0.5) * (0.9 + state.orderIndex * 0.25),
      r: type === 'black' ? 34 : type === 'rare' ? 25 : 30,
      swim: r() * Math.PI * 2,
    }));
  });
  state.leaves = Array.from({ length: state.orderIndex }, (_, i) => ({ x: 170 + r() * 560, y: 300 + r() * 500, a: r() * 6.28, spin: (r() - 0.5) * 0.03 }));
}
function setOrder(index) {
  const order = orders[index];
  state.orderIndex = index;
  state.caught = Object.fromEntries(Object.keys(order.requests).map(k => [k, 0]));
  state.swapsLeft = order.swaps;
  state.message = index === 0 ? 'Slow drag: slide the poi under a red fish, then Dip/Lift.' : `New order: ${order.name}. Watch patterns and paper wetness.`;
  setupFish();
  renderOrder();
}
function renderOrder() {
  const order = orders[state.orderIndex];
  el.orderName.textContent = `${order.name} ${state.orderIndex + 1} / ${orders.length}`;
  el.requestList.innerHTML = '';
  for (const [type, needed] of Object.entries(order.requests)) {
    const done = state.caught[type] || 0;
    const pill = document.createElement('span');
    pill.className = `request-pill ${done >= needed ? 'done' : ''}`;
    pill.textContent = `${fishTypes[type].label}: ${done}/${needed}`;
    el.requestList.appendChild(pill);
  }
  el.patience.max = 100; el.patience.value = order.patience;
  el.turbTarget.textContent = `under ${order.turbTarget}%`;
  el.swapLimit.textContent = `${state.swapsLeft}`;
  el.bonus.textContent = order.bonus;
}

function initAudio() {
  if (audio.ctx) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audio.ctx = new AudioContext();
    audio.master = audio.ctx.createGain();
    audio.master.gain.value = audio.muted ? 0 : 0.12;
    audio.master.connect(audio.ctx.destination);
    audio.enabled = true;
    window.__day037Audio = { ctx: audio.ctx, enabled: true };
  } catch (error) {
    console.warn('Audio unavailable', error);
  }
}
function sound(kind) {
  if (!audio.ctx || audio.muted) return;
  const t = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  const freqs = { plink: 680, tilt: 320, lift: 880, miss: 150, tear: 92, ticket: 1040, focus: 520, grand: 760 };
  osc.type = kind === 'tear' || kind === 'miss' ? 'sawtooth' : kind === 'focus' ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(freqs[kind] || 440, t);
  if (kind === 'grand') osc.frequency.exponentialRampToValueAtTime(1220, t + 0.34);
  if (kind === 'tear') osc.frequency.exponentialRampToValueAtTime(58, t + 0.22);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(kind === 'miss' ? 0.07 : 0.12, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + (kind === 'grand' ? 0.42 : 0.18));
  osc.connect(gain).connect(audio.master);
  osc.start(t); osc.stop(t + 0.5);
}

function startGame() {
  initAudio();
  audio.ctx?.resume?.();
  window.__day037Audio = { ctx: audio.ctx, enabled: !!audio.ctx };
  state = freshState();
  setOrder(0);
  state.running = true;
  el.menu.classList.add('hidden'); el.play.classList.remove('hidden'); el.resultsOverlay.classList.add('hidden'); el.pauseOverlay.classList.add('hidden');
  el.canvas.focus({ preventScroll: true });
  sound('plink');
  cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
}
function endGame(reason = 'The stall closes for the night.') {
  state.gameOver = true; state.running = false;
  best.score = Math.max(best.score || 0, state.score);
  best.chain = Math.max(best.chain || 0, state.noTearChain);
  if (state.grand && (!best.time || state.elapsed < best.time)) best.time = state.elapsed;
  saveBest(); loadBest();
  const badges = [...state.badges];
  if (state.rareScooped >= 3) badges.push('Rare fish trio');
  if (state.noTearChain >= 3) badges.push('No-tear artisan');
  if (state.turb < 25) badges.push('Calm water finish');
  el.badgeList.innerHTML = badges.map(b => `<span>${b}</span>`).join('');
  el.resultsSummary.textContent = `${reason} Final score ${state.score}. Orders reached ${state.orderIndex + 1}/${orders.length}. Paper tears ${state.tears}. Rare fish ${state.rareScooped}. Turbulence ${Math.round(state.turb)}%.`;
  el.resultsOverlay.classList.remove('hidden');
}
function pauseGame(show = true) { if (!state) return; state.paused = show; el.pauseOverlay.classList.toggle('hidden', !show); }
function restartGame() { startGame(); }

function update(dt) {
  if (!state.running || state.paused || state.gameOver) return;
  state.elapsed = performance.now() - state.startTime;
  const order = orders[state.orderIndex];
  order.patience -= dt * (state.orderIndex === 0 ? 0.0025 : 0.0042);
  state.wet = clamp(state.wet - dt * 0.004, 0, 100);
  state.turb = clamp(state.turb - dt * 0.003, 0, 100);
  state.focusActive = Math.max(0, state.focusActive - dt);
  const slow = state.focusActive > 0 ? 0.36 : 1;
  state.liftRing = 0.54 + Math.abs(Math.sin(performance.now() / 520)) * 0.46;

  const net = state.net;
  net.lastX = net.x; net.lastY = net.y;
  net.x += (net.tx - net.x) * 0.22; net.y += (net.ty - net.y) * 0.22;
  net.speed = dist(net.x, net.y, net.lastX, net.lastY);
  if (net.speed > 2.2) { state.turb = clamp(state.turb + net.speed * 0.035, 0, 100); state.wet = clamp(state.wet + net.speed * 0.018, 0, 100); }
  net.angle = Math.atan2(net.y - net.lastY, net.x - net.lastX) || net.angle;

  for (const f of state.fish) {
    if (f.caught) continue;
    f.swim += dt * 0.002 * slow;
    f.x += (f.vx + Math.cos(f.swim) * 0.16) * slow * (1 + state.orderIndex * 0.12);
    f.y += (f.vy + Math.sin(f.swim * 0.9) * 0.14) * slow * (1 + state.orderIndex * 0.12);
    if (f.x < 100 || f.x > 800) f.vx *= -1;
    if (f.y < 210 || f.y > 875) f.vy *= -1;
    f.x = clamp(f.x, 96, 804); f.y = clamp(f.y, 205, 878);
    const d = dist(f.x, f.y, net.x, net.y);
    if (d < net.r + f.r && net.speed > 5) {
      f.startled = 900;
      f.vx += (f.x - net.x) * 0.003; f.vy += (f.y - net.y) * 0.003;
      state.turb = clamp(state.turb + 0.04 * dt, 0, 100);
    }
    f.startled = Math.max(0, f.startled - dt);
  }
  for (const leaf of state.leaves) { leaf.a += leaf.spin * dt; }
  state.ripples = state.ripples.filter(r => (r.life -= dt) > 0);
  state.splashes = state.splashes.filter(p => (p.life -= dt) > 0);
  if (state.wet >= 100) tearPaper('The wet poi tears apart — Swap earlier next time.');
  if (state.turb >= 100) endGame('Turbulence scatters the tank.');
  if (order.patience <= 0) endGame('The order patience reaches zero.');
  updateHud();
}
function tearPaper(message) {
  state.hearts -= 1; state.tears += 1; state.wet = 12; state.turb = clamp(state.turb + 14, 0, 100); state.combo = 1; state.message = message; sound('tear');
  state.splashes.push({ x: state.net.x, y: state.net.y, life: 700, color: '#f97373' });
  if (state.hearts <= 0) endGame('All three poi papers are torn.');
}

function lift() {
  if (!state || state.paused || state.gameOver) return;
  sound('lift');
  const net = state.net;
  const order = orders[state.orderIndex];
  let candidates = state.fish.filter(f => !f.caught && order.requests[f.type] && (state.caught[f.type] || 0) < order.requests[f.type]);
  candidates.sort((a, b) => dist(a.x,a.y,net.x,net.y) - dist(b.x,b.y,net.x,net.y));
  const f = candidates[0];
  const timing = state.liftRing < 0.76;
  const overlap = f && dist(f.x, f.y, net.x, net.y) < net.r * (timing ? 0.88 : 0.62);
  const gentle = net.speed < (tiltModes[state.tiltIndex] === 'Flat' ? 5.2 : 6.4);
  const leafHit = state.leaves.some(l => dist(l.x, l.y, net.x, net.y) < net.r * 0.65);
  if (f && overlap && gentle && !leafHit) {
    f.caught = true;
    state.caught[f.type] = (state.caught[f.type] || 0) + 1;
    const rare = f.type === 'rare';
    state.rareScooped += rare ? 1 : 0;
    const base = f.type === 'red' ? 140 : f.type === 'calico' || f.type === 'comet' ? 190 : f.type === 'black' ? 230 : 280;
    state.score += Math.round(base * state.combo + (state.wet < 20 ? 180 : 0));
    state.combo = Math.min(4.5, state.combo + 0.22);
    state.focus = clamp(state.focus + (rare ? 34 : 18), 0, 100);
    state.wet = clamp(state.wet + (rare || f.type === 'black' ? 14 : 8), 0, 100);
    state.turb = clamp(state.turb + 3, 0, 100);
    state.perfectLifts += timing && state.wet < 35 ? 1 : 0;
    state.message = `${fishTypes[f.type].label} lands in the enamel bowl. Chain requested patterns!`;
    state.ripples.push({ x: net.x, y: net.y, life: 700, color: fishTypes[f.type].color });
    sound('ticket'); renderOrder();
    if (Object.entries(order.requests).every(([type, n]) => (state.caught[type] || 0) >= n)) completeOrder();
  } else {
    state.combo = 1;
    state.wet = clamp(state.wet + 16, 0, 100);
    state.turb = clamp(state.turb + (leafHit ? 13 : 8), 0, 100);
    state.message = leafHit ? 'A decoy maple leaf wets the paper — avoid leaves.' : !f ? 'No requested fish under the poi. Highlighted fish count for the order.' : !gentle ? 'Too fast — the fish startles and the paper soaks.' : 'Lift later: wait for the ripple ring to shrink around the fish.';
    state.splashes.push({ x: net.x, y: net.y, life: 600, color: '#7dd3fc' });
    sound('miss');
    if (state.orderIndex === 0 && state.tears === 0 && state.wet > 88) state.wet = 72;
  }
}
function completeOrder() {
  const order = orders[state.orderIndex];
  state.score += 980 + (state.tears === 0 ? 1250 : 0) + (state.turb < 25 ? 520 : 0);
  state.noTearChain += state.tears === 0 ? 1 : 0;
  state.hearts = Math.min(3, state.hearts + 1);
  state.badges.push(`${order.name} ticket`);
  sound('grand');
  if (state.orderIndex >= orders.length - 1) {
    if (!state.grand && state.score >= 5100) {
      state.grand = true; state.score += 2700; state.focus = 100; state.message = 'Kingyo Grand Stall Prize! Endless orders continue.';
      state.badges.push('Kingyo Grand Stall Prize');
    }
    const endless = orders[(state.orderIndex + 1) % orders.length];
    orders.push({ ...endless, name: `Endless ${orders.length - 2}: ${endless.name}`, patience: Math.max(55, endless.patience - 10), turbTarget: Math.max(42, endless.turbTarget - 6), swaps: Math.max(1, endless.swaps - 1) });
  }
  setOrder(state.orderIndex + 1);
}
function swapPoi() {
  if (!state || state.paused || state.gameOver) return;
  if (state.swapsLeft <= 0) { state.message = 'No Swap Poi papers left for this order.'; sound('miss'); return; }
  state.swapsLeft -= 1; state.wet = 5; state.combo = Math.max(1, state.combo - 0.25); state.score = Math.max(0, state.score - 90); state.message = 'Fresh poi paper — clean but costly. Move gently.'; sound('tilt'); renderOrder();
}
function nudgeBowl() {
  if (!state || state.paused || state.gameOver) return;
  state.bowl.nudge = (state.bowl.nudge + 1) % 4;
  const positions = [[735,925],[660,920],[790,870],[605,865]];
  [state.bowl.x, state.bowl.y] = positions[state.bowl.nudge];
  state.turb = clamp(state.turb + 2.5, 0, 100); state.message = 'Bowl Nudge shifts the prize bowl; plan a short carry path.'; sound('tilt');
}
function focus() {
  if (!state || state.paused || state.gameOver) return;
  if (state.focus < 100) { state.message = `Festival Focus needs ${100 - Math.round(state.focus)}% more charge.`; sound('miss'); return; }
  state.focus = 0; state.focusActive = 6500; state.turb = clamp(state.turb - 16, 0, 100); state.message = 'Festival Focus: fish slow, safe arcs and lift rings glow.'; sound('focus');
}

function updateHud() {
  el.score.textContent = state.score; el.best.textContent = best.score || 0; el.hearts.textContent = '♥'.repeat(state.hearts) + '♡'.repeat(Math.max(0, 3 - state.hearts));
  el.wet.textContent = `${Math.round(state.wet)}%`; el.turb.textContent = `${Math.round(state.turb)}%`; el.combo.textContent = `x${state.combo.toFixed(1)}`;
  el.tilt.textContent = tiltModes[state.tiltIndex]; el.tiltButton.textContent = `Tilt Net: ${tiltModes[state.tiltIndex]}`; el.focus.textContent = `${Math.round(state.focus)}%`; el.time.textContent = fmtTime(state.elapsed);
  el.patience.value = orders[state.orderIndex]?.patience ?? 100; el.status.textContent = state.message;
  el.focusButton.disabled = state.focus < 100; el.swapButton.textContent = `Swap Poi: ${state.swapsLeft}`;
}

function resizeCanvas() {
  const box = el.canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  el.canvas.width = Math.max(450, Math.round(box.width * dpr));
  el.canvas.height = Math.max(620, Math.round(box.height * dpr));
  ctx.setTransform(el.canvas.width / 900, 0, 0, el.canvas.height / 1120, 0, 0);
}
function draw() {
  resizeCanvas();
  ctx.clearRect(0, 0, 900, 1120);
  ctx.save();
  ctx.globalAlpha = 0.72;
  if (images.stall.complete) ctx.drawImage(images.stall, 0, -135, 900, 1350);
  ctx.restore();
  drawTank(); drawLeaves(); drawFish(); drawFocus(); drawNet(); drawBowl(); drawParticles();
}
function drawTank() {
  const grd = ctx.createRadialGradient(450, 570, 80, 450, 590, 520);
  grd.addColorStop(0, 'rgba(48, 164, 191, 0.42)'); grd.addColorStop(1, 'rgba(8, 24, 55, 0.82)');
  ctx.fillStyle = grd; roundRect(70, 165, 760, 795, 42); ctx.fill();
  ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(255, 192, 92, 0.9)'; ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(191, 236, 255, 0.28)';
  for (let y = 250; y < 900; y += 72) { ctx.beginPath(); for (let x = 95; x <= 800; x += 24) { const yy = y + Math.sin((x + performance.now()/20) / 48) * 6; x === 95 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); }
  ctx.fillStyle = 'rgba(255, 209, 102, 0.78)'; ctx.font = '800 24px system-ui'; ctx.fillText('Lantern tank', 90, 205);
}
function roundRect(x,y,w,h,r){ ctx.beginPath(); ctx.roundRect?.(x,y,w,h,r) ?? (ctx.rect(x,y,w,h)); }
function drawFish() {
  const cellW = images.fish.width ? images.fish.width / 5 : 204;
  const cellH = images.fish.height ? images.fish.height / 4 : 256;
  const order = orders[state.orderIndex];
  for (const f of state.fish) {
    if (f.caught) continue;
    const requested = order.requests[f.type] && (state.caught[f.type] || 0) < order.requests[f.type];
    if (requested || state.focusActive > 0) {
      ctx.save(); ctx.globalAlpha = requested ? 0.72 : 0.22; ctx.strokeStyle = requested ? '#ffd166' : '#7dd3fc'; ctx.lineWidth = requested ? 4 : 2; ctx.beginPath(); ctx.arc(f.x, f.y, f.r + 10, 0, 6.283); ctx.stroke(); ctx.restore();
    }
    const angle = Math.atan2(f.vy, f.vx) + Math.PI / 2;
    ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(angle); ctx.globalAlpha = f.startled ? 0.72 : 1;
    if (images.fish.complete && images.fish.naturalWidth) ctx.drawImage(images.fish, fishTypes[f.type].sx * cellW + 4, 4, cellW - 8, cellH - 8, -f.r, -f.r * 1.3, f.r * 2, f.r * 2.6);
    else { ctx.fillStyle = fishTypes[f.type].color; ctx.beginPath(); ctx.ellipse(0,0,f.r*0.7,f.r,0,0,6.283); ctx.fill(); }
    ctx.restore();
  }
}
function drawLeaves() { ctx.save(); for (const l of state.leaves) { ctx.translate(l.x,l.y); ctx.rotate(l.a); ctx.fillStyle = '#dc6b2f'; ctx.beginPath(); for(let i=0;i<7;i++){ const a=i*0.9; ctx.lineTo(Math.cos(a)*28, Math.sin(a)*16); } ctx.fill(); ctx.setTransform(el.canvas.width/900,0,0,el.canvas.height/1120,0,0); } ctx.restore(); }
function drawNet() {
  const n = state.net; const tilt = tiltModes[state.tiltIndex];
  ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(n.angle + (tilt === 'Left Edge' ? -0.28 : tilt === 'Right Edge' ? 0.28 : tilt === 'Nose Down' ? 0.08 : 0));
  ctx.globalAlpha = 0.95; ctx.lineWidth = tilt === 'Flat' ? 8 : 11; ctx.strokeStyle = state.wet > 75 ? '#fb7185' : '#ffe5aa'; ctx.fillStyle = state.wet > 75 ? 'rgba(251,113,133,0.16)' : 'rgba(255,255,235,0.2)';
  ctx.beginPath(); ctx.ellipse(0, 0, n.r * (tilt === 'Nose Down' ? 0.72 : 1), n.r * 0.72, 0, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.38)'; for(let i=-3;i<=3;i++){ ctx.beginPath(); ctx.moveTo(i*16, -n.r*0.55); ctx.lineTo(i*16, n.r*0.55); ctx.stroke(); }
  ctx.strokeStyle = '#b17435'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-8, n.r * 0.68); ctx.lineTo(-44, n.r * 1.55); ctx.stroke();
  ctx.restore();
  ctx.save(); ctx.strokeStyle = state.liftRing < 0.76 ? '#7dd3fc' : 'rgba(255,209,102,0.65)'; ctx.lineWidth = 3; ctx.setLineDash([10, 9]); ctx.beginPath(); ctx.arc(n.x, n.y, n.r * state.liftRing, 0, 6.283); ctx.stroke(); ctx.restore();
}
function drawBowl() {
  const b = state.bowl; ctx.save(); ctx.translate(b.x,b.y); ctx.fillStyle = 'rgba(255, 247, 223, 0.95)'; ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(0,0,78,45,0,0,6.283); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#ef4444'; ctx.font = '900 18px system-ui'; ctx.textAlign = 'center'; ctx.fillText('BOWL',0,6); ctx.restore();
}
function drawFocus() {
  if (!state.focusActive) return;
  const order = orders[state.orderIndex]; ctx.save(); ctx.strokeStyle = 'rgba(125,211,252,0.72)'; ctx.lineWidth = 3; ctx.setLineDash([8,10]);
  for (const f of state.fish.filter(f => !f.caught && order.requests[f.type])) { ctx.beginPath(); ctx.moveTo(state.net.x,state.net.y); ctx.lineTo(f.x,f.y); ctx.stroke(); }
  ctx.restore();
}
function drawParticles() { for (const p of [...state.ripples, ...state.splashes]) { const a = clamp(p.life / 700, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = p.color; ctx.lineWidth = 4 * a; ctx.beginPath(); ctx.arc(p.x,p.y,(1-a)*90+12,0,6.283); ctx.stroke(); ctx.restore(); } }
function loop(ts) { const dt = Math.min(50, ts - (loop.last || ts)); loop.last = ts; update(dt); draw(); raf = requestAnimationFrame(loop); }

function canvasPoint(event) { const r = el.canvas.getBoundingClientRect(); const touch = event.touches?.[0] || event.changedTouches?.[0] || event; return { x: ((touch.clientX - r.left) / r.width) * 900, y: ((touch.clientY - r.top) / r.height) * 1120 - (window.innerWidth < 600 ? 36 : 0) }; }
function pointerDown(e) { if (!state || state.paused || state.gameOver) return; e.preventDefault(); state.pointer = true; const p = canvasPoint(e); state.net.tx = clamp(p.x, 95, 805); state.net.ty = clamp(p.y, 205, 890); sound('plink'); }
function pointerMove(e) { if (!state?.pointer) return; e.preventDefault(); const p = canvasPoint(e); state.net.tx = clamp(p.x, 95, 805); state.net.ty = clamp(p.y, 205, 890); }
function pointerUp(e) { if (state) state.pointer = false; }

el.start.addEventListener('click', startGame); el.restart.addEventListener('click', restartGame); el.resultsRestart.addEventListener('click', restartGame); el.pauseRestart.addEventListener('click', restartGame);
el.pause.addEventListener('click', () => pauseGame(true)); el.resume.addEventListener('click', () => pauseGame(false));
el.tiltButton.addEventListener('click', () => { state.tiltIndex = (state.tiltIndex + 1) % tiltModes.length; state.message = `Tilt Net is now ${tiltModes[state.tiltIndex]}. Match the fish approach.`; sound('tilt'); updateHud(); });
el.liftButton.addEventListener('click', lift); el.swapButton.addEventListener('click', swapPoi); el.nudgeButton.addEventListener('click', nudgeBowl); el.focusButton.addEventListener('click', focus);
el.mute.addEventListener('click', () => { audio.muted = !audio.muted; if (audio.master) audio.master.gain.value = audio.muted ? 0 : 0.12; el.mute.textContent = `Mute: ${audio.muted ? 'On' : 'Off'}`; });
el.canvas.addEventListener('pointerdown', pointerDown); el.canvas.addEventListener('pointermove', pointerMove); window.addEventListener('pointerup', pointerUp);
el.canvas.addEventListener('touchstart', pointerDown, { passive: false }); el.canvas.addEventListener('touchmove', pointerMove, { passive: false }); window.addEventListener('touchend', pointerUp, { passive: false });
window.addEventListener('keydown', (e) => {
  if (!state && (e.key === 'Enter' || e.key === ' ')) startGame();
  if (!state) return;
  if (e.key === 'p' || e.key === 'P') pauseGame(!state.paused);
  if (e.key === 'r' || e.key === 'R') restartGame();
  if (e.key === ' ' || e.key === 'Enter') lift();
  if (e.key === 'q' || e.key === 'Q' || e.key === 'e' || e.key === 'E') el.tiltButton.click();
  if (e.key === 'x' || e.key === 'X') swapPoi();
  if (e.key === 'b' || e.key === 'B') nudgeBowl();
  if (e.key === 'f' || e.key === 'F' || e.key === 'Shift') focus();
  const step = 34;
  if (['ArrowLeft','a','A'].includes(e.key)) state.net.tx -= step;
  if (['ArrowRight','d','D'].includes(e.key)) state.net.tx += step;
  if (['ArrowUp','w','W'].includes(e.key)) state.net.ty -= step;
  if (['ArrowDown','s','S'].includes(e.key)) state.net.ty += step;
  state.net.tx = clamp(state.net.tx,95,805); state.net.ty = clamp(state.net.ty,205,890);
});
window.addEventListener('resize', resizeCanvas);
loadBest();
Promise.all(Object.values(images).map(img => img.decode?.().catch(() => {}) || Promise.resolve())).then(() => { resizeCanvas(); if (!state) { state = freshState(); setOrder(0); state.running = false; draw(); state = null; } });
