import * as THREE from './assets/three.module.min.js';

const $ = (id) => document.getElementById(id);
const ui = {
  score: $('score'), bestScore: $('bestScore'), hearts: $('hearts'), oxygen: $('oxygen'), combo: $('combo'), depth: $('depth'), time: $('time'),
  actEyebrow: $('actEyebrow'), missionTitle: $('missionTitle'), missionText: $('missionText'), missionTags: $('missionTags'), helper: $('helper'),
  titleOverlay: $('titleOverlay'), pauseOverlay: $('pauseOverlay'), resultOverlay: $('resultOverlay'), resultText: $('resultText'), resultStats: $('resultStats'), resultEyebrow: $('resultEyebrow'), resultHeading: $('resultHeading'),
  oxygenNeedle: $('oxygenNeedle'), sonarBtn: $('sonarBtn'), muteBtn: $('muteBtn')
};

const BEST_KEY = 'day020-umi-best-score';
const BEST_TIME_KEY = 'day020-umi-best-atlas-time';
const BADGES_KEY = 'day020-umi-badges';
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const lerp = (a, b, t) => a + (b - a) * t;
const dist = (a, b) => a.position.distanceTo(b.position);

const maps = [
  {
    name: 'Shallow Shell Path',
    text: 'Collect 3 moon pearls, place 2 guide shells in calm eddies, refill at Air Bell A, finish oxygen above 45%.',
    tags: ['3 moon pearls', '2 guide shells', 'Bell A', 'oxygen 45%+'],
    pearls: ['moon', 'moon', 'moon'], requiredShells: 2, requiredBell: 1, oxygenTarget: 45, duration: 88,
    fog: 0.012, current: 0.22, jellyfish: 0
  },
  {
    name: 'Kelp Torii Channel',
    text: 'Change depth through coral torii, collect moon then tide pearls, drop 3 guide shells, dodge the first moon jellyfish.',
    tags: ['moon→tide', '3 shells', 'torii gate', '1 jellyfish'],
    pearls: ['moon', 'tide', 'moon', 'tide'], requiredShells: 3, requiredBell: 1, oxygenTarget: 38, duration: 112,
    fog: 0.019, current: 0.38, jellyfish: 2
  },
  {
    name: 'Moon-Jelly Trench',
    text: 'Use Sonar Bloom to reveal hidden pearls, cross current ribbons, refill twice, and chart the Pearl Atlas route.',
    tags: ['hidden pearls', '2 air bells', 'Sonar Bloom', 'atlas route'],
    pearls: ['gold', 'moon', 'tide', 'gold', 'moon'], requiredShells: 4, requiredBell: 2, oxygenTarget: 28, duration: 135,
    fog: 0.027, current: 0.52, jellyfish: 4
  }
];

const pearlColors = {
  moon: 0xeefcff,
  tide: 0x52d8ff,
  gold: 0xffd66f
};

const state = {
  running: false,
  paused: false,
  ended: false,
  startedAt: 0,
  elapsed: 0,
  score: 0,
  combo: 1,
  best: Number(localStorage.getItem(BEST_KEY) || 0),
  hearts: 3,
  oxygen: 100,
  oxygenCooldown: 0,
  act: 0,
  collectedOrder: [],
  shells: 0,
  bells: 0,
  sonar: 0,
  sonarActive: 0,
  atlasTriggered: false,
  cleanChain: 0,
  bestCleanChain: 0,
  jellyHits: 0,
  correctShells: 0,
  muted: false,
  guideCooldown: 0,
  pulseCooldown: 0,
  messageTimer: 0,
  input: { up: false, down: false, left: false, right: false, brake: false }
};

let scene, camera, renderer, clock, player, playerLight, textureLoader, diverTexture;
let pearls = [], bells = [], jellies = [], currents = [], gates = [], shells = [], bubbles = [];
let audio = { ctx: null, enabled: false };
window.__day020Audio = audio;

function initThree() {
  const mount = $('gameMount');
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x063348, maps[0].fog);
  camera = new THREE.PerspectiveCamera(50, mount.clientWidth / Math.max(1, mount.clientHeight), 0.1, 100);
  camera.position.set(0, 2.4, 8);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(renderer.domElement);
  clock = new THREE.Clock();
  textureLoader = new THREE.TextureLoader();
  diverTexture = textureLoader.load('./assets/umi-diver.png');

  scene.add(new THREE.HemisphereLight(0xbefcff, 0x04212f, 2.1));
  const sun = new THREE.DirectionalLight(0xffffff, 2.8);
  sun.position.set(-3, 7, 5);
  scene.add(sun);
  const glow = new THREE.PointLight(0x77f7ff, 1.6, 12);
  glow.position.set(0, 2, 2);
  scene.add(glow);

  makeEnvironment();
  makePlayer();
  resetAct(0);

  const resize = () => {
    const width = mount.clientWidth || 640;
    const height = mount.clientHeight || 420;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  new ResizeObserver(resize).observe(mount);
  resize();
  renderer.setAnimationLoop(loop);
}

function makeEnvironment() {
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a6a7a, roughness: 0.85, metalness: 0.02, transparent: true, opacity: 0.42 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(28, 72, 16, 28), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -2.4, -18);
  scene.add(floor);

  const kelpMat = new THREE.MeshStandardMaterial({ color: 0x1fa46c, roughness: 0.7, transparent: true, opacity: 0.72 });
  for (let i = 0; i < 34; i++) {
    const side = i % 2 ? -1 : 1;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 3 + (i % 5) * 0.7, 8), kelpMat);
    stem.position.set(side * (4.2 + (i % 4) * 0.55), -0.8 + (i % 3) * 0.2, -2 - i * 1.1);
    stem.rotation.z = side * (0.1 + (i % 5) * 0.035);
    stem.userData.phase = i * 0.47;
    scene.add(stem);
    gates.push(stem);
  }

  const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xb8fbff, transparent: true, opacity: 0.58 });
  for (let i = 0; i < 46; i++) {
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.04 + (i % 4) * 0.018, 12, 8), bubbleMat.clone());
    bubble.position.set((Math.random() - 0.5) * 8, -2 + Math.random() * 5, -Math.random() * 44);
    bubble.userData.speed = 0.25 + Math.random() * 0.75;
    scene.add(bubble);
    bubbles.push(bubble);
  }
}

function makePlayer() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 24, 16),
    new THREE.MeshStandardMaterial({ color: 0xf7fdff, roughness: 0.36, emissive: 0x0b8192, emissiveIntensity: 0.15 })
  );
  body.scale.set(0.92, 1.05, 0.7);
  group.add(body);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: diverTexture, transparent: true }));
  sprite.scale.set(1.15, 1.15, 1);
  sprite.position.set(0, 0.25, 0.08);
  group.add(sprite);
  const trail = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.025, 8, 32), new THREE.MeshBasicMaterial({ color: 0x88f6ff, transparent: true, opacity: 0.55 }));
  trail.rotation.x = Math.PI / 2;
  group.add(trail);
  group.position.set(0, -0.1, 0);
  scene.add(group);
  player = group;
  player.userData.velocity = new THREE.Vector3();
  playerLight = new THREE.PointLight(0x92faff, 1.4, 4);
  group.add(playerLight);
}

function makePearl(type, x, y, z, hidden = false) {
  const pearl = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 24, 16),
    new THREE.MeshStandardMaterial({ color: pearlColors[type], roughness: 0.16, metalness: 0.08, emissive: pearlColors[type], emissiveIntensity: hidden ? 0.08 : 0.35 })
  );
  pearl.position.set(x, y, z);
  pearl.userData = { type, hidden, collected: false, baseY: y };
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.018, 8, 32), new THREE.MeshBasicMaterial({ color: pearlColors[type], transparent: true, opacity: hidden ? 0.1 : 0.7 }));
  ring.rotation.x = Math.PI / 2;
  pearl.add(ring);
  scene.add(pearl);
  pearls.push(pearl);
}

function makeAirBell(x, y, z, label) {
  const group = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 16), new THREE.MeshStandardMaterial({ color: 0x92f9ff, transparent: true, opacity: 0.62, emissive: 0x42dce8, emissiveIntensity: 0.4 }));
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 8, 42), new THREE.MeshBasicMaterial({ color: 0xdffcff, transparent: true, opacity: 0.72 }));
  halo.rotation.x = Math.PI / 2;
  group.add(shell, halo);
  group.position.set(x, y, z);
  group.userData = { label, used: false, baseY: y };
  scene.add(group);
  bells.push(group);
}

function makeJelly(x, y, z, phase) {
  const group = new THREE.Group();
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.7), new THREE.MeshStandardMaterial({ color: 0xffa6dc, transparent: true, opacity: 0.68, emissive: 0xff60c2, emissiveIntensity: 0.28 }));
  group.add(dome);
  for (let i = 0; i < 5; i++) {
    const tentacle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.62, 6), new THREE.MeshBasicMaterial({ color: 0xffc4eb, transparent: true, opacity: 0.75 }));
    tentacle.position.set((i - 2) * 0.11, -0.38, 0);
    group.add(tentacle);
  }
  group.position.set(x, y, z);
  group.userData = { phase, baseX: x, baseY: y };
  scene.add(group);
  jellies.push(group);
}

function makeCurrent(x, y, z, dir, strength) {
  const ribbon = new THREE.Mesh(new THREE.TorusKnotGeometry(0.4, 0.018, 64, 6, 2, 3), new THREE.MeshBasicMaterial({ color: 0x52e9ff, transparent: true, opacity: 0.36 }));
  ribbon.scale.set(1.5, 0.25, 0.25);
  ribbon.rotation.y = dir > 0 ? 0.7 : -0.7;
  ribbon.position.set(x, y, z);
  ribbon.userData = { dir, strength };
  scene.add(ribbon);
  currents.push(ribbon);
}

function clearActObjects() {
  for (const collection of [pearls, bells, jellies, currents, shells]) {
    for (const obj of collection) scene.remove(obj);
    collection.length = 0;
  }
}

function resetAct(index) {
  clearActObjects();
  const map = maps[index];
  scene.fog.density = map.fog;
  state.act = index;
  state.collectedOrder = [];
  state.shells = 0;
  state.bells = 0;
  state.oxygen = Math.max(state.oxygen, index === 0 ? 100 : 72);
  state.guideCooldown = 0;
  state.pulseCooldown = 0;
  player.position.set(0, -0.1, 0);
  player.userData.velocity.set(0, 0, -0.35);

  const spacing = index === 0 ? 4.2 : 3.65;
  map.pearls.forEach((type, i) => {
    const hidden = index === 2 && i % 2 === 1;
    makePearl(type, ((i % 3) - 1) * (1.15 + index * 0.18), -0.35 + ((i + index) % 3) * 0.72, -3.6 - i * spacing, hidden);
  });
  makeAirBell(index ? -1.75 : 1.6, 0.15, -8.4 - index * 1.8, 'Air Bell A');
  if (index >= 2) makeAirBell(1.9, 0.85, -17.5, 'Air Bell B');
  for (let i = 0; i < map.jellyfish; i++) makeJelly((i % 2 ? -1 : 1) * (1.3 + i * 0.25), -0.2 + (i % 3) * 0.65, -7 - i * 4.3, i * 1.4);
  for (let i = 0; i < 2 + index; i++) makeCurrent((i % 2 ? -1.2 : 1.1), -0.4 + (i % 3) * 0.55, -5.5 - i * 5.2, i % 2 ? -1 : 1, map.current + i * 0.08);
  updateMission();
  setHelper(`${map.name}: collect pearls in order, refill oxygen, and chart the route.`);
}

function updateMission() {
  const map = maps[state.act];
  ui.actEyebrow.textContent = map.name;
  ui.missionTitle.textContent = state.atlasTriggered ? 'Umi Pearl Atlas unlocked' : 'Umi Pearl Kelp Cartographer';
  ui.missionText.textContent = map.text;
  ui.missionTags.replaceChildren(...map.tags.map((tag) => {
    const el = document.createElement('span');
    el.textContent = tag;
    return el;
  }));
  for (let i = 0; i < 4; i++) {
    const el = $(`atlas${i}`);
    el.classList.toggle('done', i < state.act || state.atlasTriggered);
  }
}

function initAudio() {
  if (audio.enabled || state.muted) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audio.ctx = audio.ctx || new AudioContext();
  audio.ctx.resume?.();
  audio.enabled = true;
  window.__day020Audio = audio;
}

function tone(freq, dur = 0.12, type = 'sine', gain = 0.055) {
  if (!audio.enabled || state.muted || !audio.ctx) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const amp = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(amp).connect(audio.ctx.destination);
  osc.start(now);
  osc.stop(now + dur + 0.03);
}

function sfx(name) {
  if (name === 'pearl') { tone(720, .1); tone(960, .14, 'triangle', .035); }
  if (name === 'bell') { tone(540, .28, 'sine', .05); tone(1080, .36, 'sine', .025); }
  if (name === 'current') tone(180, .16, 'sawtooth', .025);
  if (name === 'jelly') tone(92, .24, 'square', .035);
  if (name === 'sonar') { [420, 630, 840].forEach((f, i) => setTimeout(() => tone(f, .12, 'sine', .04), i * 95)); }
  if (name === 'atlas') { [520, 680, 860, 1120].forEach((f, i) => setTimeout(() => tone(f, .18, 'triangle', .045), i * 85)); }
}

function setHelper(text, seconds = 2.4) {
  ui.helper.textContent = text;
  state.messageTimer = seconds;
}

function addScore(points, reason) {
  state.score += Math.round(points * state.combo);
  state.combo = clamp(state.combo + 0.08, 1, 4.2);
  state.cleanChain += 1;
  state.bestCleanChain = Math.max(state.bestCleanChain, state.cleanChain);
  if (reason) setHelper(reason);
}

function damage(reason) {
  state.hearts -= 1;
  state.combo = 1;
  state.cleanChain = 0;
  state.oxygen = clamp(state.oxygen - 12, 0, 100);
  sfx('jelly');
  setHelper(reason, 3);
  if (state.hearts <= 0) endRun(false, 'All shell-heart charms cracked.');
  else {
    player.position.x = 0;
    player.position.y = 0;
    player.userData.velocity.multiplyScalar(0.25);
  }
}

function collectPearl(pearl) {
  const map = maps[state.act];
  pearl.userData.collected = true;
  pearl.visible = false;
  const expected = map.pearls[state.collectedOrder.length];
  if (pearl.userData.type === expected) {
    state.collectedOrder.push(pearl.userData.type);
    addScore(pearl.userData.type === 'gold' ? 140 : 95, `Clean ${pearl.userData.type} pearl logged in atlas order.`);
    state.sonar = clamp(state.sonar + 13, 0, 100);
  } else {
    state.score += 30;
    state.combo = Math.max(1, state.combo - 0.28);
    state.cleanChain = 0;
    setHelper(`Wrong-order ${pearl.userData.type} pearl logged as a side note. Combo softened.`);
  }
  sfx('pearl');
  checkActComplete();
}

function refillBell(bell) {
  if (bell.userData.used) return;
  bell.userData.used = true;
  bell.scale.setScalar(1.35);
  state.bells += 1;
  state.oxygen = clamp(state.oxygen + 42, 0, 100);
  state.sonar = clamp(state.sonar + 24, 0, 100);
  addScore(220, `${bell.userData.label} refill: oxygen restored and Sonar Bloom charged.`);
  sfx('bell');
  checkActComplete();
}

function dropGuideShell() {
  if (!state.running || state.paused || state.guideCooldown > 0) return;
  state.guideCooldown = 1.1;
  const shell = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 8, 24), new THREE.MeshStandardMaterial({ color: 0xffc4dd, emissive: 0xff68b9, emissiveIntensity: 0.22 }));
  shell.position.copy(player.position);
  shell.position.z -= 0.25;
  shell.rotation.x = Math.PI / 2;
  scene.add(shell);
  shells.push(shell);
  const safe = Math.abs(player.position.x) < 1.6 && player.position.y > -1.15 && player.userData.velocity.length() < 2.5;
  if (safe) {
    state.shells += 1;
    state.correctShells += 1;
    state.oxygen = clamp(state.oxygen + 5, 0, 100);
    addScore(170, 'Guide Shell anchored in a calm eddy. Oxygen refunded.');
  } else {
    state.combo = Math.max(1, state.combo - .22);
    setHelper('Guide Shell drifted in the current. Brake before placing the next marker.');
  }
  checkActComplete();
}

function triggerSonar() {
  if (!state.running || state.paused || state.sonar < 100) return;
  state.sonar = 0;
  state.sonarActive = 5.2;
  for (const pearl of pearls) {
    if (pearl.userData.hidden && !pearl.userData.collected) {
      pearl.material.opacity = 1;
      pearl.material.transparent = false;
      pearl.material.emissiveIntensity = 0.42;
      pearl.children.forEach((c) => c.material && (c.material.opacity = 0.75));
    }
  }
  setHelper('Sonar Bloom reveals hidden beacons, current arrows, and jellyfish silhouettes.', 4);
  sfx('sonar');
}

function pulse() {
  if (!state.running || state.paused || state.pulseCooldown > 0) return;
  state.pulseCooldown = 0.36;
  player.userData.velocity.z -= 2.2;
  state.oxygen = clamp(state.oxygen - 1.1, 0, 100);
  tone(260, .08, 'triangle', .025);
}

function brake(on = true) {
  state.input.brake = on;
  $('brakeBtn').classList.toggle('active', on);
}

function checkActComplete() {
  const map = maps[state.act];
  if (state.collectedOrder.length >= map.pearls.length && state.shells >= map.requiredShells && state.bells >= map.requiredBell) {
    const bonus = state.oxygen >= map.oxygenTarget ? 540 : 260;
    addScore(bonus, `${map.name} charted. Shrine buoy lit.`);
    if (state.oxygen >= 80) unlockBadge('High oxygen finish');
    if (state.act === 0 && state.oxygen > 65) unlockBadge('Shallow Shell calm route');
    if (state.act < maps.length - 1) {
      state.act += 1;
      setTimeout(() => resetAct(state.act), 900);
    } else if (!state.atlasTriggered && state.score >= 3400) {
      triggerAtlas();
    } else if (state.act === maps.length - 1) {
      state.score += 320;
      setTimeout(() => resetAct(2), 900);
    }
  }
}

function triggerAtlas() {
  state.atlasTriggered = true;
  state.score += 1250;
  unlockBadge('Umi Pearl Atlas');
  setHelper('Umi Pearl Atlas complete! Endless dive commissions now continue.', 5);
  sfx('atlas');
  const banner = document.createElement('div');
  banner.className = 'atlas-banner';
  banner.innerHTML = '<strong>Umi Pearl Atlas</strong><span>Pearl routes connect into a glowing coastal constellation.</span>';
  document.querySelector('.play-wrap').appendChild(banner);
  setTimeout(() => banner.remove(), 4200);
}

function unlockBadge(name) {
  const badges = new Set(JSON.parse(localStorage.getItem(BADGES_KEY) || '[]'));
  badges.add(name);
  localStorage.setItem(BADGES_KEY, JSON.stringify([...badges]));
}

function startGame() {
  initAudio();
  state.running = true;
  state.paused = false;
  state.ended = false;
  state.startedAt = performance.now();
  state.elapsed = 0;
  state.score = 0;
  state.combo = 1;
  state.hearts = 3;
  state.oxygen = 100;
  state.act = 0;
  state.sonar = 0;
  state.atlasTriggered = false;
  state.cleanChain = 0;
  state.bestCleanChain = 0;
  state.jellyHits = 0;
  state.correctShells = 0;
  ui.titleOverlay.classList.add('hidden');
  ui.pauseOverlay.classList.add('hidden');
  ui.resultOverlay.classList.add('hidden');
  resetAct(0);
  clock.getDelta();
  setHelper('Dive started: pulse toward the first moon pearls, then refill at Air Bell A.');
}

function pauseGame(show = true) {
  if (!state.running || state.ended) return;
  state.paused = show;
  ui.pauseOverlay.classList.toggle('hidden', !show);
}

function restart() { startGame(); }

function endRun(success, reason) {
  state.running = false;
  state.ended = true;
  const oldBest = state.best;
  state.best = Math.max(state.best, state.score);
  localStorage.setItem(BEST_KEY, String(state.best));
  if (state.atlasTriggered) {
    const prev = Number(localStorage.getItem(BEST_TIME_KEY) || 999999);
    if (state.elapsed < prev) localStorage.setItem(BEST_TIME_KEY, String(Math.round(state.elapsed)));
  }
  ui.resultEyebrow.textContent = success ? 'Dive map complete' : 'Dive ended';
  ui.resultHeading.textContent = state.atlasTriggered ? 'Umi Pearl Atlas glows' : 'Pearl route logged';
  ui.resultText.textContent = reason || (success ? 'The coastal shrine recorded your route.' : 'Try a safer oxygen route next dive.');
  ui.resultStats.innerHTML = `
    <div><span>Score</span><strong>${state.score}</strong></div>
    <div><span>Best</span><strong>${state.best}${state.best > oldBest ? ' ★' : ''}</strong></div>
    <div><span>Clean chain</span><strong>${state.bestCleanChain}</strong></div>
    <div><span>Shell markers</span><strong>${state.correctShells}</strong></div>
    <div><span>Jelly shocks</span><strong>${state.jellyHits}</strong></div>
    <div><span>Oxygen finish</span><strong>${Math.round(state.oxygen)}%</strong></div>`;
  ui.resultOverlay.classList.remove('hidden');
}

function update(dt) {
  if (!state.running || state.paused || state.ended) return;
  state.elapsed = (performance.now() - state.startedAt) / 1000;
  state.guideCooldown = Math.max(0, state.guideCooldown - dt);
  state.pulseCooldown = Math.max(0, state.pulseCooldown - dt);
  state.sonarActive = Math.max(0, state.sonarActive - dt);
  state.messageTimer = Math.max(0, state.messageTimer - dt);

  const v = player.userData.velocity;
  const force = state.input.brake ? 0.9 : 1.95;
  if (state.input.left) v.x -= force * dt;
  if (state.input.right) v.x += force * dt;
  if (state.input.up) v.y += force * dt;
  if (state.input.down) v.y -= force * dt;
  v.z -= (0.24 + state.act * 0.05) * dt;
  if (state.input.brake) v.multiplyScalar(Math.pow(0.20, dt));
  else v.multiplyScalar(Math.pow(0.68, dt));

  player.position.addScaledVector(v, dt);
  player.position.x = clamp(player.position.x, -3.25, 3.25);
  player.position.y = clamp(player.position.y, -1.45, 2.1);
  player.position.z = clamp(player.position.z, -28, 1.2);
  player.rotation.z = lerp(player.rotation.z, -v.x * 0.18, 0.08);
  player.rotation.x = lerp(player.rotation.x, v.y * 0.08, 0.08);

  state.oxygen = clamp(state.oxygen - dt * (2.4 + state.act * 0.65 + v.length() * 0.5), 0, 100);
  if (state.oxygen <= 0 && state.oxygenCooldown <= 0) {
    state.oxygenCooldown = 2.5;
    damage('Oxygen empty: shell-heart cracked. Refilled from the last air bell.');
    state.oxygen = 48;
  }
  state.oxygenCooldown = Math.max(0, state.oxygenCooldown - dt);
  if (state.elapsed > maps[state.act].duration + state.act * 30 && !state.atlasTriggered) endRun(false, 'The dive timer expired before the map was charted.');

  for (const current of currents) {
    current.rotation.z += dt * current.userData.dir * 0.5;
    if (player.position.distanceTo(current.position) < 1.05) {
      v.x += current.userData.dir * current.userData.strength * dt * 3.4;
      v.y += Math.sin(state.elapsed * 2.2) * current.userData.strength * dt;
      state.oxygen = clamp(state.oxygen - dt * 1.8, 0, 100);
      if (Math.random() < 0.015) sfx('current');
    }
  }

  for (const pearl of pearls) {
    if (pearl.userData.collected) continue;
    pearl.position.y = pearl.userData.baseY + Math.sin(state.elapsed * 1.8 + pearl.position.z) * 0.08;
    pearl.rotation.y += dt * 1.4;
    if (pearl.userData.hidden && state.sonarActive <= 0) {
      pearl.material.transparent = true;
      pearl.material.opacity = 0.18;
      pearl.children.forEach((c) => c.material && (c.material.opacity = 0.1));
    }
    if ((!pearl.userData.hidden || state.sonarActive > 0) && player.position.distanceTo(pearl.position) < 0.72) collectPearl(pearl);
  }

  for (const bell of bells) {
    bell.position.y = bell.userData.baseY + Math.sin(state.elapsed * 1.45 + bell.position.x) * 0.08;
    bell.rotation.y += dt * 0.8;
    if (!bell.userData.used && player.position.distanceTo(bell.position) < 0.95) refillBell(bell);
  }

  for (const jelly of jellies) {
    jelly.position.x = jelly.userData.baseX + Math.sin(state.elapsed * 0.95 + jelly.userData.phase) * 0.9;
    jelly.position.y = jelly.userData.baseY + Math.sin(state.elapsed * 1.6 + jelly.userData.phase) * 0.25;
    jelly.rotation.y += dt * 0.9;
    const danger = player.position.distanceTo(jelly.position) < 0.72;
    if (danger && !jelly.userData.cooldown) {
      jelly.userData.cooldown = 1.4;
      state.jellyHits += 1;
      damage('Moon jellyfish shock: oxygen drained and combo reset.');
    }
    jelly.userData.cooldown = Math.max(0, (jelly.userData.cooldown || 0) - dt);
  }

  for (const stem of gates) {
    stem.rotation.z += Math.sin(state.elapsed * 0.8 + stem.userData.phase) * 0.0009;
  }
  for (const bubble of bubbles) {
    bubble.position.y += bubble.userData.speed * dt;
    bubble.material.opacity = 0.32 + 0.26 * Math.sin(state.elapsed * 2 + bubble.position.x);
    if (bubble.position.y > 3.8) {
      bubble.position.y = -2.2;
      bubble.position.z = player.position.z - Math.random() * 34;
    }
  }

  camera.position.x = lerp(camera.position.x, player.position.x * 0.35, 0.05);
  camera.position.y = lerp(camera.position.y, player.position.y * 0.18 + 2.2, 0.05);
  camera.position.z = lerp(camera.position.z, player.position.z + 7.2, 0.06);
  camera.lookAt(player.position.x * 0.2, player.position.y * 0.1, player.position.z - 6.5);

  if (state.score > 1800 && state.sonar < 100) state.sonar = clamp(state.sonar + dt * 2.2, 0, 100);
  if (state.atlasTriggered && state.elapsed > 260) endRun(true, 'Endless dive logged.');
}

function render() {
  renderer.render(scene, camera);
}

function loop() {
  const dt = Math.min(clock.getDelta(), 0.05);
  update(dt);
  syncUi();
  render();
}

function syncUi() {
  ui.score.textContent = String(Math.round(state.score));
  ui.bestScore.textContent = String(Math.max(state.best, state.score));
  ui.hearts.textContent = '◆'.repeat(Math.max(0, state.hearts)) + '◇'.repeat(Math.max(0, 3 - state.hearts));
  ui.oxygen.textContent = `${Math.round(state.oxygen)}%`;
  ui.combo.textContent = `×${state.combo.toFixed(1)}`;
  ui.depth.textContent = `${Math.max(0, Math.round(-player.position.z * 2.8))}m`;
  const m = Math.floor(state.elapsed / 60), s = Math.floor(state.elapsed % 60).toString().padStart(2, '0');
  ui.time.textContent = `${m}:${s}`;
  document.documentElement.style.setProperty('--oxygen-angle', `${Math.round(state.oxygen * 3.6)}deg`);
  ui.sonarBtn.firstChild.nodeValue = `Sonar ${Math.round(state.sonar)}%`;
  ui.sonarBtn.disabled = state.sonar < 100;
  if (state.messageTimer <= 0 && state.running && !state.paused) {
    const map = maps[state.act];
    const next = map.pearls[state.collectedOrder.length] || 'route';
    ui.helper.textContent = `Depth ${Math.max(0, Math.round(-player.position.z * 2.8))}m · next ${next} pearl · oxygen ${Math.round(state.oxygen)}% · shells ${state.shells}/${map.requiredShells} · bells ${state.bells}/${map.requiredBell}`;
  }
}

function bindButton(id, fn) { $(id).addEventListener('click', (event) => { event.preventDefault(); fn(); }); }
function bindHold(id, key) {
  const btn = $(id);
  const set = (on) => { state.input[key] = on; btn.classList.toggle('active', on); };
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); btn.setPointerCapture?.(e.pointerId); set(true); });
  btn.addEventListener('pointerup', () => set(false));
  btn.addEventListener('pointercancel', () => set(false));
  btn.addEventListener('pointerleave', () => set(false));
}

function bindInput() {
  bindButton('startBtn', startGame);
  bindButton('resumeBtn', () => pauseGame(false));
  bindButton('pauseBtn', () => pauseGame(true));
  bindButton('restartBtn', restart);
  bindButton('pauseRestartBtn', restart);
  bindButton('resultRestartBtn', restart);
  bindButton('pulseBtn', pulse);
  bindButton('guideBtn', dropGuideShell);
  bindButton('sonarBtn', triggerSonar);
  bindButton('muteBtn', () => {
    state.muted = !state.muted;
    ui.muteBtn.textContent = state.muted ? 'Unmute audio' : 'Mute audio';
    if (!state.muted) initAudio();
  });
  bindHold('steerUp', 'up');
  bindHold('steerDown', 'down');
  bindHold('steerLeft', 'left');
  bindHold('steerRight', 'right');
  $('brakeBtn').addEventListener('pointerdown', (e) => { e.preventDefault(); brake(true); });
  $('brakeBtn').addEventListener('pointerup', () => brake(false));
  $('brakeBtn').addEventListener('pointercancel', () => brake(false));
  $('brakeBtn').addEventListener('pointerleave', () => brake(false));

  window.addEventListener('keydown', (event) => {
    if (event.repeat && !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight'].includes(event.code)) return;
    if (event.code === 'ArrowUp' || event.code === 'KeyW') state.input.up = true;
    if (event.code === 'ArrowDown' || event.code === 'KeyS') state.input.down = true;
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') state.input.left = true;
    if (event.code === 'ArrowRight' || event.code === 'KeyD') state.input.right = true;
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') brake(true);
    if (event.code === 'Space' || event.code === 'Enter') { event.preventDefault(); state.running ? pulse() : startGame(); }
    if (event.code === 'KeyG') dropGuideShell();
    if (event.code === 'KeyB') triggerSonar();
    if (event.code === 'KeyP') pauseGame(!state.paused);
    if (event.code === 'KeyR') restart();
  });
  window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowUp' || event.code === 'KeyW') state.input.up = false;
    if (event.code === 'ArrowDown' || event.code === 'KeyS') state.input.down = false;
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') state.input.left = false;
    if (event.code === 'ArrowRight' || event.code === 'KeyD') state.input.right = false;
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') brake(false);
  });
}

ui.bestScore.textContent = String(state.best);
ui.missionTags.replaceChildren(...maps[0].tags.map((tag) => { const el = document.createElement('span'); el.textContent = tag; return el; }));
bindInput();
initThree();
syncUi();
