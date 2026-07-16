import * as THREE from './assets/three.module.js';

const $ = (id) => document.getElementById(id);
const storageKey = 'day034-temari-thread-orbit-weaver';
const silkPalette = {
  indigo: { name: 'Indigo', hex: 0x283a8e, css: '#4f67d9' },
  vermilion: { name: 'Vermilion', hex: 0xd95b43, css: '#e76f51' },
  gold: { name: 'Gold', hex: 0xd9af54, css: '#f0c75f' },
  jade: { name: 'Jade', hex: 0x5fbf91, css: '#73d8a5' },
  ivory: { name: 'Ivory', hex: 0xf2ead2, css: '#f7edd0' }
};
const silkNames = Object.keys(silkPalette);

const commissions = [
  {
    name: 'First Star Wrap', timer: 96, tangleLimit: 55, wraps: 3, pearls: 1, colors: ['indigo', 'gold'], rings: ['North Star', 'Equator'], symmetry: 62,
    goals: ['3 broad wraps', 'Indigo + gold silk', '1 pearl intersection', 'Tangle under 55%']
  },
  {
    name: 'Kagome Lantern Lattice', timer: 125, tangleLimit: 42, wraps: 5, pearls: 3, colors: ['indigo', 'vermilion', 'gold', 'jade'], rings: ['Diagonal A', 'Diagonal B', 'Equator'], symmetry: 78,
    goals: ['5 lattice wraps', '3 gold pearl locks', 'Over/under crossing order', 'Symmetry 78%+']
  },
  {
    name: 'Moon Festival Temari', timer: 150, tangleLimit: 35, wraps: 7, pearls: 4, colors: ['indigo', 'vermilion', 'gold', 'jade', 'ivory'], rings: ['North Star', 'Diagonal A', 'Diagonal B', 'Moon Meridian'], symmetry: 86,
    goals: ['5-color symmetry', '4 pearl locks', 'Use Kagome Focus', 'Tangle under 35%']
  }
];

const rings = [
  { name: 'North Star', type: 'latitude', y: 0.62, axis: 'y', color: 0xf2ead2 },
  { name: 'Equator', type: 'latitude', y: 0, axis: 'y', color: 0xd9af54 },
  { name: 'South Lantern', type: 'latitude', y: -0.58, axis: 'y', color: 0xf2ead2 },
  { name: 'Moon Meridian', type: 'longitude', angle: 0, color: 0x87a1ff },
  { name: 'Sun Meridian', type: 'longitude', angle: Math.PI / 2, color: 0xffd479 },
  { name: 'Diagonal A', type: 'diagonal', tilt: 0.72, angle: Math.PI / 4, color: 0x7be0ae },
  { name: 'Diagonal B', type: 'diagonal', tilt: -0.72, angle: -Math.PI / 4, color: 0xe76f51 }
];
const pinCount = 12;

let scene, camera, renderer, sphere, stageGroup, guideGroup, pinGroup, threadGroup, ghostLine, reticle;
let lastFrame = performance.now();
let audioCtx = null;
let startedOnce = false;
let muted = false;
let running = false;
let paused = false;
let pointerDown = false;
let pointerMoved = false;
let lastPointer = { x: 0, y: 0 };

const state = freshState();
const best = loadBest();

function freshState() {
  return {
    score: 0, combo: 1, hearts: 3, snaps: 0, tangle: 0, tension: 50, symmetry: 70, focus: 60, elapsed: 0,
    selectedRing: 0, selectedPin: 0, selectedColor: 'indigo', startAnchor: null, endAnchor: null,
    wraps: [], pearls: [], commissionIndex: 0, commissionWraps: 0, commissionPearls: 0, undoCharges: 1,
    longestChain: 0, cleanChain: 0, grand: false, endless: 0, latestWarning: 'Choose a start pin on the glowing guide ring.', focusTimer: 0,
    commissionStartedAt: 0, focusUsedOnCommission: false
  };
}

function loadBest() {
  try {
    return Object.assign({ score: 0, grandTime: null, longestChain: 0, endless: 0, badges: [] }, JSON.parse(localStorage.getItem(storageKey) || '{}'));
  } catch { return { score: 0, grandTime: null, longestChain: 0, endless: 0, badges: [] }; }
}
function saveBest() {
  best.score = Math.max(best.score || 0, state.score);
  best.longestChain = Math.max(best.longestChain || 0, state.longestChain);
  best.endless = Math.max(best.endless || 0, state.endless);
  if (state.grand && (!best.grandTime || state.elapsed < best.grandTime)) best.grandTime = state.elapsed;
  localStorage.setItem(storageKey, JSON.stringify(best));
}

function initThree() {
  const canvas = $('temariCanvas');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(44, 1, 0.1, 80);
  camera.position.set(0, 0.85, 6.4);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  stageGroup = new THREE.Group();
  scene.add(stageGroup);
  stageGroup.rotation.x = -0.18;
  stageGroup.rotation.y = 0.45;

  scene.add(new THREE.AmbientLight(0xffecd2, 1.1));
  const lantern = new THREE.PointLight(0xffbe73, 3.4, 14);
  lantern.position.set(-3, 3, 4);
  scene.add(lantern);
  const cool = new THREE.DirectionalLight(0x9fb7ff, 1.2);
  cool.position.set(2.5, 1.8, 4);
  scene.add(cool);

  const sphereGeo = new THREE.SphereGeometry(1.72, 64, 40);
  const sphereMat = new THREE.MeshStandardMaterial({ color: 0x21182e, roughness: 0.78, metalness: 0.05 });
  sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.name = 'lacquered temari sphere';
  stageGroup.add(sphere);

  const ringStand = new THREE.Mesh(new THREE.TorusGeometry(2.08, 0.055, 16, 128), new THREE.MeshStandardMaterial({ color: 0x5b261a, metalness: .18, roughness: .45 }));
  ringStand.rotation.x = Math.PI / 2;
  ringStand.position.y = -1.82;
  stageGroup.add(ringStand);

  guideGroup = new THREE.Group();
  pinGroup = new THREE.Group();
  threadGroup = new THREE.Group();
  stageGroup.add(guideGroup, threadGroup, pinGroup);

  reticle = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.011, 10, 36), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .95 }));
  stageGroup.add(reticle);

  buildGuides();
  buildPins();
  buildGhost();
  resize();
  requestAnimationFrame(render);
}

function resize() {
  const canvas = $('temariCanvas');
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.position.z = width < 520 ? 7.05 : 6.15;
  camera.updateProjectionMatrix();
}

function ringPoint(ringIndex, pinIndex, radius = 1.78) {
  const ring = rings[ringIndex];
  const t = (pinIndex / pinCount) * Math.PI * 2;
  let v;
  if (ring.type === 'latitude') {
    const rr = Math.sqrt(Math.max(0.01, 1 - ring.y * ring.y));
    v = new THREE.Vector3(Math.cos(t) * rr, ring.y, Math.sin(t) * rr);
  } else if (ring.type === 'longitude') {
    v = new THREE.Vector3(Math.sin(t) * Math.cos(ring.angle), Math.cos(t), Math.sin(t) * Math.sin(ring.angle));
  } else {
    const rr = Math.sqrt(Math.max(0.01, 1 - Math.sin(t) * Math.sin(t) * ring.tilt * ring.tilt));
    const x = Math.cos(t) * rr;
    const y = Math.sin(t) * ring.tilt;
    const z = Math.sin(t) * Math.sqrt(Math.max(0.05, 1 - ring.tilt * ring.tilt));
    v = new THREE.Vector3(x, y, z).applyAxisAngle(new THREE.Vector3(0,1,0), ring.angle).normalize();
  }
  return v.normalize().multiplyScalar(radius);
}

function buildGuides() {
  guideGroup.clear();
  rings.forEach((ring, ri) => {
    const pts = [];
    for (let i = 0; i <= 160; i++) pts.push(ringPoint(ri, (i / 160) * pinCount, 1.735));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: ring.color, transparent: true, opacity: ri === state.selectedRing ? .72 : .22 });
    const line = new THREE.Line(geo, mat);
    line.name = `guide ${ring.name}`;
    guideGroup.add(line);
  });
}

function buildPins() {
  pinGroup.clear();
  for (let i = 0; i < pinCount; i++) {
    const p = ringPoint(state.selectedRing, i, 1.86);
    const isSelected = i === state.selectedPin;
    const mat = new THREE.MeshStandardMaterial({ color: isSelected ? 0xffffff : 0xd9af54, emissive: isSelected ? 0xd9af54 : 0x261603, emissiveIntensity: isSelected ? .9 : .15, roughness: .35, metalness: .35 });
    const pin = new THREE.Mesh(new THREE.SphereGeometry(isSelected ? .075 : .052, 18, 12), mat);
    pin.position.copy(p);
    pin.userData.pinIndex = i;
    pinGroup.add(pin);
  }
}

function buildGhost() {
  if (ghostLine) stageGroup.remove(ghostLine);
  const start = state.startAnchor ? anchorVector(state.startAnchor, 1.82) : ringPoint(state.selectedRing, state.selectedPin, 1.82);
  const end = state.endAnchor ? anchorVector(state.endAnchor, 1.82) : ringPoint(state.selectedRing, (state.selectedPin + 3) % pinCount, 1.82);
  const pts = arcPoints(start, end, 42, 1.84);
  ghostLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: silkPalette[state.selectedColor].hex, transparent: true, opacity: state.focusTimer > 0 ? .9 : .38 }));
  ghostLine.name = 'predicted route ghost';
  stageGroup.add(ghostLine);
  reticle.position.copy(ringPoint(state.selectedRing, state.selectedPin, 1.93));
  reticle.lookAt(new THREE.Vector3(0,0,0));
}

function anchorVector(anchor, radius = 1.82) { return ringPoint(anchor.ring, anchor.pin, radius); }
function arcPoints(start, end, count, radius = 1.82) {
  const a = start.clone().normalize();
  const b = end.clone().normalize();
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const f = i / count;
    const p = a.clone().lerp(b, f).normalize().multiplyScalar(radius + Math.sin(f * Math.PI) * 0.035);
    pts.push(p);
  }
  return pts;
}

function addThreadVisual(wrap) {
  const start = anchorVector(wrap.start, 1.84);
  const end = anchorVector(wrap.end, 1.84);
  const points = arcPoints(start, end, 60, 1.84 + (wrap.tension - 50) / 1000);
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: silkPalette[wrap.color].hex, transparent: true, opacity: wrap.valid ? .96 : .58 });
  const line = new THREE.Line(geo, mat);
  line.name = `${wrap.color} silk wrap ${wrap.ringName}`;
  threadGroup.add(line);
  wrap.object = line;

  const mid = points[Math.floor(points.length / 2)].clone();
  const glint = new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), new THREE.MeshBasicMaterial({ color: wrap.valid ? 0xfff0b8 : 0xff736d, transparent: true, opacity: .9 }));
  glint.position.copy(mid);
  glint.name = 'tension glint';
  threadGroup.add(glint);
  wrap.glint = glint;
}

function addPearlVisual(position, good) {
  const mat = new THREE.MeshStandardMaterial({ color: good ? 0xfff4da : 0xff8b7d, emissive: good ? 0xd9af54 : 0x5b1010, emissiveIntensity: .55, roughness: .18, metalness: .2 });
  const pearl = new THREE.Mesh(new THREE.SphereGeometry(.075, 18, 12), mat);
  pearl.position.copy(position);
  pearl.name = good ? 'locked pearl intersection' : 'early pearl warning';
  threadGroup.add(pearl);
  return pearl;
}

function updateSceneSelections() { buildGuides(); buildPins(); buildGhost(); updateHUD(); }

function updateHUD() {
  $('score').textContent = Math.floor(state.score).toString();
  $('bestScore').textContent = Math.floor(best.score || 0).toString();
  $('menuBest').textContent = Math.floor(best.score || 0).toString();
  $('menuGrand').textContent = best.grandTime ? formatTime(best.grandTime) : '—';
  $('hearts').textContent = Array.from({ length: 3 }, (_, i) => i < state.hearts ? '♥' : '♡').join(' ');
  $('tangle').textContent = `${Math.round(state.tangle)}%`;
  $('combo').textContent = `x${state.combo}`;
  $('activeRing').textContent = rings[state.selectedRing].name;
  $('silkName').textContent = silkPalette[state.selectedColor].name;
  $('silkName').style.color = silkPalette[state.selectedColor].css;
  $('focusCharge').textContent = `${Math.round(state.focus)}%`;
  $('elapsed').textContent = formatTime(state.elapsed);
  $('symmetryMeter').value = state.symmetry;
  $('symmetryText').textContent = `${Math.round(state.symmetry)}%`;
  $('tensionMeter').value = state.tension;
  $('tensionText').textContent = `${Math.round(state.tension)}`;
  $('helperText').textContent = state.latestWarning;
  $('stageHint').textContent = `${rings[state.selectedRing].name} · pin ${state.selectedPin + 1}/12 · ${silkPalette[state.selectedColor].name} silk${state.focusTimer > 0 ? ' · Kagome preview active' : ''}`;
  $('focusButton').disabled = state.focus < 35 && state.focusTimer <= 0;
  $('pearlPin').disabled = state.wraps.length === 0;
  document.querySelectorAll('.silk').forEach(btn => btn.classList.toggle('active', btn.dataset.color === state.selectedColor));
  renderCommission();
}

function renderCommission() {
  const c = currentCommission();
  $('commissionName').textContent = c.name;
  const goalWraps = state.commissionWraps >= c.wraps;
  const goalPearls = state.commissionPearls >= c.pearls;
  const goalTangle = state.tangle <= c.tangleLimit;
  const goalSym = state.symmetry >= c.symmetry;
  const focusGoal = state.commissionIndex < 2 || state.focusUsedOnCommission;
  const goals = [
    `${state.commissionWraps}/${c.wraps} silk wraps`,
    `${state.commissionPearls}/${c.pearls} pearl locks`,
    `Tangle ≤ ${c.tangleLimit}%`,
    `Symmetry ${Math.round(state.symmetry)}/${c.symmetry}%`,
    state.commissionIndex === 2 ? 'Kagome Focus used' : `Colors: ${c.colors.map(x => silkPalette[x].name[0]).join(' ')}`
  ];
  const done = [goalWraps, goalPearls, goalTangle, goalSym, focusGoal];
  $('commissionGoals').innerHTML = goals.map((g, i) => `<span class="goal ${done[i] ? 'done' : ''}">${g}</span>`).join('');
}

function currentCommission() {
  if (state.commissionIndex < commissions.length) return commissions[state.commissionIndex];
  const level = state.commissionIndex - commissions.length + 1;
  return { name: `Endless Orbit ${level}`, timer: Math.max(75, 135 - level * 7), tangleLimit: Math.max(20, 36 - level), wraps: 6 + level, pearls: 3 + Math.floor(level / 2), colors: silkNames, rings: rings.map(r => r.name), symmetry: Math.min(94, 78 + level), goals: [] };
}

function score(amount, text) {
  state.score += amount * state.combo;
  state.latestWarning = `${text} (+${Math.round(amount * state.combo)})`;
  state.combo = Math.min(9, state.combo + 1);
  state.cleanChain += 1;
  state.longestChain = Math.max(state.longestChain, state.cleanChain);
}

function penalty(amount, text) {
  state.tangle = Math.min(100, state.tangle + amount);
  state.combo = 1;
  state.cleanChain = 0;
  state.symmetry = Math.max(0, state.symmetry - Math.ceil(amount / 2));
  state.latestWarning = text;
  if (state.tangle >= 100) endRun('The tangle meter reached 100%.');
}

function moveRing(delta) {
  state.selectedRing = (state.selectedRing + rings.length + delta) % rings.length;
  state.latestWarning = `Active guide band changed to ${rings[state.selectedRing].name}.`;
  sfx('tick');
  updateSceneSelections();
}
function movePin(delta) {
  state.selectedPin = (state.selectedPin + pinCount + delta) % pinCount;
  state.latestWarning = `Target pin moved to ${state.selectedPin + 1} on ${rings[state.selectedRing].name}.`;
  sfx('tick');
  updateSceneSelections();
}
function selectedAnchor() { return { ring: state.selectedRing, pin: state.selectedPin, name: rings[state.selectedRing].name }; }
function setStartPin() {
  state.startAnchor = selectedAnchor();
  state.latestWarning = `Start pin set on ${state.startAnchor.name} pin ${state.startAnchor.pin + 1}. Choose an end pin.`;
  sfx('tick'); buildGhost(); updateHUD();
}
function setEndPin() {
  state.endAnchor = selectedAnchor();
  state.latestWarning = `End pin set on ${state.endAnchor.name} pin ${state.endAnchor.pin + 1}. Wrap when the route looks clean.`;
  sfx('tick'); buildGhost(); updateHUD();
}
function setColor(color) {
  state.selectedColor = color;
  state.latestWarning = `${silkPalette[color].name} silk loaded on the spool tray.`;
  sfx('spool'); buildGhost(); updateHUD();
}

function wrapThread() {
  if (!state.startAnchor || !state.endAnchor) {
    if (!state.startAnchor) setStartPin(); else setEndPin();
    return;
  }
  const c = currentCommission();
  const ringName = rings[state.startAnchor.ring].name;
  const desiredRing = c.rings.includes(ringName) || c.rings.includes(rings[state.endAnchor.ring].name);
  const desiredColor = c.colors.includes(state.selectedColor);
  const distance = Math.abs(state.startAnchor.pin - state.endAnchor.pin);
  const usefulSpan = distance >= 2 && distance <= 10;
  const safeTension = state.tension >= 38 && state.tension <= 72;
  const valid = desiredRing && desiredColor && usefulSpan && safeTension;
  const wrap = { start: { ...state.startAnchor }, end: { ...state.endAnchor }, color: state.selectedColor, tension: state.tension, valid, ringName };
  state.wraps.push(wrap);
  addThreadVisual(wrap);
  state.commissionWraps += 1;
  state.undoCharges = Math.max(0, state.undoCharges);
  if (valid) {
    score(130 + (safeTension ? 35 : 0), `Clean ${silkPalette[state.selectedColor].name} arc follows ${ringName}`);
    state.focus = Math.min(100, state.focus + 13);
    state.symmetry = Math.min(100, state.symmetry + (state.commissionWraps % 2 === 0 ? 6 : 3));
    if (state.commissionWraps % 2 === 0) score(280, 'Symmetric pair completed across the sphere');
    sfx('wrap');
  } else {
    const why = !desiredColor ? 'wrong silk color' : !desiredRing ? 'wrong guide band' : !usefulSpan ? 'anchor span too short' : 'unsafe tension';
    penalty(8, `Thread raised tangle: ${why}. Undo before it cascades.`);
    sfx('fray');
  }
  state.startAnchor = state.endAnchor;
  state.endAnchor = null;
  buildGhost(); updateHUD(); checkCommissionComplete();
}

function adjustTension(delta) {
  state.tension = Math.max(8, Math.min(96, state.tension + delta));
  if (state.tension > 84) {
    state.snaps += 1; state.hearts -= 1; penalty(14, 'Sharp fray pluck — tension snapped a silk heart.'); sfx('fray');
    state.tension = 62;
    if (state.snaps >= 3 || state.hearts <= 0) endRun('Three tension snaps frayed the run.');
  } else if (state.tension >= 42 && state.tension <= 66) {
    score(145, delta > 0 ? 'Tightened into the safe tension band' : 'Loosened before a snap'); sfx('tension');
  } else {
    state.latestWarning = state.tension < 42 ? 'Slack loops show on the route ghost; tighten soon.' : 'Silk is bright and taut; loosen before a snap.'; sfx('tick');
  }
  updateHUD();
}

function pearlPin() {
  if (!state.wraps.length) return;
  const latest = state.wraps[state.wraps.length - 1];
  const hasCrossing = state.wraps.length >= 2 && latest.valid;
  const start = anchorVector(latest.start, 1.91);
  const end = anchorVector(latest.end, 1.91);
  const pos = arcPoints(start, end, 20, 1.91)[10];
  const pearl = addPearlVisual(pos, hasCrossing);
  state.pearls.push({ object: pearl, good: hasCrossing });
  if (hasCrossing) {
    state.commissionPearls += 1;
    state.tangle = Math.max(0, state.tangle - 5);
    state.focus = Math.min(100, state.focus + 10);
    score(175, 'Pearl pin locked a real over/under intersection'); sfx('pearl');
  } else {
    penalty(7, 'Pearl locked too early and trapped future crossings.'); sfx('fray');
  }
  updateHUD(); checkCommissionComplete();
}

function undoWrap() {
  if (!state.wraps.length) { state.latestWarning = 'No recent wrap to undo.'; updateHUD(); return; }
  if (state.undoCharges <= 0 && state.commissionIndex > 0) { state.latestWarning = 'Undo charge already used for this commission.'; updateHUD(); return; }
  const wrap = state.wraps.pop();
  if (wrap.object) threadGroup.remove(wrap.object);
  if (wrap.glint) threadGroup.remove(wrap.glint);
  state.commissionWraps = Math.max(0, state.commissionWraps - 1);
  state.undoCharges -= 1;
  state.combo = 1;
  state.tangle = Math.max(0, state.tangle - 6);
  state.latestWarning = 'Cloth rustle — removed the most recent silk arc, combo reset.';
  sfx('undo'); buildGhost(); updateHUD();
}

function kagomeFocus() {
  if (state.focus < 35 && state.focusTimer <= 0) return;
  state.focus = Math.max(0, state.focus - 35);
  state.focusTimer = 8;
  state.focusUsedOnCommission = true;
  state.latestWarning = 'Kagome Focus overlays hidden back arcs, pearl windows, and safe crossings.';
  sfx('focus'); buildGhost(); updateHUD();
}

function checkCommissionComplete() {
  const c = currentCommission();
  const enough = state.commissionWraps >= c.wraps && state.commissionPearls >= c.pearls && state.tangle <= c.tangleLimit && state.symmetry >= c.symmetry && (state.commissionIndex < 2 || state.focusUsedOnCommission);
  if (!enough) return;
  score(880, `${c.name} complete — washi seal stamped`);
  if (state.hearts < 3) state.hearts += 1;
  if (state.snaps === 0) score(1160, 'Perfect no-snap temari bonus');
  state.commissionIndex += 1;
  if (state.commissionIndex > commissions.length) state.endless += 1;
  state.commissionWraps = 0; state.commissionPearls = 0; state.undoCharges = state.commissionIndex === 0 ? 1 : 1;
  state.focusUsedOnCommission = false;
  state.commissionStartedAt = state.elapsed;
  state.tangle = Math.max(0, state.tangle - 12);
  state.tension = 50;
  state.symmetry = Math.min(100, state.symmetry + 4);
  if (!state.grand && state.commissionIndex >= 3 && state.score >= 4800) triggerGrandOrbit();
  else state.latestWarning = `New commission: ${currentCommission().name}. Inspect the back-side arcs before locking.`;
  updateHUD();
}

function triggerGrandOrbit() {
  state.grand = true;
  state.score += 2400;
  $('grandBanner').hidden = false;
  state.latestWarning = 'Temari Grand Orbit! Endless commissions continue after the lantern seal fades.';
  sfx('grand'); saveBest(); updateHUD();
  setTimeout(() => { $('grandBanner').hidden = true; }, 3600);
}

function tick(dt) {
  if (!running || paused) return;
  const c = currentCommission();
  state.elapsed += dt * (state.focusTimer > 0 ? .42 : 1);
  if (state.focusTimer > 0) state.focusTimer = Math.max(0, state.focusTimer - dt);
  const commissionTime = state.elapsed - state.commissionStartedAt;
  const frayRate = state.commissionIndex < 1 ? .013 : .02 + state.commissionIndex * .003;
  state.tangle = Math.min(100, state.tangle + dt * frayRate * (state.tension > 74 ? 1.8 : 1));
  if (commissionTime > c.timer) endRun(`${c.name} timer expired before the pattern card was complete.`);
  if (state.tangle >= 100) endRun('Thread tangles covered the temari.');
}

function render(now = performance.now()) {
  const dt = Math.min(.05, (now - lastFrame) / 1000);
  lastFrame = now;
  tick(dt);
  const speed = state.focusTimer > 0 ? .16 : .045;
  if (running && !pointerDown && !paused) stageGroup.rotation.y += speed * dt;
  reticle.rotation.z += dt * 2.2;
  threadGroup.children.forEach((child, i) => {
    if (child.name.includes('glint') || child.name.includes('pearl')) child.scale.setScalar(1 + Math.sin(now / 260 + i) * .09);
  });
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function startGame() {
  $('titleScreen').hidden = true;
  $('resultsOverlay').hidden = true;
  running = true; paused = false; startedOnce = true;
  ensureAudio(); sfx('focus'); updateHUD();
}
function restart() {
  const fresh = freshState();
  Object.keys(state).forEach(k => delete state[k]);
  Object.assign(state, fresh);
  threadGroup?.clear();
  $('grandBanner').hidden = true;
  $('resultsOverlay').hidden = true; $('pauseOverlay').hidden = true; $('titleScreen').hidden = true;
  running = true; paused = false;
  buildGhost(); updateSceneSelections(); ensureAudio(); sfx('tick'); updateHUD();
}
function pause() { if (!running) return; paused = true; $('pauseOverlay').hidden = false; updateHUD(); }
function resume() { paused = false; $('pauseOverlay').hidden = true; ensureAudio(); }
function endRun(reason) {
  if (!running) return;
  running = false; paused = false; saveBest();
  const badges = [];
  if (state.tangle < 10) badges.push('Low-tangle finish');
  if (state.snaps === 0) badges.push('No-snap hands');
  if (state.longestChain >= 7) badges.push('Clean chain master');
  if (state.grand && state.elapsed < 275) badges.push('Fast Grand Orbit');
  if (state.endless > 0) badges.push('Endless seal keeper');
  $('resultTitle').textContent = state.grand ? 'Temari Grand Orbit recorded' : 'Thread run complete';
  $('resultStats').innerHTML = [
    ['Final score', Math.floor(state.score)], ['Best score', Math.floor(best.score || 0)], ['Reached', currentCommission().name], ['Reason', reason],
    ['Clean chain', state.longestChain], ['Symmetry', `${Math.round(state.symmetry)}%`], ['Tangle finish', `${Math.round(state.tangle)}%`], ['Snaps/frays', state.snaps]
  ].map(([a,b]) => `<div class="result-item"><strong>${a}</strong><br>${b}</div>`).join('');
  $('badgeList').innerHTML = badges.length ? badges.map(b => `<span>${b}</span>`).join('') : '<span>Try for a zero-snap seal</span>';
  $('resultsOverlay').hidden = false;
}

function ensureAudio() {
  if (muted) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  window.__day034Audio = { ctx: audioCtx, enabled: !muted };
}
function sfx(kind) {
  if (muted || !audioCtx) return;
  const now = audioCtx.currentTime;
  const gain = audioCtx.createGain();
  gain.connect(audioCtx.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(kind === 'grand' ? .18 : .08, now + .015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'grand' ? 1.2 : .28));
  const freqs = {
    tick: [420], spool: [260, 390], wrap: [220, 330, 440], pearl: [820, 1120], tension: [360, 540], fray: [150, 118], undo: [210, 160], focus: [520, 780, 1040], grand: [392, 494, 587, 784, 988]
  }[kind] || [440];
  freqs.forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    osc.type = kind === 'fray' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(f, now + i * .055);
    osc.connect(gain); osc.start(now + i * .045); osc.stop(now + (kind === 'grand' ? 1.05 : .24) + i * .045);
  });
}
function toggleMute() {
  muted = !muted;
  $('muteButton').textContent = muted ? 'Muted' : 'Sound on';
  $('pauseMute').textContent = muted ? 'Unmute audio' : 'Mute audio';
  if (!muted) ensureAudio();
}
function formatTime(secs) { const s = Math.floor(secs); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }

function bindControls() {
  $('startGame').addEventListener('click', startGame);
  $('ringMinus').addEventListener('click', () => moveRing(-1));
  $('ringPlus').addEventListener('click', () => moveRing(1));
  $('pinMinus').addEventListener('click', () => movePin(-1));
  $('pinPlus').addEventListener('click', () => movePin(1));
  $('startPin').addEventListener('click', setStartPin);
  $('endPin').addEventListener('click', setEndPin);
  $('wrapThread').addEventListener('click', wrapThread);
  $('tighten').addEventListener('click', () => adjustTension(9));
  $('loosen').addEventListener('click', () => adjustTension(-9));
  $('pearlPin').addEventListener('click', pearlPin);
  $('undoWrap').addEventListener('click', undoWrap);
  $('focusButton').addEventListener('click', kagomeFocus);
  $('restartButton').addEventListener('click', restart);
  $('pauseButton').addEventListener('click', pause);
  $('resumeButton').addEventListener('click', resume);
  $('pauseRestart').addEventListener('click', restart);
  $('resultRestart').addEventListener('click', restart);
  $('muteButton').addEventListener('click', toggleMute);
  $('pauseMute').addEventListener('click', toggleMute);
  document.querySelectorAll('.silk').forEach(btn => btn.addEventListener('click', () => setColor(btn.dataset.color)));
  window.addEventListener('resize', resize);

  const canvas = $('temariCanvas');
  canvas.addEventListener('pointerdown', (e) => { pointerDown = true; pointerMoved = false; lastPointer = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); ensureAudio(); });
  canvas.addEventListener('pointermove', (e) => {
    if (!pointerDown) return;
    const dx = e.clientX - lastPointer.x; const dy = e.clientY - lastPointer.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) pointerMoved = true;
    stageGroup.rotation.y += dx * 0.009;
    stageGroup.rotation.x = THREE.MathUtils.clamp(stageGroup.rotation.x + dy * 0.006, -1.05, .65);
    lastPointer = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener('pointerup', (e) => {
    pointerDown = false;
    if (!pointerMoved) movePin(1);
    try { canvas.releasePointerCapture(e.pointerId); } catch {}
  });

  window.addEventListener('keydown', (e) => {
    if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') { e.preventDefault(); movePin(-1); }
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') { e.preventDefault(); movePin(1); }
    if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') { e.preventDefault(); moveRing(1); }
    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') { e.preventDefault(); moveRing(-1); }
    if (e.key.toLowerCase() === 'q') stageGroup.rotation.y -= .22;
    if (e.key.toLowerCase() === 'e') stageGroup.rotation.y += .22;
    if (/^[1-5]$/.test(e.key)) setColor(silkNames[Number(e.key) - 1]);
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); state.startAnchor && state.endAnchor ? wrapThread() : (!state.startAnchor ? setStartPin() : setEndPin()); }
    if (e.key.toLowerCase() === 't') adjustTension(9);
    if (e.key.toLowerCase() === 'l') adjustTension(-9);
    if (e.key.toLowerCase() === 'p') paused ? resume() : pearlPin();
    if (e.key.toLowerCase() === 'u') undoWrap();
    if (e.shiftKey || e.key.toLowerCase() === 'f') kagomeFocus();
    if (e.key.toLowerCase() === 'r') restart();
    if (e.key === 'Escape') paused ? resume() : pause();
  });
}

initThree();
bindControls();
updateHUD();
