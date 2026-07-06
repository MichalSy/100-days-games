import * as THREE from './assets/three.module.min.js';

const $ = (sel) => document.querySelector(sel);
const stage = $('#stage');
const canvas = $('#gameCanvas');
const menu = $('#menu');
const pauseOverlay = $('#pauseOverlay');
const resultOverlay = $('#resultOverlay');
const helper = $('#helper');
const readyBadge = $('#readyBadge');

const ui = {
  score: $('#score'), bestScore: $('#bestScore'), hearts: $('#hearts'), stability: $('#stability'), combo: $('#combo'), hopMode: $('#hopMode'), time: $('#time'),
  chapterName: $('#chapterName'), objectiveText: $('#objectiveText'), sparkOrder: $('#sparkOrder'), deliveryProgress: $('#deliveryProgress'), trayStatus: $('#trayStatus'), focusCharge: $('#focusCharge'),
  resultKicker: $('#resultKicker'), resultTitle: $('#resultTitle'), resultText: $('#resultText'), badges: $('#badges')
};

const assetUrl = (name) => new URL(`./assets/${name}`, import.meta.url).href;
const bestKey = 'day024-usagi-best-score';
const bestTimeKey = 'day024-usagi-best-feast-time';

const chapters = [
  { name: 'First Mooncake Hop', sparks: ['Gold', 'Gold', 'Gold'], objective: 'Collect 3 gold rice sparks, land on 3 mochi pads, and deliver to Moon Tray A.', minLandings: 3, stability: 60, time: 115, pads: 7 },
  { name: 'Lantern Tray Crossing', sparks: ['Gold', 'White', 'Gold', 'White'], objective: 'Collect 4 rice sparks, pass Tray Gate A, and deliver with stability above 55%.', minLandings: 5, stability: 55, time: 105, pads: 8 },
  { name: 'Jade Rabbit Offering', sparks: ['White', 'Gold', 'Jade', 'Gold', 'White'], objective: 'Thread two tray gates, keep the pads stable, and finish the Jade Rabbit Offering.', minLandings: 7, stability: 50, time: 95, pads: 9 }
];

const state = {
  running: false,
  paused: false,
  startedAt: 0,
  elapsed: 0,
  score: 0,
  best: Number(localStorage.getItem(bestKey) || 0),
  hearts: 3,
  stability: 100,
  combo: 1,
  chapter: 0,
  collected: 0,
  landings: 0,
  cleanChain: 0,
  bestChain: 0,
  cracks: 0,
  falls: 0,
  markers: 2,
  dash: 0,
  focus: 0,
  muted: false,
  aiming: new THREE.Vector3(0, 0, -1),
  currentPad: 0,
  targetPad: 1,
  jumping: false,
  jumpT: 0,
  jumpDuration: 0.88,
  jumpStart: new THREE.Vector3(),
  jumpEnd: new THREE.Vector3(),
  message: 'Aim at the next mochi pad. Charge Hop shows the landing circle.'
};

let renderer, scene, camera, clock, player, playerGlow, landingRing, trayGate, moonTray, mascotSprite;
let pads = [], sparks = [], shadows = [], markers = [], particles = [];
let audioCtx = null;

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x2b1954, 10, 34);
  camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
  camera.position.set(0, 7.5, 10.5);
  camera.lookAt(0, 0, -7);
  clock = new THREE.Clock();

  scene.add(new THREE.AmbientLight(0xd8c6ff, 1.35));
  const moon = new THREE.DirectionalLight(0xfff1c8, 2.4);
  moon.position.set(-3, 9, 4);
  scene.add(moon);
  const rim = new THREE.PointLight(0xbca1ff, 2, 28);
  rim.position.set(5, 6, -8);
  scene.add(rim);

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 28, 18),
    new THREE.MeshStandardMaterial({ color: 0xfff5ef, roughness: 0.45, metalness: 0.03, emissive: 0x442255, emissiveIntensity: 0.08 })
  );
  const earMat = new THREE.MeshStandardMaterial({ color: 0xfff3f7, roughness: 0.5, emissive: 0x342244, emissiveIntensity: 0.08 });
  const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xff9fba, roughness: 0.6 });
  const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 12), earMat);
  leftEar.scale.set(0.58, 2.25, 0.42);
  leftEar.position.set(-0.18, 0.56, -0.03);
  leftEar.rotation.z = -0.2;
  const rightEar = leftEar.clone();
  rightEar.position.x = 0.18;
  rightEar.rotation.z = 0.2;
  const innerLeft = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), innerEarMat);
  innerLeft.scale.set(0.45, 1.75, 0.2);
  innerLeft.position.set(-0.18, 0.58, 0.04);
  innerLeft.rotation.z = -0.2;
  const innerRight = innerLeft.clone();
  innerRight.position.x = 0.18;
  innerRight.rotation.z = 0.2;
  const vest = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.035, 8, 24), new THREE.MeshStandardMaterial({ color: 0x253a7c, roughness: 0.45 }));
  vest.rotation.x = Math.PI / 2;
  vest.position.y = -0.02;
  playerGlow = new THREE.PointLight(0xffe19a, 1.7, 5);
  player = new THREE.Group();
  player.add(body, leftEar, rightEar, innerLeft, innerRight, vest, playerGlow);
  scene.add(player);

  landingRing = new THREE.Mesh(
    new THREE.RingGeometry(0.56, 0.69, 48),
    new THREE.MeshBasicMaterial({ color: 0xffdc72, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
  );
  landingRing.rotation.x = -Math.PI / 2;
  scene.add(landingRing);

  trayGate = makeGate();
  scene.add(trayGate);
  moonTray = makeTray();
  scene.add(moonTray);

  buildCourse(0);
  resize();
  renderer.setAnimationLoop(tick);
}

function makePad(i, x, z, y, type = 'cream') {
  const color = type === 'jade' ? 0xa7dc85 : 0xffe8b0;
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.04, emissive: type === 'jade' ? 0x102f18 : 0x3b2406, emissiveIntensity: 0.06 });
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.22, 0.28, 48), mat);
  mesh.position.set(x, y, z);
  mesh.userData = { i, stable: 1, type, marked: false };
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.13, 0.035, 8, 48), new THREE.MeshBasicMaterial({ color: type === 'jade' ? 0xd4ffae : 0xfff5ce, transparent: true, opacity: 0.55 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.16;
  mesh.add(rim);
  return mesh;
}

function makeSpark(kind, pos, order) {
  const color = kind === 'White' ? 0xf7fbff : kind === 'Jade' ? 0xc6ff9c : 0xffd85f;
  const group = new THREE.Group();
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 12), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.65, roughness: 0.28 }));
  const halo = new THREE.Mesh(new THREE.RingGeometry(0.23, 0.27, 24), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  halo.rotation.x = Math.PI / 2;
  group.add(orb, halo);
  group.position.copy(pos);
  group.userData = { kind, order, collected: false };
  scene.add(group);
  return group;
}

function makeGate() {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xdb334f, roughness: 0.38, metalness: 0.15, emissive: 0x3c0610, emissiveIntensity: 0.18 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.16, 0.16), mat);
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.4, 0.16), mat);
  const right = left.clone();
  top.position.y = 1.05;
  left.position.set(-1, 0.35, 0);
  right.position.set(1, 0.35, 0);
  group.add(top, left, right);
  return group;
}

function makeTray() {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 1.0, 0.18, 48), new THREE.MeshStandardMaterial({ color: 0x992b24, roughness: 0.28, metalness: 0.2, emissive: 0x280505, emissiveIntensity: 0.12 }));
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 16), new THREE.MeshStandardMaterial({ color: 0xffefaf, emissive: 0xffd36e, emissiveIntensity: 0.38 }));
  moon.position.y = 0.38;
  group.add(base, moon);
  return group;
}

function buildCourse(chapterIndex) {
  for (const item of [...pads, ...sparks, ...shadows, ...markers, ...particles]) scene.remove(item);
  pads = []; sparks = []; shadows = []; markers = []; particles = [];
  const chapter = chapters[chapterIndex];
  for (let i = 0; i < chapter.pads; i++) {
    const z = -i * 2.35;
    const x = Math.sin(i * 1.34 + chapterIndex * 0.7) * (i < 2 ? 0.55 : 1.85);
    const y = Math.max(0, Math.sin(i * 0.9 + chapterIndex) * 0.45 + (i > 4 ? 0.35 : 0));
    const pad = makePad(i, x, z, y, i % 3 === 1 ? 'jade' : 'cream');
    pads.push(pad);
    scene.add(pad);
  }
  const order = chapter.sparks;
  order.forEach((kind, i) => {
    const a = pads[Math.min(i + 1, pads.length - 1)].position;
    const b = pads[Math.min(i + 2, pads.length - 1)].position;
    const pos = new THREE.Vector3().lerpVectors(a, b, 0.45 + (i % 2) * 0.16);
    pos.y += 1.15 + i * 0.05;
    sparks.push(makeSpark(kind, pos, i));
  });
  for (let i = 0; i < 3 + chapterIndex; i++) {
    const shadow = new THREE.Mesh(new THREE.SphereGeometry(0.34 + i * 0.02, 18, 10), new THREE.MeshBasicMaterial({ color: 0x170b25, transparent: true, opacity: 0.58 }));
    shadow.scale.set(1.45, 0.24, 0.62);
    shadow.position.set((i % 2 ? -2.25 : 2.25), 0.82, -3.2 - i * 3.0);
    shadow.userData = { speed: 0.62 + i * 0.12, phase: i * 1.7 };
    shadows.push(shadow);
    scene.add(shadow);
  }
  trayGate.position.copy(pads[Math.min(3 + chapterIndex, pads.length - 2)].position).add(new THREE.Vector3(0, 0.35, -0.75));
  moonTray.position.copy(pads[pads.length - 1].position).add(new THREE.Vector3(0, 0.32, -0.6));
  state.currentPad = 0;
  state.targetPad = 1;
  player.position.copy(pads[0].position).add(new THREE.Vector3(0, 0.7, 0));
  updateLandingRing();
}

function resetRun() {
  state.running = true; state.paused = false; state.startedAt = performance.now(); state.elapsed = 0; state.score = 0; state.hearts = 3; state.stability = 100; state.combo = 1; state.chapter = 0; state.collected = 0; state.landings = 0; state.cleanChain = 0; state.bestChain = 0; state.cracks = 0; state.falls = 0; state.markers = 2; state.dash = 0; state.focus = 0; state.jumping = false; state.aiming.set(0,0,-1); state.targetPad = 1; state.message = 'Aim at the next mochi pad. Charge Hop shows the landing circle.';
  menu.classList.remove('visible'); pauseOverlay.classList.remove('visible'); resultOverlay.classList.remove('visible');
  resumeAudio();
  buildCourse(0);
  updateUI();
}

function updateLandingRing() {
  const target = pads[state.targetPad] || pads[state.currentPad];
  if (!target) return;
  landingRing.position.copy(target.position).add(new THREE.Vector3(0, 0.18, 0));
  landingRing.material.color.setHex(state.focus > 70 ? 0xeec5ff : 0xffdc72);
}

function aim(delta) {
  if (!state.running || state.paused || state.jumping) return;
  const next = Math.max(state.currentPad + 1, Math.min(pads.length - 1, state.targetPad + delta));
  state.targetPad = next;
  state.message = `Landing preview set to mochi pad ${next + 1}. Charge Hop when ready.`;
  updateLandingRing(); updateUI(); playTone(460, 0.05, 'sine', 0.03);
}

function hop(kind = 'charge') {
  if (!state.running || state.paused || state.jumping) return;
  resumeAudio();
  let targetIndex = state.targetPad;
  if (kind === 'short') targetIndex = Math.min(pads.length - 1, state.currentPad + 1);
  if (kind === 'dash' && state.dash < 45) { state.message = 'Moon Dash needs more charge. Land cleanly first.'; updateUI(); return; }
  if (kind === 'dash') { targetIndex = Math.min(pads.length - 1, state.currentPad + 2); state.dash = Math.max(0, state.dash - 45); }
  const target = pads[targetIndex];
  if (!target) return;
  state.jumping = true;
  state.jumpT = 0;
  state.jumpDuration = kind === 'short' ? 0.55 : kind === 'dash' ? 0.5 : 0.82;
  state.jumpStart.copy(player.position);
  state.jumpEnd.copy(target.position).add(new THREE.Vector3(0, 0.7, 0));
  state.hopMode = kind;
  state.message = kind === 'dash' ? 'Moon Dash! Thread the red tray gate.' : kind === 'short' ? 'Short hop: safe, tidy, low crack risk.' : 'Charge Hop: follow the golden landing arc.';
  playTone(kind === 'dash' ? 720 : 520, 0.12, 'triangle', 0.05);
  updateUI();
}

function land() {
  const pad = pads[state.targetPad] || pads[state.currentPad];
  const distPenalty = state.hopMode === 'dash' ? 0.07 : Math.random() * 0.16;
  const centerQuality = Math.max(0.55, 1 - distPenalty - (pad.userData.stable < 0.55 ? 0.12 : 0));
  const clean = centerQuality > 0.82;
  state.currentPad = pad.userData.i;
  state.targetPad = Math.min(pads.length - 1, state.currentPad + 1);
  state.landings += 1;
  state.combo = clean ? Math.min(4, state.combo + 0.25) : Math.max(1, state.combo - 0.35);
  state.cleanChain = clean ? state.cleanChain + 1 : 0;
  state.bestChain = Math.max(state.bestChain, state.cleanChain);
  state.score += Math.round((clean ? 120 : 70) * state.combo);
  state.focus = Math.min(100, state.focus + (clean ? 18 : 8));
  state.dash = Math.min(100, state.dash + (clean ? 20 : 12));
  pad.userData.stable = Math.max(0.25, pad.userData.stable - (clean ? 0.04 : 0.18));
  state.stability = Math.max(0, Math.round(state.stability - (clean ? 1 : 8)));
  if (!clean) {
    state.cracks += 1;
    playTone(170, 0.16, 'sawtooth', 0.04);
    state.message = 'Edge landing cracked the mochi. Knead/Brace before the next big hop.';
  } else {
    playTone(620 + state.combo * 70, 0.13, 'sine', 0.05);
    state.message = 'Clean center landing! Combo and Moon Whisker charge increased.';
  }
  collectNearbySparks();
  checkDelivery();
  updateLandingRing(); updateUI();
}

function collectNearbySparks() {
  for (const spark of sparks) {
    if (spark.userData.collected) continue;
    const d = spark.position.distanceTo(player.position);
    if (d < 1.45 || spark.userData.order === state.collected) {
      const expected = chapters[state.chapter].sparks[state.collected];
      spark.userData.collected = true;
      spark.visible = false;
      if (spark.userData.kind === expected) {
        state.collected += 1;
        state.score += Math.round(105 * state.combo);
        state.focus = Math.min(100, state.focus + 10);
        state.message = `${expected} rice spark collected in order. ${state.collected}/${chapters[state.chapter].sparks.length}.`;
        playTone(760 + state.collected * 60, 0.09, 'triangle', 0.045);
      } else {
        state.score += 35;
        state.combo = 1;
        state.stability = Math.max(0, state.stability - 4);
        state.message = 'Wrong-order spark collected: tiny points, but moon drift increased.';
      }
      break;
    }
  }
}

function checkDelivery() {
  const chapter = chapters[state.chapter];
  const atTray = state.currentPad >= pads.length - 2;
  if (state.collected >= chapter.sparks.length && state.landings >= chapter.minLandings && atTray && state.stability >= chapter.stability) {
    state.score += 620 + (state.cracks === 0 ? 780 : 0);
    state.hearts = Math.min(3, state.hearts + 1);
    state.message = `${chapter.name} delivered! Moon tray glows.`;
    playTone(880, 0.18, 'sine', 0.06);
    if (state.chapter >= chapters.length - 1 && state.score >= 3800) {
      finishFeast();
    } else {
      state.chapter = Math.min(chapters.length - 1, state.chapter + 1);
      state.collected = 0; state.landings = 0; state.stability = Math.min(100, state.stability + 12); state.combo = Math.max(1.4, state.combo);
      buildCourse(state.chapter);
    }
  }
}

function brace() {
  if (!state.running || state.paused) return;
  const pad = pads[state.currentPad];
  pad.userData.stable = Math.min(1, pad.userData.stable + 0.25);
  state.stability = Math.min(100, state.stability + 8);
  state.score += 95;
  state.message = 'Knead/Brace firmed the current mochi pad. Safer next landing.';
  playTone(310, 0.12, 'square', 0.035);
  updateUI();
}

function marker() {
  if (!state.running || state.paused || state.markers <= 0) return;
  const pad = pads[state.currentPad];
  const mark = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.35, 5), new THREE.MeshStandardMaterial({ color: 0xffd85f, emissive: 0xffc84f, emissiveIntensity: 0.4 }));
  mark.position.copy(pad.position).add(new THREE.Vector3(0, 0.42, 0));
  scene.add(mark); markers.push(mark);
  state.markers -= 1; state.score += 160; state.stability = Math.min(100, state.stability + 4);
  state.message = 'Rice Marker placed on a safe hub pad. Future route memory improved.';
  playTone(690, 0.08, 'triangle', 0.04); updateUI();
}

function focus() {
  if (!state.running || state.paused) return;
  if (state.focus < 70) { state.message = 'Moon Whisker Focus is not charged yet.'; updateUI(); return; }
  state.focus = 0;
  state.message = 'Moon Whisker Focus: shadows slow and the landing circle glows.';
  for (const s of shadows) s.userData.focusSlow = 2.8;
  playTone(980, 0.22, 'sine', 0.055); updateUI();
}

function finishFeast() {
  state.running = false;
  const bestTime = Number(localStorage.getItem(bestTimeKey) || 999999);
  if (state.elapsed && state.elapsed < bestTime) localStorage.setItem(bestTimeKey, String(Math.round(state.elapsed)));
  state.best = Math.max(state.best, state.score);
  localStorage.setItem(bestKey, String(state.best));
  ui.resultKicker.textContent = 'Usagi Moon Feast unlocked';
  ui.resultTitle.textContent = 'Usagi Moon Feast!';
  ui.resultText.textContent = `Final score ${state.score}. Best chain ${state.bestChain}. The rabbit constellation glows above the trays.`;
  ui.badges.innerHTML = '';
  ['3D spatial route', `${state.bestChain} clean chain`, `${state.cracks} pad cracks`, `${state.falls} falls`].forEach((b) => { const el = document.createElement('span'); el.textContent = b; ui.badges.append(el); });
  resultOverlay.classList.add('visible');
  playTone(1040, 0.18, 'triangle', 0.06); setTimeout(() => playTone(1320, 0.22, 'sine', 0.055), 120);
}

function damage(reason) {
  state.hearts -= 1; state.combo = 1; state.stability = Math.max(0, state.stability - 15); state.message = reason;
  playTone(120, 0.2, 'sawtooth', 0.05);
  if (state.hearts <= 0) gameOver(reason);
}

function gameOver(reason) {
  state.running = false;
  state.best = Math.max(state.best, state.score);
  localStorage.setItem(bestKey, String(state.best));
  ui.resultKicker.textContent = 'Moon route ended';
  ui.resultTitle.textContent = 'Mochi route cracked';
  ui.resultText.textContent = `${reason} Final score ${state.score}. Clean chain ${state.bestChain}.`;
  ui.badges.innerHTML = '';
  ['Restart to improve tray accuracy', `${state.cracks} cracks`, `${state.collected} current sparks`, `${state.landings} landings`].forEach((b) => { const el = document.createElement('span'); el.textContent = b; ui.badges.append(el); });
  resultOverlay.classList.add('visible'); updateUI();
}

function tick() {
  const dt = Math.min(0.04, clock.getDelta());
  if (!renderer) return;
  if (state.running && !state.paused) state.elapsed = (performance.now() - state.startedAt) / 1000;
  animateWorld(dt);
  if (state.running && !state.paused) {
    if (state.jumping) {
      state.jumpT += dt / state.jumpDuration;
      const t = Math.min(1, state.jumpT);
      const arc = Math.sin(t * Math.PI) * (1.2 + Math.min(1.4, state.jumpStart.distanceTo(state.jumpEnd) * 0.16));
      player.position.lerpVectors(state.jumpStart, state.jumpEnd, smooth(t));
      player.position.y += arc;
      if (t >= 1) { state.jumping = false; land(); }
    }
    const chapter = chapters[state.chapter];
    if (state.elapsed > chapter.time + state.chapter * 40) damage('Delivery timer expired under the full moon.');
    for (const shadow of shadows) {
      if (shadow.position.distanceTo(player.position) < 0.75 && !state.jumping) damage('Soot-bat shadow crossed the current mochi pad.');
    }
  }
  updateCamera(dt);
  updateUI(false);
  renderer.render(scene, camera);
}

function animateWorld(dt) {
  const t = performance.now() / 1000;
  pads.forEach((pad, i) => {
    pad.scale.y = 1 + Math.sin(t * 2.4 + i) * 0.035;
    pad.rotation.y += dt * 0.09;
    pad.material.emissiveIntensity = 0.05 + (1 - pad.userData.stable) * 0.18;
  });
  sparks.forEach((spark, i) => { spark.rotation.y += dt * 1.4; spark.position.y += Math.sin(t * 3 + i) * dt * 0.12; });
  shadows.forEach((shadow, i) => {
    const slow = shadow.userData.focusSlow || 1;
    shadow.userData.focusSlow = Math.max(1, slow - dt);
    shadow.position.x = Math.sin(t * shadow.userData.speed / slow + shadow.userData.phase) * 2.4;
    shadow.rotation.y += dt * 0.8;
  });
  landingRing.rotation.z += dt * 1.4;
  player.rotation.z = Math.sin(t * 4) * 0.045;
  trayGate.rotation.y = Math.sin(t * 0.9) * 0.2;
  moonTray.rotation.y += dt * 0.35;
}

function updateCamera(dt) {
  const desired = player.position.clone().add(new THREE.Vector3(0, 6.2, 8.2));
  camera.position.lerp(desired, 1 - Math.pow(0.002, dt));
  const look = player.position.clone().add(new THREE.Vector3(0, 0.25, -3.2));
  camera.lookAt(look);
}

function updateUI(full = true) {
  ui.score.textContent = String(state.score);
  ui.bestScore.textContent = String(Math.max(state.best, state.score));
  ui.hearts.textContent = '◆'.repeat(Math.max(0, state.hearts)) + '◇'.repeat(Math.max(0, 3 - state.hearts));
  ui.stability.textContent = `${Math.round(state.stability)}%`;
  ui.combo.textContent = `×${state.combo.toFixed(1)}`;
  ui.hopMode.textContent = state.hopMode === 'dash' ? 'Dash' : state.hopMode === 'short' ? 'Short' : 'Charge';
  ui.time.textContent = formatTime(state.elapsed);
  const chapter = chapters[state.chapter];
  ui.chapterName.textContent = chapter.name;
  ui.objectiveText.textContent = chapter.objective;
  ui.sparkOrder.textContent = chapter.sparks.map((s, i) => `${i < state.collected ? '✓' : '●'} ${s}`).join(' · ');
  ui.deliveryProgress.textContent = `${state.collected}/${chapter.sparks.length} sparks · ${state.landings}/${chapter.minLandings} lands`;
  ui.trayStatus.textContent = state.collected >= chapter.sparks.length ? 'tray ready' : 'tray waiting';
  ui.focusCharge.textContent = `Moon Whisker ${Math.round(state.focus)}%`;
  helper.textContent = state.message;
  readyBadge.textContent = state.running ? `${chapter.name} · pad ${state.currentPad + 1}` : 'Ready to hop.';
}

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
function smooth(t) { return t * t * (3 - 2 * t); }

function resize() {
  const rect = stage.getBoundingClientRect();
  renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  camera.aspect = rect.width / Math.max(1, rect.height);
  camera.updateProjectionMatrix();
}

function resumeAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
}

function playTone(freq, dur, type = 'sine', gain = 0.04) {
  if (state.muted || !audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g).connect(audioCtx.destination);
  osc.start(now); osc.stop(now + dur + 0.03);
}

function togglePause() {
  if (!state.running) return;
  state.paused = !state.paused;
  pauseOverlay.classList.toggle('visible', state.paused);
  state.message = state.paused ? 'Paused. Resume when ready.' : 'Moon route resumed.';
  updateUI();
}

function handleAction(action) {
  if (action === 'aimForward' || action === 'aimRight') aim(1);
  if (action === 'aimBack' || action === 'aimLeft') aim(-1);
  if (action === 'hop') hop('charge');
  if (action === 'shortHop') hop('short');
  if (action === 'dash') hop('dash');
  if (action === 'brace') brace();
  if (action === 'marker') marker();
  if (action === 'focus') focus();
  if (action === 'pause') togglePause();
  if (action === 'restart') resetRun();
}

document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-action]');
  if (btn) handleAction(btn.dataset.action);
});
$('#startButton').addEventListener('click', resetRun);
$('#muteButton').addEventListener('click', () => { state.muted = !state.muted; $('#muteButton').textContent = state.muted ? 'Unmute audio' : 'Mute audio'; });

stage.addEventListener('pointerdown', (event) => {
  if (!state.running || state.paused || state.jumping) return;
  const rect = stage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const delta = x > 0.62 ? 1 : x < 0.38 ? -1 : 0;
  if (delta) aim(delta); else hop('charge');
});

document.addEventListener('keydown', (event) => {
  if (event.repeat) return;
  const key = event.key.toLowerCase();
  if (['arrowup', 'arrowright', 'w', 'd'].includes(key)) aim(1);
  if (['arrowdown', 'arrowleft', 's', 'a'].includes(key)) aim(-1);
  if (key === ' ' || key === 'enter') { event.preventDefault(); state.running ? hop('charge') : resetRun(); }
  if (key === 'q') hop('short');
  if (key === 'e') hop('dash');
  if (key === 'k' || key === 'c') brace();
  if (key === 'm') marker();
  if (key === 'shift' || key === 'b') focus();
  if (key === 'p') togglePause();
  if (key === 'r') resetRun();
});

window.addEventListener('resize', resize);
initThree();
updateUI();
