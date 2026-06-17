import * as THREE from './assets/three.module.js';

const STORE_KEYS = {
  best: 'mori.bestScore',
  bloom: 'mori.bestBloomTime',
  streak: 'mori.bestPerfectStreak',
  wave: 'mori.bestEndlessWave'
};

const DIRS = ['N', 'E', 'S', 'W'];
const VECTORS = {
  N: { x: 0, z: -1 },
  E: { x: 1, z: 0 },
  S: { x: 0, z: 1 },
  W: { x: -1, z: 0 }
};
const OPP = { N: 'S', E: 'W', S: 'N', W: 'E' };
const DIR_ANGLE = { N: Math.PI, E: Math.PI / 2, S: 0, W: -Math.PI / 2 };

const CHAPTERS = [
  { name: 'Fern Steps', short: 'FERN', minGrown: 0, pulse: 5.8, mite: 999, basins: ['FERN', 'CEDAR'] },
  { name: 'Cedar Gate', short: 'CEDAR', minGrown: 4, pulse: 4.8, mite: 12.5, basins: ['FERN', 'CEDAR', 'KODA'] },
  { name: 'Kodama Bloom', short: 'KODA', minGrown: 8, pulse: 3.9, mite: 8.8, basins: ['FERN', 'CEDAR', 'KODA', 'MOSS'] },
  { name: 'Endless Grove', short: 'NIGHT', minGrown: 14, pulse: 3.2, mite: 6.4, basins: ['FERN', 'CEDAR', 'KODA', 'MOSS'] }
];

const TILE_BLUEPRINTS = [
  { id: 't-2-0', col: 2, row: 0, h: 1.15, type: 'tee', rot: 2, fixed: false, name: 'Source crown' },
  { id: 't-1-1', col: 1, row: 1, h: 0.86, type: 'bend', rot: 1, fixed: false, name: 'Fern elbow' },
  { id: 't-2-1', col: 2, row: 1, h: 0.92, type: 'straight', rot: 0, fixed: false, name: 'Dew stair' },
  { id: 't-3-1', col: 3, row: 1, h: 0.82, type: 'bend', rot: 2, fixed: false, name: 'Cedar elbow' },
  { id: 't-0-2', col: 0, row: 2, h: 0.48, type: 'bend', rot: 2, fixed: false, name: 'Moss cup turn' },
  { id: 't-1-2', col: 1, row: 2, h: 0.62, type: 'tee', rot: 1, fixed: false, name: 'Split root' },
  { id: 't-2-2', col: 2, row: 2, h: 0.70, type: 'cross', rot: 0, fixed: false, name: 'Shrine crossing' },
  { id: 't-3-2', col: 3, row: 2, h: 0.60, type: 'bridgeSocket', rot: 1, fixed: false, name: 'Bridge socket' },
  { id: 't-4-2', col: 4, row: 2, h: 0.44, type: 'bend', rot: 3, fixed: false, name: 'Cedar basin turn' },
  { id: 't-1-3', col: 1, row: 3, h: 0.32, type: 'straight', rot: 1, fixed: false, name: 'Lower root' },
  { id: 't-2-3', col: 2, row: 3, h: 0.38, type: 'cleanse', rot: 0, fixed: false, name: 'Cleansing moss' },
  { id: 't-3-3', col: 3, row: 3, h: 0.34, type: 'tee', rot: 2, fixed: false, name: 'Kodama fork' },
  { id: 't-0-4', col: 0, row: 4, h: 0.16, type: 'bend', rot: 0, fixed: false, name: 'Fern basin turn' },
  { id: 't-2-4', col: 2, row: 4, h: 0.22, type: 'straight', rot: 1, fixed: false, name: 'South root' },
  { id: 't-4-4', col: 4, row: 4, h: 0.16, type: 'bend', rot: 2, fixed: false, name: 'Kodama basin turn' }
];

const BASINS = [
  { id: 'FERN', label: 'FERN', tile: 't-0-4', side: 'S', pos: { col: 0, row: 5, h: 0.05 }, color: 0x8cf46f },
  { id: 'CEDAR', label: 'CEDAR', tile: 't-4-2', side: 'E', pos: { col: 5, row: 2, h: 0.18 }, color: 0xffd36e },
  { id: 'KODA', label: 'KODA', tile: 't-4-4', side: 'S', pos: { col: 4, row: 5, h: 0.06 }, color: 0xcba8ff },
  { id: 'MOSS', label: 'MOSS', tile: 't-0-2', side: 'W', pos: { col: -1, row: 2, h: 0.14 }, color: 0x7df7dc }
];

const dom = Object.fromEntries([
  'gameShell', 'menuOverlay', 'startBtn', 'menuBest', 'menuBloom', 'scoreText', 'bestText', 'seedText', 'droughtMeter',
  'droughtText', 'chapterText', 'grownText', 'comboText', 'requestText', 'lanternMeter', 'lanternText', 'canvasWrap',
  'helper', 'toast', 'bloomBanner', 'cycleBtn', 'rotateLeftBtn', 'rotateRightBtn', 'bridgeBtn', 'lanternBtn', 'pauseBtn',
  'restartBtn', 'pauseOverlay', 'resumeBtn', 'pauseRestartBtn', 'resultsOverlay', 'resultsSummary', 'badgeList', 'resultsRestartBtn'
].map((id) => [id, document.getElementById(id)]));

let renderer;
let scene;
let camera;
let raycaster;
let pointer;
let boardGroup;
let tileMap = new Map();
let tileMeshes = [];
let basinMap = new Map();
let boardObjects = [];
let selectedIndex = 0;
let selectedId = 't-2-0';
let lastFrameTime = performance.now();
let animationHandle = 0;
let gameState;
let lastToast = 0;

const reusable = {
  vec: new THREE.Vector3(),
  color: new THREE.Color()
};

function freshState() {
  const best = Number(localStorage.getItem(STORE_KEYS.best) || 0);
  const bestBloom = Number(localStorage.getItem(STORE_KEYS.bloom) || 0);
  return {
    phase: 'menu',
    score: 0,
    best,
    bestBloom,
    seedlings: 3,
    seedStress: 0,
    drought: 0,
    combo: 1,
    grown: 0,
    request: 'FERN',
    requestIndex: 0,
    lantern: 24,
    bridgePlaced: false,
    elapsed: 0,
    pulseTimer: 2.1,
    miteTimer: 9,
    bloom: false,
    bloomTime: null,
    perfectStreak: 0,
    bestPerfectRun: 0,
    endlessWave: 0,
    dew: [],
    mites: [],
    particles: [],
    seed: 8008,
    paused: false,
    over: false
  };
}

gameState = freshState();

function seeded() {
  gameState.seed = (gameState.seed * 1664525 + 1013904223) >>> 0;
  return gameState.seed / 4294967296;
}

function toWorld(col, row, h = 0) {
  return new THREE.Vector3((col - 2) * 1.42, h, (row - 2) * 1.42);
}

function currentChapter() {
  if (gameState.grown >= CHAPTERS[3].minGrown || gameState.bloom) return CHAPTERS[3];
  if (gameState.grown >= CHAPTERS[2].minGrown) return CHAPTERS[2];
  if (gameState.grown >= CHAPTERS[1].minGrown) return CHAPTERS[1];
  return CHAPTERS[0];
}

function basePorts(type) {
  if (type === 'straight') return ['N', 'S'];
  if (type === 'bend') return ['N', 'E'];
  if (type === 'tee') return ['N', 'E', 'S'];
  if (type === 'cross') return ['N', 'E', 'S', 'W'];
  if (type === 'cleanse') return ['N', 'S', 'E'];
  if (type === 'bridgeSocket') return gameState.bridgePlaced ? ['W', 'E'] : [];
  return ['N', 'S'];
}

function rotateDir(dir, turns) {
  const i = DIRS.indexOf(dir);
  return DIRS[(i + turns + 40) % 4];
}

function tilePorts(tile) {
  return basePorts(tile.type).map((d) => rotateDir(d, tile.rot));
}

function makeCanvasTextTexture(text, opts = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = opts.w || 256;
  canvas.height = opts.h || 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = opts.bg || 'rgba(4,18,9,.78)';
  roundRect(ctx, 10, 18, canvas.width - 20, canvas.height - 36, 26);
  ctx.fill();
  ctx.strokeStyle = opts.stroke || '#bfff91';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = opts.color || '#f3ffe1';
  ctx.font = `900 ${opts.size || 42}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function createScene() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  dom.canvasWrap.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06140b, 0.055);
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 8.7, 8.9);
  camera.lookAt(0, 0.2, 0.1);
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  const ambient = new THREE.HemisphereLight(0xbef7d1, 0x152015, 1.9);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffebad, 3.2);
  sun.position.set(-3.7, 8, 4.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);
  const lantern = new THREE.PointLight(0xffd56f, 5.4, 12);
  lantern.position.set(3.8, 2.9, -2.7);
  scene.add(lantern);
  const dewLight = new THREE.PointLight(0x8df6ff, 2.8, 9);
  dewLight.position.set(-2.6, 2.4, 2.2);
  scene.add(dewLight);

  boardGroup = new THREE.Group();
  scene.add(boardGroup);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(4.72, 5.18, 0.48, 48),
    new THREE.MeshStandardMaterial({ color: 0x152a16, roughness: 0.92, metalness: 0.02 })
  );
  base.position.y = -0.35;
  base.receiveShadow = true;
  boardGroup.add(base);

  buildBoardMeshes();
  addBackdropPieces();
  resizeRenderer();
}

function makeMossMaterial(color = 0x4b8a35) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.84, metalness: 0.02 });
}

function buildBoardMeshes() {
  tileMap.clear();
  tileMeshes = [];
  boardObjects = [];
  basinMap.clear();

  for (const data of TILE_BLUEPRINTS) {
    const tile = { ...data, charge: 0, mesh: null, channels: [], arrows: [], labelSprite: null, glow: null };
    tileMap.set(tile.id, tile);
    const pos = toWorld(tile.col, tile.row, tile.h);
    const height = 0.28 + tile.h * 0.42;
    const geom = new THREE.BoxGeometry(1.14, height, 1.14, 3, 1, 3);
    const mat = makeMossMaterial(tile.type === 'cleanse' ? 0x2f8c65 : tile.type === 'bridgeSocket' ? 0x3f5536 : 0x4a883b);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(pos.x, height / 2 - 0.15, pos.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.tileId = tile.id;
    tile.mesh = mesh;
    boardGroup.add(mesh);
    tileMeshes.push(mesh);
    boardObjects.push(mesh);

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(1.19, 0.055, 1.19),
      new THREE.MeshStandardMaterial({ color: 0x75b957, roughness: 0.96, emissive: 0x0b2108, emissiveIntensity: 0.2 })
    );
    top.position.set(pos.x, height + 0.02 - 0.15, pos.z);
    top.castShadow = true;
    top.receiveShadow = true;
    top.userData.tileId = tile.id;
    boardGroup.add(top);
    tileMeshes.push(top);
    boardObjects.push(top);

    const glow = new THREE.Mesh(
      new THREE.TorusGeometry(0.73, 0.032, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0xbfff84, transparent: true, opacity: 0.0 })
    );
    glow.rotation.x = Math.PI / 2;
    glow.position.set(pos.x, height + 0.08 - 0.15, pos.z);
    tile.glow = glow;
    boardGroup.add(glow);
  }

  for (const basin of BASINS) {
    const pos = toWorld(basin.pos.col, basin.pos.row, basin.pos.h);
    const group = new THREE.Group();
    group.position.copy(pos);
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.52, 0.28, 28),
      new THREE.MeshStandardMaterial({ color: 0x4b3c29, roughness: 0.74, metalness: 0.03 })
    );
    bowl.position.y = 0.14;
    bowl.castShadow = true;
    group.add(bowl);
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.38, 0.035, 28),
      new THREE.MeshStandardMaterial({ color: basin.color, emissive: basin.color, emissiveIntensity: 0.38, roughness: 0.18, transparent: true, opacity: 0.82 })
    );
    water.position.y = 0.31;
    group.add(water);
    const sprout = new THREE.Group();
    sprout.position.y = 0.32;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.34, 8), new THREE.MeshStandardMaterial({ color: 0x84e46a, emissive: 0x102d10 }));
    stem.position.y = 0.14;
    sprout.add(stem);
    const leafGeom = new THREE.SphereGeometry(0.12, 12, 8);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x97ff72, roughness: 0.65 });
    const leafA = new THREE.Mesh(leafGeom, leafMat);
    leafA.scale.set(1.5, 0.36, 0.8);
    leafA.position.set(0.11, 0.28, 0);
    leafA.rotation.z = -0.45;
    sprout.add(leafA);
    const leafB = leafA.clone();
    leafB.position.x = -0.11;
    leafB.rotation.z = 0.45;
    sprout.add(leafB);
    group.add(sprout);
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeCanvasTextTexture(basin.label, { w: 220, h: 110, size: 34, color: '#f6ffe8' }), transparent: true }));
    label.scale.set(1.0, 0.5, 1);
    label.position.set(0, 0.86, 0);
    group.add(label);
    boardGroup.add(group);
    basinMap.set(basin.id, { ...basin, group, water, sprout, charge: 0, stress: 0 });
  }

  refreshTileVisuals();
}

function addBackdropPieces() {
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3b22, roughness: 0.88 });
  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2;
    const r = 5.2 + (i % 3) * 0.45;
    const root = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 2.2, 10), trunkMat);
    root.position.set(Math.cos(angle) * r, 0.15, Math.sin(angle) * r);
    root.rotation.z = Math.PI / 2.5;
    root.rotation.y = -angle;
    root.castShadow = true;
    boardGroup.add(root);
  }
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x55614d, roughness: 0.95 });
  for (let i = 0; i < 14; i += 1) {
    const pebble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12 + seeded() * 0.16, 0), stoneMat);
    pebble.position.set((seeded() - 0.5) * 8.5, -0.02, (seeded() - 0.5) * 8.2);
    pebble.scale.y = 0.45;
    boardGroup.add(pebble);
  }
}

function clearDynamicTileVisuals() {
  for (const tile of tileMap.values()) {
    for (const item of tile.channels) boardGroup.remove(item);
    for (const item of tile.arrows) boardGroup.remove(item);
    tile.channels.length = 0;
    tile.arrows.length = 0;
  }
}

function refreshTileVisuals() {
  clearDynamicTileVisuals();
  const channelMat = new THREE.MeshStandardMaterial({ color: 0x5b361b, roughness: 0.52, emissive: 0x143214, emissiveIntensity: 0.18 });
  const cleanMat = new THREE.MeshStandardMaterial({ color: 0x60ffb8, roughness: 0.3, emissive: 0x15b876, emissiveIntensity: 0.72 });
  const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x8a6235, roughness: 0.6, emissive: 0x2c1505, emissiveIntensity: 0.12 });
  for (const tile of tileMap.values()) {
    const pos = toWorld(tile.col, tile.row, tile.h);
    const topY = tile.mesh.position.y + tile.mesh.geometry.parameters.height / 2 + 0.07;
    const ports = tilePorts(tile);
    for (const dir of ports) {
      const vec = VECTORS[dir];
      const len = 0.58;
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.062, len, 10),
        tile.type === 'cleanse' ? cleanMat : tile.type === 'bridgeSocket' ? bridgeMat : channelMat
      );
      cyl.position.set(pos.x + vec.x * len / 2, topY, pos.z + vec.z * len / 2);
      cyl.rotation.z = dir === 'E' || dir === 'W' ? Math.PI / 2 : 0;
      cyl.rotation.x = dir === 'N' || dir === 'S' ? Math.PI / 2 : 0;
      cyl.castShadow = true;
      boardGroup.add(cyl);
      tile.channels.push(cyl);

      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.17, 16),
        new THREE.MeshBasicMaterial({ color: tile.type === 'cleanse' ? 0xb7ffe4 : 0xd9ff8b, transparent: true, opacity: 0.76 })
      );
      cone.position.set(pos.x + vec.x * 0.37, topY + 0.07, pos.z + vec.z * 0.37);
      cone.rotation.x = Math.PI / 2;
      cone.rotation.z = DIR_ANGLE[dir];
      boardGroup.add(cone);
      tile.arrows.push(cone);
    }
    if (tile.type === 'bridgeSocket' && !gameState.bridgePlaced) {
      const socket = new THREE.Mesh(
        new THREE.TorusGeometry(0.39, 0.035, 8, 32),
        new THREE.MeshBasicMaterial({ color: 0xffd56f, transparent: true, opacity: 0.54 })
      );
      socket.rotation.x = Math.PI / 2;
      socket.position.set(pos.x, topY + 0.04, pos.z);
      boardGroup.add(socket);
      tile.channels.push(socket);
    }
  }
  updateSelectionVisual();
}

function updateSelectionVisual() {
  for (const [index, tile] of [...tileMap.values()].entries()) {
    const selected = tile.id === selectedId;
    tile.glow.material.opacity = selected ? 0.9 : 0.0;
    tile.mesh.material.emissive.setHex(selected ? 0x1a5a24 : 0x000000);
    tile.mesh.material.emissiveIntensity = selected ? 0.45 : 0;
    if (selected) selectedIndex = index;
  }
  const tile = tileMap.get(selectedId);
  if (tile) {
    const ports = tilePorts(tile).join('↔') || 'socket empty';
    dom.helper.textContent = `${tile.name}: connectors ${ports}. Rotate or use Root Bridge if selected.`;
    dom.bridgeBtn.classList.toggle('active', tile.type === 'bridgeSocket' && gameState.bridgePlaced);
  }
}

function resizeRenderer() {
  if (!renderer || !camera) return;
  const rect = dom.canvasWrap.getBoundingClientRect();
  renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
  const portrait = rect.height > rect.width;
  camera.position.set(0, portrait ? 10.8 : 7.2, portrait ? 12.0 : 7.8);
  camera.lookAt(0, portrait ? 0.22 : 0.34, portrait ? -0.04 : 0.16);
  camera.updateProjectionMatrix();
}

function showToast(text) {
  const now = performance.now();
  if (now - lastToast < 320 && dom.toast.textContent === text) return;
  lastToast = now;
  dom.toast.textContent = text;
  dom.toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => dom.toast.classList.remove('show'), 1800);
}

function startRun() {
  const carryBest = gameState.best;
  const carryBloom = gameState.bestBloom;
  gameState = freshState();
  gameState.phase = 'play';
  gameState.best = carryBest;
  gameState.bestBloom = carryBloom;
  selectedId = 't-2-0';
  selectedIndex = 0;
  for (const tile of tileMap.values()) {
    const blueprint = TILE_BLUEPRINTS.find((b) => b.id === tile.id);
    tile.rot = blueprint.rot;
    tile.charge = 0;
  }
  for (const basin of basinMap.values()) {
    basin.charge = 0;
    basin.stress = 0;
    basin.water.scale.setScalar(1);
    basin.sprout.scale.set(1, 1, 1);
  }
  refreshTileVisuals();
  dom.menuOverlay.hidden = true;
  dom.pauseOverlay.hidden = true;
  dom.resultsOverlay.hidden = true;
  dom.bloomBanner.hidden = true;
  pickNextRequest();
  updateHud();
  lastFrameTime = performance.now();
  showToast('Fern Steps begins: pre-rotate roots before dew rolls.');
}

function pauseToggle(force) {
  if (gameState.phase !== 'play') return;
  gameState.paused = typeof force === 'boolean' ? force : !gameState.paused;
  dom.pauseOverlay.hidden = !gameState.paused;
  dom.pauseBtn.textContent = gameState.paused ? 'Resume\nP' : 'Pause\nP';
}

function restartRun() {
  cleanupMovingObjects();
  startRun();
}

function cleanupMovingObjects() {
  for (const bead of gameState.dew) boardGroup.remove(bead.mesh);
  for (const mite of gameState.mites) boardGroup.remove(mite.mesh);
  for (const p of gameState.particles) boardGroup.remove(p.mesh);
  gameState.dew.length = 0;
  gameState.mites.length = 0;
  gameState.particles.length = 0;
}

function updateHud() {
  const chapter = currentChapter();
  dom.scoreText.textContent = String(Math.floor(gameState.score));
  dom.bestText.textContent = String(Math.max(gameState.best, gameState.score));
  dom.seedText.textContent = `${gameState.seedlings}/3`;
  dom.droughtMeter.value = Math.min(100, gameState.drought);
  dom.droughtText.textContent = `${Math.round(gameState.drought)}%`;
  dom.chapterText.textContent = chapter.name;
  dom.grownText.textContent = String(gameState.grown);
  dom.comboText.textContent = `x${gameState.combo}`;
  dom.requestText.textContent = gameState.request;
  dom.lanternMeter.value = Math.min(100, gameState.lantern);
  dom.lanternText.textContent = `${Math.round(Math.min(100, gameState.lantern))}%`;
  dom.lanternBtn.disabled = gameState.lantern < 100;
  dom.menuBest.textContent = String(gameState.best);
  dom.menuBloom.textContent = gameState.bestBloom ? `${gameState.bestBloom.toFixed(1)}s` : '—';
}

function pickNextRequest() {
  const chapter = currentChapter();
  const available = chapter.basins;
  const sequence = ['FERN', 'CEDAR', 'FERN', 'KODA', 'CEDAR', 'MOSS', 'KODA', 'FERN'];
  let next = sequence[gameState.requestIndex % sequence.length];
  if (!available.includes(next)) next = available[gameState.requestIndex % available.length];
  if (seeded() > 0.72 && available.length > 2) next = available[Math.floor(seeded() * available.length)];
  gameState.request = next;
  gameState.requestIndex += 1;
}

function rotateSelected(step) {
  if (gameState.phase !== 'play' || gameState.paused) return;
  const tile = tileMap.get(selectedId);
  if (!tile || tile.fixed) return;
  if (tile.type === 'bridgeSocket') {
    showToast('Bridge sockets keep their root direction. Use Root Bridge to place/remove.');
    return;
  }
  tile.rot = (tile.rot + step + 4) % 4;
  refreshTileVisuals();
  showToast(`${tile.name} rotated ${step > 0 ? 'clockwise' : 'counter-clockwise'}.`);
}

function cycleSelected(step = 1) {
  const arr = [...tileMap.values()];
  selectedIndex = (selectedIndex + step + arr.length) % arr.length;
  selectedId = arr[selectedIndex].id;
  updateSelectionVisual();
}

function toggleBridge() {
  if (gameState.phase !== 'play' || gameState.paused) return;
  const tile = tileMap.get(selectedId);
  if (!tile || tile.type !== 'bridgeSocket') {
    selectedId = 't-3-2';
    updateSelectionVisual();
    showToast('Bridge socket selected. Tap Root Bridge again to place it.');
    return;
  }
  gameState.bridgePlaced = !gameState.bridgePlaced;
  refreshTileVisuals();
  showToast(gameState.bridgePlaced ? 'Temporary root bridge placed across the gap.' : 'Root bridge recalled for later.');
}

function pulseLantern() {
  if (gameState.phase !== 'play' || gameState.paused || gameState.lantern < 100) return;
  gameState.lantern = 0;
  gameState.drought = Math.max(0, gameState.drought - 10);
  let repelled = 0;
  for (const mite of gameState.mites) {
    mite.progress = Math.max(0, mite.progress - 0.52);
    mite.speed *= 0.55;
    repelled += 1;
    spawnSpark(mite.mesh.position, 0xfff2a1);
  }
  showToast(repelled ? `Mosslight pulse pushed ${repelled} soot mite${repelled > 1 ? 's' : ''} back.` : 'Mosslight calmed the drought.');
  updateHud();
}

function tileCenter(tile) {
  const pos = toWorld(tile.col, tile.row, tile.h);
  const top = tile.mesh.position.y + tile.mesh.geometry.parameters.height / 2 + 0.19;
  return new THREE.Vector3(pos.x, top, pos.z);
}

function neighborFor(tile, dir) {
  const vec = VECTORS[dir];
  const nextCol = tile.col + vec.x;
  const nextRow = tile.row + vec.z;
  for (const other of tileMap.values()) {
    if (other.col === nextCol && other.row === nextRow) return other;
  }
  return null;
}

function basinAtExit(tile, dir) {
  return BASINS.find((b) => b.tile === tile.id && b.side === dir) || null;
}

function requestBasinPos(id) {
  const b = BASINS.find((basin) => basin.id === id) || BASINS[0];
  return b.pos;
}

function chooseExit(tile, entrySide) {
  const ports = tilePorts(tile);
  if (!ports.length) return null;
  if (entrySide && !ports.includes(entrySide)) return null;
  const candidates = ports.filter((d) => d !== entrySide);
  if (!candidates.length) return null;
  const target = requestBasinPos(gameState.request);
  let best = candidates[0];
  let bestScore = Infinity;
  for (const dir of candidates) {
    const basin = basinAtExit(tile, dir);
    if (basin) return dir;
    const n = neighborFor(tile, dir);
    if (!n) continue;
    const ports2 = tilePorts(n);
    const connected = ports2.includes(OPP[dir]);
    const hBias = Math.max(-0.25, n.h - tile.h) * 0.6;
    const dist = Math.abs(n.col - target.col) + Math.abs(n.row - target.row) + hBias + (connected ? 0 : 3.5);
    if (dist < bestScore) {
      bestScore = dist;
      best = dir;
    }
  }
  return best;
}

function spawnDew() {
  const start = tileMap.get('t-2-0');
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.115, 18, 14),
    new THREE.MeshStandardMaterial({ color: 0xaaf8ff, emissive: 0x52e8ff, emissiveIntensity: 1.25, roughness: 0.08, metalness: 0.06 })
  );
  mesh.castShadow = true;
  boardGroup.add(mesh);
  const bead = {
    mesh,
    tileId: start.id,
    entrySide: 'N',
    segmentStart: tileCenter(start),
    segmentEnd: tileCenter(start),
    progress: 1,
    speed: 1.0,
    lost: false,
    pulsePerfect: true,
    age: 0
  };
  mesh.position.copy(bead.segmentStart);
  planNextSegment(bead);
  gameState.dew.push(bead);
  showToast(`Dew pulse seeks ${gameState.request}.`);
}

function planNextSegment(bead) {
  const tile = tileMap.get(bead.tileId);
  if (!tile) return loseDew(bead, 'Dew slipped into leaf gutters.');
  const exit = chooseExit(tile, bead.entrySide);
  if (!exit) return loseDew(bead, `${tile.name} is not connected; dew lost.`);

  if (tile.type === 'cleanse') {
    cleanseMites(tile);
  }

  const basin = basinAtExit(tile, exit);
  bead.segmentStart.copy(tileCenter(tile));
  if (basin) {
    const bpos = toWorld(basin.pos.col, basin.pos.row, basin.pos.h + 0.38);
    bead.segmentEnd.copy(bpos);
    bead.nextBasin = basin.id;
    bead.nextTile = null;
  } else {
    const next = neighborFor(tile, exit);
    if (!next || !tilePorts(next).includes(OPP[exit])) {
      return loseDew(bead, 'The root channel ends before a moss tile.');
    }
    bead.segmentEnd.copy(tileCenter(next));
    bead.nextTile = next.id;
    bead.nextBasin = null;
    bead.nextEntry = OPP[exit];
  }
  const drop = bead.segmentStart.y - bead.segmentEnd.y;
  bead.speed = 0.38 + Math.max(0, drop) * 0.5 + Math.min(0.26, gameState.elapsed / 320);
  bead.progress = 0;
}

function loseDew(bead, text) {
  if (bead.lost) return;
  bead.lost = true;
  bead.pulsePerfect = false;
  gameState.combo = 1;
  gameState.drought = Math.min(100, gameState.drought + 7);
  spawnSpark(bead.mesh.position, 0x91f4ff);
  showToast(text);
}

function deliverDew(bead, basinId) {
  const requested = basinId === gameState.request;
  const basin = basinMap.get(basinId);
  if (basin) {
    basin.charge = Math.min(3, basin.charge + (requested ? 1.2 : 0.7));
    basin.water.scale.setScalar(1 + basin.charge * 0.12);
    spawnSpark(basin.group.position.clone().add(new THREE.Vector3(0, 0.5, 0)), requested ? 0xb8ff98 : 0x91f4ff);
  }
  if (requested) {
    gameState.score += 65 * gameState.combo;
    gameState.combo = Math.min(9, gameState.combo + 1);
    gameState.lantern = Math.min(100, gameState.lantern + 15);
    gameState.perfectStreak += 1;
    gameState.bestPerfectRun = Math.max(gameState.bestPerfectRun, gameState.perfectStreak);
    if (basin && basin.charge >= 3) {
      growBasin(basin);
    }
    if (bead.pulsePerfect) {
      gameState.score += 140;
      gameState.lantern = Math.min(100, gameState.lantern + 12);
    }
    pickNextRequest();
  } else {
    gameState.score += 22;
    gameState.combo = 1;
    gameState.drought = Math.min(100, gameState.drought + 3);
    showToast(`Nice dew, but ${gameState.request} was thirsty.`);
  }
  checkChapterAndBloom();
}

function growBasin(basin) {
  basin.charge = 0;
  basin.sprout.scale.multiplyScalar(1.16);
  gameState.grown += 1;
  gameState.score += 220;
  gameState.drought = Math.max(0, gameState.drought - 8);
  showToast(`${basin.label} basin grew leaves!`);
  if ([4, 8, 14].includes(gameState.grown)) {
    gameState.score += 420;
    if (gameState.seedlings < 3) gameState.seedlings += 1;
    showToast(`${currentChapter().name} chapter completed. Seedlings recover.`);
  }
}

function checkChapterAndBloom() {
  if (!gameState.bloom && gameState.grown >= 12 && gameState.score >= 2600) {
    gameState.bloom = true;
    gameState.bloomTime = gameState.elapsed;
    gameState.score += 850;
    gameState.lantern = 100;
    dom.bloomBanner.hidden = false;
    window.setTimeout(() => { dom.bloomBanner.hidden = true; }, 4200);
    if (!gameState.bestBloom || gameState.elapsed < gameState.bestBloom) {
      localStorage.setItem(STORE_KEYS.bloom, String(gameState.elapsed));
      gameState.bestBloom = gameState.elapsed;
    }
    showToast('Mori Mosslight Bloom! Endless forest-night unlocked.');
  }
}

function cleanseMites(tile) {
  let cleaned = 0;
  const center = tileCenter(tile);
  for (const mite of gameState.mites) {
    if (mite.mesh.position.distanceTo(center) < 1.45) {
      mite.dead = true;
      gameState.score += 95;
      cleaned += 1;
      spawnSpark(mite.mesh.position, 0x9effd4);
    }
  }
  if (cleaned) showToast(`Cleansing moss cleared ${cleaned} soot mite${cleaned > 1 ? 's' : ''}.`);
}

function spawnMite() {
  const chapter = currentChapter();
  if (chapter === CHAPTERS[0]) return;
  const targetId = chapter.basins[Math.floor(seeded() * chapter.basins.length)];
  const basin = basinMap.get(targetId);
  const angle = seeded() * Math.PI * 2;
  const start = new THREE.Vector3(Math.cos(angle) * 5.1, 0.28, Math.sin(angle) * 5.1);
  const mesh = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 14, 10),
    new THREE.MeshStandardMaterial({ color: 0x161116, emissive: 0x2d102c, emissiveIntensity: 0.6, roughness: 0.8 })
  );
  body.scale.set(1.25, 0.75, 1);
  mesh.add(body);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffd56f });
  const eyeA = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), eyeMat);
  eyeA.position.set(-0.055, 0.04, 0.13);
  mesh.add(eyeA);
  const eyeB = eyeA.clone();
  eyeB.position.x = 0.055;
  mesh.add(eyeB);
  mesh.position.copy(start);
  boardGroup.add(mesh);
  gameState.mites.push({ mesh, targetId, basin, start, progress: 0, speed: 0.025 + gameState.elapsed / 16000, dead: false });
}

function stressSeedling(targetId) {
  const basin = basinMap.get(targetId);
  if (basin) {
    basin.stress += 1;
    basin.water.material.emissiveIntensity = Math.max(0.1, basin.water.material.emissiveIntensity - 0.1);
  }
  gameState.seedStress += 1;
  gameState.combo = 1;
  gameState.drought = Math.min(100, gameState.drought + 5);
  showToast(`Soot mite stressed ${targetId}.`);
  if (gameState.seedStress >= 2) {
    gameState.seedStress = 0;
    gameState.seedlings -= 1;
    showToast('A seedling withered under soot pressure.');
  }
}

function spawnSpark(position, color) {
  for (let i = 0; i < 6; i += 1) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.035 + seeded() * 0.025, 8, 6),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92 })
    );
    mesh.position.copy(position);
    boardGroup.add(mesh);
    gameState.particles.push({
      mesh,
      life: 0.8 + seeded() * 0.5,
      velocity: new THREE.Vector3((seeded() - 0.5) * 0.9, seeded() * 1.0 + 0.35, (seeded() - 0.5) * 0.9)
    });
  }
}

function updatePlay(dt) {
  if (gameState.phase !== 'play' || gameState.paused || gameState.over) return;
  gameState.elapsed += dt;
  const chapter = currentChapter();
  gameState.pulseTimer -= dt;
  gameState.miteTimer -= dt;
  gameState.drought = Math.min(100, gameState.drought + dt * (gameState.bloom ? 0.55 : 0.36));
  if (gameState.drought >= 100) {
    gameState.drought = 0;
    gameState.seedlings -= 1;
    showToast('Drought overflow withered a seedling.');
  }
  if (gameState.pulseTimer <= 0) {
    spawnDew();
    gameState.pulseTimer = Math.max(2.45, chapter.pulse - Math.min(1.15, gameState.elapsed / 180));
  }
  if (gameState.miteTimer <= 0) {
    spawnMite();
    gameState.miteTimer = Math.max(4.5, chapter.mite - gameState.elapsed / 110);
  }

  updateDew(dt);
  updateMites(dt);
  updateParticles(dt);
  updateHud();
  if (gameState.seedlings <= 0) endRun();
}

function updateDew(dt) {
  for (const bead of gameState.dew) {
    bead.age += dt;
    if (bead.lost) {
      bead.mesh.scale.multiplyScalar(0.9);
      bead.mesh.position.y -= dt * 1.8;
      if (bead.mesh.scale.x < 0.08) bead.dead = true;
      continue;
    }
    bead.progress += dt * bead.speed;
    const t = Math.min(1, bead.progress);
    bead.mesh.position.lerpVectors(bead.segmentStart, bead.segmentEnd, t);
    bead.mesh.position.y += Math.sin((bead.age + t) * 10) * 0.018;
    if (bead.progress >= 1) {
      if (bead.nextBasin) {
        deliverDew(bead, bead.nextBasin);
        bead.dead = true;
      } else if (bead.nextTile) {
        bead.tileId = bead.nextTile;
        bead.entrySide = bead.nextEntry;
        planNextSegment(bead);
      }
    }
  }
  gameState.dew = gameState.dew.filter((bead) => {
    if (!bead.dead) return true;
    boardGroup.remove(bead.mesh);
    return false;
  });
}

function updateMites(dt) {
  for (const mite of gameState.mites) {
    if (mite.dead) {
      mite.mesh.scale.multiplyScalar(0.86);
      if (mite.mesh.scale.x < 0.08) mite.remove = true;
      continue;
    }
    const target = mite.basin?.group?.position || new THREE.Vector3();
    mite.progress += dt * mite.speed;
    const t = Math.min(1, mite.progress);
    mite.mesh.position.lerpVectors(mite.start, target, t);
    mite.mesh.position.y = 0.32 + Math.sin(gameState.elapsed * 7 + t * 4) * 0.035;
    mite.mesh.rotation.y += dt * 3.4;
    if (t >= 1) {
      stressSeedling(mite.targetId);
      mite.remove = true;
    }
  }
  gameState.mites = gameState.mites.filter((mite) => {
    if (!mite.remove) return true;
    boardGroup.remove(mite.mesh);
    return false;
  });
}

function updateParticles(dt) {
  for (const p of gameState.particles) {
    p.life -= dt;
    p.mesh.position.addScaledVector(p.velocity, dt);
    p.velocity.y -= dt * 1.3;
    p.mesh.material.opacity = Math.max(0, p.life);
    if (p.life <= 0) p.dead = true;
  }
  gameState.particles = gameState.particles.filter((p) => {
    if (!p.dead) return true;
    boardGroup.remove(p.mesh);
    return false;
  });
}

function endRun() {
  gameState.over = true;
  gameState.phase = 'results';
  gameState.best = Math.max(gameState.best, Math.floor(gameState.score));
  localStorage.setItem(STORE_KEYS.best, String(gameState.best));
  const bestStreak = Math.max(Number(localStorage.getItem(STORE_KEYS.streak) || 0), gameState.bestPerfectRun);
  localStorage.setItem(STORE_KEYS.streak, String(bestStreak));
  const wave = gameState.bloom ? Math.max(1, Math.floor((gameState.elapsed - (gameState.bloomTime || gameState.elapsed)) / 24) + 1) : 0;
  const bestWave = Math.max(Number(localStorage.getItem(STORE_KEYS.wave) || 0), wave);
  localStorage.setItem(STORE_KEYS.wave, String(bestWave));
  const badges = [];
  if (gameState.perfectStreak >= 6) badges.push('Clean dew-chain');
  if (gameState.grown >= 12) badges.push('Twelve basins grown');
  if (gameState.bloom && gameState.bloomTime <= 170) badges.push('Bloom under 170s');
  if (gameState.score >= 4300) badges.push('Endless grove 4300');
  dom.resultsSummary.textContent = `Final score ${Math.floor(gameState.score)}. Reached ${currentChapter().name}. ${gameState.bloom ? `Mosslight Bloom at ${gameState.bloomTime.toFixed(1)}s.` : 'Bloom not reached yet.'} Best perfect streak ${gameState.bestPerfectRun}.`;
  dom.badgeList.innerHTML = badges.length ? badges.map((b) => `<span>${b}</span>`).join('') : '<span>Try for a mastery badge next run</span>';
  dom.resultsOverlay.hidden = false;
}

function animate() {
  animationHandle = requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
  lastFrameTime = now;
  if (boardGroup) {
    boardGroup.rotation.y = Math.sin(performance.now() / 9000) * 0.025;
    for (const basin of basinMap.values()) {
      basin.water.rotation.y += dt * 0.8;
    }
    const tile = tileMap.get(selectedId);
    if (tile?.glow) tile.glow.scale.setScalar(1 + Math.sin(performance.now() / 180) * 0.035);
  }
  updatePlay(dt);
  renderer.render(scene, camera);
}

function onPointerDown(event) {
  if (!renderer || gameState.phase !== 'play' || gameState.paused) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(boardObjects, false)[0];
  if (hit?.object?.userData?.tileId) {
    selectedId = hit.object.userData.tileId;
    updateSelectionVisual();
  }
}

function onKey(event) {
  if (event.target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(event.target.tagName)) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
  }
  if (gameState.phase === 'menu' && event.key === 'Enter') startRun();
  if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') rotateSelected(-1);
  if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') rotateSelected(1);
  if (event.key === 'q' || event.key === 'Q') cycleSelected(-1);
  if (event.key === 'e' || event.key === 'E') cycleSelected(1);
  if (event.key === 'b' || event.key === 'B') toggleBridge();
  if (event.code === 'Space' || event.key === 'Shift') {
    event.preventDefault();
    pulseLantern();
  }
  if (event.key === 'p' || event.key === 'P') pauseToggle();
  if (event.key === 'r' || event.key === 'R') restartRun();
}

function bindUi() {
  dom.startBtn.addEventListener('click', startRun);
  dom.rotateLeftBtn.addEventListener('click', () => rotateSelected(-1));
  dom.rotateRightBtn.addEventListener('click', () => rotateSelected(1));
  dom.cycleBtn.addEventListener('click', () => cycleSelected(1));
  dom.bridgeBtn.addEventListener('click', toggleBridge);
  dom.lanternBtn.addEventListener('click', pulseLantern);
  dom.pauseBtn.addEventListener('click', () => pauseToggle());
  dom.restartBtn.addEventListener('click', restartRun);
  dom.resumeBtn.addEventListener('click', () => pauseToggle(false));
  dom.pauseRestartBtn.addEventListener('click', restartRun);
  dom.resultsRestartBtn.addEventListener('click', restartRun);
  renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('keydown', onKey);
  window.addEventListener('resize', resizeRenderer);
}

function init() {
  createScene();
  bindUi();
  updateHud();
  updateSelectionVisual();
  animate();
}

init();
