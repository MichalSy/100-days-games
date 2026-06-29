import * as THREE from './assets/three.module.min.js';

const $ = (selector) => document.querySelector(selector);
const canvas = $('#gameCanvas');
const ui = {
  score: $('#score'), bestScore: $('#bestScore'), hearts: $('#hearts'), timer: $('#timer'), combo: $('#combo'), tilt: $('#tiltReadout'),
  chapterTitle: $('#chapterTitle'), objective: $('#objectiveText'), chips: $('#goalChips'), helper: $('#statusHelper'), sealCharge: $('#sealCharge'),
  menu: $('#menuOverlay'), pause: $('#pauseOverlay'), results: $('#resultsOverlay'), banner: $('#fulfillBanner'), menuBest: $('#menuBest'), menuTime: $('#menuTime'), menuClean: $('#menuClean'),
  resultTitle: $('#resultTitle'), resultSummary: $('#resultSummary'), badges: $('#masteryBadges')
};

const storeKey = 'asa-daruma-day018-v1';
const saved = JSON.parse(localStorage.getItem(storeKey) || '{}');
const best = {
  score: saved.score || 0,
  dawnTime: saved.dawnTime || null,
  clean: saved.clean || 0,
  endless: saved.endless || 0,
  bells: saved.bells || 0,
  inkFewest: saved.inkFewest ?? null,
  seals: saved.seals || 0
};

const symbols = {
  sun: { icon: '☀', label: 'sun ema', color: 0xf4a025 },
  moon: { icon: '☾', label: 'moon ema', color: 0x2d74c4 },
  star: { icon: '★', label: 'star ema', color: 0xffd36a },
  gold: { icon: '✦', label: 'gold ema', color: 0xf7c64b }
};

const chapters = [
  {
    name: 'First Wish Roll', time: 85, scoreGoal: 0, start: [-4.4, 3.7], bowl: [4.45, -3.75],
    objective: 'Collect 2 sun ema, open the red torii, ring Bell A, then reach the offering bowl with at least 2 hearts.',
    required: { sun: 2 }, bells: ['A'], gates: [{ id: 'red', color: 0xc73425, need: 'sun', count: 2, pos: [0.05, 0.15], size: [0.38, 2.2], label: 'red torii' }],
    tokens: [{ type: 'sun', pos: [-2.8, 2.2] }, { type: 'sun', pos: [1.7, 2.8] }, { type: 'gold', pos: [-3.4, -2.9], bonus: true }],
    bells: [{ id: 'A', pos: [3.25, 1.65], pitch: 720 }],
    inks: [], ramps: [{ pos: [-0.8, -1.6], size: [2.5, 0.8], axis: 'x', slope: 0.16 }],
    walls: [[-1.8, 0.9, 3.2, .24], [1.6, -1.6, 3.0, .24], [-3.2, -0.8, .24, 2.3]]
  },
  {
    name: 'Torii Bridge Turn', time: 105, scoreGoal: 0, start: [-4.4, 3.8], bowl: [4.35, -3.55],
    objective: 'Add moon routing: collect 1 sun and 1 moon, cross the bridge ramp, open red then blue torii, ring Bells A and B.',
    required: { sun: 1, moon: 1 },
    gates: [
      { id: 'red', color: 0xc73425, need: 'sun', count: 1, pos: [-1.2, 0.8], size: [2.1, .34], label: 'red torii' },
      { id: 'blue', color: 0x2d74c4, need: 'moon', count: 1, pos: [1.45, -1.05], size: [.36, 2.3], label: 'blue torii' }
    ],
    tokens: [{ type: 'sun', pos: [-3.4, 1.65] }, { type: 'moon', pos: [2.6, 2.45] }, { type: 'gold', pos: [-3.65, -3.35], bonus: true }],
    bells: [{ id: 'A', pos: [3.4, 0.95], pitch: 650 }, { id: 'B', pos: [-.2, -2.75], pitch: 820 }],
    inks: [{ pos: [-.25, .15], r: .55 }, { pos: [2.85, -2.25], r: .48 }],
    ramps: [{ pos: [0.4, -0.2], size: [3.3, 0.72], axis: 'z', slope: -0.18 }, { pos: [-2.8, -2.4], size: [1.0, 1.9], axis: 'x', slope: .14 }],
    walls: [[-2.4, 0.25, .24, 3.3], [1.2, 1.65, 3.2, .24], [.75, -2.0, 3.1, .24]]
  },
  {
    name: 'Sunrise Bell Offering', time: 120, scoreGoal: 3200, start: [-4.5, 4.0], bowl: [4.45, -3.95],
    objective: 'Collect sun, moon, and star ema, ring all three bell arcs, dodge moving ink shadow, and reach 3200 points for Dawn Wish Fulfilled.',
    required: { sun: 1, moon: 1, star: 1 },
    gates: [
      { id: 'red', color: 0xc73425, need: 'sun', count: 1, pos: [-2.15, 0.15], size: [.36, 2.55], label: 'red torii' },
      { id: 'blue', color: 0x2d74c4, need: 'moon', count: 1, pos: [0.85, 1.05], size: [2.25, .36], label: 'blue torii' },
      { id: 'gold', color: 0xdca421, need: 'star', count: 1, pos: [1.65, -1.75], size: [.36, 2.55], label: 'gold torii' }
    ],
    tokens: [{ type: 'sun', pos: [-3.5, 2.4] }, { type: 'moon', pos: [.3, 3.2] }, { type: 'star', pos: [2.95, .15] }, { type: 'gold', pos: [-3.7, -3.45], bonus: true }],
    bells: [{ id: 'A', pos: [3.7, 2.45], pitch: 650 }, { id: 'B', pos: [-.25, -2.85], pitch: 790 }, { id: 'C', pos: [3.25, -2.8], pitch: 960 }],
    inks: [{ pos: [-.6, .25], r: .58 }, { pos: [2.6, -2.0], r: .52 }, { pos: [-2.9, -1.8], r: .46, moving: true }],
    ramps: [{ pos: [-.4, 1.6], size: [2.8, .72], axis: 'x', slope: .17 }, { pos: [2.35, -.85], size: [.9, 2.8], axis: 'z', slope: -.18 }, { pos: [-2.55, -2.7], size: [1.8, .8], axis: 'x', slope: .14 }],
    walls: [[-3.1, .95, 2.35, .24], [-.1, -.55, .24, 3.35], [2.45, 1.45, .24, 2.55], [.9, -3.0, 2.9, .24]]
  }
];

let scene, camera, renderer, boardGroup, ball, faceSprite, clock;
let tokenMeshes = [], gateMeshes = [], bellMeshes = [], inkMeshes = [], rampMeshes = [], wallMeshes = [], particles = [];
let running = false, paused = false, ended = false;
let audio = null;
const keyState = new Set();
const pressState = { up: false, down: false, left: false, right: false };
const state = {
  chapter: 0, score: 0, hearts: 3, combo: 1, elapsed: 0, chapterElapsed: 0, cleanStreak: 0, bellsRun: 0, inks: 0, railHits: 0,
  fulfilled: false, endlessBoard: 0, seal: 0, brakeCooldown: 0, sealCooldown: 0, stuck: 0, shadowPhase: 0,
  tilt: { x: 0, z: 0 }, targetTilt: { x: 0, z: 0 }, pos: new THREE.Vector3(), vel: new THREE.Vector3(), carried: {}, gatesOpen: {}, bells: {}, tokens: new Set(), lastSafe: new THREE.Vector3(-4.4, .33, 3.7)
};

function fmtTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
function saveBest() { localStorage.setItem(storeKey, JSON.stringify(best)); }
function updateMenuStats() {
  ui.menuBest.textContent = best.score;
  ui.menuTime.textContent = best.dawnTime ? fmtTime(best.dawnTime) : '—';
  ui.menuClean.textContent = best.clean;
  ui.bestScore.textContent = best.score;
}

function initThree() {
  if (renderer) return;
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf4b25b, 11, 25);
  camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
  camera.position.set(0, 9.3, 9.8);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  clock = new THREE.Clock();

  scene.add(new THREE.HemisphereLight(0xffe0a8, 0x35130a, 2.0));
  const sun = new THREE.DirectionalLight(0xffc66d, 2.2);
  sun.position.set(-4, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);
  const fill = new THREE.PointLight(0xff6e35, 1.5, 14);
  fill.position.set(4, 4, -5);
  scene.add(fill);

  boardGroup = new THREE.Group();
  scene.add(boardGroup);

  const loader = new THREE.TextureLoader();
  const darumaTexture = loader.load('./assets/asa-daruma.png');
  darumaTexture.colorSpace = THREE.SRGBColorSpace;

  ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 48, 32),
    new THREE.MeshStandardMaterial({ color: 0xc93426, roughness: 0.45, metalness: 0.08 })
  );
  ball.castShadow = true;
  scene.add(ball);

  faceSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: darumaTexture, transparent: true, depthWrite: false }));
  faceSprite.scale.set(1.1, 1.1, 1.1);
  scene.add(faceSprite);

  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.58, .72, .28, 36), new THREE.MeshStandardMaterial({ color: 0x22110a, roughness: .42, metalness: .4 }));
  bowl.name = 'bowl';
  bowl.castShadow = true;
  boardGroup.add(bowl);
  resize();
  window.addEventListener('resize', resize);
}

function resize() {
  if (!renderer) return;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(320, Math.floor(rect.width));
  const h = Math.max(300, Math.floor(rect.height));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const mobile = w < 620;
  camera.position.set(0, mobile ? 10.7 : 8.7, mobile ? 10.9 : 9.2);
  camera.fov = mobile ? 52 : 46;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}

const mat = {
  board: new THREE.MeshStandardMaterial({ color: 0x8d542b, roughness: .55, metalness: .05 }),
  tatami: new THREE.MeshStandardMaterial({ color: 0xd5b56a, roughness: .76 }),
  rail: new THREE.MeshStandardMaterial({ color: 0xb72820, roughness: .38, metalness: .12 }),
  wall: new THREE.MeshStandardMaterial({ color: 0x7b321e, roughness: .5 }),
  ink: new THREE.MeshStandardMaterial({ color: 0x090607, roughness: .25, metalness: .1 }),
  ramp: new THREE.MeshStandardMaterial({ color: 0xc8934d, roughness: .62 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xffd36a, roughness: .32, metalness: .4 })
};

function clearBoard() {
  for (const m of [...tokenMeshes, ...gateMeshes, ...bellMeshes, ...inkMeshes, ...rampMeshes, ...wallMeshes]) {
    boardGroup.remove(m);
  }
  tokenMeshes = []; gateMeshes = []; bellMeshes = []; inkMeshes = []; rampMeshes = []; wallMeshes = [];
  const keep = boardGroup.children.filter((child) => child.name === 'bowl');
  boardGroup.clear();
  keep.forEach((child) => boardGroup.add(child));
}

function buildBoard() {
  clearBoard();
  const ch = chapters[Math.min(state.chapter, chapters.length - 1)];
  const base = new THREE.Mesh(new THREE.BoxGeometry(10.6, .32, 9.8), mat.board);
  base.receiveShadow = true; base.position.y = -0.16; boardGroup.add(base);
  const tatami = new THREE.Mesh(new THREE.BoxGeometry(9.55, .08, 8.75), mat.tatami);
  tatami.position.y = .03; tatami.receiveShadow = true; boardGroup.add(tatami);

  const addRail = (x, z, sx, sz) => {
    const r = new THREE.Mesh(new THREE.BoxGeometry(sx, .55, sz), mat.rail);
    r.position.set(x, .28, z); r.castShadow = true; r.receiveShadow = true; boardGroup.add(r);
  };
  addRail(0, 4.92, 10.7, .22); addRail(0, -4.92, 10.7, .22); addRail(-5.35, 0, .22, 9.8); addRail(5.35, 0, .22, 9.8);
  // torii rail posts as corner finials
  [[-5.0,4.55],[5.0,4.55],[-5.0,-4.55],[5.0,-4.55]].forEach(([x,z])=>{
    const p = new THREE.Mesh(new THREE.CylinderGeometry(.18,.22,.7,18), mat.gold); p.position.set(x,.45,z); p.castShadow=true; boardGroup.add(p);
  });

  for (const w of ch.walls) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w[2], .45, w[3]), mat.wall);
    mesh.position.set(w[0], .25, w[1]); mesh.castShadow = true; mesh.receiveShadow = true; mesh.userData = { type: 'wall', rect: w };
    wallMeshes.push(mesh); boardGroup.add(mesh);
  }
  for (const ramp of ch.ramps) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(ramp.size[0], .12, ramp.size[1]), mat.ramp);
    mesh.position.set(ramp.pos[0], .12, ramp.pos[1]);
    mesh.rotation[ramp.axis === 'x' ? 'z' : 'x'] = ramp.slope;
    mesh.receiveShadow = true; mesh.userData = ramp; rampMeshes.push(mesh); boardGroup.add(mesh);
  }
  for (const gate of ch.gates) {
    const group = new THREE.Group(); group.position.set(gate.pos[0], .38, gate.pos[1]); group.userData = gate;
    const material = new THREE.MeshStandardMaterial({ color: gate.color, roughness: .36, metalness: .18 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(gate.size[0], .55, gate.size[1]), material);
    bar.castShadow = true; bar.receiveShadow = true; group.add(bar);
    const arch = new THREE.Mesh(new THREE.BoxGeometry(Math.max(gate.size[0], .9), .18, Math.max(gate.size[1], .9)), mat.gold);
    arch.position.y = .47; arch.castShadow = true; group.add(arch);
    gateMeshes.push(group); boardGroup.add(group);
  }
  for (const token of ch.tokens) {
    const group = new THREE.Group(); group.position.set(token.pos[0], .32, token.pos[1]); group.userData = token;
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(.52, .08, .42), new THREE.MeshStandardMaterial({ color: symbols[token.type].color, roughness: .5, metalness: token.bonus ? .35 : .08 }));
    plaque.castShadow = true; plaque.rotation.y = Math.PI / 4; group.add(plaque);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.24, .025, 8, 30), mat.gold); ring.rotation.x = Math.PI/2; ring.position.y=.09; group.add(ring);
    tokenMeshes.push(group); boardGroup.add(group);
  }
  for (const bell of ch.bells) {
    const group = new THREE.Group(); group.position.set(bell.pos[0], .45, bell.pos[1]); group.userData = bell;
    const stand = new THREE.Mesh(new THREE.TorusGeometry(.36, .035, 8, 28), mat.gold); stand.rotation.x = Math.PI/2; group.add(stand);
    const body = new THREE.Mesh(new THREE.ConeGeometry(.22, .38, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0xc98d34, roughness: .28, metalness: .55 }));
    body.position.y = .16; body.castShadow = true; group.add(body);
    bellMeshes.push(group); boardGroup.add(group);
  }
  for (const ink of ch.inks) {
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(ink.r, 34), mat.ink);
    mesh.rotation.x = -Math.PI / 2; mesh.position.set(ink.pos[0], .072, ink.pos[1]); mesh.userData = ink;
    inkMeshes.push(mesh); boardGroup.add(mesh);
  }
  const bowl = boardGroup.children.find(c => c.name === 'bowl');
  if (bowl) bowl.position.set(ch.bowl[0], .22, ch.bowl[1]);
}

function resetRun() {
  Object.assign(state, { chapter: 0, score: 0, hearts: 3, combo: 1, elapsed: 0, chapterElapsed: 0, cleanStreak: 0, bellsRun: 0, inks: 0, railHits: 0, fulfilled: false, endlessBoard: 0, seal: 0, brakeCooldown: 0, sealCooldown: 0, stuck: 0, shadowPhase: 0 });
  state.carried = {}; state.gatesOpen = {}; state.bells = {}; state.tokens = new Set();
  startChapter(0);
  ended = false; paused = false; running = true;
  ui.results.classList.remove('visible'); ui.pause.classList.remove('visible'); ui.menu.classList.remove('visible'); ui.banner.classList.add('hidden');
}

function startChapter(index) {
  state.chapter = index;
  state.chapterElapsed = 0; state.carried = {}; state.gatesOpen = {}; state.bells = {}; state.tokens = new Set(); state.stuck = 0;
  const ch = chapters[Math.min(index, chapters.length - 1)];
  const start = ch.start;
  state.pos.set(start[0], .42, start[1]); state.vel.set(0,0,0); state.lastSafe.copy(state.pos);
  buildBoard(); updateHud();
  ui.helper.textContent = `${ch.name}: tap short tilts, collect requested plaques, and Brake before the first torii rail.`;
}

function initAudio() {
  if (audio) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    audio = { ctx };
  } catch { audio = null; }
}
async function ensureAudio() {
  initAudio();
  if (audio?.ctx?.state === 'suspended') {
    try { await audio.ctx.resume(); } catch { /* optional audio */ }
  }
}
function tone(freq, dur = .12, type = 'sine', gain = .045) {
  if (!audio || audio.ctx.state !== 'running') return;
  const ctx = audio.ctx; const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const g = ctx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(gain, now + .01); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g).connect(ctx.destination); osc.start(now); osc.stop(now + dur + .03);
}
function play(kind, pitch = 680) {
  if (kind === 'bump') tone(130, .07, 'triangle', .03);
  if (kind === 'ema') { tone(560, .08, 'sine', .035); setTimeout(() => tone(760, .10, 'sine', .03), 45); }
  if (kind === 'bell') { tone(pitch, .22, 'sine', .055); setTimeout(() => tone(pitch * 1.5, .25, 'sine', .025), 70); }
  if (kind === 'ink') tone(90, .22, 'sawtooth', .025);
  if (kind === 'dawn') [520, 650, 780, 1040].forEach((f, i) => setTimeout(() => tone(f, .20, 'sine', .045), i * 95));
}

function inputVector() {
  let x = 0, z = 0;
  if (pressState.left || keyState.has('ArrowLeft') || keyState.has('a')) x -= 1;
  if (pressState.right || keyState.has('ArrowRight') || keyState.has('d')) x += 1;
  if (pressState.up || keyState.has('ArrowUp') || keyState.has('w')) z -= 1;
  if (pressState.down || keyState.has('ArrowDown') || keyState.has('s')) z += 1;
  const len = Math.hypot(x, z) || 1;
  return { x: x / len, z: z / len, active: x || z };
}

function rectCollide(px, pz, rect, radius = .42) {
  const [cx, cz, sx, sz] = rect;
  const dx = Math.max(Math.abs(px - cx) - sx / 2, 0);
  const dz = Math.max(Math.abs(pz - cz) - sz / 2, 0);
  return dx * dx + dz * dz < radius * radius;
}
function resolveRect(rect) {
  const [cx, cz, sx, sz] = rect;
  const px = state.pos.x, pz = state.pos.z;
  const ox = sx / 2 + .42 - Math.abs(px - cx);
  const oz = sz / 2 + .42 - Math.abs(pz - cz);
  if (ox < oz) { state.pos.x += px < cx ? -ox : ox; state.vel.x *= -.46; }
  else { state.pos.z += pz < cz ? -oz : oz; state.vel.z *= -.46; }
  state.combo = 1; state.railHits++; play('bump');
}
function addScore(points, reason) {
  state.score += Math.round(points * Math.min(state.combo, 5));
  state.combo = Math.min(5, state.combo + .25);
  ui.helper.textContent = `${reason}: +${Math.round(points)} · combo x${state.combo.toFixed(1)}`;
}
function damage(reason) {
  if (state.chapter === 0 && state.elapsed < 10 && reason.includes('ink')) return;
  state.hearts -= 1; state.combo = 1; state.vel.multiplyScalar(.15);
  play(reason.includes('ink') ? 'ink' : 'bump');
  ui.helper.textContent = `${reason}. A wish heart cracked; Brake and reroute from the last bell perch.`;
  state.pos.copy(state.lastSafe); state.pos.y = .42;
  if (state.hearts <= 0) endRun(false, reason);
}

function updatePhysics(dt) {
  const ch = chapters[Math.min(state.chapter, chapters.length - 1)];
  const iv = inputVector();
  const maxTilt = 0.38 + Math.min(state.chapter, 2) * .045 + state.endlessBoard * .01;
  state.targetTilt.x = iv.active ? iv.x * maxTilt : 0;
  state.targetTilt.z = iv.active ? iv.z * maxTilt : 0;
  state.tilt.x += (state.targetTilt.x - state.tilt.x) * Math.min(1, dt * 6);
  state.tilt.z += (state.targetTilt.z - state.tilt.z) * Math.min(1, dt * 6);
  boardGroup.rotation.z = -state.tilt.x * .22;
  boardGroup.rotation.x = state.tilt.z * .22;

  if (state.brakeCooldown > 0) state.brakeCooldown -= dt;
  if (state.sealCooldown > 0) state.sealCooldown -= dt;

  let accelX = state.tilt.x * 7.2;
  let accelZ = state.tilt.z * 7.2;
  for (const r of ch.ramps) {
    if (Math.abs(state.pos.x - r.pos[0]) < r.size[0] / 2 + .2 && Math.abs(state.pos.z - r.pos[1]) < r.size[1] / 2 + .2) {
      if (r.axis === 'x') accelX += r.slope * 10;
      else accelZ += r.slope * 10;
      state.pos.y = .52 + Math.abs(r.slope) * .65;
    }
  }
  if (state.sealCooldown > 0) { accelX = 0; accelZ = 0; state.vel.multiplyScalar(0.72); }
  state.vel.x += accelX * dt; state.vel.z += accelZ * dt;
  state.vel.multiplyScalar(Math.pow(.965, dt * 60));
  const speedCap = 5.1 + state.endlessBoard * .2;
  const sp = Math.hypot(state.vel.x, state.vel.z);
  if (sp > speedCap) state.vel.multiplyScalar(speedCap / sp);
  state.pos.x += state.vel.x * dt; state.pos.z += state.vel.z * dt;
  state.pos.y += (.42 - state.pos.y) * Math.min(1, dt * 4);

  // Bounds
  if (state.pos.x < -4.92 || state.pos.x > 4.92) { state.pos.x = THREE.MathUtils.clamp(state.pos.x, -4.92, 4.92); state.vel.x *= -.55; state.combo = 1; state.railHits++; play('bump'); }
  if (state.pos.z < -4.48 || state.pos.z > 4.48) { state.pos.z = THREE.MathUtils.clamp(state.pos.z, -4.48, 4.48); state.vel.z *= -.55; state.combo = 1; state.railHits++; play('bump'); }
  for (const w of ch.walls) if (rectCollide(state.pos.x, state.pos.z, w)) resolveRect(w);

  for (const gate of ch.gates) {
    if (!state.gatesOpen[gate.id] && (state.carried[gate.need] || 0) >= gate.count) {
      state.gatesOpen[gate.id] = true; addScore(180, `${gate.label} opened with ${symbols[gate.need].label}`); play('ema');
    }
    if (!state.gatesOpen[gate.id] && rectCollide(state.pos.x, state.pos.z, [gate.pos[0], gate.pos[1], gate.size[0], gate.size[1]], .45)) {
      state.chapterElapsed += 3; state.combo = 1; resolveRect([gate.pos[0], gate.pos[1], gate.size[0], gate.size[1]]); ui.helper.textContent = `Closed ${gate.label}: collect ${gate.count} ${symbols[gate.need].icon} ${symbols[gate.need].label} first.`;
    }
  }

  ch.tokens.forEach((token, i) => {
    if (state.tokens.has(i)) return;
    const d = Math.hypot(state.pos.x - token.pos[0], state.pos.z - token.pos[1]);
    if (d < .55) {
      state.tokens.add(i); state.carried[token.type] = (state.carried[token.type] || 0) + 1;
      addScore(token.bonus ? 150 : 95, `${symbols[token.type].icon} ${symbols[token.type].label} collected`); play('ema');
    }
  });
  ch.bells.forEach((bell) => {
    if (state.bells[bell.id]) return;
    const d = Math.hypot(state.pos.x - bell.pos[0], state.pos.z - bell.pos[1]);
    if (d < .62 && Math.hypot(state.vel.x, state.vel.z) > .45) {
      state.bells[bell.id] = true; state.lastSafe.copy(state.pos); state.seal = Math.min(100, state.seal + 42); state.bellsRun++;
      addScore(220, `Bell ${bell.id} rang cleanly`); play('bell', bell.pitch);
      burst(bell.pos[0], bell.pos[1], 0xffd36a);
    }
  });
  for (const ink of ch.inks) {
    const ix = ink.moving ? ink.pos[0] + Math.sin(state.shadowPhase) * .55 : ink.pos[0];
    const iz = ink.moving ? ink.pos[1] + Math.cos(state.shadowPhase * .8) * .25 : ink.pos[1];
    const d = Math.hypot(state.pos.x - ix, state.pos.z - iz);
    if (d < ink.r + .28 && state.sealCooldown <= 0) { state.inks++; damage('Sumi ink touched the daruma'); break; }
  }
  const bowlD = Math.hypot(state.pos.x - ch.bowl[0], state.pos.z - ch.bowl[1]);
  if (bowlD < .72) tryCompleteChapter();

  if (Math.hypot(state.vel.x, state.vel.z) < .06 && Object.keys(state.gatesOpen).length < ch.gates.length && state.elapsed > 8) state.stuck += dt; else state.stuck = 0;
  if (state.stuck > 7) damage('Momentum faded beside a closed gate');

  state.shadowPhase += dt * 1.6;
  updateMeshes(dt);
}

function tryCompleteChapter() {
  const ch = chapters[Math.min(state.chapter, chapters.length - 1)];
  const reqOk = Object.entries(ch.required).every(([k, v]) => (state.carried[k] || 0) >= v);
  const gatesOk = ch.gates.every(g => state.gatesOpen[g.id]);
  const bellsOk = ch.bells.every(b => state.bells[b.id]);
  if (!reqOk || !gatesOk || !bellsOk) {
    ui.helper.textContent = 'Offering bowl is waiting: finish required plaques, torii gates, and bells first.';
    state.vel.multiplyScalar(.82);
    return;
  }
  addScore(520, `${ch.name} completed`);
  if (state.hearts >= 2) addScore(160, 'strong-heart chapter bonus');
  if (state.inks === 0) addScore(640, 'perfect no-ink shrine path');
  state.hearts = Math.min(3, state.hearts + 1);
  state.cleanStreak += 1;
  if (state.chapter < 2) startChapter(state.chapter + 1);
  else {
    if (!state.fulfilled && state.score >= 3200) fulfillDawnWish();
    state.endlessBoard += 1;
    startEndlessBoard();
  }
}
function fulfillDawnWish() {
  state.fulfilled = true; state.score += 1100; play('dawn'); ui.banner.classList.remove('hidden'); setTimeout(() => ui.banner.classList.add('hidden'), 4300);
  if (!best.dawnTime || state.elapsed < best.dawnTime) best.dawnTime = Math.floor(state.elapsed);
  ui.helper.textContent = 'Asa Dawn Wish Fulfilled! Endless shrine boards continue with stronger inertia.';
}
function startEndlessBoard() {
  // Rotate back into the final authored board with stricter time and stronger inertia; deterministic seed changes token collection through score pressure.
  state.chapter = 2; state.chapterElapsed = 0; state.carried = {}; state.gatesOpen = {}; state.bells = {}; state.tokens = new Set();
  const ch = chapters[2]; state.pos.set(ch.start[0], .42, ch.start[1]); state.vel.set(0,0,0); buildBoard();
}

function burst(x, z, color) {
  for (let i = 0; i < 10; i++) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(.045, 8, 8), new THREE.MeshBasicMaterial({ color }));
    mesh.position.set(x, .75, z); mesh.userData = { life: .7, v: new THREE.Vector3((Math.random()-.5)*1.8, Math.random()*1.8+.5, (Math.random()-.5)*1.8) };
    particles.push(mesh); scene.add(mesh);
  }
}
function updateMeshes(dt) {
  ball.position.copy(state.pos); ball.rotation.x += state.vel.z * dt * 2.4; ball.rotation.z -= state.vel.x * dt * 2.4;
  faceSprite.position.set(state.pos.x, state.pos.y + .62, state.pos.z + .06);
  faceSprite.material.rotation = -state.vel.x * .04;
  tokenMeshes.forEach((m, i) => { m.visible = !state.tokens.has(i); m.rotation.y += dt * 1.5; m.position.y = .34 + Math.sin(state.elapsed * 3 + i) * .035; });
  gateMeshes.forEach((m) => { const open = state.gatesOpen[m.userData.id]; m.position.y += (((open ? 1.35 : .38) - m.position.y) * Math.min(1, dt * 4)); });
  bellMeshes.forEach((m) => { if (state.bells[m.userData.id]) m.rotation.z = Math.sin(state.elapsed * 13) * .12; });
  inkMeshes.forEach((m, i) => { const ink = m.userData; if (ink.moving) { m.position.x = ink.pos[0] + Math.sin(state.shadowPhase) * .55; m.position.z = ink.pos[1] + Math.cos(state.shadowPhase * .8) * .25; } m.scale.setScalar(1 + Math.sin(state.elapsed * 4 + i) * .05); });
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.userData.life -= dt; p.position.addScaledVector(p.userData.v, dt); p.userData.v.y -= 3 * dt;
    p.material.opacity = Math.max(0, p.userData.life); p.material.transparent = true;
    if (p.userData.life <= 0) { scene.remove(p); particles.splice(i, 1); }
  }
}

function updateHud() {
  const ch = chapters[Math.min(state.chapter, chapters.length - 1)];
  ui.score.textContent = state.score;
  ui.bestScore.textContent = best.score;
  ui.hearts.textContent = '♥'.repeat(Math.max(0, state.hearts)) + '♡'.repeat(Math.max(0, 3 - state.hearts));
  ui.timer.textContent = fmtTime(state.elapsed);
  ui.combo.textContent = `x${state.combo.toFixed(1)}`;
  const tiltMag = Math.hypot(state.tilt.x, state.tilt.z);
  ui.tilt.textContent = tiltMag < .04 ? 'calm' : `${Math.round(tiltMag * 100)}%`;
  ui.chapterTitle.textContent = state.fulfilled ? `${ch.name} · Endless ${state.endlessBoard}` : ch.name;
  const remaining = Math.max(0, Math.ceil(ch.time - state.chapterElapsed));
  ui.objective.textContent = `${ch.objective} (${remaining}s chapter dawn timer)`;
  ui.sealCharge.textContent = `${Math.floor(state.seal)}%`;
  const chipHtml = [];
  for (const [k, v] of Object.entries(ch.required)) chipHtml.push(`<span class="chip ${(state.carried[k]||0)>=v ? 'done' : ''}">${symbols[k].icon} ${(state.carried[k]||0)}/${v} ${symbols[k].label}</span>`);
  for (const g of ch.gates) chipHtml.push(`<span class="chip ${state.gatesOpen[g.id] ? 'done' : ''}">⛩ ${g.label}: ${state.gatesOpen[g.id] ? 'open' : symbols[g.need].icon + ' needed'}</span>`);
  for (const b of ch.bells) chipHtml.push(`<span class="chip ${state.bells[b.id] ? 'done' : ''}">🔔 Bell ${b.id}</span>`);
  chipHtml.push(`<span class="chip ${Math.hypot(state.pos.x - ch.bowl[0], state.pos.z - ch.bowl[1]) < .9 ? 'warn' : ''}">🍚 Offering bowl</span>`);
  ui.chips.innerHTML = chipHtml.join('');
}
function statusTick() {
  if (!running || paused || ended) return;
  const speed = Math.hypot(state.vel.x, state.vel.z);
  const carried = Object.entries(state.carried).map(([k, v]) => `${symbols[k].icon}${v}`).join(' ') || 'none';
  const nextGate = chapters[Math.min(state.chapter, 2)].gates.find(g => !state.gatesOpen[g.id]);
  const inkRisk = inkMeshes.some(m => Math.hypot(state.pos.x - m.position.x, state.pos.z - m.position.z) < 1.05) ? 'Ink close — Brake or Seal!' : 'Ink clear';
  ui.helper.textContent = `Tilt ${ui.tilt.textContent}; daruma speed ${speed.toFixed(1)}. Carried ${carried}. ${nextGate ? `Next: ${nextGate.label} needs ${symbols[nextGate.need].icon}.` : 'All gates open.'} ${inkRisk}`;
}
setInterval(statusTick, 2400);

function loop() {
  requestAnimationFrame(loop);
  if (!renderer) return;
  const dt = Math.min(.033, clock.getDelta() || .016);
  if (running && !paused && !ended) {
    state.elapsed += dt; state.chapterElapsed += dt;
    if (state.chapterElapsed > chapters[Math.min(state.chapter, 2)].time) damage('The dawn timer expired');
    updatePhysics(dt); updateHud();
  }
  renderer.render(scene, camera);
}

function brake() {
  if (!running || paused || ended || state.brakeCooldown > 0) return;
  state.vel.multiplyScalar(.38); state.tilt.x *= .35; state.tilt.z *= .35; state.targetTilt.x = 0; state.targetTilt.z = 0; state.brakeCooldown = 1.2;
  if (state.vel.length() > .35) addScore(75, 'Brake-assisted corner'); else ui.helper.textContent = 'Brake/Center calmed the board; line up the next torii before tilting.';
  play('bump');
}
function seal() {
  if (!running || paused || ended || state.seal < 100) { ui.helper.textContent = 'Stillness Seal needs clean bell rings before it can calm the board.'; return; }
  state.seal = 0; state.sealCooldown = 1.7; state.vel.multiplyScalar(.05); best.seals += 1;
  // clear nearest ink briefly by shrinking it out
  let nearest = null, nd = Infinity;
  inkMeshes.forEach(m => { const d = Math.hypot(state.pos.x - m.position.x, state.pos.z - m.position.z); if (d < nd) { nd = d; nearest = m; } });
  if (nearest && nd < 1.45) { nearest.scale.setScalar(.25); setTimeout(() => { if (nearest) nearest.scale.setScalar(1); }, 2600); }
  ui.helper.textContent = 'Stillness Seal holds the daruma steady and clears the closest ink shimmer.'; play('bell', 520);
}
function setPaused(value) { if (!running || ended) return; paused = value; ui.pause.classList.toggle('visible', paused); }
function endRun(won, reason) {
  ended = true; running = false;
  best.score = Math.max(best.score, state.score); best.clean = Math.max(best.clean, state.cleanStreak); best.endless = Math.max(best.endless, state.endlessBoard); best.bells = Math.max(best.bells, state.bellsRun);
  if (state.fulfilled) best.inkFewest = best.inkFewest === null ? state.inks : Math.min(best.inkFewest, state.inks);
  saveBest(); updateMenuStats();
  const badges = [];
  if (state.chapter > 0 && state.railHits < 4) badges.push('First Wish without rail panic');
  if (state.fulfilled && state.elapsed < 210) badges.push('Dawn Wish under 210s');
  if (Object.values(state.carried).reduce((a,b)=>a+b,0) >= 12) badges.push('12 ema chain');
  if (state.bellsRun >= 3 && state.combo >= 3) badges.push('Three-bell combo');
  if (best.seals === 0 || state.seal > 90) badges.push('No Seal discipline');
  if (state.endlessBoard && state.hearts === 3) badges.push('All-heart endless clear');
  ui.resultTitle.textContent = won || state.fulfilled ? 'Asa Dawn Wish Fulfilled' : 'Wish chain cracked';
  ui.resultSummary.innerHTML = `<div><b>${state.score}</b><span>Final score</span></div><div><b>${best.score}</b><span>Best score</span></div><div><b>${chapters[Math.min(state.chapter,2)].name}</b><span>Chapter reached</span></div><div><b>${state.fulfilled ? 'Yes' : 'No'}</b><span>Dawn Wish</span></div><div><b>${state.cleanStreak}</b><span>Clean-roll streak</span></div><div><b>${state.bellsRun}</b><span>Bells rung</span></div><div><b>${state.inks}</b><span>Ink touches</span></div><div><b>${reason}</b><span>Result</span></div>`;
  ui.badges.innerHTML = badges.length ? badges.map(b => `<span>${b}</span>`).join('') : '<span>Try a slower opening tilt to earn mastery badges.</span>';
  ui.results.classList.add('visible');
}

function bind() {
  $('#startBtn').addEventListener('click', async () => { initThree(); await ensureAudio(); resetRun(); });
  $('#restartBtn').addEventListener('click', resetRun); $('#pauseRestartBtn').addEventListener('click', resetRun); $('#resultsRestartBtn').addEventListener('click', resetRun);
  $('#pauseBtn').addEventListener('click', () => setPaused(!paused)); $('#resumeBtn').addEventListener('click', () => setPaused(false));
  $('#brakeBtn').addEventListener('click', brake); $('#sealBtn').addEventListener('click', seal);
  document.querySelectorAll('[data-tilt]').forEach((btn) => {
    const dir = btn.dataset.tilt;
    const on = async (ev) => { ev.preventDefault(); await ensureAudio(); pressState[dir] = true; btn.classList.add('active-press'); };
    const off = () => { pressState[dir] = false; btn.classList.remove('active-press'); };
    btn.addEventListener('pointerdown', on); btn.addEventListener('pointerup', off); btn.addEventListener('pointerleave', off); btn.addEventListener('pointercancel', off);
  });
  window.addEventListener('keydown', async (e) => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
    await ensureAudio(); keyState.add(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    if ((e.key === ' ' || e.key === 'Enter') && ui.menu.classList.contains('visible')) { initThree(); resetRun(); }
    else if (e.key === ' ' || e.key === 'Enter') brake();
    if (e.key === 'Shift') seal();
    if (e.key.toLowerCase() === 'p') setPaused(!paused);
    if (e.key.toLowerCase() === 'r') resetRun();
  });
  window.addEventListener('keyup', (e) => keyState.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key));
}

updateMenuStats();
initThree();
buildBoard();
updateHud();
bind();
loop();
