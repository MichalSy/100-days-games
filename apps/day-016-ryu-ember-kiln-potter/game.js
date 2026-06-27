import * as THREE from './assets/three.module.min.js';

const STORE = 'ryu-ember-kiln-potter-v1';
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const fmtTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const $ = (id) => document.getElementById(id);

const commissions = [
  {
    name: 'Tea Bowl Foot',
    title: 'Wide foot, gentle bowl curve',
    text: 'Broad foot, open lip, 1 ash-blue glaze band, steady heat below 72%.',
    labels: ['foot', 'belly', 'lip'],
    target: [0.78, 0.64, 0.92],
    start: [0.62, 0.62, 0.62],
    glaze: [2],
    carve: [],
    heat: [45, 72],
    minMatch: 82,
    fireTicks: 4
  },
  {
    name: 'Incense Cup Lip',
    title: 'Narrow waist, flared lip',
    text: 'Pinch a waist, flare the lip, add 2 blue bands and 3 dragon scales.',
    labels: ['foot', 'lower', 'waist', 'shoulder', 'lip'],
    target: [0.60, 0.70, 0.48, 0.68, 0.88],
    start: [0.60, 0.60, 0.60, 0.60, 0.60],
    glaze: [1, 4],
    carve: [2, 3, 4],
    heat: [48, 68],
    minMatch: 84,
    fireTicks: 5
  },
  {
    name: 'Dragon Kiln Vase',
    title: 'Tall dragon-kiln vase',
    text: 'Tall profile, alternating glaze bands, 5 scale stamps, stricter ember band.',
    labels: ['foot', 'ankle', 'belly', 'waist', 'shoulder', 'neck', 'lip'],
    target: [0.54, 0.68, 0.86, 0.56, 0.75, 0.46, 0.72],
    start: [0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58],
    glaze: [1, 3, 5],
    carve: [0, 2, 3, 4, 6],
    heat: [52, 66],
    minMatch: 86,
    fireTicks: 6
  }
];

let saved = loadSave();
let state;
let selectedRing = 0;
let viewYaw = 0.25;
let cameraDrag = null;
let lastTime = performance.now();
let potGroup;
let targetGroup;
let emberParticles;
let renderer, scene, camera, wheel, wheelTop, mascotPlane;
const root = $('game');

function loadSave() {
  try {
    return { bestScore: 0, bestOffering: null, smoothest: 0, endless: 0, perfectFirings: 0, badges: [], ...(JSON.parse(localStorage.getItem(STORE)) || {}) };
  } catch {
    return { bestScore: 0, bestOffering: null, smoothest: 0, endless: 0, perfectFirings: 0, badges: [] };
  }
}
function persist() { localStorage.setItem(STORE, JSON.stringify(saved)); }

function baseState() {
  return {
    mode: 'menu', score: 0, combo: 1, patience: 3, elapsed: 0, chapter: 0, endless: false,
    radii: [], wobble: [], glaze: [], carve: [], crack: 0, heat: 38, firingTicks: 0,
    perfectFirings: 0, smoothingUsed: 0, offering: false, offeringTime: null, bannerTimer: 0,
    collapseCooldown: 0, currentMatch: 0, phase: 'sculpt'
  };
}

function commissionForChapter() {
  if (state.chapter < commissions.length) return commissions[state.chapter];
  const count = 5 + ((state.chapter - commissions.length) % 4);
  const target = Array.from({ length: count }, (_, i) => 0.54 + 0.18 * Math.sin((state.chapter * 1.7) + i * 1.34) + (i === count - 1 ? 0.15 : 0));
  return {
    name: `Endless Kiln ${state.chapter - commissions.length + 1}`,
    title: 'Endless ash-glaze commission',
    text: 'Unstable clay: match a new silhouette, place marks, and fire in a tighter band.',
    labels: target.map((_, i) => i === 0 ? 'foot' : i === target.length - 1 ? 'lip' : `ring ${i + 1}`),
    target: target.map((v) => clamp(v, 0.42, 0.92)),
    start: target.map(() => 0.60),
    glaze: target.map((_, i) => i).filter((i) => i % 2 === state.chapter % 2).slice(0, 3),
    carve: target.map((_, i) => i).filter((i) => i % 2 !== state.chapter % 2).slice(0, 4),
    heat: [54, 64],
    minMatch: 87,
    fireTicks: 6
  };
}

function startRun() {
  state = baseState();
  $('menuOverlay').hidden = true;
  $('resultsOverlay').hidden = true;
  $('pauseOverlay').hidden = true;
  root.classList.remove('game-over');
  loadCommission();
  state.mode = 'playing';
  lastTime = performance.now();
  resize();
  updateUI();
  rebuildPot();
}

function loadCommission() {
  const c = commissionForChapter();
  state.radii = c.start.slice();
  state.wobble = c.start.map((_, i) => 0.04 + i * 0.005 + (state.endless ? 0.03 : 0));
  state.glaze = c.start.map(() => false);
  state.carve = c.start.map(() => 0);
  state.heat = 38;
  state.firingTicks = 0;
  state.phase = 'sculpt';
  selectedRing = Math.min(selectedRing, state.radii.length - 1);
  $('sculptControls').hidden = false;
  $('firingControls').hidden = true;
  createRingChips();
  updateMetrics();
}

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas: $('stage'), antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 1.2, 6.5);
  scene.add(new THREE.AmbientLight(0xffdfb0, 1.8));
  const key = new THREE.DirectionalLight(0xffbd74, 2.2);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const ember = new THREE.PointLight(0xff6b22, 5, 9);
  ember.position.set(2.8, 0.6, 2.8);
  scene.add(ember);

  const floor = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.2, 0.28, 96), new THREE.MeshStandardMaterial({ color: 0x5b321b, roughness: 0.7, metalness: 0.05 }));
  floor.position.y = -1.45;
  scene.add(floor);
  wheelTop = new THREE.Mesh(new THREE.CylinderGeometry(1.58, 1.58, 0.08, 128), new THREE.MeshStandardMaterial({ color: 0xd8a363, roughness: 0.42 }));
  wheelTop.position.y = -1.25;
  scene.add(wheelTop);
  const groove = new THREE.Mesh(new THREE.TorusGeometry(1.26, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: 0xffdca7, transparent: true, opacity: 0.38 }));
  groove.rotation.x = Math.PI / 2;
  groove.position.y = -1.2;
  scene.add(groove);

  potGroup = new THREE.Group();
  targetGroup = new THREE.Group();
  emberParticles = new THREE.Group();
  scene.add(targetGroup, potGroup, emberParticles);
  createParticles();
  addPointerHandlers();
  resize();
}

function createParticles() {
  emberParticles.clear();
  const mat = new THREE.MeshBasicMaterial({ color: 0xff9238, transparent: true, opacity: 0.72 });
  for (let i = 0; i < 28; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.012 + Math.random() * 0.015, 8, 8), mat);
    p.userData = { speed: 0.12 + Math.random() * 0.32, angle: Math.random() * Math.PI * 2, radius: 1.4 + Math.random() * 1.4 };
    emberParticles.add(p);
  }
}

function rebuildPot() {
  if (!potGroup || !state) return;
  potGroup.clear();
  targetGroup.clear();
  const c = commissionForChapter();
  const n = state.radii.length;
  const height = 2.25 + n * 0.13;
  const yFor = (i) => -1.08 + (i / (n - 1 || 1)) * height;
  const points = [new THREE.Vector2(0.18, -1.18)];
  for (let i = 0; i < n; i++) points.push(new THREE.Vector2(state.radii[i] + state.wobble[i] * Math.sin(i * 1.7), yFor(i)));
  points.push(new THREE.Vector2(Math.max(0.22, state.radii[n - 1] - 0.16), yFor(n - 1) + 0.04));
  const geom = new THREE.LatheGeometry(points, 112);
  geom.computeVertexNormals();
  const clay = new THREE.MeshStandardMaterial({ color: 0xb86a38, roughness: 0.46, metalness: 0.02, emissive: 0x2a0f05, emissiveIntensity: 0.08 });
  const mesh = new THREE.Mesh(geom, clay);
  potGroup.add(mesh);

  for (let i = 0; i < n; i++) {
    const y = yFor(i);
    const ringMat = new THREE.MeshBasicMaterial({ color: i === selectedRing ? 0xfff0a0 : 0xffc978, transparent: true, opacity: i === selectedRing ? 0.96 : 0.42 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(state.radii[i] + 0.028, i === selectedRing ? 0.018 : 0.009, 10, 96), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    potGroup.add(ring);
    if (state.glaze[i]) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(state.radii[i] + 0.04, 0.046, 10, 96), new THREE.MeshStandardMaterial({ color: 0x79b8c8, roughness: 0.18, metalness: 0.04, emissive: 0x123642, emissiveIntensity: 0.2 }));
      band.rotation.x = Math.PI / 2;
      band.position.y = y;
      potGroup.add(band);
    }
    if (state.carve[i]) {
      const carveMat = new THREE.MeshBasicMaterial({ color: 0x4b2312 });
      for (let s = 0; s < Math.min(6, state.carve[i]); s++) {
        const scale = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.08, 3), carveMat);
        const ang = (s / Math.max(1, Math.min(6, state.carve[i]))) * Math.PI * 2 + i * 0.4;
        scale.position.set(Math.cos(ang) * (state.radii[i] + 0.055), y + 0.018 * Math.sin(s), Math.sin(ang) * (state.radii[i] + 0.055));
        scale.rotation.set(Math.PI / 2, 0, -ang);
        potGroup.add(scale);
      }
    }
    const targetRing = new THREE.Mesh(new THREE.TorusGeometry(c.target[i], 0.006, 6, 96), new THREE.MeshBasicMaterial({ color: 0x9feaff, transparent: true, opacity: 0.38 }));
    targetRing.rotation.x = Math.PI / 2;
    targetRing.position.y = y;
    targetGroup.add(targetRing);
  }
  const left = [], right = [];
  for (let i = 0; i < n; i++) { left.push(new THREE.Vector3(-c.target[i], yFor(i), -0.42)); right.push(new THREE.Vector3(c.target[i], yFor(i), -0.42)); }
  targetGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(left), new THREE.LineBasicMaterial({ color: 0x9feaff, transparent: true, opacity: 0.65 })));
  targetGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(right), new THREE.LineBasicMaterial({ color: 0x9feaff, transparent: true, opacity: 0.65 })));
}

function createRingChips() {
  const c = commissionForChapter();
  $('ringChips').innerHTML = c.labels.map((label, i) => `<button type="button" class="ring-chip${i === selectedRing ? ' selected' : ''}" data-ring="${i}" aria-label="Select ${label} ring">${i + 1} ${label}</button>`).join('');
}

function addPointerHandlers() {
  const canvas = $('stage');
  canvas.addEventListener('pointerdown', (event) => {
    if (state?.mode !== 'playing') return;
    canvas.setPointerCapture(event.pointerId);
    cameraDrag = { x: event.clientX, y: event.clientY, yaw: viewYaw, moved: false };
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!cameraDrag) return;
    const dx = event.clientX - cameraDrag.x;
    if (Math.abs(dx) > 4) cameraDrag.moved = true;
    viewYaw = cameraDrag.yaw + dx * 0.006;
  });
  canvas.addEventListener('pointerup', (event) => {
    if (state?.mode !== 'playing' || !cameraDrag) { cameraDrag = null; return; }
    const dy = Math.abs(event.clientY - cameraDrag.y);
    if (!cameraDrag.moved && dy < 12) {
      const rect = canvas.getBoundingClientRect();
      const t = clamp(1 - ((event.clientY - rect.top) / rect.height), 0, 1);
      selectedRing = clamp(Math.round(t * (state.radii.length - 1)), 0, state.radii.length - 1);
      pulseScore(0);
      createRingChips();
      rebuildPot();
      updateUI();
    }
    cameraDrag = null;
  });
}

function selectedTarget() { return commissionForChapter().target[selectedRing]; }
function previousError() { return Math.abs(state.radii[selectedRing] - selectedTarget()); }
function action(name) {
  if (!state) return;
  if (name === 'restart') return startRun();
  if (name === 'pause') return pauseToggle();
  if (state.mode !== 'playing') return;
  if (name === 'ringUp') selectedRing = clamp(selectedRing + 1, 0, state.radii.length - 1);
  if (name === 'ringDown') selectedRing = clamp(selectedRing - 1, 0, state.radii.length - 1);
  if (state.phase === 'firing') {
    if (name === 'bellows') state.heat = clamp(state.heat + 9, 0, 115);
    if (name === 'vent') state.heat = clamp(state.heat - 11, 0, 115);
    if (name === 'steady') state.heat = clamp(state.heat - 0.8, 0, 115);
    updateUI(); return;
  }
  const before = previousError();
  if (name === 'widen') state.radii[selectedRing] = clamp(state.radii[selectedRing] + 0.045, 0.34, 1.04);
  if (name === 'narrow') state.radii[selectedRing] = clamp(state.radii[selectedRing] - 0.045, 0.34, 1.04);
  if (name === 'smooth') {
    const left = state.radii[Math.max(0, selectedRing - 1)];
    const right = state.radii[Math.min(state.radii.length - 1, selectedRing + 1)];
    state.radii[selectedRing] = state.radii[selectedRing] * 0.72 + ((left + right) / 2) * 0.28;
    state.wobble[selectedRing] = Math.max(0, state.wobble[selectedRing] - 0.045);
    state.smoothingUsed++;
    pulseScore(80);
  }
  if (name === 'carve') {
    state.carve[selectedRing] = Math.min(6, state.carve[selectedRing] + 1);
    pulseScore(commissionForChapter().carve.includes(selectedRing) ? 110 : 25);
  }
  if (name === 'glaze') {
    state.glaze[selectedRing] = true;
    pulseScore(commissionForChapter().glaze.includes(selectedRing) ? 110 : 25);
  }
  if (name === 'fire') {
    updateMetrics();
    if (readyToFire()) {
      state.phase = 'firing';
      state.heat = 48;
      state.firingTicks = 0;
      $('sculptControls').hidden = true;
      $('firingControls').hidden = false;
    } else {
      state.crack = clamp(state.crack + 4, 0, 100);
      state.combo = 1;
    }
  }
  if (['widen', 'narrow'].includes(name)) {
    const after = previousError();
    state.wobble[selectedRing] = clamp(state.wobble[selectedRing] + 0.018 + adjacentStress(selectedRing) * 0.02, 0, 0.7);
    pulseScore(after < before ? 35 : -20);
  }
  updateMetrics();
  collapseCheck();
  createRingChips();
  rebuildPot();
  updateUI();
}

function pulseScore(amount) {
  if (amount > 0) {
    state.combo = clamp(state.combo + 0.15, 1, 5);
    state.score += Math.round(amount * state.combo);
  } else if (amount < 0) {
    state.score = Math.max(0, state.score + amount);
    state.combo = 1;
  }
}

function adjacentStress(i) {
  const vals = [];
  if (i > 0) vals.push(Math.abs(state.radii[i] - state.radii[i - 1]));
  if (i < state.radii.length - 1) vals.push(Math.abs(state.radii[i] - state.radii[i + 1]));
  return vals.length ? Math.max(...vals) : 0;
}

function updateMetrics() {
  const c = commissionForChapter();
  let total = 0;
  for (let i = 0; i < state.radii.length; i++) total += clamp(1 - Math.abs(state.radii[i] - c.target[i]) / 0.34, 0, 1);
  const silhouette = (total / state.radii.length) * 100;
  const wobble = state.radii.reduce((sum, _, i) => sum + state.wobble[i] * 38 + adjacentStress(i) * 22, 0) / state.radii.length;
  const thin = state.radii.reduce((sum, r) => sum + Math.max(0, 0.43 - r) * 80, 0);
  state.currentMatch = Math.round(clamp(silhouette - wobble * 0.26, 0, 100));
  state.crack = clamp(state.crack + Math.max(0, wobble - 22) * 0.012 + thin * 0.002, 0, 100);
  state._wobblePct = Math.round(clamp(wobble, 0, 100));
}

function readyToFire() {
  const c = commissionForChapter();
  return state.currentMatch >= c.minMatch && c.glaze.every((i) => state.glaze[i]) && c.carve.every((i) => state.carve[i] > 0);
}

function collapseCheck() {
  if (state.collapseCooldown > 0) return;
  const risky = state._wobblePct > 70 || state.crack >= 100 || state.radii.some((r) => r <= 0.35);
  if (risky) {
    state.patience--;
    state.score = Math.max(0, state.score - 180);
    state.combo = 1;
    state.crack = 30;
    state.collapseCooldown = 1.5;
    const c = commissionForChapter();
    state.radii = state.radii.map((r, i) => (r * 0.45 + c.start[i] * 0.55));
    state.wobble = state.wobble.map(() => 0.08);
    if (state.patience <= 0) return finishGame('Three apprentice patience tiles broke after the vessel collapsed.');
  }
}

function firingStep(dt) {
  const c = commissionForChapter();
  const wind = Math.sin(state.elapsed * 1.7 + state.chapter) * 5 + (state.endless ? 4 : 1.5);
  state.heat = clamp(state.heat + dt * (2.6 + wind), 0, 120);
  if (state.heat > c.heat[1]) state.crack = clamp(state.crack + dt * (state.heat - c.heat[1]) * 0.9, 0, 100);
  if (state.heat < c.heat[0]) state.crack = clamp(state.crack + dt * 1.2, 0, 100);
  if (state.heat >= c.heat[0] && state.heat <= c.heat[1]) {
    state.firingTicks += dt;
    if (Math.floor(state.firingTicks * 2) !== Math.floor((state.firingTicks - dt) * 2)) pulseScore(45);
  }
  if (state.crack >= 100 || state.heat >= 112) {
    state.patience--;
    state.crack = 38;
    state.phase = 'sculpt';
    $('sculptControls').hidden = false;
    $('firingControls').hidden = true;
    if (state.patience <= 0) finishGame('The kiln overheated and the last patience tile cracked.');
  }
  if (state.firingTicks >= c.fireTicks) completeCommission();
}

function completeCommission() {
  const noCracks = state.crack < 18;
  pulseScore(420 + (noCracks ? 520 : 0));
  if (noCracks) state.perfectFirings++;
  if (state.patience < 3) state.patience++;
  const smoothPct = state.currentMatch;
  saved.smoothest = Math.max(saved.smoothest || 0, smoothPct);
  state.chapter++;
  if (state.chapter >= commissions.length) state.endless = true;
  if (!state.offering && state.chapter >= commissions.length && state.score >= 3000) {
    state.offering = true;
    state.offeringTime = state.elapsed;
    state.score += 980;
    state.bannerTimer = 4.2;
    $('offeringBanner').hidden = false;
    awardBadge('Ryu Ember Offering');
    if (!saved.bestOffering || state.elapsed < saved.bestOffering) saved.bestOffering = Math.round(state.elapsed);
  }
  if (state.endless) saved.endless = Math.max(saved.endless || 0, state.chapter - commissions.length + 1);
  saved.perfectFirings = Math.max(saved.perfectFirings || 0, state.perfectFirings);
  loadCommission();
  updateUI();
  rebuildPot();
}

function awardBadge(name) {
  if (!saved.badges.includes(name)) saved.badges.push(name);
}

function finishGame(reason) {
  state.mode = 'gameover';
  saved.bestScore = Math.max(saved.bestScore || 0, state.score);
  if (state.perfectFirings >= 3) awardBadge('Three perfect firings');
  if (state.offering && state.offeringTime <= 195) awardBadge('Offering under 195s');
  if (state.smoothingUsed === 0 && state.chapter > 0) awardBadge('Zero-smoothing commission');
  persist();
  $('resultsText').textContent = `${reason} Final score ${state.score}. Reached ${commissionForChapter().name}. Smoothest vessel ${saved.smoothest || state.currentMatch}%. Perfect firings this run ${state.perfectFirings}.`;
  $('badgeList').innerHTML = (saved.badges.length ? saved.badges : ['Keep shaping for mastery badges']).map((b) => `<span>${b}</span>`).join('');
  $('resultsOverlay').hidden = false;
  updateUI();
}

function pauseToggle() {
  if (!state || state.mode === 'menu' || state.mode === 'gameover') return;
  if (state.mode === 'paused') { state.mode = 'playing'; $('pauseOverlay').hidden = true; lastTime = performance.now(); }
  else { state.mode = 'paused'; $('pauseOverlay').hidden = false; }
}

function updateUI() {
  if (!state) return;
  const c = commissionForChapter();
  saved.bestScore = Math.max(saved.bestScore || 0, state.score);
  $('scoreText').textContent = String(state.score);
  $('bestText').textContent = String(saved.bestScore || 0);
  $('patienceText').textContent = '■'.repeat(Math.max(0, state.patience)) + '□'.repeat(Math.max(0, 3 - state.patience));
  $('timeText').textContent = fmtTime(state.elapsed);
  $('comboText').textContent = `x${state.combo.toFixed(1)}`;
  $('heatText').textContent = `${Math.round(state.heat)}%`;
  $('wobbleText').textContent = `${state._wobblePct || 0}%`;
  $('crackText').textContent = `${Math.round(state.crack)}%`;
  $('chapterText').textContent = c.name;
  $('commissionTitle').textContent = c.title;
  $('commissionText').textContent = c.text;
  $('matchText').textContent = `${state.currentMatch}%`;
  $('glazeText').textContent = `${c.glaze.filter((i) => state.glaze[i]).length}/${c.glaze.length}`;
  $('carveText').textContent = `${c.carve.filter((i) => state.carve[i] > 0).length}/${c.carve.length}`;
  $('bandText').textContent = `${c.heat[0]}-${c.heat[1]}%`;
  $('ringTitle').textContent = `Ring ${selectedRing + 1} / ${c.labels[selectedRing] || 'clay'}`;
  $('radiusText').textContent = `${state.radii[selectedRing].toFixed(2)} → ${c.target[selectedRing].toFixed(2)}`;
  $('wallText').textContent = state.radii[selectedRing] < 0.43 ? 'thin!' : adjacentStress(selectedRing) > 0.25 ? 'jump stress' : 'safe';
  $('markText').textContent = `${state.glaze[selectedRing] ? 'glazed' : 'raw'} · ${state.carve[selectedRing] ? `${state.carve[selectedRing]} scales` : 'plain'}`;
  $('readyText').textContent = readyToFire() ? 'fire kiln' : `need ${c.minMatch}%+`;
  $('menuBest').textContent = String(saved.bestScore || 0);
  $('menuOffering').textContent = saved.bestOffering ? fmtTime(saved.bestOffering) : '—';
  const chips = document.querySelectorAll('.ring-chip');
  chips.forEach((chip, i) => chip.classList.toggle('selected', i === selectedRing));
}

function resize() {
  if (!renderer) return;
  const canvas = $('stage');
  const rect = canvas.getBoundingClientRect();
  renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
  camera.updateProjectionMatrix();
}

function animate(now = performance.now()) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  if (state?.mode === 'playing') {
    state.elapsed += dt;
    state.collapseCooldown = Math.max(0, state.collapseCooldown - dt);
    if (state.phase === 'firing') firingStep(dt);
    else {
      state.heat = clamp(state.heat - dt * 2.5, 22, 100);
      state.wobble = state.wobble.map((w) => clamp(w + dt * 0.004, 0, 0.7));
      if (Math.floor(state.elapsed) !== Math.floor(state.elapsed - dt)) updateMetrics();
    }
    if (state.bannerTimer > 0) {
      state.bannerTimer -= dt;
      if (state.bannerTimer <= 0) $('offeringBanner').hidden = true;
    }
    if (state.score > saved.bestScore) { saved.bestScore = state.score; persist(); }
    updateUI();
  }
  if (potGroup) {
    wheelTop.rotation.y += dt * 2.8;
    potGroup.rotation.y += dt * (state?.phase === 'firing' ? 1.7 : 1.1);
    potGroup.rotation.z = Math.sin(now * 0.0013) * ((state?._wobblePct || 0) / 100) * 0.08;
    targetGroup.rotation.y = potGroup.rotation.y;
    camera.position.x = Math.sin(viewYaw) * 1.2;
    camera.position.z = 6.1 + Math.cos(viewYaw) * 0.5;
    camera.lookAt(0, 0.05, 0);
    emberParticles.children.forEach((p, i) => {
      const d = p.userData;
      const t = (now * 0.001 * d.speed + i) % 1;
      p.position.set(Math.cos(d.angle + t) * d.radius, -1.1 + t * 3.4, Math.sin(d.angle + t) * d.radius - 0.8);
      p.material.opacity = 0.15 + (1 - t) * 0.55;
    });
  }
  renderer?.render(scene, camera);
}

function bindControls() {
  document.addEventListener('click', (event) => {
    const ring = event.target.closest?.('[data-ring]');
    if (ring && state?.mode === 'playing') {
      selectedRing = Number(ring.dataset.ring);
      createRingChips(); rebuildPot(); updateUI(); return;
    }
    const button = event.target.closest?.('[data-action]');
    if (button) action(button.dataset.action);
  });
  $('startButton').addEventListener('click', startRun);
  $('resumeButton').addEventListener('click', pauseToggle);
  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if ((key === 'enter' || key === ' ') && (!state || state.mode === 'menu')) { event.preventDefault(); startRun(); return; }
    const map = { arrowup: 'ringUp', w: 'ringUp', arrowdown: 'ringDown', s: 'ringDown', arrowleft: 'narrow', a: 'narrow', arrowright: 'widen', d: 'widen', c: 'carve', g: 'glaze', m: 'smooth', b: 'bellows', v: 'vent', p: 'pause', r: 'restart', enter: 'fire', ' ': 'fire', q: 'viewLeft', e: 'viewRight' };
    if (map[key]) {
      event.preventDefault();
      if (map[key] === 'viewLeft') viewYaw -= 0.2;
      else if (map[key] === 'viewRight') viewYaw += 0.2;
      else action(map[key]);
    }
  });
  window.addEventListener('resize', resize);
}

state = baseState();
initThree();
bindControls();
loadCommission();
updateUI();
rebuildPot();
$('menuOverlay').hidden = false;
animate();
