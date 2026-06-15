import * as THREE from './assets/three.module.min.js';

const TAU = Math.PI * 2;
const STEP = THREE.MathUtils.degToRad(15);
const HIT_TOLERANCE = THREE.MathUtils.degToRad(11.5);
const STORAGE_KEY = 'sora-tideglass-observatory-v1';

const $ = (id) => document.getElementById(id);
const canvas = $('gameCanvas');
const titleScreen = $('titleScreen');
const hud = $('hud');
const controlPad = $('controlPad');
const pauseOverlay = $('pauseOverlay');
const resultsOverlay = $('resultsOverlay');
const helper = $('helper');
const banner = $('banner');

const ui = {
  score: $('scoreText'), best: $('bestText'), phase: $('phaseText'), charged: $('chargedText'), combo: $('comboText'),
  selected: $('selectedText'), timer: $('timerText'), still: $('stillText'), tide: $('tideFill'), menuBests: $('menuBests'),
  stillButton: $('stillButton'), dialNeedle: $('dialNeedle'), resultTitle: $('resultTitle'), resultStats: $('resultStats'), badgeList: $('badgeList')
};

const store = loadStore();
let rngSeed = 6006;

const phases = [
  {
    name: 'Crane', label: 'Crane ✧', duration: 72, tideRate: 1.7, minimal: 12,
    prismCount: 2,
    targetAngles: [42, 137],
    targetNames: ['Wing', 'Crest'],
    colors: [0x65e8ff, 0xffd166],
    sockets: [[-1.55, 0.0], [1.45, 0.36], [0.15, -1.65], [-1.72, 1.28]],
    targets: [[2.65, 1.92], [-2.58, 2.08]],
    wrong: [[2.88, -0.75]], shards: []
  },
  {
    name: 'Fox', label: 'Fox ◇', duration: 78, tideRate: 2.25, minimal: 18,
    prismCount: 3,
    targetAngles: [20, 113, 215],
    targetNames: ['Tail', 'Mask', 'Paw'],
    colors: [0xffd166, 0x9d89ff, 0x65e8ff],
    sockets: [[-1.65, -0.18], [1.55, -0.08], [0.0, 1.68], [0.0, -1.72]],
    targets: [[3.0, 1.1], [-1.15, 3.12], [-2.68, -1.92]],
    wrong: [[2.72, -1.35], [-3.03, 0.72]], shards: [[0.2, -2.58, 70]]
  },
  {
    name: 'Dawn Gate', label: 'Dawn Gate ◎', duration: 82, tideRate: 2.75, minimal: 24,
    prismCount: 4,
    targetAngles: [345, 73, 151, 253],
    targetNames: ['Lintel', 'Bell', 'Sun', 'Path'],
    colors: [0xffd166, 0x65e8ff, 0xff6888, 0x9d89ff],
    sockets: [[-1.75, -0.85], [1.72, -0.82], [1.55, 1.1], [-1.45, 1.25]],
    targets: [[3.18, -0.52], [0.95, 3.18], [-2.85, 1.54], [-0.95, -3.18]],
    wrong: [[2.8, 1.72], [-2.9, -0.95]], shards: [[0.55, -2.58, 100], [-0.55, 2.74, -65]], bonus: [2.18, -2.42]
  }
];

const state = {
  screen: 'menu', running: false, paused: false, ended: false,
  score: 0, combo: 1, tide: 8, still: 0, stillTime: 0,
  phaseIndex: 0, wave: 0, phaseTime: 0, totalTime: 0, selected: 0,
  phase: null, charged: [], progress: [], rotations: 0, misses: 0,
  perfectPhase: true, perfectStreak: 0, maxPerfectStreak: 0,
  calibration: false, calibrationTime: null, bannerTime: 0, lastMistake: 0
};

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x071525, 0.06);
const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const root = new THREE.Group();
scene.add(root);

const pickables = [];
const prisms = [];
const receivers = [];
const wrongReceivers = [];
const shards = [];
const beamLines = [];
const sparkSprites = [];
let emitter;
let boardRing;
let lastTime = performance.now();
let dragStart = null;

initScene();
resize();
updateMenuBests();
setPhase(0);
showMenu();
requestAnimationFrame(loop);

$('startButton').addEventListener('click', startGame);
$('rotateLeft').addEventListener('click', () => rotateSelected(-STEP));
$('rotateRight').addEventListener('click', () => rotateSelected(STEP));
$('stillButton').addEventListener('click', activateStillSky);
$('pauseButton').addEventListener('click', togglePause);
$('resumeButton').addEventListener('click', togglePause);
$('restartButton').addEventListener('click', restartGame);
$('restartPauseButton').addEventListener('click', restartGame);
$('restartResultsButton').addEventListener('click', restartGame);
window.addEventListener('resize', resize);
window.addEventListener('keydown', onKeyDown);
canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointermove', onPointerMove);
canvas.addEventListener('pointerup', onPointerUp);

function loadStore() {
  try {
    return Object.assign({ bestScore: 0, bestTime: null, longestPerfect: 0, highestWave: 0, badges: [] }, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
  } catch {
    return { bestScore: 0, bestTime: null, longestPerfect: 0, highestWave: 0, badges: [] };
  }
}
function saveStore() { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }
function updateMenuBests() {
  ui.menuBests.textContent = `Best score ${store.bestScore || 0} · fastest calibration ${store.bestTime ? `${store.bestTime.toFixed(1)}s` : '—'} · wave ${store.highestWave || 0}`;
}

function initScene() {
  scene.add(new THREE.AmbientLight(0x7fcfff, 1.25));
  const key = new THREE.DirectionalLight(0xffd99a, 2.4); key.position.set(-4, 7, 5); scene.add(key);
  const moon = new THREE.PointLight(0x8fefff, 3.2, 18); moon.position.set(0, 5.8, -3.6); scene.add(moon);

  const board = new THREE.Mesh(
    new THREE.CylinderGeometry(3.35, 3.5, 0.28, 96),
    new THREE.MeshStandardMaterial({ color: 0x153755, metalness: 0.68, roughness: 0.28, transparent: true, opacity: 0.9 })
  );
  board.position.y = -0.14;
  root.add(board);
  boardRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.38, 0.045, 12, 128),
    new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0x4a2b00, metalness: 0.95, roughness: 0.2 })
  );
  boardRing.rotation.x = Math.PI / 2;
  root.add(boardRing);

  const gridMat = new THREE.LineBasicMaterial({ color: 0x83dbff, transparent: true, opacity: 0.16 });
  for (let i = -2; i <= 2; i++) {
    addLine([[-3.0, 0.015, i * 0.72], [3.0, 0.015, i * 0.72]], gridMat, root);
    addLine([[i * 0.72, 0.016, -3.0], [i * 0.72, 0.016, 3.0]], gridMat, root);
  }

  emitter = new THREE.Group();
  const emitterBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.35, 32), new THREE.MeshStandardMaterial({ color: 0x9a702a, metalness: 0.85, roughness: 0.22 }));
  const emitterOrb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 16), new THREE.MeshStandardMaterial({ color: 0xeefdff, emissive: 0x65e8ff, emissiveIntensity: 2.2, roughness: 0.1 }));
  emitterOrb.position.y = 0.38;
  emitter.add(emitterBase, emitterOrb);
  root.add(emitter);

  const cloudMat = new THREE.MeshBasicMaterial({ color: 0x9be8ff, transparent: true, opacity: 0.08, depthWrite: false });
  for (let i = 0; i < 18; i++) {
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.28 + (i % 4) * 0.08, 16, 8), cloudMat);
    const a = i / 18 * TAU;
    cloud.position.set(Math.cos(a) * (4.2 + (i % 3) * 0.4), -0.8 - (i % 2) * 0.18, Math.sin(a) * (4.0 + (i % 4) * 0.25));
    cloud.scale.set(1.9, 0.34, 0.7);
    root.add(cloud);
  }
}

function makePrism(index) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.36, 0.2, 32), new THREE.MeshStandardMaterial({ color: 0x8c6a2e, metalness: 0.9, roughness: 0.24 }));
  base.position.y = 0.08;
  const crystal = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.92, 3), new THREE.MeshPhysicalMaterial({ color: 0x9ef7ff, emissive: 0x1a6f91, emissiveIntensity: 0.55, metalness: 0, roughness: 0.08, transmission: 0.35, transparent: true, opacity: 0.72 }));
  crystal.position.y = 0.64;
  crystal.rotation.y = Math.PI / 3;
  crystal.userData.prismIndex = index;
  const pick = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.48, 1.25, 24), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  pick.position.y = 0.55;
  pick.userData.prismIndex = index;
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.36, 24), new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0x493100, metalness: 0.55, roughness: 0.22 }));
  arrow.position.set(0, 1.18, 0.38);
  arrow.rotation.x = Math.PI / 2;
  const glow = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.025, 8, 42), new THREE.MeshBasicMaterial({ color: 0x65e8ff, transparent: true, opacity: 0.0 }));
  glow.rotation.x = Math.PI / 2;
  glow.position.y = 0.06;
  group.add(base, crystal, arrow, glow, pick);
  pickables.push(pick, crystal);
  root.add(group);
  return { group, crystal, arrow, glow, pick, angle: 0, targetAngle: 0, color: 0x65e8ff, label: `Prism ${index + 1}` };
}

function setPhase(index) {
  const endless = index >= phases.length;
  state.phase = endless ? makeEndlessPhase() : phases[index];
  state.phaseIndex = index;
  state.phaseTime = 0;
  state.charged = Array(state.phase.prismCount).fill(false);
  state.progress = Array(state.phase.prismCount).fill(0);
  state.rotations = 0;
  state.perfectPhase = true;
  state.selected = Math.min(state.selected, state.phase.prismCount - 1);
  buildPhaseObjects();
  updatePrismSelection();
}

function makeEndlessPhase() {
  state.wave += 1;
  const order = seededShuffle([0, 1, 2, 3], rngSeed + state.wave * 37);
  const count = Math.min(4, 2 + Math.floor((state.wave + 1) / 2));
  return {
    name: `Endless ${state.wave}`, label: `Wave ${state.wave} ✦`, duration: Math.max(58, 82 - state.wave * 3), tideRate: 2.7 + state.wave * 0.32, minimal: 16 + count * 4,
    prismCount: count,
    targetAngles: order.slice(0, count).map((n, i) => (n * 83 + state.wave * 31 + i * 19) % 360),
    targetNames: ['North', 'East', 'South', 'West'].slice(0, count),
    colors: [0x65e8ff, 0xffd166, 0xff6888, 0x9d89ff],
    sockets: [[-1.72, -0.92], [1.72, -0.86], [1.38, 1.22], [-1.44, 1.24]],
    targets: [[3.1, -0.4], [1.1, 3.08], [-3.0, 0.75], [-0.95, -3.15]].slice(0, count),
    wrong: [[2.9, 1.32], [-2.85, -1.15]],
    shards: [[0.42, -2.55, 90 + state.wave * 14], [-0.35, 2.63, -60 - state.wave * 8]],
    bonus: state.wave % 2 ? [2.18, -2.3] : null
  };
}

function seededShuffle(arr, seed) {
  const out = arr.slice();
  let x = seed;
  for (let i = out.length - 1; i > 0; i--) {
    x = (x * 1664525 + 1013904223) >>> 0;
    const j = x % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildPhaseObjects() {
  while (prisms.length < 4) prisms.push(makePrism(prisms.length));
  clearObjects(receivers); clearObjects(wrongReceivers); clearObjects(shards); clearObjects(sparkSprites);
  const phase = state.phase;
  prisms.forEach((p, i) => {
    const active = i < phase.prismCount;
    p.group.visible = active;
    if (!active) return;
    const [x, z] = phase.sockets[i];
    p.group.position.set(x, 0, z);
    p.targetAngle = THREE.MathUtils.degToRad(phase.targetAngles[i]);
    p.angle = p.targetAngle + THREE.MathUtils.degToRad([45, -60, 75, -45][i] || 45);
    p.color = phase.colors[i % phase.colors.length];
    p.label = phase.targetNames[i] || `Star ${i + 1}`;
    setPrismAngle(i, p.angle);
  });
  phase.targets.forEach((pos, i) => receivers.push(makeReceiver(pos[0], pos[1], phase.colors[i % phase.colors.length], phase.targetNames[i] || `Star ${i + 1}`, i, false)));
  (phase.wrong || []).forEach((pos, i) => wrongReceivers.push(makeReceiver(pos[0], pos[1], 0xff6888, `Wrong ${i + 1}`, i, true)));
  (phase.shards || []).forEach((s, i) => shards.push(makeShard(s[0], s[1], s[2] || 0, i)));
  if (phase.bonus) receivers.push(makeReceiver(phase.bonus[0], phase.bonus[1], 0xfff3a3, 'Comet bonus', 99, false, true));
}

function clearObjects(list) {
  while (list.length) {
    const obj = list.pop();
    root.remove(obj.group || obj);
  }
}

function makeReceiver(x, z, color, label, index, wrong, bonus = false) {
  const group = new THREE.Group();
  group.position.set(x, 0.18, z);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(bonus ? 0.3 : 0.25, 0.026, 8, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: wrong ? 0.62 : 0.95 }));
  ring.rotation.x = Math.PI / 2;
  const coreGeo = bonus ? new THREE.OctahedronGeometry(0.16) : new THREE.SphereGeometry(0.12, 20, 12);
  const core = new THREE.Mesh(coreGeo, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: wrong ? 0.55 : 1.3, roughness: 0.15 }));
  core.position.y = 0.08;
  const labelSprite = makeTextSprite((wrong ? 'WRONG ' : '') + label, wrong ? '#ff8ea2' : '#dffbff');
  labelSprite.position.set(0, 0.5, 0);
  group.add(ring, core, labelSprite);
  root.add(group);
  return { group, ring, core, index, color, wrong, bonus, x, z };
}

function makeShard(x, z, angle, index) {
  const group = new THREE.Group();
  group.position.set(x, 0.46, z);
  group.rotation.y = THREE.MathUtils.degToRad(angle);
  const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.28), new THREE.MeshStandardMaterial({ color: 0x1c1638, emissive: 0x5e2fff, emissiveIntensity: 0.7, roughness: 0.22 }));
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.016, 8, 32), new THREE.MeshBasicMaterial({ color: 0xff6888, transparent: true, opacity: 0.45 }));
  halo.rotation.x = Math.PI / 2;
  group.add(body, halo);
  root.add(group);
  return { group, baseX: x, baseZ: z, angle, index };
}

function makeTextSprite(text, color = '#dffbff') {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const ctx = c.getContext('2d');
  ctx.font = '800 26px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(4,15,27,0.70)'; roundRect(ctx, 8, 12, 240, 40, 18); ctx.fill();
  ctx.strokeStyle = 'rgba(160,232,255,0.45)'; ctx.lineWidth = 2; roundRect(ctx, 8, 12, 240, 40, 18); ctx.stroke();
  ctx.fillStyle = color; ctx.fillText(text, 128, 33);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.scale.set(0.9, 0.225, 1);
  return sprite;
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function addLine(points, material, parent = root) {
  const geo = new THREE.BufferGeometry().setFromPoints(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const line = new THREE.Line(geo, material);
  parent.add(line);
  return line;
}

function startGame() {
  Object.assign(state, { screen: 'game', running: true, paused: false, ended: false, score: 0, combo: 1, tide: 8, still: 0, stillTime: 0, phaseIndex: 0, wave: 0, phaseTime: 0, totalTime: 0, selected: 0, rotations: 0, misses: 0, perfectStreak: 0, maxPerfectStreak: 0, calibration: false, calibrationTime: null, bannerTime: 0, lastMistake: 0 });
  rngSeed = 6006;
  setPhase(0);
  titleScreen.classList.add('hidden'); resultsOverlay.classList.add('hidden'); pauseOverlay.classList.add('hidden');
  hud.classList.remove('hidden'); controlPad.classList.remove('hidden'); helper.classList.remove('hidden');
  updateUI();
}
function showMenu() { state.screen = 'menu'; titleScreen.classList.remove('hidden'); hud.classList.add('hidden'); controlPad.classList.add('hidden'); helper.classList.add('hidden'); }
function restartGame() { startGame(); }
function togglePause() {
  if (!state.running || state.ended) return;
  state.paused = !state.paused;
  pauseOverlay.classList.toggle('hidden', !state.paused);
}

function endGame(reason) {
  state.ended = true; state.running = false;
  hud.classList.add('hidden'); controlPad.classList.add('hidden'); helper.classList.add('hidden'); pauseOverlay.classList.add('hidden'); resultsOverlay.classList.remove('hidden');
  const badges = computeBadges();
  if (state.score > store.bestScore) store.bestScore = state.score;
  if (state.calibrationTime && (!store.bestTime || state.calibrationTime < store.bestTime)) store.bestTime = state.calibrationTime;
  if (state.maxPerfectStreak > store.longestPerfect) store.longestPerfect = state.maxPerfectStreak;
  if (state.wave > store.highestWave) store.highestWave = state.wave;
  store.badges = Array.from(new Set([...(store.badges || []), ...badges])); saveStore(); updateMenuBests();
  ui.resultTitle.textContent = reason || (state.calibration ? 'Star-tide run complete' : 'Tideglass overflow');
  ui.resultStats.innerHTML = [
    ['Final score', state.score], ['Best score', store.bestScore], ['Reached', state.phase?.name || 'Crane'], ['Calibration', state.calibrationTime ? `${state.calibrationTime.toFixed(1)}s` : 'not yet'], ['Perfect streak', state.maxPerfectStreak], ['Endless wave', state.wave]
  ].map(([a,b]) => `<div><span>${a}</span><strong>${b}</strong></div>`).join('');
  ui.badgeList.innerHTML = badges.length ? badges.map((b) => `<span>${b}</span>`).join('') : '<span>Keep aligning for mastery badges</span>';
}
function computeBadges() {
  const badges = [];
  if (state.phaseIndex > 0 && state.misses === 0) badges.push('Crane no-miss');
  if (state.calibrationTime && state.calibrationTime < 160) badges.push('Sub-160 calibration');
  if (state.maxPerfectStreak >= 12) badges.push('12-node perfect streak');
  if (state.score >= 3600 || state.wave >= 2) badges.push('Endless 3600 chase');
  return badges;
}

function onKeyDown(event) {
  if (state.screen === 'menu' && event.key === 'Enter') { startGame(); return; }
  if (!state.running) return;
  if (event.key === 'p' || event.key === 'P') togglePause();
  if (event.key === 'r' || event.key === 'R') restartGame();
  if (state.paused) return;
  if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') rotateSelected(-STEP);
  if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') rotateSelected(STEP);
  if (event.key === 'q' || event.key === 'Q') selectPrism((state.selected - 1 + state.phase.prismCount) % state.phase.prismCount);
  if (event.key === 'e' || event.key === 'E') selectPrism((state.selected + 1) % state.phase.prismCount);
  if (event.key === ' ' || event.key === 'Shift') activateStillSky();
}

function onPointerDown(event) {
  if (!state.running || state.paused) return;
  dragStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  canvas.setPointerCapture?.(event.pointerId);
  const hit = pickPrism(event.clientX, event.clientY);
  if (hit !== null) selectPrism(hit);
}
function onPointerMove(event) {
  if (!dragStart || dragStart.id !== event.pointerId || state.paused) return;
  const dx = event.clientX - dragStart.x;
  if (Math.abs(dx) > 42) {
    rotateSelected(dx > 0 ? STEP : -STEP);
    dragStart.x = event.clientX;
  }
}
function onPointerUp(event) { if (dragStart?.id === event.pointerId) dragStart = null; }
function pickPrism(x, y) {
  pointer.x = (x / window.innerWidth) * 2 - 1;
  pointer.y = -(y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables, false);
  for (const hit of hits) {
    const idx = hit.object.userData.prismIndex;
    if (Number.isInteger(idx) && idx < state.phase.prismCount) return idx;
  }
  return null;
}
function selectPrism(index) { state.selected = index; updatePrismSelection(); updateUI(); }
function updatePrismSelection() {
  prisms.forEach((p, i) => { p.glow.material.opacity = i === state.selected ? 0.9 : 0.16; p.crystal.material.emissiveIntensity = i === state.selected ? 1.1 : 0.45; });
}
function rotateSelected(delta) {
  if (!state.running || state.paused || !state.phase) return;
  const p = prisms[state.selected];
  setPrismAngle(state.selected, p.angle + delta);
  state.rotations += 1;
  updateUI();
}
function setPrismAngle(index, angle) {
  const p = prisms[index];
  p.angle = normalizeAngle(angle);
  p.group.rotation.y = -p.angle;
  p.arrow.rotation.z = p.angle;
}
function normalizeAngle(a) { return THREE.MathUtils.euclideanModulo(a, TAU); }
function angularDiff(a, b) { return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))); }
function worldAngleFrom(x1, z1, x2, z2) { return normalizeAngle(Math.atan2(z2 - z1, x2 - x1)); }

function activateStillSky() {
  if (!state.running || state.paused || state.still < 100) return;
  state.still = 0; state.stillTime = 6.0;
  banner.textContent = 'Still Sky — tide slows, shards freeze';
  banner.classList.remove('hidden');
  state.bannerTime = 1.6;
}

function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000 || 0.016);
  lastTime = now;
  const t = now / 1000;
  if (state.running && !state.paused && !state.ended) updateGame(dt, t);
  animateScene(dt, t);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updateGame(dt, t) {
  state.totalTime += dt; state.phaseTime += dt;
  if (state.stillTime > 0) state.stillTime = Math.max(0, state.stillTime - dt);
  const stillFactor = state.stillTime > 0 ? 0.28 : 1;
  state.tide += state.phase.tideRate * stillFactor * dt / 10;
  state.lastMistake = Math.max(0, state.lastMistake - dt);
  if (state.phaseTime > state.phase.duration) makeMistake(11, 'Phase clock ran out');
  updateBeams(dt, t);
  if (state.tide >= 100) endGame('Tideglass overflow');
  if (state.bannerTime > 0) {
    state.bannerTime -= dt;
    if (state.bannerTime <= 0) banner.classList.add('hidden');
  }
  updateUI();
}

function updateBeams(dt, t) {
  beamLines.forEach((line) => root.remove(line)); beamLines.length = 0;
  const phase = state.phase;
  let allCharged = true;
  for (let i = 0; i < phase.prismCount; i++) {
    const p = prisms[i];
    const target = receivers.find((r) => r.index === i);
    const start = new THREE.Vector3(0, 0.42, 0);
    const mid = new THREE.Vector3(p.group.position.x, 0.72, p.group.position.z);
    const aligned = angularDiff(p.angle, p.targetAngle) <= HIT_TOLERANCE;
    const pulse = 0.72 + Math.sin(t * 7 + i) * 0.16;
    const color = aligned ? p.color : 0xa6b7c9;
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: aligned ? 0.95 : pulse * 0.45 });
    beamLines.push(addLine([[start.x, start.y, start.z], [mid.x, mid.y, mid.z]], mat));
    let end;
    if (aligned && target) {
      end = new THREE.Vector3(target.x, 0.55, target.z);
      state.progress[i] = Math.min(1.1, state.progress[i] + dt * (state.stillTime > 0 ? 1.35 : 0.86));
      target.ring.scale.setScalar(1 + state.progress[i] * 0.55 + Math.sin(t * 12) * 0.04);
      target.core.material.emissiveIntensity = 1.4 + state.progress[i] * 2.6;
      if (!state.charged[i] && state.progress[i] >= 1) chargeNode(i);
    } else {
      const missLen = 2.2;
      end = new THREE.Vector3(mid.x + Math.cos(p.angle) * missLen, 0.5, mid.z + Math.sin(p.angle) * missLen);
      state.progress[i] = Math.max(0, state.progress[i] - dt * 0.35);
      if (!state.charged[i]) allCharged = false;
      checkHazardOrWrong(p, i);
    }
    const outMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: aligned ? 1 : 0.55 });
    beamLines.push(addLine([[mid.x, mid.y, mid.z], [end.x, end.y, end.z]], outMat));
  }
  state.charged.forEach((v) => { if (!v) allCharged = false; });
  if (allCharged) completePhase();
}

function checkHazardOrWrong(p, i) {
  if (state.lastMistake > 0) return;
  const px = p.group.position.x, pz = p.group.position.z;
  for (const wrong of wrongReceivers) {
    const angle = worldAngleFrom(px, pz, wrong.x, wrong.z);
    if (angularDiff(p.angle, angle) < HIT_TOLERANCE * 0.8) { makeMistake(8, 'Wrong receiver'); return; }
  }
  for (const shard of shards) {
    const angle = worldAngleFrom(px, pz, shard.group.position.x, shard.group.position.z);
    if (angularDiff(p.angle, angle) < HIT_TOLERANCE * 0.9) { makeMistake(8, 'Eclipse shard'); return; }
  }
  if (!state.charged[i] && state.phaseTime > 3 && Math.random() < 0.0025) state.tide += 0.3;
}
function makeMistake(amount) {
  state.tide = Math.min(100, state.tide + amount);
  state.combo = 1; state.misses += 1; state.perfectPhase = false; state.lastMistake = 1.1;
  document.body.classList.remove('flashMistake'); void document.body.offsetWidth; document.body.classList.add('flashMistake');
}
function chargeNode(i) {
  state.charged[i] = true;
  const gain = Math.round(95 * Math.min(5, state.combo));
  state.score += gain;
  state.combo += 1;
  state.perfectStreak += 1;
  state.maxPerfectStreak = Math.max(state.maxPerfectStreak, state.perfectStreak);
  state.still = Math.min(100, state.still + 18);
  const rec = receivers.find((r) => r.index === i);
  if (rec) spawnSpark(rec.x, rec.z, rec.color);
}
function spawnSpark(x, z, color) {
  const sprite = makeTextSprite('+star', '#fff2b4');
  sprite.position.set(x, 0.95, z); sprite.material.opacity = 1;
  sprite.userData.life = 1.0; sprite.userData.color = color;
  sparkSprites.push(sprite); root.add(sprite);
}
function completePhase() {
  const phase = state.phase;
  state.score += 360;
  if (state.perfectPhase) { state.score += 180; state.perfectStreak += 1; }
  else state.perfectStreak = 0;
  if (state.rotations <= phase.minimal) state.score += 120;
  if (state.still >= 100) state.score += 140;
  state.tide = Math.max(0, state.tide - 18);
  state.still = Math.min(100, state.still + 22);
  const justFinishedAuthored = state.phaseIndex === phases.length - 1;
  if (justFinishedAuthored && state.score < 2200) state.score = 2200;
  if (justFinishedAuthored && !state.calibration) {
    state.calibration = true; state.calibrationTime = state.totalTime; state.score += 700;
    banner.textContent = 'Sora Star-Tide Calibration'; banner.classList.remove('hidden'); state.bannerTime = 3.0;
  }
  setPhase(state.phaseIndex + 1);
}

function animateScene(dt, t) {
  root.rotation.y = Math.sin(t * 0.12) * 0.045;
  boardRing.material.emissiveIntensity = 0.6 + Math.sin(t * 1.7) * 0.16;
  prisms.forEach((p, i) => { if (p.group.visible) p.crystal.rotation.y += dt * (0.8 + i * 0.12); });
  shards.forEach((s, i) => {
    const speed = state.stillTime > 0 ? 0.05 : 0.48;
    s.group.rotation.y += dt * speed * (i % 2 ? -1 : 1);
    s.group.position.x = s.baseX + Math.sin(t * 0.7 + i) * 0.22;
    s.group.position.z = s.baseZ + Math.cos(t * 0.6 + i * 2) * 0.16;
  });
  receivers.forEach((r) => { r.group.rotation.y = -root.rotation.y; if (r.bonus) r.core.rotation.y += dt * 2; });
  wrongReceivers.forEach((r) => { r.group.rotation.y = -root.rotation.y; });
  for (let i = sparkSprites.length - 1; i >= 0; i--) {
    const s = sparkSprites[i]; s.userData.life -= dt; s.position.y += dt * 0.35; s.material.opacity = Math.max(0, s.userData.life);
    if (s.userData.life <= 0) { root.remove(s); sparkSprites.splice(i, 1); }
  }
}

function updateUI() {
  ui.score.textContent = String(state.score);
  ui.best.textContent = String(Math.max(store.bestScore || 0, state.score));
  ui.phase.textContent = state.phase?.label || 'Crane';
  ui.charged.textContent = `${state.charged.filter(Boolean).length}/${state.charged.length}`;
  ui.combo.textContent = `x${Math.min(5, state.combo)}`;
  ui.selected.textContent = `Prism ${state.selected + 1}`;
  ui.timer.textContent = `${state.phaseTime.toFixed(1)}s`;
  ui.still.textContent = state.stillTime > 0 ? `${state.stillTime.toFixed(1)}s` : `${Math.floor(state.still)}%`;
  ui.tide.style.width = `${Math.max(0, Math.min(100, state.tide))}%`;
  ui.stillButton.disabled = state.still < 100 || state.stillTime > 0;
  const p = prisms[state.selected];
  const degrees = Math.round(THREE.MathUtils.radToDeg(p?.angle || 0));
  helper.textContent = `Prism ${state.selected + 1} · ${degrees}° · target ${Math.round(THREE.MathUtils.radToDeg(p?.targetAngle || 0))}° · ${p?.label || ''}`;
  ui.dialNeedle.style.transform = `rotate(${degrees}deg)`;
}

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const portrait = h > w;
  camera.position.set(0, portrait ? 7.05 : 5.6, portrait ? 8.65 : 6.1);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}
