import * as THREE from './assets/three.module.js';

const $ = (id) => document.getElementById(id);
const els = {
  score: $('score'), best: $('best-score'), patience: $('patience'), risk: $('risk'), heat: $('heat'), combo: $('combo'), timer: $('timer'),
  chapterTitle: $('chapter-title'), commissionText: $('commission-text'), chips: $('commission-chips'), match: $('match'), helper: $('selected-helper'),
  ringTrack: $('ring-track'), menu: $('menu'), pauseMenu: $('pause-menu'), results: $('results'), resultCopy: $('result-copy'), badgeRow: $('badge-row'),
  sculptControls: $('sculpt-controls'), fireControls: $('fire-controls'), canvas: $('scene'), wrap: $('scene-wrap')
};

const storageKey = 'day016-ryu-best';
const chapters = [
  {
    title: 'Tea Bowl Foot',
    text: 'Shape a broad tea bowl foot, add one ash-blue glaze band, and fire below 72% heat.',
    target: [52, 62, 70, 64, 48],
    glaze: [2], carve: [], heatBand: [42, 72], scoreNeed: 760,
    chips: ['wide foot', '1 glaze', 'heat < 72%', 'match 78%+']
  },
  {
    title: 'Incense Cup Lip',
    text: 'Narrow the waist, flare the lip, carve two dragon scales, then hold a steady ember band.',
    target: [48, 52, 43, 50, 67],
    glaze: [1], carve: [2, 4], heatBand: [48, 76], scoreNeed: 1720,
    chips: ['narrow waist', 'flared lip', '2 scales', 'steady heat']
  },
  {
    title: 'Dragon Kiln Vase',
    text: 'Build a tall vase profile with alternating glaze bands, dragon-scale carving, and careful venting.',
    target: [44, 56, 42, 50, 61, 47, 69],
    glaze: [1, 3, 5], carve: [2, 4, 6], heatBand: [52, 80], scoreNeed: 3000,
    chips: ['7 rings', '3 glazes', '3 scales', 'Ryu Offering']
  }
];

const state = {
  started: false,
  paused: false,
  firing: false,
  complete: false,
  chapter: 0,
  selected: 2,
  rings: [],
  glaze: new Set(),
  carve: new Set(),
  score: 0,
  combo: 1,
  patience: 3,
  risk: 0,
  heat: 32,
  fireProgress: 0,
  elapsed: 0,
  lastTick: performance.now(),
  best: Number(localStorage.getItem(storageKey) || 0),
  dragX: null,
  cameraYaw: 0
};

let scene, camera, renderer, vessel, ghost, wheel, selectedHalo, lightWarm, lightCool, particles;

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas: els.canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 2.25, 7.7);
  camera.lookAt(0, 1.0, 0);

  lightWarm = new THREE.PointLight(0xff8f45, 2.5, 14);
  lightWarm.position.set(-3.4, 3.2, 3.4);
  scene.add(lightWarm);
  lightCool = new THREE.DirectionalLight(0x9fd7ff, 1.25);
  lightCool.position.set(3, 5, 4);
  scene.add(lightCool);
  scene.add(new THREE.AmbientLight(0xffd7a6, 0.82));

  const wheelGeo = new THREE.CylinderGeometry(2.15, 2.34, 0.34, 80);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x7a4d35, roughness: 0.88, metalness: 0.05 });
  wheel = new THREE.Mesh(wheelGeo, wheelMat);
  wheel.position.y = -0.28;
  scene.add(wheel);

  const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(2.7, 2.9, 0.05, 96),
    new THREE.MeshStandardMaterial({ color: 0x372018, roughness: 0.95 })
  );
  floor.position.y = -0.5;
  scene.add(floor);

  particles = new THREE.Group();
  const emberMat = new THREE.MeshBasicMaterial({ color: 0xffb35d, transparent: true, opacity: 0.72 });
  for (let i = 0; i < 42; i += 1) {
    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.015 + (i % 3) * 0.006, 8, 8), emberMat.clone());
    ember.position.set((Math.random() - .5) * 5.8, Math.random() * 3.4, (Math.random() - .5) * 2.5);
    ember.userData.speed = 0.25 + Math.random() * 0.55;
    particles.add(ember);
  }
  scene.add(particles);

  selectedHalo = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffe08b, linewidth: 3 }));
  scene.add(selectedHalo);
  resize();
}

function resize() {
  const rect = els.wrap.getBoundingClientRect();
  if (!rect.width || !rect.height || !renderer) return;
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}

function chapter() { return chapters[state.chapter]; }
function seededStart(target) { return target.map((r, i) => Math.round(r + Math.sin((i + 1) * 2.17 + state.chapter) * 12)); }

function resetChapter(keepScore = false) {
  const c = chapter();
  state.rings = seededStart(c.target);
  state.selected = Math.min(2, state.rings.length - 1);
  state.glaze = new Set();
  state.carve = new Set();
  state.risk = 0;
  state.heat = 32 + state.chapter * 4;
  state.fireProgress = 0;
  state.firing = false;
  state.complete = false;
  if (!keepScore) {
    state.score = 0;
    state.combo = 1;
    state.patience = 3;
    state.elapsed = 0;
  }
  els.sculptControls.classList.remove('hidden');
  els.fireControls.classList.add('hidden');
  buildRingTrack();
  updateVessel();
  updateUI();
}

function restart() {
  state.chapter = 0;
  state.started = true;
  state.paused = false;
  state.lastTick = performance.now();
  els.menu.classList.add('hidden');
  els.pauseMenu.classList.add('hidden');
  els.results.classList.add('hidden');
  resetChapter(false);
}

function buildRingTrack() {
  els.ringTrack.innerHTML = '';
  state.rings.forEach((_, i) => {
    const chip = document.createElement('button');
    chip.className = `ring-chip ${i === state.selected ? 'selected' : ''} ${state.glaze.has(i) || state.carve.has(i) ? 'done' : ''}`;
    chip.type = 'button';
    chip.textContent = String(i + 1);
    chip.setAttribute('aria-label', `Select ring ${i + 1}`);
    chip.addEventListener('click', () => selectRing(i));
    els.ringTrack.appendChild(chip);
  });
}

function profilePoints(values) {
  const n = values.length;
  const points = [];
  points.push(new THREE.Vector2(0, 0));
  for (let i = 0; i < n; i += 1) {
    const y = i / (n - 1) * 2.7;
    const radius = values[i] / 42;
    points.push(new THREE.Vector2(radius, y));
  }
  points.push(new THREE.Vector2(Math.max(0.25, values[n - 1] / 42 - 0.08), 2.84));
  points.push(new THREE.Vector2(0, 2.84));
  return points;
}

function updateVessel() {
  if (!scene) return;
  if (vessel) scene.remove(vessel);
  if (ghost) scene.remove(ghost);
  const clayMat = new THREE.MeshStandardMaterial({ color: 0xb86e42, roughness: 0.82, metalness: 0.02, transparent: true, opacity: 0.98 });
  const geometry = new THREE.LatheGeometry(profilePoints(state.rings), 96);
  vessel = new THREE.Mesh(geometry, clayMat);
  vessel.position.y = -0.18;
  vessel.castShadow = true;
  scene.add(vessel);

  const c = chapter();
  const ghostGeo = new THREE.LatheGeometry(profilePoints(c.target), 96);
  const ghostMat = new THREE.MeshBasicMaterial({ color: 0x8ed8ee, transparent: true, opacity: 0.16, wireframe: true });
  ghost = new THREE.Mesh(ghostGeo, ghostMat);
  ghost.position.y = -0.18;
  scene.add(ghost);
  updateDecorations();
  updateHalo();
}

function updateDecorations() {
  if (!vessel) return;
  [...vessel.children].forEach((child) => vessel.remove(child));
  const n = state.rings.length;
  for (let i = 0; i < n; i += 1) {
    const y = -0.18 + i / Math.max(1, n - 1) * 2.7;
    const radius = state.rings[i] / 42 + 0.018;
    if (state.glaze.has(i)) {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.022, 10, 96),
        new THREE.MeshStandardMaterial({ color: 0x6bbbd0, roughness: 0.46, metalness: 0.08 })
      );
      torus.rotation.x = Math.PI / 2;
      torus.position.y = y;
      vessel.add(torus);
    }
    if (state.carve.has(i)) {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(radius + 0.012, 0.011, 8, 64),
        new THREE.MeshBasicMaterial({ color: 0x3b2017 })
      );
      torus.rotation.x = Math.PI / 2;
      torus.position.y = y + 0.025;
      vessel.add(torus);
    }
  }
}

function updateHalo() {
  const n = state.rings.length;
  const y = -0.18 + state.selected / Math.max(1, n - 1) * 2.7;
  const r = state.rings[state.selected] / 42 + 0.08;
  const pts = [];
  for (let i = 0; i <= 96; i += 1) {
    const a = (i / 96) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
  }
  selectedHalo.geometry.dispose();
  selectedHalo.geometry = new THREE.BufferGeometry().setFromPoints(pts);
}

function silhouetteMatch() {
  const c = chapter();
  const diffs = state.rings.map((r, i) => Math.abs(r - c.target[i]));
  const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  let score = Math.max(0, Math.round(100 - avg * 2.35));
  for (const i of c.glaze) if (!state.glaze.has(i)) score -= 5;
  for (const i of c.carve) if (!state.carve.has(i)) score -= 5;
  return Math.max(0, Math.min(100, score));
}

function computeRisk() {
  let risk = 0;
  for (let i = 1; i < state.rings.length; i += 1) {
    risk += Math.max(0, Math.abs(state.rings[i] - state.rings[i - 1]) - 18) * 1.8;
  }
  risk += Math.max(0, 34 - Math.min(...state.rings)) * 1.4;
  if (state.heat > chapter().heatBand[1]) risk += (state.heat - chapter().heatBand[1]) * 0.8;
  return Math.min(100, Math.round(risk));
}

function selectRing(i) {
  state.selected = Math.max(0, Math.min(state.rings.length - 1, i));
  buildRingTrack();
  updateHalo();
  updateUI();
}

function adjust(delta) {
  if (!state.started || state.paused || state.firing) return;
  const target = chapter().target[state.selected];
  const before = Math.abs(state.rings[state.selected] - target);
  state.rings[state.selected] = Math.max(28, Math.min(82, state.rings[state.selected] + delta));
  const after = Math.abs(state.rings[state.selected] - target);
  reward(after < before ? 42 : -8);
  updateVessel();
  updateUI();
}

function reward(points) {
  if (points > 0) {
    state.score += Math.round(points * state.combo);
    state.combo = Math.min(8, state.combo + 0.15);
  } else {
    state.combo = Math.max(1, state.combo - 0.35);
    state.risk = Math.min(100, state.risk + 4);
  }
}

function smooth() {
  if (!state.started || state.paused || state.firing) return;
  const i = state.selected;
  const neighbors = [state.rings[i - 1], state.rings[i + 1]].filter((v) => Number.isFinite(v));
  if (!neighbors.length) return;
  const avg = neighbors.reduce((a, b) => a + b, 0) / neighbors.length;
  state.rings[i] = Math.round(state.rings[i] * 0.62 + avg * 0.38);
  state.risk = Math.max(0, state.risk - 7);
  reward(48);
  updateVessel();
  updateUI();
}

function mark(kind) {
  if (!state.started || state.paused || state.firing) return;
  const c = chapter();
  const set = kind === 'glaze' ? state.glaze : state.carve;
  set.add(state.selected);
  const good = (kind === 'glaze' ? c.glaze : c.carve).includes(state.selected);
  reward(good ? 110 : 18);
  buildRingTrack();
  updateDecorations();
  updateUI();
}

function beginFire() {
  if (!state.started || state.paused || state.firing) return;
  state.firing = true;
  state.fireProgress = 0;
  state.heat = Math.max(state.heat, chapter().heatBand[0] - 8);
  els.sculptControls.classList.add('hidden');
  els.fireControls.classList.remove('hidden');
  updateUI();
}

function fireAction(kind) {
  if (!state.firing || state.paused) return;
  if (kind === 'bellows') state.heat += 8;
  if (kind === 'vent') state.heat -= 10;
  if (kind === 'hold') state.heat += 1;
  state.heat = Math.max(20, Math.min(100, state.heat));
  updateUI();
}

function finishCommission() {
  const match = silhouetteMatch();
  const perfect = match >= 88 && state.risk < 45;
  state.score += perfect ? 540 : 420;
  if (perfect && state.patience < 3) state.patience += 1;
  if (state.chapter === chapters.length - 1 && state.score >= 3000) {
    state.complete = true;
    state.score += 980;
    showResults('Ryu Ember Offering complete! The dragon kiln sealed your vessel in warm ash-blue glaze.', ['Ryu Offering', `${match}% match`, `score ${state.score}`]);
    return;
  }
  state.chapter = Math.min(chapters.length - 1, state.chapter + 1);
  resetChapter(true);
}

function failCheck() {
  if (state.risk < 100 && state.heat < 100) return;
  state.patience -= 1;
  state.combo = 1;
  if (state.patience <= 0) {
    showResults('The vessel cracked in the kiln. The apprentice saved the shards for the next lesson.', ['cracked', `score ${state.score}`, chapter().title]);
  } else {
    state.risk = 42;
    state.heat = 45;
    state.rings = state.rings.map((r, i) => Math.round(r * .75 + chapter().target[i] * .25));
    updateVessel();
    updateUI();
  }
}

function showResults(copy, badges = []) {
  state.started = false;
  state.firing = false;
  state.paused = false;
  state.best = Math.max(state.best, state.score);
  localStorage.setItem(storageKey, String(state.best));
  els.resultCopy.textContent = copy;
  els.badgeRow.innerHTML = badges.map((b) => `<span>${b}</span>`).join('');
  els.results.classList.remove('hidden');
  updateUI();
}

function pause() {
  if (!state.started) return;
  state.paused = true;
  els.pauseMenu.classList.remove('hidden');
}
function resume() {
  state.paused = false;
  state.lastTick = performance.now();
  els.pauseMenu.classList.add('hidden');
}

function updateUI() {
  const c = chapter();
  const match = silhouetteMatch();
  state.risk = Math.max(state.risk, computeRisk());
  els.score.textContent = String(state.score);
  els.best.textContent = String(Math.max(state.best, state.score));
  els.patience.textContent = '◆'.repeat(Math.max(0, state.patience)) || '—';
  els.risk.textContent = `${Math.round(state.risk)}%`;
  els.heat.textContent = `${Math.round(state.heat)}%`;
  els.combo.textContent = `x${Math.max(1, Math.floor(state.combo))}`;
  const minutes = Math.floor(state.elapsed / 60);
  const seconds = Math.floor(state.elapsed % 60).toString().padStart(2, '0');
  els.timer.textContent = `${minutes}:${seconds}`;
  els.chapterTitle.textContent = c.title;
  els.commissionText.textContent = c.text;
  els.chips.innerHTML = c.chips.map((chip) => `<span class="chip">${chip}</span>`).join('');
  els.match.textContent = `${match}%`;
  const target = c.target[state.selected];
  const tags = [];
  if (state.glaze.has(state.selected)) tags.push('glazed');
  if (state.carve.has(state.selected)) tags.push('carved');
  els.helper.textContent = `Ring ${state.selected + 1}/${state.rings.length} · radius ${state.rings[state.selected]} · target ${target} · risk ${Math.round(computeRisk())}%${tags.length ? ` · ${tags.join(', ')}` : ''}`;
  buildRingTrack();
  failCheck();
}

function tick(now) {
  const dt = Math.min(0.05, (now - state.lastTick) / 1000 || 0);
  state.lastTick = now;
  if (state.started && !state.paused) {
    state.elapsed += dt;
    if (state.firing) {
      const [lo, hi] = chapter().heatBand;
      state.heat += dt * 3.2;
      if (state.heat >= lo && state.heat <= hi) {
        state.fireProgress += dt * 25;
        state.score += Math.round(dt * 45 * state.combo);
      } else {
        state.risk = Math.min(100, state.risk + dt * 9);
        state.combo = Math.max(1, state.combo - dt * 0.4);
      }
      if (state.fireProgress >= 100) finishCommission();
      updateUI();
    }
  }
  animateScene(now * 0.001, dt);
  requestAnimationFrame(tick);
}

function animateScene(t, dt) {
  if (!renderer) return;
  if (vessel) vessel.rotation.y += dt * (state.firing ? 1.9 : 0.72);
  if (ghost) ghost.rotation.y = vessel ? vessel.rotation.y : t * .2;
  if (wheel) wheel.rotation.y += dt * 1.1;
  if (selectedHalo) selectedHalo.rotation.y += dt * 0.72;
  if (particles) {
    particles.children.forEach((ember, i) => {
      ember.position.y += dt * ember.userData.speed;
      ember.position.x += Math.sin(t * 1.7 + i) * dt * .08;
      if (ember.position.y > 3.6) ember.position.y = -0.35;
      ember.material.opacity = 0.35 + Math.sin(t * 3 + i) * 0.25;
    });
  }
  const yaw = state.cameraYaw;
  camera.position.x = Math.sin(yaw) * 1.1;
  camera.lookAt(0, 1.05, 0);
  renderer.render(scene, camera);
}

function canvasSelect(event) {
  if (!state.started || state.paused) return;
  const rect = els.canvas.getBoundingClientRect();
  const y = (event.clientY - rect.top) / rect.height;
  const idx = Math.round((1 - y) * (state.rings.length - 1));
  selectRing(idx);
}

function bind() {
  $('start').addEventListener('click', restart);
  $('restart').addEventListener('click', restart);
  $('restart-fire').addEventListener('click', restart);
  $('pause-restart').addEventListener('click', restart);
  $('result-restart').addEventListener('click', restart);
  $('pause').addEventListener('click', pause);
  $('pause-fire').addEventListener('click', pause);
  $('resume').addEventListener('click', resume);
  $('ring-up').addEventListener('click', () => selectRing(state.selected + 1));
  $('ring-down').addEventListener('click', () => selectRing(state.selected - 1));
  $('widen').addEventListener('click', () => adjust(5));
  $('narrow').addEventListener('click', () => adjust(-5));
  $('smooth').addEventListener('click', smooth);
  $('carve').addEventListener('click', () => mark('carve'));
  $('glaze').addEventListener('click', () => mark('glaze'));
  $('fire').addEventListener('click', beginFire);
  $('bellows').addEventListener('click', () => fireAction('bellows'));
  $('vent').addEventListener('click', () => fireAction('vent'));
  $('hold').addEventListener('click', () => fireAction('hold'));
  els.canvas.addEventListener('pointerdown', (event) => { state.dragX = event.clientX; canvasSelect(event); });
  els.canvas.addEventListener('pointermove', (event) => {
    if (state.dragX === null) return;
    state.cameraYaw += (event.clientX - state.dragX) * 0.003;
    state.dragX = event.clientX;
  });
  window.addEventListener('pointerup', () => { state.dragX = null; });
  window.addEventListener('resize', resize);
  new ResizeObserver(resize).observe(els.wrap);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P') state.paused ? resume() : pause();
    if (event.key === 'r' || event.key === 'R') restart();
    if (!state.started || state.paused) return;
    if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') selectRing(state.selected + 1);
    if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') selectRing(state.selected - 1);
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') adjust(-5);
    if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') adjust(5);
    if (event.key === 'm' || event.key === 'M') smooth();
    if (event.key === 'c' || event.key === 'C') mark('carve');
    if (event.key === 'g' || event.key === 'G') mark('glaze');
    if (event.key === 'b' || event.key === 'B') fireAction('bellows');
    if (event.key === 'v' || event.key === 'V') fireAction('vent');
    if (event.key === ' ' || event.key === 'Enter') state.firing ? fireAction('hold') : beginFire();
  });
}

initThree();
bind();
resetChapter(false);
updateUI();
requestAnimationFrame(tick);
