import * as THREE from './assets/three.module.js';

const $ = (id) => document.getElementById(id);
const els = {
  canvas: $('gameCanvas'), score: $('score'), best: $('best'), patience: $('patience'), stability: $('stability'), warmth: $('warmth'), combo: $('combo'), time: $('time'),
  chapterName: $('chapterName'), chapterText: $('chapterText'), chapterChips: $('chapterChips'), windBadge: $('windBadge'), ghostBadge: $('ghostBadge'),
  helperCard: $('helperCard'), blockName: $('blockName'), blockHelp: $('blockHelp'), queue: $('queue'), toast: $('toast'),
  menu: $('menuOverlay'), pause: $('pauseOverlay'), result: $('resultOverlay'), resultTitle: $('resultTitle'), resultText: $('resultText'), badgeList: $('badgeList')
};

const STORAGE = 'day012-yuki-stacksmith-v1';
const saved = JSON.parse(localStorage.getItem(STORAGE) || '{}');
const state = {
  status: 'menu', score: 0, best: saved.best || 0, patience: 3, stability: 100, warmth: 18, combo: 1, elapsed: 0,
  chapter: 0, blocks: [], queue: [], selected: 0, yaw: 0, ghost: { x: 0, z: 0 }, shield: 44, shieldActive: false,
  ventUsed: 0, perfectStreak: 0, tallest: saved.tallest || 0, grand: false, lastTick: performance.now(), cameraYaw: -0.42,
  wind: { timer: 10, active: false, dir: new THREE.Vector3(1, 0, 0), label: 'calm', strength: 0 }
};

const chapters = [
  { name: 'First Snow Base', text: 'Build five stable layers with cube and slab blocks. Keep stress green.', goal: 5, score: 620, chips: ['5 layers', 'wide base', 'stability 70%+'], needs: { cube: 2, slab: 1 } },
  { name: 'Fox Path Window', text: 'Face an arch window toward the front and add the snow fox charm.', goal: 9, score: 1500, chips: ['front arch', 'fox charm', 'warmth < 65%'], needs: { arch: 1, fox: 1 } },
  { name: 'Shrine Dawn Spire', text: 'Finish with a curved roof cap, vents, and a tall balanced spire.', goal: 14, score: 2800, chips: ['roof cap', 'vent once', 'Yuki Grand Illumination'], needs: { roof: 1, vent: 1 } }
];

const blockTypes = [
  { type: 'cube', label: 'Cube', dims: [1.12, .52, 1.12], color: 0xeaf7ff, points: 55, help: 'Strong square block. Best for a broad base.' },
  { type: 'slab', label: 'Slab', dims: [1.55, .32, .92], color: 0xdff3ff, points: 62, help: 'Wide slab. Rotate to bridge weak sides.' },
  { type: 'arch', label: 'Arch', dims: [1.12, .68, .45], color: 0xf2fbff, points: 95, help: 'Window block. Face it forward for Fox Path.' },
  { type: 'roof', label: 'Roof', dims: [1.5, .45, 1.06], color: 0xe3f2ff, points: 120, help: 'Curved roof cap. Tall but unstable on narrow stacks.' },
  { type: 'fox', label: 'Fox', dims: [.58, .42, .58], color: 0xfff7ee, points: 140, help: 'Tiny fox charm. Place near front for a bonus.' }
];

let renderer, scene, camera, pedestal, candle, ghostMesh, plumbLine, windArrow, lanternGroup, textureArtisan, textureIcons;
const meshes = [];

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas: els.canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a1d32, 9, 24);
  camera = new THREE.PerspectiveCamera(45, 1, .1, 100);
  const hemi = new THREE.HemisphereLight(0xdaf4ff, 0x1d3146, 2.4);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffdf9e, 2.2);
  key.position.set(4, 7, 6);
  scene.add(key);
  const candleLight = new THREE.PointLight(0xffb547, 4.5, 10);
  candleLight.position.set(0, .65, 0);
  scene.add(candleLight);

  const floor = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.9, .32, 64), new THREE.MeshStandardMaterial({ color: 0x203d4e, roughness: .92, metalness: .02 }));
  floor.position.y = -.18;
  floor.scale.z = .72;
  scene.add(floor);
  pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.76, 1.92, .44, 48), new THREE.MeshStandardMaterial({ color: 0xf2fbff, roughness: .82 }));
  pedestal.position.y = .08;
  scene.add(pedestal);

  candle = new THREE.Group();
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(.28, .32, .18, 32), new THREE.MeshStandardMaterial({ color: 0xf1f6ff, roughness: .7 }));
  const flame = new THREE.Mesh(new THREE.ConeGeometry(.13, .42, 24), new THREE.MeshStandardMaterial({ color: 0xffbc41, emissive: 0xff7a1f, emissiveIntensity: 1.5 }));
  flame.position.y = .34;
  candle.add(cup, flame);
  candle.position.y = .38;
  scene.add(candle);

  lanternGroup = new THREE.Group();
  scene.add(lanternGroup);
  ghostMesh = makeBlockMesh(blockTypes[0], true);
  scene.add(ghostMesh);
  plumbLine = makePlumbLine();
  scene.add(plumbLine);
  windArrow = makeWindArrow();
  scene.add(windArrow);
  addShrineDetails();
  textureArtisan = new THREE.TextureLoader().load('./assets/yuki-artisan.png');
  textureIcons = new THREE.TextureLoader().load('./assets/yuki-icons.png');
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
}

function addShrineDetails() {
  const red = new THREE.MeshStandardMaterial({ color: 0x9f2d28, roughness: .62 });
  const snow = new THREE.MeshStandardMaterial({ color: 0xf5fbff, roughness: .9 });
  for (const x of [-3.2, 3.2]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 3.4, 16), red);
    post.position.set(x, 1.45, -2.4);
    scene.add(post);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(7.3, .18, .18), red);
  beam.position.set(0, 3.05, -2.4);
  scene.add(beam);
  for (const x of [-3.4, 3.4, -2.4, 2.4]) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.24, .34, .62, 18), snow);
    base.position.set(x, .22, -1.6 + Math.abs(x) * .15);
    scene.add(base);
    const top = new THREE.Mesh(new THREE.BoxGeometry(.72, .14, .72), snow);
    top.position.set(x, .6, -1.6 + Math.abs(x) * .15);
    scene.add(top);
  }
  const flakeGeo = new THREE.BufferGeometry();
  const pos = [];
  for (let i = 0; i < 260; i++) pos.push((Math.random() - .5) * 11, Math.random() * 8, -2 - Math.random() * 8);
  flakeGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const flakes = new THREE.Points(flakeGeo, new THREE.PointsMaterial({ color: 0xffffff, size: .035, transparent: true, opacity: .75 }));
  flakes.name = 'snow';
  scene.add(flakes);
}

function makeWindArrow() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x7ee7ff, emissive: 0x199ac3, emissiveIntensity: .45, transparent: true, opacity: .72 });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, 2.5, 12), mat);
  shaft.rotation.z = Math.PI / 2;
  const head = new THREE.Mesh(new THREE.ConeGeometry(.16, .42, 20), mat);
  head.rotation.z = -Math.PI / 2;
  head.position.x = 1.36;
  g.add(shaft, head);
  g.position.set(0, 2.25, 0);
  return g;
}

function makePlumbLine() {
  const g = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: 0xffd77b, transparent: true, opacity: .85 });
  const points = [new THREE.Vector3(0, 4.8, 0), new THREE.Vector3(0, .15, 0)];
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), mat));
  const bob = new THREE.Mesh(new THREE.ConeGeometry(.1, .28, 16), new THREE.MeshStandardMaterial({ color: 0xffd77b, emissive: 0x4a2e00, emissiveIntensity: .3 }));
  bob.position.y = .13;
  g.add(bob);
  return g;
}

function makeBlockMesh(block, ghost = false) {
  const [w, h, d] = block.dims;
  let geo;
  if (block.type === 'roof') geo = new THREE.ConeGeometry(Math.max(w, d) * .64, h * 1.3, 4);
  else if (block.type === 'fox') geo = new THREE.SphereGeometry(w * .46, 20, 16);
  else geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color: block.color, roughness: .86, metalness: .02, transparent: ghost, opacity: ghost ? .45 : 1,
    emissive: ghost ? 0x245e73 : 0x000000, emissiveIntensity: ghost ? .18 : 0
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.userData = { block };
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: ghost ? 0x95f1ff : 0xb9d8e9, transparent: true, opacity: ghost ? .9 : .35 }));
  mesh.add(edge);
  return mesh;
}

function nextQueue(seed = Date.now()) {
  const bag = [];
  const chapter = chapters[state.chapter] || chapters.at(-1);
  bag.push(blockTypes[0], blockTypes[0], blockTypes[1]);
  if (state.chapter >= 1 || state.blocks.length > 3) bag.push(blockTypes[2], blockTypes[4]);
  if (state.chapter >= 2 || state.blocks.length > 7) bag.push(blockTypes[3], blockTypes[1]);
  while (state.queue.length < 3) {
    const pick = bag[Math.abs(Math.floor(Math.sin(seed + state.queue.length * 91 + state.blocks.length * 17) * 10000)) % bag.length];
    state.queue.push({ ...pick, id: `${pick.type}-${performance.now()}-${Math.random()}` });
  }
  renderQueue();
  selectBlock(Math.min(state.selected, state.queue.length - 1));
  renderChapter();
}

function renderQueue() {
  els.queue.innerHTML = '';
  state.queue.forEach((block, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `blockCard ${index === state.selected ? 'selected' : ''}`;
    btn.setAttribute('aria-label', `Select ${block.label}`);
    btn.innerHTML = `<img src="./assets/yuki-icons.png" alt=""/><span><strong>${block.label}</strong><span>${block.help}</span></span>`;
    btn.addEventListener('click', () => selectBlock(index));
    els.queue.appendChild(btn);
  });
}

function renderChapter() {
  const c = chapters[state.chapter] || { name: 'Endless Winter Commission', text: 'Build taller, colder, riskier lanterns.', chips: ['endless', 'faster gusts', 'strict balance'] };
  els.chapterName.textContent = c.name;
  els.chapterText.textContent = c.text;
  els.chapterChips.innerHTML = '';
  const progress = `${Math.min(state.blocks.length, c.goal || state.blocks.length)}/${c.goal || state.blocks.length + 3} blocks`;
  [progress, ...(c.chips || [])].forEach((chip) => {
    const s = document.createElement('span');
    s.textContent = chip;
    els.chapterChips.appendChild(s);
  });
}

function selectBlock(index) {
  state.selected = Math.max(0, Math.min(index, state.queue.length - 1));
  const block = currentBlock();
  if (!block) return;
  scene.remove(ghostMesh);
  ghostMesh = makeBlockMesh(block, true);
  scene.add(ghostMesh);
  els.blockName.textContent = block.label;
  els.blockHelp.textContent = block.help;
  updateGhost();
  renderQueue();
}

function currentBlock() { return state.queue[state.selected]; }
function topHeight() { return state.blocks.reduce((m, b) => Math.max(m, b.position.y + b.userData.block.dims[1] / 2), .42); }
function snap(v) { return Math.max(-1.2, Math.min(1.2, Math.round(v * 2) / 2)); }

function updateGhost() {
  const block = currentBlock();
  if (!block || !ghostMesh) return;
  const h = block.dims[1];
  ghostMesh.position.set(state.ghost.x, topHeight() + h / 2 + .04, state.ghost.z);
  ghostMesh.rotation.y = state.yaw;
  els.ghostBadge.textContent = `Ghost: ${state.ghost.x.toFixed(1)}, ${state.ghost.z.toFixed(1)} · yaw ${Math.round(THREE.MathUtils.radToDeg(state.yaw)) % 360}°`;
  evaluateStabilityPreview();
}

function evaluateStabilityPreview() {
  const center = computeCenter([...state.blocks.map((m) => ({ pos: m.position, weight: weightFor(m.userData.block) })), { pos: ghostMesh.position, weight: weightFor(currentBlock()) }]);
  const dist = Math.sqrt(center.x * center.x + center.z * center.z);
  const risk = THREE.MathUtils.clamp((dist - .42) / 1.1, 0, 1);
  ghostMesh.material.color.setHex(risk > .62 ? 0xff6b5f : risk > .34 ? 0xffd56c : 0xdff8ff);
}

function weightFor(block) { return block ? block.dims[0] * block.dims[1] * block.dims[2] * (block.type === 'fox' ? .35 : 1) : 1; }
function computeCenter(items) {
  let wx = 0, wz = 0, total = 0;
  for (const item of items) { wx += item.pos.x * item.weight; wz += item.pos.z * item.weight; total += item.weight; }
  return { x: total ? wx / total : 0, z: total ? wz / total : 0 };
}

function shift(dx, dz) { if (state.status !== 'playing') return; state.ghost.x = snap(state.ghost.x + dx); state.ghost.z = snap(state.ghost.z + dz); updateGhost(); }
function rotatePiece() { if (state.status !== 'playing') return; state.yaw = (state.yaw + Math.PI / 2) % (Math.PI * 2); updateGhost(); toast('Rotated snow block'); }

function dropBlock() {
  if (state.status !== 'playing') return;
  const block = currentBlock();
  if (!block) return;
  const mesh = makeBlockMesh(block, false);
  mesh.position.copy(ghostMesh.position);
  mesh.rotation.y = state.yaw;
  mesh.userData.block = block;
  mesh.userData.vented = false;
  mesh.userData.chapter = state.chapter;
  lanternGroup.add(mesh);
  state.blocks.push(mesh);
  state.queue.splice(state.selected, 1);
  const quality = scorePlacement(block, mesh.position);
  state.score += Math.round(block.points * state.combo + quality.bonus);
  state.combo = Math.min(9, quality.good ? state.combo + .25 : 1);
  state.perfectStreak = quality.good ? state.perfectStreak + 1 : 0;
  state.stability = calculateStability();
  state.warmth = Math.min(100, state.warmth + (block.type === 'roof' ? 9 : 5) + state.blocks.length * .25);
  if (state.stability < 34) collapse('The lantern leaned too far. Rebuilding from the sealed base.');
  else if (state.warmth >= 94) snuff('The candle overheated the snow. Vent earlier next time.');
  else if (quality.good) toast('Balanced amber glow +' + Math.round(block.points * state.combo));
  checkChapter();
  state.selected = 0;
  nextQueue();
  updateUI();
}

function scorePlacement(block, pos) {
  const dist = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
  let bonus = dist < .55 ? 80 : dist < .95 ? 30 : -20;
  let good = dist < .95;
  if (block.type === 'arch' && pos.z > .35) bonus += 95;
  if (block.type === 'fox' && pos.z > .25) bonus += 140;
  if (block.type === 'roof' && state.blocks.length >= 8) bonus += 120;
  const center = computeCenter(state.blocks.map((m) => ({ pos: m.position, weight: weightFor(m.userData.block) })));
  if (Math.sqrt(center.x * center.x + center.z * center.z) < .45) bonus += 180;
  else good = false;
  return { good, bonus };
}

function calculateStability() {
  const center = computeCenter(state.blocks.map((m) => ({ pos: m.position, weight: weightFor(m.userData.block) })));
  const dist = Math.sqrt(center.x * center.x + center.z * center.z);
  const heightPenalty = Math.max(0, state.blocks.length - 6) * 2.2;
  const windPenalty = state.wind.active && !state.shieldActive ? state.wind.strength * 6 : 0;
  const ventPenalty = state.ventUsed * 3;
  const value = 105 - dist * 54 - heightPenalty - windPenalty - ventPenalty;
  plumbLine.position.set(center.x, 0, center.z);
  return Math.max(0, Math.min(100, value));
}

function carveVent() {
  if (state.status !== 'playing') return;
  const top = state.blocks.at(-1);
  if (!top || top.userData.vented) { toast('Drop a fresh block before carving a vent'); return; }
  top.userData.vented = true;
  state.ventUsed += 1;
  state.warmth = Math.max(10, state.warmth - 20);
  state.stability = Math.max(0, state.stability - 6);
  top.material.color.setHex(0xd3edff);
  toast('Vent carved: cooler candle, weaker support');
  checkChapter();
  updateUI();
}

function shield() {
  if (state.status !== 'playing') return;
  if (state.shield < 28) { toast('Shield is still charging'); return; }
  state.shieldActive = true;
  state.shield = Math.max(0, state.shield - 28);
  state.warmth = Math.min(100, state.warmth + 4);
  toast(state.wind.active ? 'Gust shielded!' : 'Shield ready around the candle');
  setTimeout(() => { state.shieldActive = false; updateUI(); }, 1300);
  updateUI();
}

function collapse(message) {
  state.patience -= 1;
  state.combo = 1;
  toast(message);
  while (state.blocks.length > Math.max(2, Math.floor(state.blocks.length * .55))) {
    const m = state.blocks.pop();
    lanternGroup.remove(m);
  }
  state.stability = 76;
  if (state.patience <= 0) endRun('Lantern collapsed');
}

function snuff(message) {
  state.patience -= 1;
  state.combo = 1;
  state.warmth = 32;
  toast(message);
  if (state.patience <= 0) endRun('Candle snuffed');
}

function checkChapter() {
  const c = chapters[state.chapter];
  if (!c) {
    if (state.blocks.length > state.tallest) state.tallest = state.blocks.length;
    return;
  }
  const counts = state.blocks.reduce((acc, m) => { acc[m.userData.block.type] = (acc[m.userData.block.type] || 0) + 1; return acc; }, {});
  const needsMet = Object.entries(c.needs).every(([k, v]) => k === 'vent' ? state.ventUsed >= v : (counts[k] || 0) >= v);
  if (state.blocks.length >= c.goal && needsMet && state.score >= Math.min(c.score, 2200)) {
    state.score += 450 + state.chapter * 160;
    state.shield = Math.min(100, state.shield + 20);
    state.patience = Math.min(3, state.patience + 1);
    state.chapter += 1;
    toast(state.chapter >= 3 ? 'Yuki Grand Illumination!' : 'Commission sealed with vermilion stamp!');
    if (state.chapter >= 3 && !state.grand && state.score >= 2800) {
      state.grand = true;
      state.score += 920;
      showGrandIllumination();
    }
    renderChapter();
  }
}

function showGrandIllumination() {
  const glow = new THREE.Mesh(new THREE.SphereGeometry(2.15, 32, 16), new THREE.MeshBasicMaterial({ color: 0xffc66d, transparent: true, opacity: .18 }));
  glow.position.y = Math.max(1.2, topHeight() * .55);
  lanternGroup.add(glow);
  setTimeout(() => lanternGroup.remove(glow), 2400);
}

function updateWind(dt) {
  state.wind.timer -= dt;
  if (state.wind.timer <= 0) {
    state.wind.active = !state.wind.active;
    if (state.wind.active) {
      const dirs = [ ['east', 1, 0], ['west', -1, 0], ['front', 0, 1], ['back', 0, -1] ];
      const pick = dirs[(state.blocks.length + state.chapter + Math.floor(state.elapsed)) % dirs.length];
      state.wind = { timer: 4.8 - Math.min(1.5, state.chapter * .5), active: true, dir: new THREE.Vector3(pick[1], 0, pick[2]), label: pick[0], strength: 4 + state.chapter * 1.5 };
    } else {
      state.wind.timer = Math.max(5.5, 10 - state.chapter * 1.2);
      state.wind.label = 'calm';
      state.wind.strength = 0;
    }
  }
  windArrow.visible = state.wind.active;
  if (state.wind.active) {
    windArrow.rotation.y = Math.atan2(-state.wind.dir.z, state.wind.dir.x);
    windArrow.position.y = 1.65 + Math.sin(performance.now() * .004) * .18;
    if (!state.shieldActive) {
      state.warmth = Math.min(100, state.warmth + dt * .9);
      state.stability = calculateStability();
      if (Math.random() < dt * .016 * state.wind.strength && state.blocks.length > 4) snuff('A sharp gust cracked the flame guard.');
    }
  }
  els.windBadge.textContent = state.wind.active ? `Wind: ${state.wind.label} gust · Shield!` : `Wind: calm · next ${Math.ceil(state.wind.timer)}s`;
}

function updateUI() {
  els.score.textContent = String(Math.max(0, Math.round(state.score)));
  els.best.textContent = String(Math.max(state.best, Math.round(state.score)));
  els.patience.textContent = `${state.patience}/3`;
  els.stability.textContent = `${Math.round(state.stability)}%`;
  els.warmth.textContent = `${Math.round(state.warmth)}%`;
  els.combo.textContent = `x${state.combo.toFixed(1).replace('.0','')}`;
  els.time.textContent = formatTime(state.elapsed);
  $('shieldBtn').textContent = state.shieldActive ? 'Shielding' : `Shield ${Math.round(state.shield)}%`;
  $('shieldBtn').disabled = state.shield < 28;
  $('ventBtn').textContent = `Vent ${state.ventUsed}`;
  candle.scale.setScalar(1 + state.warmth / 220 + (state.shieldActive ? .18 : 0));
  const hue = state.stability < 38 ? 0xff6b5f : state.stability < 64 ? 0xffd66e : 0x86f0bd;
  state.blocks.forEach((m) => { if (!m.userData.vented) m.children[0].material.color.setHex(hue); });
}

function formatTime(s) { const m = Math.floor(s / 60); const sec = Math.floor(s % 60).toString().padStart(2, '0'); return `${m}:${sec}`; }
function toast(text) { els.toast.textContent = text; els.toast.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => els.toast.classList.remove('show'), 1600); }

function startGame() {
  resetRun();
  state.status = 'playing';
  els.menu.classList.add('hidden');
  els.pause.classList.add('hidden');
  els.result.classList.add('hidden');
  state.lastTick = performance.now();
  toast('First Snow Base: build wide and calm');
}

function resetRun() {
  state.score = 0; state.patience = 3; state.stability = 100; state.warmth = 18; state.combo = 1; state.elapsed = 0; state.chapter = 0;
  state.blocks.forEach((m) => lanternGroup.remove(m));
  state.blocks = []; state.queue = []; state.selected = 0; state.yaw = 0; state.ghost = { x: 0, z: 0 }; state.shield = 44; state.shieldActive = false; state.ventUsed = 0; state.perfectStreak = 0; state.grand = false;
  state.wind = { timer: 8, active: false, dir: new THREE.Vector3(1,0,0), label: 'calm', strength: 0 };
  nextQueue(); updateGhost(); updateUI(); renderChapter();
}

function pauseGame() { if (state.status !== 'playing') return; state.status = 'paused'; els.pause.classList.remove('hidden'); }
function resumeGame() { if (state.status !== 'paused') return; state.status = 'playing'; els.pause.classList.add('hidden'); state.lastTick = performance.now(); }
function restartGame() { startGame(); }

function endRun(title) {
  state.status = 'ended';
  state.best = Math.max(state.best, Math.round(state.score));
  state.tallest = Math.max(state.tallest, state.blocks.length);
  localStorage.setItem(STORAGE, JSON.stringify({ best: state.best, tallest: state.tallest, lastGrand: state.grand ? state.elapsed : saved.lastGrand }));
  els.resultTitle.textContent = title;
  els.resultText.textContent = `Score ${Math.round(state.score)} · ${chapters[state.chapter]?.name || 'Endless Winter'} · Tallest ${state.blocks.length} blocks · ${state.grand ? 'Grand Illumination reached' : 'try again for Grand Illumination'}`;
  els.badgeList.innerHTML = '';
  const badges = [];
  if (state.perfectStreak >= 8) badges.push('Perfect Stack');
  if (state.grand) badges.push('Grand Illumination');
  if (state.warmth < 50) badges.push('Cool Candle');
  if (!badges.length) badges.push('Winter Apprentice');
  badges.forEach((b) => { const s = document.createElement('span'); s.textContent = b; els.badgeList.appendChild(s); });
  els.result.classList.remove('hidden');
}

function resize() {
  const rect = els.canvas.parentElement.getBoundingClientRect();
  renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
  camera.updateProjectionMatrix();
}

function updateCamera() {
  const r = window.innerWidth < 780 ? 8.2 : 7.1;
  const height = window.innerWidth < 780 ? 4.2 : 3.7;
  const targetY = Math.min(2.5, .9 + state.blocks.length * .12);
  camera.position.set(Math.sin(state.cameraYaw) * r, height, Math.cos(state.cameraYaw) * r);
  camera.lookAt(0, targetY, 0);
}

function loop(now) {
  const dt = Math.min(.05, (now - state.lastTick) / 1000 || .016);
  state.lastTick = now;
  if (state.status === 'playing') {
    state.elapsed += dt;
    state.warmth = Math.min(100, state.warmth + dt * (.8 + state.blocks.length * .08));
    state.shield = Math.min(100, state.shield + dt * 5.5);
    updateWind(dt);
    if (state.warmth >= 100) snuff('The candle melted the snow shell.');
    state.stability = calculateStability();
    updateGhost();
    updateUI();
  }
  scene.traverse((obj) => { if (obj.name === 'snow') obj.rotation.y += dt * .05; });
  candle.rotation.y += dt * .7;
  lanternGroup.rotation.y += dt * .03;
  updateCamera();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function bind() {
  $('startBtn').addEventListener('click', startGame);
  $('pauseBtn').addEventListener('click', pauseGame);
  $('resumeBtn').addEventListener('click', resumeGame);
  $('restartBtn').addEventListener('click', restartGame);
  $('pauseRestartBtn').addEventListener('click', restartGame);
  $('againBtn').addEventListener('click', restartGame);
  $('leftBtn').addEventListener('click', () => shift(-.5, 0));
  $('rightBtn').addEventListener('click', () => shift(.5, 0));
  $('frontBtn').addEventListener('click', () => shift(0, .5));
  $('backBtn').addEventListener('click', () => shift(0, -.5));
  $('rotateBtn').addEventListener('click', rotatePiece);
  $('dropBtn').addEventListener('click', dropBlock);
  $('ventBtn').addEventListener('click', carveVent);
  $('shieldBtn').addEventListener('click', shield);
  let dragging = false, lastX = 0;
  els.canvas.addEventListener('pointerdown', (event) => { dragging = true; lastX = event.clientX; els.canvas.setPointerCapture(event.pointerId); });
  els.canvas.addEventListener('pointermove', (event) => { if (!dragging) return; const dx = event.clientX - lastX; lastX = event.clientX; state.cameraYaw -= dx * .006; });
  els.canvas.addEventListener('pointerup', () => { dragging = false; });
  window.addEventListener('keydown', (event) => {
    if (event.target && ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;
    const key = event.key.toLowerCase();
    if (['arrowleft','a'].includes(key)) shift(-.5, 0);
    else if (['arrowright','d'].includes(key)) shift(.5, 0);
    else if (['arrowup','w'].includes(key)) shift(0, .5);
    else if (['arrowdown','s'].includes(key)) shift(0, -.5);
    else if (['q','e'].includes(key)) rotatePiece();
    else if (key === ' ' || key === 'enter') { event.preventDefault(); if (state.status === 'menu') startGame(); else dropBlock(); }
    else if (key === 'f') carveVent();
    else if (key === 'm' || key === 'shift') shield();
    else if (key === 'p') state.status === 'paused' ? resumeGame() : pauseGame();
    else if (key === 'r') restartGame();
  });
}

initThree();
bind();
nextQueue();
updateUI();
