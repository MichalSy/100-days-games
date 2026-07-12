import * as THREE from './assets/three.module.min.js';

const $ = (id) => document.getElementById(id);
const ui = {
  score: $('score'), best: $('best'), hearts: $('hearts'), bruise: $('bruise'), combo: $('combo'), chapter: $('chapter'),
  titleLine: $('titleLine'), goalLine: $('goalLine'), pips: $('progressPips'), stage: $('stage'), canvas: $('gameCanvas'),
  stageLabel: $('stageLabel'), helperText: $('helperText'), status: $('statusLine'), overlay: $('overlay'), start: $('startBtn'), mute: $('muteBtn')
};

const STORAGE_KEY = 'day030-mikan-sunwheel-best';
const chapters = [
  { name: 'First Sunny Basket', target: 8, bruiseMax: 45, goal: 'Harvest 8 clean mikan, learn basket height, and keep bruises under 45%.', rings: ['golden', 'golden', 'green-safe'] },
  { name: 'Terrace Crate Rush', target: 11, bruiseMax: 35, goal: 'Sort 11 fruit across crate lanes, use Sunwheel twice, and dodge the first hornets.', rings: ['golden', 'deep orange', 'golden'] },
  { name: 'Golden Sunwheel Harvest', target: 14, bruiseMax: 28, goal: 'Harvest 14 precise fruit, preserve the basket, and trigger Mikan Grand Harvest.', rings: ['golden', 'golden', 'deep orange'] }
];

const state = {
  running: false, paused: false, muted: false, startedAt: 0, lastTime: 0, score: 0, combo: 1, hearts: 3, bruise: 0,
  best: Number(localStorage.getItem(STORAGE_KEY) || 0), chapter: 0, progress: 0, orbit: 0, height: 1, crate: 0,
  focus: 0, focusTime: 0, fan: 1, net: 1, sunwheel: 0, sunUses: 0, grand: false, warning: 'Ready', drops: [], particles: []
};

ui.best.textContent = String(state.best);
for (let i = 0; i < 8; i++) ui.pips.appendChild(document.createElement('i'));

let renderer, scene, camera, clock, treeGroup, fruitGroup, basketGroup, hornetGroup, sunBeam, activeFruit;
let audioContext;
const fruit = [];
const hornets = [];

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas: ui.canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xfef3c7, 9, 24);
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 5.4, 12.5);
  camera.lookAt(0, 1.6, 0);
  clock = new THREE.Clock();
  const hemi = new THREE.HemisphereLight(0xfff7d6, 0x275c35, 2.3);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffc56b, 2.4);
  sun.position.set(4, 7, 5);
  scene.add(sun);

  const bgTex = new THREE.TextureLoader().load('./assets/mikan-orchard.png');
  bgTex.colorSpace = THREE.SRGBColorSpace;
  const bgMat = new THREE.MeshBasicMaterial({ map: bgTex, transparent: true, opacity: 0.5, depthWrite: false });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(14, 20), bgMat);
  bg.position.set(0, 2.2, -8.5);
  scene.add(bg);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(8, 64), new THREE.MeshStandardMaterial({ color: 0x7dc35a, roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;
  scene.add(ground);

  treeGroup = new THREE.Group();
  fruitGroup = new THREE.Group();
  basketGroup = new THREE.Group();
  hornetGroup = new THREE.Group();
  scene.add(treeGroup, fruitGroup, basketGroup, hornetGroup);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 4.2, 12), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.82 }));
  trunk.position.y = 0.9;
  treeGroup.add(trunk);
  for (let i = 0; i < 9; i++) {
    const a = i * Math.PI * 2 / 9 + 0.24;
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.23, 4.1, 8), new THREE.MeshStandardMaterial({ color: 0x7a461f, roughness: 0.86 }));
    branch.position.set(Math.cos(a) * 1.18, 2.2 + (i % 3) * 0.45, Math.sin(a) * 1.18);
    branch.rotation.z = Math.PI / 2.5;
    branch.rotation.y = -a;
    treeGroup.add(branch);
  }
  for (let i = 0; i < 26; i++) {
    const a = i * Math.PI * 2 / 26;
    const r = 1.4 + (i % 5) * 0.28;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.55 + (i % 3) * 0.12, 10, 8), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x2f8f43 : 0x57b64b, roughness: 0.9 }));
    leaf.scale.set(1.45, 0.72, 1.0);
    leaf.position.set(Math.cos(a) * r, 2.8 + Math.sin(i * 1.7) * 0.55, Math.sin(a) * r);
    treeGroup.add(leaf);
  }

  makeBasket();
  makeCrates();
  makeSunBeam();
  seedFruit();
  seedHornets();
  resize();
}

function makeBasket() {
  const mat = new THREE.MeshStandardMaterial({ color: 0xc08432, roughness: 0.55, metalness: 0.03 });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.055, 12, 36), mat);
  rim.rotation.x = Math.PI / 2;
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.34, 0.36, 24, 1, true), mat);
  bowl.position.y = -0.18;
  basketGroup.add(rim, bowl);
}

function makeCrates() {
  for (let i = 0; i < 3; i++) {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.55, 0.95), new THREE.MeshStandardMaterial({ color: [0x9a5a20, 0xb9772a, 0x7d4b1d][i], roughness: 0.8 }));
    crate.position.set((i - 1) * 1.75, -0.7, 3.2);
    scene.add(crate);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.22), new THREE.MeshBasicMaterial({ color: [0x22c55e, 0xf59e0b, 0xf97316][i] }));
    label.position.set((i - 1) * 1.75, -0.38, 2.72);
    scene.add(label);
  }
}

function makeSunBeam() {
  const mat = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.22, side: THREE.DoubleSide });
  sunBeam = new THREE.Mesh(new THREE.ConeGeometry(1.0, 5.5, 32, 1, true), mat);
  sunBeam.rotation.x = Math.PI / 2;
  sunBeam.position.set(3.8, 3.7, 0);
  scene.add(sunBeam);
}

function seedFruit() {
  fruitGroup.clear();
  fruit.length = 0;
  const colors = [0x8bd33f, 0xfbbf24, 0xf97316, 0xdc4a12];
  for (let i = 0; i < 30; i++) {
    const a = i * 2.399963 + 0.35;
    const layer = i % 3;
    const r = 1.35 + (i % 5) * 0.34;
    const y = 1.35 + layer * 0.82 + Math.sin(i) * 0.18;
    const ripeness = (i % 11) / 10;
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.18 + layer * 0.02, 16, 12), new THREE.MeshStandardMaterial({ color: colors[Math.min(3, Math.floor(ripeness * 3.2))], roughness: 0.42 }));
    mesh.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.015, 6, 30), new THREE.MeshBasicMaterial({ color: 0xfff6b7, transparent: true, opacity: 0.78 }));
    ring.rotation.x = Math.PI / 2;
    mesh.add(ring);
    fruitGroup.add(mesh);
    fruit.push({ mesh, ring, base: mesh.position.clone(), ripeness, target: i % 3, plucked: false, id: i });
  }
}

function seedHornets() {
  hornetGroup.clear(); hornets.length = 0;
  for (let i = 0; i < 3; i++) {
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }));
    body.scale.set(1.4, .75, .75);
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 6, 12), new THREE.MeshBasicMaterial({ color: 0x1f1300 }));
    stripe.rotation.y = Math.PI / 2;
    body.add(stripe);
    hornetGroup.add(body);
    hornets.push({ mesh: body, angle: i * 2.1, radius: 2.3 + i * 0.25, y: 1.7 + i * 0.55, speed: 0.45 + i * 0.12, scared: 0 });
  }
}

function resize() {
  if (!renderer) return;
  const rect = ui.stage.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

function startGame() {
  initAudio();
  state.running = true; state.paused = false; state.startedAt = performance.now(); state.lastTime = state.startedAt;
  state.score = 0; state.combo = 1; state.hearts = 3; state.bruise = 0; state.chapter = 0; state.progress = 0; state.orbit = 0; state.height = 1;
  state.focus = 0; state.focusTime = 0; state.fan = 1; state.net = 1; state.sunwheel = 0; state.sunUses = 0; state.grand = false; state.drops.length = 0;
  seedFruit(); seedHornets();
  ui.overlay.classList.remove('show');
  announce('First Sunny Basket: orbit to a golden fruit, then Pluck / Catch.');
  updateUI();
}

function initAudio() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
}
function beep(freq = 440, dur = 0.08, type = 'sine', gain = 0.05) {
  if (state.muted || !audioContext) return;
  const t = audioContext.currentTime;
  const o = audioContext.createOscillator();
  const g = audioContext.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq * 1.35, t + dur);
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(audioContext.destination); o.start(t); o.stop(t + dur);
}
function chord(base) { [0, 4, 7, 12].forEach((n, i) => setTimeout(() => beep(base * 2 ** (n/12), .11, 'triangle', .045), i * 42)); }

function action(name) {
  initAudio();
  if (name === 'restart') return startGame();
  if (name === 'pause') return togglePause();
  if (!state.running || state.paused) return;
  if (name === 'orbitLeft') { state.orbit -= 0.16; beep(250, .04, 'sine', .025); announce('Basket orbits left around the canopy.'); }
  if (name === 'orbitRight') { state.orbit += 0.16; beep(280, .04, 'sine', .025); announce('Basket orbits right around the canopy.'); }
  if (name === 'raise') { state.height = Math.min(2, state.height + 1); beep(330, .05, 'triangle', .03); announce('Basket rises to a higher fruit layer.'); }
  if (name === 'lower') { state.height = Math.max(0, state.height - 1); beep(220, .05, 'triangle', .03); announce('Basket lowers toward the crate lane.'); }
  if (name === 'crate') { state.crate = (state.crate + 1) % 3; beep(360 + state.crate * 80, .06, 'square', .025); announce(`Crate lane ${String.fromCharCode(65 + state.crate)} selected.`); }
  if (name === 'sunwheel') useSunwheel();
  if (name === 'fan') useFan();
  if (name === 'net') useNet();
  if (name === 'focus') useFocus();
  if (name === 'pluck') pluckOrCatch();
  updateUI();
}

function togglePause() {
  if (!state.running) return;
  state.paused = !state.paused;
  ui.overlay.classList.toggle('show', state.paused);
  $('overlayTitle').textContent = state.paused ? 'Harvest paused' : 'Mikan Sunwheel Orchard';
  ui.start.textContent = state.paused ? 'Resume Harvest' : 'Start Harvest';
  if (!state.paused) announce('Back to the orchard.');
}

function useSunwheel() {
  state.sunwheel = (state.sunwheel + 1) % 5; state.sunUses++;
  fruit.forEach(f => { if (!f.plucked && Math.abs(Math.atan2(f.base.z, f.base.x) - state.orbit) < .9) f.ripeness = Math.min(1, f.ripeness + .18); });
  sunBeam.rotation.z = state.sunwheel * 0.45;
  state.focus = Math.min(100, state.focus + 8);
  beep(620, .12, 'triangle', .05);
  announce('Sunwheel warms shadowed clusters; watch overripe red rings.');
}
function useFan() {
  if (state.fan < 1) return announce('Fan Gust is still recharging.');
  state.fan = 0; hornets.forEach(h => { h.scared = 2.2; });
  state.score += 140; state.focus = Math.min(100, state.focus + 6); beep(180, .16, 'sawtooth', .035);
  announce('Fan Gust shooed hornets away from the basket.');
}
function useNet() {
  if (state.net < 1) return announce('Leaf Net is still recharging.');
  state.net = 0; state.drops.forEach(d => d.net = true); beep(520, .1, 'triangle', .04);
  announce('Leaf Net is ready under falling fruit; next bad drop is cushioned.');
}
function useFocus() {
  if (state.focus < 100) return announce('Harvest Focus needs clean ripe catches to charge.');
  state.focus = 0; state.focusTime = 4.2; chord(530); announce('Harvest Focus: drops slow and ripeness paths glow.');
}

function pluckOrCatch() {
  const catchable = state.drops.find(d => d.t > .46 && d.t < .92);
  if (catchable) return catchFruit(catchable);
  const f = nearestFruit();
  if (!f) return announce('No fruit is aligned with the basket. Orbit or raise/lower first.');
  f.plucked = true; f.mesh.visible = false;
  state.drops.push({ fruit: f, from: f.base.clone(), to: cratePosition(state.crate), t: 0, net: false, good: f.ripeness >= .34 && f.ripeness <= .82 });
  beep(740, .09, 'triangle', .04);
  announce(`${ripenessName(f.ripeness)} mikan plucked. Catch the arc, then sort crate ${String.fromCharCode(65 + state.crate)}.`);
}

function nearestFruit() {
  const basket = basketPosition();
  let best = null, bestD = Infinity;
  for (const f of fruit) {
    if (f.plucked) continue;
    const layer = Math.round((f.base.y - 1.35) / .82);
    if (Math.abs(layer - state.height) > 1) continue;
    const d = f.base.distanceTo(basket);
    if (d < bestD) { best = f; bestD = d; }
  }
  return bestD < 1.25 ? best : null;
}
function catchFruit(d) {
  const correctCrate = d.fruit.target === state.crate;
  const ripe = d.good;
  const clean = correctCrate && ripe;
  state.drops = state.drops.filter(x => x !== d);
  if (clean) {
    state.progress++; state.combo = Math.min(5, state.combo + .25); state.score += Math.round((120 + 95 + 150) * state.combo); state.focus = Math.min(100, state.focus + 16); beep(860, .08, 'triangle', .055);
    announce('Clean ripe catch sorted into the requested crate. Combo grows.');
    if (state.progress >= chapters[state.chapter].target) completeChapter();
  } else if (d.net) {
    state.score += 130; state.bruise = Math.max(0, state.bruise - 5); beep(450, .08, 'sine', .04); announce('Leaf Net cushioned a risky fruit and saved the bruise meter.');
  } else {
    damage(ripe ? 'Wrong crate bruised the order.' : 'Bad ripeness raised the bruise meter.');
  }
  updateUI();
}
function completeChapter() {
  state.score += 780 + state.chapter * 300;
  state.hearts = Math.min(3, state.hearts + 1);
  chord(660);
  if (state.chapter < 2) {
    state.chapter++; state.progress = 0; state.sunUses = 0; seedFruit();
    announce(`${chapters[state.chapter].name}: denser canopy, hornets, and stricter crate order.`);
  } else if (!state.grand && state.score >= 4400) {
    state.grand = true; state.score += 2000; announce('Mikan Grand Harvest! Sunlight fills the orchard; endless commissions continue.');
  } else {
    state.progress = 0; seedFruit(); announce('Endless orchard commission begins with faster ripening fruit.');
  }
}
function damage(msg) {
  state.combo = 1; state.bruise += 10 + state.chapter * 2; beep(120, .16, 'sawtooth', .04); announce(msg);
  if (state.bruise >= 100 || state.bruise > chapters[state.chapter].bruiseMax + 45) {
    state.hearts--; state.bruise = Math.max(18, state.bruise - 38);
    announce(`${msg} A harvest heart cracked.`);
    if (state.hearts <= 0) gameOver('The harvest bruised out.');
  }
}
function gameOver(msg) {
  state.running = false;
  state.best = Math.max(state.best, state.score); localStorage.setItem(STORAGE_KEY, String(state.best));
  ui.overlay.classList.add('show'); $('overlayTitle').textContent = msg; ui.start.textContent = 'Restart Harvest';
  announce(`${msg} Final score ${state.score}.`); updateUI();
}

function basketPosition() {
  const r = 2.35;
  return new THREE.Vector3(Math.sin(state.orbit) * r, 0.95 + state.height * 0.82, Math.cos(state.orbit) * r);
}
function cratePosition(lane) { return new THREE.Vector3((lane - 1) * 1.75, -0.25, 2.85); }
function ripenessName(v) { return v < .34 ? 'green-safe' : v < .66 ? 'golden' : v < .84 ? 'deep orange' : 'overripe'; }

function update(dt) {
  if (!state.running || state.paused) return;
  const slow = state.focusTime > 0 ? .38 : 1;
  state.focusTime = Math.max(0, state.focusTime - dt);
  state.fan = Math.min(1, state.fan + dt * .16);
  state.net = Math.min(1, state.net + dt * .12);
  fruit.forEach((f, i) => {
    if (!f.plucked) {
      f.ripeness = Math.min(1.08, f.ripeness + dt * (0.018 + state.chapter * .007) * slow);
      const c = f.ripeness < .34 ? 0x83c939 : f.ripeness < .66 ? 0xfbbf24 : f.ripeness < .84 ? 0xf97316 : 0xdc4a12;
      f.mesh.material.color.setHex(c);
      f.ring.material.opacity = state.focusTime > 0 || f === activeFruit ? .95 : .45;
      f.mesh.position.y = f.base.y + Math.sin(performance.now() * .001 + i) * .025;
    }
  });
  const bp = basketPosition();
  basketGroup.position.lerp(bp, 0.18);
  basketGroup.rotation.y = state.orbit;
  activeFruit = nearestFruit();
  hornets.forEach((h, idx) => {
    h.scared = Math.max(0, h.scared - dt);
    h.angle += dt * h.speed * (h.scared ? -1.6 : 1) * slow;
    h.mesh.position.set(Math.sin(h.angle) * h.radius, h.y + Math.sin(h.angle * 2) * .2, Math.cos(h.angle) * h.radius);
    h.mesh.rotation.y = -h.angle;
    if (!h.scared && h.mesh.position.distanceTo(bp) < .72) {
      damage('Hornets scattered the basket. Use Fan Gust earlier.');
      h.scared = 2.6;
    }
  });
  state.drops.forEach(d => {
    d.t += dt * (state.focusTime > 0 ? .45 : .85);
    const p = d.from.clone().lerp(d.to, d.t);
    p.y += Math.sin(Math.min(1, d.t) * Math.PI) * 1.0;
    if (!d.mesh) {
      d.mesh = new THREE.Mesh(new THREE.SphereGeometry(.17, 14, 10), new THREE.MeshStandardMaterial({ color: d.good ? 0xf59e0b : 0xdc4a12, roughness: .42 }));
      scene.add(d.mesh);
    }
    d.mesh.position.copy(p);
    if (d.t >= 1) {
      scene.remove(d.mesh);
      state.drops = state.drops.filter(x => x !== d);
      if (d.net) { state.score += 130; announce('Leaf Net softened a missed catch.'); }
      else damage('A mikan hit the ground and bruised.');
    }
  });
  if (clock.elapsedTime % 2 < dt) state.score += state.running ? 1 : 0;
}

function render() {
  requestAnimationFrame(render);
  const dt = Math.min(0.05, clock ? clock.getDelta() : 0.016);
  update(dt);
  treeGroup.rotation.y += dt * 0.045;
  const target = basketPosition();
  camera.position.x += (Math.sin(state.orbit) * 1.5 - camera.position.x) * 0.03;
  camera.lookAt(0, 1.6, 0);
  renderer.render(scene, camera);
}

function updateUI() {
  ui.score.textContent = String(Math.max(0, Math.floor(state.score)));
  ui.best.textContent = String(Math.max(state.best, state.score | 0));
  ui.hearts.textContent = '♥'.repeat(Math.max(0, state.hearts)) || '—';
  ui.bruise.textContent = `${Math.round(state.bruise)}%`;
  ui.combo.textContent = `x${state.combo.toFixed(1)}`;
  const ch = chapters[state.chapter] || chapters[2];
  ui.chapter.textContent = ch.name;
  ui.titleLine.textContent = state.grand ? 'Mikan Grand Harvest' : 'Mikan Sunwheel Orchard';
  ui.goalLine.textContent = `${ch.goal} Progress ${state.progress}/${ch.target} · Crate ${String.fromCharCode(65 + state.crate)} · Focus ${Math.round(state.focus)}%`;
  [...ui.pips.children].forEach((el, i) => el.classList.toggle('done', i < Math.round((state.progress / ch.target) * 8)));
  const hName = ['Low', 'Mid', 'High'][state.height];
  ui.stageLabel.textContent = `Basket orbit ${Math.round(THREE.MathUtils.radToDeg(state.orbit))}° · ${hName} canopy · Crate ${String.fromCharCode(65 + state.crate)} · ${activeFruit ? ripenessName(activeFruit.ripeness) : 'seek fruit'}`;
  ui.mute.textContent = state.muted ? 'Muted' : 'Audio On';
}
function announce(text) { state.warning = text; ui.status.textContent = text; ui.helperText.textContent = text; }

ui.start.addEventListener('click', () => state.paused ? togglePause() : startGame());
ui.mute.addEventListener('click', () => { state.muted = !state.muted; updateUI(); });
document.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', () => action(btn.dataset.action)));
window.addEventListener('keydown', (event) => {
  const k = event.key.toLowerCase();
  const map = { arrowleft: 'orbitLeft', a: 'orbitLeft', arrowright: 'orbitRight', d: 'orbitRight', arrowup: 'raise', w: 'raise', arrowdown: 'lower', s: 'lower', ' ': 'pluck', enter: 'pluck', f: 'fan', l: 'net', q: 'sunwheel', e: 'sunwheel', shift: 'focus', m: 'focus', p: 'pause', r: 'restart', '1': 'crate', '2': 'crate', '3': 'crate' };
  if (map[k]) { event.preventDefault(); action(map[k]); }
});

initThree();
updateUI();
render();
