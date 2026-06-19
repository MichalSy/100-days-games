import * as THREE from './assets/three.module.js';

const PITCHES = [
  { id: 'blue', short: 'Blue', label: 'Blue LOW', height: 'LOW', color: 0x2db7ff, css: '#2db7ff', y: -0.55, icon: '🔵' },
  { id: 'amber', short: 'Amber', label: 'Amber MID', height: 'MID', color: 0xffb14b, css: '#ffb14b', y: 0.15, icon: '🟠' },
  { id: 'silver', short: 'Silver', label: 'Silver HIGH', height: 'HIGH', color: 0xdfefff, css: '#dfefff', y: 0.88, icon: '⚪' }
];
const HEIGHT_INDEX = { LOW: -1, MID: 0, HIGH: 1 };
const COMMISSIONS = [
  { name: 'Porch Breeze', active: 3, crow: false, interval: 5200, sequence: [['blue','LOW'], ['amber','MID'], ['silver','HIGH']] },
  { name: 'Lantern Eaves', active: 5, crow: true, interval: 4300, sequence: [['amber','MID'], ['blue','LOW'], ['silver','HIGH'], ['blue','LOW'], ['amber','MID']] },
  { name: 'Storm-Calm Finale', active: 7, crow: true, interval: 3500, sequence: [['silver','HIGH'], ['blue','LOW'], ['amber','MID'], ['silver','HIGH'], ['amber','MID'], ['blue','LOW'], ['silver','HIGH']] }
];
const BELL_LAYOUT = [
  { name: 'Aoi', pos: [-2.25, -0.55, 0.95], yaw: -Math.PI / 2, tilt: -1, pitch: 0 },
  { name: 'Kohaku', pos: [-0.78, 0.12, 0.15], yaw: -Math.PI / 2, tilt: 0, pitch: 1 },
  { name: 'Gin', pos: [0.76, 0.86, -0.72], yaw: -Math.PI / 2, tilt: 1, pitch: 2 },
  { name: 'Mizu', pos: [2.05, -0.48, -1.05], yaw: -Math.PI / 2, tilt: -1, pitch: 0 },
  { name: 'Akari', pos: [1.28, 0.28, 0.82], yaw: -Math.PI / 2, tilt: 0, pitch: 1 },
  { name: 'Shiro', pos: [-1.65, 0.96, -0.88], yaw: -Math.PI / 2, tilt: 1, pitch: 2 },
  { name: 'Yoru', pos: [0.05, -0.22, 1.34], yaw: -Math.PI / 2, tilt: -1, pitch: 0 }
];
const STORAGE = 'day010-kaze-windbell-atelier';
const dom = Object.fromEntries([
  'scoreText','bestText','bellsText','stormText','comboText','timeText','chapterText','routeText','sequenceChips','resonanceMeter','windowMeter','helper','grandBanner','menuOverlay','pauseOverlay','resultsOverlay','menuBest','resultTitle','resultStats','badgeList','pulseButton','startButton','pauseButton','restartButton','resumeButton','pauseRestart','resultRestart','selectPrev','rotateLeft','rotateRight','tiltHigh','tiltLow','pitchCycle'
].map((id) => [id, document.getElementById(id)]));

let renderer, scene, camera, raycaster, pointer;
let lastFrameTime = performance.now();
const bells = [];
const gusts = [];
const charms = [];
const crows = [];
const sparklePool = [];
let selected = 0;
let state = 'menu';
let runStart = 0;
let elapsed = 0;
let score = 0;
let combo = 0;
let storm = 0;
let cracks = 0;
let commissionIndex = 0;
let sequenceIndex = 0;
let lastGust = 0;
let lastCrow = 0;
let lastCharm = 0;
let resonance = 0;
let pulseUntil = 0;
let grandChime = false;
let grandBannerUntil = 0;
let perfectCommission = true;
let perfectStreak = 0;
let bestPerfectStreak = 0;
let crowsCalmed = 0;
let endlessWave = 0;
let completedCommissions = 0;
const saved = loadSave();
const audio = {
  ctx: null,
  master: null,
  enabled: false
};
window.__day010Audio = audio;

function ensureAudio() {
  if (audio.ctx) {
    if (audio.ctx.state === 'suspended') audio.ctx.resume().catch(() => {});
    audio.enabled = true;
    return;
  }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  audio.ctx = new AudioCtx();
  audio.master = audio.ctx.createGain();
  audio.master.gain.value = 0.18;
  audio.master.connect(audio.ctx.destination);
  audio.enabled = true;
}

function playTone(freq, duration = 0.28, type = 'sine', gain = 0.1, when = 0) {
  if (!audio.enabled || !audio.ctx || !audio.master) return;
  const now = audio.ctx.currentTime + when;
  const osc = audio.ctx.createOscillator();
  const amp = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), now + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp).connect(audio.master);
  osc.start(now);
  osc.stop(now + duration + 0.04);
}

function playChime(pitchIndex, success = true) {
  const base = [392, 523, 659][pitchIndex] || 440;
  if (success) {
    playTone(base, 0.42, 'sine', 0.095);
    playTone(base * 2, 0.34, 'triangle', 0.045, 0.035);
    playTone(base * 2.5, 0.22, 'sine', 0.028, 0.08);
  } else {
    playTone(base * 0.72, 0.24, 'sawtooth', 0.055);
    playTone(130, 0.28, 'square', 0.035, 0.04);
  }
}

function playWind(duration = 0.5, gain = 0.08, filterFreq = 520) {
  if (!audio.enabled || !audio.ctx || !audio.master) return;
  const now = audio.ctx.currentTime;
  const buffer = audio.ctx.createBuffer(1, Math.max(1, audio.ctx.sampleRate * duration), audio.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const fade = 1 - i / data.length;
    data[i] = (Math.random() * 2 - 1) * fade * fade;
  }
  const source = audio.ctx.createBufferSource();
  const filter = audio.ctx.createBiquadFilter();
  const amp = audio.ctx.createGain();
  source.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;
  filter.Q.value = 1.6;
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filter).connect(amp).connect(audio.master);
  source.start(now);
}

init();

function init() {
  initThree();
  bindControls();
  setMenuBest();
  resetRun(false);
  requestAnimationFrame(loop);
}

function initThree() {
  const canvas = document.getElementById('gameCanvas');
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0d3043, 0.065);
  camera = new THREE.PerspectiveCamera(47, 1, 0.1, 100);
  camera.position.set(0, 2.25, 7.3);
  camera.lookAt(0, 0.05, 0);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  scene.add(new THREE.HemisphereLight(0xb8f6ff, 0x372314, 2.0));
  const key = new THREE.DirectionalLight(0xffda8d, 2.3);
  key.position.set(2.5, 4, 3.5);
  scene.add(key);
  const fill = new THREE.PointLight(0x4fdcff, 3, 11);
  fill.position.set(-3, 1.5, 3);
  scene.add(fill);

  addAtelierFrame();
  BELL_LAYOUT.forEach((data, i) => bells.push(createBell(data, i)));
  createLanterns();
  selectBell(0);
  resize();
  window.addEventListener('resize', resize);
  canvas.addEventListener('pointerdown', onPointerDown);
}

function addAtelierFrame() {
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a4d2b, roughness: 0.72 });
  const railGeo = new THREE.BoxGeometry(6.3, 0.16, 0.18);
  for (let i = 0; i < 3; i++) {
    const rail = new THREE.Mesh(railGeo, wood);
    rail.position.set(0, 1.92 - i * 0.16, -1.15 + i * 1.1);
    rail.rotation.z = -0.02;
    scene.add(rail);
  }
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(3.55, 3.95, 0.12, 48), new THREE.MeshStandardMaterial({ color: 0x314452, roughness: 0.9, metalness: 0.05 }));
  floor.position.set(0, -1.76, 0.15);
  floor.scale.z = 0.45;
  scene.add(floor);
  const source = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.55, 24), new THREE.MeshStandardMaterial({ color: 0x8bf3ff, emissive: 0x1da1bb, emissiveIntensity: 0.8 }));
  cone.rotation.z = -Math.PI / 2;
  source.add(cone);
  source.position.set(-4.0, 0.08, 0.25);
  scene.add(source);
}

function createLanterns() {
  const mat = new THREE.MeshStandardMaterial({ color: 0xffd47b, emissive: 0xff9f3d, emissiveIntensity: 1.25, roughness: 0.35 });
  [['LOW', -0.68], ['MID', 0.1], ['HIGH', 0.9]].forEach(([label, y], i) => {
    const group = new THREE.Group();
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.48, 18), mat);
    group.add(lantern);
    group.position.set(3.75, y, -0.8 + i * 0.8);
    scene.add(group);
  });
}

function createBell(data, id) {
  const group = new THREE.Group();
  group.position.set(...data.pos);
  group.userData.bellId = id;
  const pitch = PITCHES[data.pitch];
  const glass = new THREE.MeshPhysicalMaterial({ color: pitch.color, transparent: true, opacity: 0.34, roughness: 0.08, metalness: 0, transmission: 0.45, thickness: 0.2, emissive: pitch.color, emissiveIntensity: 0.04 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xffd475, metalness: 0.55, roughness: 0.35 });
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.15, 8), new THREE.MeshStandardMaterial({ color: 0xdec899 }));
  cord.position.y = 0.58;
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.76), glass);
  body.scale.y = 0.9;
  body.userData.bellId = id;
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 10, 32), metal);
  mouth.position.y = -0.17;
  mouth.rotation.x = Math.PI / 2;
  const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), metal);
  clapper.position.y = -0.22;
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.62), new THREE.MeshStandardMaterial({ color: pitch.color, transparent: true, opacity: 0.88, roughness: 0.5, side: THREE.DoubleSide }));
  paper.position.y = -0.64;
  paper.rotation.x = -0.1;
  const arrowMat = new THREE.MeshStandardMaterial({ color: 0x9ff6ff, emissive: 0x3bdfff, emissiveIntensity: 0.9 });
  const guide = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.62, 10), arrowMat);
  stem.rotation.z = Math.PI / 2;
  stem.position.x = -0.31;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 18), arrowMat);
  tip.rotation.z = Math.PI / 2;
  tip.position.x = -0.68;
  guide.add(stem, tip);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.018, 8, 56), new THREE.MeshBasicMaterial({ color: 0xffdf72, transparent: true, opacity: 0 }));
  halo.rotation.x = Math.PI / 2;
  const label = makeLabel(`${data.name}\n${pitch.short}`);
  label.position.set(0, -1.08, 0);
  group.add(cord, body, mouth, clapper, paper, guide, halo, label);
  scene.add(group);
  const bell = { id, name: data.name, group, body, paper, guide, halo, label, yaw: data.yaw, tilt: data.tilt, pitchIndex: data.pitch, crack: 0, available: true, ringUntil: 0, previewUntil: 0 };
  updateBellVisual(bell);
  return bell;
}

function makeLabel(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(4,18,30,.82)';
  roundRect(ctx, 18, 14, 220, 88, 22); ctx.fill();
  ctx.fillStyle = '#eaffff'; ctx.font = '700 30px system-ui'; ctx.textAlign = 'center';
  const lines = text.split('\n');
  ctx.fillText(lines[0], 128, 50); ctx.font = '800 24px system-ui'; ctx.fillText(lines[1] || '', 128, 82);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.scale.set(0.72, 0.36, 1);
  return sprite;
}

function updateLabel(bell) {
  const old = bell.label;
  const next = makeLabel(`${bell.name}\n${PITCHES[bell.pitchIndex].short}`);
  next.position.copy(old.position);
  bell.group.remove(old);
  bell.group.add(next);
  bell.label = next;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function updateBellVisual(bell) {
  const pitch = PITCHES[bell.pitchIndex];
  bell.body.material.color.setHex(pitch.color);
  bell.body.material.emissive.setHex(pitch.color);
  bell.paper.material.color.setHex(pitch.color);
  bell.guide.rotation.y = bell.yaw;
  bell.guide.rotation.z = bell.tilt * -0.32;
  const scale = bell.available ? 1 : 0.001;
  bell.group.visible = bell.available;
  bell.halo.material.opacity = bell.id === selected ? 0.75 : (performance.now() < bell.previewUntil ? 0.5 : 0);
}

function bindControls() {
  dom.startButton.addEventListener('click', startGame);
  dom.pauseButton.addEventListener('click', togglePause);
  dom.restartButton.addEventListener('click', () => startGame());
  dom.resumeButton.addEventListener('click', togglePause);
  dom.pauseRestart.addEventListener('click', () => startGame());
  dom.resultRestart.addEventListener('click', () => startGame());
  dom.selectPrev.addEventListener('click', () => selectBell((selected + 1) % activeCount()));
  dom.rotateLeft.addEventListener('click', () => rotateSelected(-1));
  dom.rotateRight.addEventListener('click', () => rotateSelected(1));
  dom.tiltHigh.addEventListener('click', () => tiltSelected(1));
  dom.tiltLow.addEventListener('click', () => tiltSelected(-1));
  dom.pitchCycle.addEventListener('click', () => cyclePitch(1));
  dom.pulseButton.addEventListener('click', triggerPulse);
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(event.code)) event.preventDefault();
    if (state === 'menu' && ['Space','Enter'].includes(event.code)) return startGame();
    if (event.code === 'KeyP') return togglePause();
    if (event.code === 'KeyR') return startGame();
    if (state !== 'running') return;
    if (event.code === 'KeyA' || event.code === 'ArrowLeft') rotateSelected(-1);
    if (event.code === 'KeyD' || event.code === 'ArrowRight') rotateSelected(1);
    if (event.code === 'KeyW' || event.code === 'ArrowUp') tiltSelected(1);
    if (event.code === 'KeyS' || event.code === 'ArrowDown') tiltSelected(-1);
    if (event.code === 'KeyQ') selectBell((selected + activeCount() - 1) % activeCount());
    if (event.code === 'KeyE') selectBell((selected + 1) % activeCount());
    if (event.code === 'KeyZ' || event.code === 'Digit1') setPitch(0);
    if (event.code === 'KeyX' || event.code === 'Digit2') setPitch(1);
    if (event.code === 'KeyC' || event.code === 'Digit3') setPitch(2);
    if (event.code === 'Space' || event.code === 'Enter') triggerPulse();
  });
}

function onPointerDown(event) {
  if (!['running','paused'].includes(state)) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(bells.filter((b) => b.available).map((b) => b.body), false);
  if (hits.length && typeof hits[0].object.userData.bellId === 'number') selectBell(hits[0].object.userData.bellId);
}

function startGame() {
  ensureAudio();
  playWind(0.42, 0.055, 760);
  playTone(392, 0.22, 'triangle', 0.07);
  playTone(523, 0.26, 'triangle', 0.06, 0.06);
  resetRun(true);
  state = 'running';
  runStart = performance.now();
  lastGust = performance.now() - 1600;
  dom.menuOverlay.classList.add('hidden');
  dom.pauseOverlay.classList.add('hidden');
  dom.resultsOverlay.classList.add('hidden');
}

function resetRun(full) {
  score = 0; combo = 0; storm = 0; cracks = 0; commissionIndex = 0; sequenceIndex = 0; resonance = 18; pulseUntil = 0; grandChime = false; grandBannerUntil = 0; perfectCommission = true; perfectStreak = 0; bestPerfectStreak = 0; crowsCalmed = 0; endlessWave = 0; completedCommissions = 0; elapsed = 0;
  bells.forEach((bell, i) => { Object.assign(bell, { yaw: BELL_LAYOUT[i].yaw, tilt: BELL_LAYOUT[i].tilt, pitchIndex: BELL_LAYOUT[i].pitch, crack: 0, available: i < activeCount() }); updateLabel(bell); updateBellVisual(bell); });
  clearMoving(gusts); clearMoving(charms); clearMoving(crows); selectBell(0);
  updateHUD();
  renderSequence();
}

function clearMoving(list) { while (list.length) { const item = list.pop(); scene.remove(item.group || item.mesh || item.line); } }
function activeCount() { return currentCommission().active || Math.min(7, 4 + endlessWave); }
function currentCommission() { return COMMISSIONS[commissionIndex] || makeEndlessCommission(); }
function makeEndlessCommission() {
  const seq = [];
  for (let i = 0; i < 5 + Math.min(4, endlessWave); i++) {
    const p = PITCHES[(i + endlessWave) % 3]; seq.push([p.id, p.height]);
  }
  return { name: `Endless Twilight ${endlessWave + 1}`, active: 7, crow: true, interval: Math.max(2400, 3400 - endlessWave * 120), sequence: seq };
}

function selectBell(id) {
  selected = Math.max(0, Math.min(id, activeCount() - 1));
  bells.forEach(updateBellVisual);
  updateHelper();
}

function rotateSelected(dir) {
  const bell = bells[selected];
  bell.yaw = clampAngle(bell.yaw + dir * Math.PI / 6);
  updateBellVisual(bell); updateHelper();
}
function tiltSelected(dir) { const bell = bells[selected]; bell.tilt = Math.max(-1, Math.min(1, bell.tilt + dir)); updateBellVisual(bell); updateHelper(); }
function cyclePitch(dir) { setPitch((bells[selected].pitchIndex + dir + 3) % 3); }
function setPitch(index) { const bell = bells[selected]; bell.pitchIndex = index; updateLabel(bell); updateBellVisual(bell); updateHelper(); }
function clampAngle(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }

function togglePause() {
  if (state === 'running') { state = 'paused'; dom.pauseOverlay.classList.remove('hidden'); }
  else if (state === 'paused') { state = 'running'; dom.pauseOverlay.classList.add('hidden'); lastGust = performance.now(); }
}

function triggerPulse() {
  if (resonance < 100 || state !== 'running') return;
  resonance = 0; pulseUntil = performance.now() + 6200;
  playWind(0.85, 0.11, 920);
  playTone(784, 0.4, 'sine', 0.08);
  playTone(1175, 0.46, 'sine', 0.045, 0.08);
  crows.forEach((crow) => { crow.scatter = true; crowsCalmed += 1; addScore(110); });
  previewIdealBell();
  spawnSparkle(new THREE.Vector3(0, 0.1, 0), 0xffe179, 38);
}

function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
  lastFrameTime = now;
  if (state === 'running') update(now, dt);
  animateScene(now, dt);
  renderer.render(scene, camera);
}

function update(now, dt) {
  elapsed = (now - runStart) / 1000;
  const commission = currentCommission();
  const slowed = now < pulseUntil ? 1.65 : 1;
  const interval = commission.interval * slowed;
  dom.windowMeter.value = Math.max(0, 100 - ((now - lastGust) / interval) * 100);
  if (now - lastGust > interval) { spawnGust(now); lastGust = now; }
  if (commission.crow && now - lastCrow > Math.max(4800, 11500 - elapsed * 18)) { spawnCrow(); lastCrow = now; }
  if (now - lastCharm > 7600) { spawnCharm(); lastCharm = now; }
  updateGusts(now, dt); updateCharms(now, dt); updateCrows(now, dt); updateSparkles(dt);
  if (storm >= 100 || cracks >= 3) finishRun(false);
  updateHUD();
}

function animateScene(now, dt) {
  bells.forEach((bell, i) => {
    if (!bell.available) return;
    const ringing = now < bell.ringUntil;
    bell.group.rotation.z = Math.sin(now * 0.014 + i) * (ringing ? 0.12 : 0.025);
    bell.group.position.y = BELL_LAYOUT[i].pos[1] + Math.sin(now * 0.0018 + i) * 0.025;
    bell.body.material.emissiveIntensity = ringing ? 0.42 : (now < bell.previewUntil ? 0.28 : 0.04);
    bell.halo.material.opacity = bell.id === selected ? 0.75 : (now < bell.previewUntil ? 0.5 : 0);
    bell.paper.rotation.z = Math.sin(now * 0.004 + i) * 0.15;
  });
  camera.position.x = Math.sin(now * 0.00035) * 0.16;
  camera.lookAt(0, 0.03, 0);
  if (now > grandBannerUntil) dom.grandBanner.classList.add('hidden');
}

function spawnGust(now) {
  const note = expectedNote();
  const result = findCatchBell(note);
  if (!result) {
    missGust('missed the open bell mouth');
    playWind(0.38, 0.075, 280);
    spawnGustVisual(null, note, false);
    return;
  }
  const bell = result.bell;
  const pitchOk = PITCHES[bell.pitchIndex].id === note.pitch;
  if (!pitchOk) {
    wrongPitch(bell);
    playChime(bell.pitchIndex, false);
    spawnGustVisual(bell, note, false);
    return;
  }
  bell.ringUntil = now + 900;
  playWind(0.26, 0.04, 880);
  playChime(bell.pitchIndex, true);
  spawnGustVisual(bell, note, true);
  spawnSparkle(bell.group.position, PITCHES[bell.pitchIndex].color, 16);
  addScore(60 * comboTier());
  combo += 1; perfectStreak += 1; bestPerfectStreak = Math.max(bestPerfectStreak, perfectStreak);
  collectNearbyCharms(bell.group.position);
  resonance = Math.min(100, resonance + 9);
  sequenceIndex += 1;
  if (sequenceIndex >= currentCommission().sequence.length) completeCommission();
  renderSequence(); updateHelper();
}

function expectedNote() {
  const entry = currentCommission().sequence[sequenceIndex] || currentCommission().sequence[0];
  return { pitch: entry[0], height: entry[1] };
}

function findCatchBell(note) {
  const source = sourcePositionFor(note);
  let best = null;
  bells.slice(0, activeCount()).forEach((bell) => {
    if (!bell.available) return;
    const bellPos = bell.group.position.clone();
    const toSource = source.clone().sub(bellPos).normalize();
    const mouth = new THREE.Vector3(Math.sin(bell.yaw), bell.tilt * 0.38, Math.cos(bell.yaw)).normalize();
    const facing = mouth.dot(toSource);
    const heightMatch = Math.abs(bell.tilt - HEIGHT_INDEX[note.height]);
    const pitchBias = PITCHES[bell.pitchIndex].id === note.pitch ? 0 : 1.3;
    const dist = Math.abs(bellPos.y - PITCHES.find((p) => p.height === note.height).y) + Math.abs(bellPos.z - source.z) * 0.28;
    const catchable = facing > 0.42 && heightMatch <= 0;
    if (catchable) {
      const scoreValue = dist + pitchBias - facing * 0.65;
      if (!best || scoreValue < best.scoreValue) best = { bell, scoreValue, facing };
    }
  });
  return best;
}

function sourcePositionFor(note) {
  const depth = ((commissionIndex + sequenceIndex) % 3 - 1) * 0.82;
  const y = PITCHES.find((p) => p.height === note.height).y;
  return new THREE.Vector3(-4.25, y, depth);
}

function spawnGustVisual(bell, note, success) {
  const source = sourcePositionFor(note);
  const color = success ? PITCHES.find((p) => p.id === note.pitch).color : 0xff6c8a;
  const points = [];
  if (bell) {
    const target = bell.group.position.clone();
    const outlet = target.clone().add(new THREE.Vector3(1.2, bell.tilt * 0.55, Math.sin(bell.yaw) * 0.55));
    const lantern = new THREE.Vector3(3.75, PITCHES.find((p) => p.height === note.height).y, target.z * 0.45);
    points.push(source, source.clone().lerp(target, 0.45).add(new THREE.Vector3(0, 0.35, 0.2)), target, outlet, lantern);
  } else {
    points.push(source, new THREE.Vector3(-1.2, source.y + 0.75, source.z + 0.2), new THREE.Vector3(2.6, source.y - 0.35, source.z - 0.4));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geom = new THREE.TubeGeometry(curve, 64, success ? 0.045 : 0.032, 8, false);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: success ? 0.78 : 0.46, blending: THREE.AdditiveBlending });
  const mesh = new THREE.Mesh(geom, mat);
  scene.add(mesh);
  gusts.push({ mesh, age: 0, life: success ? 1.1 : 0.75 });
}

function updateGusts(now, dt) {
  for (let i = gusts.length - 1; i >= 0; i--) {
    const gust = gusts[i]; gust.age += dt; gust.mesh.material.opacity *= 0.982; gust.mesh.rotation.z += dt * 0.18;
    if (gust.age > gust.life) { scene.remove(gust.mesh); gusts.splice(i, 1); }
  }
}

function spawnCharm() {
  const mat = new THREE.MeshStandardMaterial({ color: 0xfff1b4, emissive: 0xffbe5c, emissiveIntensity: 0.45, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.54), mat);
  mesh.position.set(3.2, -0.7 + Math.random() * 1.9, -1.25 + Math.random() * 2.5);
  scene.add(mesh);
  charms.push({ mesh, speed: 0.35 + Math.random() * 0.22, age: 0 });
}
function updateCharms(now, dt) {
  for (let i = charms.length - 1; i >= 0; i--) {
    const charm = charms[i]; charm.age += dt; charm.mesh.position.x -= charm.speed * dt; charm.mesh.position.y += Math.sin(now * 0.003 + i) * dt * 0.16; charm.mesh.rotation.z = Math.sin(now * 0.004 + i) * 0.28;
    if (charm.mesh.position.x < -4.2) { scene.remove(charm.mesh); charms.splice(i, 1); }
  }
}
function collectNearbyCharms(pos) {
  for (let i = charms.length - 1; i >= 0; i--) {
    if (charms[i].mesh.position.distanceTo(pos) < 1.35) {
      spawnSparkle(charms[i].mesh.position, 0xffd46b, 10); scene.remove(charms[i].mesh); charms.splice(i, 1); addScore(85); resonance = Math.min(100, resonance + 14);
    }
  }
}

function spawnCrow() {
  playTone(185, 0.11, 'sawtooth', 0.035);
  playTone(145, 0.16, 'sawtooth', 0.028, 0.08);
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.46, 5), new THREE.MeshStandardMaterial({ color: 0x151729, emissive: 0x34175c, emissiveIntensity: 0.45 }));
  body.rotation.z = Math.PI / 2;
  const wingGeo = new THREE.BoxGeometry(0.42, 0.045, 0.13);
  const wingA = new THREE.Mesh(wingGeo, body.material); wingA.rotation.z = 0.45;
  const wingB = new THREE.Mesh(wingGeo, body.material); wingB.rotation.z = -0.45;
  group.add(body, wingA, wingB);
  group.position.set(4.1, [-0.55, 0.15, 0.9][Math.floor(Math.random() * 3)], -1.1 + Math.random() * 2.2);
  scene.add(group);
  crows.push({ group, speed: 0.9 + elapsed * 0.006, scatter: false, hit: false });
}
function updateCrows(now, dt) {
  for (let i = crows.length - 1; i >= 0; i--) {
    const crow = crows[i]; crow.group.position.x += (crow.scatter ? 1.9 : -crow.speed) * dt; crow.group.position.y += Math.sin(now * 0.009 + i) * dt * 0.28; crow.group.rotation.z = Math.sin(now * 0.014 + i) * 0.25;
    if (!crow.scatter && !crow.hit) {
      const nearestCharm = charms.find((charm) => charm.mesh.position.distanceTo(crow.group.position) < 0.72);
      if (nearestCharm) { crow.hit = true; storm = Math.min(100, storm + 6); scene.remove(nearestCharm.mesh); charms.splice(charms.indexOf(nearestCharm), 1); }
      const rattled = bells.slice(0, activeCount()).find((bell) => bell.group.position.distanceTo(crow.group.position) < 0.45);
      if (rattled) { crow.hit = true; rattled.crack += 1; if (rattled.crack >= 2) cracks += 1; storm = Math.min(100, storm + 5); spawnSparkle(rattled.group.position, 0xff6c8a, 8); }
    }
    if (crow.group.position.x < -4.5 || crow.group.position.x > 5.2) { scene.remove(crow.group); crows.splice(i, 1); }
  }
}

function spawnSparkle(origin, color, count) {
  for (let i = 0; i < count; i++) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }));
    mesh.position.copy(origin);
    mesh.velocity = new THREE.Vector3((Math.random() - .5) * 1.7, (Math.random() - .1) * 1.55, (Math.random() - .5) * 1.25);
    scene.add(mesh); sparklePool.push({ mesh, life: 0.65 + Math.random() * 0.45 });
  }
}
function updateSparkles(dt) {
  for (let i = sparklePool.length - 1; i >= 0; i--) {
    const s = sparklePool[i]; s.life -= dt; s.mesh.position.addScaledVector(s.mesh.velocity, dt); s.mesh.material.opacity = Math.max(0, s.life);
    if (s.life <= 0) { scene.remove(s.mesh); sparklePool.splice(i, 1); }
  }
}

function wrongPitch(bell) {
  bell.crack += 1; if (bell.crack >= 2) cracks = Math.min(3, cracks + 1);
  storm = Math.min(100, storm + 5); combo = 0; perfectStreak = 0; perfectCommission = false; spawnSparkle(bell.group.position, 0xff6c8a, 14); updateHelper();
}
function missGust(reason) { storm = Math.min(100, storm + 8); combo = 0; perfectStreak = 0; perfectCommission = false; dom.helper.textContent = `Miss: ${reason}. Align yaw, height, and pitch before the next ribbon.`; }
function addScore(points) { score += Math.round(points); saved.bestScore = Math.max(saved.bestScore || 0, score); }
function comboTier() { return Math.min(3, 1 + Math.floor(combo / 5)); }

function completeCommission() {
  completedCommissions += 1;
  playTone(523, 0.18, 'triangle', 0.06);
  playTone(659, 0.2, 'triangle', 0.055, 0.08);
  playTone(784, 0.25, 'triangle', 0.05, 0.16);
  addScore(430 + (perfectCommission ? 240 : 0));
  if (perfectCommission) resonance = Math.min(100, resonance + 14);
  cracks = Math.max(0, cracks - 1);
  perfectCommission = true;
  sequenceIndex = 0;
  if (commissionIndex < COMMISSIONS.length - 1) commissionIndex += 1;
  else if (!grandChime && score >= 2700) triggerGrandChime();
  else { endlessWave += 1; commissionIndex = COMMISSIONS.length; }
  bells.forEach((bell, i) => { bell.available = i < activeCount(); updateBellVisual(bell); });
  if (selected >= activeCount()) selectBell(0);
  renderSequence();
}

function triggerGrandChime() {
  grandChime = true; grandBannerUntil = performance.now() + 3800; dom.grandBanner.classList.remove('hidden');
  [392, 523, 659, 784, 1046].forEach((freq, i) => playTone(freq, 0.55, 'sine', 0.07, i * 0.085));
  playWind(1.1, 0.1, 1100);
  addScore(900); resonance = 100; bells.forEach((bell) => bell.ringUntil = performance.now() + 2500); spawnSparkle(new THREE.Vector3(0, 0.2, 0), 0xffdf72, 80);
  if (!saved.bestGrandTime || elapsed < saved.bestGrandTime) saved.bestGrandTime = elapsed;
  endlessWave = 0; commissionIndex = COMMISSIONS.length;
}

function finishRun(won) {
  state = 'gameover';
  saved.bestScore = Math.max(saved.bestScore || 0, score);
  saved.bestStreak = Math.max(saved.bestStreak || 0, bestPerfectStreak);
  saved.endlessWave = Math.max(saved.endlessWave || 0, endlessWave);
  save(); setMenuBest();
  const badges = [];
  if (completedCommissions >= 1 && perfectCommission) badges.push('Porch Breeze clean craft');
  if (bestPerfectStreak >= 18) badges.push('18-note perfect flow');
  if (grandChime && elapsed <= 180) badges.push('Grand Chime under 180s');
  if (crowsCalmed >= 12) badges.push('Crow calmer');
  if (endlessWave > 0 && cracks === 0) badges.push('Uncracked twilight');
  dom.resultTitle.textContent = grandChime ? 'Kaze Grand Chime Echoes' : 'Storm at the Atelier';
  dom.resultStats.innerHTML = `<div>Final score: <strong>${score}</strong></div><div>Best score: <strong>${saved.bestScore || 0}</strong></div><div>Commission reached: <strong>${currentCommission().name}</strong></div><div>Perfect note streak: <strong>${bestPerfectStreak}</strong></div><div>Grand Chime: <strong>${grandChime ? 'yes' : 'not yet'}</strong></div>`;
  dom.badgeList.innerHTML = badges.length ? badges.map((b) => `<span>${b}</span>`).join('') : '<span>Keep tuning for mastery stamps</span>';
  dom.resultsOverlay.classList.remove('hidden');
}

function renderSequence() {
  const seq = currentCommission().sequence;
  dom.chapterText.textContent = currentCommission().name;
  dom.sequenceChips.innerHTML = seq.map(([pitch, height], i) => {
    const p = PITCHES.find((item) => item.id === pitch);
    return `<span class="chip ${i < sequenceIndex ? 'done' : ''} ${i === sequenceIndex ? 'current' : ''}"><span class="dot ${p.id}"></span>${p.short} ${height}</span>`;
  }).join('');
}

function updateHUD() {
  dom.scoreText.textContent = String(score);
  dom.bestText.textContent = String(Math.max(saved.bestScore || 0, score));
  dom.bellsText.textContent = `${Math.max(0, 7 - cracks)}/7`;
  dom.stormText.textContent = `${Math.round(storm)}%`;
  dom.comboText.textContent = `x${comboTier()}`;
  const min = Math.floor(elapsed / 60); const sec = Math.floor(elapsed % 60).toString().padStart(2, '0'); dom.timeText.textContent = `${min}:${sec}`;
  dom.resonanceMeter.value = resonance;
  dom.pulseButton.disabled = resonance < 100 || state !== 'running';
  dom.pulseButton.classList.toggle('ready', resonance >= 100);
}

function updateHelper() {
  const bell = bells[selected]; if (!bell) return;
  const note = expectedNote(); const p = PITCHES[bell.pitchIndex];
  const facing = findCatchBell(note)?.bell === bell;
  const yawDeg = Math.round(THREE.MathUtils.radToDeg(bell.yaw));
  dom.helper.innerHTML = `<strong>${bell.name}</strong> · ${p.label}<br>Yaw ${yawDeg}° · Tilt ${tiltLabel(bell.tilt)} · Crack ${bell.crack}/2<br>Next: ${PITCHES.find((x) => x.id === note.pitch).label} ${note.height} · ${facing ? 'likely catch' : 'needs angle/height'}`;
}
function tiltLabel(t) { return t < 0 ? 'LOW' : t > 0 ? 'HIGH' : 'MID'; }
function previewIdealBell() { const found = findCatchBell(expectedNote()); if (found) found.bell.previewUntil = performance.now() + 6200; else bells.slice(0, activeCount()).forEach((b) => b.previewUntil = performance.now() + 1500); }

function resize() {
  const rect = renderer.domElement.parentElement.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / Math.max(1, rect.height);
  camera.fov = rect.width < 520 ? 52 : 45;
  camera.updateProjectionMatrix();
}
function loadSave() { try { return JSON.parse(localStorage.getItem(STORAGE) || '{}'); } catch { return {}; } }
function save() { localStorage.setItem(STORAGE, JSON.stringify(saved)); }
function setMenuBest() { const time = saved.bestGrandTime ? `${Math.floor(saved.bestGrandTime)}s` : '--'; dom.menuBest.textContent = `Best score: ${saved.bestScore || 0} · Grand Chime: ${time} · Longest streak: ${saved.bestStreak || 0}`; }
