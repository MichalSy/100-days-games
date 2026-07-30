import * as THREE from './assets/three.module.min.js';

const $ = (id) => document.getElementById(id);
const on = (id, event, handler) => $(id)?.addEventListener(event, handler);
const fmt = (value) => `${Math.max(0, Math.min(100, Math.round(value)))}%`;
const bands = ['Lower', 'Middle', 'Upper'];
const facets = ['Front', 'Right', 'Back', 'Left'];
const lanterns = ['Left', 'Center', 'Right', 'High'];
const commissions = [
  {
    name: 'First Star Groove',
    text: 'Score two upper star grooves, cool below 55%, and catch one amber caustic on the rice-paper target.',
    targetGrooves: 3,
    targetCaustics: 2,
    band: 'Upper',
    minScore: 1500,
  },
  {
    name: 'Cobalt Fan Beam',
    text: 'Deepen cobalt fan grooves, polish two facets, shift the lantern, and catch moving caustics while heat stays calm.',
    targetGrooves: 5,
    targetCaustics: 4,
    band: 'Middle',
    minScore: 3600,
  },
  {
    name: 'Ruby Lantern Constellation',
    text: 'Use every tool: cut upper and lower facets, repair hairlines, route two beams, and finish with no wrong-band cuts.',
    targetGrooves: 7,
    targetCaustics: 6,
    band: 'Lower',
    minScore: 6200,
  },
];

const state = {
  running: false,
  paused: false,
  score: 0,
  best: Number(localStorage.getItem('day048-best') || 0),
  hearts: 3,
  heat: 12,
  crack: 0,
  polish: 82,
  combo: 1,
  focus: 38,
  bandIndex: 2,
  facetIndex: 0,
  lanternIndex: 1,
  grooves: 0,
  caustics: 0,
  wrongCuts: 0,
  commission: 0,
  elapsed: 0,
  blessing: false,
  muted: localStorage.getItem('day048-muted') === 'true',
  heatPulse: 0,
  crackFlash: 0,
  focusActive: false,
};

let audio = { ctx: null, enabled: false };
window.__day048Audio = audio;

const stage = $('stage');
if (stage?.tagName === 'CANVAS') {
  const div = document.createElement('div');
  div.id = 'stage';
  div.className = stage.className;
  div.setAttribute('aria-label', stage.getAttribute('aria-label') || '3D kiriko glass cutting stage');
  stage.replaceWith(div);
}
const stageEl = $('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
stageEl.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 1.3, 6.2);
const root = new THREE.Group();
scene.add(root);
scene.add(new THREE.AmbientLight(0x89a6d5, 1.45));
const keyLight = new THREE.PointLight(0xffc45a, 2.7, 18);
keyLight.position.set(2.6, 3.2, 4.2);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0x46c9ff, 1.5, 16);
rimLight.position.set(-3.2, 1.6, 3.5);
scene.add(rimLight);

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0x2467d8,
  roughness: 0.08,
  metalness: 0.02,
  transmission: 0.42,
  thickness: 0.55,
  transparent: true,
  opacity: 0.78,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
  side: THREE.DoubleSide,
});
const rubyMat = new THREE.MeshPhysicalMaterial({ color: 0xb91d4f, roughness: 0.1, metalness: 0, transparent: true, opacity: 0.72, clearcoat: 1, side: THREE.DoubleSide });
const glowMat = new THREE.MeshBasicMaterial({ color: 0xfff0a6, transparent: true, opacity: 0.9 });
const badMat = new THREE.MeshBasicMaterial({ color: 0xff3b48, transparent: true, opacity: 0.92 });
const focusMat = new THREE.MeshBasicMaterial({ color: 0x8ef6dc, transparent: true, opacity: 0.95 });

const cup = new THREE.Mesh(new THREE.CylinderGeometry(1.16, 0.92, 2.45, 12, 1, true), glassMat);
cup.rotation.z = 0.03;
root.add(cup);
const rimTop = new THREE.Mesh(new THREE.TorusGeometry(1.17, 0.032, 8, 48), glowMat);
rimTop.position.y = 1.22;
rimTop.rotation.x = Math.PI / 2;
root.add(rimTop);
const rimBottom = rimTop.clone();
rimBottom.position.y = -1.22;
rimBottom.scale.set(0.8, 0.8, 0.8);
root.add(rimBottom);

const facetLines = [];
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * Math.PI * 2;
  const pts = [];
  for (let y of [-1.05, -0.35, 0.35, 1.05]) {
    const r = 1.05 - Math.abs(y) * 0.05;
    pts.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
  }
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: i % 2 ? 0xd8f8ff : 0xffedf7, transparent: true, opacity: 0.55 }));
  root.add(line);
  facetLines.push(line);
}

const grooveGroup = new THREE.Group();
root.add(grooveGroup);
const crackGroup = new THREE.Group();
root.add(crackGroup);
const beamGroup = new THREE.Group();
scene.add(beamGroup);
const targetGroup = new THREE.Group();
scene.add(targetGroup);

const causticRings = [];
for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.016, 8, 40), new THREE.MeshBasicMaterial({ color: [0xffd86a, 0x8ef6dc, 0xff6f91][i], transparent: true, opacity: 0.76 }));
  ring.position.set(-1.7 + i * 1.7, -1.55, 0.3);
  ring.rotation.x = Math.PI / 2;
  targetGroup.add(ring);
  causticRings.push(ring);
}

function makeLine(a, b, color = 0xfff4be, opacity = 0.95) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([a, b]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  );
}

function addGroove(correct = true, deep = false) {
  const angle = (state.facetIndex / facets.length) * Math.PI * 2 + root.rotation.y;
  const yBase = [-0.72, 0, 0.72][state.bandIndex];
  const span = deep ? 0.42 : 0.28;
  const r = 1.12;
  const a = new THREE.Vector3(Math.cos(angle - 0.12) * r, yBase - span, Math.sin(angle - 0.12) * r);
  const b = new THREE.Vector3(Math.cos(angle + 0.14) * r, yBase + span, Math.sin(angle + 0.14) * r);
  const line = makeLine(a, b, correct ? (deep ? 0xfff1a8 : 0xe4fbff) : 0xff5666, deep ? 1 : 0.85);
  line.userData.fade = 1;
  grooveGroup.add(line);
}

function addCrack() {
  const angle = (state.facetIndex / facets.length) * Math.PI * 2 + root.rotation.y + 0.16;
  const y = [-0.72, 0, 0.72][state.bandIndex];
  const r = 1.15;
  const line = makeLine(
    new THREE.Vector3(Math.cos(angle) * r, y - 0.33, Math.sin(angle) * r),
    new THREE.Vector3(Math.cos(angle + 0.1) * r, y + 0.34, Math.sin(angle + 0.1) * r),
    0xff3c4c,
    0.95
  );
  line.userData.crack = true;
  crackGroup.add(line);
}

function updateBeams() {
  beamGroup.clear();
  const x = [-2.6, 0, 2.6, 0][state.lanternIndex];
  const y = state.lanternIndex === 3 ? 2.3 : 1.5;
  const color = state.focusActive ? 0x8ef6dc : 0xffc55f;
  const active = makeLine(new THREE.Vector3(x, y, 1.4), new THREE.Vector3(0, 0.15, 0), color, 0.72);
  const out = makeLine(new THREE.Vector3(0, 0.1, 0), new THREE.Vector3((-1 + state.facetIndex * 0.65), -1.54, 0.35), color, 0.86);
  beamGroup.add(active, out);
}

function resize() {
  const box = stageEl.getBoundingClientRect();
  renderer.setSize(Math.max(1, box.width), Math.max(1, box.height), false);
  camera.aspect = Math.max(1, box.width) / Math.max(1, box.height);
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

function initAudio() {
  if (!audio.ctx) audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
  audio.ctx.resume?.();
  audio.enabled = true;
  window.__day048Audio = audio;
}
function tone(freq, dur = 0.08, type = 'sine', gain = 0.045) {
  if (state.muted || !audio.ctx || audio.ctx.state !== 'running') return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const g = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g).connect(audio.ctx.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}
function chime(base = 520) { tone(base, .08, 'triangle', .04); setTimeout(() => tone(base * 1.5, .09, 'sine', .035), 60); }

function setHidden(id, hidden) {
  const el = $(id);
  if (!el) return;
  el.hidden = hidden;
  el.classList.toggle('hidden', hidden);
}
function setHelper(msg) {
  const el = $('helperText') || $('helperLine');
  if (el) el.innerHTML = msg;
}
function addScore(amount, msg) {
  state.score += Math.round(amount * state.combo);
  state.best = Math.max(state.best, state.score);
  state.combo = Math.min(4.8, state.combo + 0.08);
  localStorage.setItem('day048-best', String(state.best));
  if (msg) setHelper(msg);
}
function penalty(amount, msg) {
  state.combo = 1;
  state.crack = Math.min(100, state.crack + amount);
  state.heat = Math.min(100, state.heat + amount * 0.55);
  if (state.crack >= 100 || state.heat >= 100) {
    state.hearts -= 1;
    state.crack = Math.min(68, state.crack - 35);
    state.heat = Math.min(72, state.heat - 28);
    tone(150, .16, 'sawtooth', .035);
  }
  if (msg) setHelper(msg);
  if (state.hearts <= 0) endRun(false);
}

function currentCommission() { return commissions[state.commission]; }
function maybeAdvanceCommission() {
  const c = currentCommission();
  if (state.grooves >= c.targetGrooves && state.caustics >= c.targetCaustics && state.score >= c.minScore) {
    state.commission += 1;
    state.grooves = Math.max(0, state.grooves - c.targetGrooves);
    state.caustics = Math.max(0, state.caustics - c.targetCaustics);
    state.polish = Math.min(100, state.polish + 12);
    state.hearts = Math.min(3, state.hearts + 1);
    addScore(1120, '<b>Commission sealed.</b> The glassmaker seal flashes; a harder pattern is ready.');
    chime(620);
    if (state.commission >= commissions.length || state.score >= 6200) triggerBlessing();
  }
}
function triggerBlessing() {
  if (state.blessing) return;
  state.blessing = true;
  state.score = Math.max(state.score + 3800, 6200);
  setHidden('blessing', false);
  setHidden('illumination', false);
  chime(760); setTimeout(() => chime(980), 120);
  setTimeout(() => { setHidden('blessing', true); setHidden('illumination', true); }, 2600);
  setHelper('<b>Kiriko Prism Illumination!</b> Ruby and cobalt beams split into star caustics. Endless commissions continue.');
}

function renderHUD() {
  $('score').textContent = state.score;
  $('best').textContent = state.best;
  $('hearts').textContent = '♥'.repeat(Math.max(0, state.hearts));
  $('heat').textContent = fmt(state.heat);
  $('crack').textContent = fmt(state.crack);
  $('polish').textContent = fmt(state.polish);
  $('combo').textContent = `x${state.combo.toFixed(1)}`;
  $('band').textContent = bands[state.bandIndex];
  $('facet').textContent = facets[state.facetIndex];
  $('lantern').textContent = lanterns[state.lanternIndex];
  $('focus').textContent = fmt(state.focus);
  $('time').textContent = `${Math.floor(state.elapsed / 60)}:${String(Math.floor(state.elapsed % 60)).padStart(2, '0')}`;
  const c = commissions[Math.min(state.commission, commissions.length - 1)];
  const title = $('commissionTitle') || $('commissionName');
  if (title) title.textContent = `${c.name} ${Math.min(c.targetGrooves, state.grooves)}/${c.targetGrooves}`;
  $('commissionText').textContent = c.text;
  if ($('grooveMeter')) { $('grooveMeter').max = c.targetGrooves; $('grooveMeter').value = Math.min(c.targetGrooves, state.grooves); }
  if ($('causticMeter')) { $('causticMeter').max = c.targetCaustics; $('causticMeter').value = Math.min(c.targetCaustics, state.caustics); }
  const ticks = $('progressTicks');
  if (ticks) {
    const total = c.targetGrooves + c.targetCaustics;
    const done = Math.min(total, state.grooves + state.caustics);
    ticks.innerHTML = Array.from({length: total}, (_, i) => `<span class="tick ${i < done ? 'done' : ''}"></span>`).join('');
  }
  if ($('audioTop')) $('audioTop').textContent = state.muted ? 'Audio: Off' : 'Audio: On';
  document.querySelectorAll('[data-action="audio"], #pauseAudioBtn, #audioPause').forEach((el) => { el.textContent = state.muted ? 'Audio: Off' : 'Audio: On'; });
}

function action(name) {
  if (!state.running && name !== 'restart' && name !== 'audio') return;
  initAudio();
  if (name !== 'pause' && state.paused) return;
  const c = currentCommission();
  switch (name) {
    case 'bandDown': state.bandIndex = (state.bandIndex + 2) % 3; tone(260); setHelper(`<b>Band ${bands[state.bandIndex]}.</b> Match the commission band before scoring.`); break;
    case 'bandUp': state.bandIndex = (state.bandIndex + 1) % 3; tone(300); setHelper(`<b>Band ${bands[state.bandIndex]}.</b> Facet guides shift to the active cut ring.`); break;
    case 'rotateLeft': state.facetIndex = (state.facetIndex + 3) % 4; root.rotation.y -= 0.34; tone(210); setHelper(`<b>Rotated left.</b> Active facet is now ${facets[state.facetIndex]}.`); break;
    case 'rotateRight': state.facetIndex = (state.facetIndex + 1) % 4; root.rotation.y += 0.34; tone(230); setHelper(`<b>Rotated right.</b> Hidden facets swing into the lantern beam.`); break;
    case 'tiltUp': root.rotation.x = Math.max(-0.46, root.rotation.x - 0.16); state.heat += 1; tone(330); setHelper('<b>Tilted up.</b> Beam landing climbs on the rice-paper card.'); break;
    case 'tiltDown': root.rotation.x = Math.min(0.46, root.rotation.x + 0.16); state.heat += 1; tone(280); setHelper('<b>Tilted down.</b> Lower facets catch a warmer lantern angle.'); break;
    case 'scoreCut': {
      const correct = bands[state.bandIndex] === c.band || state.focusActive;
      addGroove(correct, false);
      state.heat += correct ? 8 : 14;
      if (correct) { state.grooves += 1; state.focus = Math.min(100, state.focus + 12); addScore(280, '<b>Clean Score Cut.</b> A white kiriko groove catches the lantern.'); tone(410, .08, 'sawtooth', .035); }
      else { state.wrongCuts += 1; addCrack(); penalty(14, '<b>Wrong band cut.</b> Red stress flashes across the facet.'); }
      break;
    }
    case 'deepenCut':
      addGroove(state.heat < 76, true);
      if (state.heat < 76) { state.heat += 14; state.grooves += 1; addScore(260, '<b>Deepened groove.</b> Refraction grows brighter, but heat climbs.'); tone(190, .12, 'sawtooth', .035); }
      else { addCrack(); penalty(18, '<b>Too hot.</b> Deepening a glowing facet opens a hairline crack.'); }
      break;
    case 'coolRinse': state.heat = Math.max(0, state.heat - 24); state.crack = Math.max(0, state.crack - 5); addScore(220, '<b>Cool Rinse.</b> Mint water sweeps the active band and lowers crack risk.'); tone(520, .12, 'sine', .03); break;
    case 'polishFacet': state.polish = Math.min(100, state.polish + 13); state.focus = Math.min(100, state.focus + 8); addScore(300, '<b>Facet polished.</b> Sparkles sharpen the next caustic target.'); chime(560); break;
    case 'shiftLantern': state.lanternIndex = (state.lanternIndex + 1) % lanterns.length; addScore(240, `<b>Lantern shifted ${lanterns[state.lanternIndex]}.</b> Amber beams bend through a new facet normal.`); updateBeams(); tone(360, .09, 'triangle', .035); break;
    case 'catchCaustic': {
      const aligned = state.grooves > 0 && state.polish > 35 && state.heat < 90;
      if (aligned) { state.caustics += 1; state.focus = Math.min(100, state.focus + 10); addScore(380, '<b>Caustic caught.</b> A star-light spot locks onto rice paper.'); chime(720); }
      else penalty(10, '<b>Missed caustic.</b> Polish a useful groove and lower heat before catching.');
      break;
    }
    case 'repairHairline':
      if (state.crack > 8 || crackGroup.children.length) { state.crack = Math.max(0, state.crack - 28); crackGroup.remove(...crackGroup.children.slice(0, 1)); addScore(260, '<b>Hairline repaired.</b> Red stress fades before the second flash.'); tone(470, .1, 'triangle', .03); }
      else { state.focus = Math.max(0, state.focus - 6); setHelper('<b>No red crack yet.</b> Save Repair Hairline for flashing facets.'); }
      break;
    case 'kirikoFocus':
      if (state.focus >= 35) { state.focus = Math.max(0, state.focus - 35); state.focusActive = true; state.combo = Math.min(4.8, state.combo + .2); addScore(180, '<b>Kiriko Focus active.</b> Mint guides show valid grooves, heat risk, beam path, and target rings.'); chime(880); setTimeout(() => { state.focusActive = false; }, 3600); }
      else setHelper('<b>Kiriko Focus not charged.</b> Clean cuts, polish, and caustic catches build it.');
      break;
    case 'pause': togglePause(); break;
    case 'restart': restart(); break;
    case 'audio': state.muted = !state.muted; localStorage.setItem('day048-muted', String(state.muted)); setHelper(`<b>Audio ${state.muted ? 'muted' : 'on'}.</b> Visual cues remain fully playable.`); break;
  }
  if (state.heat > 82 && Math.random() < 0.15) { addCrack(); state.crack += 5; }
  maybeAdvanceCommission();
  renderHUD();
}

function start() {
  initAudio();
  setHidden('menu', true);
  state.running = true;
  state.paused = false;
  chime(520);
  setHelper('<b>First Star Groove.</b> Rotate gently, keep Band Upper, Score Cut, then Cool Rinse before Catch Caustic.');
  renderHUD();
}
function restart() {
  Object.assign(state, {
    running: true, paused: false, score: 0, hearts: 3, heat: 12, crack: 0, polish: 82, combo: 1, focus: 38,
    bandIndex: 2, facetIndex: 0, lanternIndex: 1, grooves: 0, caustics: 0, wrongCuts: 0, commission: 0, elapsed: 0, blessing: false, focusActive: false,
  });
  root.rotation.set(0, 0, 0);
  grooveGroup.clear(); crackGroup.clear(); updateBeams();
  setHidden('menu', true); setHidden('pauseOverlay', true); setHidden('resultOverlay', true); setHidden('blessing', true); setHidden('illumination', true);
  setHelper('<b>Restarted.</b> Upper band is selected; score the first star groove cleanly.');
  renderHUD();
}
function togglePause() {
  state.paused = !state.paused;
  setHidden('pauseOverlay', !state.paused);
  setHelper(state.paused ? '<b>Paused.</b> Resume when ready.' : '<b>Resumed.</b> Keep heat under control.');
}
function endRun(won) {
  state.running = false;
  $('resultTitle').textContent = won ? 'Prism illuminated' : 'Glass needs cooling';
  const summary = `Final score ${state.score}. Commission ${Math.min(state.commission + 1, commissions.length)} reached, heat ${fmt(state.heat)}, crack ${fmt(state.crack)}, caustics ${state.caustics}, wrong cuts ${state.wrongCuts}.`;
  if ($('resultSummary')) $('resultSummary').textContent = summary;
  if ($('resultStats')) $('resultStats').innerHTML = `<div>${summary}</div><div>Best ${state.best}</div>`;
  setHidden('resultOverlay', false);
}

on('startBtn', 'click', start);
on('pauseTop', 'click', () => action('pause'));
on('restartTop', 'click', () => action('restart'));
on('audioTop', 'click', () => action('audio'));
on('resumeBtn', 'click', () => action('pause'));
on('restartPause', 'click', () => action('restart'));
on('pauseRestartBtn', 'click', () => action('restart'));
on('restartResult', 'click', () => action('restart'));
on('resultRestartBtn', 'click', () => action('restart'));
on('audioPause', 'click', () => action('audio'));
on('pauseAudioBtn', 'click', () => action('audio'));
document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => action(button.dataset.action)));

let dragging = false;
let last = null;
renderer.domElement.addEventListener('pointerdown', (event) => { dragging = true; last = { x: event.clientX, y: event.clientY }; renderer.domElement.setPointerCapture(event.pointerId); renderer.domElement.classList.add('dragging'); });
renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging || !last || !state.running || state.paused) return;
  const dx = event.clientX - last.x;
  const dy = event.clientY - last.y;
  root.rotation.y += dx * 0.01;
  root.rotation.x = Math.max(-0.5, Math.min(0.5, root.rotation.x + dy * 0.006));
  if (Math.abs(dx) > 18) state.facetIndex = (state.facetIndex + (dx > 0 ? 1 : 3)) % 4;
  last = { x: event.clientX, y: event.clientY };
  setHelper('<b>Stage drag steering.</b> Glass yaw/tilt changed; choose the band before cutting.');
  renderHUD();
});
renderer.domElement.addEventListener('pointerup', () => { dragging = false; renderer.domElement.classList.remove('dragging'); });
window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const map = { arrowleft: 'rotateLeft', a: 'rotateLeft', arrowright: 'rotateRight', d: 'rotateRight', arrowup: 'tiltUp', w: 'tiltUp', arrowdown: 'tiltDown', s: 'tiltDown', q: 'bandDown', e: 'bandUp', ' ': 'scoreCut', enter: 'scoreCut', shift: 'deepenCut', c: 'coolRinse', p: 'pause', l: 'shiftLantern', x: 'catchCaustic', r: 'repairHairline', f: 'kirikoFocus' };
  if (map[key]) { event.preventDefault(); action(map[key]); }
});

function tick(dt) {
  if (state.running && !state.paused) {
    state.elapsed += dt;
    state.heat = Math.min(100, state.heat + dt * (0.45 + state.commission * 0.08));
    state.polish = Math.max(0, state.polish - dt * 0.05);
    state.crack = Math.min(100, state.crack + Math.max(0, state.heat - 72) * dt * 0.015);
    if (state.crack >= 100 || state.heat >= 100) endRun(false);
  }
}
let lastTime = performance.now();
function animate(now = performance.now()) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  tick(dt);
  root.rotation.y += state.running && !state.paused ? 0.0015 : 0.0005;
  cup.material.color.setHex(state.focusActive ? 0x29d2e8 : (state.commission >= 2 ? 0xa6174b : 0x2467d8));
  cup.material.emissive?.setHex?.(state.focusActive ? 0x072b2c : 0x000000);
  causticRings.forEach((ring, i) => {
    ring.scale.setScalar(1 + Math.sin(now / 360 + i) * 0.12);
    ring.material.opacity = 0.55 + Math.sin(now / 260 + i) * 0.22;
  });
  grooveGroup.children.forEach((line, i) => { line.material.opacity = 0.72 + Math.sin(now / 210 + i) * 0.18; });
  crackGroup.children.forEach((line, i) => { line.material.opacity = 0.55 + Math.sin(now / 90 + i) * 0.4; });
  updateBeams();
  renderHUD();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.__day048Debug = {
  getState: () => ({ ...state, band: bands[state.bandIndex], facet: facets[state.facetIndex], lantern: lanterns[state.lanternIndex] }),
  action,
  forceWin: () => { state.score = 6300; state.grooves = 9; state.caustics = 7; state.commission = 2; triggerBlessing(); renderHUD(); return window.__day048Debug.getState(); },
  forceGameOver: () => { state.hearts = 0; endRun(false); return window.__day048Debug.getState(); },
};

updateBeams();
renderHUD();
requestAnimationFrame(animate);
