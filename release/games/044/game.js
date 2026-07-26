import * as THREE from './assets/three.module.min.js';

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const dom = {
  score: $('score'), best: $('best'), hearts: $('hearts'), melt: $('melt'), purity: $('purity'), combo: $('combo'),
  band: $('band'), syrup: $('syrup'), risk: $('risk'), focus: $('focus'), time: $('time'), orderName: $('orderName'),
  orderText: $('orderText'), routeProgress: $('routeProgress'), topProgress: $('topProgress'), helper: $('helperText'),
  menu: $('menuOverlay'), pause: $('pauseOverlay'), result: $('resultOverlay'), victory: $('victoryBanner'), start: $('startButton'),
  resultTitle: $('resultTitle'), resultSummary: $('resultSummary')
};

const STORAGE = 'day044-kakigori-prism';
const bands = ['Base', 'Lower', 'Middle', 'Crown'];
const syrupNames = ['Strawberry', 'Matcha', 'Mikan', 'Ramune'];
const syrupColors = [0xe84f5f, 0x54a746, 0xf09927, 0x22aeea];
const toppingNames = ['Azuki', 'Shiratama', 'Mikan wedge', 'Sprinkles'];
const orders = [
  { name: 'First Strawberry Snow', routes: 3, tops: 2, melt: 45, text: 'Carve a front groove, pour strawberry to the lower band, place azuki on a cold terrace, and keep melt below 45%.' },
  { name: 'Mikan Prism Steps', routes: 4, tops: 3, melt: 55, text: 'Rotate to the back face, route mikan and ramune down two stepped grooves, use Tilt Spoon, then drain one blue puddle.' },
  { name: 'Grand Matsuri Rainbow', routes: 5, tops: 4, melt: 50, text: 'Serve three clean syrup ribbons, one requested blend zone, a frozen crown topping, and a final Prism Focus preview.' }
];

const saved = JSON.parse(localStorage.getItem(STORAGE) || '{}');
const state = {
  running: false,
  paused: false,
  score: 0,
  best: saved.best || 0,
  hearts: 3,
  melt: 0,
  purity: 100,
  combo: 1,
  band: 2,
  syrup: 0,
  risk: 'low',
  focus: 16,
  elapsed: 0,
  order: 0,
  routes: 0,
  tops: 0,
  yaw: 0,
  selectedLane: 0,
  grooves: [0, 0, 0, 0],
  fog: 0,
  puddles: 0,
  victory: false,
  muted: false,
  lastTick: performance.now(),
  messages: []
};

let scene, camera, renderer, mound, tray, spoon, focusGroup, syrupGroup, toppingGroup, grooveGroup, ringGroup;
let audioCtx = null;

function init3D() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf8e8bf, 5, 15);
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 2.25, 7.2);
  camera.lookAt(0, 1.1, 0);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  stage.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xdff9ff, 0x8b5726, 2.4);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2.1);
  sun.position.set(3, 5, 4);
  scene.add(sun);

  const stall = new THREE.Group();
  const counter = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.22, 3.2), new THREE.MeshStandardMaterial({ color: 0x6a2e16, roughness: 0.5, metalness: 0.15 }));
  counter.position.y = -0.2;
  stall.add(counter);
  tray = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.25, 0.24, 64), new THREE.MeshStandardMaterial({ color: 0x17100d, roughness: 0.38, metalness: 0.38 }));
  tray.scale.z = 0.66;
  tray.position.y = 0.05;
  stall.add(tray);
  scene.add(stall);

  mound = new THREE.Group();
  const iceMat = new THREE.MeshPhysicalMaterial({ color: 0xdffaff, roughness: 0.18, metalness: 0.02, transparent: true, opacity: 0.78, transmission: 0.45, thickness: 0.8, clearcoat: 0.9 });
  for (let i = 0; i < 4; i++) {
    const radiusTop = [1.5, 1.14, 0.74, 0.18][i];
    const radiusBot = [1.85, 1.45, 1.03, 0.66][i];
    const h = [0.45, 0.52, 0.55, 0.52][i];
    const geo = new THREE.CylinderGeometry(radiusTop, radiusBot, h, 48, 2, false);
    const mesh = new THREE.Mesh(geo, iceMat.clone());
    mesh.position.y = 0.27 + i * 0.42;
    mesh.rotation.y = i * 0.27;
    mesh.userData.band = i;
    mound.add(mesh);
  }
  scene.add(mound);

  grooveGroup = new THREE.Group();
  syrupGroup = new THREE.Group();
  toppingGroup = new THREE.Group();
  ringGroup = new THREE.Group();
  focusGroup = new THREE.Group();
  scene.add(grooveGroup, syrupGroup, toppingGroup, ringGroup, focusGroup);
  focusGroup.visible = false;

  spoon = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.46, 24), new THREE.MeshStandardMaterial({ color: 0xd7e3e7, metalness: 0.7, roughness: 0.22 }));
  spoon.rotation.z = Math.PI / 2;
  scene.add(spoon);

  buildTargetRings();
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);
}

function buildTargetRings() {
  ringGroup.clear();
  for (let i = 0; i < 4; i++) {
    const r = 1.55 - i * 0.28;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: i === state.band ? 0xffee88 : 0x7bdcff, transparent: true, opacity: i === state.band ? 0.9 : 0.42 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.29 + i * 0.42;
    ringGroup.add(ring);
  }
}

function resize() {
  const rect = stage.getBoundingClientRect();
  const w = Math.max(320, Math.floor(rect.width));
  const h = Math.max(230, Math.floor(rect.height));
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}

function polarPoint(bandIndex, lane, radiusOffset = 0) {
  const angle = state.yaw + lane * Math.PI / 2;
  const radius = Math.max(0.35, 1.52 - bandIndex * 0.28 + radiusOffset);
  return new THREE.Vector3(Math.sin(angle) * radius, 0.36 + bandIndex * 0.42, Math.cos(angle) * radius * 0.66);
}

function addGroove() {
  const lane = state.selectedLane;
  const depth = Math.min(3, ++state.grooves[lane]);
  const pts = [polarPoint(3, lane, -0.08), polarPoint(2, lane, -0.03), polarPoint(1, lane, 0.02), polarPoint(0, lane, 0.08)];
  const curve = new THREE.CatmullRomCurve3(pts);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 42, 0.012 + depth * 0.006, 8, false), new THREE.MeshBasicMaterial({ color: 0x31545e, transparent: true, opacity: 0.72 }));
  mesh.userData.kind = 'groove';
  grooveGroup.add(mesh);
  addScore(140);
  setHelper(`Carved a ${depth > 1 ? 'deep' : 'fresh'} channel on the ${laneName(lane)} face. Pour Syrup can follow it now.`);
  play('carve');
}

function addSyrup() {
  const lane = state.selectedLane;
  const color = syrupColors[state.syrup];
  const hasGroove = state.grooves[lane] > 0;
  const drift = hasGroove ? 0 : 0.24;
  const pts = [polarPoint(state.band, lane, 0.01), polarPoint(Math.max(1, state.band - 1), lane, 0.08 + drift), polarPoint(0, lane, 0.12 + drift)];
  const curve = new THREE.CatmullRomCurve3(pts);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 44, hasGroove ? 0.035 : 0.026, 12, false), new THREE.MeshStandardMaterial({ color, roughness: 0.18, metalness: 0.02, emissive: color, emissiveIntensity: 0.09 }));
  tube.userData.flow = 0;
  syrupGroup.add(tube);
  if (hasGroove) {
    state.routes++;
    addScore(270);
    state.focus = Math.min(100, state.focus + 18);
    setHelper(`${syrupNames[state.syrup]} syrup flowed cleanly down the carved ${laneName(lane)} route.`);
  } else {
    state.purity = Math.max(0, state.purity - 10);
    state.melt = Math.min(100, state.melt + 4);
    setHelper(`${syrupNames[state.syrup]} wandered without a channel. Carve before pouring to preserve purity.`);
  }
  state.syrup = (state.syrup + 1) % syrupNames.length;
  play('pour');
}

function addTopping() {
  const lane = state.selectedLane;
  const p = polarPoint(state.band, lane, -0.03);
  const geom = toppingGeometry(state.tops % 4);
  const mat = new THREE.MeshStandardMaterial({ color: [0x7a1f24, 0xf7f1df, 0xf49b25, 0xffd84d][state.tops % 4], roughness: 0.32, metalness: 0.03 });
  const top = new THREE.Mesh(geom, mat);
  top.position.copy(p);
  top.position.y += 0.18;
  top.userData.baseY = top.position.y;
  toppingGroup.add(top);
  const stable = state.grooves[lane] > 0 || state.band >= 2 || state.fog > 0;
  if (stable) {
    state.tops++;
    addScore(260);
    state.focus = Math.min(100, state.focus + 12);
    setHelper(`${toppingNames[(state.tops - 1) % 4]} landed on a stable cold terrace.`);
  } else {
    state.melt = Math.min(100, state.melt + 6);
    state.purity = Math.max(0, state.purity - 5);
    top.userData.slide = true;
    setHelper('The topping slid on a steep warm face. Freeze Mist or carve a terrace first.');
  }
  play('top');
}

function toppingGeometry(i) {
  if (i === 0) return new THREE.SphereGeometry(0.12, 18, 12);
  if (i === 1) return new THREE.SphereGeometry(0.15, 20, 12);
  if (i === 2) return new THREE.ConeGeometry(0.16, 0.28, 3);
  return new THREE.TorusGeometry(0.12, 0.035, 8, 24);
}

function action(name) {
  if (name === 'resume') { resume(); return; }
  if (name === 'restart') { restart(); return; }
  if (name === 'pause') { pause(); return; }
  if (name === 'audio') { toggleAudio(); return; }
  if (!state.running || state.paused) return;
  const beforeLane = state.selectedLane;
  switch (name) {
    case 'bandDown': state.band = Math.max(0, state.band - 1); setHelper(`Selected ${bands[state.band]} height band.`); play('tap'); break;
    case 'bandUp': state.band = Math.min(3, state.band + 1); setHelper(`Selected ${bands[state.band]} height band.`); play('tap'); break;
    case 'rotateLeft': state.yaw -= Math.PI / 8; state.selectedLane = (state.selectedLane + 3) % 4; setHelper(`Rotated bowl left to inspect the ${laneName(state.selectedLane)} face.`); play('whoosh'); break;
    case 'rotateRight': state.yaw += Math.PI / 8; state.selectedLane = (state.selectedLane + 1) % 4; setHelper(`Rotated bowl right to inspect the ${laneName(state.selectedLane)} face.`); play('whoosh'); break;
    case 'shave': shaveIce(); break;
    case 'carve': addGroove(); break;
    case 'pour': addSyrup(); break;
    case 'tilt': tiltSpoon(); break;
    case 'topping': addTopping(); break;
    case 'mist': freezeMist(); break;
    case 'drain': drainPuddle(); break;
    case 'focus': prismFocus(); break;
  }
  if (beforeLane !== state.selectedLane) buildTargetRings();
  checkOrder();
  updateHud();
}

function shaveIce() {
  const mesh = mound.children[state.band];
  mesh.scale.multiplyScalar(1.04);
  state.melt = Math.max(0, state.melt - 3);
  addScore(140);
  setHelper(`Fresh ice restored volume on the ${bands[state.band]} band and cooled the mound.`);
  play('shave');
}

function tiltSpoon() {
  state.selectedLane = (state.selectedLane + 1) % 4;
  state.purity = Math.min(100, state.purity + 3);
  addScore(190);
  setHelper(`Tilt Spoon nudged the stream toward the ${laneName(state.selectedLane)} face before it became a puddle.`);
  play('tilt');
}

function freezeMist() {
  if (state.focus < 12) { setHelper('Freeze Mist needs a little Prism charge. Route syrup or place toppings first.'); return; }
  state.focus -= 12;
  state.fog = 3.2;
  state.melt = Math.max(0, state.melt - 9);
  addScore(230);
  setHelper('Freeze Mist frosted the active terrace, slowed melting, and steadied toppings.');
  play('mist');
}

function drainPuddle() {
  const warning = state.puddles > 0 || state.risk !== 'low';
  state.puddles = Math.max(0, state.puddles - 1);
  state.melt = Math.max(0, state.melt - 5);
  addScore(warning ? 210 : 80);
  setHelper(warning ? 'Drain Puddle saved the tray during a blue warning pulse.' : 'Tray lane cleared early. Save drains for warning pulses for more points.');
  play('drain');
}

function prismFocus() {
  if (state.focus < 50) { setHelper(`Prism Focus is ${Math.round(state.focus)}% charged. Clean syrup routes charge it fastest.`); return; }
  state.focus = Math.max(0, state.focus - 50);
  focusGroup.clear();
  for (let lane = 0; lane < 4; lane++) {
    const pts = [polarPoint(3, lane, 0.18), polarPoint(2, lane, 0.25), polarPoint(1, lane, 0.32), polarPoint(0, lane, 0.38)];
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.014, 8), new THREE.MeshBasicMaterial({ color: syrupColors[lane], transparent: true, opacity: 0.78 }));
    focusGroup.add(mesh);
  }
  focusGroup.visible = true;
  setTimeout(() => { focusGroup.visible = false; }, 2600);
  addScore(120);
  setHelper('Prism Focus previewed downhill syrup paths, target bands, melt hotspots, and topping slide risk.');
  play('focus');
}

function checkOrder() {
  const order = orders[state.order];
  if (state.routes >= order.routes && state.tops >= order.tops && state.melt <= order.melt) {
    addScore(1020 + Math.round(260 * state.combo));
    state.order++;
    state.routes = 0;
    state.tops = 0;
    state.grooves = [0, 0, 0, 0];
    grooveGroup.clear();
    state.hearts = Math.min(3, state.hearts + 1);
    state.focus = Math.min(100, state.focus + 22);
    if (state.order >= orders.length) triggerVictory();
    else setHelper(`Dessert ticket stamped. New order: ${orders[state.order].name}.`);
  }
}

function triggerVictory() {
  if (state.victory) return;
  state.victory = true;
  addScore(3400);
  dom.victory.classList.remove('hidden');
  setTimeout(() => dom.victory.classList.add('hidden'), 3600);
  setHelper('Kakigori Prism Service! Endless matsuri orders continue.');
  play('victory');
}

function addScore(points) {
  state.score += Math.round(points * state.combo);
  state.combo = Math.min(5, state.combo + 0.08);
  if (state.score > state.best) {
    state.best = state.score;
    localStorage.setItem(STORAGE, JSON.stringify({ best: state.best, fastest: saved.fastest || null }));
  }
}

function updateHud() {
  const order = orders[Math.min(state.order, orders.length - 1)];
  dom.score.textContent = String(state.score);
  dom.best.textContent = String(state.best);
  dom.hearts.textContent = '♥'.repeat(state.hearts) + '♡'.repeat(Math.max(0, 3 - state.hearts));
  dom.melt.textContent = `${Math.round(state.melt)}%`;
  dom.purity.textContent = `${Math.round(state.purity)}%`;
  dom.combo.textContent = `${state.combo.toFixed(1)}x`;
  dom.band.textContent = bands[state.band];
  dom.syrup.textContent = syrupNames[state.syrup];
  state.risk = state.melt > 72 || state.puddles > 1 ? 'high' : state.melt > 42 || state.puddles > 0 ? 'med' : 'low';
  dom.risk.textContent = state.risk;
  dom.focus.textContent = `${Math.round(state.focus)}%`;
  dom.time.textContent = `${Math.floor(state.elapsed / 60)}:${String(Math.floor(state.elapsed % 60)).padStart(2, '0')}`;
  dom.orderName.textContent = `${order.name} ${Math.min(state.order, orders.length)}/3`;
  dom.orderText.textContent = order.text;
  dom.routeProgress.max = order.routes; dom.routeProgress.value = Math.min(state.routes, order.routes);
  dom.topProgress.max = order.tops; dom.topProgress.value = Math.min(state.tops, order.tops);
  buildTargetRings();
}

function setHelper(text) { dom.helper.textContent = text; state.messages.push(text); }
function laneName(lane) { return ['front', 'right', 'back', 'left'][((lane % 4) + 4) % 4]; }

function startGame() {
  ensureAudio();
  state.running = true;
  state.paused = false;
  dom.menu.classList.add('hidden');
  setHelper('Service begins. Rotate right, carve the lower front groove, then pour strawberry.');
  play('start');
  updateHud();
}
function pause() { state.paused = true; dom.pause.classList.remove('hidden'); }
function resume() { state.paused = false; dom.pause.classList.add('hidden'); }
function restart() {
  Object.assign(state, { running: true, paused: false, score: 0, hearts: 3, melt: 0, purity: 100, combo: 1, band: 2, syrup: 0, risk: 'low', focus: 16, elapsed: 0, order: 0, routes: 0, tops: 0, yaw: 0, selectedLane: 0, grooves: [0, 0, 0, 0], fog: 0, puddles: 0, victory: false, lastTick: performance.now() });
  syrupGroup.clear(); toppingGroup.clear(); grooveGroup.clear(); focusGroup.clear(); focusGroup.visible = false;
  mound.children.forEach((m) => m.scale.set(1, 1, 1));
  dom.pause.classList.add('hidden'); dom.result.classList.add('hidden'); dom.menu.classList.add('hidden'); dom.victory.classList.add('hidden');
  setHelper('Restarted. Carve clean channels before pouring syrup.');
  ensureAudio(); play('start'); updateHud();
}

function failRun(reason) {
  state.running = false;
  dom.resultTitle.textContent = reason.includes('melt') ? 'Melted Service' : 'Dessert Service Ended';
  dom.resultSummary.textContent = `Final score ${state.score}. Reached ${orders[Math.min(state.order, orders.length - 1)].name}; melt ${Math.round(state.melt)}%, purity ${Math.round(state.purity)}%, puddles saved ${Math.max(0, 2 - state.puddles)}.`;
  dom.result.classList.remove('hidden');
  play('fail');
}

function toggleAudio() {
  state.muted = !state.muted;
  document.querySelectorAll('[data-action="audio"]').forEach((b) => { b.textContent = `Audio: ${state.muted ? 'Off' : 'On'}`; });
  if (!state.muted) ensureAudio();
}
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  window.__day044Audio = { ctx: audioCtx, enabled: !state.muted };
}
function play(type) {
  if (state.muted) return;
  ensureAudio();
  const now = audioCtx.currentTime;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(type === 'victory' ? 0.11 : 0.055, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'victory' ? 0.7 : 0.24));
  gain.connect(audioCtx.destination);
  const osc = audioCtx.createOscillator();
  const freqs = { start: 520, carve: 690, pour: 420, shave: 210, tilt: 560, top: 360, mist: 880, drain: 180, focus: 1040, victory: 660, fail: 110, whoosh: 250, tap: 440 };
  osc.frequency.setValueAtTime(freqs[type] || 430, now);
  if (type === 'pour' || type === 'focus' || type === 'victory') osc.frequency.exponentialRampToValueAtTime((freqs[type] || 430) * 1.8, now + 0.2);
  osc.type = type === 'shave' || type === 'drain' ? 'sawtooth' : 'sine';
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + (type === 'victory' ? 0.72 : 0.25));
}

function loop(t) {
  const dt = Math.min(0.05, (t - state.lastTick) / 1000 || 0);
  state.lastTick = t;
  if (state.running && !state.paused) {
    state.elapsed += dt;
    state.melt = Math.min(100, state.melt + dt * (state.order >= 2 ? 1.45 : state.order === 1 ? 1.05 : 0.72));
    state.focus = Math.min(100, state.focus + dt * 1.15);
    state.fog = Math.max(0, state.fog - dt);
    if (Math.floor(state.elapsed) % 19 === 0 && state.elapsed > 4 && Math.random() < dt * 0.65) state.puddles = Math.min(3, state.puddles + 1);
    if (state.melt >= 100 || state.purity <= 0 || state.hearts <= 0 || state.puddles >= 3) failRun('melt or puddle overflow');
    updateHud();
  }
  const bob = Math.sin(t * 0.002) * 0.035;
  mound.rotation.y += (state.yaw - mound.rotation.y) * 0.08;
  grooveGroup.rotation.y = syrupGroup.rotation.y = toppingGroup.rotation.y = ringGroup.rotation.y = focusGroup.rotation.y = mound.rotation.y;
  mound.children.forEach((m, i) => { m.position.y = 0.27 + i * 0.42 + bob * (i + 1) * 0.15; m.material.opacity = state.fog > 0 ? 0.9 : 0.78; });
  toppingGroup.children.forEach((top, i) => { if (top.userData.slide) top.position.y = top.userData.baseY - Math.min(0.28, (state.elapsed % 4) * 0.04); top.rotation.y += 0.01 + i * 0.001; });
  spoon.position.copy(polarPoint(state.band, state.selectedLane, 0.38));
  spoon.position.y += 0.2;
  spoon.rotation.y = state.yaw + state.selectedLane * Math.PI / 2;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

let dragStart = null;
stage.addEventListener('pointerdown', (ev) => { dragStart = { x: ev.clientX, y: ev.clientY }; stage.setPointerCapture(ev.pointerId); });
stage.addEventListener('pointermove', (ev) => {
  if (!dragStart || !state.running || state.paused) return;
  const dx = ev.clientX - dragStart.x;
  const dy = ev.clientY - dragStart.y;
  if (Math.abs(dx) > 34) { action(dx > 0 ? 'rotateRight' : 'rotateLeft'); dragStart.x = ev.clientX; }
  if (Math.abs(dy) > 42) { action(dy > 0 ? 'bandDown' : 'bandUp'); dragStart.y = ev.clientY; }
});
stage.addEventListener('pointerup', () => { dragStart = null; });

dom.start.addEventListener('click', startGame);
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-action]');
  if (btn) action(btn.dataset.action);
});
document.addEventListener('keydown', (ev) => {
  const map = { ArrowLeft: 'rotateLeft', a: 'rotateLeft', ArrowRight: 'rotateRight', d: 'rotateRight', ArrowUp: 'bandUp', w: 'bandUp', ArrowDown: 'bandDown', s: 'shave', ' ': 'carve', Enter: 'carve', p: 'pause', y: 'pour', t: 'tilt', o: 'topping', m: 'mist', f: 'focus', r: 'restart' };
  if (map[ev.key]) { ev.preventDefault(); action(map[ev.key]); }
});

window.__day044Debug = {
  state,
  action,
  forceWin: () => { state.routes = orders[state.order].routes; state.tops = orders[state.order].tops; checkOrder(); updateHud(); },
  forceGameOver: () => failRun('debug game over')
};

init3D();
updateHud();
