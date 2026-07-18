import * as THREE from './assets/three.module.js';

const $ = (id) => document.getElementById(id);
const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const layerNames = ['Near', 'Middle', 'Far'];
const bellNames = ['Gold', 'Jade', 'Vermilion'];
const gearSizes = [
  { name: 'Small', radius: 0.38, teeth: 12, torque: 0.78, color: 0xffd166 },
  { name: 'Medium', radius: 0.54, teeth: 18, torque: 1.0, color: 0xe4aa43 },
  { name: 'Large', radius: 0.72, teeth: 24, torque: 1.28, color: 0xc97b30 }
];
const axleLayout = [
  [ [-2.45, -0.76], [-1.20, 0.28], [0.05, -0.58], [1.18, 0.42], [2.30, -0.28] ],
  [ [-2.18, 0.58], [-1.04, -0.36], [0.12, 0.45], [1.18, -0.48], [2.36, 0.36] ],
  [ [-2.34, -0.10], [-1.05, 0.78], [0.24, -0.18], [1.36, 0.70], [2.46, -0.02] ]
];
const layerZ = [1.05, 0, -1.05];
const commissions = [
  {
    name: 'First Crank Blossom', timer: 110, bells: [{ name: 'Gold', layer: 0, axle: 3, dir: 1 }], couplers: 0, jamTarget: 60, oilRequired: false,
    hint: 'One plate: place gears from crank axle 1 toward the Gold bell axle 4.'
  },
  {
    name: 'Lantern Bell Relay', timer: 135, bells: [{ name: 'Gold', layer: 0, axle: 4, dir: -1 }, { name: 'Jade', layer: 1, axle: 3, dir: 1 }], couplers: 1, jamTarget: 48, oilRequired: true,
    hint: 'Use one coupler and Flip Direction to ring Gold then Jade safely.'
  },
  {
    name: 'Moon Fox Automaton', timer: 155, bells: [{ name: 'Gold', layer: 0, axle: 4, dir: 1 }, { name: 'Jade', layer: 1, axle: 4, dir: -1 }, { name: 'Vermilion', layer: 2, axle: 4, dir: 1 }], couplers: 2, jamTarget: 55, oilRequired: true, focusRequired: true,
    hint: 'Preview with Takumi Focus; hot axles and wrong-direction traps crack antique gears.'
  }
];

const store = {
  best: Number(localStorage.getItem('takumi.bestScore') || 0),
  grand: Number(localStorage.getItem('takumi.bestGrandTime') || 0),
  chain: Number(localStorage.getItem('takumi.noJamChain') || 0),
  endless: Number(localStorage.getItem('takumi.endless') || 0)
};

const state = {
  running: false, paused: false, gameOver: false, muted: false, audioReady: false,
  score: 0, hearts: 3, jam: 0, combo: 1, elapsed: 0, commissionIndex: 0, commissionStart: 0,
  activeLayer: 0, activeAxle: 1, selectedSize: 0, focus: 0, focusActive: 0, grand: false,
  gears: new Map(), couplers: new Set(), oiled: new Set(), hot: new Map(), powered: new Map(), bellAccuracy: { correct: 0, wrong: 0 },
  brokenAxles: 0, oilHits: 0, noJamChain: 0, endlessLevel: 0, message: 'Select a socket and place gears toward the Gold bell.',
  testing: 0, cameraYaw: -0.18, cameraPitch: 0.1
};

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x070914, 6, 16);
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas: $('gameCanvas'), antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const root = new THREE.Group();
scene.add(root);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const interactive = [];
const gearMeshes = new Map();
const socketMeshes = new Map();
const plateMeshes = [];
const torqueLines = new THREE.Group();
root.add(torqueLines);
const bellGroup = new THREE.Group();
root.add(bellGroup);
let audioCtx = null;

function assetUrl(name) { return new URL(`./assets/${name}`, import.meta.url).href; }

function initScene() {
  scene.background = new THREE.Color(0x070914);
  camera.position.set(0, 0.58, 7.2);
  const hemi = new THREE.HemisphereLight(0xffe2a0, 0x15172d, 2.4);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffc56b, 3.8);
  key.position.set(2.6, 4.2, 4.5);
  scene.add(key);
  const fill = new THREE.PointLight(0x78b7ff, 22, 7);
  fill.position.set(-3, 1.6, 2.2);
  scene.add(fill);
  const loader = new THREE.TextureLoader();
  loader.load(assetUrl('takumi-workshop.png'), (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(9, 13), new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.32 }));
    plane.position.set(0, 0, -4.2);
    plane.scale.set(1.1, 1.1, 1);
    scene.add(plane);
  });

  for (let l = 0; l < 3; l++) {
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(5.9, 2.38, 0.035),
      new THREE.MeshPhysicalMaterial({ color: [0xd78b42, 0x9cc8c7, 0x606fa8][l], transparent: true, opacity: 0.21, roughness: .48, metalness: .1, transmission: .2 })
    );
    plate.position.z = layerZ[l];
    plate.userData = { type: 'plate', layer: l };
    root.add(plate); plateMeshes.push(plate);
    const frame = new THREE.Mesh(new THREE.TorusGeometry(1, .015, 6, 120), new THREE.MeshBasicMaterial({ color: 0xffd66e, transparent: true, opacity: .42 }));
    frame.scale.set(3.0, 1.18, 0.03); frame.position.z = layerZ[l] + .03; root.add(frame);
    axleLayout[l].forEach(([x, y], a) => createSocket(l, a, x, y));
  }
  createCrank();
  createBells();
  makeFixedSource();
  rebuildGears();
}

function createSocket(layer, axle, x, y) {
  const geo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 36);
  const mat = new THREE.MeshStandardMaterial({ color: 0x2b1b16, emissive: 0x2a1608, metalness: .5, roughness: .35 });
  const socket = new THREE.Mesh(geo, mat);
  socket.rotation.x = Math.PI / 2;
  socket.position.set(x, y, layerZ[layer] + .08);
  socket.userData = { type: 'socket', layer, axle };
  root.add(socket); interactive.push(socket); socketMeshes.set(`${layer}:${axle}`, socket);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.23, .025, 8, 32), new THREE.MeshBasicMaterial({ color: 0xffd66e, transparent: true, opacity: .55 }));
  ring.position.copy(socket.position); ring.position.z += .035;
  root.add(ring);
}

function createCrank() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x9b5b2b, metalness: .2, roughness: .45 });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(.9, .08, .08), mat);
  bar.position.set(-3.18, -.72, layerZ[0] + .22); root.add(bar);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(.13, 20, 12), new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: .65, roughness: .22 }));
  knob.position.set(-3.62, -.72, layerZ[0] + .22); root.add(knob);
}

function createBells() {
  bellGroup.clear();
  commissions[2].bells.forEach((b, i) => {
    const [x, y] = axleLayout[b.layer][b.axle];
    const bell = new THREE.Group();
    bell.position.set(x + .55, y + .62, layerZ[b.layer] + .22);
    const body = new THREE.Mesh(new THREE.ConeGeometry(.2, .34, 32, 1, true), new THREE.MeshStandardMaterial({ color: [0xf8d56a, 0x69d9b8, 0xff6d47][i], metalness: .8, roughness: .18 }));
    body.rotation.x = Math.PI;
    bell.add(body);
    const hammer = new THREE.Mesh(new THREE.BoxGeometry(.06, .38, .05), new THREE.MeshStandardMaterial({ color: 0x5a2e1e }));
    hammer.position.y = -.28; bell.add(hammer);
    bell.userData = { name: b.name };
    bellGroup.add(bell);
  });
}

function makeFixedSource() {
  state.gears.set('0:0', { layer: 0, axle: 0, size: 1, dir: 1, fixed: true, flip: false });
}

function createGearMesh(gear) {
  const size = gearSizes[gear.size];
  const [x, y] = axleLayout[gear.layer][gear.axle];
  const group = new THREE.Group();
  group.position.set(x, y, layerZ[gear.layer] + .18);
  const mat = new THREE.MeshStandardMaterial({ color: size.color, metalness: .8, roughness: .2, emissive: gear.fixed ? 0x301802 : 0x000000 });
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(size.radius, size.radius, .13, 64), mat);
  wheel.rotation.x = Math.PI / 2; group.add(wheel);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(size.radius * .24, size.radius * .24, .18, 32), new THREE.MeshStandardMaterial({ color: 0xffe2a0, metalness: .88, roughness: .18 }));
  hub.rotation.x = Math.PI / 2; hub.position.z = .02; group.add(hub);
  for (let i = 0; i < size.teeth; i++) {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(.065, .13, .15), mat);
    const ang = i / size.teeth * Math.PI * 2;
    tooth.position.set(Math.cos(ang) * (size.radius + .055), Math.sin(ang) * (size.radius + .055), 0);
    tooth.rotation.z = ang; group.add(tooth);
  }
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(.08, .22, 3), new THREE.MeshBasicMaterial({ color: gear.flip ? 0x88f7ff : 0xffffff }));
  arrow.position.set(size.radius * .65, 0, .14); arrow.rotation.z = gear.dir < 0 ? Math.PI / 2 : -Math.PI / 2; group.add(arrow);
  group.userData = { type: 'gear', layer: gear.layer, axle: gear.axle };
  interactive.push(group); root.add(group); return group;
}

function rebuildGears() {
  for (const mesh of gearMeshes.values()) root.remove(mesh);
  gearMeshes.clear();
  for (let i = interactive.length - 1; i >= 0; i--) if (interactive[i].userData?.type === 'gear') interactive.splice(i, 1);
  for (const [key, gear] of state.gears) gearMeshes.set(key, createGearMesh(gear));
  rebuildCouplerVisuals();
  updateSelectionVisuals();
}

function rebuildCouplerVisuals() {
  const old = root.getObjectByName('couplers'); if (old) root.remove(old);
  const group = new THREE.Group(); group.name = 'couplers';
  const mat = new THREE.MeshBasicMaterial({ color: 0x86f7ff, transparent: true, opacity: .85 });
  for (const c of state.couplers) {
    const [layer, axle] = c.split(':').map(Number);
    if (layer >= 2) continue;
    const [x, y] = axleLayout[layer][axle];
    const z1 = layerZ[layer] + .26; const z2 = layerZ[layer + 1] + .26;
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(.055, .055, Math.abs(z1 - z2), 16), mat);
    cyl.rotation.x = Math.PI / 2; cyl.position.set(x, y, (z1 + z2) / 2);
    group.add(cyl);
  }
  root.add(group);
}

function key(layer = state.activeLayer, axle = state.activeAxle) { return `${layer}:${axle}`; }
function getCommission() { return commissions[Math.min(state.commissionIndex, commissions.length - 1)]; }
function currentGear() { return state.gears.get(key()); }

function meshValid(layer, axle, sizeIndex) {
  if (layer === 0 && axle === 0) return { ok: false, reason: 'The hand crank gear is fixed.' };
  const pos = axleLayout[layer][axle];
  const radius = gearSizes[sizeIndex].radius;
  let contacts = 0;
  for (const gear of state.gears.values()) {
    if (gear.layer !== layer) continue;
    const [gx, gy] = axleLayout[gear.layer][gear.axle];
    const d = Math.hypot(gx - pos[0], gy - pos[1]);
    const sum = radius + gearSizes[gear.size].radius;
    if (d < Math.abs(radius - gearSizes[gear.size].radius) + .18) return { ok: false, reason: 'Invalid overlap: tooth rings collide.' };
    if (Math.abs(d - sum) < .48) contacts++;
  }
  const cKey = `${Math.max(0, layer - 1)}:${axle}`;
  if (state.couplers.has(`${layer}:${axle}`) || state.couplers.has(cKey)) contacts++;
  if (!contacts) return { ok: false, reason: 'Missing mesh: place near an existing gear or coupler.' };
  return { ok: true, reason: 'Gold mesh preview: teeth will transfer torque.' };
}

function placeGear() {
  if (!state.running || state.paused) return;
  const k = key();
  if (state.gears.has(k)) { setMessage('That axle already holds a gear. Remove or flip it.'); beep('warn'); return; }
  const valid = meshValid(state.activeLayer, state.activeAxle, state.selectedSize);
  if (!valid.ok) { setMessage(valid.reason); addJam(4); beep('warn'); return; }
  state.gears.set(k, { layer: state.activeLayer, axle: state.activeAxle, size: state.selectedSize, dir: 1, fixed: false, flip: false });
  state.score += Math.round(135 * state.combo); state.combo = Math.min(9, state.combo + .25); state.focus = clamp(state.focus + 9, 0, 100);
  state.hot.set(k, clamp((state.hot.get(k) || 0) + 16 + state.selectedSize * 3, 0, 100));
  setMessage(`${gearSizes[state.selectedSize].name} gear installed; tooth mesh glows through layer ${layerNames[state.activeLayer]}.`);
  beep('place'); rebuildGears(); evaluatePower(); updateUI();
}

function removeGear() {
  const g = currentGear();
  if (!g || g.fixed) { setMessage('The selected axle has no removable gear.'); beep('warn'); return; }
  state.gears.delete(key()); state.hot.delete(key()); state.oiled.delete(key());
  setMessage('Gear removed from highlighted axle.'); beep('clack'); rebuildGears(); evaluatePower(); updateUI();
}

function flipDirection() {
  const g = currentGear();
  if (!g) { setMessage('Place a gear first, then add an idler flip.'); beep('warn'); return; }
  g.flip = !g.flip;
  state.score += 60; state.focus = clamp(state.focus + 5, 0, 100);
  setMessage(g.flip ? 'Idler behavior added: arrows invert after this gear.' : 'Idler removed: standard alternating tooth direction restored.');
  beep('clack'); rebuildGears(); evaluatePower(); updateUI();
}

function toggleCoupler() {
  const com = getCommission();
  if (state.activeLayer >= 2) { setMessage('Depth couplers connect Near→Middle or Middle→Far only.'); beep('warn'); return; }
  const k = key();
  if (state.couplers.has(k)) { state.couplers.delete(k); setMessage('Depth coupler removed from matching axle pair.'); beep('clack'); }
  else {
    const used = state.couplers.size;
    const limit = com.couplers + Math.max(0, state.endlessLevel - 1);
    if (used >= limit) { setMessage('Coupler limit reached for this commission.'); beep('warn'); return; }
    state.couplers.add(k); state.score += 210; state.focus = clamp(state.focus + 12, 0, 100); setMessage('Depth coupler thunk: torque can cross to the next plate.'); beep('coupler');
  }
  rebuildCouplerVisuals(); evaluatePower(); updateUI();
}

function oilAxle() {
  const k = key();
  const heat = state.hot.get(k) || 0;
  if (!state.gears.has(k)) { setMessage('Oil needs a gear axle; select a hot installed gear.'); beep('warn'); return; }
  const sweet = heat >= 42 && heat <= 82;
  state.oiled.add(k); state.hot.set(k, Math.max(0, heat - (sweet ? 48 : 25))); state.jam = Math.max(0, state.jam - (sweet ? 9 : 4));
  if (sweet) { state.score += 155; state.oilHits++; state.focus = clamp(state.focus + 10, 0, 100); setMessage('Perfect oil window: heat drops and teeth purr smoothly.'); }
  else { state.score = Math.max(0, state.score - 25); setMessage('Oil applied. Good safety, but outside the perfect sweet window.'); }
  beep('oil'); updateUI();
}

function activateFocus() {
  if (state.focus < 35) { setMessage('Takumi Focus needs more clean mesh charge.'); beep('warn'); return; }
  state.focus = Math.max(0, state.focus - 35); state.focusActive = 7; state.score += 90;
  setMessage('Takumi Focus: torque paths, bell order numbers, hot axles, and wrong directions previewed.');
  beep('focus'); evaluatePower(); updateUI();
}

function selectLayer(delta) { state.activeLayer = (state.activeLayer + delta + 3) % 3; setMessage(`Active depth plate: ${layerNames[state.activeLayer]}.`); beep('tick'); updateSelectionVisuals(); updateUI(); }
function selectAxle(delta) { state.activeAxle = (state.activeAxle + delta + axleLayout[state.activeLayer].length) % axleLayout[state.activeLayer].length; setMessage(`Highlighted axle ${state.activeAxle + 1} on ${layerNames[state.activeLayer]}.`); beep('tick'); updateSelectionVisuals(); updateUI(); }
function cycleSize(delta = 1) { state.selectedSize = (state.selectedSize + delta + gearSizes.length) % gearSizes.length; setMessage(`Ghost preview size: ${gearSizes[state.selectedSize].name} (${gearSizes[state.selectedSize].teeth} teeth).`); beep('tick'); updateUI(); }
function addJam(v) { state.jam = clamp(state.jam + v, 0, 100); if (state.jam >= 100) endRun('Jam meter reached 100%.'); }
function setMessage(msg) { state.message = msg; $('statusText').textContent = msg; }

function evaluatePower() {
  state.powered.clear(); torqueLines.clear();
  if (!state.gears.has('0:0')) return [];
  const queue = [{ k: '0:0', dir: 1, torque: 32, order: 0 }];
  const seen = new Set(); const path = [];
  while (queue.length) {
    const cur = queue.shift(); if (seen.has(cur.k)) continue; seen.add(cur.k);
    const gear = state.gears.get(cur.k); if (!gear) continue;
    gear.dir = cur.dir; state.powered.set(cur.k, { dir: cur.dir, torque: cur.torque, order: cur.order }); path.push(cur.k);
    for (const [nk, ng] of state.gears) {
      if (seen.has(nk) || nk === cur.k) continue;
      let neighbor = false; let nextDir = -cur.dir;
      const sameLayer = ng.layer === gear.layer;
      if (sameLayer) {
        const [x1, y1] = axleLayout[gear.layer][gear.axle], [x2, y2] = axleLayout[ng.layer][ng.axle];
        const d = Math.hypot(x1 - x2, y1 - y2), sum = gearSizes[gear.size].radius + gearSizes[ng.size].radius;
        neighbor = Math.abs(d - sum) < .52;
      }
      const sameAxleCoupled = ng.axle === gear.axle && Math.abs(ng.layer - gear.layer) === 1 && state.couplers.has(`${Math.min(ng.layer, gear.layer)}:${gear.axle}`);
      if (sameAxleCoupled) { neighbor = true; nextDir = cur.dir; }
      if (neighbor) {
        if (gear.flip) nextDir *= -1;
        const ratioLoad = gearSizes[ng.size].torque / gearSizes[gear.size].torque;
        queue.push({ k: nk, dir: nextDir, torque: clamp(cur.torque * ratioLoad + (sameAxleCoupled ? 11 : 4), 0, 130), order: cur.order + 1 });
      }
    }
  }
  drawTorqueLines(path);
  for (const [k, p] of state.powered) {
    const mat = gearMeshes.get(k)?.children[0]?.material;
    if (mat?.emissive) mat.emissive.setHex(p.torque > 85 ? 0x661000 : 0x1f1200);
  }
  return path;
}

function drawTorqueLines(path) {
  const material = new THREE.LineBasicMaterial({ color: state.focusActive > 0 ? 0x86f7ff : 0xffd66e, transparent: true, opacity: state.focusActive > 0 ? .92 : .58 });
  for (let i = 0; i < path.length - 1; i++) {
    const a = state.gears.get(path[i]); const b = state.gears.get(path[i + 1]); if (!a || !b) continue;
    const [x1, y1] = axleLayout[a.layer][a.axle], [x2, y2] = axleLayout[b.layer][b.axle];
    const points = [new THREE.Vector3(x1, y1, layerZ[a.layer] + .42), new THREE.Vector3(x2, y2, layerZ[b.layer] + .42)];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
    torqueLines.add(line);
  }
}

function testCrank() {
  if (!state.running || state.paused) return;
  const com = getCommission();
  const path = evaluatePower();
  if (path.length < 2) { setMessage('The crank spins alone. Mesh at least one gear into the train.'); addJam(6); beep('warn'); updateUI(); return; }
  state.testing = 3.2;
  let testJam = 0; let broken = 0; let hits = [];
  for (const [k, p] of state.powered) {
    const heat = clamp((state.hot.get(k) || 12) + p.torque * .18 + Math.random() * 10 - (state.oiled.has(k) ? 18 : 0), 0, 100);
    state.hot.set(k, heat);
    if (heat > 78 || p.torque > 95) { testJam += 7; }
    if (heat > 96 || p.torque > 118) { broken++; }
  }
  for (const target of com.bells) {
    const p = state.powered.get(`${target.layer}:${target.axle}`);
    if (p) hits.push({ ...target, dir: p.dir, torque: p.torque });
  }
  const ordered = hits.length === com.bells.length && hits.every((hit, i) => hit.name === com.bells[i].name && hit.dir === com.bells[i].dir);
  const anyWrong = hits.some((hit, i) => !com.bells[i] || hit.name !== com.bells[i].name || hit.dir !== com.bells[i].dir);
  if (com.oilRequired && ![...state.oiled].some((k) => state.powered.has(k))) testJam += 9;
  if (com.focusRequired && state.focusActive <= 0) testJam += 10;
  state.jam = clamp(state.jam + testJam, 0, 100);
  state.brokenAxles += broken;
  if (broken) { state.hearts = Math.max(0, state.hearts - broken); setMessage(`${broken} axle${broken > 1 ? 's' : ''} cracked under overload! Oil or step down the ratio.`); beep('warn'); }
  if (ordered && state.jam <= com.jamTarget && (!com.oilRequired || [...state.oiled].some((k) => state.powered.has(k)))) {
    state.bellAccuracy.correct += com.bells.length;
    state.score += 940 + Math.round(1200 * Math.max(0, (com.jamTarget - state.jam) / com.jamTarget)) + Math.round(260 * state.combo);
    state.combo = Math.min(10, state.combo + 1);
    state.noJamChain = state.jam < 15 ? state.noJamChain + 1 : state.noJamChain;
    state.focus = clamp(state.focus + 25, 0, 100);
    state.hearts = Math.min(3, state.hearts + 1);
    ringBells(com.bells.length);
    advanceCommission();
  } else {
    if (anyWrong || hits.length) state.bellAccuracy.wrong++;
    state.combo = 1;
    if (hits.length) { addJam(anyWrong ? 10 : 6); setMessage('Bell order or spin direction is wrong. Use Flip Direction or Focus preview.'); }
    else { addJam(8); setMessage('No target bells rang. Couple layers or extend the gear train.'); }
    beep('warn');
  }
  if (state.hearts <= 0 || state.brokenAxles >= 3) endRun('Three mechanism hearts broke.');
  updateUI();
}

function advanceCommission() {
  const completed = getCommission().name;
  state.commissionIndex++;
  state.commissionStart = state.elapsed;
  state.gears = new Map([...state.gears].filter(([k, g]) => g.fixed || state.commissionIndex < 2));
  if (!state.gears.has('0:0')) makeFixedSource();
  state.oiled.clear(); state.hot.clear(); state.powered.clear(); state.couplers.clear(); state.activeLayer = 0; state.activeAxle = 1;
  if (state.commissionIndex >= commissions.length && !state.grand && state.score >= 5000) triggerGrand();
  if (state.commissionIndex >= commissions.length) {
    state.endlessLevel++; state.commissionIndex = commissions.length - 1; state.score += 420 + state.endlessLevel * 90;
    setMessage(`${completed} sealed! Endless mechanism ${state.endlessLevel}: denser torque and hotter antique gears await.`);
  } else {
    setMessage(`${completed} sealed! Next commission: ${getCommission().name}.`);
  }
  rebuildGears(); updateUI(); beep('bell');
}

function triggerGrand() {
  state.grand = true; state.score += 2600;
  const time = Math.floor(state.elapsed);
  if (!store.grand || time < store.grand) { store.grand = time; localStorage.setItem('takumi.bestGrandTime', String(time)); }
  $('grandBanner').classList.remove('hidden'); setTimeout(() => $('grandBanner').classList.add('hidden'), 3600);
  beep('grand');
}

function endRun(reason) {
  state.gameOver = true; state.running = false;
  if (state.score > store.best) { store.best = state.score; localStorage.setItem('takumi.bestScore', String(state.score)); }
  if (state.noJamChain > store.chain) { store.chain = state.noJamChain; localStorage.setItem('takumi.noJamChain', String(state.noJamChain)); }
  if (state.endlessLevel > store.endless) { store.endless = state.endlessLevel; localStorage.setItem('takumi.endless', String(state.endlessLevel)); }
  $('resultTitle').textContent = reason.includes('Grand') ? 'Takumi Grand Mechanism' : 'Workshop Results';
  $('resultStats').innerHTML = [
    ['Final score', state.score], ['Best score', store.best], ['Commission reached', getCommission().name], ['Grand Mechanism', state.grand ? 'Unlocked' : 'Not yet'],
    ['Bell accuracy', `${state.bellAccuracy.correct} correct / ${state.bellAccuracy.wrong} wrong`], ['Jam finish', `${Math.round(state.jam)}%`], ['Axles broken', state.brokenAxles], ['Oil windows hit', state.oilHits], ['Badges', badgeText()]
  ].map(([a,b]) => `<span><strong>${a}</strong><em>${b}</em></span>`).join('');
  $('resultOverlay').classList.remove('hidden'); updateUI();
}

function badgeText() {
  const badges = [];
  if (state.noJamChain) badges.push('Zero-jam seal');
  if (state.grand && state.elapsed < 285) badges.push('Swift Grand');
  if (state.brokenAxles === 0) badges.push('No cracked axles');
  if (state.jam < 15) badges.push('Low-jam finish');
  if (state.hearts === 3) badges.push('All hearts');
  return badges.join(', ') || 'Practice seal';
}

function ringBells(count) {
  [...bellGroup.children].slice(0, count).forEach((bell, i) => {
    setTimeout(() => { bell.rotation.z = .22; setTimeout(() => { bell.rotation.z = 0; }, 180); beep('bell'); }, i * 170);
  });
}

function resetRun() {
  Object.assign(state, { running: true, paused: false, gameOver: false, score: 0, hearts: 3, jam: 0, combo: 1, elapsed: 0, commissionIndex: 0, commissionStart: 0, activeLayer: 0, activeAxle: 1, selectedSize: 0, focus: 0, focusActive: 0, grand: false, bellAccuracy: { correct: 0, wrong: 0 }, brokenAxles: 0, oilHits: 0, noJamChain: 0, endlessLevel: 0, testing: 0 });
  state.gears = new Map(); state.couplers = new Set(); state.oiled = new Set(); state.hot = new Map(); state.powered = new Map(); makeFixedSource();
  $('resultOverlay').classList.add('hidden'); $('pauseOverlay').classList.add('hidden'); $('grandBanner').classList.add('hidden');
  setMessage('First Crank Blossom: build from the crank gear to the Gold bell axle.'); rebuildGears(); updateUI();
}

function pauseToggle(force) {
  if (!state.running && !state.paused) return;
  state.paused = typeof force === 'boolean' ? force : !state.paused;
  $('pauseOverlay').classList.toggle('hidden', !state.paused);
  $('pauseTitle').textContent = state.paused ? 'Paused' : 'Running';
  updateUI();
}

function updateSelectionVisuals() {
  for (const [k, mesh] of socketMeshes) {
    const [l, a] = k.split(':').map(Number);
    const selected = l === state.activeLayer && a === state.activeAxle;
    mesh.material.emissive.setHex(selected ? 0x5eeaff : 0x2a1608);
    mesh.scale.setScalar(selected ? 1.38 : 1);
  }
  plateMeshes.forEach((p, i) => { p.material.opacity = i === state.activeLayer ? .34 : .16; p.scale.set(i === state.activeLayer ? 1.02 : 1, i === state.activeLayer ? 1.04 : 1, 1); });
}

function updateUI() {
  const com = getCommission(); const remaining = Math.max(0, com.timer - (state.elapsed - state.commissionStart));
  $('score').textContent = Math.round(state.score); $('best').textContent = store.best; $('menuBest').textContent = store.best;
  $('menuGrand').textContent = store.grand ? fmtTime(store.grand) : '—'; $('hearts').textContent = state.hearts; $('jam').textContent = `${Math.round(state.jam)}%`; $('combo').textContent = `${state.combo.toFixed( state.combo % 1 ? 1 : 0)}x`; $('elapsed').textContent = fmtTime(state.elapsed);
  $('layerReadout').textContent = `Layer: ${layerNames[state.activeLayer]}`; $('axleReadout').textContent = `Axle: ${state.activeAxle + 1}`; $('gearReadout').textContent = `Gear: ${gearSizes[state.selectedSize].name}`;
  const p = state.powered.get(key()); $('torqueReadout').textContent = `Torque: ${Math.round(p?.torque || 0)}%`; $('focusReadout').textContent = `Focus: ${Math.round(state.focus)}%`;
  $('gearSizeBtn').textContent = `Gear Size: ${gearSizes[state.selectedSize].name}`;
  $('audioBtn').textContent = state.muted ? '🔇' : '🔊'; $('audioOverlayBtn').textContent = `Audio: ${state.muted ? 'Off' : 'On'}`;
  const bells = com.bells.map((b, i) => `<span class="mini-chip">${i + 1}. ${b.name} ${b.dir > 0 ? '↻' : '↺'} L${b.layer + 1}-A${b.axle + 1}</span>`).join(' ');
  $('commissionCard').innerHTML = `<strong>${com.name}</strong> · ${bells}<br><span>${com.hint}</span><br><span>Timer ${fmtTime(remaining)} · Couplers ${state.couplers.size}/${com.couplers + Math.max(0, state.endlessLevel - 1)} · Jam target ${com.jamTarget}%${com.oilRequired ? ' · Oil required' : ''}${com.focusRequired ? ' · Focus preview required' : ''}</span>`;
  $('focusBtn').disabled = state.focus < 35;
  if (state.running && remaining <= 0) endRun('Commission timer expired.');
}

function initAudio() {
  if (state.audioReady) { window.__day036Audio = { ctx: audioCtx, enabled: true }; return; }
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); state.audioReady = true; window.__day036Audio = { ctx: audioCtx, enabled: true }; }
  catch { state.audioReady = false; window.__day036Audio = { ctx: null, enabled: false }; }
}
function beep(type) {
  if (!state.audioReady || state.muted || !audioCtx) return;
  const now = audioCtx.currentTime;
  const data = {
    tick: [520, .045, 'sine'], place: [780, .075, 'square'], clack: [240, .07, 'triangle'], coupler: [180, .11, 'sawtooth'], oil: [940, .12, 'sine'], warn: [95, .18, 'sawtooth'], bell: [880, .32, 'sine'], focus: [1240, .18, 'triangle'], grand: [660, .55, 'sine']
  }[type] || [440, .08, 'sine'];
  const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
  osc.type = data[2]; osc.frequency.setValueAtTime(data[0], now); if (type === 'grand') osc.frequency.exponentialRampToValueAtTime(1320, now + data[1]);
  gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(type === 'warn' ? .08 : .045, now + .012); gain.gain.exponentialRampToValueAtTime(.0001, now + data[1]);
  osc.connect(gain).connect(audioCtx.destination); osc.start(now); osc.stop(now + data[1] + .03);
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(.033, clock.getDelta());
  if (state.running && !state.paused) {
    state.elapsed += dt; state.testing = Math.max(0, state.testing - dt); state.focusActive = Math.max(0, state.focusActive - dt);
    for (const [k, mesh] of gearMeshes) {
      const p = state.powered.get(k); const speed = state.testing > 0 ? 7.5 : (state.focusActive > 0 && p ? 1.2 : .25);
      if (p) mesh.rotation.z += dt * speed * p.dir * (state.focusActive > 0 ? .35 : 1);
      else mesh.rotation.z += dt * .05;
    }
    if (Math.floor(state.elapsed * 4) % 4 === 0) for (const [k, h] of state.hot) state.hot.set(k, Math.max(0, h - dt * (state.oiled.has(k) ? 8 : 2)));
  }
  root.rotation.y += (state.cameraYaw - root.rotation.y) * .08;
  root.rotation.x += (state.cameraPitch - root.rotation.x) * .08;
  torqueLines.visible = state.focusActive > 0 || state.testing > 0;
  updateUI(); renderer.render(scene, camera);
}
const clock = new THREE.Clock();

function resize() {
  const canvas = $('gameCanvas'); const rect = canvas.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / Math.max(1, rect.height); camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

let drag = null;
$('gameCanvas').addEventListener('pointerdown', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera); const hits = raycaster.intersectObjects(interactive, true);
  let obj = hits[0]?.object;
  while (obj && !obj.userData?.type) obj = obj.parent;
  if (obj?.userData?.type === 'socket' || obj?.userData?.type === 'gear') {
    state.activeLayer = obj.userData.layer; state.activeAxle = obj.userData.axle; setMessage(`Selected ${layerNames[state.activeLayer]} axle ${state.activeAxle + 1}.`); beep('tick'); updateSelectionVisuals(); updateUI();
  }
  drag = { x: event.clientX, y: event.clientY, yaw: state.cameraYaw, pitch: state.cameraPitch };
});
window.addEventListener('pointermove', (event) => {
  if (!drag || event.buttons === 0) return;
  state.cameraYaw = clamp(drag.yaw + (event.clientX - drag.x) * .005, -0.75, 0.75);
  state.cameraPitch = clamp(drag.pitch + (event.clientY - drag.y) * .003, -0.28, 0.32);
});
window.addEventListener('pointerup', () => { drag = null; });

function bind(id, fn) { $(id).addEventListener('click', fn); }
bind('startBtn', async () => { initAudio(); if (audioCtx?.state === 'suspended') await audioCtx.resume(); $('titleScreen').classList.add('hidden'); resetRun(); beep('grand'); });
bind('pauseBtn', () => pauseToggle(true)); bind('resumeBtn', () => pauseToggle(false)); bind('restartBtn', resetRun); bind('restartOverlayBtn', resetRun); bind('resultRestartBtn', resetRun);
bind('audioBtn', () => { initAudio(); state.muted = !state.muted; updateUI(); }); bind('audioOverlayBtn', () => { state.muted = !state.muted; updateUI(); });
bind('layerPrevBtn', () => selectLayer(-1)); bind('layerNextBtn', () => selectLayer(1)); bind('axlePrevBtn', () => selectAxle(-1)); bind('axleNextBtn', () => selectAxle(1));
bind('gearSizeBtn', () => cycleSize(1)); bind('placeBtn', placeGear); bind('flipBtn', flipDirection); bind('couplerBtn', toggleCoupler); bind('oilBtn', oilAxle); bind('removeBtn', removeGear); bind('testBtn', testCrank); bind('focusBtn', activateFocus);
window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
  const k = e.key.toLowerCase();
  if (k === 'p') pauseToggle(); else if (k === 'r') resetRun(); else if (k === 'w' || e.key === 'ArrowUp') selectLayer(1); else if (k === 's' || e.key === 'ArrowDown') selectLayer(-1); else if (k === 'a' || e.key === 'ArrowLeft') selectAxle(-1); else if (k === 'd' || e.key === 'ArrowRight') selectAxle(1);
  else if (['1','2','3'].includes(k)) { state.selectedSize = Number(k) - 1; cycleSize(0); } else if (k === 'q' || k === 'e') cycleSize(k === 'q' ? -1 : 1); else if (k === ' ' || k === 'enter') { e.preventDefault(); placeGear(); }
  else if (k === 'f') flipDirection(); else if (k === 'c') toggleCoupler(); else if (k === 'o') oilAxle(); else if (k === 'x' || k === 'backspace') removeGear(); else if (k === 'k') testCrank(); else if (k === 'shift' || k === 't') activateFocus();
});

initScene(); resize(); updateUI(); animate();
