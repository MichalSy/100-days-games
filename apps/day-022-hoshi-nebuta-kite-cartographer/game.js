import * as THREE from './assets/three.module.js';

const $ = (id) => document.getElementById(id);
const canvas = $('gameCanvas');
const ui = {
  score: $('score'), bestScore: $('bestScore'), hearts: $('hearts'), tension: $('tension'), combo: $('combo'), elapsed: $('elapsed'), altitude: $('altitude'), gust: $('gust'),
  chapterName: $('chapterName'), chapterGoal: $('chapterGoal'), starOrder: $('starOrder'), markerCount: $('markerCount'), beaconStatus: $('beaconStatus'), warning: $('warning'), helper: $('helper'),
  title: $('titleOverlay'), pause: $('pauseOverlay'), results: $('resultOverlay'), resultTitle: $('resultTitle'), resultStats: $('resultStats'), completeBanner: $('completeBanner'),
  menuBest: $('menuBest'), menuTime: $('menuTime'), start: $('startButton'), resume: $('resumeButton'), mute: $('muteButton'), pauseRestart: $('pauseRestartButton'), resultRestart: $('resultRestartButton')
};

const STORAGE = 'day022-hoshi-nebuta';
const best = {
  score: Number(localStorage.getItem(`${STORAGE}:bestScore`) || 0),
  time: Number(localStorage.getItem(`${STORAGE}:bestTime`) || 0),
  chain: Number(localStorage.getItem(`${STORAGE}:chain`) || 0),
  markers: Number(localStorage.getItem(`${STORAGE}:markers`) || 0),
  lowTension: Number(localStorage.getItem(`${STORAGE}:lowTension`) || 999),
  seals: Number(localStorage.getItem(`${STORAGE}:seals`) || 0)
};

const chapters = [
  { name: 'First Star Thread', goal: 'Trace 4 gold stars, bank at Beacon A, finish below 65% tension.', order: ['Gold', 'Gold', 'Gold', 'Gold'], z0: -24, length: 104, target: 65, beacon: 'Beacon A', shelves: 1, tangles: 0 },
  { name: 'Cloud Shelf Crossing', goal: 'Trace Gold–Blue–Gold–Blue, ride 2 cloud shelves, bank at Beacon B.', order: ['Gold', 'Blue', 'Gold', 'Blue'], z0: -145, length: 124, target: 62, beacon: 'Beacon B', shelves: 2, tangles: 2 },
  { name: 'Nebuta Dawn Map', goal: 'Reveal hidden gates, trace 5 stars, bank at two shrine beacons.', order: ['Blue', 'Gold', 'Gold', 'Blue', 'Gold'], z0: -290, length: 154, target: 58, beacon: 'Dawn Beacons', shelves: 3, tangles: 4 }
];

let renderer, scene, camera, clock, kite, kiteSprite, threadLine, trailLine, routeLine, raycaster;
let meshes = [];
let stars = [], beacons = [], tangles = [], shelves = [], winds = [], eddies = [], markers = [], particles = [];
let mode = 'menu';
let keys = Object.create(null);
let audio = { ctx: null, muted: false };
let state;

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const rand = seeded(22022);

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x071041, 0.013);
  camera = new THREE.PerspectiveCamera(56, 1, 0.1, 900);
  camera.position.set(0, 5.2, 18);
  raycaster = new THREE.Raycaster();
  clock = new THREE.Clock();

  const hemi = new THREE.HemisphereLight(0x9bdfff, 0x12071f, 2.4);
  const moon = new THREE.DirectionalLight(0xffffff, 2.8);
  moon.position.set(-8, 12, 8);
  const shrine = new THREE.PointLight(0xff7d55, 2.2, 120);
  shrine.position.set(0, -10, -80);
  scene.add(hemi, moon, shrine);

  buildStarfield();
  buildKite();
  buildCourse();
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);
  requestAnimationFrame(loop);
}

function add(mesh) { scene.add(mesh); meshes.push(mesh); return mesh; }
function makeMat(color, options = {}) { return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.04, emissive: options.emissive ?? 0x000000, emissiveIntensity: options.emissiveIntensity ?? 0, transparent: options.transparent ?? false, opacity: options.opacity ?? 1, side: options.side ?? THREE.FrontSide }); }
function altitudeName(y) { return y > 5.4 ? 'high' : y < 1.3 ? 'low' : 'mid'; }
function formatTime(t) { const m = Math.floor(t / 60); const s = Math.floor(t % 60).toString().padStart(2, '0'); return `${m}:${s}`; }
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z); }

function buildStarfield() {
  const geom = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  for (let i = 0; i < 580; i++) {
    positions.push((rand() - .5) * 150, rand() * 55 + 4, -rand() * 620 - 10);
    const warm = rand() > .35;
    colors.push(warm ? 1 : .55, warm ? .78 : .86, warm ? .36 : 1);
  }
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  add(new THREE.Points(geom, new THREE.PointsMaterial({ size: 0.32, vertexColors: true, transparent: true, opacity: 0.86 })));
}

function buildKite() {
  kite = new THREE.Group();
  const loader = new THREE.TextureLoader();
  const texture = loader.load('./assets/hoshi-kite.png');
  texture.colorSpace = THREE.SRGBColorSpace;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  kiteSprite = new THREE.Sprite(spriteMat);
  kiteSprite.scale.set(3.4, 3.4, 1);
  kiteSprite.position.set(0, .2, 0);
  kite.add(kiteSprite);

  const diamondShape = new THREE.Shape();
  diamondShape.moveTo(0, 1.35); diamondShape.lineTo(1.7, 0); diamondShape.lineTo(0, -1.35); diamondShape.lineTo(-1.7, 0); diamondShape.lineTo(0, 1.35);
  const diamond = new THREE.Mesh(new THREE.ShapeGeometry(diamondShape), makeMat(0xffd994, { emissive: 0xff8b35, emissiveIntensity: .55, transparent: true, opacity: .46, side: THREE.DoubleSide }));
  diamond.position.z = -0.08;
  kite.add(diamond);

  const charm = new THREE.Mesh(new THREE.SphereGeometry(.18, 16, 12), makeMat(0xffe39b, { emissive: 0xffb248, emissiveIntensity: 1.2 }));
  charm.position.set(0, -1.15, .04);
  kite.add(charm);
  kite.position.set(0, 2.6, 8);
  scene.add(kite);

  const threadGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -11, 18), kite.position]);
  threadLine = new THREE.Line(threadGeo, new THREE.LineBasicMaterial({ color: 0xffe1d1, transparent: true, opacity: .92 }));
  scene.add(threadLine);
  trailLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffd66d, transparent: true, opacity: .82 }));
  scene.add(trailLine);
  routeLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xfff0a2, transparent: true, opacity: .9 }));
  scene.add(routeLine);
}

function buildCourse() {
  for (const obj of meshes.splice(1)) scene.remove(obj);
  stars = []; beacons = []; tangles = []; shelves = []; winds = []; eddies = []; markers = [];
  chapters.forEach((chapter, ci) => {
    const spacing = chapter.length / (chapter.order.length + 1);
    chapter.order.forEach((type, i) => {
      const x = (rand() - .5) * (ci === 0 ? 7 : 12);
      const y = 2.1 + rand() * 5.6 + (ci === 2 && i % 2 ? 1.0 : 0);
      const z = chapter.z0 - spacing * (i + 1);
      createStar({ chapter: ci, type, order: i, position: new THREE.Vector3(x, y, z), hidden: ci === 2 && i > 1 });
    });
    for (let i = 0; i < chapter.shelves; i++) {
      createShelf(ci, new THREE.Vector3((rand() - .5) * 8, 1.15 + rand() * 2, chapter.z0 - 30 - i * 36));
    }
    for (let i = 0; i < 2 + ci; i++) {
      createWind(ci, chapter.z0 - 12 - i * 42, i % 2 ? -1 : 1);
      createEddy(ci, new THREE.Vector3((rand() - .5) * 9, 2.4 + rand() * 4.8, chapter.z0 - 45 - i * 36));
    }
    for (let i = 0; i < chapter.tangles; i++) {
      createTangle(ci, new THREE.Vector3((rand() - .5) * 12, 2.2 + rand() * 5.8, chapter.z0 - 28 - i * 32));
    }
    const bcount = ci === 2 ? 2 : 1;
    for (let i = 0; i < bcount; i++) createBeacon(ci, new THREE.Vector3((i ? 5.2 : -1.4) + (rand() - .5) * 2.4, .55, chapter.z0 - chapter.length + 8 - i * 30), i ? 'Dawn East' : chapter.beacon);
  });
}

function createStar(data) {
  const color = data.type === 'Gold' ? 0xffd76f : 0x79d8ff;
  const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 1), makeMat(color, { emissive: color, emissiveIntensity: 1.9 }));
  mesh.position.copy(data.position);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, .035, 8, 48), makeMat(0xffffff, { emissive: color, emissiveIntensity: .9, transparent: true, opacity: .66 }));
  ring.rotation.x = Math.PI / 2;
  mesh.add(ring);
  mesh.userData = { ...data, collected: false, baseY: data.position.y, kind: 'star' };
  add(mesh); stars.push(mesh);
}

function createBeacon(chapter, pos, label) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.8, 1.1, .5, 8), makeMat(0x3a1836));
  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, 1.4, 12), makeMat(0xff9b5e, { emissive: 0xff5722, emissiveIntensity: 1.4, transparent: true, opacity: .9 }));
  lantern.position.y = .9;
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.8, .06, 8, 72), makeMat(0xffd76f, { emissive: 0xffd76f, emissiveIntensity: 1.1, transparent: true, opacity: .55 }));
  halo.rotation.x = Math.PI / 2;
  group.add(base, lantern, halo);
  group.position.copy(pos);
  group.userData = { kind: 'beacon', chapter, label, lit: false };
  add(group); beacons.push(group);
}

function createShelf(chapter, pos) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(8.8, .5, 5.2), makeMat(0xa9d7ff, { emissive: 0x517fff, emissiveIntensity: .28, transparent: true, opacity: .32 }));
  mesh.position.copy(pos);
  mesh.userData = { kind: 'shelf', chapter, phase: rand() * Math.PI * 2 };
  add(mesh); shelves.push(mesh);
}

function createTangle(chapter, pos) {
  const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(.9, .22, 70, 8), makeMat(0x4d326b, { emissive: 0x2a1e5d, emissiveIntensity: .9, transparent: true, opacity: .78 }));
  mesh.position.copy(pos);
  mesh.userData = { kind: 'tangle', chapter, base: pos.clone(), phase: rand() * Math.PI * 2, hit: false };
  add(mesh); tangles.push(mesh);
}

function createWind(chapter, z, direction) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-7 * direction, 2.2 + rand() * 2, z),
    new THREE.Vector3(-2 * direction, 4.8 + rand() * 2, z - 14),
    new THREE.Vector3(3 * direction, 3.3 + rand() * 3, z - 30),
    new THREE.Vector3(7 * direction, 5.3 + rand() * 2, z - 48)
  ]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 44, .08, 8, false), makeMat(0x7bdcff, { emissive: 0x2bbcff, emissiveIntensity: 1.4, transparent: true, opacity: .54 }));
  tube.userData = { kind: 'wind', chapter, curve, direction };
  add(tube); winds.push(tube);
}

function createEddy(chapter, pos) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(1.3, .05, 8, 56), makeMat(0x83ffd6, { emissive: 0x30ffc1, emissiveIntensity: 1.3, transparent: true, opacity: .5 }));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.copy(pos);
  mesh.userData = { kind: 'eddy', chapter, used: false };
  add(mesh); eddies.push(mesh);
}

function resetRun() {
  state = {
    score: 0, hearts: 3, tension: 15, combo: 1, elapsed: 0, chapter: 0, starIndex: 0, collected: [], banked: 0, markers: 0, correctMarkers: 0,
    gustCharge: 0, gustActive: 0, skyComplete: false, completeBannerTimer: 0, tangleHits: 0, cleanChain: 0, bestChain: 0, chapterTangleHits: 0,
    velocity: new THREE.Vector3(), trail: [], route: [], warnings: 'Ready winds.', mute: audio.muted, startTime: performance.now(), endless: false
  };
  kite.position.set(0, 2.8, 8);
  for (const s of stars) { s.userData.collected = false; s.visible = !s.userData.hidden; }
  for (const b of beacons) { b.userData.lit = false; b.children[1].material.emissiveIntensity = 1.4; }
  for (const t of tangles) t.userData.hit = false;
  for (const e of eddies) e.userData.used = false;
  markers.forEach(m => scene.remove(m)); markers = [];
  updateChapterUI();
  ui.completeBanner.hidden = true;
  ui.results.hidden = true;
  ui.pause.hidden = true;
}

function startGame() {
  ensureAudio();
  resetRun();
  mode = 'running';
  ui.title.hidden = true;
  clock.getDelta();
  playTone(660, .06, 'sine', .08);
}

function togglePause(force) {
  if (mode === 'menu' || mode === 'over') return;
  const pause = force ?? mode === 'running';
  mode = pause ? 'paused' : 'running';
  ui.pause.hidden = !pause;
  if (!pause) clock.getDelta();
}

function gameOver(reason) {
  mode = 'over';
  saveBests();
  ui.resultTitle.textContent = reason;
  const badges = masteryBadges();
  ui.resultStats.innerHTML = `
    <p><b>Final score</b><br>${state.score}</p><p><b>Best score</b><br>${best.score}</p>
    <p><b>Chapter reached</b><br>${chapters[state.chapter]?.name ?? 'Endless sky commissions'}</p><p><b>Sky Map Complete</b><br>${state.skyComplete ? 'Yes' : 'Not yet'}</p>
    <p><b>Clean star chain</b><br>${state.bestChain}</p><p><b>Tension finish</b><br>${Math.round(state.tension)}%</p>
    <p><b>Markers placed</b><br>${state.markers} (${state.correctMarkers} correct)</p><p><b>Cloud tangles hit</b><br>${state.tangleHits}</p>
    <p style="grid-column:1/-1"><b>Mastery badges</b><br>${badges.length ? badges.join(' · ') : 'Keep mapping the wind.'}</p>`;
  ui.results.hidden = false;
}

function saveBests() {
  if (state.score > best.score) { best.score = state.score; localStorage.setItem(`${STORAGE}:bestScore`, String(best.score)); }
  if (state.skyComplete && (!best.time || state.elapsed < best.time)) { best.time = state.elapsed; localStorage.setItem(`${STORAGE}:bestTime`, String(best.time)); }
  if (state.bestChain > best.chain) { best.chain = state.bestChain; localStorage.setItem(`${STORAGE}:chain`, String(best.chain)); }
  if (state.correctMarkers > best.markers) { best.markers = state.correctMarkers; localStorage.setItem(`${STORAGE}:markers`, String(best.markers)); }
  if (state.skyComplete && state.tension < best.lowTension) { best.lowTension = Math.round(state.tension); localStorage.setItem(`${STORAGE}:lowTension`, String(best.lowTension)); }
  refreshBestUI();
}
function refreshBestUI() { ui.bestScore.textContent = String(best.score); ui.menuBest.textContent = String(best.score); ui.menuTime.textContent = best.time ? formatTime(best.time) : '—'; }

function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (mode === 'running') update(dt);
  animateScene(dt);
  renderer.render(scene, camera);
}

function update(dt) {
  state.elapsed += dt;
  const inputX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  const inputY = (keys.up ? 1 : 0) - (keys.down ? 1 : 0);
  const reelIn = keys.reelIn ? 1 : 0;
  const reelOut = keys.reelOut ? 1 : 0;
  const steerPower = reelOut ? 7.2 : 9.4;
  state.velocity.x += inputX * steerPower * dt;
  state.velocity.y += inputY * steerPower * dt + reelIn * 4.4 * dt - reelOut * 2.2 * dt;
  state.velocity.x *= Math.pow(0.18, dt);
  state.velocity.y *= Math.pow(0.22, dt);

  const forward = 7.4 + reelIn * 3.1 - reelOut * 1.7 + Math.min(state.elapsed / 120, 2.3);
  kite.position.z -= forward * dt;
  kite.position.x += state.velocity.x * dt;
  kite.position.y += state.velocity.y * dt;
  kite.position.x = THREE.MathUtils.clamp(kite.position.x, -9.5, 9.5);
  kite.position.y = THREE.MathUtils.clamp(kite.position.y, -1.2, 9.8);

  const steerLoad = Math.abs(inputX) + Math.abs(inputY);
  state.tension += (reelIn * 9.5 + steerLoad * 1.2 - reelOut * 8.3 - 2.2) * dt;
  if (kite.position.y < .15) state.tension += 13 * dt;
  state.tension = THREE.MathUtils.clamp(state.tension, 0, 112);
  if (state.tension >= 100) damage('Thread tension snapped — respawned at the last shrine draft.', 22);

  applyWindAndShelves(dt);
  collectStars();
  checkBeacons();
  updateTangles(dt);
  updateProgression();
  updateCamera(dt);
  updateLines();
  updateHUD();
}

function applyWindAndShelves(dt) {
  for (const wind of winds) {
    if (Math.abs(kite.position.z - wind.position.z) < 60) {
      const close = closestPointOnCurve(wind.userData.curve, kite.position);
      if (close.distance < 2.8) {
        state.velocity.x += wind.userData.direction * 3.2 * dt;
        state.velocity.y += .9 * dt;
        state.tension += 1.8 * dt;
        state.warnings = 'Wind ribbon pulling the thread — align with the arrow or Reel Out.';
      }
    }
  }
  for (const shelf of shelves) {
    shelf.position.y += Math.sin(state.elapsed * 1.4 + shelf.userData.phase) * .006;
    if (Math.abs(kite.position.z - shelf.position.z) < 3.4 && Math.abs(kite.position.x - shelf.position.x) < 5.2 && Math.abs(kite.position.y - shelf.position.y) < 1.3) {
      state.velocity.y += 4.1 * dt;
      state.score += Math.floor(14 * dt);
      state.warnings = 'Cloud shelf lift! Hold steady and bank the height.';
    }
  }
}

function closestPointOnCurve(curve, point) {
  let bestPoint = curve.getPoint(0), bestDistance = Infinity;
  for (let i = 0; i <= 20; i++) {
    const p = curve.getPoint(i / 20);
    const d = p.distanceTo(point);
    if (d < bestDistance) { bestDistance = d; bestPoint = p; }
  }
  return { point: bestPoint, distance: bestDistance };
}

function collectStars() {
  const chapter = chapters[state.chapter];
  for (const star of stars) {
    if (star.userData.collected || star.userData.chapter !== state.chapter) continue;
    if (star.userData.hidden && state.gustActive <= 0) continue;
    if (dist(kite.position, star.position) < 2.25) {
      star.userData.collected = true;
      star.visible = false;
      const expected = chapter.order[state.starIndex];
      const correct = star.userData.type === expected;
      if (correct) {
        state.starIndex++;
        state.cleanChain++;
        state.bestChain = Math.max(state.bestChain, state.cleanChain);
        state.combo = Math.min(6, state.combo + .5);
        state.score += Math.round(105 * state.combo);
        state.gustCharge = Math.min(100, state.gustCharge + 22);
        state.collected.push(star.userData.type);
        state.route.push(star.position.clone());
        state.warnings = `${star.userData.type} star ink attached in order — route stroke ${state.starIndex}/${chapter.order.length}.`;
        playTone(star.userData.type === 'Gold' ? 920 : 720, .08, 'triangle', .07);
      } else {
        state.score += 35;
        state.combo = 1;
        state.cleanChain = 0;
        state.tension += 7;
        state.warnings = `Wrong-order ${star.userData.type} star: tiny ink kept, but cloud tangles heard the noise.`;
        playTone(180, .09, 'sawtooth', .05);
      }
      updateChapterUI();
    }
  }
}

function checkBeacons() {
  const chapter = chapters[state.chapter];
  if (!chapter) return;
  for (const beacon of beacons) {
    if (beacon.userData.chapter !== state.chapter || beacon.userData.lit) continue;
    const near = dist(kite.position, new THREE.Vector3(beacon.position.x, 2.0, beacon.position.z)) < 4.2;
    if (near && state.starIndex >= chapter.order.length) {
      beacon.userData.lit = true;
      beacon.children[1].material.emissiveIntensity = 4;
      state.banked++;
      state.score += 240 + (state.tension < chapter.target ? 580 : 120) + (state.chapterTangleHits === 0 ? 740 : 0);
      state.gustCharge = Math.min(100, state.gustCharge + 35);
      if (state.hearts < 3) state.hearts++;
      state.tension = Math.max(0, state.tension - 16);
      state.warnings = `${beacon.userData.label} lit! Constellation stroke banked and tension refunded.`;
      playChord([440, 660, 880], .16);
      advanceChapterIfReady();
    } else if (near) {
      state.warnings = `Shrine beacon close — collect ${chapter.order.length - state.starIndex} requested star(s) before banking.`;
    }
  }
}

function advanceChapterIfReady() {
  const needed = state.chapter === 2 ? 2 : 1;
  const lit = beacons.filter(b => b.userData.chapter === state.chapter && b.userData.lit).length;
  if (lit < needed) return;
  if (state.chapter < 2) {
    state.chapter++;
    state.starIndex = 0;
    state.collected = [];
    state.chapterTangleHits = 0;
    updateChapterUI();
    state.warnings = `${chapters[state.chapter].name} opened in deeper violet winds.`;
  } else if (!state.skyComplete && state.score >= 3600) {
    completeSkyMap();
  } else if (!state.skyComplete) {
    state.score += 1350;
    completeSkyMap();
  }
}

function updateProgression() {
  const chapter = chapters[state.chapter];
  if (!chapter) return;
  const chapterElapsed = state.elapsed - state.chapter * 70;
  if (chapterElapsed > 128 && !state.skyComplete) gameOver('Chapter timer expired before the kite could bank the route');
  if (kite.position.z < chapter.z0 - chapter.length - 30 && state.starIndex < chapter.order.length) {
    state.tension += .35;
    state.warnings = 'You are flying past the requested route — steer back toward the glowing star order.';
  }
  if (state.skyComplete && kite.position.z < -520) extendEndlessCourse();
}

function completeSkyMap() {
  state.skyComplete = true;
  state.endless = true;
  state.score += 1350;
  state.completeBannerTimer = 4.5;
  ui.completeBanner.hidden = false;
  best.seals += 1;
  localStorage.setItem(`${STORAGE}:seals`, String(best.seals));
  playChord([523, 659, 784, 1046], .4);
  state.warnings = 'Hoshi Sky Map Complete! The kite bows, cloud tangles drift away, endless commissions continue.';
  saveBests();
}

function extendEndlessCourse() {
  const z = kite.position.z - 90;
  const type = rand() > .5 ? 'Gold' : 'Blue';
  createStar({ chapter: 2, type, order: 0, position: new THREE.Vector3((rand() - .5) * 14, 2 + rand() * 7, z), hidden: false });
  createTangle(2, new THREE.Vector3((rand() - .5) * 14, 2 + rand() * 7, z - 24));
  createWind(2, z + 18, rand() > .5 ? 1 : -1);
}

function updateTangles(dt) {
  for (const t of tangles) {
    const base = t.userData.base;
    t.position.x = base.x + Math.sin(state.elapsed * 1.2 + t.userData.phase) * 1.8;
    t.position.y = base.y + Math.cos(state.elapsed * .95 + t.userData.phase) * .8;
    t.rotation.x += dt * .8;
    t.rotation.y += dt * 1.1;
    const d = dist(kite.position, t.position);
    if (d < 2.05 && !t.userData.hit) {
      t.userData.hit = true;
      state.tangleHits++;
      state.chapterTangleHits++;
      damage('Cloud tangle snagged the braid: heart dimmed, tension jumped.', 16);
      playTone(96, .18, 'sawtooth', .08);
    } else if (d > 2.05 && d < 3.15 && !t.userData.closeAwarded) {
      t.userData.closeAwarded = true;
      state.score += 95;
      state.warnings = 'Close tangle dodge scored — the thread sang cleanly.';
    }
  }
}

function damage(message, tensionJump) {
  state.hearts--;
  state.tension = Math.min(95, state.tension + tensionJump);
  state.combo = 1;
  state.cleanChain = 0;
  state.velocity.multiplyScalar(.2);
  state.warnings = message;
  if (state.hearts <= 0) gameOver('All kite-lantern hearts went dark');
}

function tailPulse() {
  if (mode === 'menu') return startGame();
  if (mode !== 'running') return;
  state.velocity.multiplyScalar(.38);
  state.tension = Math.max(0, state.tension - 3.4);
  state.score += 8;
  state.warnings = 'Tail Pulse steadied the drift and softened thread tension.';
  playTone(520, .055, 'sine', .05);
}

function dropMarker() {
  if (mode !== 'running') return;
  const marker = new THREE.Mesh(new THREE.ConeGeometry(.45, 1.2, 5), makeMat(0xffe1d1, { emissive: 0xffa85d, emissiveIntensity: 1.2 }));
  marker.rotation.x = Math.PI;
  marker.position.copy(kite.position).add(new THREE.Vector3(0, -1.05, 0));
  marker.userData = { kind: 'marker' };
  scene.add(marker); markers.push(marker);
  state.markers++;
  const calm = eddies.some(e => !e.userData.used && dist(marker.position, e.position) < 3.0);
  const nearBeacon = beacons.some(b => b.userData.chapter === state.chapter && dist(marker.position, new THREE.Vector3(b.position.x, 2, b.position.z)) < 13);
  if (calm && nearBeacon) {
    state.correctMarkers++;
    state.score += 180;
    state.tension = Math.max(0, state.tension - 8);
    state.gustCharge = Math.min(100, state.gustCharge + 14);
    state.warnings = 'Star Thread marker caught a calm eddy near shrine light — tension refunded.';
    playTone(760, .08, 'triangle', .06);
  } else {
    state.tension += 3;
    state.warnings = 'Marker drifted in turbulent wind. Look for green eddy rings near beacons.';
  }
}

function kitsuneGust() {
  if (mode !== 'running') return;
  if (state.gustCharge < 100) { state.warnings = 'Kitsune Gust is still charging through clean star chains.'; return; }
  state.gustCharge = 0;
  state.gustActive = 5.2;
  for (const s of stars) if (s.userData.chapter === state.chapter && s.userData.hidden && !s.userData.collected) s.visible = true;
  for (const t of tangles) t.material.opacity = .95;
  state.warnings = 'Kitsune Gust reveals hidden gates, wind arrows, and cloud-tangle depth lanes!';
  playChord([330, 494, 740], .22);
}

function animateScene(dt) {
  if (!scene) return;
  const t = performance.now() / 1000;
  if (state) {
    if (state.gustActive > 0) {
      state.gustActive -= dt;
      if (state.gustActive <= 0) stars.forEach(s => { if (s.userData.hidden && !s.userData.collected) s.visible = false; });
    }
    if (state.completeBannerTimer > 0) {
      state.completeBannerTimer -= dt;
      if (state.completeBannerTimer <= 0) ui.completeBanner.hidden = true;
    }
  }
  for (const s of stars) { s.rotation.y += dt * 1.9; s.position.y = s.userData.baseY + Math.sin(t * 1.8 + s.userData.order) * .28; }
  for (const w of winds) { w.material.opacity = state?.gustActive > 0 ? .82 : .46 + Math.sin(t * 2 + w.userData.direction) * .08; }
  for (const e of eddies) e.rotation.z += dt * .8;
  if (kite) {
    kite.rotation.z = THREE.MathUtils.lerp(kite.rotation.z, -state?.velocity.x * .035 || 0, .08);
    kite.rotation.x = THREE.MathUtils.lerp(kite.rotation.x, state?.velocity.y * .018 || 0, .08);
    kiteSprite.material.rotation = Math.sin(t * 3) * .015;
  }
}

function updateCamera(dt) {
  const target = new THREE.Vector3(kite.position.x * .22, kite.position.y + 2.0, kite.position.z + 15.5);
  camera.position.lerp(target, 1 - Math.pow(.004, dt));
  camera.lookAt(kite.position.x * .32, kite.position.y + .7, kite.position.z - 24);
}

function updateLines() {
  const anchor = new THREE.Vector3(0, -7.5, kite.position.z + 18);
  const mid = kite.position.clone().lerp(anchor, .45).add(new THREE.Vector3(Math.sin(state.elapsed * 2) * .7, -1.2, 0));
  threadLine.geometry.setFromPoints([anchor, mid, kite.position.clone().add(new THREE.Vector3(0, -1.2, 0))]);
  state.trail.push(kite.position.clone().add(new THREE.Vector3(0, -1.3, .2)));
  if (state.trail.length > 42) state.trail.shift();
  trailLine.geometry.setFromPoints(state.trail);
  routeLine.geometry.setFromPoints(state.route.length ? state.route : [kite.position]);
}

function updateHUD() {
  ui.score.textContent = String(Math.floor(state.score));
  ui.bestScore.textContent = String(best.score);
  ui.hearts.textContent = '🪁'.repeat(Math.max(0, state.hearts)) + '•'.repeat(Math.max(0, 3 - state.hearts));
  ui.tension.textContent = `${Math.round(state.tension)}%`;
  ui.tension.style.color = state.tension > 78 ? '#ff7b94' : state.tension > 58 ? '#ffd76f' : '#ffffff';
  ui.combo.textContent = `x${state.combo.toFixed(1)}`;
  ui.elapsed.textContent = formatTime(state.elapsed);
  ui.altitude.textContent = altitudeName(kite.position.y);
  ui.gust.textContent = `${Math.round(state.gustCharge)}%`;
  ui.markerCount.textContent = `Markers ${state.markers} (${state.correctMarkers} true)`;
  const chapter = chapters[state.chapter];
  const next = chapter?.order[state.starIndex] ?? 'Beacon';
  ui.beaconStatus.textContent = chapter ? `${state.starIndex}/${chapter.order.length} stars · ${chapter.beacon}` : 'Endless';
  ui.warning.textContent = state.warnings;
  ui.helper.textContent = `${altitudeName(kite.position.y).toUpperCase()} altitude · next ${next} · tension ${Math.round(state.tension)}% · ${state.warnings}`;
}

function updateChapterUI() {
  const chapter = chapters[state.chapter] ?? chapters[2];
  ui.chapterName.textContent = chapter.name;
  ui.chapterGoal.textContent = chapter.goal;
  ui.starOrder.innerHTML = '';
  chapter.order.forEach((name, i) => {
    const li = document.createElement('li');
    li.textContent = `${name === 'Gold' ? '★' : '✦'} ${name}`;
    if (i < state.starIndex) li.classList.add('done');
    ui.starOrder.append(li);
  });
}

function masteryBadges() {
  const badges = [];
  if (state.skyComplete && state.elapsed < 225) badges.push('Fast Sky Map');
  if (state.bestChain >= 20) badges.push('20 Clean Stars');
  if (state.correctMarkers >= 10) badges.push('Thread Cartographer');
  if (state.skyComplete && state.tension < 40) badges.push('Low Tension Finish');
  if (state.tangleHits === 0 && state.score > 0) badges.push('No-Tangle Flight');
  if (state.skyComplete && state.hearts === 3) badges.push('Full Heart Commission');
  return badges;
}

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = Math.max(320, Math.floor(rect.width));
  const h = Math.max(260, Math.floor(rect.height));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function ensureAudio() {
  if (audio.ctx || audio.muted) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audio.ctx = new AudioContext();
  audio.ctx.resume?.().catch(() => {});
}
function playTone(freq, dur = .08, type = 'sine', gain = .05) {
  if (!audio.ctx || audio.muted) return;
  const ctx = audio.ctx;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, ctx.currentTime);
  amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + .01);
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(amp).connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + dur + .02);
}
function playChord(freqs, dur) { freqs.forEach((f, i) => setTimeout(() => playTone(f, dur, 'triangle', .045), i * 45)); }

function bindControls() {
  const keyMap = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', q: 'reelOut', Q: 'reelOut', e: 'reelIn', E: 'reelIn' };
  window.addEventListener('keydown', (e) => {
    if (keyMap[e.key]) { keys[keyMap[e.key]] = true; e.preventDefault(); }
    if (e.key === ' ' || e.key === 'Enter') { tailPulse(); e.preventDefault(); }
    if (e.key === 'g' || e.key === 'G') dropMarker();
    if (e.key === 'b' || e.key === 'B' || e.key === 'Shift') kitsuneGust();
    if (e.key === 'p' || e.key === 'P') togglePause();
    if (e.key === 'r' || e.key === 'R') { resetRun(); mode = 'running'; ui.title.hidden = true; }
  });
  window.addEventListener('keyup', (e) => { if (keyMap[e.key]) keys[keyMap[e.key]] = false; });
  document.querySelectorAll('[data-hold]').forEach((button) => {
    const name = button.dataset.hold;
    const on = (e) => { e.preventDefault(); keys[name] = true; button.classList.add('is-held'); ensureAudio(); };
    const off = (e) => { e?.preventDefault(); keys[name] = false; button.classList.remove('is-held'); };
    button.addEventListener('pointerdown', on); button.addEventListener('pointerup', off); button.addEventListener('pointercancel', off); button.addEventListener('pointerleave', off);
  });
  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      ensureAudio();
      if (action === 'pulse') tailPulse();
      if (action === 'marker') dropMarker();
      if (action === 'gust') kitsuneGust();
      if (action === 'pause') togglePause(true);
      if (action === 'restart') { resetRun(); mode = 'running'; ui.title.hidden = true; ui.pause.hidden = true; ui.results.hidden = true; }
    });
  });
  ui.start.addEventListener('click', startGame);
  ui.resume.addEventListener('click', () => togglePause(false));
  ui.pauseRestart.addEventListener('click', () => { resetRun(); mode = 'running'; ui.pause.hidden = true; });
  ui.resultRestart.addEventListener('click', () => { resetRun(); mode = 'running'; ui.results.hidden = true; });
  ui.mute.addEventListener('click', () => { audio.muted = !audio.muted; ui.mute.textContent = audio.muted ? 'Unmute audio' : 'Mute audio'; });
  canvas.addEventListener('pointerdown', (e) => {
    if (mode !== 'running') return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    keys.left = x < .35; keys.right = x > .65; keys.up = y < .42; keys.down = y > .68;
  });
  canvas.addEventListener('pointerup', () => { keys.left = keys.right = keys.up = keys.down = false; });
}

refreshBestUI();
bindControls();
initThree();
resetRun();
