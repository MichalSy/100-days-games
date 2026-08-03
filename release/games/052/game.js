import * as THREE from './assets/three.module.min.js';

const $ = (id) => document.getElementById(id);
const ui = {
  score: $('score'), best: $('best'), hearts: $('hearts'), risk: $('risk'), fog: $('fog'), tide: $('tide'), gateDamage: $('gateDamage'), combo: $('combo'),
  activeBoat: $('activeBoat'), flagState: $('flagState'), beamState: $('beamState'), focus: $('focus'), timer: $('timer'),
  commissionName: $('commissionName'), commissionGoal: $('commissionGoal'), steps: $('steps'), helper: $('helper'), caption: $('sceneCaption'),
  menu: $('menuOverlay'), pause: $('pauseOverlay'), result: $('resultOverlay'), resultText: $('resultText'), badges: $('badges'), canvas: $('gameCanvas')
};

const lanes = [
  { name: 'Near', z: 2.15, color: 0x7ee6ff },
  { name: 'Mid', z: 0.15, color: 0x7fffd4 },
  { name: 'Far', z: -1.9, color: 0xa7d7ff }
];
const beamNames = ['East', 'South', 'West', 'North'];
const commissions = [
  {
    name: 'First Harbor Signal',
    goal: 'Guide boat 1 through the mid buoy, raise the flag, ring the bell, then open the tide gate.',
    steps: ['Mid lane lit', 'Flag raised', 'Bell rung', 'Gate opened'],
    targetLane: 1,
    score: 1450
  },
  {
    name: 'Fog Bell Narrows',
    goal: 'Clear violet fog, drop a guide buoy, send the tug around the pier, and ring the hidden buoy bell.',
    steps: ['Fog fanned', 'Buoy dropped', 'Tug save', 'Bell sequence'],
    targetLane: 0,
    score: 2050
  },
  {
    name: 'Sunrise Breakwater Convoy',
    goal: 'Use Kamome Focus, guide three boats, open both gates in time, and keep channel risk below 55%.',
    steps: ['Focus preview', 'Convoy aligned', 'Gate window', 'Safe pier'],
    targetLane: 2,
    score: 3100
  }
];

const state = {
  started: false, paused: false, gameOver: false, score: 0, best: Number(localStorage.getItem('day052-best') || 0), hearts: 3,
  risk: 0, fog: 12, gateDamage: 0, tideLevel: 1, combo: 0, focus: 0, elapsed: 0, lastTick: performance.now(),
  activeLane: 1, beamIndex: 0, flagHigh: false, commission: 0, stepProgress: [false, false, false, false],
  gateOpen: false, muted: localStorage.getItem('day052-muted') === '1', tugCooldown: 0, focusActive: false,
  clearTriggered: false, perfectBells: 0, tugSaves: 0, boatsSaved: 0, fogPeak: 12
};

let renderer, scene, camera, clock;
let harborGroup, laneMeshes = [], boats = [], buoys = [], fogSheets = [], gates = [], focusOverlay, lighthousePivot, beamMesh, flagMesh, tugMesh, signalkeeper;
let audio = { ctx: null, enabled: false };

function assetUrl(name) { return new URL(`./assets/${name}`, import.meta.url).href; }

function initThree() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x94e7ee, 9, 22);
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 7.2, 8.8);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.shadowMap.enabled = true;
  ui.canvas.appendChild(renderer.domElement);
  clock = new THREE.Clock();

  const hemi = new THREE.HemisphereLight(0xfff1c5, 0x236879, 2.35);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffcf73, 2.15);
  sun.position.set(-4, 8, 5);
  scene.add(sun);

  harborGroup = new THREE.Group();
  scene.add(harborGroup);
  makeHarbor();
  makeSprites();
  makeFocusOverlay();
  resize();
  animate();
}

function makeHarbor() {
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x42c6dd, roughness: 0.45, metalness: 0.05, transparent: true, opacity: 0.72 });
  const laneGeo = new THREE.BoxGeometry(7.9, 0.08, 1.26);
  lanes.forEach((lane, i) => {
    const laneMat = waterMat.clone();
    laneMat.color.setHex(lane.color);
    laneMat.opacity = i === state.activeLane ? 0.9 : 0.52;
    const mesh = new THREE.Mesh(laneGeo, laneMat);
    mesh.position.set(0, -0.08 + i * 0.05, lane.z);
    mesh.userData.lane = i;
    harborGroup.add(mesh);
    laneMeshes.push(mesh);

    const line = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.02, 0.035), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
    line.position.set(0, 0.02 + i * 0.05, lane.z - 0.65);
    harborGroup.add(line);
  });

  const pierMat = new THREE.MeshStandardMaterial({ color: 0x6b4937, roughness: 0.85 });
  for (const x of [-4.7, 4.7]) {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.32, 6.7), pierMat);
    pier.position.set(x, 0.08, 0.1);
    harborGroup.add(pier);
  }

  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.5, 1.95, 18), new THREE.MeshStandardMaterial({ color: 0xf2d18b, roughness: 0.32, metalness: 0.25 }));
  tower.position.set(-3.55, 1.0, -2.45);
  harborGroup.add(tower);
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 12), new THREE.MeshBasicMaterial({ color: 0xfff0a5 }));
  lens.position.set(-3.55, 2.05, -2.45);
  harborGroup.add(lens);

  lighthousePivot = new THREE.Group();
  lighthousePivot.position.copy(lens.position);
  const beamGeo = new THREE.ConeGeometry(0.62, 6.0, 32, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xffe28a, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide });
  beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.rotation.x = Math.PI / 2;
  beamMesh.position.z = -2.8;
  lighthousePivot.add(beamMesh);
  harborGroup.add(lighthousePivot);

  flagMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.42), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
  flagMesh.position.set(3.65, 1.25, -2.25);
  harborGroup.add(flagMesh);

  const buoyGeo = new THREE.CylinderGeometry(0.18, 0.25, 0.36, 16);
  [2.15, 0.15, -1.9].forEach((z, i) => {
    const buoy = new THREE.Mesh(buoyGeo, new THREE.MeshStandardMaterial({ color: [0xffda66, 0xffffff, 0xff7566][i], roughness: 0.38, metalness: 0.12 }));
    buoy.position.set(-1 + i * 1.05, 0.28, z);
    buoy.userData.baseY = buoy.position.y;
    harborGroup.add(buoy);
    buoys.push(buoy);
  });

  const boatGeo = new THREE.BoxGeometry(0.78, 0.3, 0.36);
  [0, 1, 2].forEach((laneIndex, i) => {
    const boat = new THREE.Group();
    const hull = new THREE.Mesh(boatGeo, new THREE.MeshStandardMaterial({ color: [0xd85d3f, 0x244e73, 0xf0bf52][i], roughness: 0.54 }));
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffe38b }));
    lamp.position.set(0.18, 0.28, 0);
    boat.add(hull, lamp);
    boat.position.set(-3.1 - i * 0.35, 0.32, lanes[laneIndex].z);
    boat.userData = { lane: laneIndex, targetX: 2.8 + i * 0.35, speed: 0.18 + i * 0.025, baseZ: lanes[laneIndex].z };
    harborGroup.add(boat);
    boats.push(boat);
  });

  for (const z of [2.15, 0.15, -1.9]) {
    const gate = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.62, 0.18), new THREE.MeshStandardMaterial({ color: 0xa9312a }));
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.12, 0.12), new THREE.MeshStandardMaterial({ color: 0xfff1d0 }));
    arm.position.x = 0.55;
    gate.add(post, arm);
    gate.position.set(2.45, 0.5, z);
    gate.userData.arm = arm;
    harborGroup.add(gate);
    gates.push(gate);
  }

  const tug = new THREE.Group();
  const tugHull = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.25, 0.28), new THREE.MeshStandardMaterial({ color: 0x153e54 }));
  const tugCab = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.2), new THREE.MeshStandardMaterial({ color: 0xf3f1dc }));
  tugCab.position.y = 0.23;
  tug.add(tugHull, tugCab);
  tug.position.set(-4.2, 0.33, 2.95);
  tug.visible = false;
  harborGroup.add(tug);
  tugMesh = tug;

  const fogMat = new THREE.MeshBasicMaterial({ color: 0xdab6ff, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide });
  [0.65, -1.1, 2.4].forEach((z, i) => {
    const fog = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.15), fogMat.clone());
    fog.position.set(0.9 + i * 0.9, 0.95, z);
    fog.rotation.x = -0.15;
    harborGroup.add(fog);
    fogSheets.push(fog);
  });
}

function makeSprites() {
  const loader = new THREE.TextureLoader();
  const signalTex = loader.load(assetUrl('kamome-signalkeeper.png'));
  signalTex.colorSpace = THREE.SRGBColorSpace;
  signalkeeper = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.35), new THREE.MeshBasicMaterial({ map: signalTex, transparent: true, alphaTest: 0.04, side: THREE.DoubleSide }));
  signalkeeper.position.set(3.55, 0.92, 2.55);
  signalkeeper.rotation.y = -0.38;
  harborGroup.add(signalkeeper);
}

function makeFocusOverlay() {
  focusOverlay = new THREE.Group();
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.75, depthWrite: false });
  for (const lane of lanes) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.025, 8, 48), ringMat);
    ring.position.set(0.05, 0.5, lane.z);
    ring.rotation.x = Math.PI / 2;
    focusOverlay.add(ring);
  }
  const path = new THREE.Mesh(new THREE.BoxGeometry(5.7, 0.035, 0.035), new THREE.MeshBasicMaterial({ color: 0xffef99, transparent: true, opacity: 0.72 }));
  path.position.set(0.2, 0.64, lanes[state.activeLane].z);
  path.userData.isPath = true;
  focusOverlay.add(path);
  focusOverlay.visible = false;
  harborGroup.add(focusOverlay);
}

function startGame() {
  if (!state.started) {
    state.started = true;
    state.lastTick = performance.now();
    initAudio();
  }
  ui.menu.classList.add('hidden');
  ui.helper.textContent = 'First Harbor Signal: shift the mid lane, raise the flag, ring the buoy, then open the gate.';
  playTone('start');
  updateUI();
}

function restart() {
  Object.assign(state, { started: true, paused: false, gameOver: false, score: 0, hearts: 3, risk: 0, fog: 12, gateDamage: 0, tideLevel: 1, combo: 0, focus: 0, elapsed: 0, lastTick: performance.now(), activeLane: 1, beamIndex: 0, flagHigh: false, commission: 0, stepProgress: [false,false,false,false], gateOpen: false, tugCooldown: 0, focusActive: false, clearTriggered: false, perfectBells: 0, tugSaves: 0, boatsSaved: 0, fogPeak: 12 });
  boats.forEach((boat, i) => { boat.userData.lane = i; boat.position.set(-3.1 - i * 0.35, 0.32, lanes[i].z); });
  tugMesh.visible = false;
  focusOverlay.visible = false;
  ui.menu.classList.add('hidden');
  ui.pause.classList.add('hidden');
  ui.result.classList.add('hidden');
  updateUI('Harbor restarted. Aim the dawn beam and guide the first lantern boat.');
}

function initAudio() {
  if (!audio.ctx) {
    try {
      audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      audio.ctx = null;
    }
  }
  if (audio.ctx && audio.ctx.state !== 'running') audio.ctx.resume().catch(() => {});
  audio.enabled = Boolean(audio.ctx && !state.muted);
  window.__day052Audio = { ctx: audio.ctx, enabled: audio.enabled };
}

function playTone(kind) {
  if (!audio.enabled || !audio.ctx) return;
  const table = { start: [330, .08], rotate: [520, .05], flag: [420, .06], bell: [760, .12], gate: [210, .08], tug: [310, .14], buoy: [610, .07], fog: [260, .18], focus: [880, .16], clear: [660, .22], bad: [120, .12] };
  const [freq, dur] = table[kind] || [440, .08];
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = kind === 'fog' ? 'sawtooth' : 'sine';
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(gain).connect(audio.ctx.destination);
  osc.start(now); osc.stop(now + dur + 0.03);
}

function score(points, msg) {
  state.score += Math.round(points * (1 + Math.min(state.combo, 12) * 0.04));
  state.combo += 1;
  state.focus = Math.min(100, state.focus + 12);
  updateUI(msg);
}
function penalty(amount, msg) {
  state.combo = 0;
  state.risk = Math.min(100, state.risk + amount);
  if (state.risk >= 100) loseHeart('Channel risk overflow');
  playTone('bad');
  updateUI(msg);
}
function loseHeart(reason) {
  state.hearts -= 1;
  state.risk = 40;
  state.fog = Math.min(100, state.fog + 8);
  if (state.hearts <= 0) endGame(false, reason);
}

function completeStep(index, msg) {
  if (!state.stepProgress[index]) {
    state.stepProgress[index] = true;
    score([320, 340, 430, 410][index] || 300, msg);
    if (state.stepProgress.every(Boolean)) completeCommission();
  } else {
    score(110, `${msg} Extra timing bonus.`);
  }
}

function completeCommission() {
  const data = commissions[state.commission];
  state.score += data.score;
  state.boatsSaved += state.commission + 1;
  state.focus = Math.min(100, state.focus + 24);
  state.hearts = Math.min(3, state.hearts + 1);
  if (state.commission >= commissions.length - 1) {
    if (state.score >= 6600 && !state.clearTriggered) {
      state.clearTriggered = true;
      state.score += 4200;
      playTone('clear');
      showClearBanner();
    } else {
      state.commission = 1;
      state.stepProgress = [false,false,false,false];
    }
  } else {
    state.commission += 1;
    state.stepProgress = [false,false,false,false];
  }
  updateUI(`${data.name} sealed. Shell-route stamp awarded; next harbor commission is live.`);
}

function action(name) {
  if (name === 'prompt') return openPrompt();
  if (name === 'audio') return toggleAudio();
  if (name === 'restart') return restart();
  if (name === 'pause') return togglePause();
  if (name === 'resume') return togglePause(false);
  if (!state.started) return startGame();
  if (state.paused || state.gameOver) return;
  initAudio();
  const commission = commissions[state.commission];
  switch (name) {
    case 'shiftLane': {
      state.activeLane = (state.activeLane + 1) % lanes.length;
      boats[0].userData.lane = state.activeLane;
      boats[0].position.z = lanes[state.activeLane].z;
      signalkeeper.position.z = 2.55 - state.activeLane * 0.35;
      if (state.activeLane === commission.targetLane) completeStep(0, `Shift Lane: active boat moved to ${lanes[state.activeLane].name}; lane wake glows.`);
      else penalty(5, `Shift Lane: ${lanes[state.activeLane].name} selected, but this commission wants ${lanes[commission.targetLane].name}.`);
      break;
    }
    case 'rotateLight': {
      state.beamIndex = (state.beamIndex + 1) % beamNames.length;
      lighthousePivot.rotation.y = state.beamIndex * Math.PI / 2;
      fogSheets.forEach((fog, i) => { fog.material.opacity = Math.max(0.08, fog.material.opacity - 0.03 * (i + 1)); });
      playTone('rotate');
      score(180, `Rotate Lighthouse: beam points ${beamNames[state.beamIndex]} and reveals fog shimmer.`);
      break;
    }
    case 'raiseFlag': {
      state.flagHigh = true;
      flagMesh.position.y = 1.72;
      flagMesh.material.color.setHex(0xfff4d8);
      playTone('flag');
      completeStep(1, 'Raise Flag: high signal gives boat speed through open water.');
      break;
    }
    case 'lowerFlag': {
      state.flagHigh = false;
      flagMesh.position.y = 1.02;
      flagMesh.material.color.setHex(0xaee6ff);
      playTone('flag');
      score(240, 'Lower Flag: docking approach stabilizes wake near the pier.');
      break;
    }
    case 'ringBell': {
      const buoy = buoys[state.activeLane];
      buoy.scale.set(1.45, 1.45, 1.45);
      setTimeout(() => buoy.scale.set(1,1,1), 180);
      playTone('bell');
      state.perfectBells += 1;
      completeStep(state.commission === 2 ? 1 : 3, 'Ring Buoy Bell: correct ceramic chime pulls the boat into a safe arc.');
      break;
    }
    case 'openGate': {
      state.gateOpen = !state.gateOpen;
      gates.forEach((gate, i) => { gate.userData.arm.rotation.y = state.gateOpen ? Math.PI / 2 : 0; gate.userData.arm.material.color.setHex(state.gateOpen ? 0x7ef4d0 : 0xfff1d0); });
      playTone('gate');
      if (state.tideLevel === 1 || state.commission === 0) completeStep(state.commission === 2 ? 2 : 3, 'Open Tide Gate: red arms swing clear in the green tide window.');
      else penalty(7, 'Open Tide Gate: timing is rough; wake turbulence scuffs the gate.');
      break;
    }
    case 'sendTug': {
      if (state.tugCooldown > 0) return penalty(4, 'Send Tug: tug is still turning around the pier.');
      state.tugCooldown = 6;
      state.tugSaves += 1;
      tugMesh.visible = true;
      tugMesh.position.set(-3.8, 0.34, lanes[state.activeLane].z + 0.35);
      playTone('tug');
      completeStep(2, 'Send Tug: helper tug draws a visible rescue route around the pier.');
      break;
    }
    case 'dropBuoy': {
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 10), new THREE.MeshBasicMaterial({ color: 0xffd166 }));
      marker.position.set(0.95 + Math.random() * 0.7, 0.45, lanes[state.activeLane].z + 0.22);
      marker.userData.life = 7;
      harborGroup.add(marker);
      playTone('buoy');
      completeStep(1, 'Drop Buoy: temporary ceramic marker bends the boat route before fog hides it.');
      break;
    }
    case 'fanFog': {
      state.fog = Math.max(0, state.fog - 18);
      fogSheets.forEach((fog) => { fog.material.opacity = Math.max(0.03, fog.material.opacity - 0.13); fog.scale.multiplyScalar(0.92); });
      playTone('fog');
      completeStep(0, 'Fan Fog: violet sheet peels away and hidden channel markers appear.');
      break;
    }
    case 'focus': {
      if (state.focus < 60) return penalty(3, 'Kamome Focus needs more clean signals before it can preview the harbor.');
      state.focus = Math.max(0, state.focus - 60);
      state.focusActive = true;
      focusOverlay.visible = true;
      focusOverlay.children.forEach((child) => { if (child.userData.isPath) child.position.z = lanes[state.activeLane].z; });
      playTone('focus');
      completeStep(0, 'Kamome Focus: gold overlay previews boat path, buoy order, gate timing, fog spread, and tug lane.');
      setTimeout(() => { state.focusActive = false; focusOverlay.visible = false; updateUI(); }, 4500);
      break;
    }
  }
  updateUI();
}

function showClearBanner() {
  ui.caption.textContent = 'Kamome Dawn Harbor Clear! Sunrise gold fills the water and endless tide commissions unlock.';
  ui.caption.style.color = '#ffe68a';
  setTimeout(() => { ui.caption.style.color = ''; }, 5000);
}

function togglePause(force) {
  if (!state.started || state.gameOver) return;
  state.paused = force === undefined ? !state.paused : Boolean(force);
  ui.pause.classList.toggle('hidden', !state.paused);
  updateUI(state.paused ? 'Paused. Review the signal plan, then resume the harbor watch.' : 'Resumed. Watch the tide gate and buoy order.');
}

function toggleAudio() {
  state.muted = !state.muted;
  localStorage.setItem('day052-muted', state.muted ? '1' : '0');
  initAudio();
  document.querySelectorAll('[data-action="audio"]').forEach((button) => button.textContent = state.muted ? 'Audio: Off' : 'Audio: On');
  updateUI(state.muted ? 'Audio muted; visual cues remain active.' : 'Audio enabled after gesture.');
}

function openPrompt() { window.location.href = './prompt.html'; }

function endGame(won, reason = '') {
  state.gameOver = true;
  state.best = Math.max(state.best, state.score);
  localStorage.setItem('day052-best', String(state.best));
  const clear = won || state.clearTriggered;
  ui.resultText.textContent = `${clear ? 'Dawn Harbor Clear secured.' : 'Harbor watch ended.'} Final score ${state.score}. Boats saved ${state.boatsSaved}. Perfect bells ${state.perfectBells}. Tug saves ${state.tugSaves}. Fog peak ${state.fogPeak}%. ${reason}`;
  const badgeList = ['Shell-route seal', state.perfectBells >= 4 ? 'Perfect buoy chain' : 'Buoy trainee', state.tugSaves ? 'Tug rescue' : 'No tug save', state.fogPeak < 50 ? 'Clean fog clear' : 'Fog survivor'];
  ui.badges.innerHTML = badgeList.map((badge) => `<span>${badge}</span>`).join('');
  ui.result.classList.remove('hidden');
  updateUI();
}

function updateUI(message) {
  const c = commissions[state.commission];
  ui.score.textContent = state.score;
  ui.best.textContent = Math.max(state.best, state.score);
  ui.hearts.textContent = Math.max(0, state.hearts);
  ui.risk.textContent = `${Math.round(state.risk)}%`;
  ui.fog.textContent = `${Math.round(state.fog)}%`;
  ui.tide.textContent = ['Low', 'Mid', 'High'][state.tideLevel];
  ui.gateDamage.textContent = `${Math.round(state.gateDamage)}%`;
  ui.combo.textContent = state.combo;
  ui.activeBoat.textContent = `1 ${lanes[state.activeLane].name}`;
  ui.flagState.textContent = state.flagHigh ? 'High' : 'Low';
  ui.beamState.textContent = beamNames[state.beamIndex];
  ui.focus.textContent = `${Math.round(state.focus)}%`;
  ui.timer.textContent = formatTime(state.elapsed);
  ui.commissionName.textContent = c.name;
  ui.commissionGoal.textContent = c.goal;
  ui.steps.innerHTML = c.steps.map((step, i) => `<span class="step ${state.stepProgress[i] ? 'done' : ''}">${i + 1}. ${step}</span>`).join('');
  if (message) ui.helper.textContent = message;
  ui.caption.textContent = state.focusActive ? 'Kamome Focus overlay shows boat path, buoy order, gate timing, fog spread, and tug lane.' : (message || ui.caption.textContent);
  laneMeshes.forEach((mesh, i) => { mesh.material.opacity = i === state.activeLane ? 0.92 : 0.48; mesh.position.y = -0.08 + i * 0.05 + (i === state.activeLane ? 0.04 : 0); });
  document.querySelector('[data-action="focus"]')?.classList.toggle('ready', state.focus >= 60);
  document.querySelector('[data-action="ringBell"]')?.classList.toggle('primary', true);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60); const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function tick(dt) {
  if (!state.started || state.paused || state.gameOver) return;
  state.elapsed += dt;
  state.tugCooldown = Math.max(0, state.tugCooldown - dt);
  state.fog = Math.min(100, state.fog + dt * (state.commission + 1) * 0.55);
  state.fogPeak = Math.max(state.fogPeak, Math.round(state.fog));
  state.gateDamage = Math.min(100, state.gateDamage + (state.gateOpen ? 0 : dt * 0.2));
  state.risk = Math.min(100, state.risk + dt * (state.fog > 70 ? 1.1 : 0.16));
  state.tideLevel = Math.floor((state.elapsed / 7) % 3);

  boats.forEach((boat, i) => {
    boat.position.x += dt * boat.userData.speed * (state.flagHigh ? 1.55 : 0.92);
    boat.position.z = THREE.MathUtils.lerp(boat.position.z, lanes[boat.userData.lane].z, 0.08);
    boat.rotation.y = Math.sin(state.elapsed * 1.2 + i) * 0.08;
    if (boat.position.x > boat.userData.targetX) {
      boat.position.x = -3.4 - i * 0.45;
      boat.userData.lane = (boat.userData.lane + 1) % lanes.length;
      if (state.gateOpen || i !== 0) score(220, `Boat ${i + 1} reaches a safe pier loop.`); else penalty(8, `Boat ${i + 1} had to brake before a closed gate.`);
    }
  });

  if (tugMesh.visible) {
    tugMesh.position.x += dt * 0.9;
    if (tugMesh.position.x > 3.2) tugMesh.visible = false;
  }
  harborGroup.children.filter((o) => o.userData.life !== undefined).forEach((marker) => {
    marker.userData.life -= dt;
    marker.position.y = 0.45 + Math.sin(state.elapsed * 4) * 0.08;
    if (marker.userData.life <= 0) harborGroup.remove(marker);
  });
  buoys.forEach((b, i) => { b.position.y = b.userData.baseY + Math.sin(state.elapsed * 2 + i) * 0.05; });
  fogSheets.forEach((fog, i) => {
    fog.position.x += Math.sin(state.elapsed * 0.3 + i) * 0.0015;
    fog.material.opacity = Math.min(0.36, 0.05 + state.fog / 280);
  });
  if (state.risk >= 100 || state.fog >= 100 || state.gateDamage >= 100) loseHeart('A harbor meter overflowed.');
  if (state.elapsed > 360 && !state.clearTriggered) endGame(false, 'Dawn watch timed out.');
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  tick(dt);
  const t = performance.now() * 0.001;
  if (harborGroup) {
    harborGroup.rotation.y = Math.sin(t * 0.2) * 0.035;
    beamMesh.material.opacity = 0.22 + Math.sin(t * 3) * 0.045;
    flagMesh.rotation.z = Math.sin(t * 4) * 0.08;
    if (focusOverlay.visible) focusOverlay.rotation.y = Math.sin(t * 2) * 0.08;
  }
  renderer.render(scene, camera);
  if (Math.floor(state.elapsed * 4) % 4 === 0) updateUI();
}

function resize() {
  const rect = ui.canvas.getBoundingClientRect();
  const w = Math.max(320, rect.width || 800);
  const h = Math.max(260, rect.height || 520);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  camera.position.set(0, h > w ? 8.4 : 7.2, h > w ? 9.8 : 8.8);
  camera.lookAt(0, 0, 0);
}

window.addEventListener('resize', resize);
document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => action(button.dataset.action)));
$('startButton').addEventListener('click', startGame);
$('menuPrompt').addEventListener('click', openPrompt);
$('promptTop').addEventListener('click', openPrompt);

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const map = { arrowup: 'shiftLane', arrowdown: 'shiftLane', w: 'raiseFlag', s: 'lowerFlag', a: 'shiftLane', d: 'dropBuoy', q: 'rotateLight', e: 'rotateLight', ' ': 'ringBell', enter: 'ringBell', g: 'openGate', t: 'sendTug', f: 'fanFog', k: 'focus', p: 'pause', escape: 'pause', r: 'restart' };
  if (map[key]) { event.preventDefault(); action(map[key]); }
});

ui.canvas.addEventListener('pointerdown', (event) => {
  if (!state.started) return;
  const rect = ui.canvas.getBoundingClientRect();
  const y = (event.clientY - rect.top) / rect.height;
  state.activeLane = y < 0.38 ? 2 : y < 0.66 ? 1 : 0;
  boats[0].userData.lane = state.activeLane;
  boats[0].position.z = lanes[state.activeLane].z;
  updateUI(`Harbor tap selected ${lanes[state.activeLane].name} tide lane; Shift Lane controls remain available.`);
});
ui.canvas.addEventListener('pointermove', (event) => {
  if (!state.started || event.buttons !== 1) return;
  const rect = ui.canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  state.beamIndex = Math.max(0, Math.min(3, Math.floor(x * 4)));
  lighthousePivot.rotation.y = state.beamIndex * Math.PI / 2;
  updateUI(`Dragged lighthouse beam to ${beamNames[state.beamIndex]}; preview stays above the pointer.`);
});

initThree();
updateUI();
document.querySelectorAll('[data-action="audio"]').forEach((button) => button.textContent = state.muted ? 'Audio: Off' : 'Audio: On');

window.__day052 = {
  state,
  action,
  forceFocus() { state.focus = 100; updateUI('Debug: Kamome Focus charged.'); },
  forceResult() { state.score = Math.max(state.score, 7000); state.clearTriggered = true; endGame(true, 'Debug result overlay.'); },
  bounds() {
    return [...document.querySelectorAll('button, .stageWrap, .commission, .helper')].map((el) => ({ text: el.textContent?.trim().slice(0, 40), rect: el.getBoundingClientRect().toJSON ? el.getBoundingClientRect().toJSON() : { top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom, height: el.getBoundingClientRect().height } }));
  }
};
