const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.querySelector('#menu');
const pauseOverlay = document.querySelector('#pauseOverlay');
const resultsOverlay = document.querySelector('#resultsOverlay');
const grandBanner = document.querySelector('#grandBanner');
const ordersEl = document.querySelector('#orders');
const traySlotsEl = document.querySelector('#traySlots');
const trayTitle = document.querySelector('#trayTitle');

const scoreText = document.querySelector('#scoreText');
const bestText = document.querySelector('#bestText');
const complaintsText = document.querySelector('#complaintsText');
const waveText = document.querySelector('#waveText');
const servedText = document.querySelector('#servedText');
const comboText = document.querySelector('#comboText');
const timeText = document.querySelector('#timeText');
const calmMeter = document.querySelector('#calmMeter');
const calmButton = document.querySelector('#calmButton');

const ASSET_CHEF = new Image();
ASSET_CHEF.src = './assets/nami-chef.png';
const ASSET_BG = new Image();
ASSET_BG.src = './assets/nami-kitchen.png';

const STORAGE_KEY = 'nami-bento-tide-kitchen-v1';
const waves = [
  { name: 'Morning Ferry', untilServed: 4, orderSize: 2, customers: 1, speed: 46, patience: 24, decoy: 0, crab: 0 },
  { name: 'Lunch Bell', untilServed: 9, orderSize: 3, customers: 2, speed: 62, patience: 21, decoy: 0.12, crab: 0.018 },
  { name: 'Festival Rush', untilServed: 15, orderSize: 4, customers: 2, speed: 80, patience: 19, decoy: 0.18, crab: 0.028 },
  { name: 'Endless Rush', untilServed: Infinity, orderSize: 4, customers: 3, speed: 94, patience: 17, decoy: 0.24, crab: 0.038 }
];
const baseTypes = ['rice', 'nori', 'egg', 'fish', 'shrimp', 'pickle'];
const typeInfo = {
  rice: { label: 'RICE', icon: '🍙', color: '#fff9e9', edge: '#4a3020' },
  nori: { label: 'NORI', icon: '▰', color: '#173c25', edge: '#0b1a12', text: '#f4ffe2' },
  egg: { label: 'EGG', icon: '▭', color: '#ffd84b', edge: '#b56b12' },
  fish: { label: 'FISH', icon: '◒', color: '#ff8a4b', edge: '#8f3420' },
  shrimp: { label: 'SHRIMP', icon: '🦐', color: '#ffb180', edge: '#ad4325' },
  pickle: { label: 'PICKLE', icon: '●', color: '#8fd34f', edge: '#245e21' },
  wasabi: { label: 'WASABI', icon: '▲', color: '#a6e05a', edge: '#2b6a22' },
  golden: { label: 'GOLD', icon: '✦', color: '#ffd54a', edge: '#b46b00' },
  garnish: { label: 'WILD', icon: '✦', color: '#ffe88f', edge: '#9b5510' }
};

let size = { w: 0, h: 0, dpr: 1 };
let state = resetState();
let last = performance.now();
let idCounter = 1;
let focusIndex = 0;
let lastOrdersSignature = '';
let lastTraySignature = '';

function resetState() {
  const stats = readStats();
  return {
    mode: 'menu',
    stats,
    score: 0,
    combo: 1,
    comboStreak: 0,
    complaints: 0,
    served: 0,
    cleanStreak: 0,
    bestRunClean: 0,
    elapsed: 0,
    waveIndex: 0,
    orders: [],
    selectedOrderId: null,
    ingredients: [],
    crabs: [],
    particles: [],
    spawnTimer: 0,
    crabTimer: 6,
    waveTimer: 18,
    calm: 0,
    calmActive: 0,
    selectedIngredientId: null,
    dragging: null,
    inactivity: 0,
    grand: false,
    endedReason: '',
    rngSeed: 7007,
    focusKind: 'ingredient'
  };
}

function readStats() {
  try {
    return { best: 0, bestGrand: null, cleanStreak: 0, endlessWave: 0, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return { best: 0, bestGrand: null, cleanStreak: 0, endlessWave: 0 };
  }
}
function saveStats() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stats)); }
function rng() {
  state.rngSeed = (state.rngSeed * 1664525 + 1013904223) >>> 0;
  return state.rngSeed / 4294967296;
}
function pick(arr) { return arr[Math.floor(rng() * arr.length)]; }
function currentWave() { return waves[Math.min(state.waveIndex, waves.length - 1)]; }
function padTime(seconds) { const s = Math.max(0, Math.floor(seconds)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

function resize() {
  size.w = window.innerWidth;
  size.h = window.innerHeight;
  size.dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(size.w * size.dpr);
  canvas.height = Math.floor(size.h * size.dpr);
  canvas.style.width = `${size.w}px`;
  canvas.style.height = `${size.h}px`;
  ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
  updateLanePositions();
}
window.addEventListener('resize', resize, { passive: true });
resize();

function laneBounds() {
  const top = Math.max(190, size.h * 0.27);
  const bottomPanel = document.querySelector('.bottom-panel').getBoundingClientRect();
  const bottom = Math.max(top + 160, bottomPanel.top - 34);
  return { top, bottom, height: bottom - top };
}
function laneY(lane) {
  const b = laneBounds();
  const count = size.h < 700 ? 2 : 3;
  return b.top + (b.height / (count + 1)) * (lane + 1);
}
function laneCount() { return size.h < 700 ? 2 : 3; }
function updateLanePositions() {
  state.ingredients?.forEach((item) => { item.y = laneY(item.lane % laneCount()); });
  state.crabs?.forEach((crab) => { crab.y = laneY(crab.lane % laneCount()) + 20; });
}

function startGame() {
  state = resetState();
  state.mode = 'running';
  state.rngSeed = 7007;
  menu.classList.add('hidden');
  resultsOverlay.classList.add('hidden');
  pauseOverlay.classList.add('hidden');
  grandBanner.classList.add('hidden');
  ensureOrders();
  spawnIngredient(true);
  spawnIngredient(true);
  updateUI();
}
function pauseGame() { if (state.mode === 'running') { state.mode = 'paused'; pauseOverlay.classList.remove('hidden'); } }
function resumeGame() { if (state.mode === 'paused') { state.mode = 'running'; pauseOverlay.classList.add('hidden'); last = performance.now(); } }
function restartGame() { startGame(); }

function makeOrder() {
  const wave = currentWave();
  const sequence = [];
  const available = state.waveIndex === 0 ? ['rice', 'nori', 'egg'] : baseTypes;
  for (let i = 0; i < wave.orderSize; i++) sequence.push(pick(available));
  if (state.waveIndex >= 2 && rng() < 0.45) sequence[sequence.length - 1] = 'garnish';
  const id = idCounter++;
  return { id, name: customerName(), sequence, filled: [], patience: wave.patience, maxPatience: wave.patience, perfect: true, hintPulse: false };
}
function customerName() {
  return pick(['Ferry kid', 'Harbor auntie', 'Tea captain', 'Beach monk', 'Shell twins', 'Kite courier', 'Festival drummer']);
}
function ensureOrders() {
  const wave = currentWave();
  while (state.orders.length < wave.customers) state.orders.push(makeOrder());
  if (!state.selectedOrderId || !state.orders.some((o) => o.id === state.selectedOrderId)) state.selectedOrderId = state.orders[0]?.id ?? null;
}
function activeOrder() { return state.orders.find((o) => o.id === state.selectedOrderId) || state.orders[0]; }

function spawnIngredient(forceGood = false) {
  const wave = currentWave();
  const lane = Math.floor(rng() * laneCount());
  const dir = lane % 2 === 0 ? 1 : -1;
  const x = dir > 0 ? -56 : size.w + 56;
  const order = activeOrder();
  const required = order?.sequence[order.filled.length];
  let type;
  if (forceGood && required && required !== 'garnish') type = required;
  else if (forceGood && required === 'garnish') type = 'golden';
  else if (rng() < wave.decoy) type = 'wasabi';
  else if (rng() < 0.08 + state.waveIndex * 0.025) type = 'golden';
  else type = pick(baseTypes);
  const speed = (wave.speed + rng() * 24 + state.elapsed * 0.1) * dir;
  state.ingredients.push({ id: idCounter++, type, lane, x, y: laneY(lane), vx: speed, r: 28, bob: rng() * Math.PI * 2, age: 0 });
}
function spawnCrab() {
  const lane = Math.floor(rng() * laneCount());
  const dir = rng() > 0.5 ? 1 : -1;
  state.crabs.push({ id: idCounter++, lane, x: dir > 0 ? -44 : size.w + 44, y: laneY(lane) + 20, vx: dir * (58 + state.waveIndex * 16 + rng() * 22), age: 0 });
}

function placeIngredientOnSlot(slotIndex, ingredient) {
  const order = activeOrder();
  if (!order || !ingredient) return false;
  const expectedIndex = order.filled.length;
  if (slotIndex !== expectedIndex) {
    pulseWrong(slotIndex);
    state.inactivity = 0;
    return false;
  }
  const expected = order.sequence[expectedIndex];
  const ok = ingredient.type === expected || (expected === 'garnish' && ['golden', 'shrimp', 'pickle'].includes(ingredient.type));
  if (!ok || ingredient.type === 'wasabi') {
    complaint('Wrong ingredient');
    order.perfect = false;
    removeIngredient(ingredient.id);
    pulseWrong(slotIndex);
    return false;
  }
  order.filled.push(ingredient.type);
  const tier = Math.min(5, state.combo);
  state.score += Math.round(35 * tier + (ingredient.type === 'golden' ? 160 : 0));
  state.comboStreak += 1;
  state.combo = Math.min(5, 1 + Math.floor(state.comboStreak / 3));
  state.calm = Math.min(100, state.calm + (ingredient.type === 'golden' ? 20 : 8));
  burst(ingredient.x, ingredient.y, ingredient.type === 'golden' ? '#ffd54a' : '#fff2d0', 14);
  removeIngredient(ingredient.id);
  state.selectedIngredientId = null;
  state.inactivity = 0;
  if (order.filled.length === order.sequence.length) completeOrder(order);
  updateUI();
  return true;
}
function completeOrder(order) {
  const patienceBonus = Math.round(120 * Math.max(0, order.patience / order.maxPatience));
  state.score += 170 + patienceBonus;
  if (order.perfect) { state.score += 90; state.calm = Math.min(100, state.calm + 12); }
  state.served += 1;
  state.cleanStreak += order.perfect ? 1 : 0;
  state.bestRunClean = Math.max(state.bestRunClean, state.cleanStreak);
  burst(size.w / 2, laneBounds().bottom + 10, '#ffe88f', 28);
  state.orders = state.orders.filter((o) => o.id !== order.id);
  checkWaveProgress();
  ensureOrders();
}
function checkWaveProgress() {
  const wave = currentWave();
  if (state.served >= wave.untilServed && state.waveIndex < 3) {
    state.score += 360;
    state.complaints = Math.max(0, state.complaints - 1);
    state.waveIndex += 1;
    state.orders.length = 0;
    state.selectedOrderId = null;
    state.calm = Math.min(100, state.calm + 24);
    rogueWave(true);
  }
  if (!state.grand && state.waveIndex >= 3 && state.score >= 2400) {
    state.grand = true;
    state.score += 800;
    grandBanner.classList.remove('hidden');
    setTimeout(() => grandBanner.classList.add('hidden'), 3800);
    if (!state.stats.bestGrand || state.elapsed < state.stats.bestGrand) state.stats.bestGrand = Math.round(state.elapsed);
    saveStats();
  }
}
function complaint(reason) {
  state.complaints += 1;
  state.combo = 1;
  state.comboStreak = 0;
  state.cleanStreak = 0;
  state.endedReason = reason;
  burst(size.w / 2, laneBounds().top, '#ff715f', 18);
  if (state.complaints >= 3) endGame(reason);
  updateUI();
}
function removeIngredient(id) { state.ingredients = state.ingredients.filter((i) => i.id !== id); }
function pulseWrong(slotIndex) {
  const slot = traySlotsEl.querySelector(`[data-slot="${slotIndex}"]`);
  if (slot) { slot.classList.add('wrong'); setTimeout(() => slot.classList.remove('wrong'), 500); }
}
function burst(x, y, color, count) {
  for (let i = 0; i < count; i++) state.particles.push({ x, y, color, vx: (rng() - .5) * 180, vy: (rng() - .8) * 170, life: .7 + rng() * .45, age: 0, r: 3 + rng() * 4 });
}
function rogueWave(celebrate = false) {
  state.ingredients.forEach((item) => {
    item.lane = Math.floor(rng() * laneCount());
    item.y = laneY(item.lane);
    item.vx *= item.lane % 2 === 0 ? Math.abs(item.vx) / item.vx || 1 : -(Math.abs(item.vx) / item.vx || 1);
  });
  burst(size.w / 2, (laneBounds().top + laneBounds().bottom) / 2, celebrate ? '#ffe88f' : '#7be8ff', celebrate ? 34 : 22);
}
function activateCalm() {
  if (state.mode !== 'running' || state.calm < 100) return;
  state.calm = 0;
  state.calmActive = 6.5;
  state.crabs.forEach((crab) => { crab.vx *= -1.4; crab.y -= 44; });
  state.orders.forEach((o) => { o.hintPulse = true; setTimeout(() => { o.hintPulse = false; updateUI(); }, 1800); });
  burst(size.w - 80, size.h - 130, '#b9fff4', 30);
  updateUI();
}
function endGame(reason = 'Three complaint shells') {
  state.mode = 'gameover';
  state.endedReason = reason;
  state.stats.best = Math.max(state.stats.best || 0, state.score);
  state.stats.cleanStreak = Math.max(state.stats.cleanStreak || 0, state.bestRunClean);
  state.stats.endlessWave = Math.max(state.stats.endlessWave || 0, state.grand ? Math.max(1, state.served - 15) : 0);
  saveStats();
  showResults();
}

function showResults() {
  const badges = [];
  if (state.complaints === 0 && state.served >= 4) badges.push('Clean Morning Ferry');
  if (state.bestRunClean >= 12) badges.push('12 Clean Orders');
  if (state.grand && state.elapsed < 170) badges.push('Grand under 170s');
  if (state.score >= 4200) badges.push('Endless 4200');
  if (!badges.length) badges.push('Try for a clean streak');
  document.querySelector('#resultsStats').innerHTML = `
    <span>Final score<br><strong>${state.score}</strong></span>
    <span>Best score<br><strong>${state.stats.best}</strong></span>
    <span>Wave reached<br><strong>${currentWave().name}</strong></span>
    <span>Grand Service<br><strong>${state.grand ? 'Unlocked' : 'Not yet'}</strong></span>
    <span>Clean streak<br><strong>${state.bestRunClean}</strong></span>
    <span>Reason<br><strong>${state.endedReason}</strong></span>`;
  document.querySelector('#badgeList').innerHTML = badges.map((b) => `<span>${b}</span>`).join('');
  resultsOverlay.classList.remove('hidden');
}

function update(dt) {
  if (state.mode !== 'running') return;
  state.elapsed += dt;
  state.inactivity += dt;
  state.calmActive = Math.max(0, state.calmActive - dt);
  const wave = currentWave();
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnIngredient();
    state.spawnTimer = Math.max(.55, 1.18 - state.waveIndex * .12 - state.elapsed * .0015) + rng() * .45;
  }
  state.crabTimer -= dt;
  if (state.crabTimer <= 0) {
    if (wave.crab > 0 || state.waveIndex >= 1) spawnCrab();
    state.crabTimer = 5.8 - state.waveIndex * .8 + rng() * 2.5;
  }
  state.waveTimer -= dt;
  if (state.waveTimer <= 0) {
    if (state.waveIndex >= 2) rogueWave();
    state.waveTimer = 20 - state.waveIndex * 3 + rng() * 8;
  }
  const calmMul = state.calmActive > 0 ? .43 : 1;
  state.ingredients.forEach((item) => {
    item.age += dt;
    item.x += item.vx * calmMul * dt;
    item.y = laneY(item.lane) + Math.sin(item.age * 4 + item.bob) * 5;
  });
  const before = state.ingredients.length;
  state.ingredients = state.ingredients.filter((item) => item.x > -90 && item.x < size.w + 90);
  if (state.ingredients.length < before && state.orders[0]) {
    state.orders.forEach((o) => { o.patience = Math.max(0, o.patience - .35); });
  }
  state.crabs.forEach((crab) => {
    crab.age += dt;
    crab.x += crab.vx * (state.calmActive > 0 ? 1.25 : 1) * dt;
    crab.y = laneY(crab.lane) + 24 + Math.sin(crab.age * 6) * 3;
    state.ingredients.forEach((item) => {
      if (Math.hypot(item.x - crab.x, item.y - crab.y) < 38 && item.type !== 'wasabi') {
        removeIngredient(item.id);
        burst(item.x, item.y, '#ff715f', 9);
      }
    });
  });
  state.crabs = state.crabs.filter((c) => c.x > -80 && c.x < size.w + 80);
  state.orders.forEach((order) => {
    order.patience -= dt;
    if (state.calmActive > 0) order.patience += dt * .35;
  });
  const missed = state.orders.filter((o) => o.patience <= 0);
  if (missed.length) {
    state.orders = state.orders.filter((o) => o.patience > 0);
    missed.forEach(() => complaint('Missed order'));
    ensureOrders();
  }
  state.particles.forEach((p) => { p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt; });
  state.particles = state.particles.filter((p) => p.age < p.life);
  updateUI();
}

function draw() {
  ctx.clearRect(0, 0, size.w, size.h);
  drawVignette();
  drawLanes();
  drawCrabs();
  drawIngredients();
  drawParticles();
  drawDragGhost();
}
function drawVignette() {
  const g = ctx.createLinearGradient(0, 0, 0, size.h);
  g.addColorStop(0, 'rgba(132, 255, 238, .08)');
  g.addColorStop(.42, 'rgba(255, 247, 209, .28)');
  g.addColorStop(1, 'rgba(18, 64, 69, .2)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size.w, size.h);
}
function drawLanes() {
  const b = laneBounds();
  for (let i = 0; i < laneCount(); i++) {
    const y = laneY(i);
    ctx.save();
    ctx.globalAlpha = .92;
    ctx.fillStyle = 'rgba(21, 158, 168, .55)';
    roundRect(12, y - 32, size.w - 24, 64, 28, true, false);
    ctx.strokeStyle = 'rgba(255,255,255,.72)';
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 12]);
    ctx.lineDashOffset = (performance.now() / (i % 2 ? -38 : 38)) % 60;
    ctx.beginPath();
    ctx.moveTo(24, y);
    ctx.lineTo(size.w - 24, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = '800 12px system-ui';
    ctx.fillStyle = '#fffbe4';
    ctx.fillText(i % 2 ? '← tide lane' : 'tide lane →', 26, y - 38);
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(255, 246, 210, .18)';
  roundRect(10, b.top - 50, size.w - 20, b.height + 100, 30, true, false);
}
function drawIngredientShape(item, x = item.x, y = item.y, ghost = false) {
  const info = typeInfo[item.type];
  const r = item.r;
  ctx.save();
  ctx.globalAlpha = ghost ? .78 : 1;
  ctx.translate(x, y);
  if (state.selectedIngredientId === item.id && !ghost) {
    ctx.strokeStyle = '#ffe45c';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, r + 7 + Math.sin(performance.now()/140)*2, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = info.color;
  ctx.strokeStyle = info.edge;
  ctx.lineWidth = 3;
  if (item.type === 'nori') {
    roundRect(-20, -25, 40, 50, 9, true, true);
  } else if (item.type === 'egg') {
    roundRect(-27, -18, 54, 36, 12, true, true);
    ctx.strokeStyle = '#ffe98a'; ctx.lineWidth = 2; ctx.strokeRect(-14, -9, 28, 18);
  } else if (item.type === 'fish') {
    ctx.beginPath(); ctx.ellipse(0, 0, 30, 20, -.25, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 3;
    for (let sx=-14; sx<=14; sx+=14) { ctx.beginPath(); ctx.moveTo(sx,-14); ctx.lineTo(sx+8,14); ctx.stroke(); }
  } else if (item.type === 'shrimp' || item.type === 'golden') {
    ctx.beginPath(); ctx.arc(-3, 0, 25, .15*Math.PI, 1.55*Math.PI); ctx.lineWidth = 13; ctx.strokeStyle = info.color; ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = info.edge; ctx.stroke();
    if (item.type === 'golden') { ctx.fillStyle = '#fff4a1'; ctx.fillText('✦', 16, -16); }
  } else if (item.type === 'pickle') {
    ctx.beginPath(); ctx.arc(0, 0, 27, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d8ff9b'; ctx.beginPath(); ctx.arc(-7,-5,4,0,Math.PI*2); ctx.arc(8,3,4,0,Math.PI*2); ctx.fill();
  } else if (item.type === 'wasabi') {
    ctx.beginPath(); ctx.moveTo(0, -30); ctx.quadraticCurveTo(28, -2, 12, 24); ctx.quadraticCurveTo(-12, 34, -27, 9); ctx.quadraticCurveTo(-18, -18, 0, -30); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3b4b22'; ctx.font = '900 20px system-ui'; ctx.fillText('!', -4, 8);
  } else {
    ctx.beginPath(); ctx.arc(0, 0, 27, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1b3327'; roundRect(-12, 3, 24, 15, 4, true, false);
  }
  ctx.fillStyle = info.text || '#22150f';
  ctx.font = '900 9px system-ui';
  ctx.textAlign = 'center';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,.72)';
  ctx.strokeText(info.label, 0, r + 13);
  ctx.fillText(info.label, 0, r + 13);
  ctx.restore();
}
function drawIngredients() { state.ingredients.forEach((item) => drawIngredientShape(item)); }
function drawCrabs() {
  state.crabs.forEach((crab) => {
    ctx.save(); ctx.translate(crab.x, crab.y);
    ctx.fillStyle = '#e85432'; ctx.strokeStyle = '#7c1a13'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 0, 27, 19, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    for (const side of [-1,1]) {
      ctx.beginPath(); ctx.moveTo(side*17,-8); ctx.lineTo(side*34,-20); ctx.lineTo(side*41,-10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(side*17,8); ctx.lineTo(side*36,20); ctx.stroke();
    }
    ctx.fillStyle = '#2a0907'; ctx.beginPath(); ctx.arc(-8,-5,3,0,Math.PI*2); ctx.arc(8,-5,3,0,Math.PI*2); ctx.fill();
    ctx.font = '900 9px system-ui'; ctx.textAlign = 'center'; ctx.fillText('CRAB', 0, 34);
    ctx.restore();
  });
}
function drawParticles() {
  state.particles.forEach((p) => {
    const t = 1 - p.age / p.life;
    ctx.globalAlpha = Math.max(0, t);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * t, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
  });
}
function drawDragGhost() {
  if (!state.dragging?.item) return;
  drawIngredientShape(state.dragging.item, state.dragging.x, state.dragging.y, true);
}
function roundRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  if (fill) ctx.fill(); if (stroke) ctx.stroke();
}

function iconHTML(type, filled = false) {
  const info = typeInfo[type] || typeInfo.garnish;
  const title = type === 'garnish' ? 'Wildcard garnish: golden shrimp, shrimp, or pickle' : info.label;
  return `<span class="mini-icon" title="${title}" style="background:${info.color};border-color:${info.edge};color:${info.text || '#22150f'}"><span>${info.icon}</span><span class="label">${info.label}</span></span>`;
}
function updateUI() {
  scoreText.textContent = String(state.score);
  bestText.textContent = String(Math.max(state.stats.best || 0, state.score));
  complaintsText.textContent = '●'.repeat(state.complaints) + '○'.repeat(Math.max(0, 3 - state.complaints));
  waveText.textContent = currentWave().name;
  servedText.textContent = String(state.served);
  comboText.textContent = `x${state.combo}`;
  timeText.textContent = padTime(state.elapsed);
  calmMeter.textContent = `${Math.floor(state.calm)}%`;
  calmButton.disabled = state.calm < 100 || state.mode !== 'running';
  calmButton.classList.toggle('ready', state.calm >= 100 && state.mode === 'running');
  document.querySelector('#menuBest').textContent = state.stats.best || 0;
  document.querySelector('#menuGrand').textContent = state.stats.bestGrand ? padTime(state.stats.bestGrand) : '—';
  document.querySelector('#menuStreak').textContent = state.stats.cleanStreak || 0;

  const ordersSignature = JSON.stringify(state.orders.map((order) => [
    order.id,
    order.filled.join(','),
    Math.ceil(Math.max(0, order.patience) * 2),
    order.hintPulse,
    order.id === state.selectedOrderId,
    state.inactivity > 2
  ]));
  if (ordersSignature !== lastOrdersSignature) {
    lastOrdersSignature = ordersSignature;
    renderOrders();
  }

  const order = activeOrder();
  const traySignature = order ? `${order.id}|${order.sequence.join(',')}|${order.filled.join(',')}` : 'none';
  if (traySignature !== lastTraySignature) {
    lastTraySignature = traySignature;
    renderTray();
  }
}
function renderOrders() {
  ordersEl.innerHTML = state.orders.map((order) => {
    const active = order.id === state.selectedOrderId ? 'active' : '';
    const pulse = state.inactivity > 2 || order.hintPulse ? ' next-hint' : '';
    const percent = Math.max(0, order.patience / order.maxPatience);
    return `<button class="order-card ${active}${pulse}" data-order="${order.id}" type="button" aria-label="Select ${order.name} order">
      <div class="order-head"><span>${order.name}</span><span>${order.filled.length}/${order.sequence.length}</span></div>
      <div class="order-icons">${order.sequence.map((type, idx) => iconHTML(order.filled[idx] || type)).join('')}</div>
      <div class="progress-wrap"><div class="progress-bar" style="transform:scaleX(${percent})"></div></div>
    </button>`;
  }).join('');
  ordersEl.querySelectorAll('[data-order]').forEach((btn) => btn.addEventListener('click', () => { state.selectedOrderId = Number(btn.dataset.order); state.inactivity = 0; updateUI(); }));
}
function renderTray() {
  const order = activeOrder();
  if (!order) { traySlotsEl.innerHTML = ''; return; }
  trayTitle.textContent = `${order.name}: fill the bento sequence`;
  traySlotsEl.innerHTML = order.sequence.map((type, idx) => {
    const filled = order.filled[idx];
    const isNext = idx === order.filled.length;
    const info = typeInfo[filled || type] || typeInfo.garnish;
    return `<button class="tray-slot ${filled ? 'filled' : ''} ${isNext ? 'next' : ''}" data-slot="${idx}" type="button" aria-label="Tray slot ${idx + 1}, ${filled ? 'filled with ' + typeInfo[filled].label : 'needs ' + info.label}">
      ${filled ? `<span class="slot-icon" style="background:${info.color};border-color:${info.edge};color:${info.text || '#22150f'}"><span>${info.icon}</span></span>` : `<span class="slot-need">${info.label}</span>`}
    </button>`;
  }).join('');
  traySlotsEl.querySelectorAll('[data-slot]').forEach((slot) => slot.addEventListener('click', () => {
    const ingredient = state.ingredients.find((i) => i.id === state.selectedIngredientId);
    placeIngredientOnSlot(Number(slot.dataset.slot), ingredient);
  }));
}

function pointerPos(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}
function findIngredient(x, y) {
  let best = null; let bestDist = 44;
  for (let i = state.ingredients.length - 1; i >= 0; i--) {
    const item = state.ingredients[i];
    const d = Math.hypot(item.x - x, item.y - y);
    if (d < bestDist) { best = item; bestDist = d; }
  }
  return best;
}
function slotAtPoint(x, y) {
  const slots = [...traySlotsEl.querySelectorAll('[data-slot]')];
  return slots.find((slot) => {
    const r = slot.getBoundingClientRect();
    return x >= r.left - 20 && x <= r.right + 20 && y >= r.top - 20 && y <= r.bottom + 20;
  });
}
canvas.addEventListener('pointerdown', (event) => {
  if (state.mode !== 'running') return;
  const pos = pointerPos(event);
  const item = findIngredient(pos.x, pos.y);
  if (!item) return;
  state.selectedIngredientId = item.id;
  state.dragging = { item, x: pos.x, y: pos.y, offsetX: pos.x - item.x, offsetY: pos.y - item.y, moved: false };
  state.inactivity = 0;
  document.body.classList.add('dragging');
  canvas.setPointerCapture(event.pointerId);
  updateUI();
});
canvas.addEventListener('pointermove', (event) => {
  if (!state.dragging) return;
  const pos = pointerPos(event);
  state.dragging.x = pos.x;
  state.dragging.y = pos.y;
  state.dragging.moved = true;
});
canvas.addEventListener('pointerup', (event) => {
  if (!state.dragging) return;
  document.body.classList.remove('dragging');
  const slot = slotAtPoint(event.clientX, event.clientY);
  if (slot) placeIngredientOnSlot(Number(slot.dataset.slot), state.dragging.item);
  state.dragging = null;
});
canvas.addEventListener('click', (event) => {
  if (state.mode !== 'running' || state.dragging) return;
  const pos = pointerPos(event);
  const item = findIngredient(pos.x, pos.y);
  if (item) { state.selectedIngredientId = item.id; state.inactivity = 0; updateUI(); }
});

document.querySelector('#startButton').addEventListener('click', startGame);
document.querySelector('#pauseButton').addEventListener('click', pauseGame);
document.querySelector('#resumeButton').addEventListener('click', resumeGame);
document.querySelector('#restartButton').addEventListener('click', restartGame);
document.querySelector('#restartPauseButton').addEventListener('click', restartGame);
document.querySelector('#restartResultsButton').addEventListener('click', restartGame);
calmButton.addEventListener('click', activateCalm);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && state.mode === 'menu') startGame();
  if (event.key.toLowerCase() === 'p') state.mode === 'paused' ? resumeGame() : pauseGame();
  if (event.key.toLowerCase() === 'r') restartGame();
  if (event.key === ' ' || event.key === 'Shift') { event.preventDefault(); activateCalm(); }
  if (['ArrowRight', 'ArrowDown', 'd', 'D'].includes(event.key)) moveFocus(1);
  if (['ArrowLeft', 'ArrowUp', 'a', 'A'].includes(event.key)) moveFocus(-1);
});
function moveFocus(dir) {
  if (state.mode !== 'running' || !state.ingredients.length) return;
  focusIndex = (focusIndex + dir + state.ingredients.length) % state.ingredients.length;
  state.selectedIngredientId = state.ingredients[focusIndex].id;
  state.inactivity = 0;
  updateUI();
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}
updateUI();
requestAnimationFrame(frame);
