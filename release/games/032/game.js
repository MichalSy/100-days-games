import * as THREE from './assets/three.module.min.js';

const DAY = 32;
const STORAGE_KEY = 'day032-onsen-steamline-bathkeeper';
const lanes = ['Near', 'Mid', 'Far'];
const valveStates = ['Cool', 'Neutral', 'Hot', 'Outlet'];
const valveTemp = { Cool: 31, Neutral: 38, Hot: 47, Outlet: 35 };
const commissions = [
  {
    name: 'First Cedar Soak',
    text: 'Warm Cedar Pool to 42°C, keep Stone Pool comfortable, and vent pressure safely.',
    bands: [[39, 43], [37, 42], [36, 42]],
    goals: { comfortTicks: 9, vents: 1, spouts: 1, macaques: 1 },
    timeLimit: 95,
    pressureLimit: 72,
    mineralTarget: 72
  },
  {
    name: 'Moonstone Mineral Loop',
    text: 'Hold Cedar and Moonstone in band, preserve mineral glow, and soothe two macaque guests.',
    bands: [[40, 43], [38, 40], [37, 41]],
    goals: { comfortTicks: 16, vents: 2, spouts: 2, macaques: 2 },
    timeLimit: 135,
    pressureLimit: 68,
    mineralTarget: 78
  },
  {
    name: 'Snow-Monkey Dawn Bath',
    text: 'Balance three pools through cold dawn drafts, use Yuge Focus, and keep pressure below danger.',
    bands: [[40, 42], [38.5, 40.5], [39, 41]],
    goals: { comfortTicks: 22, vents: 3, spouts: 3, macaques: 3, focus: 1 },
    timeLimit: 155,
    pressureLimit: 64,
    mineralTarget: 82
  }
];

const $ = (id) => document.getElementById(id);
const els = {
  menu: $('menu'), game: $('game'), start: $('startBtn'), pauseOverlay: $('pauseOverlay'), results: $('resultsOverlay'),
  score: $('scoreEl'), best: $('bestEl'), hearts: $('heartsEl'), pressure: $('pressureEl'), combo: $('comboEl'), lane: $('laneEl'), valve: $('valveEl'),
  focus: $('focusEl'), mineral: $('mineralEl'), time: $('timeEl'), helper: $('helperText'), commissionName: $('commissionName'), commissionText: $('commissionText'),
  goalTicks: $('goalTicks'), grand: $('grandBanner'), focusOverlay: $('focusOverlay'), prediction: $('predictionText'), menuBest: $('menuBest'), menuYuge: $('menuYuge'),
  resultsTitle: $('resultsTitle'), resultsStats: $('resultsStats'), badgeList: $('badgeList'), mute: $('muteBtn')
};

let renderer, scene, camera, clock;
let rootGroup, steamGroup, valveMeshes = [], poolMeshes = [], poolLabels = [], macaqueMesh, focusLines = [];
let audio = { ctx: null, enabled: false, muted: false };
let rafId = 0;
let running = false;
let paused = false;
let lastTick = 0;
let state;

function defaultState() {
  return {
    score: 0,
    hearts: 3,
    pressure: 0,
    combo: 1,
    focus: 0,
    focusActive: 0,
    mineral: 100,
    activeLane: 0,
    valveIndex: 1,
    temps: [38, 37.5, 38.5],
    poolStable: [0, 0, 0],
    comfortTicks: 0,
    vents: 0,
    spouts: 0,
    stirs: 0,
    macaques: 0,
    shocks: 0,
    commission: 0,
    elapsed: 0,
    commissionElapsed: 0,
    bestChain: 0,
    chain: 0,
    yuge: false,
    ended: false,
    warnings: [],
    badges: []
  };
}

function loadBest() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveBest(final = false) {
  const best = loadBest();
  best.score = Math.max(best.score || 0, state.score);
  best.chain = Math.max(best.chain || 0, state.bestChain);
  if (state.yuge) {
    best.yugeTime = best.yugeTime ? Math.min(best.yugeTime, Math.round(state.elapsed)) : Math.round(state.elapsed);
  }
  if (final) best.lastRun = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(best));
  renderBest();
}
function renderBest() {
  const best = loadBest();
  els.menuBest.textContent = String(best.score || 0);
  els.best.textContent = String(best.score || 0);
  els.menuYuge.textContent = best.yugeTime ? formatTime(best.yugeTime) : '—';
}

function initAudio() {
  if (audio.ctx || audio.muted) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audio.ctx = new Ctx();
    audio.enabled = true;
    window.__day032Audio = audio;
  } catch {
    audio.enabled = false;
  }
}
function playTone(kind = 'tap') {
  if (!audio.ctx || audio.muted) return;
  const ctx = audio.ctx;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  const osc = ctx.createOscillator();
  const map = {
    tap: [280, 0.06, 'triangle', 0.035], valve: [430, 0.08, 'square', 0.032], steam: [680, 0.16, 'sine', 0.025],
    splash: [520, 0.18, 'sine', 0.04], stir: [330, 0.14, 'triangle', 0.03], warn: [120, 0.22, 'sawtooth', 0.045],
    macaque: [740, 0.11, 'triangle', 0.035], focus: [860, 0.28, 'sine', 0.04], grand: [523, 0.7, 'sine', 0.045]
  }[kind] || [300, 0.08, 'sine', 0.03];
  osc.type = map[2];
  osc.frequency.setValueAtTime(map[0], now);
  if (kind === 'grand') {
    osc.frequency.exponentialRampToValueAtTime(1046, now + map[1]);
  } else if (kind === 'warn') {
    osc.frequency.exponentialRampToValueAtTime(90, now + map[1]);
  }
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(map[3], now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + map[1]);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + map[1] + 0.03);
}

function initThree() {
  const stage = $('stage');
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(stage.clientWidth || 640, stage.clientHeight || 420);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x082232, 8, 18);
  camera = new THREE.PerspectiveCamera(44, 1, 0.1, 60);
  camera.position.set(0, 6.4, 9.2);
  camera.lookAt(0, 0, 0);
  clock = new THREE.Clock();

  scene.add(new THREE.HemisphereLight(0xc7f5ff, 0x4b2215, 1.8));
  const key = new THREE.DirectionalLight(0xffd89c, 2.1);
  key.position.set(4, 9, 7);
  scene.add(key);
  const rim = new THREE.PointLight(0x74e8ff, 35, 16);
  rim.position.set(-4.5, 3, -4);
  scene.add(rim);

  rootGroup = new THREE.Group();
  scene.add(rootGroup);
  steamGroup = new THREE.Group();
  scene.add(steamGroup);
  makeBathhouse();
  resizeStage();
  window.addEventListener('resize', resizeStage);
}

function mat(color, rough = 0.72, metal = 0.05, opacity = 1) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, transparent: opacity < 1, opacity });
}

function makeBathhouse() {
  const floor = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.18, 7.8), mat(0x263842, 0.85));
  floor.position.y = -0.1;
  rootGroup.add(floor);
  const grid = new THREE.GridHelper(7.6, 8, 0x6fb5bf, 0x375963);
  grid.position.y = 0.005;
  rootGroup.add(grid);

  const poolData = [
    { pos: [-2.35, 0.12, 2.2], name: 'Cedar', color: 0x4dd4e8 },
    { pos: [2.2, 0.12, 0.15], name: 'Moonstone', color: 0x7fffd6 },
    { pos: [-1.25, 0.12, -2.35], name: 'Macaque', color: 0xffd082 }
  ];
  poolData.forEach((p, i) => {
    const group = new THREE.Group();
    group.position.set(...p.pos);
    const tub = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.22, 0.45, 48), mat(i === 1 ? 0x7a6553 : 0x8b5730, 0.62));
    tub.position.y = 0.2;
    const water = new THREE.Mesh(new THREE.CylinderGeometry(1.04, 1.04, 0.08, 48), mat(p.color, 0.2, 0, 0.78));
    water.position.y = 0.47;
    water.name = 'water';
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.13, 0.05, 12, 48), mat(0xf2c47b, 0.48, 0.25));
    ring.position.y = 0.51;
    ring.rotation.x = Math.PI / 2;
    group.add(tub, water, ring);
    poolMeshes.push({ group, water, ring, baseColor: p.color });
    rootGroup.add(group);
  });

  const pipeMat = mat(0xb87333, 0.42, 0.75);
  const pipePoints = [
    [-3.3, 1.25, 3.15, 3.3, 1.25, 3.15],
    [-3.3, 1.55, 0.9, 3.3, 1.55, 0.9],
    [-3.3, 1.85, -1.65, 3.3, 1.85, -1.65],
    [-3.3, 1.25, 3.15, -3.3, 1.85, -1.65],
    [3.3, 1.25, 3.15, 3.3, 1.85, -1.65]
  ];
  pipePoints.forEach((p) => addPipe(p, pipeMat));

  const valvePositions = [[-3.25, 1.25, 3.15], [3.25, 1.55, 0.9], [-3.25, 1.85, -1.65]];
  valvePositions.forEach((p, i) => {
    const valve = new THREE.Group();
    valve.position.set(...p);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 8, 32), pipeMat);
    wheel.rotation.y = Math.PI / 2;
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), pipeMat);
    const spokeGeo = new THREE.BoxGeometry(0.7, 0.035, 0.035);
    for (let s = 0; s < 4; s++) {
      const spoke = new THREE.Mesh(spokeGeo, pipeMat);
      spoke.rotation.z = (Math.PI / 4) * s;
      valve.add(spoke);
    }
    valve.add(wheel, hub);
    valve.userData.lane = i;
    valveMeshes.push(valve);
    rootGroup.add(valve);
  });

  const chimneyMat = mat(0x4a3b35, 0.75);
  for (let i = 0; i < 3; i++) {
    const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 0.82, 20), chimneyMat);
    ch.position.set(-3 + i * 3, 0.6, -3.45);
    rootGroup.add(ch);
  }

  macaqueMesh = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 20), mat(0xb98a64));
  body.scale.set(1.05, 1.2, 0.9);
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 16), mat(0xff9aa1));
  face.position.set(0, 0.1, 0.23);
  const towel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.09), mat(0x23356d, 0.65));
  towel.position.set(0, 0.28, 0.04);
  macaqueMesh.add(body, face, towel);
  macaqueMesh.position.set(-1.25, 0.8, -2.35);
  rootGroup.add(macaqueMesh);

  for (let i = 0; i < 42; i++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.12 + (i % 5) * 0.025, 12, 8), mat(0xd9f8ff, 0.9, 0, 0.18));
    puff.position.set((Math.random() - 0.5) * 7, 0.6 + Math.random() * 2.7, (Math.random() - 0.5) * 7);
    puff.userData.speed = 0.18 + Math.random() * 0.28;
    steamGroup.add(puff);
  }

  focusLines = [0, 1, 2].map((i) => {
    const line = new THREE.Mesh(new THREE.TorusGeometry(1.34 + i * 0.04, 0.015, 8, 64), mat(0x72f0dc, 0.35, 0, 0.28));
    line.rotation.x = Math.PI / 2;
    line.visible = false;
    rootGroup.add(line);
    return line;
  });
}

function addPipe([x1, y1, z1, x2, y2, z2], material) {
  const start = new THREE.Vector3(x1, y1, z1);
  const end = new THREE.Vector3(x2, y2, z2);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const dir = end.clone().sub(start);
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, dir.length(), 16), material);
  cyl.position.copy(mid);
  cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  rootGroup.add(cyl);
}

function resizeStage() {
  if (!renderer) return;
  const stage = $('stage');
  const w = Math.max(stage.clientWidth, 320);
  const h = Math.max(stage.clientHeight, 260);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function startGame() {
  initAudio();
  if (audio.ctx?.state === 'suspended') audio.ctx.resume().catch(() => {});
  playTone('steam');
  state = defaultState();
  running = true;
  paused = false;
  els.menu.hidden = true;
  els.results.hidden = true;
  els.pauseOverlay.hidden = true;
  els.grand.hidden = true;
  setCommission(0);
  updateHud();
  lastTick = performance.now();
}

function setCommission(index) {
  state.commission = Math.min(index, commissions.length - 1);
  state.commissionElapsed = 0;
  state.comfortTicks = 0;
  state.vents = 0;
  state.spouts = 0;
  state.stirs = 0;
  state.macaques = 0;
  state.poolStable = [0, 0, 0];
  const c = commissions[state.commission];
  els.commissionName.textContent = c.name;
  els.commissionText.textContent = c.text;
  renderGoalTicks();
  updateBands();
}

function renderGoalTicks() {
  const c = commissions[state.commission];
  const goals = goalProgress(c);
  els.goalTicks.innerHTML = goals.map((done) => `<span class="${done ? 'done' : ''}"></span>`).join('');
}
function goalProgress(c) {
  return [
    state.comfortTicks >= c.goals.comfortTicks,
    state.vents >= c.goals.vents,
    state.spouts >= c.goals.spouts,
    state.macaques >= c.goals.macaques,
    state.pressure <= c.pressureLimit && state.mineral >= c.mineralTarget && (!c.goals.focus || state.yuge || state.focusActive > 0 || state.badges.includes('Focused Bath'))
  ];
}
function commissionComplete() {
  const c = commissions[state.commission];
  return goalProgress(c).every(Boolean) || state.score > 4600 + state.commission * 700;
}
function updateBands() {
  const c = commissions[state.commission];
  c.bands.forEach((band, i) => {
    const el = $(`pool${i}Band`);
    if (el) el.textContent = `${band[0]}–${band[1]}°C`;
  });
}

function update(dt) {
  if (!running || paused || state.ended) return;
  dt = Math.min(dt, 0.06);
  state.elapsed += dt;
  state.commissionElapsed += dt;
  const c = commissions[state.commission];
  const focusFactor = state.focusActive > 0 ? 0.42 : 1;
  const draft = state.commission >= 2 ? -0.32 : -0.12;
  const valve = valveStates[state.valveIndex];

  state.temps.forEach((temp, i) => {
    let target = 36.8 + draft;
    if (i === state.activeLane) target = valveTemp[valve];
    if (valve === 'Outlet' && i === state.activeLane) target = 34.5;
    const rate = (i === state.activeLane ? 0.58 : 0.18) * focusFactor;
    state.temps[i] += (target - temp) * rate * dt;
    state.temps[i] += Math.sin(state.elapsed * 0.8 + i) * 0.006;
  });

  const hotness = valve === 'Hot' ? 1.1 : valve === 'Cool' ? 0.36 : valve === 'Outlet' ? -0.6 : 0.14;
  state.pressure += (0.65 + hotness + state.commission * 0.22) * dt * focusFactor;
  state.pressure = clamp(state.pressure, 0, 120);
  if (state.focusActive > 0) state.focusActive -= dt;
  state.focus = clamp(state.focus + countSafePools() * 0.32 * dt, 0, 100);
  state.mineral = clamp(state.mineral - (state.pressure > 75 ? 0.34 : 0.04) * dt, 0, 100);

  const safe = countSafePools();
  if (safe > 0) {
    state.score += Math.round(safe * 2.5 * state.combo * dt * 10);
    state.comfortTicks += safe * dt;
    state.chain += dt;
    state.bestChain = Math.max(state.bestChain, state.chain);
    state.focus = clamp(state.focus + safe * 0.18 * dt, 0, 100);
  } else {
    state.chain = Math.max(0, state.chain - dt * 2);
  }

  const badPools = state.temps.filter((t, i) => !inBand(t, c.bands[i]) && (t > c.bands[i][1] + 3.2 || t < c.bands[i][0] - 4.2)).length;
  if (badPools && Math.floor(state.elapsed * 2) !== Math.floor((state.elapsed - dt) * 2)) {
    state.pressure += badPools * 1.2;
    addWarning(badPools > 1 ? 'Multiple pools outside comfort band — stabilize fast.' : 'Temperature shock risk. Use spout, stir, or valve flow.');
  }
  if (state.pressure >= 100) damage('Pressure overload shook the bathhouse. Vent earlier.');
  if (state.commissionElapsed > c.timeLimit) damage(`${c.name} timer expired. The guests lost patience.`);

  if (commissionComplete()) completeCommission();
}

function countSafePools() {
  const c = commissions[state.commission];
  let safe = 0;
  state.temps.forEach((t, i) => {
    if (inBand(t, c.bands[i])) {
      safe += 1;
      state.poolStable[i] += 1 / 60;
      if (state.poolStable[i] > 4.5 && state.macaques < c.goals.macaques) {
        state.macaques += 1;
        state.score += Math.round(240 * state.combo);
        state.combo = clamp(state.combo + 0.15, 1, 5);
        addWarning(`${['Cedar', 'Moonstone', 'Macaque'][i]} guest comfort bubble satisfied.`);
        playTone('macaque');
      }
    } else {
      state.poolStable[i] = Math.max(0, state.poolStable[i] - 0.03);
    }
  });
  return safe;
}
function inBand(t, band) { return t >= band[0] && t <= band[1]; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function damage(message) {
  state.hearts -= 1;
  state.shocks += 1;
  state.pressure = Math.max(45, state.pressure - 42);
  state.combo = 1;
  state.chain = 0;
  addWarning(message);
  playTone('warn');
  if (state.hearts <= 0) endRun(false, 'Comfort hearts depleted');
  else {
    const c = commissions[state.commission];
    state.commissionElapsed = Math.min(state.commissionElapsed, c.timeLimit - 8);
  }
}

function completeCommission() {
  const c = commissions[state.commission];
  state.score += Math.round((840 + state.commission * 220) * state.combo);
  if (state.pressure < c.pressureLimit && state.hearts < 3) state.hearts += 1;
  if (state.pressure < 45) addBadge('Quiet Vent Master');
  if (state.mineral >= c.mineralTarget) addBadge('Mineral Glow Keeper');
  playTone('grand');
  if (state.commission < commissions.length - 1) {
    addWarning(`${c.name} complete. Lantern seal lit — next bath opens.`);
    state.pressure = Math.max(12, state.pressure * 0.42);
    setCommission(state.commission + 1);
  } else if (!state.yuge) {
    state.yuge = true;
    state.score += 2200;
    addBadge('Onsen Grand Yuge');
    els.grand.hidden = false;
    setTimeout(() => { els.grand.hidden = true; }, 4200);
    addWarning('Onsen Grand Yuge achieved. Endless bathhouse commissions continue.');
    saveBest();
    setCommission(2);
    commissions[2].goals.comfortTicks += 8;
  } else {
    addWarning('Endless commission complete. The dawn guests request another round.');
    state.pressure = Math.max(18, state.pressure * 0.5);
    commissions[2].goals.comfortTicks += 5;
    commissions[2].pressureLimit = Math.max(48, commissions[2].pressureLimit - 2);
    setCommission(2);
  }
}

function addBadge(name) {
  if (!state.badges.includes(name)) state.badges.push(name);
}
function addWarning(message) {
  state.warnings.unshift(message);
  state.warnings = state.warnings.slice(0, 4);
  els.helper.textContent = message;
}

function changeLane(delta) {
  state.activeLane = (state.activeLane + delta + 3) % 3;
  addWarning(`${lanes[state.activeLane]} lane selected. Rotate the valve to route steam.`);
  playTone('tap');
}
function changeValve(delta) {
  state.valveIndex = (state.valveIndex + delta + valveStates.length) % valveStates.length;
  const valve = valveStates[state.valveIndex];
  const bonus = valve === 'Hot' || valve === 'Cool' ? 135 : 40;
  state.score += Math.round(bonus * state.combo);
  state.focus = clamp(state.focus + 5, 0, 100);
  state.combo = clamp(state.combo + 0.08, 1, 5);
  addWarning(`${valve} flow routed to ${lanes[state.activeLane]} lane.`);
  playTone(valve === 'Hot' ? 'steam' : 'valve');
}
function vent() {
  const c = commissions[state.commission];
  const perfect = state.pressure >= c.pressureLimit - 12 && state.pressure <= 94;
  state.vents += 1;
  state.pressure = clamp(state.pressure - (perfect ? 38 : 24), 0, 120);
  state.mineral = clamp(state.mineral - (perfect ? 1 : 6), 0, 100);
  state.temps[state.activeLane] -= perfect ? 0.4 : 1.2;
  if (perfect) {
    state.score += Math.round(170 * state.combo);
    state.combo = clamp(state.combo + 0.18, 1, 5);
    addWarning('Perfect vent window. Pressure released without chilling the bath.');
  } else {
    state.combo = Math.max(1, state.combo - 0.2);
    addWarning('Vent opened. Pressure falls, but over-venting cools nearby pools.');
  }
  playTone('steam');
}
function spout() {
  state.spouts += 1;
  const i = hottestPool();
  state.temps[i] -= 2.6;
  state.pressure = clamp(state.pressure - 3, 0, 120);
  state.score += Math.round(160 * state.combo);
  state.focus = clamp(state.focus + 8, 0, 100);
  addWarning(`Bamboo Spout cools ${['Cedar', 'Moonstone', 'Macaque'][i]} Pool.`);
  playTone('splash');
}
function stir() {
  state.stirs += 1;
  const i = state.activeLane;
  const c = commissions[state.commission];
  const mid = (c.bands[i][0] + c.bands[i][1]) / 2;
  const before = Math.abs(state.temps[i] - mid);
  state.temps[i] += (mid - state.temps[i]) * 0.38;
  const after = Math.abs(state.temps[i] - mid);
  if (after < before) {
    state.score += Math.round(145 * state.combo);
    state.combo = clamp(state.combo + 0.12, 1, 5);
    addWarning(`Stir Pool stabilizes ${lanes[i]} lane near target.`);
  } else addWarning('The pool swirls, but it was not near a useful target.');
  playTone('stir');
}
function focus() {
  const fullFocus = state.focus >= 100 || state.yuge;
  if (fullFocus) {
    state.focus = state.yuge ? Math.max(0, state.focus - 50) : 0;
    state.focusActive = 7.2;
    addBadge('Focused Bath');
    state.score += Math.round(120 * state.combo);
    addWarning('Yuge Focus previews safe temperatures and slows the steam drift.');
  } else {
    state.focusActive = Math.max(state.focusActive, 2.4);
    addWarning('Yuge Focus practice preview: hold comfort bands to charge the full slow-time bath map.');
  }
  els.focusOverlay.hidden = false;
  playTone('focus');
}
function hottestPool() {
  let idx = 0;
  state.temps.forEach((t, i) => { if (t > state.temps[idx]) idx = i; });
  return idx;
}

function endRun(won, reason = '') {
  state.ended = true;
  running = false;
  saveBest(true);
  els.resultsTitle.textContent = won ? 'Grand Yuge complete' : 'Bathhouse closed';
  els.resultsStats.innerHTML = [
    ['Score', state.score], ['Best chain', `${Math.round(state.bestChain)}s`], ['Commission', commissions[state.commission].name],
    ['Pressure', `${Math.round(state.pressure)}%`], ['Mineral glow', `${Math.round(state.mineral)}%`], ['Guest shocks', state.shocks], ['Reason', reason || 'Run complete']
  ].map(([k, v]) => `<span><strong>${v}</strong>${k}</span>`).join('');
  els.badgeList.innerHTML = (state.badges.length ? state.badges : ['Steam Apprentice']).map((b) => `<span>${b}</span>`).join('');
  els.results.hidden = false;
}

function updateHud() {
  els.score.textContent = String(Math.floor(state.score));
  els.hearts.textContent = '♥'.repeat(Math.max(0, state.hearts)) + '♡'.repeat(Math.max(0, 3 - state.hearts));
  els.pressure.textContent = `${Math.round(state.pressure)}%`;
  els.combo.textContent = `x${state.combo.toFixed(1)}`;
  els.lane.textContent = lanes[state.activeLane];
  els.valve.textContent = valveStates[state.valveIndex];
  els.focus.textContent = `${Math.round(state.focus)}%`;
  els.mineral.textContent = `${Math.round(state.mineral)}%`;
  els.time.textContent = formatTime(state.elapsed);
  state.temps.forEach((t, i) => {
    const card = document.querySelector(`.pool-card[data-pool="${i}"]`);
    const temp = $(`pool${i}Temp`);
    if (temp) temp.textContent = `${t.toFixed(1)}°C`;
    if (card) {
      const c = commissions[state.commission];
      card.classList.toggle('active', i === state.activeLane);
      card.classList.toggle('safe', inBand(t, c.bands[i]));
      card.classList.toggle('hot', t > c.bands[i][1]);
      card.classList.toggle('cold', t < c.bands[i][0]);
    }
  });
  $('focusBtn').classList.toggle('ready', state.focus >= 100 || state.yuge);
  if (state.focusActive <= 0) els.focusOverlay.hidden = true;
  else {
    const c = commissions[state.commission];
    const preds = state.temps.map((t, i) => `${['Cedar','Moonstone','Macaque'][i]} ${t.toFixed(1)}°/${c.bands[i][0]}-${c.bands[i][1]}`).join(' · ');
    els.prediction.textContent = preds;
  }
  renderGoalTicks();
}
function formatTime(total) {
  const t = Math.max(0, Math.floor(total));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

function renderThree(dt) {
  if (!renderer) return;
  const t = state?.elapsed || performance.now() / 1000;
  rootGroup.rotation.y = Math.sin(t * 0.18) * 0.05;
  const c = state ? commissions[state.commission] : commissions[0];
  poolMeshes.forEach((p, i) => {
    const temp = state?.temps[i] ?? 38;
    const band = c.bands[i];
    const waterMat = p.water.material;
    const color = temp > band[1] ? 0xff7656 : temp < band[0] ? 0x72cfff : 0x69f0d6;
    waterMat.color.setHex(color);
    waterMat.emissive = new THREE.Color(color).multiplyScalar(state && inBand(temp, band) ? 0.22 : 0.1);
    p.water.position.y = 0.47 + Math.sin(t * 2 + i) * 0.018;
    p.ring.scale.setScalar((i === state?.activeLane ? 1.08 : 1) + Math.sin(t * 3 + i) * 0.015);
  });
  valveMeshes.forEach((v, i) => {
    v.rotation.z = (state?.valveIndex || 0) * 0.55 + t * (i === state?.activeLane ? 0.8 : 0.18);
    v.scale.setScalar(i === state?.activeLane ? 1.16 : 1);
  });
  steamGroup.children.forEach((p, i) => {
    p.position.y += (p.userData.speed || 0.2) * dt * (state?.focusActive > 0 ? 0.45 : 1);
    p.position.x += Math.sin(t + i) * 0.002;
    if (p.position.y > 3.8) p.position.y = 0.55;
    p.material.opacity = 0.12 + 0.11 * Math.sin(t * 1.6 + i);
    const lane = state?.activeLane ?? 0;
    if (i % 3 === lane) {
      const valve = valveStates[state?.valveIndex ?? 1];
      p.material.color.setHex(valve === 'Hot' ? 0xffb27a : valve === 'Cool' ? 0xaee8ff : 0xd9f8ff);
    }
  });
  if (macaqueMesh) {
    macaqueMesh.position.y = 0.8 + Math.sin(t * 3) * 0.04;
    macaqueMesh.rotation.y = Math.sin(t * 1.7) * 0.2;
  }
  focusLines.forEach((line, i) => {
    line.visible = !!state && state.focusActive > 0;
    line.position.copy(poolMeshes[i].group.position);
    line.position.y = 0.62;
    line.scale.setScalar(1 + Math.sin(t * 4 + i) * 0.06);
  });
  renderer.render(scene, camera);
}

function loop(now) {
  const dt = ((now || performance.now()) - lastTick) / 1000 || clock?.getDelta() || 0.016;
  lastTick = now || performance.now();
  update(dt);
  updateHud();
  renderThree(dt);
  rafId = requestAnimationFrame(loop);
}

function bind() {
  els.start.addEventListener('click', startGame);
  $('lanePrev').addEventListener('click', () => changeLane(-1));
  $('laneNext').addEventListener('click', () => changeLane(1));
  $('valvePrev').addEventListener('click', () => changeValve(-1));
  $('valveNext').addEventListener('click', () => changeValve(1));
  $('ventBtn').addEventListener('click', vent);
  $('spoutBtn').addEventListener('click', spout);
  $('stirBtn').addEventListener('click', stir);
  $('focusBtn').addEventListener('click', focus);
  $('pauseBtn').addEventListener('click', togglePause);
  $('restartBtn').addEventListener('click', startGame);
  $('resumeBtn').addEventListener('click', togglePause);
  $('pauseRestartBtn').addEventListener('click', startGame);
  $('resultsRestartBtn').addEventListener('click', startGame);
  els.mute.addEventListener('click', () => {
    audio.muted = !audio.muted;
    els.mute.textContent = audio.muted ? 'Unmute audio' : 'Mute audio';
  });
  document.querySelectorAll('.pool-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeLane = Number(btn.dataset.pool || 0);
      addWarning(`${lanes[state.activeLane]} pool selected for valve flow.`);
      playTone('tap');
    });
  });
  window.addEventListener('keydown', (event) => {
    if (!running && event.key !== 'Enter') return;
    const key = event.key.toLowerCase();
    if (key === 'p') togglePause();
    else if (key === 'r') startGame();
    else if (paused) return;
    else if (key === 'arrowleft' || key === 'a') changeLane(-1);
    else if (key === 'arrowright' || key === 'd') changeLane(1);
    else if (key === 'arrowup' || key === 'w') changeLane(1);
    else if (key === 'arrowdown' || key === 's') changeLane(-1);
    else if (key === 'q') changeValve(-1);
    else if (key === 'e') changeValve(1);
    else if (key === 'v') vent();
    else if (key === 'b') spout();
    else if (key === 't' || key === ' ') stir();
    else if (key === 'f' || key === 'shift') focus();
    else if (!running && key === 'enter') startGame();
  });
}

function togglePause() {
  if (!running || state.ended) return;
  paused = !paused;
  els.pauseOverlay.hidden = !paused;
  playTone('tap');
}

function boot() {
  renderBest();
  state = defaultState();
  initThree();
  bind();
  updateBands();
  updateHud();
  lastTick = performance.now();
  loop(lastTick);
}

boot();
