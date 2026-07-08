import * as THREE from './assets/three.module.min.js';

const $ = (id) => document.getElementById(id);
const canvas = $('gameCanvas');
const ui = {
  score: $('score'), best: $('best'), safety: $('safety'), smoke: $('smoke'), combo: $('combo'), shellName: $('shellName'), fuseName: $('fuseName'), time: $('time'),
  chapterEyebrow: $('chapterEyebrow'), missionText: $('missionText'), orderText: $('orderText'), ringText: $('ringText'), fanCharge: $('fanCharge'), focusCharge: $('focusCharge'),
  statusLine: $('statusLine'), stageLabel: $('stageLabel'), reticle: $('reticle'), overlay: $('overlay'), overlayTitle: $('overlayTitle'), overlayCopy: $('overlayCopy'), startBtn: $('startBtn'), resumeBtn: $('resumeBtn'), overlayRestartBtn: $('overlayRestartBtn')
};

const shells = [
  { name: 'Gold', color: 0xffd66b, key: 'gold', role: 'precise star' },
  { name: 'Cyan', color: 0x42e7ff, key: 'cyan', role: 'smoke clear' },
  { name: 'Magenta', color: 0xff4fb8, key: 'magenta', role: 'wide bloom' },
  { name: 'White', color: 0xf8f4df, key: 'white', role: 'late willow' }
];
const fuseModes = [
  { name: 'Early', t: 0.58 },
  { name: 'Mid', t: 0.74 },
  { name: 'Late', t: 0.9 }
];
const chapters = [
  { name: 'First River Spark', targetShells: ['gold', 'gold'], rings: 3, smokeLimit: 35, score: 1100, text: 'Paint 2 gold bursts in the high lane, pass 3 rings, and keep smoke under 35%.' },
  { name: 'Lantern Bridge Bloom', targetShells: ['cyan', 'magenta', 'gold'], rings: 5, smokeLimit: 45, score: 2500, text: 'Paint cyan, magenta, then gold across mid/deep lanes, clear one smoke ribbon, and pass 5 rings.' },
  { name: 'Grand Summer Crest', targetShells: ['gold', 'cyan', 'magenta', 'white'], rings: 8, smokeLimit: 55, score: 4000, text: 'Paint the four-color crest in order, chain 8 rings, and keep enough sky clear for Grand Hanabi.' }
];

let renderer, scene, camera, clock, tube, tubePivot, shellMesh, shellTrail, targetGroup, smokeGroup, ringGroup, burstGroup, bgTexture;
let audioCtx = null;
let chargeStart = 0;
let charging = false;
let activeShell = null;
let burstParticles = [];
let rings = [];
let targets = [];
let smokeClouds = [];
let lastTime = performance.now();
let dragStart = null;

const state = {
  phase: 'menu',
  startedAt: 0,
  elapsed: 0,
  score: 0,
  best: Number(localStorage.getItem('day026-best') || 0),
  bestTime: localStorage.getItem('day026-best-time') || '',
  safety: 3,
  smoke: 0,
  combo: 1,
  shellIndex: 0,
  fuseIndex: 1,
  chapter: 0,
  chapterShellProgress: 0,
  ringCount: 0,
  fan: 100,
  focus: 0,
  focusActive: 0,
  angleX: 0,
  angleY: 0.58,
  launches: 0,
  misfires: 0,
  accurateBursts: 0,
  grand: false,
  muted: false
};

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x05091f, 12, 42);
  camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 5.3, 15.5);
  camera.lookAt(0, 5.8, -8);
  clock = new THREE.Clock();

  const loader = new THREE.TextureLoader();
  bgTexture = loader.load('./assets/natsu-festival.png');
  bgTexture.colorSpace = THREE.SRGBColorSpace;
  renderer.setClearAlpha(0);

  const ambient = new THREE.AmbientLight(0x7db9ff, 1.4);
  scene.add(ambient);
  const lantern = new THREE.PointLight(0xffb35a, 3, 28);
  lantern.position.set(0, 2, 6);
  scene.add(lantern);
  const moon = new THREE.DirectionalLight(0xbed6ff, 2.4);
  moon.position.set(-6, 10, 8);
  scene.add(moon);

  const deckMat = new THREE.MeshStandardMaterial({ color: 0x3b1522, roughness: 0.6, metalness: 0.25 });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.36, 2.2), deckMat);
  deck.position.set(0, -0.85, 4.2);
  deck.rotation.x = -0.08;
  scene.add(deck);

  tubePivot = new THREE.Group();
  tubePivot.position.set(0, -0.25, 3.6);
  scene.add(tubePivot);
  const tubeGeo = new THREE.CylinderGeometry(0.26, 0.34, 1.8, 28, 1, true);
  const tubeMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.28, metalness: 0.55, emissive: 0x120604 });
  tube = new THREE.Mesh(tubeGeo, tubeMat);
  tube.rotation.x = Math.PI / 2;
  tubePivot.add(tube);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.035, 12, 32), new THREE.MeshBasicMaterial({ color: 0xffd66b }));
  rim.position.z = -0.91;
  tube.add(rim);

  ringGroup = new THREE.Group(); targetGroup = new THREE.Group(); smokeGroup = new THREE.Group(); burstGroup = new THREE.Group();
  scene.add(ringGroup, targetGroup, smokeGroup, burstGroup);
  shellTrail = new THREE.Group(); scene.add(shellTrail);
  buildSkyObjects();
  resize();
}

function buildSkyObjects() {
  ringGroup.clear(); targetGroup.clear(); smokeGroup.clear(); burstGroup.clear();
  rings = []; targets = []; smokeClouds = []; burstParticles = [];
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x42e7ff, transparent: true, opacity: 0.46, side: THREE.DoubleSide });
  const ringPositions = [
    [-2.6, 4.2, -5.2], [2.2, 5.4, -8.2], [0, 7.1, -11.2], [-3.1, 7.8, -13.4], [3.0, 6.7, -15.2]
  ];
  ringPositions.forEach((p, i) => {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.58 + i * 0.06, 0.035, 12, 56), ringMat.clone());
    torus.position.set(...p);
    torus.rotation.x = Math.PI / 2 + 0.12 * i;
    torus.userData.hit = false;
    ringGroup.add(torus);
    rings.push(torus);
  });
  const targetData = [
    [-1.8, 6.4, -10.2, 0xffd66b, 'gold'], [2.0, 5.7, -12.6, 0x42e7ff, 'cyan'], [0.25, 8.0, -15.4, 0xff4fb8, 'magenta'], [-2.8, 8.6, -18.0, 0xf8f4df, 'white']
  ];
  targetData.forEach(([x, y, z, color, key], i) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.58, 32, 16), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.23, wireframe: true }));
    sphere.position.set(x, y, z);
    sphere.userData.key = key;
    sphere.userData.baseX = x;
    targetGroup.add(sphere);
    targets.push(sphere);
  });
  const smokeMat = new THREE.MeshBasicMaterial({ color: 0x8a8da8, transparent: true, opacity: 0.28, depthWrite: false });
  [[-2.4, 5.6, -9.4], [2.7, 7.1, -14.0], [0.4, 4.5, -7.8]].forEach((p, i) => {
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.7 + i * 0.18, 18, 10), smokeMat.clone());
    cloud.position.set(...p);
    cloud.scale.set(1.6, 0.72, 0.9);
    smokeGroup.add(cloud);
    smokeClouds.push(cloud);
  });
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

function ensureAudio() {
  if (state.muted) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}
function beep(freq = 440, dur = 0.08, type = 'sine', gain = 0.04) {
  if (!audioCtx || state.muted) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(audioCtx.destination); osc.start(t); osc.stop(t + dur);
}
function fanSound() { beep(180, .12, 'sawtooth', .035); setTimeout(() => beep(320, .08, 'triangle', .025), 55); }
function launchSound(power) { beep(130 + power * 120, .09, 'square', .035); setTimeout(() => beep(520 + power * 360, .18, 'sine', .035), 80); }
function burstSound(ok) { beep(ok ? 640 : 180, .12, ok ? 'triangle' : 'sawtooth', .04); setTimeout(() => beep(ok ? 960 : 120, .16, 'sine', .03), 90); }

function startGame() {
  ensureAudio();
  Object.assign(state, { phase: 'running', startedAt: performance.now(), elapsed: 0, score: 0, safety: 3, smoke: 0, combo: 1, shellIndex: 0, fuseIndex: 1, chapter: 0, chapterShellProgress: 0, ringCount: 0, fan: 100, focus: 0, focusActive: 0, angleX: 0, angleY: 0.58, launches: 0, misfires: 0, accurateBursts: 0, grand: false });
  charging = false; activeShell = null; clearShellTrail(); buildSkyObjects(); hideOverlay(); updateUI('Aim the tube, pick Gold, charge, and burst in the high lane.'); beep(660, .12, 'triangle');
}
function showOverlay(kind = 'menu') {
  ui.overlay.classList.remove('hidden');
  ui.startBtn.style.display = kind === 'menu' ? '' : 'none';
  ui.resumeBtn.style.display = kind === 'pause' ? '' : 'none';
  ui.overlayRestartBtn.style.display = kind === 'menu' ? 'none' : '';
  if (kind === 'pause') { ui.overlayTitle.textContent = 'Paused'; ui.overlayCopy.textContent = 'Tune the next launch: aim, fuse, shell color, Wind Fan, then paint the sky.'; }
  else if (kind === 'results') { ui.overlayTitle.textContent = state.grand ? 'Natsu Grand Hanabi!' : 'Festival Results'; ui.overlayCopy.textContent = `Score ${state.score}. Accurate bursts ${state.accurateBursts}. Misfires ${state.misfires}. Smoke ${Math.round(state.smoke)}%.`; }
  else { ui.overlayTitle.textContent = 'Natsu Hanabi Sky Painter'; ui.overlayCopy.textContent = 'Launch hanabi shells through 3D sky rings and burst at the right altitude/depth to paint the summer festival sky.'; }
}
function hideOverlay() { ui.overlay.classList.add('hidden'); }
function pauseGame() { if (state.phase !== 'running') return; state.phase = 'paused'; showOverlay('pause'); updateUI('Paused. Resume when the sky is ready.'); }
function resumeGame() { if (state.phase !== 'paused') return; state.phase = 'running'; state.startedAt = performance.now() - state.elapsed * 1000; hideOverlay(); updateUI('Resumed. Aim for the next requested shell.'); }
function endGame(reason) {
  state.phase = 'results';
  if (state.score > state.best) { state.best = state.score; localStorage.setItem('day026-best', String(state.best)); }
  if (state.grand && (!state.bestTime || state.elapsed < Number(state.bestTime))) { localStorage.setItem('day026-best-time', String(Math.round(state.elapsed))); }
  updateUI(reason);
  showOverlay('results');
}

function currentChapter() { return chapters[Math.min(state.chapter, chapters.length - 1)]; }
function currentShell() { return shells[state.shellIndex]; }
function currentFuse() { return fuseModes[state.fuseIndex]; }
function setShell(index) { state.shellIndex = (index + shells.length) % shells.length; updateUI(`${currentShell().name} shell selected: ${currentShell().role}.`); }
function cycleShell() { setShell(state.shellIndex + 1); }
function cycleFuse() { state.fuseIndex = (state.fuseIndex + 1) % fuseModes.length; updateUI(`${currentFuse().name} fuse selected.`); }
function aim(dx, dy) {
  state.angleX = THREE.MathUtils.clamp(state.angleX + dx, -0.75, 0.75);
  state.angleY = THREE.MathUtils.clamp(state.angleY + dy, 0.34, 0.98);
  updateUI(`Aim ${Math.round(state.angleX * 42)}° horizontal · ${Math.round(state.angleY * 62)}° elevation.`);
}
function clearShellTrail() { while (shellTrail?.children.length) shellTrail.remove(shellTrail.children[0]); }

function launch(power = 0.62) {
  if (state.phase !== 'running' || activeShell) return;
  ensureAudio();
  const shell = currentShell();
  const speed = 9 + power * 8;
  const dir = new THREE.Vector3(Math.sin(state.angleX) * 0.56, Math.sin(state.angleY), -Math.cos(state.angleX)).normalize();
  activeShell = {
    pos: new THREE.Vector3(0, 0.04, 3.1),
    vel: dir.multiplyScalar(speed),
    age: 0,
    burstAt: currentFuse().t * (1.18 + (1 - power) * 0.42),
    shell,
    power,
    hitRings: 0,
    slow: state.focusActive > 0
  };
  shellMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 12), new THREE.MeshBasicMaterial({ color: shell.color }));
  shellMesh.position.copy(activeShell.pos);
  scene.add(shellMesh);
  state.launches += 1;
  state.fan = Math.min(100, state.fan + 12);
  launchSound(power);
  updateUI(`${shell.name} shell launched. Time the ${currentFuse().name.toLowerCase()} fuse.`);
}
function burstShell() {
  if (!activeShell) return;
  const p = activeShell.pos.clone();
  const shell = activeShell.shell;
  const chapter = currentChapter();
  const requested = chapter.targetShells[state.chapterShellProgress % chapter.targetShells.length];
  let nearest = Infinity;
  targets.forEach((target) => { nearest = Math.min(nearest, target.position.distanceTo(p)); });
  const goodLane = nearest < (shell.key === 'magenta' ? 1.35 : 1.05);
  const goodColor = shell.key === requested;
  const altitudeOk = p.y > 4.1 && p.y < 9.8 && p.z < -5.2;
  const ok = goodLane && goodColor && altitudeOk;
  const radius = shell.key === 'magenta' ? 1.35 : shell.key === 'white' ? 1.05 : 0.92;
  createBurst(p, shell.color, radius, ok);
  burstSound(ok);
  if (ok) {
    state.accurateBursts += 1;
    state.chapterShellProgress += 1;
    state.score += Math.round((150 + activeShell.hitRings * 110 + (goodLane ? 210 : 0)) * state.combo);
    state.combo = Math.min(6, state.combo + 0.25 + activeShell.hitRings * 0.04);
    state.focus = Math.min(100, state.focus + 22 + activeShell.hitRings * 5);
    state.smoke = Math.max(0, state.smoke - (shell.key === 'cyan' ? 10 : 2));
    updateUI(`Clean ${shell.name} burst! Combo climbing.`);
  } else {
    state.misfires += 1;
    state.combo = Math.max(1, state.combo * 0.72);
    state.smoke = Math.min(100, state.smoke + (shell.key === 'magenta' ? 16 : 10));
    if (state.smoke > 72 || !altitudeOk) state.safety -= 1;
    updateUI(goodColor ? 'Wrong altitude/depth. Adjust fuse and aim.' : `Color order wants ${requested.toUpperCase()} next.`);
  }
  scene.remove(shellMesh); shellMesh = null; activeShell = null; clearShellTrail(); checkProgress();
}
function createBurst(pos, color, radius, ok) {
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: ok ? 0.95 : 0.5 });
  for (let i = 0; i < (ok ? 42 : 18); i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(ok ? 0.055 : 0.04, 8, 6), mat.clone());
    m.position.copy(pos);
    const dir = new THREE.Vector3(Math.random() - .5, Math.random() - .2, Math.random() - .5).normalize().multiplyScalar(radius * (0.6 + Math.random() * 1.2));
    m.userData = { vel: dir, life: 1.0 + Math.random() * .55 };
    burstGroup.add(m); burstParticles.push(m);
  }
}
function useFan() {
  if (state.phase !== 'running' || state.fan < 35) return;
  ensureAudio(); state.fan -= 35; state.smoke = Math.max(0, state.smoke - 18); fanSound();
  smokeClouds.forEach((cloud, i) => { cloud.position.x += i % 2 ? 0.45 : -0.45; cloud.material.opacity = Math.max(0.08, cloud.material.opacity - 0.09); });
  if (activeShell) activeShell.vel.x += 0.8 * Math.sign(state.angleX || 1);
  state.score += 140; updateUI('Wind Fan cleared a smoke ribbon. Watch shell drift.');
}
function useFocus() {
  if (state.phase !== 'running' || state.focus < 60) return;
  ensureAudio(); state.focus -= 60; state.focusActive = 4.2; beep(880, .14, 'triangle', .035); setTimeout(() => beep(1180, .18, 'sine', .025), 100); updateUI('Slow Fuse active: arc and burst timing are easier to read.');
}
function checkProgress() {
  const ch = currentChapter();
  const completeShells = state.chapterShellProgress >= ch.targetShells.length;
  if (completeShells && state.ringCount >= ch.rings && state.smoke <= ch.smokeLimit && state.score >= Math.min(ch.score, state.score + 1)) {
    state.score += 700;
    state.safety = Math.min(3, state.safety + 1);
    state.chapter += 1;
    state.chapterShellProgress = 0;
    state.ringCount = 0;
    buildSkyObjects();
    if (state.chapter >= chapters.length && state.score >= 4000 && !state.grand) {
      state.grand = true;
      state.score += 1600;
      createBurst(new THREE.Vector3(0, 7.8, -12), 0xffd66b, 2.4, true);
      createBurst(new THREE.Vector3(-1.4, 6.8, -10), 0x42e7ff, 2.0, true);
      createBurst(new THREE.Vector3(1.4, 7.2, -11), 0xff4fb8, 2.1, true);
      updateUI('Natsu Grand Hanabi! Endless crest commissions unlocked.');
    } else {
      updateUI(`${currentChapter().name} unlocked. Lanterns brighten along the river.`);
    }
  }
  if (state.safety <= 0 || state.smoke >= 100) endGame(state.safety <= 0 ? 'All safety lanterns went dark.' : 'Smoke filled the summer sky.');
}

function updateUI(message) {
  const ch = currentChapter();
  const shell = currentShell();
  const fuse = currentFuse();
  ui.score.textContent = state.score;
  ui.best.textContent = Math.max(state.best, state.score);
  ui.safety.textContent = '◆'.repeat(Math.max(0, state.safety)) + '◇'.repeat(Math.max(0, 3 - state.safety));
  ui.smoke.textContent = `${Math.round(state.smoke)}%`;
  ui.combo.textContent = `×${state.combo.toFixed(1)}`;
  ui.shellName.textContent = shell.name;
  ui.fuseName.textContent = fuse.name;
  ui.time.textContent = formatTime(state.elapsed);
  ui.chapterEyebrow.textContent = ch.name;
  ui.missionText.textContent = ch.text;
  ui.orderText.textContent = ch.targetShells.map((s, i) => i < state.chapterShellProgress ? '✓' : s[0].toUpperCase() + s.slice(1)).join(' · ');
  ui.ringText.textContent = `${state.ringCount}/${ch.rings} rings`;
  ui.fanCharge.textContent = `${Math.round(state.fan)}%`;
  ui.focusCharge.textContent = `${Math.round(state.focus)}%`;
  ui.statusLine.textContent = message || `Next: ${ch.targetShells[state.chapterShellProgress % ch.targetShells.length].toUpperCase()} shell · ${fuse.name} fuse · smoke ${Math.round(state.smoke)}%.`;
  ui.stageLabel.textContent = `Aim ${Math.round(state.angleX * 42)}° · elevation ${Math.round(state.angleY * 62)}° · ${shell.name} / ${fuse.name}`;
  const x = 50 + state.angleX * 25;
  const y = 58 - state.angleY * 30;
  ui.reticle.style.left = `${x}%`; ui.reticle.style.top = `${y}%`; ui.reticle.style.borderColor = `#${shell.color.toString(16).padStart(6, '0')}`;
  $('fanBtn').disabled = state.fan < 35;
  $('focusBtn').disabled = state.focus < 60;
}
function formatTime(sec) { const s = Math.max(0, Math.floor(sec)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const rawDt = Math.min(0.05, (now - lastTime) / 1000); lastTime = now;
  const dt = state.phase === 'running' ? rawDt * (state.focusActive > 0 ? 0.48 : 1) : rawDt;
  if (!renderer) return;
  tubePivot.rotation.y = state.angleX;
  tubePivot.rotation.x = -state.angleY + 0.55;
  rings.forEach((r, i) => { r.rotation.z += rawDt * (0.22 + i * .04); r.material.opacity = r.userData.hit ? 0.16 : 0.45 + Math.sin(now * .002 + i) * .08; });
  targets.forEach((t, i) => { t.position.x = t.userData.baseX + Math.sin(now * .0013 + i) * 0.38; t.rotation.y += rawDt * .8; });
  smokeClouds.forEach((s, i) => { s.rotation.y += rawDt * .18; s.position.y += Math.sin(now * .0008 + i) * .0015; });
  if (state.phase === 'running') {
    state.elapsed = (performance.now() - state.startedAt) / 1000;
    state.fan = Math.min(100, state.fan + rawDt * 2.2);
    state.focusActive = Math.max(0, state.focusActive - rawDt);
    state.smoke = Math.min(100, state.smoke + rawDt * (state.chapter + 0.55) * 0.12);
    if (activeShell) updateShell(dt);
    if (state.elapsed > 300 && !state.grand) endGame('The commission timer expired before Grand Hanabi.');
  }
  for (let i = burstParticles.length - 1; i >= 0; i--) {
    const p = burstParticles[i];
    p.userData.life -= rawDt;
    p.position.addScaledVector(p.userData.vel, rawDt);
    p.userData.vel.multiplyScalar(0.985);
    p.material.opacity = Math.max(0, p.userData.life);
    if (p.userData.life <= 0) { burstGroup.remove(p); burstParticles.splice(i, 1); }
  }
  if (Math.floor(now / 250) !== Math.floor((now - rawDt * 1000) / 250)) updateUI();
  renderer.render(scene, camera);
}
function updateShell(dt) {
  activeShell.age += dt;
  activeShell.vel.y -= 5.5 * dt;
  activeShell.vel.x += Math.sin(activeShell.age * 2.5) * 0.035 * (state.chapter + 1);
  activeShell.pos.addScaledVector(activeShell.vel, dt);
  shellMesh.position.copy(activeShell.pos);
  if (Math.random() < 0.45) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 4), new THREE.MeshBasicMaterial({ color: activeShell.shell.color, transparent: true, opacity: 0.55 }));
    dot.position.copy(activeShell.pos); dot.userData = { born: performance.now() };
    shellTrail.add(dot);
    if (shellTrail.children.length > 42) shellTrail.remove(shellTrail.children[0]);
  }
  rings.forEach((ring) => {
    if (!ring.userData.hit && ring.position.distanceTo(activeShell.pos) < 0.82) {
      ring.userData.hit = true; activeShell.hitRings += 1; state.ringCount += 1; state.score += Math.round(110 * state.combo); state.combo = Math.min(6, state.combo + 0.12); state.focus = Math.min(100, state.focus + 7); beep(720 + state.ringCount * 30, .06, 'triangle', .025); updateUI('Sky ring threaded cleanly.');
    }
  });
  if (activeShell.age >= activeShell.burstAt || activeShell.pos.y < -1 || activeShell.pos.z < -22) burstShell();
}

function wireControls() {
  ui.startBtn.addEventListener('click', startGame);
  ui.resumeBtn.addEventListener('click', resumeGame);
  ui.overlayRestartBtn.addEventListener('click', startGame);
  $('pauseBtn').addEventListener('click', () => state.phase === 'paused' ? resumeGame() : pauseGame());
  $('restartBtn').addEventListener('click', startGame);
  $('aimLeft').addEventListener('click', () => aim(-0.09, 0));
  $('aimRight').addEventListener('click', () => aim(0.09, 0));
  $('aimUp').addEventListener('click', () => aim(0, 0.06));
  $('aimDown').addEventListener('click', () => aim(0, -0.06));
  $('shellBtn').addEventListener('click', cycleShell);
  $('fuseBtn').addEventListener('click', cycleFuse);
  $('fanBtn').addEventListener('click', useFan);
  $('focusBtn').addEventListener('click', useFocus);
  const launchBtn = $('launchBtn');
  launchBtn.addEventListener('pointerdown', (ev) => { if (state.phase !== 'running') return; ensureAudio(); charging = true; chargeStart = performance.now(); launchBtn.setPointerCapture?.(ev.pointerId); updateUI('Charging launch power… release to fire.'); });
  launchBtn.addEventListener('pointerup', () => { if (!charging) return; const p = THREE.MathUtils.clamp((performance.now() - chargeStart) / 950, 0.28, 1); charging = false; launch(p); });
  launchBtn.addEventListener('click', () => { if (!activeShell && !charging && state.phase === 'running') launch(0.58); });
  canvas.addEventListener('pointerdown', (ev) => { dragStart = { x: ev.clientX, y: ev.clientY, ax: state.angleX, ay: state.angleY }; });
  canvas.addEventListener('pointermove', (ev) => { if (!dragStart || state.phase !== 'running') return; const rect = canvas.getBoundingClientRect(); state.angleX = THREE.MathUtils.clamp(dragStart.ax + (ev.clientX - dragStart.x) / rect.width * 1.3, -0.75, 0.75); state.angleY = THREE.MathUtils.clamp(dragStart.ay - (ev.clientY - dragStart.y) / rect.height * 1.2, 0.34, 0.98); updateUI('Drag aiming the launch tube.'); });
  window.addEventListener('pointerup', () => { dragStart = null; });
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && state.phase === 'menu') return startGame();
    if (ev.key.toLowerCase() === 'p') return state.phase === 'paused' ? resumeGame() : pauseGame();
    if (ev.key.toLowerCase() === 'r') return startGame();
    if (state.phase !== 'running') return;
    if (ev.key === 'ArrowLeft' || ev.key.toLowerCase() === 'a') aim(-0.09, 0);
    if (ev.key === 'ArrowRight' || ev.key.toLowerCase() === 'd') aim(0.09, 0);
    if (ev.key === 'ArrowUp' || ev.key.toLowerCase() === 'w') aim(0, 0.06);
    if (ev.key === 'ArrowDown' || ev.key.toLowerCase() === 's') aim(0, -0.06);
    if (ev.key === ' ') { ev.preventDefault(); launch(0.66); }
    if (['1','2','3','4'].includes(ev.key)) setShell(Number(ev.key) - 1);
    if (ev.key.toLowerCase() === 'f') cycleFuse();
    if (ev.key.toLowerCase() === 'w') useFan();
    if (ev.key === 'Shift' || ev.key.toLowerCase() === 'b') useFocus();
  });
}

initThree();
wireControls();
updateUI('Press Start. The tanuki will light the first fuse after your gesture.');
showOverlay('menu');
animate();
