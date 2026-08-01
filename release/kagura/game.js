import * as THREE from './assets/three.module.min.js';

const $ = (id) => document.getElementById(id);
const app = $('app');
const canvas = $('stage');
const hud = {
  score: $('score'), best: $('best'), hearts: $('hearts'), balance: $('balance'), hush: $('hush'),
  strain: $('strain'), timer: $('timer'), combo: $('combo'), tile: $('tile'), facing: $('facing'),
  mask: $('mask'), focus: $('focus'), elapsed: $('elapsed'), commissionName: $('commissionName'),
  commissionGoal: $('commissionGoal'), markList: $('markList'), helper: $('helper'), feedback: $('feedback')
};
const menu = $('menu');
const pauseOverlay = $('pauseOverlay');
const resultsOverlay = $('resultsOverlay');
const focusOverlay = $('focusOverlay');
const startButton = $('startButton');
const menuBest = $('menuBest');
const menuBlessing = $('menuBlessing');
const resultKicker = $('resultKicker');
const resultTitle = $('resultTitle');
const resultText = $('resultText');
const badges = $('badges');

const storageKey = 'day050-kagura-mask-star-dancer';
const masks = ['Fox', 'Oni', 'Okame'];
const facings = ['North', 'East', 'South', 'West'];
const tileNames = ['L-Front', 'C-Front', 'R-Front', 'L-Mid', 'C-Mid', 'R-Mid', 'L-Back', 'C-Back', 'R-Back'];
const tileLabel = ({ x, z }) => tileNames[(z + 1) * 3 + (x + 1)];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const modulo = (value, length) => ((value % length) + length) % length;

const commissions = [
  {
    name: 'First Star Step', targetScore: 1700,
    goal: 'Center-front star, face north lantern, raise gohei high, Strike Pose on the blue beat, then ring Kagura Bells.',
    marks: [
      { tile: { x: 0, z: -1 }, facing: 'North', mask: 'Fox', height: 'High', note: 'front star' },
      { tile: { x: 0, z: 0 }, facing: 'East', mask: 'Fox', height: 'Low', note: 'center bell' },
      { tile: { x: 1, z: 0 }, facing: 'East', mask: 'Fox', height: 'High', note: 'east lantern' }
    ]
  },
  {
    name: 'Lantern Mask Spiral', targetScore: 4100,
    goal: 'Spiral through depth lanes, swap at the mask gate, face the lantern cone, and restore hush with bells.',
    marks: [
      { tile: { x: 1, z: -1 }, facing: 'North', mask: 'Fox', height: 'Low', note: 'front-right' },
      { tile: { x: 1, z: 1 }, facing: 'West', mask: 'Oni', height: 'High', gate: true, note: 'oni gate' },
      { tile: { x: -1, z: 1 }, facing: 'South', mask: 'Oni', height: 'Low', note: 'back-left' },
      { tile: { x: -1, z: 0 }, facing: 'East', mask: 'Okame', height: 'High', gate: true, note: 'okame gate' }
    ]
  },
  {
    name: 'Moon Rope Finale', targetScore: 6400,
    goal: 'Seven marks across all lanes: use Star Focus, hit mask gates, alternate high/low gohei, and avoid wrong-mask finale poses.',
    marks: [
      { tile: { x: -1, z: -1 }, facing: 'North', mask: 'Okame', height: 'High', note: 'left moon' },
      { tile: { x: 0, z: -1 }, facing: 'East', mask: 'Fox', height: 'Low', gate: true, note: 'fox gate' },
      { tile: { x: 1, z: -1 }, facing: 'East', mask: 'Fox', height: 'High', note: 'right moon' },
      { tile: { x: 1, z: 0 }, facing: 'South', mask: 'Oni', height: 'Low', gate: true, note: 'oni gate' },
      { tile: { x: 1, z: 1 }, facing: 'West', mask: 'Oni', height: 'High', note: 'back-right' },
      { tile: { x: 0, z: 1 }, facing: 'West', mask: 'Okame', height: 'Low', gate: true, note: 'okame gate' },
      { tile: { x: 0, z: 0 }, facing: 'North', mask: 'Okame', height: 'High', note: 'rope finale' }
    ]
  }
];

let best = readBest();
let state;
let audio = { ctx: null, enabled: false, muted: false };
window.__day050Audio = audio;

function readBest() {
  try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { return {}; }
}
function saveBest() {
  const next = {
    bestScore: Math.max(best.bestScore || 0, state.score),
    bestBlessing: state.blessingTime ? Math.min(best.bestBlessing || Infinity, state.blessingTime) : best.bestBlessing,
    longestPerfect: Math.max(best.longestPerfect || 0, state.perfectChain),
    bellStreak: Math.max(best.bellStreak || 0, state.bellStreak),
    endless: Math.max(best.endless || 0, Math.max(0, state.commissionIndex - 2)),
    omamori: Math.max(best.omamori || 0, state.seals)
  };
  if (!Number.isFinite(next.bestBlessing)) delete next.bestBlessing;
  best = next;
  localStorage.setItem(storageKey, JSON.stringify(best));
}
function resetState() {
  state = {
    running: false, paused: false, gameOver: false, blessing: false, startedAt: 0, elapsed: 0,
    score: 0, hearts: 3, balance: 100, hush: 100, strain: 0, timer: 0, combo: 0,
    tile: { x: 0, z: 0 }, facing: 0, mask: 0, gohei: 'Low', focus: 0, focusUntil: 0,
    commissionIndex: 0, markIndex: 0, warning: 'Start the First Star Step.', perfectChain: 0,
    bellStreak: 0, wrongMaskFinale: 0, seals: 0, selectedTile: null, blessingTime: null,
    noFocusThisCommission: true, cleanCommission: true, strainPeak: 0
  };
}
resetState();

// --- Three.js scene, authored from scratch for Day 050 ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x130923, 0.045);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let cameraYaw = 0;

const root = new THREE.Group();
scene.add(root);
scene.add(new THREE.AmbientLight(0xaec8ff, 1.2));
const moonLight = new THREE.DirectionalLight(0xcbe5ff, 2.3); moonLight.position.set(-3, 7, 5); scene.add(moonLight);
const lanternLight = new THREE.PointLight(0xffa84e, 65, 13); lanternLight.position.set(3, 3, 2.5); scene.add(lanternLight);
const stageGroup = new THREE.Group(); root.add(stageGroup);

const loader = new THREE.TextureLoader();
const dancerTexture = loader.load('./assets/kagura-dancer.png'); dancerTexture.colorSpace = THREE.SRGBColorSpace;
const piecesTexture = loader.load('./assets/kagura-pieces.png'); piecesTexture.colorSpace = THREE.SRGBColorSpace;
const tileMeshes = [];
const starMeshes = [];
const tileMat = new THREE.MeshStandardMaterial({ color: 0x8b5231, roughness: 0.62, metalness: 0.05 });
const activeTileMat = new THREE.MeshStandardMaterial({ color: 0xc97a3e, roughness: 0.5, emissive: 0x442000 });
for (let z = -1; z <= 1; z += 1) {
  for (let x = -1; x <= 1; x += 1) {
    const tile = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.18, 1.76), tileMat.clone());
    tile.position.set(x * 1.9, 0, z * 1.9);
    tile.userData.tile = { x, z };
    stageGroup.add(tile);
    tileMeshes.push(tile);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(tile.geometry), new THREE.LineBasicMaterial({ color: 0xf8c95c, transparent: true, opacity: 0.22 }));
    tile.add(edge);
  }
}
const platform = new THREE.Mesh(new THREE.BoxGeometry(6.35, 0.24, 6.35), new THREE.MeshStandardMaterial({ color: 0x4b241b, roughness: 0.8 }));
platform.position.y = -0.24; stageGroup.add(platform);

const dancer = new THREE.Group(); root.add(dancer);
const dancerPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.55), new THREE.MeshBasicMaterial({ map: dancerTexture, transparent: true, side: THREE.DoubleSide }));
dancerPlane.position.y = 1.05; dancer.add(dancerPlane);
const bodyShadow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28 }));
bodyShadow.rotation.x = -Math.PI / 2; bodyShadow.position.y = 0.03; dancer.add(bodyShadow);
const facingArrow = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.62, 3), new THREE.MeshBasicMaterial({ color: 0x73ccff }));
facingArrow.rotation.x = Math.PI / 2; facingArrow.position.y = 0.18; dancer.add(facingArrow);
const goheiRod = new THREE.Group(); dancer.add(goheiRod);
const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1), new THREE.MeshBasicMaterial({ color: 0x5a2c18 }));
rod.rotation.z = -0.42; rod.position.set(0.45, 1.1, 0.02); goheiRod.add(rod);
for (let i = 0; i < 4; i++) {
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.24), new THREE.MeshBasicMaterial({ color: 0xf8f3e7, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
  paper.position.set(0.54 + i * 0.04, 1.28 - i * 0.1, 0.04); paper.rotation.z = 0.2 * i; goheiRod.add(paper);
}
const beatRing = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.025, 10, 80), new THREE.MeshBasicMaterial({ color: 0x73ccff, transparent: true, opacity: 0.75 }));
beatRing.rotation.x = Math.PI / 2; beatRing.position.y = 0.16; root.add(beatRing);

for (let i = 0; i < 12; i++) {
  const star = new THREE.Mesh(new THREE.CircleGeometry(0.14, 5), new THREE.MeshBasicMaterial({ color: 0xf8c95c, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
  star.rotation.x = -Math.PI / 2;
  star.position.y = 0.13;
  root.add(star);
  starMeshes.push(star);
}
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xffbc62, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false });
for (const [x, z, rot] of [[-3.4, -2.4, -0.65], [3.4, -2.4, 0.65], [-3.4, 2.4, -2.45], [3.4, 2.4, 2.45]]) {
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.2, 32, 1, true), coneMaterial);
  cone.position.set(x, 1.18, z); cone.rotation.x = Math.PI / 2; cone.rotation.z = rot; root.add(cone);
}

const particles = [];
function burst(color = 0xf8c95c, count = 18) {
  for (let i = 0; i < count; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 }));
    p.position.copy(dancer.position); p.position.y = 0.5 + Math.random() * 0.8;
    p.userData.vel = new THREE.Vector3((Math.random() - .5) * .07, Math.random() * .07 + .025, (Math.random() - .5) * .07);
    p.userData.life = 1; root.add(p); particles.push(p);
  }
}

function currentCommission() { return state.commissionIndex < commissions.length ? commissions[state.commissionIndex] : endlessCommission(); }
function currentMark() { return currentCommission().marks[state.markIndex] || currentCommission().marks[0]; }
function endlessCommission() {
  const seed = state.commissionIndex * 17 + state.markIndex * 5;
  const marks = Array.from({ length: 5 + (state.commissionIndex % 4) }, (_, i) => ({
    tile: { x: ((i + seed) % 3) - 1, z: (Math.floor((i * 2 + seed) / 3) % 3) - 1 },
    facing: facings[(i + seed) % 4], mask: masks[(i + seed) % 3], height: i % 2 ? 'Low' : 'High',
    gate: i % 3 === 1, note: `endless ${i + 1}`
  }));
  return { name: `Endless Kagura ${state.commissionIndex - 1}`, targetScore: state.score + 2500, goal: 'Endless shrine-stage star path with moving lantern cones and paired mask gates.', marks };
}
function isBlueBeat() {
  const beat = 1.64 - Math.min(0.62, state.commissionIndex * 0.08);
  const phase = ((performance.now() - state.startedAt) / 1000 % beat) / beat;
  const focusBonus = performance.now() < state.focusUntil ? 0.11 : 0;
  return phase < 0.18 + focusBonus || phase > 0.88 - focusBonus;
}
function score(points, reason) {
  state.combo += 1;
  state.score += Math.round(points * (1 + Math.min(1.8, state.combo / 10)));
  state.focus = clamp(state.focus + Math.ceil(points / 80), 0, 100);
  state.warning = reason;
}
function penalize(reason, amount = 10) {
  state.combo = 0; state.cleanCommission = false;
  state.balance = clamp(state.balance - amount, 0, 100);
  state.hush = clamp(state.hush - amount * 0.8, 0, 100);
  state.timer = clamp(state.timer + amount * 0.7, 0, 100);
  if (amount >= 9) state.hearts = clamp(state.hearts - 1, 0, 3);
  state.warning = reason;
  if (state.hearts <= 0) lose('All three spirit-heart lives were lost.');
  if (state.balance <= 0 || state.hush <= 0 || state.timer >= 100) lose(reason);
}
function ensureAudio() {
  if (!audio.ctx) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audio.ctx = new Ctx();
    } catch { audio.ctx = null; }
  }
  if (audio.ctx?.state === 'suspended') audio.ctx.resume().catch(() => {});
  audio.enabled = Boolean(audio.ctx);
  audio.muted = state?.muted || false;
  window.__day050Audio = audio;
}
function playCue(type) {
  if (!audio.ctx || state.muted) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  const freq = { step: 190, stepBack: 145, gohei: 520, pose: 760, wrong: 105, bell: 1180, focus: 890, blessing: 1320, gate: 650 }[type] || 320;
  osc.type = type === 'bell' || type === 'blessing' ? 'sine' : 'triangle';
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(type === 'blessing' ? 0.12 : 0.06, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'blessing' ? 0.62 : 0.18));
  osc.connect(gain).connect(audio.ctx.destination);
  osc.start(now); osc.stop(now + 0.7);
}

function startGame() {
  ensureAudio();
  resetState(); state.running = true; state.startedAt = performance.now(); state.muted = audio.muted;
  menu.hidden = true; pauseOverlay.hidden = true; resultsOverlay.hidden = true; document.body.classList.remove('paused'); app.dataset.state = 'playing';
  playCue('gate'); updateUI();
}
function restart() { ensureAudio(); startGame(); }
function pause() { if (!state.running || state.gameOver) return; state.paused = true; pauseOverlay.hidden = false; document.body.classList.add('paused'); }
function resume() { state.paused = false; pauseOverlay.hidden = true; document.body.classList.remove('paused'); state.startedAt = performance.now() - state.elapsed * 1000; }
function lose(reason) {
  if (state.gameOver) return;
  state.gameOver = true; state.running = false; saveBest();
  resultKicker.textContent = 'Results · Kagura stage';
  resultTitle.textContent = 'The ritual lanterns dim.';
  resultText.textContent = `Final score ${state.score}. Reached ${currentCommission().name}. Hush ${Math.round(state.hush)}%, balance ${Math.round(state.balance)}%, strain peak ${Math.round(state.strainPeak)}%, wrong-mask poses ${state.wrongMaskFinale}, perfect poses ${state.perfectChain}, blue-beat bells ${state.bellStreak}. Cause: ${reason}.`;
  renderBadges(); resultsOverlay.hidden = false; updateUI();
}
function blessing() {
  if (state.blessing) return;
  state.blessing = true; state.blessingTime = Math.round(state.elapsed); state.score += 4000; state.seals += 1;
  state.hush = clamp(state.hush + 25, 0, 100); state.balance = clamp(state.balance + 25, 0, 100);
  burst(0xf8c95c, 80); playCue('blessing'); saveBest();
  resultKicker.textContent = 'Kagura Midpoint Blessing';
  resultTitle.textContent = 'Gold constellation stamped!';
  resultText.textContent = `All three choreographies cleared with ${state.score} points. Fox, oni, and okame masks orbit the dancer; endless shrine-stage sequences continue after this banner.`;
  renderBadges(); resultsOverlay.hidden = false;
  setTimeout(() => { if (!state.gameOver) resultsOverlay.hidden = true; }, 3600);
}
function renderBadges() {
  const earned = [];
  if (state.cleanCommission) earned.push('Clean current commission');
  if (state.blessingTime && state.blessingTime < 285) earned.push('Midpoint under 285s');
  if (state.bellStreak >= 5) earned.push('Five blue-beat bells');
  if (state.perfectChain >= 9) earned.push('Nine correct marks');
  if (state.hush > 70 && state.commissionIndex >= 3) earned.push('Finale hush above 70%');
  if (state.noFocusThisCommission) earned.push('No-focus dance');
  badges.innerHTML = (earned.length ? earned : ['Practice seal earned']).map((b) => `<span>${b}</span>`).join('');
}

function move(dx, dz) {
  if (!canAct()) return;
  ensureAudio();
  const next = { x: clamp(state.tile.x + dx, -1, 1), z: clamp(state.tile.z + dz, -1, 1) };
  if (next.x === state.tile.x && next.z === state.tile.z) return explain('Cedar rail blocks that step; pick another lane.');
  state.tile = next;
  const onRoute = currentMark() && next.x === currentMark().tile.x && next.z === currentMark().tile.z;
  if (isBlueBeat() || onRoute) {
    score(onRoute ? 130 : 60, onRoute ? 'Clean step landed on the active star mark.' : 'Balanced rhythm step.');
    state.balance = clamp(state.balance + 2, 0, 100);
  } else penalize('Step landed off the blue rhythm window; balance wavers.', 5);
  playCue(dz > 0 ? 'stepBack' : 'step'); burst(onRoute ? 0xf8c95c : 0x73ccff, onRoute ? 18 : 6); updateUI();
}
function turn(delta) {
  if (!canAct()) return; ensureAudio(); state.facing = modulo(state.facing + delta, 4);
  if (facings[state.facing] === currentMark().facing) score(180, 'Facing arrow aligned with the lantern direction.');
  else state.warning = `Facing ${facings[state.facing]}; active mark wants ${currentMark().facing}.`;
  playCue('gohei'); updateUI();
}
function setGohei(height) {
  if (!canAct()) return; ensureAudio(); state.gohei = height; state.strain = height === 'High' ? clamp(state.strain + 7, 0, 100) : clamp(state.strain - 12, 0, 100);
  if (height === 'Low') { state.balance = clamp(state.balance + 7, 0, 100); score(80, 'Low gohei grounds the feet and restores balance.'); }
  else if (currentMark().height === 'High') score(120, 'High gohei catches moon ribbons for this mark.');
  else state.warning = 'Gohei height changed; check the active mark before striking.';
  playCue('gohei'); burst(height === 'High' ? 0xf8c95c : 0x82e6a8, 8); updateUI();
}
function strikePose() {
  if (!canAct()) return; ensureAudio();
  const mark = currentMark();
  const tileOk = state.tile.x === mark.tile.x && state.tile.z === mark.tile.z;
  const faceOk = facings[state.facing] === mark.facing;
  const maskOk = masks[state.mask] === mark.mask;
  const heightOk = state.gohei === mark.height;
  const beatOk = isBlueBeat();
  if (tileOk && faceOk && maskOk && heightOk) {
    score(beatOk ? 740 : 320, beatOk ? 'Perfect blue-beat pose stamped gold streamers.' : 'Correct pose stamped; aim for the blue ring bonus.');
    state.perfectChain += beatOk ? 1 : 0;
    playCue('pose'); burst(beatOk ? 0x73ccff : 0xf8c95c, beatOk ? 38 : 22);
    state.markIndex += 1;
    if (state.markIndex >= currentCommission().marks.length) completeCommission();
  } else {
    if (!maskOk && state.commissionIndex === 2) state.wrongMaskFinale += 1;
    playCue('wrong'); penalize(`Wrong pose: ${!tileOk ? 'tile ' : ''}${!faceOk ? 'facing ' : ''}${!maskOk ? 'mask ' : ''}${!heightOk ? 'gohei ' : ''}needs correction.`, !maskOk ? 14 : 9);
    state.score += 40;
    state.perfectChain = 0;
  }
  updateUI();
}
function ringBells() {
  if (!canAct()) return; ensureAudio();
  if (isBlueBeat()) {
    score(260, 'Kagura bells landed on the blue beat; hush restored and timing window widens.');
    state.hush = clamp(state.hush + 14, 0, 100); state.balance = clamp(state.balance + 5, 0, 100); state.bellStreak += 1;
    playCue('bell'); burst(0x73ccff, 24);
  } else { state.bellStreak = 0; playCue('wrong'); penalize('Off-beat bell clank startled the audience.', 7); }
  updateUI();
}
function maskSwap() {
  if (!canAct()) return; ensureAudio();
  const mark = currentMark();
  const focusActive = performance.now() < state.focusUntil;
  if (mark.gate || focusActive) {
    state.mask = modulo(state.mask + 1, masks.length);
    score(300, `${masks[state.mask]} mask readied at a valid gate.`);
    playCue('gate'); burst(0xff7d84, 16);
  } else {
    state.warning = `Mask remains ${masks[state.mask]}: swap only at mask-gate marks or during Star Focus.`;
    state.hush = clamp(state.hush - 2, 0, 100);
  }
  updateUI();
}
function starFocus() {
  if (!canAct()) return; ensureAudio();
  if (state.focus >= 35) {
    state.focus -= 35; state.focusUntil = performance.now() + 6500; state.noFocusThisCommission = false;
    state.warning = 'Star Focus previews route order, beat window, mask gates, lantern arrows, balance risk, hush pressure, and safest next action.';
    playCue('focus'); burst(0x73ccff, 28);
  } else state.warning = `Star Focus needs 35%; charge is ${Math.round(state.focus)}%.`;
  updateUI();
}
function completeCommission() {
  const perfectBonus = state.cleanCommission ? 1700 : 0;
  state.score += 1180 + perfectBonus; state.seals += 1; state.hearts = clamp(state.hearts + 1, 1, 3);
  state.hush = clamp(state.hush + 18, 0, 100); state.balance = clamp(state.balance + 18, 0, 100); state.timer = clamp(state.timer - 18, 0, 100);
  state.commissionIndex += 1; state.markIndex = 0; state.cleanCommission = true; state.noFocusThisCommission = true;
  state.warning = `Omamori seal stamped for ${commissions[Math.max(0, state.commissionIndex - 1)]?.name || 'endless dance'}.`;
  burst(0xf8c95c, 54); playCue('blessing');
  if (state.commissionIndex >= 3 && state.score >= 6400) blessing();
}
function canAct() { return state.running && !state.paused && !state.gameOver; }
function explain(text) { state.warning = text; hud.helper.textContent = text; hud.feedback.textContent = text; }

const actions = {
  stepLeft: () => move(-1, 0), stepRight: () => move(1, 0), stepForward: () => move(0, -1), stepBack: () => move(0, 1),
  turnLeft: () => turn(-1), turnRight: () => turn(1), raiseGohei: () => setGohei('High'), lowerGohei: () => setGohei('Low'),
  strikePose, ringBells, maskSwap, starFocus, pause, resume, restart,
  audio: () => { ensureAudio(); state.muted = !state.muted; audio.muted = state.muted; state.warning = state.muted ? 'Audio muted; visual cues remain active.' : 'Audio enabled after user gesture.'; playCue('bell'); updateUI(); }
};
document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (target) actions[target.dataset.action]?.();
});
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const map = { arrowleft: 'stepLeft', a: 'stepLeft', arrowright: 'stepRight', d: 'stepRight', arrowup: 'stepForward', arrowdown: 'stepBack', q: 'turnLeft', e: 'turnRight', w: 'raiseGohei', s: 'lowerGohei', ' ': 'strikePose', enter: 'strikePose', b: 'ringBells', m: 'maskSwap', f: 'starFocus', p: 'pause', escape: 'pause', r: 'restart' };
  if (map[key]) { event.preventDefault(); actions[map[key]](); }
});

let dragging = false, lastX = 0;
canvas.addEventListener('pointerdown', (event) => { dragging = false; lastX = event.clientX; canvas.setPointerCapture(event.pointerId); });
canvas.addEventListener('pointermove', (event) => { if (event.buttons) { const dx = event.clientX - lastX; if (Math.abs(dx) > 3) dragging = true; cameraYaw = clamp(cameraYaw + dx * 0.004, -0.38, 0.38); lastX = event.clientX; } });
canvas.addEventListener('pointerup', (event) => {
  if (dragging) { explain('Camera offset preview: stage rotated slightly; dancer controls remain camera-relative by labels.'); return; }
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObjects(tileMeshes)[0];
  if (hit?.object?.userData?.tile) {
    state.selectedTile = hit.object.userData.tile;
  } else {
    const fx = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const fy = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    state.selectedTile = {
      x: clamp(Math.floor((fx - 0.1) / 0.27) - 1, -1, 1),
      z: clamp(Math.floor((fy - 0.34) / 0.21) - 1, -1, 1)
    };
  }
  explain(`Selected ${tileLabel(state.selectedTile)}. Active star wants ${tileLabel(currentMark().tile)}, ${currentMark().facing}, ${currentMark().mask}, ${currentMark().height} gohei.`); updateUI();
});

function updateUI() {
  const c = currentCommission(); const mark = currentMark(); const blue = isBlueBeat();
  menuBest.textContent = best.bestScore || 0; menuBlessing.textContent = best.bestBlessing ? `${best.bestBlessing}s` : '—';
  hud.score.textContent = state.score; hud.best.textContent = Math.max(best.bestScore || 0, state.score);
  hud.hearts.textContent = state.hearts; hud.balance.textContent = `${Math.round(state.balance)}%`; hud.hush.textContent = `${Math.round(state.hush)}%`;
  hud.strain.textContent = `${Math.round(state.strain)}%`; hud.timer.textContent = `${Math.round(state.timer)}%`; hud.combo.textContent = state.combo;
  hud.tile.textContent = tileLabel(state.tile); hud.facing.textContent = facings[state.facing]; hud.mask.textContent = masks[state.mask]; hud.focus.textContent = `${Math.round(state.focus)}%`;
  hud.elapsed.textContent = `${Math.floor(state.elapsed / 60)}:${String(Math.floor(state.elapsed % 60)).padStart(2, '0')}`;
  hud.commissionName.textContent = c.name; hud.commissionGoal.textContent = c.goal;
  hud.markList.innerHTML = c.marks.map((m, i) => `<li class="${i < state.markIndex ? 'done' : i === state.markIndex ? 'active' : ''}">${i + 1}. ${tileLabel(m.tile)} · ${m.facing} · ${m.mask} · ${m.height}${m.gate ? ' · gate' : ''}</li>`).join('');
  const checks = [state.tile.x === mark.tile.x && state.tile.z === mark.tile.z ? 'tile ✓' : `tile → ${tileLabel(mark.tile)}`, facings[state.facing] === mark.facing ? 'face ✓' : `face ${mark.facing}`, masks[state.mask] === mark.mask ? 'mask ✓' : `mask ${mark.mask}`, state.gohei === mark.height ? 'gohei ✓' : `${mark.height} gohei`, blue ? 'blue beat ✓' : 'wait blue ring'];
  hud.helper.textContent = `Next ${c.name} mark ${state.markIndex + 1}: ${checks.join(' · ')}. ${state.warning}`;
  hud.feedback.textContent = `${blue ? 'Blue beat window open' : 'Gold path rehearsing'} · ${state.gohei} gohei · ${state.warning}`;
  focusOverlay.hidden = performance.now() >= state.focusUntil;
}

function updateScene(dt) {
  const w = canvas.clientWidth || 390, h = canvas.clientHeight || 260;
  if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  camera.position.set(Math.sin(cameraYaw) * 3.2, 6.1, -7.0 + Math.cos(cameraYaw) * 0.7);
  camera.lookAt(0, 0.05, 0.25);
  root.rotation.y = cameraYaw * 0.25;
  const target = new THREE.Vector3(state.tile.x * 1.9, 0.12, state.tile.z * 1.9);
  dancer.position.lerp(target, 0.18);
  dancer.rotation.y = [0, -Math.PI / 2, Math.PI, Math.PI / 2][state.facing];
  dancerPlane.lookAt(camera.position.x, dancerPlane.position.y + 0.2, camera.position.z);
  facingArrow.rotation.z = [0, -Math.PI / 2, Math.PI, Math.PI / 2][state.facing];
  goheiRod.rotation.z = state.gohei === 'High' ? -0.12 : -0.68;
  const beatScale = isBlueBeat() ? 1.2 : 0.72 + Math.sin(performance.now() * 0.004) * 0.08;
  beatRing.position.x = dancer.position.x; beatRing.position.z = dancer.position.z; beatRing.scale.setScalar(beatScale); beatRing.material.opacity = isBlueBeat() ? 0.95 : 0.38;
  tileMeshes.forEach((tile) => { const active = tile.userData.tile.x === state.tile.x && tile.userData.tile.z === state.tile.z; tile.material.color.setHex(active ? 0xc97a3e : 0x8b5231); tile.material.emissive?.setHex(active ? 0x331800 : 0x000000); });
  const c = currentCommission();
  starMeshes.forEach((star, i) => {
    const mark = c.marks[i % c.marks.length];
    star.visible = i < c.marks.length || performance.now() < state.focusUntil;
    const moving = state.commissionIndex >= 2 && i === state.markIndex;
    star.position.x = mark.tile.x * 1.9 + (moving ? Math.sin(performance.now() * 0.0017) * 0.25 : 0);
    star.position.z = mark.tile.z * 1.9 + (moving ? Math.cos(performance.now() * 0.0013) * 0.22 : 0);
    star.scale.setScalar(i === state.markIndex ? 1.85 : i < state.markIndex ? 0.7 : 1.05);
    star.material.opacity = i < state.markIndex ? 0.25 : i === state.markIndex ? 0.95 : (performance.now() < state.focusUntil ? 0.65 : 0.28);
    star.material.color.setHex(mark.gate ? 0xff7d84 : 0xf8c95c);
  });
  particles.forEach((p, i) => { p.position.add(p.userData.vel); p.userData.vel.y -= 0.0025; p.userData.life -= dt * 1.6; p.material.opacity = Math.max(0, p.userData.life); if (p.userData.life <= 0) { root.remove(p); particles.splice(i, 1); } });
  renderer.render(scene, camera);
}
let last = performance.now();
function tick(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (state.running && !state.paused && !state.gameOver) {
    state.elapsed = (now - state.startedAt) / 1000;
    state.timer = clamp(state.timer + dt * (0.42 + state.commissionIndex * 0.1), 0, 100);
    state.hush = clamp(state.hush - dt * (0.45 + state.commissionIndex * 0.12), 0, 100);
    if (state.gohei === 'High') state.strain = clamp(state.strain + dt * 1.5, 0, 100); else state.strain = clamp(state.strain - dt * 2.8, 0, 100);
    state.strainPeak = Math.max(state.strainPeak, state.strain);
    if (state.strain >= 100) lose('Pose strain reached 100% while off-balance.');
    if (state.timer >= 100) lose('Lantern timer reached 100%.');
    if (state.hush <= 0) lose('Audience hush fell to 0%.');
    if (state.wrongMaskFinale >= 2) lose('Two wrong-mask finale poses broke the chain.');
    updateUI();
  }
  updateScene(dt); requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
updateUI();

window.__day050Debug = {
  state: () => ({ ...state, commission: currentCommission().name, activeMark: currentMark() }),
  action: (name) => actions[name]?.(),
  setFocusCharge: (value = 100) => { state.focus = clamp(Number(value) || 0, 0, 100); updateUI(); },
  setPerfectPose: () => { const m = currentMark(); state.tile = { ...m.tile }; state.facing = facings.indexOf(m.facing); state.mask = masks.indexOf(m.mask); state.gohei = m.height; updateUI(); },
  forceLose: () => lose('Debug forced result overlay for route smoke.'),
  forceBlessing: () => { state.score = 6500; state.commissionIndex = 3; blessing(); updateUI(); }
};
