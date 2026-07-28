import * as THREE from './assets/three.module.min.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const COMMISSIONS = [
  { name: 'First Eave Leak', text: 'Replace two cracked front tiles, seal the lower overlap, slide the gutter under the blue stream, and keep leaks below 45%.', cracks: [[2, 1], [4, 1]], target: 3 },
  { name: 'Moon Gutter Turn', text: 'Rotate to the side eave, clear cedar leaves, ring the blue rain chain pulse, and brace the first red gust.', cracks: [[1, 2], [5, 2], [3, 3]], target: 4 },
  { name: 'Grand Shachi Stormseal', text: 'Repair near, mid, and far cracks, glaze a cure line, catch two rain streams, and keep ridge risk below 40%.', cracks: [[0, 1], [3, 2], [6, 3], [2, 4]], target: 5 }
];
const ROW_NAMES = ['Lower', 'Middle', 'Upper', 'Ridge'];
const FACE_NAMES = ['Front', 'Right Eave', 'Back', 'Left Eave'];
const STORAGE = 'day046-shachi-best';

let scene, camera, renderer, roofGroup, waterGroup, focusGroup;
let tileMeshes = [];
let selectedRow = 0;
let selectedCol = 3;
let yaw = 0;
let running = false;
let paused = false;
let muted = false;
let startTime = 0;
let raf = 0;
let audio = { ctx: null, enabled: false };
const state = {
  score: 0,
  best: Number(localStorage.getItem(STORAGE) || 0),
  hearts: 3,
  leak: 0,
  storm: 10,
  combo: 1,
  focus: 35,
  gutter: 0,
  ridge: 0,
  commission: 0,
  repairs: 0,
  chains: 0,
  wrongTiles: 0,
  ridgeSaves: 0,
  leafClogs: 2,
  sealCure: 0,
  blessing: false,
  elapsed: 0
};

function init3d() {
  const stage = $('#stage');
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x06111f, 9, 22);
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 4.6, 9.2);
  camera.lookAt(0, 0.2, 0);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x06111f, 0.15);
  stage.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0x9edcff, 0x1a0b04, 1.4));
  const key = new THREE.DirectionalLight(0xffdd9a, 1.2);
  key.position.set(-3, 7, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x73c8ff, 1.6);
  rim.position.set(4, 5, -6);
  scene.add(rim);

  roofGroup = new THREE.Group();
  scene.add(roofGroup);
  waterGroup = new THREE.Group();
  scene.add(waterGroup);
  focusGroup = new THREE.Group();
  scene.add(focusGroup);

  createRoof();
  createRainChains();
  createParticles();
  resize();
  window.addEventListener('resize', resize);
  stage.addEventListener('pointerdown', onPointer);
  stage.addEventListener('pointermove', onPointer);
}

function createRoof() {
  tileMeshes = [];
  const tileGeo = new THREE.BoxGeometry(0.86, 0.14, 0.9);
  const normalMat = new THREE.MeshStandardMaterial({ color: 0x263342, roughness: 0.38, metalness: 0.38 });
  const crackMat = new THREE.MeshStandardMaterial({ color: 0x4a5361, roughness: 0.5, metalness: 0.25, emissive: 0x210808, emissiveIntensity: 0.25 });
  const fixedMat = new THREE.MeshStandardMaterial({ color: 0x40596b, roughness: 0.25, metalness: 0.42, emissive: 0x163c52, emissiveIntensity: 0.2 });
  const rows = 5, cols = 7;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isCrack = COMMISSIONS[0].cracks.some(([cc, rr]) => cc === c && rr === r);
      const tile = new THREE.Mesh(tileGeo, isCrack ? crackMat.clone() : normalMat.clone());
      const x = (c - 3) * 0.78;
      const z = (r - 2) * 0.72;
      const arch = Math.abs(c - 3) * 0.1;
      tile.position.set(x, Math.sin((c / (cols - 1)) * Math.PI) * 0.58 - arch, z);
      tile.rotation.z = (c - 3) * -0.09;
      tile.rotation.x = -0.05 + (r - 2) * 0.02;
      tile.userData = { r, c, cracked: isCrack, fixed: false, selected: false, baseY: tile.position.y, mats: { normal: normalMat, crack: crackMat, fixed: fixedMat } };
      roofGroup.add(tile);
      tileMeshes.push(tile);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.94, 16), new THREE.MeshStandardMaterial({ color: 0x111a25, roughness: 0.35, metalness: 0.55 }));
      cap.rotation.z = Math.PI / 2;
      cap.position.set(x - 0.39, tile.position.y + 0.1, z - 0.03);
      roofGroup.add(cap);
    }
  }
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.3, 0.35), new THREE.MeshStandardMaterial({ color: 0x111823, metalness: 0.55, roughness: 0.22, emissive: 0x001522, emissiveIntensity: .15 }));
  ridge.position.set(0, 0.78, -1.82);
  ridge.name = 'ridge';
  roofGroup.add(ridge);
  const shachi = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.85, 20), new THREE.MeshStandardMaterial({ color: 0xf3c13b, metalness: 0.75, roughness: 0.2, emissive: 0x4d3400, emissiveIntensity: .25 }));
  body.rotation.x = Math.PI * 0.5;
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 16), body.material);
  fin.position.set(0, 0.46, -0.18);
  fin.rotation.x = Math.PI;
  shachi.add(body, fin);
  shachi.position.set(0, 1.18, -1.82);
  shachi.name = 'shachi';
  roofGroup.add(shachi);
  const eaveMat = new THREE.MeshStandardMaterial({ color: 0x7a4b2b, metalness: 0.18, roughness: 0.55 });
  const beam = new THREE.Mesh(new THREE.BoxGeometry(6.5, .22, .3), eaveMat);
  beam.position.set(0, -0.2, 2.05);
  roofGroup.add(beam);
  selectTile();
}

function createRainChains() {
  const copper = new THREE.MeshStandardMaterial({ color: 0xb36b34, metalness: 0.75, roughness: .25, emissive: 0x261006, emissiveIntensity: .18 });
  [-2.7, 0, 2.7].forEach((x, i) => {
    const gutter = new THREE.Mesh(new THREE.BoxGeometry(1.1, .12, .18), copper);
    gutter.position.set(x, -0.04, 2.65);
    gutter.name = `gutter-${i}`;
    scene.add(gutter);
    for (let j = 0; j < 5; j++) {
      const link = new THREE.Mesh(new THREE.TorusGeometry(.11, .025, 8, 14), copper);
      link.position.set(x, -0.32 - j * .25, 2.73);
      link.rotation.x = Math.PI / 2;
      scene.add(link);
    }
  });
  redrawWater();
}

function redrawWater() {
  waterGroup.clear();
  const mat = new THREE.LineBasicMaterial({ color: 0x79d7ff, transparent: true, opacity: 0.92 });
  const focusMat = new THREE.LineBasicMaterial({ color: 0xffe27a, transparent: true, opacity: 0.9 });
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * 1.8 + Math.sin(Date.now() / 700 + i) * .14;
    const points = [];
    for (let k = 0; k < 18; k++) {
      const t = k / 17;
      points.push(new THREE.Vector3(x + Math.sin(t * Math.PI * 2 + i) * .12, 1.4 - t * 1.2, -1.9 + t * 4.2));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    waterGroup.add(new THREE.Line(geo, mat));
  }
  if (state.focus >= 15 && !focusGroup.visible) {
    const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3, .05, 2.55), new THREE.Vector3(3, .05, 2.55)]), focusMat);
    waterGroup.add(ring);
  }
}

function createParticles() {
  const geo = new THREE.BufferGeometry();
  const verts = [];
  for (let i = 0; i < 220; i++) verts.push((Math.random() - .5) * 10, Math.random() * 8 - 1, Math.random() * 8 - 3);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  const rain = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x8fd9ff, size: .035, transparent: true, opacity: .55 }));
  rain.name = 'rain';
  scene.add(rain);
}

function resize() {
  const stage = $('#stage');
  const rect = stage.getBoundingClientRect();
  const w = Math.max(320, rect.width);
  const h = Math.max(240, rect.height);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function initAudio() {
  if (audio.ctx) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  audio.ctx = new Ctx();
  audio.enabled = true;
  window.__day046Audio = audio;
}
function tone(freq = 360, dur = 0.08, type = 'sine', gain = 0.05) {
  if (muted) return;
  initAudio();
  const ctx = audio.ctx;
  if (!ctx) return;
  ctx.resume?.();
  const osc = ctx.createOscillator();
  const vol = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  vol.gain.setValueAtTime(0.0001, ctx.currentTime);
  vol.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.01);
  vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(vol).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur + 0.02);
}

function startGame() {
  initAudio();
  audio.ctx?.resume?.();
  $('#menu').classList.add('hidden');
  running = true;
  paused = false;
  startTime = performance.now();
  tone(220, .12, 'triangle', .055);
  updateHelper('<strong>Storm started.</strong> Lift cracked tiles, seal overlaps, and catch the first rain stream in the near gutter.');
  loop();
  updateHud();
}
function restart() {
  Object.assign(state, { score: 0, hearts: 3, leak: 0, storm: 10, combo: 1, focus: 35, gutter: 0, ridge: 0, commission: 0, repairs: 0, chains: 0, wrongTiles: 0, ridgeSaves: 0, leafClogs: 2, sealCure: 0, blessing: false, elapsed: 0 });
  selectedRow = 0; selectedCol = 3; yaw = 0;
  setCommissionCracks();
  $('#resultOverlay').classList.add('hidden');
  $('#pauseOverlay').classList.add('hidden');
  $('#blessing').classList.add('hidden');
  running = true; paused = false; startTime = performance.now();
  tone(260, .1, 'triangle', .045);
  updateHelper('<strong>Restarted.</strong> Rotate before acting, then repair the most obvious crack.');
  updateHud();
}
function pause() { if (!running) return; paused = true; $('#pauseOverlay').classList.remove('hidden'); tone(180, .08, 'sine', .035); }
function resume() { paused = false; $('#pauseOverlay').classList.add('hidden'); tone(280, .08, 'sine', .035); }
function gameOver(reason) {
  running = false;
  paused = true;
  state.best = Math.max(state.best, state.score);
  localStorage.setItem(STORAGE, String(state.best));
  $('#resultTitle').textContent = state.blessing ? 'Blessing report' : 'Storm report';
  $('#resultText').textContent = `${reason} Score ${Math.round(state.score)} · leaks ${Math.round(state.leak)}% · storm ${Math.round(state.storm)}% · chain drains ${state.chains} · ridge saves ${state.ridgeSaves}.`;
  $('#resultOverlay').classList.remove('hidden');
}

function action(name) {
  if (name === 'audio') { muted = !muted; $('#audioBtn').textContent = `Audio: ${muted ? 'Off' : 'On'}`; tone(500, .05); return; }
  if (name === 'pause') return pause();
  if (name === 'resume') return resume();
  if (name === 'restart') return restart();
  if (!running || paused) return;
  const before = snapshot();
  switch (name) {
    case 'rowDown': selectedRow = Math.max(0, selectedRow - 1); selectedCol = clamp(selectedCol - 1, 0, 6); updateHelper('Selected a lower tile row; cracks near eaves are easier to seal.'); tone(310, .04); break;
    case 'rowUp': selectedRow = Math.min(3, selectedRow + 1); selectedCol = clamp(selectedCol + 1, 0, 6); updateHelper('Selected a higher tile row; ridge gust risk is now clearer.'); tone(330, .04); break;
    case 'rotateLeft': yaw -= Math.PI / 10; updateHelper('Rotated roof left. Hidden eave streams and back-face cracks moved into view.'); tone(240, .06, 'sawtooth', .035); break;
    case 'rotateRight': yaw += Math.PI / 10; updateHelper('Rotated roof right. Check the gutter alignment before sealing.'); tone(260, .06, 'sawtooth', .035); break;
    case 'liftTile': liftTile(); break;
    case 'sealCrack': sealCrack(); break;
    case 'slideGutter': state.gutter = (state.gutter + 1) % 3; score(180); updateHelper(`<strong>Slide Gutter:</strong> copper catch moved to ${['left','middle','right'][state.gutter]} stream.`); tone(360, .08, 'triangle', .055); break;
    case 'braceRidge': braceRidge(); break;
    case 'sweepLeaves': state.leafClogs = Math.max(0, state.leafClogs - 1); score(160); state.storm = Math.max(0, state.storm - 4); updateHelper('<strong>Sweep Leaves:</strong> cedar clog cleared before it slid into the gutter.'); tone(520, .06, 'triangle', .04); break;
    case 'ringChain': ringChain(); break;
    case 'moonGlaze': moonGlaze(); break;
    case 'shachiFocus': shachiFocus(); break;
  }
  selectTile();
  updateHud();
  window.__day046Debug.lastDelta = { before, after: snapshot(), action: name };
}

function liftTile() {
  const tile = currentTile();
  tile.position.y = tile.userData.baseY + 0.18;
  setTimeout(() => { if (tile) tile.position.y = tile.userData.baseY; }, 260);
  if (tile.userData.cracked && !tile.userData.fixed) {
    tile.userData.fixed = true;
    tile.userData.cracked = false;
    tile.material.color.set(0x40596b);
    tile.material.emissive?.set(0x174758);
    state.repairs++;
    score(280);
    state.focus = Math.min(100, state.focus + 13);
    state.leak = Math.max(0, state.leak - 8);
    updateHelper('<strong>Lift Tile:</strong> cracked kawara replaced with correct overlap. Rain path shifts toward the gutter.');
    tone(420, .09, 'triangle', .06);
  } else {
    state.wrongTiles++;
    state.storm += 7;
    state.combo = 1;
    updateHelper('<strong>Wrong tile.</strong> The roof groans; rotate or use Focus before replacing clean tiles.');
    tone(130, .12, 'square', .035);
  }
  maybeAdvanceCommission();
}
function sealCrack() {
  state.sealCure = Math.min(100, state.sealCure + 35);
  score(220);
  state.leak = Math.max(0, state.leak - 5);
  updateHelper('<strong>Seal Crack:</strong> moon glaze is curing along the overlap. Keep rain off it until it sets.');
  tone(620, .09, 'sine', .045);
}
function braceRidge() {
  const good = state.ridge > 35 || state.storm > 35;
  state.ridge = Math.max(0, state.ridge - (good ? 42 : 18));
  state.ridgeSaves += good ? 1 : 0;
  score(good ? 340 : 120);
  updateHelper(good ? '<strong>Brace Ridge:</strong> red gust caught perfectly; the gold shachi stays locked.' : '<strong>Brace Ridge:</strong> clamp set early. Helpful, but save it for red gust warnings.');
  tone(good ? 490 : 270, .1, 'triangle', .055);
  maybeAdvanceCommission();
}
function ringChain() {
  const good = state.gutter === Math.floor((Math.sin(state.elapsed / 3) + 1.5)) % 3;
  state.chains += good ? 1 : 0;
  state.leak += good ? -10 : 5;
  state.storm += good ? -4 : 3;
  score(good ? 300 : 90);
  updateHelper(good ? '<strong>Ring Rain Chain:</strong> blue pulse drained cleanly; hidden leak path revealed.' : '<strong>Chain mistimed.</strong> Slide the gutter under the stream, then ring on the blue drip pulse.');
  tone(good ? 740 : 180, .12, good ? 'sine' : 'square', .05);
  maybeAdvanceCommission();
}
function moonGlaze() {
  if (state.focus < 18) { updateHelper('Moon Glaze needs more Shachi Focus charge. Repair tiles or ring chains first.'); tone(160, .07, 'square', .03); return; }
  state.focus -= 18;
  state.sealCure = 100;
  state.leak = Math.max(0, state.leak - 8);
  state.storm = Math.max(0, state.storm - 4);
  score(260);
  updateHelper('<strong>Moon Glaze:</strong> pearl coat cured the active repair and highlighted safe downhill paths.');
  tone(820, .12, 'sine', .055);
}
function shachiFocus() {
  if (state.focus < 30) { updateHelper('Shachi Focus is not charged yet. Clean repairs and rain-chain drains build it.'); tone(150, .08, 'square', .03); return; }
  state.focus -= 30;
  focusGroup.visible = true;
  makeFocusOverlay();
  updateHelper('<strong>Shachi Focus:</strong> gold overlay previews cracks, gutter catches, gust side, ridge lift, and safest next repair.');
  tone(960, .15, 'sine', .05);
  setTimeout(() => { if (focusGroup) focusGroup.visible = false; }, 4200);
}
function makeFocusOverlay() {
  focusGroup.clear();
  const mat = new THREE.MeshBasicMaterial({ color: 0xf4c95d, transparent: true, opacity: .45, side: THREE.DoubleSide });
  for (const tile of tileMeshes.filter(t => t.userData.cracked)) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(.42, .49, 32), mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(tile.position).add(new THREE.Vector3(0, .18, 0));
    focusGroup.add(ring);
  }
  focusGroup.visible = true;
}
function maybeAdvanceCommission() {
  const target = COMMISSIONS[state.commission].target;
  const progress = state.repairs + state.chains + state.ridgeSaves;
  if (progress >= target) {
    score(1080);
    state.hearts = Math.min(3, state.hearts + 1);
    if (state.commission < 2) {
      state.commission++;
      state.repairs = 0; state.chains = 0; state.ridgeSaves = 0; state.leafClogs = 2 + state.commission;
      setCommissionCracks();
      updateHelper(`<strong>${COMMISSIONS[state.commission - 1].name} complete.</strong> New talisman stamped. Rotate into the next storm face.`);
    } else if (!state.blessing && state.score >= 6000) {
      state.blessing = true;
      $('#blessing').classList.remove('hidden');
      tone(1040, .22, 'sine', .065);
      setTimeout(() => $('#blessing').classList.add('hidden'), 3600);
      updateHelper('<strong>Shachi Moon-Roof Blessing!</strong> Rain becomes silver thread. Endless storm repairs are open.');
    }
  }
}
function setCommissionCracks() {
  tileMeshes.forEach(tile => {
    tile.userData.fixed = false;
    tile.userData.cracked = false;
    tile.material.color.set(0x263342);
    tile.material.emissive?.set(0x000000);
  });
  for (const [c, r] of COMMISSIONS[state.commission].cracks) {
    const tile = tileMeshes.find(t => t.userData.c === c && t.userData.r === r);
    if (tile) { tile.userData.cracked = true; tile.material.color.set(0x4a5361); tile.material.emissive?.set(0x300909); }
  }
  state.repairs = 0;
  selectTile();
}

function selectTile() {
  tileMeshes.forEach(t => t.scale.set(1,1,1));
  const tile = currentTile();
  if (tile) tile.scale.set(1.08, 1.5, 1.08);
}
function currentTile() {
  const r = clamp(selectedRow + 1, 0, 4);
  return tileMeshes.find(t => t.userData.r === r && t.userData.c === selectedCol) || tileMeshes[0];
}
function score(points) { state.score += Math.round(points * state.combo); state.combo = Math.min(5, state.combo + .12); state.best = Math.max(state.best, state.score); }
function updateHelper(html) { $('#helper').innerHTML = html; }
function updateHud() {
  $('#score').textContent = Math.round(state.score);
  $('#best').textContent = Math.round(Math.max(state.best, Number(localStorage.getItem(STORAGE) || 0)));
  $('#hearts').textContent = '♥'.repeat(Math.max(0, state.hearts));
  $('#leak').textContent = `${Math.round(clamp(state.leak, 0, 100))}%`;
  $('#storm').textContent = `${Math.round(clamp(state.storm, 0, 100))}%`;
  $('#combo').textContent = `x${state.combo.toFixed(1)}`;
  $('#row').textContent = ROW_NAMES[selectedRow];
  $('#face').textContent = FACE_NAMES[((Math.round(yaw / (Math.PI / 2)) % 4) + 4) % 4];
  $('#gutter').textContent = ['Left', 'Middle', 'Right'][state.gutter];
  $('#ridge').textContent = state.ridge > 55 ? 'Red gust' : state.ridge > 25 ? 'Wobble' : 'Calm';
  $('#focus').textContent = `${Math.round(state.focus)}%`;
  $('#time').textContent = `${Math.floor(state.elapsed / 60)}:${String(Math.floor(state.elapsed % 60)).padStart(2, '0')}`;
  const commission = COMMISSIONS[state.commission];
  $('#commissionName').textContent = `${commission.name} ${Math.min(commission.target, state.repairs + state.chains + state.ridgeSaves)}/${commission.target}`;
  $('#commissionText').textContent = commission.text;
  $('#repairMeter').value = Math.min(3, state.repairs);
  $('#chainMeter').value = Math.min(3, state.chains);
}

function loop(now = performance.now()) {
  cancelAnimationFrame(raf);
  if (!running) return;
  if (!paused) {
    state.elapsed = (now - startTime) / 1000;
    state.storm = clamp(state.storm + 0.006 + state.commission * 0.0018, 0, 100);
    state.leak = clamp(state.leak + (state.storm > 45 ? 0.012 : 0.004) - (state.sealCure > 80 ? 0.003 : 0), 0, 100);
    state.ridge = clamp(state.ridge + (Math.sin(state.elapsed * .95) > .88 ? .13 : .018), 0, 100);
    state.focus = clamp(state.focus + 0.012, 0, 100);
    if (state.sealCure > 0) state.sealCure = clamp(state.sealCure - .04, 0, 100);
    roofGroup.rotation.y += (yaw - roofGroup.rotation.y) * 0.08;
    roofGroup.rotation.x = -0.08 + selectedRow * 0.025 + Math.sin(state.elapsed * .7) * 0.015;
    const rain = scene.getObjectByName('rain');
    if (rain) {
      const pos = rain.geometry.attributes.position;
      for (let i = 1; i < pos.count * 3; i += 3) {
        pos.array[i] -= 0.055;
        if (pos.array[i] < -1.3) pos.array[i] = 7.2;
      }
      pos.needsUpdate = true;
    }
    if (Math.floor(state.elapsed * 3) % 3 === 0) redrawWater();
    if (state.leak >= 100 || state.storm >= 100 || state.hearts <= 0) gameOver('The storm entered the dry rooms.');
    updateHud();
  }
  renderer.render(scene, camera);
  raf = requestAnimationFrame(loop);
}

function onPointer(ev) {
  if (ev.type === 'pointerdown') ev.currentTarget.setPointerCapture?.(ev.pointerId);
  if (!running || paused) return;
  const rect = ev.currentTarget.getBoundingClientRect();
  const x = (ev.clientX - rect.left) / rect.width;
  const y = (ev.clientY - rect.top) / rect.height;
  selectedCol = clamp(Math.round(x * 6), 0, 6);
  selectedRow = clamp(3 - Math.round(y * 3.4), 0, 3);
  if (ev.buttons) yaw += (x - 0.5) * 0.025;
  selectTile();
  updateHud();
}
function snapshot() { return { score: state.score, leak: state.leak, storm: state.storm, focus: state.focus, row: selectedRow, col: selectedCol, gutter: state.gutter, repairs: state.repairs, chains: state.chains, ridge: state.ridge, commission: state.commission, blessing: state.blessing }; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function bind() {
  $('#startBtn').addEventListener('click', startGame);
  $$('[data-action]').forEach(el => el.addEventListener('click', () => action(el.dataset.action)));
  window.addEventListener('keydown', (ev) => {
    const map = { ArrowLeft: 'rotateLeft', a: 'rotateLeft', A: 'rotateLeft', ArrowRight: 'rotateRight', d: 'rotateRight', D: 'rotateRight', ArrowUp: 'rowUp', w: 'rowUp', W: 'rowUp', ArrowDown: 'rowDown', s: 'sealCrack', S: 'sealCrack', ' ': 'liftTile', Enter: 'liftTile', g: 'slideGutter', G: 'slideGutter', b: 'braceRidge', B: 'braceRidge', l: 'sweepLeaves', L: 'sweepLeaves', c: 'ringChain', C: 'ringChain', m: 'moonGlaze', M: 'moonGlaze', f: 'shachiFocus', F: 'shachiFocus', p: 'pause', P: 'pause', r: 'restart', R: 'restart' };
    if (map[ev.key]) { ev.preventDefault(); action(map[ev.key]); }
  });
  window.__day046Debug = {
    state: snapshot,
    click: action,
    forceBlessing() { state.score = 6500; state.repairs = 5; state.chains = 5; state.ridgeSaves = 3; state.commission = 2; maybeAdvanceCommission(); updateHud(); return snapshot(); },
    forceGameOver() { gameOver('Debug storm report forced.'); return snapshot(); },
    lastDelta: null
  };
}

init3d();
bind();
updateHud();
renderer.render(scene, camera);
