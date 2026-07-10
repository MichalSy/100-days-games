import * as THREE from './assets/three.module.min.js';

const DAY = 28;
const STORAGE = 'day028-akane-v1';
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const now = () => performance.now() / 1000;

const state = {
  running: false,
  paused: false,
  gameOver: false,
  endless: false,
  score: 0,
  best: Number(localStorage.getItem(`${STORAGE}:best`) || 0),
  bestGrand: localStorage.getItem(`${STORAGE}:grand`) || '—',
  seals: 3,
  alert: 0,
  combo: 1,
  wispsAlive: 4,
  moon: 0,
  bellCharge: 100,
  emaCharges: 2,
  cameraAngle: 0,
  elapsed: 0,
  startedAt: 0,
  activeVigil: 0,
  activeLantern: 0,
  lanternsLit: 0,
  bellUsed: false,
  emaUsed: 0,
  noAlertChain: 0,
  totalLanterns: 0,
  lastWarning: 'Press Start to begin the vigil.',
  holdWisps: true,
  releasePulse: 0,
  moonUntil: 0,
  bellUntil: 0,
  wrongOrderWarnings: 0,
};

const vigils = [
  {
    name: 'First Torii Spark',
    goal: 'Light 3 lanterns in order',
    order: [1, 2, 3],
    alertLimit: 35,
    wispTarget: 4,
    bellRequired: 1,
    scoreGate: 950,
    timeLimit: 105,
    patrolSpeed: 0.55,
    safeRadius: 2.15,
  },
  {
    name: 'Cedar Stair Procession',
    goal: 'Lead wisps up the cedar steps',
    order: [2, 4, 1, 5],
    alertLimit: 45,
    wispTarget: 3,
    bellRequired: 1,
    scoreGate: 2300,
    timeLimit: 155,
    patrolSpeed: 0.78,
    safeRadius: 1.85,
  },
  {
    name: 'Akane Grand Vigil',
    goal: 'Survive crossing cones and light the final route',
    order: [3, 5, 2, 6, 4],
    alertLimit: 55,
    wispTarget: 3,
    bellRequired: 1,
    scoreGate: 4200,
    timeLimit: 250,
    patrolSpeed: 1.02,
    safeRadius: 1.62,
  },
];

const els = Object.fromEntries([
  'menu','startButton','menuBest','menuGrand','score','best','seals','alert','combo','wispCount','moonCharge','cameraAngle',
  'muteButton','vigilName','vigilGoal','lanternOrder','requirements','gameCanvas','stageHint','grandBanner','helperText',
  'stepUp','stepLeft','stepRight','stepDown','callHoldButton','releaseButton','lightButton','bellButton','emaButton','moonButton',
  'cameraButton','pauseButton','restartButton','pauseOverlay','resumeButton','restartPauseButton','mutePauseButton','resultsOverlay',
  'resultTitle','resultStats','badges','restartResultButton'
].map((id) => [id, document.getElementById(id)]));

let renderer, scene, camera, clock;
let sentinel, sentinelHalo, wispGroup, moonPreviewGroup;
let lanterns = [];
let patrols = [];
let emaCharms = [];
let routeLine;
let pointerDown = false;
let audio = { ctx: null, enabled: true };

window.__day028State = state;
window.__day028Audio = audio;

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas: els.gameCanvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x16071f, 0.047);
  camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
  clock = new THREE.Clock();

  const hemi = new THREE.HemisphereLight(0xffd18d, 0x12051f, 2.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xff7b4a, 2.3);
  sun.position.set(-6, 11, 4);
  sun.castShadow = true;
  scene.add(sun);
  const blue = new THREE.PointLight(0x55e9ff, 2, 12);
  blue.position.set(0, 2, 0);
  scene.add(blue);

  buildShrine();
  buildActors();
  buildLanterns();
  buildPatrols();
  buildMoonPreview();
  resize();
  window.addEventListener('resize', resize);
}

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.08, ...options });
}

function buildShrine() {
  const floorMat = material(0x3d3440);
  const pathMat = material(0x5b5654);
  const mossMat = material(0x173f2c);
  const vermilion = material(0xbe2a20);
  const darkWood = material(0x201220);

  const ground = new THREE.Mesh(new THREE.BoxGeometry(18, 0.28, 25), mossMat);
  ground.position.y = -0.16;
  ground.receiveShadow = true;
  scene.add(ground);

  for (let i = 0; i < 12; i++) {
    const z = -10.5 + i * 1.85;
    const x = i % 2 ? 0.25 : -0.25;
    const step = new THREE.Mesh(new THREE.BoxGeometry(5.4 - Math.min(i * 0.06, 0.7), 0.16 + i * 0.025, 1.44), i > 5 ? floorMat : pathMat);
    step.position.set(x, i * 0.035, z);
    step.castShadow = true;
    step.receiveShadow = true;
    scene.add(step);
  }

  [-7.2, 7.2].forEach((x) => {
    const cedar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.62, 9, 12), material(0x2c1514));
    cedar.position.set(x, 4.25, -1.5);
    cedar.castShadow = true;
    scene.add(cedar);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(2.2, 5.5, 14), material(0x082817));
    crown.position.set(x, 9.2, -1.5);
    scene.add(crown);
  });

  [-7, 0, 7].forEach((z, i) => makeTorii(0, z, 1 + i * 0.12, vermilion, darkWood));

  routeLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.12, -10.8), new THREE.Vector3(0, 0.75, 10)]),
    new THREE.LineBasicMaterial({ color: 0xffd77a, transparent: true, opacity: 0.34 })
  );
  scene.add(routeLine);
}

function makeTorii(x, z, scale, vermilion, darkWood) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const postGeo = new THREE.CylinderGeometry(0.17 * scale, 0.24 * scale, 3.2 * scale, 12);
  [-2.15, 2.15].forEach((px) => {
    const p = new THREE.Mesh(postGeo, vermilion);
    p.position.set(px * scale, 1.55 * scale, 0);
    p.castShadow = true;
    group.add(p);
  });
  const cross = new THREE.Mesh(new THREE.BoxGeometry(5.6 * scale, 0.28 * scale, 0.34 * scale), vermilion);
  cross.position.set(0, 3.05 * scale, 0);
  cross.castShadow = true;
  group.add(cross);
  const cap = new THREE.Mesh(new THREE.BoxGeometry(6.25 * scale, 0.22 * scale, 0.52 * scale), darkWood);
  cap.position.set(0, 3.35 * scale, 0);
  cap.castShadow = true;
  group.add(cap);
  scene.add(group);
}

function buildActors() {
  sentinel = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.1, 6), material(0xf27f3f));
  body.position.y = 0.72;
  body.castShadow = true;
  sentinel.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 12), material(0xffc27a));
  head.position.y = 1.42;
  head.castShadow = true;
  sentinel.add(head);
  const earMat = material(0xf0a04d);
  [-0.18, 0.18].forEach((x) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 4), earMat);
    ear.position.set(x, 1.78, 0.02);
    ear.rotation.z = x < 0 ? 0.3 : -0.3;
    sentinel.add(ear);
  });
  sentinel.position.set(0, 0.12, -10);
  scene.add(sentinel);

  sentinelHalo = new THREE.Mesh(
    new THREE.RingGeometry(0.7, 0.76, 48),
    new THREE.MeshBasicMaterial({ color: 0x56e9ff, transparent: true, opacity: 0.56, side: THREE.DoubleSide })
  );
  sentinelHalo.rotation.x = -Math.PI / 2;
  sentinelHalo.position.y = 0.05;
  sentinel.add(sentinelHalo);

  wispGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const wisp = new THREE.Group();
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 12), new THREE.MeshBasicMaterial({ color: 0x56e9ff }));
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff4b8 }));
    const light = new THREE.PointLight(0x56e9ff, 1.2, 3.3);
    wisp.add(flame, core, light);
    wisp.userData = { alive: true, offset: new THREE.Vector3((i - 1.5) * 0.42, 0.85 + i * 0.05, -0.75 - (i % 2) * 0.35), velocity: new THREE.Vector3(), flicker: i * 1.7 };
    wisp.position.copy(sentinel.position).add(wisp.userData.offset);
    wispGroup.add(wisp);
  }
  scene.add(wispGroup);
}

function buildLanterns() {
  const positions = [
    [-1.9, 0.55, -7.2], [2.0, 0.65, -4.8], [-2.2, 0.86, -2.1], [2.4, 1.0, 1.1], [-1.5, 1.22, 4.0], [1.6, 1.42, 7.1]
  ];
  lanterns = positions.map((p, index) => {
    const group = new THREE.Group();
    group.position.set(...p);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.1, 8), material(0x2b1710));
    pole.position.y = -0.45;
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 12), new THREE.MeshBasicMaterial({ color: 0x8b2b1e }));
    lamp.scale.set(1.0, 1.25, 1.0);
    const light = new THREE.PointLight(0xffc15a, 0.25, 0.2);
    const pool = new THREE.Mesh(
      new THREE.RingGeometry(0.85, 0.92, 48),
      new THREE.MeshBasicMaterial({ color: 0xffd77a, transparent: true, opacity: 0.14, side: THREE.DoubleSide })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = -0.52;
    group.add(pole, lamp, light, pool);
    group.userData = { id: index + 1, lit: false, lamp, light, pool };
    scene.add(group);
    return group;
  });
}

function buildPatrols() {
  patrols = [
    { base: new THREE.Vector3(-2.8, 0.16, -5.6), angle: 0.25, speed: 0.8, range: 3.0, width: 0.85, phase: 0 },
    { base: new THREE.Vector3(2.8, 0.38, -1.0), angle: Math.PI - 0.2, speed: 0.65, range: 3.2, width: 0.72, phase: 1.7 },
    { base: new THREE.Vector3(-2.9, 0.62, 3.0), angle: 0.2, speed: 0.78, range: 3.4, width: 0.68, phase: 3.1 },
  ];
  patrols.forEach((patrol) => {
    const coneGeo = new THREE.ConeGeometry(patrol.range * patrol.width, patrol.range, 32, 1, true);
    const cone = new THREE.Mesh(coneGeo, new THREE.MeshBasicMaterial({ color: 0x9b58ff, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }));
    cone.rotation.x = Math.PI / 2;
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 8), new THREE.MeshBasicMaterial({ color: 0xff4a7a }));
    const group = new THREE.Group();
    group.position.copy(patrol.base);
    group.add(cone, eye);
    patrol.group = group;
    patrol.cone = cone;
    scene.add(group);
  });
}

function buildMoonPreview() {
  moonPreviewGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.35 + i * 0.08, 0.38 + i * 0.08, 36), new THREE.MeshBasicMaterial({ color: 0x56e9ff, transparent: true, opacity: 0.0, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.set((i % 2 ? 0.8 : -0.8), 0.08, -8 + i * 2.7);
    moonPreviewGroup.add(ring);
  }
  scene.add(moonPreviewGroup);
}

function resize() {
  const rect = els.gameCanvas.parentElement.getBoundingClientRect();
  renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  camera.aspect = rect.width / Math.max(1, rect.height);
  camera.updateProjectionMatrix();
}

function updateCamera() {
  const radius = window.innerWidth < 760 ? 16.2 : 14.4;
  const theta = state.cameraAngle * Math.PI / 180;
  const target = new THREE.Vector3(0, 0.55, -1.2);
  camera.position.set(Math.sin(theta) * 6.4, 8.4, Math.cos(theta) * radius - 1.8);
  camera.lookAt(target);
}

function ensureAudio() {
  if (!audio.enabled) return;
  if (!audio.ctx) audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (audio.ctx.state !== 'running') audio.ctx.resume();
  window.__day028Audio = audio;
}

function tone(freq = 440, duration = 0.08, type = 'sine', gain = 0.04) {
  if (!audio.enabled) return;
  try {
    ensureAudio();
    const ctx = audio.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(g).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  } catch (error) {
    console.warn('Audio unavailable', error);
    audio.enabled = false;
  }
}

function updateHud() {
  els.menuBest.textContent = state.best;
  els.menuGrand.textContent = state.bestGrand;
  els.score.textContent = Math.floor(state.score);
  els.best.textContent = state.best;
  els.seals.textContent = '◆'.repeat(state.seals) + '◇'.repeat(3 - state.seals);
  els.alert.textContent = `${Math.floor(state.alert)}%`;
  els.combo.textContent = `x${state.combo.toFixed(1)}`;
  els.wispCount.textContent = `${state.wispsAlive}/4`;
  els.moonCharge.textContent = `${Math.floor(state.moon)}%`;
  els.cameraAngle.textContent = `${Math.round(state.cameraAngle)}°`;
  const vigil = currentVigil();
  els.vigilName.textContent = vigil.name;
  els.vigilGoal.textContent = vigil.goal;
  const order = vigil.order.map((id, i) => i < state.activeLantern ? `✓${id}` : id).join(' → ');
  els.lanternOrder.textContent = `Lanterns: ${order}`;
  els.requirements.textContent = `Keep ${vigil.wispTarget}+ wisps · Alert < ${vigil.alertLimit}% · Ring ${vigil.bellRequired} bell · ${Math.max(0, Math.ceil(vigil.timeLimit - state.elapsed))}s`;
  els.helperText.textContent = state.lastWarning;
  els.stageHint.textContent = state.running ? `${vigil.name}: next lantern ${vigil.order[state.activeLantern] ?? 'endless'} · ${state.lastWarning}` : state.lastWarning;
  els.muteButton.textContent = audio.enabled ? 'Audio On' : 'Muted';
  els.muteButton.setAttribute('aria-pressed', String(!audio.enabled));
  els.bellButton.disabled = state.bellCharge < 45;
  els.emaButton.disabled = state.emaCharges <= 0;
  els.moonButton.disabled = state.moon < 100;
}

function currentVigil() {
  return vigils[Math.min(state.activeVigil, vigils.length - 1)];
}

function startGame() {
  ensureAudio();
  tone(523, 0.12, 'triangle', 0.05);
  tone(784, 0.16, 'sine', 0.035);
  Object.assign(state, {
    running: true,
    paused: false,
    gameOver: false,
    endless: false,
    score: 0,
    seals: 3,
    alert: 0,
    combo: 1,
    wispsAlive: 4,
    moon: 0,
    bellCharge: 100,
    emaCharges: 2,
    elapsed: 0,
    startedAt: now(),
    activeVigil: 0,
    activeLantern: 0,
    lanternsLit: 0,
    bellUsed: false,
    emaUsed: 0,
    noAlertChain: 0,
    totalLanterns: 0,
    holdWisps: true,
    releasePulse: 0,
    moonUntil: 0,
    bellUntil: 0,
    wrongOrderWarnings: 0,
    lastWarning: 'Call wisps close, then step toward lantern 1 through the warm light pool.',
  });
  sentinel.position.set(0, 0.12, -10);
  state.cameraAngle = 0;
  emaCharms.forEach((c) => scene.remove(c));
  emaCharms = [];
  lanterns.forEach((l) => setLantern(l, false));
  wispGroup.children.forEach((w, i) => {
    w.userData.alive = true;
    w.position.copy(sentinel.position).add(w.userData.offset);
  });
  els.menu.hidden = true;
  els.resultsOverlay.hidden = true;
  els.pauseOverlay.hidden = true;
  els.grandBanner.hidden = true;
  updateHud();
}

function restart() { startGame(); }

function setPause(force) {
  if (!state.running || state.gameOver) return;
  state.paused = force ?? !state.paused;
  els.pauseOverlay.hidden = !state.paused;
  state.lastWarning = state.paused ? 'Paused. Resume when the crossing cones open.' : 'Vigil resumed. Watch the violet cone timing.';
  updateHud();
}

function endGame(reason) {
  state.gameOver = true;
  state.running = false;
  state.paused = false;
  state.lastWarning = reason;
  if (state.score > state.best) {
    state.best = Math.floor(state.score);
    localStorage.setItem(`${STORAGE}:best`, String(state.best));
  }
  els.resultTitle.textContent = state.endless ? 'Akane Grand Vigil Complete' : 'Vigil Ended';
  els.resultStats.innerHTML = `
    <div><strong>${Math.floor(state.score)}</strong><br>Score</div>
    <div><strong>${state.wispsAlive}/4</strong><br>Wisps preserved</div>
    <div><strong>${Math.floor(state.alert)}%</strong><br>Alert finish</div>
    <div><strong>${state.totalLanterns}</strong><br>Lanterns lit</div>
    <div><strong>${state.seals}/3</strong><br>Spirit seals</div>
    <div><strong>${formatTime(state.elapsed)}</strong><br>Time</div>`;
  const badges = [];
  if (state.alert < 1) badges.push('Silent Torii');
  if (state.wispsAlive === 4) badges.push('All Wisps Preserved');
  if (state.endless) badges.push('Akane Grand Vigil');
  if (state.bellUsed === false) badges.push('No Bell Detour');
  els.badges.innerHTML = badges.map((b) => `<span>${b}</span>`).join('') || '<span>Cedar Apprentice</span>';
  els.resultsOverlay.hidden = false;
  updateHud();
}

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function step(dx, dz) {
  if (!state.running || state.paused || state.gameOver) return;
  ensureAudio();
  const theta = state.cameraAngle * Math.PI / 180;
  const forward = new THREE.Vector3(Math.sin(theta), 0, Math.cos(theta));
  const right = new THREE.Vector3(Math.cos(theta), 0, -Math.sin(theta));
  const move = new THREE.Vector3().addScaledVector(right, dx).addScaledVector(forward, dz);
  if (move.lengthSq() > 0) move.normalize().multiplyScalar(0.82);
  sentinel.position.x = clamp(sentinel.position.x + move.x, -4.2, 4.2);
  sentinel.position.z = clamp(sentinel.position.z + move.z, -10.7, 9.2);
  sentinel.position.y = 0.12 + clamp((sentinel.position.z + 10) * 0.045, 0, 0.78);
  state.score += 4 * state.combo;
  state.lastWarning = 'Stone step placed. Keep wisps inside warm pools before cones sweep.';
  tone(180 + Math.abs(dz) * 40, 0.05, 'triangle', 0.025);
  updateHud();
}

function rotateCamera() {
  state.cameraAngle = (state.cameraAngle + 35) % 360;
  state.lastWarning = 'Camera rotated. Depth lanes, stairs, and cone edges are easier to read now.';
  tone(310, 0.07, 'sine', 0.025);
  updateHud();
}

function callHoldWisps() {
  if (!state.running || state.paused) return;
  ensureAudio();
  state.holdWisps = true;
  state.releasePulse = 0;
  state.moon = clamp(state.moon + 4, 0, 100);
  state.lastWarning = 'Wisps called close. Hold them in warm light until the cone sweeps past.';
  tone(660, 0.12, 'sine', 0.03);
  updateHud();
}

function releaseWisps() {
  if (!state.running || state.paused) return;
  ensureAudio();
  state.holdWisps = false;
  state.releasePulse = 1.6;
  state.lastWarning = 'Wisps released toward the active lantern. Step with them so they stay grouped.';
  tone(740, 0.09, 'triangle', 0.034);
  updateHud();
}

function activeLanternObject() {
  const order = currentVigil().order;
  const id = order[state.activeLantern] ?? order[order.length - 1];
  return lanterns.find((l) => l.userData.id === id) || lanterns[0];
}

function lightLantern() {
  if (!state.running || state.paused) return;
  ensureAudio();
  const lantern = activeLanternObject();
  const dist = sentinel.position.distanceTo(lantern.position);
  const hasWisp = nearestAliveWispDistance(lantern.position) < 2.2;
  if (dist < 2.15 && hasWisp) {
    setLantern(lantern, true);
    state.activeLantern += 1;
    state.lanternsLit += 1;
    state.totalLanterns += 1;
    state.score += 170 * state.combo + (state.wispsAlive === 4 ? 240 : 0);
    state.combo = clamp(state.combo + 0.18, 1, 4.2);
    state.moon = clamp(state.moon + 22, 0, 100);
    state.bellCharge = clamp(state.bellCharge + 16, 0, 100);
    state.noAlertChain += 1;
    state.lastWarning = `Lantern ${lantern.userData.id} lit. Safe pool expanded; guide wisps to the next torii glow.`;
    tone(523, 0.12, 'triangle', 0.045);
    setTimeout(() => tone(784, 0.16, 'sine', 0.035), 35);
    checkVigilProgress();
  } else {
    state.alert = clamp(state.alert + 10, 0, 100);
    state.combo = 1;
    state.wrongOrderWarnings += 1;
    state.lastWarning = dist >= 2.15 ? 'Too far from the active lantern. Step closer before lighting.' : 'A living wisp must reach the lantern before it can bloom.';
    tone(120, 0.15, 'sawtooth', 0.025);
    damageSealIfNeeded();
  }
  updateHud();
}

function setLantern(lantern, lit) {
  lantern.userData.lit = lit;
  lantern.userData.lamp.material.color.setHex(lit ? 0xffd77a : 0x8b2b1e);
  lantern.userData.light.intensity = lit ? 2.45 : 0.25;
  lantern.userData.light.distance = lit ? currentVigil().safeRadius * 2.8 : 0.2;
  lantern.userData.pool.material.opacity = lit ? 0.52 : 0.14;
  const radius = currentVigil().safeRadius * (lit ? 1.0 : 0.58);
  lantern.userData.pool.scale.set(radius, radius, radius);
}

function ringBell() {
  if (!state.running || state.paused || state.bellCharge < 45) return;
  ensureAudio();
  state.bellCharge = 0;
  state.bellUsed = true;
  state.bellUntil = now() + 3.4;
  state.score += 160 * state.combo;
  state.moon = clamp(state.moon + 10, 0, 100);
  state.lastWarning = 'Suzu Bell ripple turned nearby cones away. Move before the echo fades.';
  [880, 660, 990].forEach((f, i) => setTimeout(() => tone(f, 0.18, 'sine', 0.04), i * 70));
  updateHud();
}

function placeEma() {
  if (!state.running || state.paused || state.emaCharges <= 0) return;
  ensureAudio();
  state.emaCharges -= 1;
  state.emaUsed += 1;
  const charm = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.42, 0.08), material(0xd9a456));
  const glow = new THREE.PointLight(0xffd77a, 0.8, 3.3);
  charm.position.copy(sentinel.position).add(new THREE.Vector3(0, 0.45, 0));
  charm.add(board, glow);
  charm.userData = { expires: now() + 12 };
  scene.add(charm);
  emaCharms.push(charm);
  state.score += 130 * state.combo;
  state.lastWarning = 'Ema Charm placed. Wisps can regroup here and block one alert tick.';
  tone(410, 0.08, 'square', 0.025);
  updateHud();
}

function moonVeil() {
  if (!state.running || state.paused || state.moon < 100) return;
  ensureAudio();
  state.moon = 0;
  state.moonUntil = now() + 5.2;
  state.lastWarning = 'Moon Veil active: cones slow and cyan safe-path rings preview the route.';
  [740, 932, 1244].forEach((f, i) => setTimeout(() => tone(f, 0.2, 'sine', 0.034), i * 80));
  updateHud();
}

function nearestAliveWispDistance(position) {
  let min = Infinity;
  wispGroup.children.forEach((w) => {
    if (w.userData.alive) min = Math.min(min, w.position.distanceTo(position));
  });
  return min;
}

function checkVigilProgress() {
  const vigil = currentVigil();
  if (state.activeLantern >= vigil.order.length && state.score >= vigil.scoreGate && state.wispsAlive >= vigil.wispTarget && state.alert <= vigil.alertLimit) {
    if (state.activeVigil >= vigils.length - 1) {
      triggerGrandVigil();
      state.activeLantern = 0;
      state.activeVigil = 1;
      state.endless = true;
    } else {
      state.activeVigil += 1;
      state.activeLantern = 0;
      state.emaCharges = Math.min(3, state.emaCharges + 1);
      state.alert = Math.max(0, state.alert - 14);
      state.seals = Math.min(3, state.seals + 1);
      lanterns.forEach((l) => setLantern(l, false));
      state.lastWarning = `${vigils[state.activeVigil].name} begins. New depth lanes and stricter cones unlocked.`;
    }
  }
}

function triggerGrandVigil() {
  if (!state.endless) {
    state.score += 1800;
    const grand = formatTime(state.elapsed);
    state.bestGrand = grand;
    localStorage.setItem(`${STORAGE}:grand`, grand);
    els.grandBanner.hidden = false;
    setTimeout(() => { els.grandBanner.hidden = true; }, 4200);
    state.lastWarning = 'Akane Grand Vigil ignites! Endless dusk commissions continue.';
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.24, 'triangle', 0.04), i * 110));
  }
}

function damageSealIfNeeded() {
  if (state.alert >= 100) {
    state.seals -= 1;
    state.alert = 68;
    state.lastWarning = 'A spirit seal cracked under shadow alert. Hide wisps in lantern light.';
    if (state.seals <= 0) endGame('All spirit seals cracked. The shrine shadows snuffed the vigil.');
  }
}

function updateWorld(dt) {
  if (!state.running || state.paused || state.gameOver) return;
  state.elapsed = now() - state.startedAt;
  const vigil = currentVigil();
  if (!state.endless && state.elapsed > vigil.timeLimit) endGame('The vigil timer expired before the lantern route was complete.');
  state.bellCharge = clamp(state.bellCharge + dt * 4.5, 0, 100);

  updateWisps(dt);
  updatePatrols(dt);
  updateEma(dt);
  updateScoring(dt);
  checkVigilProgress();
}

function updateWisps(dt) {
  const targetLantern = activeLanternObject();
  wispGroup.children.forEach((w, i) => {
    if (!w.userData.alive) {
      w.visible = false;
      return;
    }
    w.visible = true;
    const data = w.userData;
    let target = new THREE.Vector3();
    if (state.holdWisps) {
      target.copy(sentinel.position).add(data.offset);
    } else {
      target.copy(targetLantern.position).add(new THREE.Vector3((i - 1.5) * 0.22, 0.5 + i * 0.04, 0.25));
      if (state.releasePulse <= 0) target.lerp(sentinel.position.clone().add(data.offset), 0.24);
    }
    emaCharms.forEach((charm) => {
      if (w.position.distanceTo(charm.position) < 2.5) target.lerp(charm.position, 0.45);
    });
    const direction = target.sub(w.position).multiplyScalar(state.holdWisps ? 3.4 : 2.2);
    data.velocity.addScaledVector(direction, dt);
    data.velocity.multiplyScalar(Math.pow(0.08, dt));
    w.position.addScaledVector(data.velocity, dt);
    w.position.y = Math.max(0.45, w.position.y + Math.sin(now() * 3 + data.flicker) * 0.003);
    w.children[0].scale.setScalar(1 + Math.sin(now() * 5.2 + data.flicker) * 0.12);
  });
  state.releasePulse = Math.max(0, state.releasePulse - dt);
  state.wispsAlive = wispGroup.children.filter((w) => w.userData.alive).length;
}

function updatePatrols(dt) {
  const t = now();
  const slow = t < state.moonUntil ? 0.32 : 1;
  const distracted = t < state.bellUntil;
  patrols.forEach((patrol, idx) => {
    const sweep = Math.sin((t + patrol.phase) * patrol.speed * currentVigil().patrolSpeed * slow) * 0.82;
    const turnAway = distracted && patrol.group.position.distanceTo(sentinel.position) < 6 ? 1.2 : 0;
    const angle = patrol.angle + sweep + turnAway;
    patrol.group.rotation.y = angle;
    patrol.group.position.y = patrol.base.y + Math.sin(t * 1.4 + idx) * 0.05;
    patrol.cone.material.opacity = t < state.moonUntil ? 0.13 : 0.22;
    if (distracted) patrol.cone.material.color.setHex(0xffd77a); else patrol.cone.material.color.setHex(0x9b58ff);
    testConeHits(patrol, angle, dt);
  });
}

function testConeHits(patrol, angle, dt) {
  const origin = patrol.group.position;
  const forward = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
  wispGroup.children.forEach((w) => {
    if (!w.userData.alive) return;
    if (isWispSafe(w.position)) return;
    const flat = new THREE.Vector3(w.position.x - origin.x, 0, w.position.z - origin.z);
    const dist = flat.length();
    if (dist > patrol.range || dist < 0.25) return;
    flat.normalize();
    const dot = flat.dot(forward);
    if (dot > Math.cos(patrol.width * 0.55)) {
      state.alert = clamp(state.alert + dt * (state.moonUntil > now() ? 4 : 16), 0, 100);
      state.combo = 1;
      w.children[0].material.color.setHex(0xff6894);
      state.lastWarning = 'Shadow cone brushed an exposed wisp! Pull it into warm lantern light.';
      if (state.alert > 74 && Math.random() < dt * 0.38) {
        if (emaCharms.length) {
          const charm = emaCharms.shift();
          scene.remove(charm);
          state.alert = Math.max(0, state.alert - 18);
          state.lastWarning = 'Ema Charm absorbed the shadow alert and saved a wisp.';
        } else {
          w.userData.alive = false;
          state.alert = clamp(state.alert + 15, 0, 100);
          state.lastWarning = 'A foxfire wisp was snuffed. Light the next lantern quickly.';
          tone(98, 0.22, 'sawtooth', 0.025);
          damageSealIfNeeded();
        }
      }
    } else {
      w.children[0].material.color.setHex(0x56e9ff);
    }
  });
}

function isWispSafe(pos) {
  if (pos.distanceTo(sentinel.position) < 0.95 && state.holdWisps) return true;
  for (const lantern of lanterns) {
    if (lantern.userData.lit && pos.distanceTo(lantern.position) < currentVigil().safeRadius) return true;
  }
  for (const charm of emaCharms) {
    if (pos.distanceTo(charm.position) < 1.3) return true;
  }
  return false;
}

function updateEma() {
  const t = now();
  emaCharms = emaCharms.filter((charm) => {
    const alive = charm.userData.expires > t;
    if (!alive) scene.remove(charm);
    return alive;
  });
}

function updateScoring(dt) {
  let safeWisps = 0;
  wispGroup.children.forEach((w) => { if (w.userData.alive && isWispSafe(w.position)) safeWisps++; });
  if (safeWisps > 0) {
    state.score += safeWisps * 7 * dt * state.combo;
    state.moon = clamp(state.moon + safeWisps * dt * 1.3, 0, 100);
  }
  if (state.alert > 0 && safeWisps === state.wispsAlive) state.alert = Math.max(0, state.alert - dt * 1.8);
  if (state.alert >= 100) damageSealIfNeeded();
}

function render() {
  requestAnimationFrame(render);
  const dt = Math.min(0.05, clock.getDelta());
  updateWorld(dt);
  updateCamera();
  animateScene(dt);
  renderer.render(scene, camera);
  if (state.running) updateHud();
}

function animateScene() {
  const t = now();
  sentinelHalo.material.opacity = state.holdWisps ? 0.6 : 0.25;
  sentinel.rotation.y = Math.sin(t * 1.1) * 0.08;
  lanterns.forEach((l, i) => {
    l.userData.pool.rotation.z = t * 0.18 + i;
    if (l.userData.lit) l.userData.light.intensity = 2.0 + Math.sin(t * 4 + i) * 0.35;
  });
  moonPreviewGroup.children.forEach((ring, i) => {
    ring.material.opacity = state.moonUntil > t ? 0.55 - i * 0.055 : 0;
    ring.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.08);
  });
}

function bind() {
  els.startButton.addEventListener('click', startGame);
  els.stepUp.addEventListener('click', () => step(0, 1));
  els.stepDown.addEventListener('click', () => step(0, -1));
  els.stepLeft.addEventListener('click', () => step(-1, 0));
  els.stepRight.addEventListener('click', () => step(1, 0));
  els.callHoldButton.addEventListener('click', callHoldWisps);
  els.releaseButton.addEventListener('click', releaseWisps);
  els.lightButton.addEventListener('click', lightLantern);
  els.bellButton.addEventListener('click', ringBell);
  els.emaButton.addEventListener('click', placeEma);
  els.moonButton.addEventListener('click', moonVeil);
  els.cameraButton.addEventListener('click', rotateCamera);
  els.pauseButton.addEventListener('click', () => setPause());
  els.resumeButton.addEventListener('click', () => setPause(false));
  els.restartButton.addEventListener('click', restart);
  els.restartPauseButton.addEventListener('click', restart);
  els.restartResultButton.addEventListener('click', restart);
  els.muteButton.addEventListener('click', toggleMute);
  els.mutePauseButton.addEventListener('click', toggleMute);
  els.gameCanvas.addEventListener('pointerdown', (event) => { pointerDown = true; moveToPointer(event); });
  els.gameCanvas.addEventListener('pointermove', (event) => { if (pointerDown) moveToPointer(event); });
  window.addEventListener('pointerup', () => { pointerDown = false; });
  window.addEventListener('keydown', onKey);
}

function toggleMute() {
  audio.enabled = !audio.enabled;
  if (audio.enabled) ensureAudio();
  updateHud();
}

function moveToPointer(event) {
  if (!state.running || state.paused) return;
  const rect = els.gameCanvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  if (Math.abs(x) > Math.abs(y)) step(Math.sign(x), 0); else step(0, -Math.sign(y));
}

function onKey(event) {
  if (event.target?.tagName === 'BUTTON' || event.target?.tagName === 'A') return;
  const key = event.key.toLowerCase();
  if (['arrowup', 'w'].includes(key)) step(0, 1);
  else if (['arrowdown', 's'].includes(key)) step(0, -1);
  else if (['arrowleft', 'a'].includes(key)) step(-1, 0);
  else if (['arrowright', 'd'].includes(key)) step(1, 0);
  else if (key === 'q' || key === 'e') rotateCamera();
  else if (key === ' ' || key === 'enter') state.holdWisps ? releaseWisps() : callHoldWisps();
  else if (key === '1') lightLantern();
  else if (key === '2') ringBell();
  else if (key === '3') placeEma();
  else if (key === 'shift' || key === 'm') moonVeil();
  else if (key === 'p') setPause();
  else if (key === 'r') restart();
}

initThree();
bind();
updateHud();
render();
