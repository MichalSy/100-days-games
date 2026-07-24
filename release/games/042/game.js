import * as THREE from './assets/three.module.min.js';

const $ = (id) => document.getElementById(id);
const first = (...ids) => ids.map($).find(Boolean) ?? null;
const stage = $('stage');
const progressTicks = $('progressTicks');
const chips = document.querySelector('.chips');
if (chips && !document.getElementById('comboChip')) {
  const span = document.createElement('span');
  span.innerHTML = 'Combo <b id="comboChip">1.0x</b>';
  chips.appendChild(span);
}
if (progressTicks && !document.getElementById('tickSap')) {
  progressTicks.innerHTML = '<span class="tick" id="tickSap">S</span><span class="tick" id="tickCharm">C</span><span class="tick" id="tickBell">B</span>';
}
let focusOverlay = $('focusOverlay');
if (!focusOverlay) {
  focusOverlay = document.createElement('div');
  focusOverlay.id = 'focusOverlay';
  focusOverlay.className = 'focusOverlay';
  focusOverlay.innerHTML = '<span>Reach ring</span><span>Wind lane</span><span>Sap route</span>';
  stage.appendChild(focusOverlay);
}
const labels = {
  score: first('score', 'scoreChip'), best: first('best', 'bestChip'), hearts: first('hearts', 'heartChip'), grip: first('grip', 'gripChip'), haze: first('haze', 'hazeChip'), combo: first('combo', 'comboChip'),
  height: first('height', 'heightChip'), lane: first('lane', 'laneChip'), sap: first('sap', 'sapChip'), risk: first('risk', 'riskChip'), focus: first('focus', 'focusChip'), time: first('time', 'timeChip'),
  commissionTitle: first('commissionTitle', 'ascentName'), commissionText: first('commissionText', 'objectiveText'), tickSap: $('tickSap'), tickCharm: $('tickCharm'), tickBell: $('tickBell'),
  status: first('status', 'helperText'), helper: $('helperText'), menuBest: $('menuBest'), menuTime: first('menuTime', 'menuRing')
};
const menu = first('menu', 'menuOverlay');
const pauseOverlay = $('pauseOverlay');
const resultOverlay = $('resultOverlay');
const banner = first('grandBanner', 'ringBanner');
const audioBtn = first('audioBtn') || document.querySelector('[data-action="audio"]');
const mutePauseBtn = first('mutePauseBtn') || document.querySelector('#pauseOverlay [data-action="audio"]') || audioBtn;

const laneNames = ['Front', 'Right', 'Back', 'Left'];
const sapOrder = ['blue', 'amber', 'red'];
const sapColors = { blue: 0x67d7ff, amber: 0xffbf4f, red: 0xff6c56 };
const commissions = [
  { title: 'First Bark Grip', text: 'Collect blue, amber, then red sap. Reach the moss ledge, keep grip above 35%, and learn the first branch leap.', targetHeight: 8, charms: 1 },
  { title: 'Sap Spiral Crossing', text: 'Wrap around the trunk, rescue two firefly charms, Lock Claws through gusts, and keep ordered sap flowing.', targetHeight: 16, charms: 2 },
  { title: 'Grand Canopy Bell', text: 'Use Canopy Focus, dodge the woodpecker shadow, keep grip above 35%, and leap to the hanging bell.', targetHeight: 25, charms: 2 }
];

const state = {
  running: false, paused: false, ended: false, muted: false,
  score: 0, best: Number(localStorage.getItem('day042Best') || 0), bestTime: localStorage.getItem('day042BestRing') || '',
  hearts: 3, grip: 100, haze: 0, combo: 1, height: 0, lane: 0, angle: 0,
  sapIndex: 0, sapChain: 0, sapCharge: 0, focus: 0, focusActive: 0, shellHeat: 0,
  charms: 0, misses: 0, hazards: 0, ascent: 0, elapsed: 0, risk: 'low', message: 'Press Start.',
  beetleY: 0, targetY: 0, leapT: 0, leapFrom: null, leapTo: null, vx: 0, dragging: false, lastPointer: null,
  grand: false, perfectLandings: 0
};

let scene, camera, renderer, trunk, beetle, beetleShell, horn, sapGroup, ledgeGroup, charmGroup, hazardGroup, focusGroup, clock;
let sapBeads = [], ledges = [], charms = [], hazards = [];
let audio = { ctx: null, enabled: false };
window.__day042Audio = audio;
window.__day042Debug = { state, action, snapshot: () => ({ ...state }) };

function initThree() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a201e, 8, 34);
  camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
  const existingCanvas = $('gameCanvas');
  renderer = new THREE.WebGLRenderer({ canvas: existingCanvas || undefined, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  if (!existingCanvas) stage.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xbcecff, 0x3a2417, 2.2);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffdd86, 2.8);
  sun.position.set(-4, 8, 7);
  scene.add(sun);
  const fill = new THREE.PointLight(0x8df6b4, 1.5, 18);
  fill.position.set(3, 4, 4);
  scene.add(fill);

  const barkMat = new THREE.MeshStandardMaterial({ color: 0x704122, roughness: 0.86, metalness: 0.04 });
  trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.42, 42, 40, 12), barkMat);
  trunk.position.y = 12;
  scene.add(trunk);
  addBarkRidges();

  sapGroup = new THREE.Group(); ledgeGroup = new THREE.Group(); charmGroup = new THREE.Group(); hazardGroup = new THREE.Group(); focusGroup = new THREE.Group();
  scene.add(sapGroup, ledgeGroup, charmGroup, hazardGroup, focusGroup);
  createBeetle();
  generateRoute();
  resize();
  window.addEventListener('resize', resize);
}

function addBarkRidges() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x9a6538, roughness: 0.9 });
  for (let i = 0; i < 34; i++) {
    const a = (i / 34) * Math.PI * 2;
    const h = -7 + (i * 1.13) % 35;
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.5 + (i % 4) * 0.18, 0.055), mat);
    ridge.position.set(Math.sin(a) * 1.235, h, Math.cos(a) * 1.235);
    ridge.rotation.y = a;
    ridge.rotation.z = (i % 2 ? 0.08 : -0.05);
    scene.add(ridge);
  }
}

function createBeetle() {
  beetle = new THREE.Group();
  const shellMat = new THREE.MeshStandardMaterial({ color: 0x5d2418, roughness: 0.34, metalness: 0.55, emissive: 0x210604, emissiveIntensity: 0.2 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: 0x23100b, roughness: 0.6, metalness: 0.2 });
  beetleShell = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), shellMat);
  beetleShell.scale.set(0.82, 1.25, 0.55);
  beetle.add(beetleShell);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 12), bellyMat);
  head.position.y = 0.24;
  head.scale.set(0.9, 0.8, 0.75);
  beetle.add(head);
  horn = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.42, 16), shellMat);
  horn.position.y = 0.48;
  horn.rotation.x = Math.PI;
  beetle.add(horn);
  const scarfMat = new THREE.MeshBasicMaterial({ color: 0xffcc4f });
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.018, 8, 24), scarfMat);
  scarf.position.y = 0.16; scarf.rotation.x = Math.PI / 2;
  beetle.add(scarf);
  for (let i = 0; i < 6; i++) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.25, 4, 8), bellyMat);
    leg.position.set((i < 3 ? -0.18 : 0.18), -0.08 + (i % 3) * 0.12, 0.02);
    leg.rotation.z = (i < 3 ? 1 : -1) * (0.9 + (i % 3) * 0.15);
    beetle.add(leg);
  }
  scene.add(beetle);
}

function generateRoute() {
  sapBeads.forEach((s) => sapGroup.remove(s.mesh)); ledges.forEach((l) => ledgeGroup.remove(l.mesh)); charms.forEach((c) => charmGroup.remove(c.mesh)); hazards.forEach((h) => hazardGroup.remove(h.mesh));
  sapBeads = []; ledges = []; charms = []; hazards = [];
  for (let i = 0; i < 16; i++) {
    const lane = (i * 1 + (i > 7 ? 1 : 0)) % 4;
    const y = 1.4 + i * 1.55;
    const colorName = sapOrder[i % 3];
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 12), new THREE.MeshStandardMaterial({ color: sapColors[colorName], emissive: sapColors[colorName], emissiveIntensity: 0.65, roughness: 0.24 }));
    placeOnTrunk(bead, lane, y, 1.42);
    sapGroup.add(bead); sapBeads.push({ mesh: bead, lane, y, colorName, got: false });
  }
  for (let i = 0; i < 10; i++) {
    const lane = (i * 3 + 1) % 4;
    const y = 2.6 + i * 2.65;
    const moss = i % 3 === 0;
    const mat = new THREE.MeshStandardMaterial({ color: moss ? 0x74ad51 : 0x8a552c, roughness: 0.82, metalness: 0.02 });
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.42), mat);
    placeOnTrunk(ledge, lane, y, 1.78);
    ledge.rotation.y = lane * Math.PI / 2;
    ledgeGroup.add(ledge); ledges.push({ mesh: ledge, lane, y, moss, landed: false });
  }
  for (let i = 0; i < 6; i++) {
    const lane = (i * 2 + 1) % 4;
    const y = 4.2 + i * 3.7;
    const charm = new THREE.Mesh(new THREE.OctahedronGeometry(0.13), new THREE.MeshStandardMaterial({ color: 0xfff1a1, emissive: 0xffd76c, emissiveIntensity: 0.9, metalness: 0.1 }));
    placeOnTrunk(charm, lane, y, 1.64);
    charmGroup.add(charm); charms.push({ mesh: charm, lane, y, got: false });
  }
  for (let i = 0; i < 7; i++) {
    const lane = (i + 2) % 4;
    const y = 5 + i * 3.1;
    const hazard = new THREE.Mesh(new THREE.CircleGeometry(0.26, 24), new THREE.MeshBasicMaterial({ color: 0x130a08, transparent: true, opacity: 0.44, side: THREE.DoubleSide }));
    placeOnTrunk(hazard, lane, y, 1.49);
    hazard.rotation.y = lane * Math.PI / 2;
    hazardGroup.add(hazard); hazards.push({ mesh: hazard, lane, y, hit: false, phase: i * 0.7 });
  }
}

function placeOnTrunk(obj, lane, y, radius) {
  const a = lane * Math.PI / 2;
  obj.position.set(Math.sin(a) * radius, y, Math.cos(a) * radius);
  obj.lookAt(0, y, 0);
}

function ensureAudio() {
  if (!audio.ctx) audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
  audio.ctx.resume?.();
  audio.enabled = !state.muted;
  window.__day042Audio = audio;
}
function tone(freq = 440, dur = 0.08, type = 'sine', gain = 0.035) {
  if (!audio.ctx || state.muted) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const g = audio.ctx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(gain, now + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g); g.connect(audio.ctx.destination); osc.start(now); osc.stop(now + dur + 0.02);
}
function chord(base) { tone(base, .09, 'triangle', .026); setTimeout(() => tone(base * 1.5, .12, 'sine', .022), 45); }

function start() {
  ensureAudio();
  Object.assign(state, { running: true, paused: false, ended: false, score: 0, hearts: 3, grip: 100, haze: 0, combo: 1, height: 0, targetY: 0, beetleY: 0, lane: 0, angle: 0, sapIndex: 0, sapChain: 0, sapCharge: 0, focus: 12, focusActive: 0, shellHeat: 0, charms: 0, misses: 0, hazards: 0, ascent: 0, elapsed: 0, risk: 'low', grand: false, perfectLandings: 0 });
  sapBeads.forEach(s => { s.got = false; s.mesh.visible = true; });
  charms.forEach(c => { c.got = false; c.mesh.visible = true; });
  ledges.forEach(l => { l.landed = false; });
  hazards.forEach(h => { h.hit = false; h.mesh.material.opacity = 0.44; });
  menu.classList.add('hidden'); resultOverlay.classList.add('hidden'); pauseOverlay.classList.add('hidden'); banner.classList.add('hidden');
  setMessage('Climb begins. Orbit right to line up the blue sap bead, then Leap Branch on a gold reach ring.');
  chord(330); updateCommission(); updateHud();
}
function restart() { start(); }
function pauseToggle(force) {
  if (!state.running || state.ended) return;
  state.paused = typeof force === 'boolean' ? force : !state.paused;
  pauseOverlay.classList.toggle('hidden', !state.paused);
  setMessage(state.paused ? 'Paused. Resume when the gust lane is safe.' : 'Resumed. Keep climbing toward the canopy bell.');
  tone(state.paused ? 180 : 360, .08, 'sine');
}
function endRun(reason) {
  state.ended = true; state.running = false;
  if (state.score > state.best) { state.best = state.score; localStorage.setItem('day042Best', String(state.best)); }
  $('resultTitle').textContent = reason || 'Canopy results';
  $('resultText').textContent = `Score ${state.score}. Charms ${state.charms}. Sap chain ${state.sapChain}. Missed leaps ${state.misses}. Hazards ${state.hazards}. Grip finish ${Math.max(0, Math.round(state.grip))}%.`;
  resultOverlay.classList.remove('hidden'); updateHud(); chord(160);
}

function action(name) {
  if (name !== 'audio') ensureAudio();
  if (name === 'pause') return pauseToggle();
  if (name === 'restart') return restart();
  if (name === 'audio') { state.muted = !state.muted; audio.enabled = !state.muted; updateAudioButtons(); setMessage(state.muted ? 'Audio muted. Visual cues remain active.' : 'Audio on. WebAudio is running after the Start gesture.'); return; }
  if (!state.running || state.paused || state.ended) return;
  switch (name) {
    case 'climbUp': climb(0.72); break;
    case 'climbDown': climb(-0.46); break;
    case 'orbitLeft': orbit(-1); break;
    case 'orbitRight': orbit(1); break;
    case 'leap': leap(); break;
    case 'lock': lockClaws(); break;
    case 'horn': chargeHorn(); break;
    case 'dash': sapDash(); break;
    case 'fan':
    case 'wings': fanWings(); break;
    case 'focus': canopyFocus(); break;
  }
  updateHud();
}

function addScore(points) { state.score += Math.round(points * state.combo); state.combo = Math.min(5, state.combo + 0.08); }
function penalty(msg, damage = false) {
  state.combo = 1; state.haze = Math.min(100, state.haze + 4); state.grip = Math.max(0, state.grip - 7);
  if (damage) state.hearts -= 1;
  setMessage(msg); tone(130, .09, 'sawtooth', .02);
  if (state.hearts <= 0) endRun('Shell hearts cracked');
}
function climb(delta) {
  state.height = Math.max(0, Math.min(31, state.height + delta));
  state.targetY = state.height;
  state.grip = Math.max(0, state.grip - Math.abs(delta) * (delta > 0 ? 1.25 : 0.55));
  addScore(delta > 0 ? 32 : 8);
  collectNearby(); checkCommission();
  setMessage(delta > 0 ? 'Climb Up: claws scratch higher along the cedar bark.' : 'Climb Down: you reposition into a safer grip pocket.');
  tone(delta > 0 ? 260 : 190, .055, 'triangle', .018);
}
function orbit(dir) {
  state.lane = (state.lane + dir + 4) % 4;
  state.angle = state.lane * Math.PI / 2;
  addScore(25); collectNearby(); checkHazardNear();
  setMessage(`${dir > 0 ? 'Orbit Right' : 'Orbit Left'}: the beetle wraps around to the ${laneNames[state.lane]} lane.`);
  tone(dir > 0 ? 420 : 380, .07, 'sine', .02);
}
function leap() {
  const target = ledges.find(l => !l.landed && Math.abs(l.y - state.height) < 2.7 && (l.lane === state.lane || Math.abs(l.lane - state.lane) === 1));
  if (!target) { state.misses++; return penalty('Leap Branch missed: no gold reach ring in this lane. Fan Wings can recover a slide.', false); }
  state.height = target.y; state.targetY = target.y; state.lane = target.lane; state.angle = state.lane * Math.PI / 2; target.landed = true;
  state.grip = Math.min(100, state.grip + (target.moss ? 14 : 7));
  state.focus = Math.min(100, state.focus + 16); state.perfectLandings++; addScore(280);
  setMessage(`Leap Branch: perfect arc to a ${target.moss ? 'moss rest pad' : 'cedar ledge'}; grip restored.`);
  chord(520); collectNearby(); checkCommission();
}
function lockClaws() {
  if (state.grip < 8) return penalty('Lock Claws failed: grip is too low; find moss or sap first.', false);
  state.grip = Math.max(0, state.grip - 5); state.focus = Math.min(100, state.focus + 7); addScore(190);
  hazards.filter(h => h.lane === state.lane && Math.abs(h.y - state.height) < 1.8).forEach(h => { h.hit = true; h.mesh.material.opacity = 0.12; });
  setMessage('Lock Claws: the beetle clings through the gust warning and preserves the route.'); tone(245, .075, 'square', .018);
}
function chargeHorn() {
  state.shellHeat = Math.min(100, state.shellHeat + 34);
  const nearbyHazard = hazards.find(h => !h.hit && h.lane === state.lane && Math.abs(h.y - state.height) < 2.4);
  if (state.shellHeat > 94) { state.shellHeat = 10; return penalty('Charge Horn overcooked the shell against hard bark. Release earlier next time.', true); }
  if (nearbyHazard) { nearbyHazard.hit = true; nearbyHazard.mesh.material.opacity = 0.08; state.focus = Math.min(100, state.focus + 10); addScore(220); setMessage('Charge Horn: crisp knock clears the rival beetle / brittle bark hazard.'); chord(250); }
  else { addScore(60); setMessage('Charge Horn builds shell power. Line up a brittle flake or rival beetle for bonus points.'); tone(180 + state.shellHeat * 3, .08, 'sawtooth', .017); }
}
function sapDash() {
  if (state.sapCharge < 2) return penalty('Sap Dash needs two ordered sap beads. Collect the glowing route first.', false);
  const old = state.height;
  state.height = Math.min(31, state.height + 2.4 + state.sapCharge * 0.55); state.targetY = state.height;
  state.sapCharge = 0; state.focus = Math.min(100, state.focus + 14); addScore(420);
  setMessage(`Sap Dash: amber vein launches you from ${old.toFixed(1)}m to ${state.height.toFixed(1)}m.`); chord(620); collectNearby(); checkCommission();
}
function fanWings() {
  state.grip = Math.min(100, state.grip + 8); state.haze = Math.max(0, state.haze - 2); state.focus = Math.min(100, state.focus + 5);
  const charm = charms.find(c => !c.got && Math.abs(c.y - state.height) < 2.4);
  if (charm) { charm.got = true; charm.mesh.visible = false; state.charms++; addScore(360); setMessage('Fan Wings: flutter slows the fall and reveals a hidden firefly charm.'); chord(740); }
  else { addScore(90); setMessage('Fan Wings: wing buzz slows the slide and reveals safe air around the trunk.'); tone(520, .11, 'triangle', .018); }
  checkCommission();
}
function canopyFocus() {
  if (state.focus < 60) return penalty('Canopy Focus is still charging. Clean sap, leaps, and charms fill it faster.', false);
  state.focus = Math.max(0, state.focus - 60); state.focusActive = 7; focusOverlay.classList.add('active'); focusGroup.visible = true; addScore(160);
  setMessage('Canopy Focus: gold arcs show reachable ledges, sap order, wind lanes, and the safe bell route.'); chord(880); drawFocusArcs();
}
function drawFocusArcs() {
  focusGroup.clear();
  const mat = new THREE.LineBasicMaterial({ color: 0xffdf6a, transparent: true, opacity: 0.85 });
  ledges.filter(l => Math.abs(l.y - state.height) < 5).forEach(l => {
    const pts = [beetle.position.clone(), l.mesh.position.clone()];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    focusGroup.add(new THREE.Line(geo, mat));
  });
}

function collectNearby() {
  sapBeads.forEach(bead => {
    if (bead.got) return;
    if (bead.lane === state.lane && Math.abs(bead.y - state.height) < 0.85) {
      const expected = sapOrder[state.sapIndex % sapOrder.length];
      if (bead.colorName === expected) {
        bead.got = true; bead.mesh.visible = false; state.sapIndex++; state.sapChain++; state.sapCharge++; state.focus = Math.min(100, state.focus + 10); addScore(230);
        setMessage(`Ordered ${bead.colorName} sap collected. Next sap: ${sapOrder[state.sapIndex % 3]}.`); tone(bead.colorName === 'blue' ? 660 : bead.colorName === 'amber' ? 520 : 440, .08, 'sine', .022);
      } else {
        bead.got = true; bead.mesh.visible = false; penalty(`Wrong sap order: ${bead.colorName} bead fizzled before ${expected}.`, false);
      }
    }
  });
  charms.forEach(charm => {
    if (!charm.got && charm.lane === state.lane && Math.abs(charm.y - state.height) < 0.7) {
      charm.got = true; charm.mesh.visible = false; state.charms++; state.focus = Math.min(100, state.focus + 12); addScore(360); setMessage('Firefly charm rescued from the cedar needles.'); chord(700);
    }
  });
}
function checkHazardNear() {
  const danger = hazards.find(h => !h.hit && h.lane === state.lane && Math.abs(h.y - state.height) < 1.2);
  state.risk = danger ? 'high' : hazards.some(h => !h.hit && Math.abs(h.y - state.height) < 2.4) ? 'medium' : 'low';
  if (danger) penalty('Woodpecker shadow grazed the shell. Use Lock Claws or Charge Horn when risk is high.', true);
}
function checkCommission() {
  const c = commissions[state.ascent];
  if (!c) return;
  if (state.height >= c.targetHeight && state.sapIndex >= (state.ascent + 1) * 3 && state.charms >= c.charms) {
    addScore(980 + state.ascent * 220);
    state.ascent++;
    if (state.hearts < 3) state.hearts++;
    if (state.ascent >= commissions.length && state.score >= 5600 && !state.grand) triggerGrand();
    else if (state.ascent < commissions.length) {
      setMessage(`Ascent complete: ${c.title}. A cedar-shell seal glows; next route unlocked.`); chord(760); updateCommission();
    }
  }
}
function triggerGrand() {
  state.grand = true; addScore(3200); banner.classList.remove('hidden'); setTimeout(() => banner.classList.add('hidden'), 2800);
  const seconds = Math.max(1, Math.round(state.elapsed));
  const prev = Number(localStorage.getItem('day042BestRingSeconds') || 99999);
  if (seconds < prev) { localStorage.setItem('day042BestRingSeconds', String(seconds)); localStorage.setItem('day042BestRing', formatTime(seconds)); state.bestTime = formatTime(seconds); }
  setMessage('Kabuto Dawn Canopy Ring! Sunrise lights the cedar bell. Endless ascent begins.'); chord(980); updateCommission();
}
function updateCommission() {
  const c = commissions[Math.min(state.ascent, commissions.length - 1)];
  labels.commissionTitle.textContent = state.grand ? 'Endless Cedar Ascent' : c.title;
  labels.commissionText.textContent = state.grand ? 'Keep climbing: hidden charms, faster gusts, rival beetles, and bonus shrine-rope flags continue without shrinking controls.' : c.text;
}
function setMessage(msg) { state.message = msg; labels.status.textContent = msg; labels.helper.textContent = msg.length > 118 ? msg.slice(0, 116) + '…' : msg; }
function updateHud() {
  labels.score.textContent = state.score; labels.best.textContent = Math.max(state.best, state.score); labels.hearts.textContent = '♥'.repeat(Math.max(0, state.hearts)) + '♡'.repeat(Math.max(0, 3 - state.hearts));
  labels.grip.textContent = `${Math.max(0, Math.round(state.grip))}%`; labels.haze.textContent = `${Math.round(state.haze)}%`; labels.combo.textContent = `${state.combo.toFixed(1)}x`;
  labels.height.textContent = `${state.height.toFixed(1)}m`; labels.lane.textContent = laneNames[state.lane]; labels.sap.textContent = sapOrder[state.sapIndex % 3]; labels.risk.textContent = state.risk; labels.focus.textContent = `${Math.round(state.focus)}%`; labels.time.textContent = formatTime(state.elapsed);
  labels.menuBest.textContent = Math.max(state.best, state.score); labels.menuTime.textContent = state.bestTime || '—';
  labels.tickSap.innerHTML = `Sap order <b>${state.sapIndex % 9}/9</b>`; labels.tickCharm.innerHTML = `Charms <b>${state.charms}/${commissions[Math.min(state.ascent, 2)].charms}</b>`; labels.tickBell.innerHTML = `Bell route <b>${Math.min(100, Math.round((state.height / 25) * 100))}%</b>`;
  updateAudioButtons();
}
function updateAudioButtons() { const txt = state.muted ? 'Audio: Off' : 'Audio: On'; audioBtn.textContent = txt; mutePauseBtn.textContent = txt; }
function formatTime(s) { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

function resize() {
  const r = stage.getBoundingClientRect();
  if (!r.width || !r.height) return;
  renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
}
function updateScene(dt) {
  state.beetleY += (state.height - state.beetleY) * Math.min(1, dt * 7);
  const a = state.angle;
  const radius = 1.42;
  beetle.position.set(Math.sin(a) * radius, state.beetleY, Math.cos(a) * radius);
  beetle.lookAt(Math.sin(a) * 2.5, state.beetleY + 0.72, Math.cos(a) * 2.5);
  beetle.rotation.z = Math.sin(performance.now() / 250) * 0.06;
  beetleShell.material.emissiveIntensity = 0.15 + state.shellHeat / 500 + (state.focusActive > 0 ? 0.35 : 0);
  horn.scale.setScalar(1 + state.shellHeat / 250);
  const camA = a + 0.12;
  camera.position.set(Math.sin(camA) * 4.1, state.beetleY + 1.7, Math.cos(camA) * 4.1 + 1.8);
  camera.lookAt(0, state.beetleY + 0.9, 0);
  trunk.position.y = 12 - state.beetleY * 0.12;
  sapBeads.forEach((s, i) => { s.mesh.rotation.y += dt; s.mesh.position.y = s.y + Math.sin(performance.now() / 380 + i) * 0.035; });
  charms.forEach((c, i) => { c.mesh.rotation.y -= dt * 1.4; c.mesh.position.y = c.y + Math.sin(performance.now() / 290 + i) * 0.055; });
  hazards.forEach((h, i) => { if (!h.hit) h.mesh.material.opacity = 0.24 + Math.sin(performance.now() / 420 + h.phase) * 0.18; });
  if (state.focusActive > 0) { state.focusActive -= dt; if (state.focusActive <= 0) { focusOverlay.classList.remove('active'); focusGroup.clear(); } }
  renderer.render(scene, camera);
}
function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, clock.getDelta());
  if (state.running && !state.paused && !state.ended) {
    state.elapsed += dt;
    state.haze = Math.min(100, state.haze + dt * (state.grand ? 0.9 : 0.55));
    state.grip = Math.max(0, state.grip - dt * (state.height > 1 ? 0.42 : 0.12));
    state.shellHeat = Math.max(0, state.shellHeat - dt * 18);
    if (Math.floor(state.elapsed) % 4 === 0) checkHazardNear();
    if (state.grip <= 0) endRun('Grip slipped from the cedar');
    if (state.haze >= 100) endRun('Dusk haze swallowed the canopy route');
    updateHud();
  }
  updateScene(dt);
}

stage.addEventListener('pointerdown', (ev) => { state.dragging = true; state.lastPointer = { x: ev.clientX, y: ev.clientY }; stage.setPointerCapture(ev.pointerId); ensureAudio(); });
stage.addEventListener('pointermove', (ev) => {
  if (!state.dragging || !state.lastPointer || !state.running || state.paused) return;
  const dx = ev.clientX - state.lastPointer.x, dy = ev.clientY - state.lastPointer.y;
  if (Math.abs(dx) > 26) { orbit(dx > 0 ? 1 : -1); state.lastPointer.x = ev.clientX; }
  if (Math.abs(dy) > 22) { climb(dy < 0 ? 0.52 : -0.34); state.lastPointer.y = ev.clientY; }
});
stage.addEventListener('pointerup', () => { state.dragging = false; state.lastPointer = null; });
document.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', () => action(btn.dataset.action)));
const startEl = first('startBtn', 'startButton');
const resumeEl = first('resumeBtn') || document.querySelector('#pauseOverlay [data-action="pause"]');
const restartPauseEl = first('restartPauseBtn') || document.querySelector('#pauseOverlay [data-action="restart"]');
const restartResultEl = first('restartResultBtn') || document.querySelector('#resultOverlay [data-action="restart"]');
startEl?.addEventListener('click', start);
resumeEl?.addEventListener('click', () => pauseToggle(false));
restartPauseEl?.addEventListener('click', restart);
restartResultEl?.addEventListener('click', restart);
mutePauseBtn?.addEventListener('click', () => action('audio'));
window.addEventListener('keydown', (ev) => {
  const k = ev.key.toLowerCase();
  const map = { arrowup:'climbUp', w:'climbUp', arrowdown:'climbDown', s:'climbDown', arrowleft:'orbitLeft', a:'orbitLeft', arrowright:'orbitRight', d:'orbitRight', ' ':'leap', enter:'leap', c:'lock', l:'lock', h:'horn', f:'fan', g:'focus', shift:'focus', p:'pause', r:'restart' };
  if (map[k]) { ev.preventDefault(); action(map[k]); }
});

initThree(); clock = new THREE.Clock(); updateCommission(); updateHud(); tick();
